import React, { useState } from 'react';
import { StudioTab } from './types';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { OverviewDashboard } from './components/modules/OverviewDashboard';
import { VideoStudio } from './components/modules/VideoStudio';
import { FaceSwapStudio } from './components/modules/FaceSwapStudio';
import { StoryToCartoonStudio } from './components/modules/StoryToCartoonStudio';
import { PdfCatalogStudio } from './components/modules/PdfCatalogStudio';
import { AdBannerStudio } from './components/modules/AdBannerStudio';
import { NeonDatabaseStudio } from './components/modules/NeonDatabaseStudio';
import { SetupGuideStudio } from './components/modules/SetupGuideStudio';
import {
  LayoutDashboard,
  Video,
  Smile,
  Sparkles,
  FileSpreadsheet,
  Image as ImageIcon,
  Database,
  Code2,
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<StudioTab>('overview');

  const mobileNavItems = [
    { id: 'overview' as StudioTab, label: 'Hub', icon: LayoutDashboard },
    { id: 'video-processor' as StudioTab, label: 'Video', icon: Video },
    { id: 'face-swap-filter' as StudioTab, label: 'Faces', icon: Smile },
    { id: 'story-to-cartoon' as StudioTab, label: 'Story AI', icon: Sparkles },
    { id: 'pdf-catalog' as StudioTab, label: 'Catalog', icon: FileSpreadsheet },
    { id: 'ad-banner-maker' as StudioTab, label: 'Ads', icon: ImageIcon },
    { id: 'neon-db' as StudioTab, label: 'Neon DB', icon: Database },
  ];

  const renderActiveModule = () => {
    switch (currentTab) {
      case 'overview':
        return <OverviewDashboard onSelectTab={setCurrentTab} />;
      case 'video-processor':
        return <VideoStudio />;
      case 'face-swap-filter':
        return <FaceSwapStudio />;
      case 'story-to-cartoon':
        return <StoryToCartoonStudio />;
      case 'pdf-catalog':
        return <PdfCatalogStudio />;
      case 'ad-banner-maker':
        return <AdBannerStudio />;
      case 'neon-db':
        return <NeonDatabaseStudio />;
      case 'setup-guide':
        return <SetupGuideStudio />;
      default:
        return <OverviewDashboard onSelectTab={setCurrentTab} />;
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-slate-950 font-sans text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <Header currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* Main Studio Body: Sidebar + Active Module Viewport */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <Sidebar currentTab={currentTab} onSelectTab={setCurrentTab} />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-8">
          {renderActiveModule()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Hidden on Desktop) */}
      <div className="fixed bottom-0 inset-x-0 z-50 flex items-center justify-around border-t border-slate-800 bg-slate-950/95 p-2 backdrop-blur-md lg:hidden">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex flex-col items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-medium transition-colors ${
                isActive ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
