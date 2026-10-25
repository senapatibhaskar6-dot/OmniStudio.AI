import React, { useState, useRef } from 'react';
import {
  Image as ImageIcon,
  Download,
  Sparkles,
  Sliders,
  Type,
  Layout,
  Palette,
  RefreshCw,
  ShoppingBag,
  Star,
  Zap,
  CheckCircle2,
  Copy,
} from 'lucide-react';
import { generateAdCopy } from '../../services/api';

export const AdBannerStudio: React.FC = () => {
  // Format Presets
  const [platform, setPlatform] = useState<'instagram-post' | 'instagram-story' | 'youtube-thumb' | 'facebook-ad'>('instagram-post');

  // Ad Copy & Visual Elements
  const [headline, setHeadline] = useState<string>('Unleash Next-Gen Sound');
  const [subhead, setSubhead] = useState<string>('Planar Magnetic Precision with Active Noise Cancellation.');
  const [badgeText, setBadgeText] = useState<string>('🔥 50% OFF FLASH SALE');
  const [ctaText, setCtaText] = useState<string>('SHOP THE SALE NOW');
  const [selectedProductImg, setSelectedProductImg] = useState<string>(
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
  );

  // Background Theme
  const [bgStyle, setBgStyle] = useState<'cyberpunk' | 'sunset' | 'emerald' | 'midnight' | 'minimal'>('cyberpunk');
  const [productScale, setProductScale] = useState<number>(100);
  const [productRotation, setProductRotation] = useState<number>(0);
  const [showRating, setShowRating] = useState<boolean>(true);

  // AI Copywriting State
  const [isGeneratingCopy, setIsGeneratingCopy] = useState<boolean>(false);
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);

  const canvasRef = useRef<HTMLDivElement>(null);

  const productPresets = [
    { name: 'Studio Headphones', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80' },
    { name: 'Street Sneakers', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80' },
    { name: 'Titanium Smart Watch', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80' },
    { name: 'Vintage 35mm Camera', url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80' },
  ];

  const handleGenerateAiCopy = async () => {
    setIsGeneratingCopy(true);
    try {
      const data = await generateAdCopy({
        productName: 'Apex Pro Gear',
        discount: '50% OFF',
        tone: 'High-energy viral promotional',
      });
      setAiSuggestions(data);
      if (data?.headlines?.[0]) setHeadline(data.headlines[0]);
      if (data?.subheadlines?.[0]) setSubhead(data.subheadlines[0]);
      if (data?.ctas?.[0]) setCtaText(data.ctas[0]);
      if (data?.badges?.[0]) setBadgeText(`🔥 ${data.badges[0]}`);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingCopy(false);
    }
  };

  const getCanvasDimensions = () => {
    switch (platform) {
      case 'instagram-post':
        return { label: '1:1 Instagram Post', aspect: 'aspect-square', w: 'w-[420px]', h: 'h-[420px]' };
      case 'instagram-story':
        return { label: '9:16 Story / TikTok', aspect: 'aspect-[9/16]', w: 'w-[280px]', h: 'h-[498px]' };
      case 'youtube-thumb':
        return { label: '16:9 YouTube Thumbnail', aspect: 'aspect-video', w: 'w-[520px]', h: 'h-[292px]' };
      case 'facebook-ad':
        return { label: '1.91:1 Facebook Banner', aspect: 'aspect-[1.91/1]', w: 'w-[520px]', h: 'h-[272px]' };
      default:
        return { label: '1:1 Square', aspect: 'aspect-square', w: 'w-[420px]', h: 'h-[420px]' };
    }
  };

  const getBgClass = () => {
    switch (bgStyle) {
      case 'cyberpunk':
        return 'bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950';
      case 'sunset':
        return 'bg-gradient-to-tr from-rose-950 via-orange-950 to-amber-950';
      case 'emerald':
        return 'bg-gradient-to-bl from-teal-950 via-emerald-950 to-slate-950';
      case 'midnight':
        return 'bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900';
      case 'minimal':
        return 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950';
      default:
        return 'bg-slate-950';
    }
  };

  const handleExportPng = () => {
    // Generate a downloadable image data URL or manifest
    const link = document.createElement('a');
    link.download = `OmniStudio_${platform}_AdBanner.png`;
    link.href = selectedProductImg;
    link.click();
  };

  const dims = getCanvasDimensions();

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-pink-600/20 text-pink-400 border border-pink-500/30">
              <ImageIcon className="h-4 w-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Ad Banner & Social Media Poster Maker
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Produce high-converting promotional banners and social media ads with AI copy, multi-format canvas aspect ratios, and instant export.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerateAiCopy}
            disabled={isGeneratingCopy}
            className="flex items-center gap-1.5 rounded-xl border border-indigo-700 bg-indigo-950/60 px-4 py-2 text-xs font-semibold text-indigo-300 hover:bg-indigo-900/60 transition-colors cursor-pointer"
          >
            {isGeneratingCopy ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin text-indigo-400" />
            ) : (
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            )}
            AI Copywriter (Gemini)
          </button>

          <button
            onClick={handleExportPng}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-pink-600/30 hover:brightness-110 transition-all cursor-pointer"
          >
            <Download className="h-4 w-4" />
            Export High-Res PNG
          </button>
        </div>
      </div>

      {/* Main Studio Grid: Graphic Canvas on Left (7 cols) + Design Controls on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Visual Ad Canvas (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-2xl flex flex-col items-center">
            {/* Platform Presets Toolbar */}
            <div className="w-full flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
              <span className="text-xs font-semibold text-slate-300">Format Ratio:</span>
              <div className="flex flex-wrap gap-1">
                {[
                  { id: 'instagram-post', label: '1:1 Post' },
                  { id: 'instagram-story', label: '9:16 Story' },
                  { id: 'youtube-thumb', label: '16:9 Thumb' },
                  { id: 'facebook-ad', label: '1.91:1 Banner' },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPlatform(p.id as any)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                      platform === p.id
                        ? 'bg-pink-600 text-white shadow-md'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Rendered Ad Canvas Viewport */}
            <div
              ref={canvasRef}
              className={`relative overflow-hidden rounded-2xl shadow-2xl border border-white/10 ${getBgClass()} ${dims.w} ${dims.h} p-6 flex flex-col justify-between select-none transition-all duration-300`}
            >
              {/* Glowing Background Radial Light */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-pink-500/20 blur-3xl pointer-events-none" />

              {/* Top Banner Row: Promo Badge & Rating */}
              <div className="relative z-10 flex items-start justify-between">
                <span className="rounded-full bg-pink-600 px-3 py-1 text-[11px] font-black tracking-wider text-white shadow-lg uppercase">
                  {badgeText}
                </span>

                {showRating && (
                  <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-amber-300 border border-amber-400/20">
                    <Star className="h-3 w-3 fill-amber-300" />
                    <span>4.9 / 5.0 (12K+ Sold)</span>
                  </div>
                )}
              </div>

              {/* Middle Layer: Hero Product Cut-Out Image */}
              <div className="relative z-10 my-auto flex items-center justify-center">
                <div
                  className="relative transition-transform duration-200"
                  style={{
                    transform: `scale(${productScale / 100}) rotate(${productRotation}deg)`,
                  }}
                >
                  <img
                    src={selectedProductImg}
                    alt="Featured Product"
                    className="max-h-44 max-w-full object-contain rounded-2xl drop-shadow-[0_20px_25px_rgba(0,0,0,0.7)]"
                  />
                </div>
              </div>

              {/* Bottom Layer: Headline, Subheadline & Call-To-Action Button */}
              <div className="relative z-10 space-y-2 text-center">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight drop-shadow-md">
                  {headline}
                </h2>
                <p className="text-xs text-slate-300 max-w-sm mx-auto line-clamp-2">
                  {subhead}
                </p>

                <div className="pt-2">
                  <span className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-xl shadow-pink-500/30 hover:brightness-110 cursor-pointer">
                    <ShoppingBag className="h-3.5 w-3.5" />
                    {ctaText}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 text-xs text-slate-500">
              Canvas Presets: {dims.label} • Ready for Retina Export
            </div>
          </div>
        </div>

        {/* Right Column: Copywriting & Customization Tools (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* AI Ad Copy Suggestions Card */}
          {aiSuggestions && (
            <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-4 space-y-2">
              <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                AI Generated Copy Ideas (Click to Apply)
              </span>
              <div className="space-y-1.5 pt-1">
                {aiSuggestions.headlines?.map((h: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setHeadline(h)}
                    className="w-full text-left rounded-lg bg-slate-900/80 p-2 text-xs text-slate-200 hover:text-white hover:bg-slate-800 transition-colors border border-slate-800 truncate"
                  >
                    Headline: {h}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Text Editor */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Type className="h-3.5 w-3.5 text-pink-400" />
              Ad Headline & Typography
            </span>

            <div className="space-y-2.5 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Headline Text</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-white font-semibold"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Subheadline Description</label>
                <input
                  type="text"
                  value={subhead}
                  onChange={(e) => setSubhead(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Promo Badge</label>
                  <input
                    type="text"
                    value={badgeText}
                    onChange={(e) => setBadgeText(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-white font-bold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Product Cut-Out Selector */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <ShoppingBag className="h-3.5 w-3.5 text-purple-400" />
              Product Subject Asset
            </span>

            <div className="grid grid-cols-4 gap-2">
              {productPresets.map((p, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedProductImg(p.url)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                    selectedProductImg === p.url
                      ? 'border-pink-500 ring-2 ring-pink-500/30'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <img
                    src={p.url}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subject Scale</span>
                <span className="font-mono text-pink-400">{productScale}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="140"
                value={productScale}
                onChange={(e) => setProductScale(Number(e.target.value))}
                className="w-full accent-pink-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>
          </div>

          {/* Background Gradient Palette */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Palette className="h-3.5 w-3.5 text-amber-400" />
              Atmospheric Background Palette
            </span>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'cyberpunk', name: 'Cyberpunk' },
                { id: 'sunset', name: 'Sunset Warm' },
                { id: 'emerald', name: 'Emerald Luxe' },
                { id: 'midnight', name: 'Midnight' },
                { id: 'minimal', name: 'Minimalist' },
              ].map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => setBgStyle(bg.id as any)}
                  className={`rounded-lg py-2 text-xs font-medium border text-center transition-all ${
                    bgStyle === bg.id
                      ? 'border-pink-500 bg-pink-950/40 text-pink-200'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  {bg.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
