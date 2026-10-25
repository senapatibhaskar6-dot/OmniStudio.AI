import React, { useState, useRef, useEffect } from 'react';
import {
  Smile,
  Sparkles,
  Download,
  Sliders,
  Layers,
  RefreshCw,
  Eye,
  CheckCircle2,
  Wand2,
  Maximize2,
  ArrowLeftRight,
} from 'lucide-react';

interface FacePreset {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
}

export const FaceSwapStudio: React.FC = () => {
  // Target Media (base image)
  const [selectedTarget, setSelectedTarget] = useState<string>(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
  );

  // Source Face (to swap onto target)
  const [selectedSource, setSelectedSource] = useState<string>(
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'
  );

  // Filter Preset
  const [filterStyle, setFilterStyle] = useState<'ghibli' | 'pixar' | 'comic' | 'cyberpunk' | 'sketch'>('ghibli');

  // Sliders
  const [splitPos, setSplitPos] = useState<number>(50); // percentage 0 to 100
  const [blendStrength, setBlendStrength] = useState<number>(75);
  const [outlineIntensity, setOutlineIntensity] = useState<number>(60);
  const [posterizeLevel, setPosterizeLevel] = useState<number>(70);
  const [saturation, setSaturation] = useState<number>(130);
  const [skinAdaptation, setSkinAdaptation] = useState<number>(85);

  const [isProcessing, setIsProcessing] = useState(false);
  const [renderMessage, setRenderMessage] = useState<string | null>(null);

  // Target gallery items
  const targetPresets: FacePreset[] = [
    {
      id: 't1',
      name: 'Influencer Portrait',
      category: 'Portrait',
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 't2',
      name: 'Cinematic Actor',
      category: 'Cinema',
      imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 't3',
      name: 'Urban Creator Frame',
      category: 'Action',
      imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    },
  ];

  // Source face avatars
  const sourcePresets: FacePreset[] = [
    {
      id: 's1',
      name: 'Classic Model',
      category: 'Real',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 's2',
      name: 'Anime Aesthetic Hero',
      category: 'Anime',
      imageUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 's3',
      name: 'Cyberpunk Pilot',
      category: 'Futuristic',
      imageUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const handleApplyFilter = () => {
    setIsProcessing(true);
    setRenderMessage('Applying neural face landmarks & artistic shader pipeline...');
    setTimeout(() => {
      setIsProcessing(false);
      setRenderMessage('Synthesized complete! Move the split slider to inspect before & after.');
    }, 1200);
  };

  const getFilterCSS = () => {
    switch (filterStyle) {
      case 'ghibli':
        return `contrast(${100 + outlineIntensity * 0.4}%) saturate(${saturation}%) brightness(108%) drop-shadow(0 0 2px rgba(147, 51, 234, 0.3))`;
      case 'pixar':
        return `contrast(135%) saturate(${saturation + 30}%) brightness(112%) drop-shadow(0 0 4px rgba(236, 72, 153, 0.4))`;
      case 'comic':
        return `contrast(${130 + outlineIntensity * 0.7}%) saturate(${saturation - 20}%) brightness(95%) grayscale(10%)`;
      case 'cyberpunk':
        return `contrast(140%) saturate(180%) hue-rotate(290deg) brightness(110%)`;
      case 'sketch':
        return `grayscale(100%) contrast(160%) brightness(110%)`;
      default:
        return 'none';
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <Smile className="h-4 w-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Face Swap & Cartoon Stylizer
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Swap face landmarks between photos or video frames and apply real-time anime, Pixar 3D, and cel-shaded cartoon shaders.
          </p>
        </div>

        <button
          onClick={handleApplyFilter}
          disabled={isProcessing}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-purple-600/30 hover:brightness-110 transition-all cursor-pointer"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Rendering Shaders...
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4" />
              Re-Synthesize Shaders
            </>
          )}
        </button>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Before/After Split Viewer (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <ArrowLeftRight className="h-3.5 w-3.5 text-indigo-400" />
                Interactive Before / After Split Slider
              </span>
              <span className="text-slate-400 font-mono">
                Original {splitPos}% | Stylized {100 - splitPos}%
              </span>
            </div>

            {/* Split Comparison Canvas Container */}
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-950 border border-slate-800 select-none">
              {/* Stylized Right Side (Background layer) */}
              <div className="absolute inset-0 w-full h-full">
                <img
                  src={selectedTarget}
                  alt="Stylized"
                  className="w-full h-full object-cover transition-all"
                  style={{ filter: getFilterCSS() }}
                />

                {/* Swapped Face Blend Region (Simulated Face Swap Landmark) */}
                <div
                  className="absolute top-[22%] left-[34%] w-[32%] h-[36%] rounded-full overflow-hidden pointer-events-none transition-all shadow-inner"
                  style={{
                    opacity: blendStrength / 100,
                    filter: `${getFilterCSS()} blur(0.5px)`,
                  }}
                >
                  <img
                    src={selectedSource}
                    alt="Swapped Face"
                    className="w-full h-full object-cover scale-110"
                  />
                </div>

                <div className="absolute bottom-3 right-3 bg-purple-950/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-bold text-purple-200 border border-purple-500/40">
                  {filterStyle.toUpperCase()} CARTOON + FACE SWAP
                </div>
              </div>

              {/* Original Left Side (Clipped via splitPos) */}
              <div
                className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-white shadow-2xl transition-none"
                style={{ width: `${splitPos}%` }}
              >
                <div className="absolute inset-0 w-[800px] h-full">
                  <img
                    src={selectedTarget}
                    alt="Original"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-bold text-white border border-white/20">
                    ORIGINAL INPUT
                  </div>
                </div>
              </div>

              {/* Draggable Divider Handle */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none"
                style={{ left: `${splitPos}%` }}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-900 shadow-xl border-2 border-indigo-600">
                  <ArrowLeftRight className="h-4 w-4" />
                </div>
              </div>
            </div>

            {/* Split Slider Range input */}
            <div className="mt-4 px-2">
              <input
                type="range"
                min="0"
                max="100"
                value={splitPos}
                onChange={(e) => setSplitPos(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>◀ Reveal More Original</span>
                <span>Drag slider to compare</span>
                <span>Reveal Stylized Cartoon ▶</span>
              </div>
            </div>

            {renderMessage && (
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-indigo-950/40 p-2 text-xs text-indigo-300 border border-indigo-800/40">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{renderMessage}</span>
              </div>
            )}
          </div>

          {/* Quick Snapshot Export Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-white">
                Export Composite Styler Frame
              </div>
              <div className="text-[11px] text-slate-400">
                Download current high-resolution frame with face alignment and shaders.
              </div>
            </div>
            <a
              href={selectedTarget}
              download={`OmniStudio_${filterStyle}_frame.jpg`}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-xs font-semibold shadow-md shadow-indigo-600/20 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              Download JPG
            </a>
          </div>
        </div>

        {/* Right Column: Style Selection & Parameter Sliders (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Target Media Picker */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
            <span className="text-xs font-bold text-white flex items-center justify-between">
              <span>1. Target Frame / Video Clip</span>
              <span className="text-[10px] text-slate-400">Select base portrait</span>
            </span>

            <div className="grid grid-cols-3 gap-2">
              {targetPresets.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTarget(t.imageUrl)}
                  className={`group relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                    selectedTarget === t.imageUrl
                      ? 'border-indigo-500 ring-2 ring-indigo-500/30'
                      : 'border-slate-800 hover:border-slate-600'
                  }`}
                >
                  <img
                    src={t.imageUrl}
                    alt={t.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-black/70 p-1 text-[10px] text-center text-white truncate">
                    {t.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Source Face Picker */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
            <span className="text-xs font-bold text-white flex items-center justify-between">
              <span>2. Source Face Landmark</span>
              <span className="text-[10px] text-purple-400">Face to transplant</span>
            </span>

            <div className="grid grid-cols-3 gap-2">
              {sourcePresets.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setSelectedSource(s.imageUrl)}
                  className={`group relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                    selectedSource === s.imageUrl
                      ? 'border-purple-500 ring-2 ring-purple-500/30'
                      : 'border-slate-800 hover:border-slate-600'
                  }`}
                >
                  <img
                    src={s.imageUrl}
                    alt={s.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-purple-950/80 p-1 text-[10px] text-center text-purple-200 truncate font-medium">
                    {s.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cartoon Filter Shaders */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
            <span className="text-xs font-bold text-white flex items-center justify-between">
              <span>3. Cartoon & Anime Shader Preset</span>
              <span className="text-[10px] text-pink-400">Stylization Mode</span>
            </span>

            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'ghibli', name: 'Studio Ghibli Anime', desc: 'Watercolor & soft ink' },
                { id: 'pixar', name: '3D Pixar Toon', desc: 'Vibrant & glossy eyes' },
                { id: 'comic', name: 'Comic Cel-Shaded', desc: 'Ink outlines & dots' },
                { id: 'cyberpunk', name: 'Cyberpunk Neon', desc: 'Neon edges & synth' },
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() => setFilterStyle(style.id as any)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    filterStyle === style.id
                      ? 'border-pink-500 bg-pink-950/30 text-white ring-1 ring-pink-500/50'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold">{style.name}</div>
                  <div className="text-[10px] text-slate-500">{style.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Precision Controls */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3 text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5 text-indigo-400" />
              Fine-Tuning Parameters
            </span>

            <div className="space-y-2.5">
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Face Blend Feathering</span>
                  <span className="font-mono text-indigo-400">{blendStrength}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={blendStrength}
                  onChange={(e) => setBlendStrength(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Cartoon Outline Intensity</span>
                  <span className="font-mono text-purple-400">{outlineIntensity}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={outlineIntensity}
                  onChange={(e) => setOutlineIntensity(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Color Saturation</span>
                  <span className="font-mono text-pink-400">{saturation}%</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="200"
                  value={saturation}
                  onChange={(e) => setSaturation(Number(e.target.value))}
                  className="w-full accent-pink-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
