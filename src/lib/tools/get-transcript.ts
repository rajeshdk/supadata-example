import { z } from 'zod';
import { getSupadataClient, pollTranscriptJob } from '@/lib/supadata/client';
import { formatSupadataError } from '@/lib/supadata/errors';
import type { SupaToolResult, NormalizedTranscript } from '@/lib/supadata/types';

export const getTranscriptSchema = z.object({
  url: z
    .string()
    .url('A valid video or audio URL is required')
    .describe('The public URL of the video or media (YouTube, TikTok, Instagram, Twitter/X, or audio URL).'),
  lang: z
    .string()
    .optional()
    .describe('Optional 2-letter language code (e.g., "en", "es", "fr", "de"). Defaults to native language.'),
  text: z
    .boolean()
    .default(true)
    .describe('Whether to return plain continuous text (recommended for AI prompts) instead of timestamped chunks.'),
  textOnly: z
    .boolean()
    .optional()
    .describe('Alias for text parameter (deprecated; prefer "text").'),
  mode: z
    .enum(['native', 'auto', 'generate'])
    .optional()
    .describe('Transcript generation mode. "native" (only original captions), "auto" (default, automatic fallback), or "generate" (force AI transcription).'),
});

export type GetTranscriptParams = z.infer<typeof getTranscriptSchema>;

/**
 * Tool: Fetches video transcripts using the official Supadata SDK.
 * Supports YouTube, TikTok, Instagram, and Twitter media URLs.
 */
export async function executeGetTranscript(
  params: GetTranscriptParams
): Promise<SupaToolResult<NormalizedTranscript>> {
  const startTime = Date.now();

  try {
    const validated = getTranscriptSchema.parse(params);
    const client = getSupadataClient();
    const usePlainText = validated.text ?? validated.textOnly ?? true;

    const response = await client.transcript({
      url: validated.url,
      lang: validated.lang,
      text: usePlainText,
      mode: validated.mode,
    });

    let rawTranscript;

    if ('jobId' in response) {
      // Async job was returned for long media; poll until completion
      rawTranscript = await pollTranscriptJob(client, response.jobId, {
        maxAttempts: 15,
        intervalMs: 2000,
      });
    } else {
      rawTranscript = response;
    }

    // Format content into continuous string and chunk count
    const isString = typeof rawTranscript.content === 'string';
    const fullText = isString
      ? (rawTranscript.content as string)
      : Array.isArray(rawTranscript.content)
      ? rawTranscript.content.map((c) => c.text).join(' ')
      : '';

    const chunks = Array.isArray(rawTranscript.content) ? rawTranscript.content : undefined;

    const normalized: NormalizedTranscript = {
      url: validated.url,
      language: rawTranscript.lang || validated.lang || 'auto',
      availableLanguages: rawTranscript.availableLangs || [],
      fullText,
      chunkCount: chunks ? chunks.length : 1,
      chunks: chunks ? chunks.slice(0, 100) : undefined, // limit chunks to prevent massive token bloat
    };

    return {
      success: true,
      data: normalized,
      metadata: {
        toolName: 'get_transcript',
        executionTimeMs: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    const formattedError = formatSupadataError(error);
    return {
      success: false,
      error: formattedError,
      metadata: {
        toolName: 'get_transcript',
        executionTimeMs: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      },
    };
  }
}
