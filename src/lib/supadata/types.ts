import type {
  Metadata,
  Scrape,
  SiteMap,
  Transcript,
  TranscriptChunk,
  TranscriptOrJobId,
  YoutubeChannel,
  YoutubePlaylist,
  YoutubeSearchResponse,
  YoutubeSearchResult,
  YoutubeVideo,
} from '@supadata/js';

export type {
  Metadata,
  Scrape,
  SiteMap,
  Transcript,
  TranscriptChunk,
  TranscriptOrJobId,
  YoutubeChannel,
  YoutubePlaylist,
  YoutubeSearchResponse,
  YoutubeSearchResult,
  YoutubeVideo,
};

/**
 * Standardized result wrapper for all Supadata tool executions.
 */
export interface SupaToolResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: string;
    documentationUrl?: string;
    suggestedAction?: string;
  };
  metadata?: {
    toolName: string;
    executionTimeMs: number;
    cached?: boolean;
    timestamp: string;
  };
}

/**
 * Normalized transcript representation for AI consumption.
 */
export interface NormalizedTranscript {
  url: string;
  language: string;
  availableLanguages: string[];
  fullText: string;
  chunkCount: number;
  chunks?: TranscriptChunk[];
}

/**
 * Normalized web scrape representation.
 */
export interface NormalizedScrape {
  url: string;
  title: string;
  description: string;
  markdown: string;
  characterCount: number;
  extractedLinks: string[];
}
