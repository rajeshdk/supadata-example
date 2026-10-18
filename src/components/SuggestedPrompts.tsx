'use client';

import React from 'react';
import { Video, Globe, Search, Share2, Sparkles } from 'lucide-react';

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

export const SUGGESTIONS = [
  {
    icon: Video,
    category: 'Video Transcript',
    label: 'Summarize YouTube Video',
    prompt: 'Summarize the key takeaways and main talking points of this video: https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    color: 'from-rose-500/20 to-orange-500/20 text-rose-400 border-rose-500/30',
  },
  {
    icon: Globe,
    category: 'Web to Markdown',
    label: 'Scrape Web Documentation',
    prompt: 'Scrape https://supadata.ai and provide a clear overview of the capabilities provided by the Supadata API.',
    color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
  },
  {
    icon: Search,
    category: 'YouTube Search',
    label: 'Search AI Agent Tutorials',
    prompt: 'Search YouTube for top tutorials on building AI agents in TypeScript with tool calling and compare the top results.',
    color: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30',
  },
  {
    icon: Share2,
    category: 'Social Intelligence',
    label: 'Inspect Media Metadata',
    prompt: 'Extract metadata, view count, author details, and engagement stats for https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    color: 'from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30',
  },
];

export function SuggestedPrompts({ onSelectPrompt }: SuggestedPromptsProps) {
  return (
    <div className="w-full max-w-4xl px-4 py-8">
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300 mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Autonomous AI Agent Powered by Supadata SDK</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          What would you like to explore today?
        </h2>
        <p className="mt-2 text-sm text-slate-400 max-w-lg mx-auto">
          Choose a starter prompt or paste any video link or website URL to watch the agent execute live Supadata SDK tools.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {SUGGESTIONS.map((s, idx) => {
          const Icon = s.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectPrompt(s.prompt)}
              className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-left transition-all hover:border-slate-700 hover:bg-slate-800/80 group"
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border bg-gradient-to-br ${s.color}`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
                    {s.label}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    {s.category}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {s.prompt}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
