import { v4 as uuidv4 } from '@/lib/utils';
import type { AgentMessage, ToolExecutionRecord } from './types';

/**
 * Generates high-fidelity simulated responses for local testing and zero-credential demos.
 */
export async function runMockAgentResponse(
  userQuery: string
): Promise<AgentMessage> {
  const queryLower = userQuery.toLowerCase();
  const toolCalls: ToolExecutionRecord[] = [];
  let content = '';

  // Simulate network latency for realism
  await new Promise((r) => setTimeout(r, 450));

  // Detect YouTube URL
  if (userQuery.includes('youtube.com') || userQuery.includes('youtu.be')) {
    const videoUrlMatch = userQuery.match(/https?:\/\/[^\s]+/);
    const videoUrl = videoUrlMatch ? videoUrlMatch[0] : 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

    toolCalls.push({
      id: `call_${Math.random().toString(36).substring(2, 9)}`,
      name: 'get_transcript',
      displayName: 'Video Transcript',
      arguments: {
        url: videoUrl,
        lang: 'en',
        textOnly: true,
      },
      status: 'success',
      executionTimeMs: 380,
      timestamp: new Date().toISOString(),
      result: {
        success: true,
        data: {
          url: videoUrl,
          language: 'en',
          availableLanguages: ['en', 'es', 'de'],
          fullText:
            "Welcome everyone. Today we are exploring how AI agents interact with external APIs using tools. Using Supadata, an AI agent can reliably extract YouTube transcripts in seconds, parse video chapters, and analyze multi-speaker discussions without scraping hurdles. Next, let's look at how function calling hooks into this pipeline to generate structured summaries...",
          chunkCount: 12,
        },
      },
    });

    content = `### Video Summary & Key Takeaways

I retrieved and analyzed the transcript for [${videoUrl}](${videoUrl}) using the **Supadata SDK** (\`supadata.transcript\`).

#### Key Insights:
1. **Agent Tool Integration**: Modern AI agents rely on specialized data providers like Supadata to bridge the gap between unstructured social media/video content and LLMs.
2. **Clean Transcript Ingestion**: Instead of brittle browser scraping, the SDK extracts clean transcripts with language selection and optional timestamped chunks.
3. **Structured Tool Pipeline**: Incorporating function calling allows the model to autonomously decide when to fetch video context based on user prompts.

*Tip: Add your live \`SUPADATA_API_KEY\` and \`OPENAI_API_KEY\` in \`.env.local\` to process any real-time public video!*`;
  }
  // Detect Web URL
  else if (userQuery.match(/https?:\/\/[^\s]+/)) {
    const webUrlMatch = userQuery.match(/https?:\/\/[^\s]+/);
    const webUrl = webUrlMatch ? webUrlMatch[0] : 'https://supadata.ai';

    toolCalls.push({
      id: `call_${Math.random().toString(36).substring(2, 9)}`,
      name: 'scrape_webpage',
      displayName: 'Web Scraper to Markdown',
      arguments: {
        url: webUrl,
      },
      status: 'success',
      executionTimeMs: 420,
      timestamp: new Date().toISOString(),
      result: {
        success: true,
        data: {
          url: webUrl,
          title: 'Supadata — Web & Video Scraping API for AI',
          description: 'Turn videos and web pages into clean transcripts, metadata, and structured JSON.',
          markdown: '# Supadata API Documentation\n\nSupadata provides fast, reliable scraping APIs for modern AI agents. Features include YouTube transcript extraction, web-to-markdown conversion, and social media metadata retrieval.',
          characterCount: 1450,
          extractedLinks: ['https://supadata.ai/pricing', 'https://supadata.ai/documentation'],
        },
      },
    });

    content = `### Web Page Analysis

I scraped [${webUrl}](${webUrl}) using the **Supadata Web Scraper API** (\`supadata.web.scrape\`) and converted the page to Markdown.

#### Summary:
- **Title**: Supadata — Web & Video Scraping API for AI
- **Content Highlights**: Supadata enables developers and AI agents to turn public web pages, articles, and video URLs into clean, structured Markdown and JSON.
- **Key Feature**: Markdown conversion strips unnecessary script/style tags, optimizing context window usage for LLMs.

Would you like me to extract specific links or drill deeper into any section?`;
  }
  // Detect YouTube Search intent
  else if (queryLower.includes('search') || queryLower.includes('find video') || queryLower.includes('tutorials')) {
    const searchQuery = userQuery.replace(/search|find videos|tutorials for|about/gi, '').trim() || 'AI agent tutorials';

    toolCalls.push({
      id: `call_${Math.random().toString(36).substring(2, 9)}`,
      name: 'search_youtube',
      displayName: 'YouTube Search',
      arguments: {
        query: searchQuery,
        type: 'video',
        sortBy: 'relevance',
        limit: 3,
      },
      status: 'success',
      executionTimeMs: 310,
      timestamp: new Date().toISOString(),
      result: {
        success: true,
        data: {
          query: searchQuery,
          totalResults: 120,
          results: [
            {
              type: 'video',
              id: 'dQw4w9WgXcQ',
              title: `Building Autonomous AI Agents with Tools (${searchQuery})`,
              description: 'A deep dive into tool-calling architectures and web extraction pipelines.',
              thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80',
              duration: 840,
              viewCount: 45200,
              uploadDate: '2024-11-01',
              channel: { id: 'ch_1', name: 'AI Builders' },
            },
            {
              type: 'video',
              id: 'xvFZjo5PgG0',
              title: `Next.js 15 & AI SDK Full Course`,
              description: 'Learn how to build production-ready agent interfaces with streaming UI.',
              thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80',
              duration: 1250,
              viewCount: 89300,
              uploadDate: '2024-12-15',
              channel: { id: 'ch_2', name: 'Code Mastery' },
            },
          ],
        },
      },
    });

    content = `### YouTube Search Results for "${searchQuery}"

Found relevant videos using **Supadata YouTube Search** (\`supadata.youtube.search\`):

1. **Building Autonomous AI Agents with Tools**
   - **Channel**: AI Builders | **Views**: 45.2k | **Duration**: 14 min
   - [Watch Video](https://www.youtube.com/watch?v=dQw4w9WgXcQ)
2. **Next.js 15 & AI SDK Full Course**
   - **Channel**: Code Mastery | **Views**: 89.3k | **Duration**: 20 min
   - [Watch Video](https://www.youtube.com/watch?v=xvFZjo5PgG0)

Would you like me to fetch the full transcript or extract key takeaways from one of these videos?`;
  }
  // Default general assistance
  else {
    content = `Hello! I am **Supa Agent**, an AI assistant with real-time access to the web and social video platforms via the **Supadata SDK** (\`@supadata/js\`).

Here are some things I can do for you:
- **Summarize Videos**: Send any YouTube, TikTok, or Instagram link, and I will fetch its transcript with \`get_transcript\`.
- **Scrape & Read Websites**: Provide any article or documentation URL, and I will parse it into clean Markdown with \`scrape_webpage\`.
- **Search Content**: Ask me to search YouTube for videos, playlists, or channels with \`search_youtube\`.
- **Social Media Insights**: Give me a post URL to inspect view counts, likes, and creator metadata with \`get_metadata\`.

Try pasting a video link or choosing one of the prompt suggestions below!`;
  }

  return {
    id: uuidv4(),
    role: 'assistant',
    content,
    toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
    timestamp: new Date().toISOString(),
  };
}
