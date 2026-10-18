export type MessageRole = 'system' | 'user' | 'assistant' | 'tool';

export interface ToolExecutionRecord {
  id: string;
  name: string;
  displayName: string;
  arguments: Record<string, unknown>;
  result?: unknown;
  status: 'running' | 'success' | 'error';
  errorMessage?: string;
  executionTimeMs?: number;
  timestamp: string;
}

export interface AgentMessage {
  id: string;
  role: MessageRole;
  content: string;
  toolCalls?: ToolExecutionRecord[];
  timestamp: string;
}

export interface ChatRequestPayload {
  messages: Array<{
    id?: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  stream?: boolean;
}

export interface ChatResponsePayload {
  message: AgentMessage;
  isMockMode?: boolean;
  modelUsed?: string;
}
