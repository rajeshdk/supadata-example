'use client';

import React from 'react';
import { Bot, User, Copy, Check } from 'lucide-react';
import type { AgentMessage } from '@/lib/agent/types';
import { ToolCallCard } from './ToolCallCard';

interface ChatMessageProps {
  message: AgentMessage;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /**
   * Simple markdown renderer for AI responses:
   * Handles headers, bold text, bullet points, numbered lists, links, inline code and code blocks.
   */
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');

    return lines.map((line, idx) => {
      // Heading 3
      if (line.startsWith('### ')) {
        return (
          <h3 key={idx} className="mt-4 mb-1.5 text-base font-bold text-white tracking-tight">
            {line.replace('### ', '')}
          </h3>
        );
      }
      // Heading 4
      if (line.startsWith('#### ')) {
        return (
          <h4 key={idx} className="mt-3 mb-1 text-sm font-semibold text-indigo-300">
            {line.replace('#### ', '')}
          </h4>
        );
      }
      // Heading 2
      if (line.startsWith('## ')) {
        return (
          <h2 key={idx} className="mt-4 mb-2 text-lg font-bold text-white tracking-tight border-b border-slate-800 pb-1">
            {line.replace('## ', '')}
          </h2>
        );
      }
      // Bullet list item
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const itemText = line.substring(2);
        return (
          <li key={idx} className="ml-4 list-disc text-slate-300 my-1 leading-relaxed">
            {renderInlineMarkdown(itemText)}
          </li>
        );
      }
      // Numbered list item
      const numMatch = line.match(/^(\d+)\.\s+(.*)/);
      if (numMatch) {
        return (
          <li key={idx} className="ml-4 list-decimal text-slate-300 my-1 leading-relaxed">
            {renderInlineMarkdown(numMatch[2])}
          </li>
        );
      }
      // Empty line
      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }
      // Standard paragraph
      return (
        <p key={idx} className="my-1.5 text-slate-300 leading-relaxed">
          {renderInlineMarkdown(line)}
        </p>
      );
    });
  };

  /**
   * Parses bold, inline code, and links within a line.
   */
  const renderInlineMarkdown = (text: string) => {
    // Regex for: links [text](url), bold **text**, and inline code `code`
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let keyIdx = 0;

    const regex = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Text before match
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      if (match[2] && match[3]) {
        // Markdown Link
        parts.push(
          <a
            key={keyIdx++}
            href={match[3]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 underline decoration-indigo-500/50 hover:text-indigo-300 font-medium transition-colors"
          >
            {match[2]}
          </a>
        );
      } else if (match[4]) {
        // Bold
        parts.push(
          <strong key={keyIdx++} className="font-semibold text-white">
            {match[4]}
          </strong>
        );
      } else if (match[5]) {
        // Inline code
        parts.push(
          <code
            key={keyIdx++}
            className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[11px] text-indigo-300 border border-slate-700/50"
          >
            {match[5]}
          </code>
        );
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <div
      className={`group flex w-full gap-3 py-4 transition-colors ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 p-0.5 shadow-md shadow-indigo-500/20">
          <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
            <Bot className="h-4 w-4 text-indigo-400" />
          </div>
        </div>
      )}

      <div
        className={`relative max-w-[85%] sm:max-w-3xl rounded-2xl px-4 py-3.5 shadow-sm text-sm ${
          isUser
            ? 'bg-indigo-600 text-white rounded-tr-sm'
            : 'border border-slate-800 bg-slate-900/80 rounded-tl-sm text-slate-200'
        }`}
      >
        {/* Render tool executions if present */}
        {!isUser && message.toolCalls && message.toolCalls.length > 0 && (
          <div className="mb-3 space-y-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span>Tool Operations Executed:</span>
            </div>
            {message.toolCalls.map((toolCall) => (
              <ToolCallCard key={toolCall.id} toolCall={toolCall} />
            ))}
          </div>
        )}

        {/* Message Text Content */}
        <div className="prose prose-invert prose-sm max-w-none">
          {renderFormattedContent(message.content)}
        </div>

        {/* Action bar on hover */}
        {!isUser && (
          <div className="mt-2 flex items-center justify-between border-t border-slate-800/60 pt-2 text-xs text-slate-500">
            <span className="text-[10px]">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
            >
              {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-800 border border-slate-700">
          <User className="h-4 w-4 text-slate-300" />
        </div>
      )}
    </div>
  );
}
