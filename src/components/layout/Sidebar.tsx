import React from 'react';
import { StudioTab } from '../../types';
import {
  LayoutDashboard,
  Video,
  Smile,
  Sparkles,
  FileSpreadsheet,
  Image as ImageIcon,
  Database,
  Code2,
  ChevronRight,
  Flame,
  ArrowUpRight,
} from 'lucide-react';

interface SidebarProps {
  currentTab: StudioTab;
  onSelectTab: (tab: StudioTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  const navSections = [
    {
      group: 'MAIN DASHBOARD',
      items: [
        {
          id: 'overview' as StudioTab,
          label: 'Overview & Hub',
          icon: LayoutDashboard,
          badge: 'Home',
        },
      ],
    },
    {
      group: 'MEDIA & VIDEO STUDIO',
      items: [
        {
          id: 'video-processor' as StudioTab,
          label: 'YouTube & Shorts Processor',
          icon: Video,
          badge: 'yt-dlp',
        },
        {
          id: 'face-swap-filter' as StudioTab,
          label: 'Face Swap & Cartoon Styler',
          icon: Smile,
          badge: 'Filters',
        },
        {
          id: 'story-to-cartoon' as StudioTab,
          label: 'Story-to-Cartoon AI Video',
          icon: Sparkles,
          badge: 'Gemini AI',
          isHot: true,
        },
      ],
    },
    {
      group: 'CATALOG & AD DESIGN',
      items: [
        {
          id: 'pdf-catalog' as StudioTab,
          label: 'PDF Catalog Generator',
          icon: FileSpreadsheet,
          badge: 'jsPDF',
        },
        {
          id: 'ad-banner-maker' as StudioTab,
          label: 'Ad Banner & Poster Maker',
          icon: ImageIcon,
          badge: 'Canvas',
        },
      ],
    },
    {
      group: 'ARCHITECTURE & DATA',
      items: [
        {
          id: 'neon-db' as StudioTab,
          label: 'Neon PostgreSQL Schema',
          icon: Database,
          badge: 'SQL & Drizzle',
        },
        {
          id: 'setup-guide' as StudioTab,
          label: 'Tech Stack & Setup Guide',
          icon: Code2,
          badge: 'Next.js & Py',
        },
      ],
    },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-slate-800 bg-slate-950/70 p-4 flex flex-col justify-between hidden lg:flex select-none">
      <div className="space-y-6">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1.5">
            <h3 className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              {section.group}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600/90 to-purple-600/90 text-white shadow-md shadow-indigo-600/20'
                        : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon
                        className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${
                          isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {item.isHot && !isActive && (
                        <Flame className="h-3 w-3 text-amber-400 animate-pulse" />
                      )}
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium tracking-tight ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-900 text-slate-400 border border-slate-800'
                        }`}
                      >
                        {item.badge}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Quick Help Card */}
      <div className="rounded-2xl border border-indigo-950/60 bg-gradient-to-b from-indigo-950/30 to-slate-900/60 p-3.5 text-left">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-indigo-300">Unified Studio Hub</span>
          <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
          All-in-one suite combining video download & processing, cartoon synthesis, PDF catalog exports & ad generation.
        </p>
        <button
          onClick={() => onSelectTab('setup-guide')}
          className="flex w-full items-center justify-center gap-1 rounded-lg bg-indigo-600/20 py-1.5 text-[11px] font-medium text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30 transition-colors"
        >
          View System Architecture <ArrowUpRight className="h-3 w-3" />
        </button>
      </div>
    </aside>
  );
};
