import { z } from 'zod';
import { getSupadataClient } from '@/lib/supadata/client';
import { formatSupadataError } from '@/lib/supadata/errors';
import type { SupaToolResult, YoutubeSearchResponse } from '@/lib/supadata/types';

export const searchYouTubeSchema = z.object({
  query: z.string().min(1, 'Search query cannot be empty').describe('The search query keyword or phrase.'),
  type: z
    .enum(['all', 'video', 'channel', 'playlist'])
    .default('video')
    .describe('Type of YouTube content to search for: "video", "channel", "playlist", or "all".'),
  sortBy: z
    .enum(['relevance', 'rating', 'date', 'views'])
    .default('relevance')
    .describe('Sort order of results: "relevance", "date", "views", or "rating".'),
  duration: z
    .enum(['all', 'short', 'medium', 'long'])
    .optional()
    .describe('Video duration filter: "short" (<4 min), "medium" (4-20 min), "long" (>20 min), or "all".'),
  uploadDate: z
    .enum(['all', 'hour', 'today', 'week', 'month', 'year'])
    .optional()
    .describe('Upload date filter: "today", "week", "month", "year", or "all".'),
  limit: z
    .number()
    .min(1)
    .max(50)
    .default(10)
    .describe('Maximum number of items to return (1-50, default: 10).'),
});

export type SearchYouTubeParams = z.infer<typeof searchYouTubeSchema>;

/**
 * Tool: Searches YouTube for videos, playlists, or channels with rich metadata filters
 * using the Supadata YouTube Search API.
 */
export async function executeSearchYouTube(
  params: SearchYouTubeParams
): Promise<SupaToolResult<YoutubeSearchResponse>> {
  const startTime = Date.now();

  try {
    const validated = searchYouTubeSchema.parse(params);
    const client = getSupadataClient();

    const response = await client.youtube.search({
      query: validated.query,
      type: validated.type,
      sortBy: validated.sortBy,
      duration: validated.duration,
      uploadDate: validated.uploadDate,
      limit: validated.limit,
    });

    return {
      success: true,
      data: response,
      metadata: {
        toolName: 'search_youtube',
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
        toolName: 'search_youtube',
        executionTimeMs: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      },
    };
  }
}
