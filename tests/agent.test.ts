import { describe, it, expect } from 'vitest';
import { runMockAgentResponse } from '@/lib/agent/mock';
import { AGENT_TOOLS } from '@/lib/tools/definitions';
import { SUPA_AGENT_SYSTEM_PROMPT } from '@/lib/agent/system-prompt';

describe('Agent Definitions & Mock Simulator', () => {
  it('defines 4 valid OpenAI-compatible tools', () => {
    expect(AGENT_TOOLS.length).toBe(4);
    const names = AGENT_TOOLS.map((t) => t.function.name);
    expect(names).toContain('get_transcript');
    expect(names).toContain('scrape_webpage');
    expect(names).toContain('search_youtube');
    expect(names).toContain('get_metadata');
  });

  it('system prompt includes references to all core tools', () => {
    expect(SUPA_AGENT_SYSTEM_PROMPT).toContain('get_transcript');
    expect(SUPA_AGENT_SYSTEM_PROMPT).toContain('scrape_webpage');
    expect(SUPA_AGENT_SYSTEM_PROMPT).toContain('search_youtube');
    expect(SUPA_AGENT_SYSTEM_PROMPT).toContain('get_metadata');
  });

  describe('Mock Simulator Flow', () => {
    it('simulates get_transcript when given a YouTube URL', async () => {
      const response = await runMockAgentResponse('Summarize https://www.youtube.com/watch?v=dQw4w9WgXcQ');

      expect(response.role).toBe('assistant');
      expect(response.toolCalls).toBeDefined();
      expect(response.toolCalls?.length).toBeGreaterThan(0);
      expect(response.toolCalls?.[0].name).toBe('get_transcript');
      expect(response.content).toContain('Video Summary');
    });

    it('simulates scrape_webpage when given a web URL', async () => {
      const response = await runMockAgentResponse('Scrape https://supadata.ai/documentation');

      expect(response.toolCalls?.[0].name).toBe('scrape_webpage');
      expect(response.content).toContain('Web Page');
    });

    it('simulates search_youtube when given a video search query', async () => {
      const response = await runMockAgentResponse('Search for Next.js AI agent tutorials on YouTube');

      expect(response.toolCalls?.[0].name).toBe('search_youtube');
      expect(response.content).toContain('YouTube Search Results');
    });

    it('handles general greeting without tools', async () => {
      const response = await runMockAgentResponse('Hello there!');

      expect(response.toolCalls).toBeUndefined();
      expect(response.content).toContain('Supa Agent');
    });
  });
});
