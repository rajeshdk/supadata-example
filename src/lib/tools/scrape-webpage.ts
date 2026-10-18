import { z } from 'zod';
import { getSupadataClient } from '@/lib/supadata/client';
import { formatSupadataError } from '@/lib/supadata/errors';
import type { SupaToolResult, NormalizedScrape } from '@/lib/supadata/types';

export const scrapeWebpageSchema = z.object({
  url: z
    .string()
    .url('A valid http or https web URL is required')
    .describe('The full URL of the webpage to scrape and convert into Markdown.'),
});

export type ScrapeWebpageParams = z.infer<typeof scrapeWebpageSchema>;

/**
 * Tool: Scrapes web content and converts it into clean, AI-ready Markdown
 * using the Supadata Web Scrape API.
 */
export async function executeScrapeWebpage(
  params: ScrapeWebpageParams
): Promise<SupaToolResult<NormalizedScrape>> {
  const startTime = Date.now();

  try {
    const validated = scrapeWebpageSchema.parse(params);
    const client = getSupadataClient();

    const scraped = await client.web.scrape(validated.url);

    const normalized: NormalizedScrape = {
      url: scraped.url || validated.url,
      title: scraped.name || 'Untitled Page',
      description: scraped.description || '',
      markdown: scraped.content || '',
      characterCount: scraped.countCharacters || (scraped.content ? scraped.content.length : 0),
      extractedLinks: Array.isArray(scraped.urls) ? scraped.urls.slice(0, 30) : [],
    };

    return {
      success: true,
      data: normalized,
      metadata: {
        toolName: 'scrape_webpage',
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
        toolName: 'scrape_webpage',
        executionTimeMs: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      },
    };
  }
}
