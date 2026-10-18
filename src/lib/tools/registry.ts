import { executeGetTranscript, getTranscriptSchema } from './get-transcript';
import { executeScrapeWebpage, scrapeWebpageSchema } from './scrape-webpage';
import { executeSearchYouTube, searchYouTubeSchema } from './search-youtube';
import { executeGetMetadata, getMetadataSchema } from './get-metadata';
import type { SupaToolResult } from '@/lib/supadata/types';

export interface ToolDefinitionMeta {
  name: string;
  displayName: string;
  category: 'video' | 'web' | 'social';
  description: string;
  schema: unknown;
  execute: (args: any) => Promise<SupaToolResult<any>>;
}

export const TOOL_REGISTRY: Record<string, ToolDefinitionMeta> = {
  get_transcript: {
    name: 'get_transcript',
    displayName: 'Video Transcript',
    category: 'video',
    description: 'Extract multi-platform transcripts (YouTube, TikTok, Instagram, Twitter) in text or chunks.',
    schema: getTranscriptSchema,
    execute: executeGetTranscript,
  },
  scrape_webpage: {
    name: 'scrape_webpage',
    displayName: 'Web Scraper to Markdown',
    category: 'web',
    description: 'Scrape any website and convert HTML content into AI-ready Markdown format.',
    schema: scrapeWebpageSchema,
    execute: executeScrapeWebpage,
  },
  search_youtube: {
    name: 'search_youtube',
    displayName: 'YouTube Search',
    category: 'video',
    description: 'Search YouTube for videos, playlists, or channels with duration and date filters.',
    schema: searchYouTubeSchema,
    execute: executeSearchYouTube,
  },
  get_metadata: {
    name: 'get_metadata',
    displayName: 'Social Media Metadata',
    category: 'social',
    description: 'Extract structured engagement stats, authors, and media information from social platforms.',
    schema: getMetadataSchema,
    execute: executeGetMetadata,
  },
};

/**
 * Dispatches and executes an agent tool by name with parsed or serialized arguments.
 */
export async function executeToolCall(
  name: string,
  args: unknown
): Promise<SupaToolResult<any>> {
  const tool = TOOL_REGISTRY[name];

  if (!tool) {
    return {
      success: false,
      error: {
        code: 'UNKNOWN_TOOL',
        message: `Tool "${name}" is not recognized by the Supadata Agent registry.`,
        suggestedAction: `Available tools are: ${Object.keys(TOOL_REGISTRY).join(', ')}`,
      },
      metadata: {
        toolName: name,
        executionTimeMs: 0,
        timestamp: new Date().toISOString(),
      },
    };
  }

  try {
    let parsedArgs = args;
    if (typeof args === 'string') {
      try {
        parsedArgs = JSON.parse(args);
      } catch (e) {
        return {
          success: false,
          error: {
            code: 'INVALID_JSON_ARGS',
            message: `Failed to parse tool call arguments as JSON: ${String(e)}`,
            suggestedAction: 'Ensure arguments passed to the tool are valid JSON.',
          },
          metadata: {
            toolName: name,
            executionTimeMs: 0,
            timestamp: new Date().toISOString(),
          },
        };
      }
    }

    return await tool.execute(parsedArgs);
  } catch (err) {
    return {
      success: false,
      error: {
        code: 'EXECUTION_FAILED',
        message: err instanceof Error ? err.message : String(err),
        suggestedAction: 'Check tool parameters and service status.',
      },
      metadata: {
        toolName: name,
        executionTimeMs: 0,
        timestamp: new Date().toISOString(),
      },
    };
  }
}
