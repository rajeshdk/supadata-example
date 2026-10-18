'use client';

import React, { useState } from 'react';
import { X, Code2, Video, Globe, Search, Share2, Copy, Check } from 'lucide-react';
import { TOOL_REGISTRY } from '@/lib/tools/registry';

interface ToolCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ToolCatalogModal({ isOpen, onClose }: ToolCatalogModalProps) {
  const [selectedToolKey, setSelectedToolKey] = useState<string>('get_transcript');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const tools = Object.values(TOOL_REGISTRY);
  const activeTool = TOOL_REGISTRY[selectedToolKey] || tools[0];

  const codeSnippets: Record<string, string> = {
    get_transcript: `import { Supadata } from '@supadata/js';

const supadata = new Supadata({
  apiKey: process.env.SUPADATA_API_KEY!,
});

// Fetch video transcript (supports YouTube, TikTok, Instagram, Twitter)
const transcript = await supadata.transcript({
  url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  lang: 'en',
  text: true, // returns clean continuous string for LLMs
  mode: 'auto',
});

console.log(transcript.content);`,

    scrape_webpage: `import { Supadata } from '@supadata/js';

const supadata = new Supadata({
  apiKey: process.env.SUPADATA_API_KEY!,
});

// Scrape any website into clean Markdown
const result = await supadata.web.scrape('https://supadata.ai');

console.log(result.name);        // Page Title
console.log(result.content);     // Clean Markdown
console.log(result.urls);        // Extracted Links`,

    search_youtube: `import { Supadata } from '@supadata/js';

const supadata = new Supadata({
  apiKey: process.env.SUPADATA_API_KEY!,
});

// Search YouTube with filters
const search = await supadata.youtube.search({
  query: 'autonomous AI agents',
  type: 'video',
  sortBy: 'relevance',
  limit: 10,
});

console.log(search.results);`,

    get_metadata: `import { Supadata } from '@supadata/js';

const supadata = new Supadata({
  apiKey: process.env.SUPADATA_API_KEY!,
});

// Extract social media metadata & stats
const metadata = await supadata.metadata({
  url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
});

console.log(metadata.stats.views);
console.log(metadata.author.displayName);`,
  };

  const currentSnippet = codeSnippets[selectedToolKey] || '';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative flex w-full max-w-4xl flex-col rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Code2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Supadata SDK Tool Registry</h3>
              <p className="text-xs text-slate-400">
                Official integrations and function-calling schemas used by this agent.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
          {/* Tool List Sidebar */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-900/40 p-3 space-y-1 overflow-y-auto">
            {tools.map((t) => {
              const isActive = t.name === selectedToolKey;
              return (
                <button
                  key={t.name}
                  onClick={() => setSelectedToolKey(t.name)}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                    isActive
                      ? 'bg-indigo-600/20 text-white border border-indigo-500/40 font-semibold'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <span className="font-mono text-[11px] truncate">{t.name}</span>
                </button>
              );
            })}
          </div>

          {/* Tool Details View */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-bold text-white">{activeTool.displayName}</h4>
                <span className="rounded bg-indigo-500/10 px-2 py-0.5 font-mono text-xs text-indigo-300 border border-indigo-500/20">
                  {activeTool.name}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                {activeTool.description}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300">
                  Official SDK TypeScript Usage:
                </span>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 rounded bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>
              <pre className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900 p-4 font-mono text-xs text-indigo-200 leading-relaxed">
                {currentSnippet}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
