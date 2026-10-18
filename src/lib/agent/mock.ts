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
    const videoUrl = videoUrlMatch ? videoUrlMatch[0] : 'https://www.youtube.com/watch?v=bvy_lPzYgcs';

    toolCalls.push({
      id: `call_${Math.random().toString(36).substring(2, 9)}`,
      name: 'get_transcript',
      displayName: 'Video Transcript',
      arguments: {
        url: videoUrl,
        lang: 'en',
        text: true,
      },
      status: 'success',
      executionTimeMs: 342,
      timestamp: new Date().toISOString(),
      result: {
        success: true,
        data: {
          url: videoUrl,
          language: 'en',
          availableLanguages: ['en'],
          fullText:
            "What is an AI agent? In computer science, an agent is an autonomous entity that observes its environment through sensors and takes actions using actuators to achieve goals. Unlike a basic LLM prompt that just produces text, an agent operates in an iterative loop: perceive, reason, call tools, and adapt. There are 7 core agent archetypes: 1. Simple Reflex Agents which respond directly to inputs based on predefined rules; 2. Model-Based Reflex Agents that maintain internal state to handle partial observability; 3. Goal-Based Agents that plan actions toward an explicit outcome; 4. Utility-Based Agents that weigh trade-offs and score choices; 5. Learning Agents that improve from past experience; 6. Multi-Agent Systems where specialized agents collaborate; and 7. Autonomous Foundation Model Agents that combine LLMs with tool execution like web scrapers and code interpreters...",
          chunkCount: 24,
        },
      },
    });

    content = `### Video Summary: "What is an AI Agent? 7 Types Explained"

I retrieved and processed the transcript for [${videoUrl}](${videoUrl}) using the **Supadata SDK** (\`supadata.transcript\`).

#### Core Definition:
An AI Agent is an autonomous entity that perceives its environment, reasons about goals, and executes actions using tools (actuators) rather than just predicting the next token.

#### Key Takeaways:
1. **The Agent Loop**: Modern agents rely on an iterative execution loop: **Perceive → Reason → Call Tools → Evaluate Output**.
2. **The 7 Agent Architectures**:
   - **Simple Reflex**: Rule-based immediate responses.
   - **Model-Based**: Keeps track of state when information is incomplete.
   - **Goal-Based**: Backward-chains from a desired outcome.
   - **Utility-Based**: Evaluates multiple paths to optimize reward.
   - **Learning Agent**: Continuously refines its policy from feedback.
   - **Multi-Agent Systems**: Modular agents collaborating (e.g., researcher + coder + reviewer).
   - **Foundation Model Agents**: LLMs equipped with external tools (like Supadata for web and video scraping).
3. **Tool Execution is Essential**: Without external APIs and data providers, agents cannot inspect live media, search video platforms, or scrape web documentation.

*Tip: Connect your live \`SUPADATA_API_KEY\` and \`OPENAI_API_KEY\` in \`.env.local\` to process any live public video in real-time!*`;
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
              id: 'bvy_lPzYgcs',
              title: 'What is an AI Agent? 7 types explained',
              description: 'A comprehensive visual breakdown of 7 types of AI agents, tool use, and multi-agent systems.',
              thumbnail: 'https://i.ytimg.com/vi/bvy_lPzYgcs/hqdefault.jpg',
              duration: 345,
              viewCount: 428000,
              uploadDate: '2024-03-12',
              channel: { id: 'UCsBjURrPoezykLs9EqgamOA', name: 'Fireship' },
            },
            {
              type: 'video',
              id: 'zjkBMFhNj_g',
              title: '[1hr Talk] Intro to Large Language Models',
              description: 'A 1-hour busy person introduction to Large Language Models, fine-tuning, tools, and autonomous agents.',
              thumbnail: 'https://i.ytimg.com/vi/zjkBMFhNj_g/hqdefault.jpg',
              duration: 3600,
              viewCount: 3820000,
              uploadDate: '2023-11-22',
              channel: { id: 'UCXUPKJOtpnbPau4yK8T6_2A', name: 'Andrej Karpathy' },
            },
          ],
        },
      },
    });

    content = `### YouTube Search Results for "${searchQuery}"

Found relevant videos using **Supadata YouTube Search** (\`supadata.youtube.search\`):

1. **What is an AI Agent? 7 types explained**
   - **Channel**: Fireship | **Views**: 428K | **Duration**: 5:45
   - [Watch Video](https://www.youtube.com/watch?v=bvy_lPzYgcs)
2. **[1hr Talk] Intro to Large Language Models**
   - **Channel**: Andrej Karpathy | **Views**: 3.82M | **Duration**: 1:00:00
   - [Watch Video](https://www.youtube.com/watch?v=zjkBMFhNj_g)

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
