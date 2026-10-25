import React from 'react';
import { StudioTab } from '../../types';
import { 
  Sparkles, 
  Layers, 
  Film, 
  FileText, 
  Palette, 
  Database, 
  BookOpen, 
  Zap,
  Activity
} from 'lucide-react';

interface HeaderProps {
  currentTab: StudioTab;
  onSelectTab: (tab: StudioTab) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onSelectTab }) => {
  const getTabLabel = (tab: StudioTab) => {
    switch (tab) {
      case 'overview':
        return 'Dashboard Overview';
      case 'video-processor':
        return 'YouTube & Shorts Processor';
      case 'face-swap-filter':
        return 'Face Swap & Cartoon Styler';
      case 'story-to-cartoon':
        return 'Story-to-Cartoon AI Studio';
      case 'pdf-catalog':
        return 'PDF Catalog Generator';
      case 'ad-banner-maker':
        return 'Ad Banner & Social Poster';
      case 'neon-db':
        return 'Neon PostgreSQL Schema';
      case 'setup-guide':
        return 'Architecture & Setup Guide';
      default:
        return 'OmniStudio AI';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Brand & Active Breadcrumb */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-lg shadow-indigo-500/25">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white">
                OmniStudio<span className="text-indigo-400">.AI</span>
              </span>
              <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/20">
                PRO STUDIO
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Content Creation & Marketing Engine
            </p>
          </div>
        </div>

        {/* Center Breadcrumb */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <span className="text-slate-500">Active Module:</span>
          <span className="font-medium text-indigo-300 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            {getTabLabel(currentTab)}
          </span>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => onSelectTab('setup-guide')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
            title="View Setup & Architecture Docs"
          >
            <BookOpen className="h-3.5 w-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Setup Docs</span>
          </button>

          <button
            onClick={() => onSelectTab('neon-db')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
            title="Neon PostgreSQL Schema"
          >
            <Database className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Neon DB</span>
          </button>

          <div className="h-6 w-px bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs">
            <Activity className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-slate-400">AI Engine:</span>
            <span className="text-emerald-400 font-medium">Ready</span>
          </div>
        </div>
      </div>
    </header>
  );
};
