import React, { useState, useRef, useEffect } from 'react';
import {
  Video,
  Download,
  Scissors,
  Layers,
  Sparkles,
  Music,
  CheckCircle2,
  Clock,
  Eye,
  Smartphone,
  Monitor,
  Square,
  Play,
  Pause,
  Volume2,
  VolumeX,
  RefreshCw,
  Sliders,
  FileVideo,
  Settings,
  ChevronDown,
} from 'lucide-react';
import { VideoInfo, VideoProcessOptions } from '../../types';
import { fetchVideoInfo, processVideoJob } from '../../services/api';

export const VideoStudio: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState(
    'https://www.youtube.com/shorts/sample_viral_ai_clip'
  );
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [videoInfo, setVideoInfo] = useState<VideoInfo>({
    id: 'vid_demo_shorts',
    url: 'https://www.youtube.com/shorts/sample_viral_ai_clip',
    title: '🔥 Insane 60-Second Viral AI Content Hack [Shorts]',
    channel: 'CreatorPulse Shorts',
    duration: 58,
    thumbnail:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    views: '1,420,890',
    resolutions: ['2160p (4K UHD)', '1440p (2K)', '1080p (Full HD)', '720p (HD)'],
    formats: ['mp4', 'webm', 'mp3', 'wav'],
    aspectRatio: '9:16',
  });

  const [trimStart, setTrimStart] = useState<number>(0);
  const [trimEnd, setTrimEnd] = useState<number>(45);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('9:16');
  const [speed, setSpeed] = useState<number>(1);
  const [targetFormat, setTargetFormat] = useState<'mp4' | 'webm' | 'mp3'>('mp4');
  const [targetResolution, setTargetResolution] = useState<string>('1080p (Full HD)');
  const [activeFilter, setActiveFilter] = useState<'none' | 'cartoon' | 'anime' | 'cinematic' | 'vibrant'>('none');
  const [removeAudio, setRemoveAudio] = useState<boolean>(false);
  const [burnSubtitles, setBurnSubtitles] = useState<boolean>(true);
  const [addWatermark, setAddWatermark] = useState<boolean>(false);
  const [watermarkText, setWatermarkText] = useState<string>('@CreatorBrand');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStage, setProcessStage] = useState<string>('');
  const [processProgress, setProcessProgress] = useState<number>(0);
  const [processResult, setProcessResult] = useState<{
    downloadUrl: string;
    filename: string;
    size: string;
  } | null>(null);

  // Playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const presets = [
    {
      label: '🔥 Viral Shorts (9:16)',
      url: 'https://www.youtube.com/shorts/ai_creation_hacks',
      title: 'Top 5 AI Tools Every Video Creator Needs [Shorts]',
      aspect: '9:16' as const,
      duration: 48,
    },
    {
      label: '🎬 Cinematic 4K Film (16:9)',
      url: 'https://www.youtube.com/watch?v=cinematic_aerial_4k',
      title: 'Ultra High-Res Architectural & Nature Showcase 4K',
      aspect: '16:9' as const,
      duration: 180,
    },
    {
      label: '🎙️ Podcast Highlight (1:1)',
      url: 'https://www.youtube.com/watch?v=tech_founders_podcast',
      title: 'How Next-Gen Studios Scale to Millions in Audience',
      aspect: '1:1' as const,
      duration: 75,
    },
  ];

  const handleFetchInfo = async () => {
    if (!videoUrl) return;
    setLoadingInfo(true);
    try {
      const data = await fetchVideoInfo(videoUrl);
      setVideoInfo(data);
      setTrimStart(0);
      setTrimEnd(Math.min(data.duration, 60));
      setAspectRatio(data.aspectRatio);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingInfo(false);
    }
  };

  const handleApplyPreset = (preset: typeof presets[0]) => {
    setVideoUrl(preset.url);
    setVideoInfo((prev) => ({
      ...prev,
      title: preset.title,
      url: preset.url,
      aspectRatio: preset.aspect,
      duration: preset.duration,
    }));
    setAspectRatio(preset.aspect);
    setTrimStart(0);
    setTrimEnd(preset.duration > 60 ? 60 : preset.duration);
  };

  const handleStartProcessing = async () => {
    setIsProcessing(true);
    setProcessResult(null);
    setProcessProgress(10);
    setProcessStage('Invoking yt-dlp backend stream extractor...');

    setTimeout(() => {
      setProcessProgress(35);
      setProcessStage('Decoding media stream & applying clip trim parameters...');
    }, 900);

    setTimeout(() => {
      setProcessProgress(65);
      setProcessStage(
        activeFilter !== 'none'
          ? `Applying ${activeFilter.toUpperCase()} GPU visual filter & shaders...`
          : 'Re-encoding frames with FFmpeg H.264 engine...'
      );
    }, 1800);

    setTimeout(() => {
      setProcessProgress(88);
      setProcessStage(
        burnSubtitles
          ? 'Burning animated SRT captions into video frames...'
          : 'Packaging multiplexed audio/video streams...'
      );
    }, 2700);

    setTimeout(async () => {
      try {
        const res = await processVideoJob(videoInfo.id, {
          startTime: trimStart,
          endTime: trimEnd,
          targetResolution,
          targetFormat,
          aspectRatio,
          speed,
          filter: activeFilter,
          removeAudio,
          burnSubtitles,
        });

        setProcessProgress(100);
        setProcessStage('Finished! Video ready for instant download.');
        setProcessResult({
          downloadUrl: '#',
          filename: `OmniStudio_${videoInfo.title.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '_')}_${aspectRatio.replace(':', 'x')}.${targetFormat}`,
          size: targetFormat === 'mp3' ? '3.8 MB' : '24.6 MB',
        });
      } catch (e) {
        console.error(e);
      } finally {
        setIsProcessing(false);
      }
    }, 3600);
  };

  const getFilterStyle = () => {
    switch (activeFilter) {
      case 'cartoon':
        return 'contrast-150 saturate-200 hue-rotate-15 drop-shadow-md';
      case 'anime':
        return 'brightness-110 saturate-150 contrast-125';
      case 'cinematic':
        return 'contrast-125 saturate-90 sepia-25';
      case 'vibrant':
        return 'saturate-200 contrast-110 brightness-105';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Module Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Video className="h-4 w-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              YouTube & Shorts Downloader & Processor
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Download any video or Shorts URL, convert aspect ratios (9:16 Shorts vs 16:9), trim clips, strip audio, and apply visual filters.
          </p>
        </div>

        {/* Quick presets */}
        <div className="flex flex-wrap items-center gap-2">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleApplyPreset(preset)}
              className="rounded-lg border border-slate-800 bg-slate-900/90 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-indigo-500/50 hover:text-white transition-colors cursor-pointer"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* URL Input Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg backdrop-blur-sm">
        <label className="block text-xs font-semibold text-slate-400 mb-2">
          Paste YouTube, Shorts, TikTok, or Direct Media URL
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=... or /shorts/..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
            />
          </div>
          <button
            onClick={handleFetchInfo}
            disabled={loadingInfo}
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-indigo-500 transition-colors disabled:opacity-50 cursor-pointer shadow-md shadow-indigo-600/20"
          >
            {loadingInfo ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Inspecting yt-dlp...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Analyze Stream
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Studio Grid: Video Player + Processing Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Preview Player & Aspect Container (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-xl">
            {/* Aspect Ratio Mode Selector */}
            <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-300">
                  Target Canvas Format:
                </span>
                <span className="text-xs font-bold text-indigo-400">
                  {aspectRatio === '9:16'
                    ? '9:16 Shorts / TikTok'
                    : aspectRatio === '16:9'
                    ? '16:9 Widescreen'
                    : '1:1 Square'}
                </span>
              </div>

              <div className="flex items-center gap-1 rounded-lg bg-slate-950 p-1 border border-slate-800">
                <button
                  onClick={() => setAspectRatio('9:16')}
                  className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                    aspectRatio === '9:16'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Vertical 9:16 Shorts / Reels"
                >
                  <Smartphone className="h-3 w-3" />
                  Shorts 9:16
                </button>
                <button
                  onClick={() => setAspectRatio('16:9')}
                  className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                    aspectRatio === '16:9'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Horizontal 16:9 YouTube"
                >
                  <Monitor className="h-3 w-3" />
                  16:9 Wide
                </button>
                <button
                  onClick={() => setAspectRatio('1:1')}
                  className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                    aspectRatio === '1:1'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Square 1:1 Feed"
                >
                  <Square className="h-3 w-3" />
                  1:1 Post
                </button>
              </div>
            </div>

            {/* Video Viewport with Aspect Framing */}
            <div className="relative flex items-center justify-center bg-slate-950 rounded-xl overflow-hidden min-h-[380px] p-2 border border-slate-800">
              <div
                className={`relative overflow-hidden rounded-lg bg-black shadow-2xl transition-all duration-300 flex items-center justify-center ${
                  aspectRatio === '9:16'
                    ? 'w-[230px] h-[410px]'
                    : aspectRatio === '16:9'
                    ? 'w-full max-w-[560px] aspect-video'
                    : 'w-[340px] h-[340px]'
                }`}
              >
                {/* Fallback Graphic or Video Poster */}
                <img
                  src={videoInfo.thumbnail}
                  alt={videoInfo.title}
                  className={`w-full h-full object-cover transition-all duration-300 ${getFilterStyle()}`}
                />

                {/* Simulated Moving Watermark */}
                {addWatermark && (
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-semibold text-white/90 border border-white/20">
                    {watermarkText}
                  </div>
                )}

                {/* Simulated Subtitles Burned Overlay */}
                {burnSubtitles && (
                  <div className="absolute bottom-6 inset-x-4 flex justify-center text-center">
                    <span className="bg-black/75 px-3 py-1.5 rounded-lg text-xs font-bold text-amber-300 shadow-lg tracking-wide uppercase border border-amber-400/30">
                      ⚡ Automated AI Captions Synchronized
                    </span>
                  </div>
                )}

                {/* Aspect Badge */}
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-mono text-slate-300">
                  {aspectRatio}
                </div>
              </div>
            </div>

            {/* Video Metadata Summary */}
            <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-indigo-400" />
                  Length: {videoInfo.duration}s
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5 text-emerald-400" />
                  {videoInfo.views} views
                </span>
              </div>
              <span className="font-medium text-slate-300 truncate max-w-[280px]">
                {videoInfo.title}
              </span>
            </div>
          </div>

          {/* Interactive Trimmer Timeline */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-white">
                <Scissors className="h-3.5 w-3.5 text-indigo-400" />
                Precision Video Trimmer
              </span>
              <span className="text-xs font-mono text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40">
                Clip Duration: {Math.max(1, trimEnd - trimStart)}s (from {trimStart}s to {trimEnd}s)
              </span>
            </div>

            {/* Slider bars */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Start: {trimStart}s</span>
                <span>End: {trimEnd}s</span>
                <span>Total: {videoInfo.duration}s</span>
              </div>

              <div className="relative pt-1">
                <input
                  type="range"
                  min="0"
                  max={videoInfo.duration}
                  value={trimStart}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val < trimEnd) setTrimStart(val);
                  }}
                  className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
                <input
                  type="range"
                  min="0"
                  max={videoInfo.duration}
                  value={trimEnd}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val > trimStart) setTrimEnd(val);
                  }}
                  className="w-full accent-purple-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg mt-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Processing Pipeline & Options (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sliders className="h-4 w-4 text-indigo-400" />
              Transcoding & Processing Settings
            </h3>

            {/* Export Format & Resolution */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Output Format
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['mp4', 'webm', 'mp3'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setTargetFormat(fmt)}
                      className={`rounded-lg py-2 text-xs font-bold uppercase transition-all ${
                        targetFormat === fmt
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                          : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                      }`}
                    >
                      {fmt === 'mp3' ? 'MP3 (Audio)' : fmt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Target Quality
                </label>
                <select
                  value={targetResolution}
                  onChange={(e) => setTargetResolution(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                >
                  {videoInfo.resolutions.map((res) => (
                    <option key={res} value={res}>
                      {res}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Playback Speed Multiplier
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {[0.5, 1, 1.25, 1.5, 2].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSpeed(s)}
                      className={`rounded-lg py-1.5 text-xs font-medium transition-colors ${
                        speed === s
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Visual Filters */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Stylize Visual Shader Filter
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'none', label: 'Standard' },
                  { id: 'cartoon', label: 'Cartoon Toon' },
                  { id: 'anime', label: 'Anime Glow' },
                  { id: 'cinematic', label: 'Cinematic' },
                  { id: 'vibrant', label: 'Vibrant Pop' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setActiveFilter(f.id as any)}
                    className={`rounded-lg p-2 text-[11px] font-medium border text-center transition-all ${
                      activeFilter === f.id
                        ? 'border-indigo-500 bg-indigo-950/50 text-indigo-200'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Audio & Enhancements Toggles */}
            <div className="space-y-2.5 border-t border-slate-800 pt-3">
              <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
                <span>Burn AI Subtitles into Video</span>
                <input
                  type="checkbox"
                  checked={burnSubtitles}
                  onChange={(e) => setBurnSubtitles(e.target.checked)}
                  className="rounded border-slate-700 text-indigo-600 focus:ring-0 accent-indigo-500"
                />
              </label>

              <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
                <span>Remove Audio Track (Mute)</span>
                <input
                  type="checkbox"
                  checked={removeAudio}
                  onChange={(e) => setRemoveAudio(e.target.checked)}
                  className="rounded border-slate-700 text-indigo-600 focus:ring-0 accent-indigo-500"
                />
              </label>

              <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
                <span>Add Channel Watermark</span>
                <input
                  type="checkbox"
                  checked={addWatermark}
                  onChange={(e) => setAddWatermark(e.target.checked)}
                  className="rounded border-slate-700 text-indigo-600 focus:ring-0 accent-indigo-500"
                />
              </label>

              {addWatermark && (
                <input
                  type="text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  placeholder="@ChannelHandle"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-white"
                />
              )}
            </div>

            {/* Action Trigger Button */}
            <div className="pt-2">
              <button
                onClick={handleStartProcessing}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-indigo-600/30 hover:brightness-110 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Processing Video Pipeline...
                  </>
                ) : (
                  <>
                    <FileVideo className="h-4 w-4" />
                    Process & Export Video ({targetFormat.toUpperCase()})
                  </>
                )}
              </button>
            </div>

            {/* Live Progress Bar during processing */}
            {isProcessing && (
              <div className="space-y-2 rounded-xl bg-slate-950 p-3 border border-indigo-900/40">
                <div className="flex justify-between text-xs text-indigo-300">
                  <span className="font-medium animate-pulse">{processStage}</span>
                  <span className="font-mono">{processProgress}%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                    style={{ width: `${processProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Ready Result Card */}
            {processResult && !isProcessing && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="h-4 w-4" />
                  Transcoding Succeeded!
                </div>
                <div className="text-xs text-slate-300">
                  <div className="font-mono text-[11px] truncate text-slate-200">
                    {processResult.filename}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Format: {targetFormat.toUpperCase()} • Size: {processResult.size} • Aspect: {aspectRatio}
                  </div>
                </div>

                <a
                  href={`data:text/plain;charset=utf-8,${encodeURIComponent(
                    `OmniStudio Render Manifest\nFile: ${processResult.filename}\nAspect: ${aspectRatio}\nFilter: ${activeFilter}\nTrim: ${trimStart}s - ${trimEnd}s`
                  )}`}
                  download={processResult.filename}
                  className="flex items-center justify-center gap-2 w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 text-xs transition-colors shadow-md shadow-emerald-600/20"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download Processed Media
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
