'use client';

import React, { useState } from 'react';
import { KeyRound, Sparkles, X, ChevronRight, CheckCircle2 } from 'lucide-react';

interface ApiKeyBannerProps {
  hasCredentials?: boolean;
  isMockMode?: boolean;
}

export function ApiKeyBanner({ hasCredentials, isMockMode }: ApiKeyBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  if (hasCredentials) {
    return null; // All keys configured, no warning needed
  }

  return (
    <div className="relative border-b border-indigo-950/60 bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-950 px-4 py-2.5 text-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-indigo-500/10 text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
            <KeyRound className="h-3.5 w-3.5" />
          </div>
          <p className="text-slate-300">
            <span className="font-semibold text-white">Interactive Demo Mode Active:</span> To connect live Supadata API & LLM, copy{' '}
            <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-indigo-300 border border-slate-800">
              .env.example
            </code>{' '}
            to{' '}
            <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-indigo-300 border border-slate-800">
              .env.local
            </code>{' '}
            and add your keys.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://supadata.ai/r/MD74ZQ3H"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <span>Get Supadata API Key</span>
            <ChevronRight className="h-3 w-3" />
          </a>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss banner"
            className="rounded p-1 text-slate-500 hover:bg-slate-900 hover:text-slate-300 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
