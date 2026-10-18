'use client';

import React from 'react';
import Link from 'next/link';
import { Bot, Sparkles, ExternalLink, Code2, BookOpen } from 'lucide-react';
import { siteConfig } from '@/config/site';

interface NavbarProps {
  isMockMode?: boolean;
  hasCredentials?: boolean;
  onOpenToolCatalog?: () => void;
}

export function Navbar({ isMockMode, hasCredentials, onOpenToolCatalog }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950/90">
                <Bot className="h-5 w-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                  Supa Agent
                </span>
                <span className="inline-flex items-center rounded-md bg-indigo-500/10 px-2 py-0.5 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
                  Starter Kit
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Powered by official Supadata SDK (<span className="text-indigo-400 font-mono">@supadata/js</span>)
              </p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Status Badge */}
          <div className="hidden md:flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 text-xs">
            <span
              className={`h-2 w-2 rounded-full ${
                hasCredentials
                  ? 'bg-emerald-400 animate-pulse'
                  : isMockMode
                  ? 'bg-amber-400'
                  : 'bg-slate-400'
              }`}
            />
            <span className="text-slate-300">
              {hasCredentials ? 'Live SDK Connected' : 'Demo Simulator Mode'}
            </span>
          </div>

          {/* Tool Catalog Button */}
          {onOpenToolCatalog && (
            <button
              onClick={onOpenToolCatalog}
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Code2 className="h-3.5 w-3.5 text-indigo-400" />
              <span>Agent Tools</span>
            </button>
          )}

          {/* Supadata Docs */}
          <a
            href={siteConfig.documentation}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <BookOpen className="h-3.5 w-3.5 text-cyan-400" />
            <span className="hidden sm:inline">SDK Docs</span>
            <ExternalLink className="h-3 w-3 text-slate-500" />
          </a>

          {/* GitHub Repo */}
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}
