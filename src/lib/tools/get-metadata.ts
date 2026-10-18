import { z } from 'zod';
import { getSupadataClient } from '@/lib/supadata/client';
import { formatSupadataError } from '@/lib/supadata/errors';
import type { SupaToolResult, Metadata } from '@/lib/supadata/types';

export const getMetadataSchema = z.object({
  url: z
    .string()
    .url('A valid media URL is required')
    .describe('The public URL of a video or social post (YouTube, TikTok, Instagram, Twitter/X).'),
});

export type GetMetadataParams = z.infer<typeof getMetadataSchema>;

/**
 * Tool: Extracts rich social video and post metadata (views, likes, shares, author info)
 * using the Supadata Metadata API.
 */
export async function executeGetMetadata(
  params: GetMetadataParams
): Promise<SupaToolResult<Metadata>> {
  const startTime = Date.now();

  try {
    const validated = getMetadataSchema.parse(params);
    const client = getSupadataClient();

    const metadata = await client.metadata({
      url: validated.url,
    });

    return {
      success: true,
      data: metadata,
      metadata: {
        toolName: 'get_metadata',
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
        toolName: 'get_metadata',
        executionTimeMs: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      },
    };
  }
}
