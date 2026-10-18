import React from 'react';
import { siteConfig } from '@/config/site';
import { Heart, Terminal, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 py-8 text-xs text-slate-500">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <span>Built for the open-source community with</span>
          <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" />
          <span>using</span>
          <a
            href={siteConfig.links.npm}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-slate-400 hover:text-indigo-400 transition-colors"
          >
            @supadata/js
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href={siteConfig.links.supadata}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-300 transition-colors"
          >
            Get Free API Key
          </a>
          <span>•</span>
          <a
            href={siteConfig.documentation}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-300 transition-colors"
          >
            SDK Documentation
          </a>
          <span>•</span>
          <span className="inline-flex items-center gap-1 text-slate-400">
            <Terminal className="h-3 w-3" />
            MIT License
          </span>
        </div>
      </div>
    </footer>
  );
}
