'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Trash2, AlertCircle, RefreshCw } from 'lucide-react';
import type { AgentMessage } from '@/lib/agent/types';
import { ChatMessage } from './ChatMessage';
import { SuggestedPrompts } from './SuggestedPrompts';
import { v4 as uuidv4 } from '@/lib/utils';

interface ChatInterfaceProps {
  onHealthUpdate?: (data: { isMockMode: boolean; hasCredentials: boolean }) => void;
}

export function ChatInterface({ onHealthUpdate }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Check health on mount to detect credentials status
  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await fetch('/api/health');
        if (res.ok) {
          const data = await res.json();
          if (onHealthUpdate) {
            onHealthUpdate({
              isMockMode: data.environment.isMockMode,
              hasCredentials: Boolean(data.sdk.configured && data.llm.configured),
            });
          }
        }
      } catch {
        // Silently continue
      }
    }
    checkHealth();
  }, [onHealthUpdate]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = input.trim();
    if (!query || isLoading) return;

    setError(null);
    setInput('');

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    const userMessage: AgentMessage = {
      id: uuidv4(),
      role: 'user',
      content: query,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || errorData.error || `Request failed with status ${response.status}`
        );
      }

      const data = await response.json();
      if (data.message) {
        setMessages((prev) => [...prev, data.message]);
      }
    } catch (err: unknown) {
      console.error('Chat error:', err);
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 180)}px`;
  };

  const handleClearChat = () => {
    if (window.confirm('Clear current chat history?')) {
      setMessages([]);
      setError(null);
    }
  };

  const handleSelectSuggestedPrompt = (prompt: string) => {
    setInput(prompt);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="flex flex-1 flex-col h-full max-w-5xl mx-auto w-full px-4 sm:px-6">
      {/* Top Toolbar */}
      {messages.length > 0 && (
        <div className="flex items-center justify-between py-2 border-b border-slate-800/60 mb-2">
          <span className="text-xs text-slate-400">
            {messages.length} message{messages.length === 1 ? '' : 's'} in session
          </span>
          <button
            onClick={handleClearChat}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear Chat</span>
          </button>
        </div>
      )}

      {/* Message History or Empty State */}
      <div className="flex-1 overflow-y-auto min-h-0 space-y-4 py-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center">
            <SuggestedPrompts onSelectPrompt={handleSelectSuggestedPrompt} />
          </div>
        ) : (
          messages.map((m) => <ChatMessage key={m.id} message={m} />)
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center gap-3 py-4 text-slate-400">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-slate-300">
                Agent reasoning & executing Supadata tools...
              </span>
              <span className="text-[10px] text-slate-400">
                Fetching video transcripts, web markdown, or metadata
              </span>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="rounded-xl border border-rose-900/60 bg-rose-950/40 p-4 text-xs text-rose-300">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-rose-200">Execution Error</p>
                <p className="mt-0.5">{error}</p>
                <button
                  onClick={() => handleSubmit()}
                  className="mt-2 inline-flex items-center gap-1 rounded bg-rose-900/60 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-rose-800 transition-colors"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Retry Request</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Bar */}
      <div className="sticky bottom-0 z-20 pb-6 pt-2 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent">
        <form
          onSubmit={handleSubmit}
          className="relative flex items-end gap-2 rounded-2xl border border-slate-800 bg-slate-900/90 p-2 shadow-2xl backdrop-blur-md focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500"
        >
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={handleTextareaInput}
            onKeyDown={handleKeyDown}
            placeholder="Ask Supa Agent anything... (e.g. summarize https://youtube.com/watch?v=... or search YouTube)"
            className="flex-1 resize-none bg-transparent px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none max-h-44"
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 transition-all"
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </form>
        <p className="mt-2 text-center text-[11px] text-slate-400">
          Press <kbd className="rounded bg-slate-800 px-1 font-mono text-[10px] text-slate-400">Enter</kbd> to send, <kbd className="rounded bg-slate-800 px-1 font-mono text-[10px] text-slate-400">Shift + Enter</kbd> for a new line.
        </p>
      </div>
    </div>
  );
}
