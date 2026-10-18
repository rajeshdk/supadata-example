'use client';

import React, { useState } from 'react';
import {
  Video,
  Globe,
  Search,
  Share2,
  ChevronDown,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Copy,
  Check,
} from 'lucide-react';
import type { ToolExecutionRecord } from '@/lib/agent/types';

interface ToolCallCardProps {
  toolCall: ToolExecutionRecord;
}

export function ToolCallCard({ toolCall }: ToolCallCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const getToolIcon = (name: string) => {
    switch (name) {
      case 'get_transcript':
        return <Video className="h-4 w-4 text-rose-400" />;
      case 'scrape_webpage':
        return <Globe className="h-4 w-4 text-emerald-400" />;
      case 'search_youtube':
        return <Search className="h-4 w-4 text-cyan-400" />;
      case 'get_metadata':
        return <Share2 className="h-4 w-4 text-amber-400" />;
      default:
        return <Clock className="h-4 w-4 text-indigo-400" />;
    }
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const payload = JSON.stringify(
      {
        tool: toolCall.name,
        arguments: toolCall.arguments,
        result: toolCall.result,
      },
      null,
      2
    );
    navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isSuccess = toolCall.status === 'success';
  const isError = toolCall.status === 'error';
  const isRunning = toolCall.status === 'running';

  return (
    <div className="my-2.5 overflow-hidden rounded-xl border border-slate-800 bg-slate-900/70 shadow-sm transition-all hover:border-slate-700">
      {/* Header Bar */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left transition-colors hover:bg-slate-800/40"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800/80 border border-slate-700/60">
            {getToolIcon(toolCall.name)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-200">
                {toolCall.displayName || toolCall.name}
              </span>
              <span className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-400 border border-slate-700/40">
                {toolCall.name}
              </span>
            </div>
            {toolCall.arguments && Object.keys(toolCall.arguments).length > 0 && (
              <p className="text-[11px] text-slate-400 truncate max-w-[280px] sm:max-w-md font-mono">
                {String(
                  (toolCall.arguments as Record<string, unknown>).url ||
                    (toolCall.arguments as Record<string, unknown>).query ||
                    JSON.stringify(toolCall.arguments)
                )}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Badge */}
          {isRunning && (
            <span className="inline-flex items-center gap-1 rounded-md bg-indigo-500/10 px-2 py-0.5 text-[11px] font-medium text-indigo-400">
              <Loader2 className="h-3 w-3 animate-spin" />
              Running
            </span>
          )}
          {isSuccess && (
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-3 w-3" />
              Success
            </span>
          )}
          {isError && (
            <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/10 px-2 py-0.5 text-[11px] font-medium text-rose-400 border border-rose-500/20">
              <AlertTriangle className="h-3 w-3" />
              Failed
            </span>
          )}

          {/* Execution Time */}
          {toolCall.executionTimeMs !== undefined && (
            <span className="hidden sm:inline-block font-mono text-[10px] text-slate-400">
              {toolCall.executionTimeMs}ms
            </span>
          )}

          <div className="text-slate-500">
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </div>
        </div>
      </button>

      {/* Accordion Content */}
      {isOpen && (
        <div className="border-t border-slate-800/80 bg-slate-950/60 p-3.5 text-xs">
          <div className="flex items-center justify-between pb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Tool Invocation Inspector
            </span>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors"
            >
              {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
          </div>

          {/* Arguments */}
          <div className="mb-3">
            <div className="text-[11px] font-medium text-slate-400 mb-1">Parameters / Arguments:</div>
            <pre className="max-h-40 overflow-auto rounded-lg border border-slate-800 bg-slate-900/90 p-2.5 font-mono text-[11px] text-slate-300">
              {JSON.stringify(toolCall.arguments, null, 2)}
            </pre>
          </div>

          {/* Results */}
          <div>
            <div className="text-[11px] font-medium text-slate-400 mb-1">
              Result from Supadata SDK:
            </div>
            <pre className="max-h-60 overflow-auto rounded-lg border border-slate-800 bg-slate-900/90 p-2.5 font-mono text-[11px] text-slate-300">
              {JSON.stringify(toolCall.result, null, 2)}
            </pre>
          </div>

          {toolCall.errorMessage && (
            <div className="mt-2.5 rounded-lg border border-rose-900/50 bg-rose-950/30 p-2 text-rose-300">
              <span className="font-semibold">Error:</span> {toolCall.errorMessage}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
