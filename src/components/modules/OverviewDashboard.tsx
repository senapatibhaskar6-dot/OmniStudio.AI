import React from 'react';
import { StudioTab } from '../../types';
import {
  Video,
  Smile,
  Sparkles,
  FileSpreadsheet,
  Image as ImageIcon,
  Database,
  ArrowRight,
  Play,
  Download,
  Scissors,
  Wand2,
  FileText,
  CheckCircle2,
  Layers,
  Zap,
} from 'lucide-react';

interface OverviewProps {
  onSelectTab: (tab: StudioTab) => void;
}

export const OverviewDashboard: React.FC<OverviewProps> = ({ onSelectTab }) => {
  const modules = [
    {
      tab: 'video-processor' as StudioTab,
      title: 'YouTube & Shorts Processor',
      subtitle: 'yt-dlp Engine & Media Toolchain',
      description:
        'Download YouTube videos, Shorts, and TikTok reels. Trim clips, crop between 16:9 and 9:16 vertical, adjust speed, strip or replace audio, and burn subtitles.',
      icon: Video,
      color: 'from-blue-600 to-indigo-600',
      badge: 'Video Studio',
      actions: ['Download Shorts', 'Trim Video', 'Aspect Ratio 9:16', 'Extract MP3'],
      stat: '4K / 1080p Support',
    },
    {
      tab: 'face-swap-filter' as StudioTab,
      title: 'Face Swap & Cartoon Styler',
      subtitle: 'Computer Vision & Artistic Shaders',
      description:
        'Interactive split-slider comparison tool. Swap faces between source portraits and target video frames. Apply Ghibli anime, Pixar 3D, and cel-shaded comic filters.',
      icon: Smile,
      color: 'from-purple-600 to-pink-600',
      badge: 'Vision FX',
      actions: ['Face Replacement', 'Anime Filter', 'Pixar 3D Shader', 'Interactive Split-Slider'],
      stat: 'Real-time Shaders',
    },
    {
      tab: 'story-to-cartoon' as StudioTab,
      title: 'Story-to-Cartoon AI Video',
      subtitle: 'Gemini 3.8 Flash Scriptwriter & TTS',
      description:
        'Transform any text plot or script into a multi-scene animated cartoon. Automatically designs storyboards, generates visual prompts, provides TTS voiceovers, and assembles the final video.',
      icon: Sparkles,
      color: 'from-amber-500 to-rose-600',
      badge: 'AI Animation',
      actions: ['Prompt-to-Script', 'Visual Storyboard', 'Voiceover TTS', 'Assembled Video Player'],
      stat: 'Full Animation Engine',
    },
    {
      tab: 'pdf-catalog' as StudioTab,
      title: 'Professional PDF Catalog',
      subtitle: 'Automated Product Publishing',
      description:
        'Fill in product details, pricing, SKUs, and images to generate and download a clean, high-resolution PDF catalog. Customize brand colors, logo, and grid or luxury list layouts.',
      icon: FileSpreadsheet,
      color: 'from-emerald-600 to-teal-600',
      badge: 'E-Commerce',
      actions: ['SKU Management', 'Brand Theming', 'Grid / List Layouts', 'One-Click PDF Export'],
      stat: 'Ready for Print & Web',
    },
    {
      tab: 'ad-banner-maker' as StudioTab,
      title: 'Ad Banner & Social Poster Maker',
      subtitle: 'Marketing Graphics Studio',
      description:
        'Design social media promotional graphics and ad banners in seconds. Choose from Instagram, YouTube, TikTok, and Facebook dimensions. Add custom headlines, CTAs, badges, and export PNG.',
      icon: ImageIcon,
      color: 'from-pink-600 to-violet-600',
      badge: 'Ad Studio',
      actions: ['Multi-Ratio Presets', 'AI Ad Copy', 'Promotional Badges', 'Instant PNG Export'],
      stat: 'High-Res 2x Retina',
    },
    {
      tab: 'neon-db' as StudioTab,
      title: 'Neon PostgreSQL Architecture',
      subtitle: 'Serverless Relational Data Model',
      description:
        'Complete Neon PostgreSQL production configuration template. Includes SQL migrations, Drizzle ORM models, indexes, connection pools, and live schema test runners.',
      icon: Database,
      color: 'from-cyan-600 to-blue-700',
      badge: 'Database',
      actions: ['SQL DDL Schema', 'Drizzle ORM Model', 'Connection Templates', 'Mock Query Runner'],
      stat: 'Serverless Postgres',
    },
  ];

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 p-6 sm:p-10 shadow-2xl">
        <div className="absolute -right-16 -top-16 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -left-16 -bottom-16 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
            <Zap className="h-3.5 w-3.5 text-indigo-400" />
            Unified Creator & Marketing Infrastructure
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Create, Stylize & Publish Content{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              in One Studio
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            OmniStudio AI combines media processing, face-swap & cartoon stylization,
            AI story-to-animation synthesis, instant PDF catalog publishing, and ad graphic design
            backed by high-performance Neon PostgreSQL architecture.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onSelectTab('story-to-cartoon')}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:brightness-110 transition-all cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              Launch Story-to-Cartoon AI
            </button>
            <button
              onClick={() => onSelectTab('video-processor')}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-3 text-xs sm:text-sm font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-all cursor-pointer"
            >
              <Video className="h-4 w-4 text-blue-400" />
              YouTube & Shorts Downloader
            </button>
            <button
              onClick={() => onSelectTab('pdf-catalog')}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-3 text-xs sm:text-sm font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-all cursor-pointer"
            >
              <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
              Create PDF Catalog
            </button>
          </div>
        </div>

        {/* Quick Highlights Strip */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-800/80 pt-6">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-white">6-in-1</div>
            <div className="text-xs text-slate-400">Integrated Production Modules</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-indigo-400">Gemini 3.8</div>
            <div className="text-xs text-slate-400">AI Storyboard & Copywriting</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-emerald-400">Vector & PDF</div>
            <div className="text-xs text-slate-400">One-Click Client Download</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-cyan-400">Neon SQL</div>
            <div className="text-xs text-slate-400">Serverless Relational DB</div>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Studio Production Modules</h2>
            <p className="text-xs text-slate-400">
              Select any suite to launch the dedicated visual workflow
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.tab}
                onClick={() => onSelectTab(mod.tab)}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800/90 bg-slate-900/60 p-6 transition-all duration-300 hover:border-slate-700 hover:bg-slate-900 hover:shadow-xl hover:shadow-indigo-500/5 cursor-pointer"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${mod.color} text-white shadow-md shadow-indigo-500/20 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-slate-800/80 px-2.5 py-1 text-[11px] font-semibold text-slate-300 border border-slate-700/60">
                      {mod.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {mod.title}
                    </h3>
                    <p className="text-xs font-medium text-slate-400 mb-2">
                      {mod.subtitle}
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                      {mod.description}
                    </p>
                  </div>

                  {/* Feature chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {mod.actions.map((act, i) => (
                      <span
                        key={i}
                        className="rounded-md bg-slate-950/80 px-2 py-0.5 text-[10px] text-slate-300 border border-slate-800"
                      >
                        {act}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-800/60 pt-4">
                  <span className="text-[11px] font-medium text-slate-500">
                    {mod.stat}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-indigo-400 group-hover:translate-x-1 transition-transform">
                    Open Studio <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
