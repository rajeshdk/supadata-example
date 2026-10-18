import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { getEnv, getApiCredentialsStatus } from '@/config/env';
import { AGENT_TOOLS } from '@/lib/tools/definitions';
import { executeToolCall, TOOL_REGISTRY } from '@/lib/tools/registry';
import { SUPA_AGENT_SYSTEM_PROMPT } from './system-prompt';
import { runMockAgentResponse } from './mock';
import { v4 as uuidv4 } from '@/lib/utils';
import type { AgentMessage, ChatRequestPayload, ToolExecutionRecord } from './types';

/**
 * Executes a multi-turn conversation turn with autonomous tool execution.
 */
export async function runAgentConversation(
  payload: ChatRequestPayload
): Promise<{ message: AgentMessage; isMockMode: boolean; modelUsed: string }> {
  const credentials = getApiCredentialsStatus();
  const env = getEnv();

  const userMessages = payload.messages || [];
  const latestMessage = userMessages[userMessages.length - 1];
  const queryText = latestMessage?.content || '';

  // If mock mode is explicitly active or live keys are not provided, run mock simulation
  if (credentials.isMockMode || !credentials.hasOpenAI) {
    const mockMessage = await runMockAgentResponse(queryText);
    return {
      message: mockMessage,
      isMockMode: true,
      modelUsed: 'mock-simulator',
    };
  }

  // Initialize OpenAI client (supports OpenAI, Groq, OpenRouter, Ollama)
  const openai = new OpenAI({
    apiKey: env.OPENAI_API_KEY,
    baseURL: env.OPENAI_BASE_URL || undefined,
  });

  const model = env.OPENAI_MODEL || 'gpt-4o-mini';

  // Build the message history
  const conversationMessages: ChatCompletionMessageParam[] = [
    { role: 'system', content: SUPA_AGENT_SYSTEM_PROMPT },
    ...userMessages.map((m) => ({
      role: m.role as 'user' | 'assistant' | 'system',
      content: m.content,
    })),
  ];

  try {
    // 1. Initial LLM call with tool definitions
    const completion = await openai.chat.completions.create({
      model,
      messages: conversationMessages,
      tools: AGENT_TOOLS,
      tool_choice: 'auto',
      temperature: 0.2,
    });

    const choice = completion.choices[0];
    const initialMessage = choice.message;

    // Check if the model decided to call tools
    if (initialMessage.tool_calls && initialMessage.tool_calls.length > 0) {
      const executedToolRecords: ToolExecutionRecord[] = [];

      // Append assistant's tool-call intent to conversation history
      conversationMessages.push(initialMessage);

      // 2. Execute each requested tool call
      for (const toolCall of initialMessage.tool_calls) {
        const functionName = toolCall.function.name;
        const rawArgs = toolCall.function.arguments;
        const displayName = TOOL_REGISTRY[functionName]?.displayName || functionName;

        let parsedArgs: Record<string, unknown> = {};
        try {
          parsedArgs = JSON.parse(rawArgs);
        } catch {
          parsedArgs = { raw: rawArgs };
        }

        const startTime = Date.now();
        const toolResult = await executeToolCall(functionName, rawArgs);
        const executionTimeMs = Date.now() - startTime;

        const record: ToolExecutionRecord = {
          id: toolCall.id,
          name: functionName,
          displayName,
          arguments: parsedArgs,
          result: toolResult,
          status: toolResult.success ? 'success' : 'error',
          errorMessage: toolResult.error?.message,
          executionTimeMs,
          timestamp: new Date().toISOString(),
        };

        executedToolRecords.push(record);

        // Append tool result message
        conversationMessages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify(toolResult),
        });
      }

      // 3. Second LLM call for synthesis incorporating tool findings
      const finalCompletion = await openai.chat.completions.create({
        model,
        messages: conversationMessages,
        temperature: 0.3,
      });

      const finalContent =
        finalCompletion.choices[0]?.message?.content ||
        'I processed the request with Supadata tools, but no summary could be generated.';

      return {
        message: {
          id: uuidv4(),
          role: 'assistant',
          content: finalContent,
          toolCalls: executedToolRecords,
          timestamp: new Date().toISOString(),
        },
        isMockMode: false,
        modelUsed: model,
      };
    }

    // Direct response without tools
    return {
      message: {
        id: uuidv4(),
        role: 'assistant',
        content: initialMessage.content || '',
        timestamp: new Date().toISOString(),
      },
      isMockMode: false,
      modelUsed: model,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('Agent execution error:', errorMsg);

    return {
      message: {
        id: uuidv4(),
        role: 'assistant',
        content: `⚠️ **Agent Execution Error**: ${errorMsg}\n\nPlease check your API keys or check \`.env.local\`. You can also switch to \`MOCK_AGENT_MODE=true\` for offline simulation.`,
        timestamp: new Date().toISOString(),
      },
      isMockMode: false,
      modelUsed: model,
    };
  }
}
