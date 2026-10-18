import type { ChatCompletionTool } from 'openai/resources/chat/completions';

/**
 * Tool definitions conforming to OpenAI Chat Completions API format.
 * Enables AI models to reason and autonomously execute Supadata operations.
 */
export const AGENT_TOOLS: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'get_transcript',
      description:
        'Fetch full text transcripts and timestamped subtitles from videos (YouTube, TikTok, Instagram, Twitter/X) or audio URLs using Supadata SDK. Use this whenever the user asks to summarize, analyze, query, or extract insights from a video.',
      parameters: {
        type: 'object',
        properties: {
          url: {
            type: 'string',
            description: 'The public video or media URL (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ).',
          },
          lang: {
            type: 'string',
            description: 'Optional 2-letter language code (e.g., "en", "es", "fr"). Defaults to video native language.',
          },
          text: {
            type: 'boolean',
            description: 'Whether to return a clean continuous plain text string (recommended: true) or chunks.',
            default: true,
          },
          mode: {
            type: 'string',
            enum: ['native', 'auto', 'generate'],
            description: 'Transcript mode: "native" (captions only), "auto" (default), or "generate" (force AI transcription).',
          },
        },
        required: ['url'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'scrape_webpage',
      description:
        'Scrapes any webpage and converts its HTML into clean, structured Markdown using Supadata Web Scrape API. Use this when the user provides a website URL or asks to read/summarize documentation, articles, or blog posts.',
      parameters: {
        type: 'object',
        properties: {
          url: {
            type: 'string',
            description: 'The full URL of the webpage to scrape (e.g., https://docs.supadata.ai).',
          },
        },
        required: ['url'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'search_youtube',
      description:
        'Searches YouTube for videos, playlists, or channels with advanced filters using Supadata YouTube Search API. Use this when the user asks to find videos on a topic, discover tutorials, or locate creators.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'The search query keyword or topic.',
          },
          type: {
            type: 'string',
            enum: ['all', 'video', 'channel', 'playlist'],
            description: 'Type of content to search for. Default is "video".',
            default: 'video',
          },
          sortBy: {
            type: 'string',
            enum: ['relevance', 'rating', 'date', 'views'],
            description: 'Sort order for results.',
            default: 'relevance',
          },
          duration: {
            type: 'string',
            enum: ['all', 'short', 'medium', 'long'],
            description: 'Duration filter: short (<4m), medium (4-20m), long (>20m).',
          },
          uploadDate: {
            type: 'string',
            enum: ['all', 'hour', 'today', 'week', 'month', 'year'],
            description: 'Upload recency filter.',
          },
          limit: {
            type: 'number',
            description: 'Maximum number of items to return (1 to 20).',
            default: 10,
          },
        },
        required: ['query'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_metadata',
      description:
        'Extracts rich social media metadata (view counts, like counts, author details, duration, tags) for YouTube, TikTok, Instagram, and Twitter URLs using Supadata Metadata API.',
      parameters: {
        type: 'object',
        properties: {
          url: {
            type: 'string',
            description: 'The URL of the social media post or video.',
          },
        },
        required: ['url'],
      },
    },
  },
];
