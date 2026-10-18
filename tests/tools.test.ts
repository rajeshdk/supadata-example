import { describe, it, expect } from 'vitest';
import { getTranscriptSchema } from '@/lib/tools/get-transcript';
import { scrapeWebpageSchema } from '@/lib/tools/scrape-webpage';
import { searchYouTubeSchema } from '@/lib/tools/search-youtube';
import { getMetadataSchema } from '@/lib/tools/get-metadata';
import { executeToolCall, TOOL_REGISTRY } from '@/lib/tools/registry';

describe('Tool Validation & Dispatcher', () => {
  it('registers all 4 core Supadata agent tools', () => {
    expect(TOOL_REGISTRY).toHaveProperty('get_transcript');
    expect(TOOL_REGISTRY).toHaveProperty('scrape_webpage');
    expect(TOOL_REGISTRY).toHaveProperty('search_youtube');
    expect(TOOL_REGISTRY).toHaveProperty('get_metadata');
  });

  describe('getTranscriptSchema', () => {
    it('accepts valid YouTube URL and defaults text to true', () => {
      const parsed = getTranscriptSchema.parse({
        url: 'https://www.youtube.com/watch?v=bvy_lPzYgcs',
      });
      expect(parsed.url).toBe('https://www.youtube.com/watch?v=bvy_lPzYgcs');
      expect(parsed.text).toBe(true);
    });

    it('accepts textOnly as backwards-compatible alias', () => {
      const parsed = getTranscriptSchema.parse({
        url: 'https://www.youtube.com/watch?v=bvy_lPzYgcs',
        textOnly: false,
      });
      expect(parsed.textOnly).toBe(false);
    });

    it('rejects invalid URLs', () => {
      expect(() =>
        getTranscriptSchema.parse({
          url: 'not-a-valid-url',
        })
      ).toThrow();
    });
  });

  describe('scrapeWebpageSchema', () => {
    it('validates http and https webpage URLs', () => {
      const parsed = scrapeWebpageSchema.parse({
        url: 'https://supadata.ai/documentation',
      });
      expect(parsed.url).toBe('https://supadata.ai/documentation');
    });

    it('rejects non-URL strings', () => {
      expect(() =>
        scrapeWebpageSchema.parse({
          url: 'plain-text-string',
        })
      ).toThrow();
    });
  });

  describe('searchYouTubeSchema', () => {
    it('validates search query and sets defaults', () => {
      const parsed = searchYouTubeSchema.parse({
        query: 'Next.js AI tutorials',
      });
      expect(parsed.query).toBe('Next.js AI tutorials');
      expect(parsed.type).toBe('video');
      expect(parsed.sortBy).toBe('relevance');
      expect(parsed.limit).toBe(10);
    });

    it('rejects empty query', () => {
      expect(() =>
        searchYouTubeSchema.parse({
          query: '',
        })
      ).toThrow();
    });
  });

  describe('getMetadataSchema', () => {
    it('accepts valid social media post URL', () => {
      const parsed = getMetadataSchema.parse({
        url: 'https://twitter.com/supadata_ai/status/123456789',
      });
      expect(parsed.url).toBe('https://twitter.com/supadata_ai/status/123456789');
    });
  });

  describe('executeToolCall Dispatcher', () => {
    it('returns error for unknown tool names', async () => {
      const result = await executeToolCall('unsupported_tool', {});
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('UNKNOWN_TOOL');
    });

    it('handles invalid JSON string arguments gracefully', async () => {
      const result = await executeToolCall('get_transcript', '{ bad json ...');
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('INVALID_JSON_ARGS');
    });
  });
});
