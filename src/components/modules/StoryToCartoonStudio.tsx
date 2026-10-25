import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Download,
  Film,
  Layers,
  Wand2,
  RefreshCw,
  Clock,
  Eye,
  CheckCircle2,
  ChevronRight,
  Maximize2,
  Tv,
} from 'lucide-react';
import { StoryScene, CartoonStyle } from '../../types';
import { generateStoryScenes } from '../../services/api';

export const StoryToCartoonStudio: React.FC = () => {
  const [plotText, setPlotText] = useState(
    'A curious young cybernetic cat named Nova discovers an ancient enchanted seed in the middle of a neon-lit futuristic metropolis. When planted, the seed sprouts a colossal glowing crystal tree that restores clean air and vibrant flora to the whole city.'
  );
  const [selectedStyle, setSelectedStyle] = useState<string>('Pixar 3D Animation');
  const [sceneCount, setSceneCount] = useState<number>(4);
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  // Generated Scenes
  const [storyTitle, setStoryTitle] = useState<string>('The Cybernetic Seed of Neo-City');
  const [scenes, setScenes] = useState<StoryScene[]>([
    {
      id: 'sc-1',
      sceneNumber: 1,
      title: 'Neon Shadows & The Discovery',
      visualPrompt: 'Pixar 3D style, sleek robotic kitten with cyan glowing eyes inspecting an ancient luminous golden seed between rain puddles in a high-tech alley.',
      dialogue: 'In the heart of Neo-City, where steel never slept, Nova found something the machines had long forgotten.',
      duration: 5,
      cameraMovement: 'zoom-in',
      bgTheme: 'Futuristic rainy cyberpunk alley with neon reflections',
      accentColor: '#38bdf8',
      characterAction: 'Leaning forward inquisitively, mechanical tail twitching',
      svgSceneType: 'city',
    },
    {
      id: 'sc-2',
      sceneNumber: 2,
      title: 'The Rooftop Laboratory',
      visualPrompt: 'Warm Pixar aesthetic, high-tech greenhouse laboratory atop a skyscraper, small planter glowing with emerald bioluminescent roots.',
      dialogue: 'Carefully sheltering it from the digital smog, Nova placed the seed into the nutrient soil, hoping for a miracle.',
      duration: 5,
      cameraMovement: 'pan-right',
      bgTheme: 'Glass skyscraper terrace greenhouse under starry violet sky',
      accentColor: '#10b981',
      characterAction: 'Hovering paws gently misting the soil with nutrient water',
      svgSceneType: 'lab',
    },
    {
      id: 'sc-3',
      sceneNumber: 3,
      title: 'The Great Awakening',
      visualPrompt: 'Dynamic energy burst, crystalline branches erupting skyward, holographic petals illuminating the whole city skyline with warm amber light.',
      dialogue: 'Suddenly, a surge of pure crystalline vitality burst forth, weaving through the skyscrapers and breathing living air into the city!',
      duration: 6,
      cameraMovement: 'zoom-out',
      bgTheme: 'Panoramic city vista with gigantic glowing botanical tree',
      accentColor: '#ec4899',
      characterAction: 'Nova gazing up in awe as glowing leaves drift past',
      svgSceneType: 'nature',
    },
    {
      id: 'sc-4',
      sceneNumber: 4,
      title: 'A Living Tomorrow',
      visualPrompt: 'Golden hour sunrise over the transformed metropolis, robotic creatures and humans celebrating side-by-side beneath blooming canopies.',
      dialogue: 'The city was reborn, proving that even in a world of circuits and code, nature will always find a way to bloom.',
      duration: 5,
      cameraMovement: 'pan-left',
      bgTheme: 'Warm sunbeams piercing clouds over a vibrant eco-metropolis',
      accentColor: '#f59e0b',
      characterAction: 'Nova resting proudly on a branch, looking at the sunrise',
      svgSceneType: 'castle',
    },
  ]);

  // Video Assembly Player State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);
  const [sceneProgress, setSceneProgress] = useState<number>(0);
  const [speechEnabled, setSpeechEnabled] = useState<boolean>(true);
  const [activeSpeechUtterance, setActiveSpeechUtterance] = useState<any>(null);

  const styles: CartoonStyle[] = [
    {
      id: 'pixar',
      name: 'Pixar 3D Animation',
      description: 'Luminous cinematic 3D lighting, expressive characters, warm textures',
      previewUrl: '',
      promptModifier: 'vibrant 3D cinematic animation, Disney Pixar look, octane render, soft subsurface scattering',
      colorPalette: ['#3b82f6', '#ec4899', '#f59e0b'],
    },
    {
      id: 'ghibli',
      name: 'Studio Ghibli Anime',
      description: 'Lush hand-painted watercolor backdrops, nostalgic emotion, wind motion',
      previewUrl: '',
      promptModifier: 'Studio Ghibli aesthetic, Hayao Miyazaki style, hand-drawn anime cel, watercolor clouds',
      colorPalette: ['#10b981', '#06b6d4', '#8b5cf6'],
    },
    {
      id: 'cyberchibi',
      name: 'Cyberpunk Chibi',
      description: 'Futuristic neon accents, adorable oversized eyes, high-energy gadgets',
      previewUrl: '',
      promptModifier: 'cyberpunk chibi anime art, high contrast neon outlines, futuristic cute aesthetic',
      colorPalette: ['#ec4899', '#8b5cf6', '#06b6d4'],
    },
    {
      id: 'comic',
      name: 'Vintage 2D Comic',
      description: 'Classic halftones, retro action lines, bold ink cel-shading',
      previewUrl: '',
      promptModifier: 'vintage comic book art, pop-art halftone dots, bold ink lines, retro superhero palette',
      colorPalette: ['#ef4444', '#f59e0b', '#3b82f6'],
    },
  ];

  const storyPresets = [
    {
      title: '🐱 Cyber Cat & Tree',
      text: 'A curious cybernetic cat finds an ancient glowing seed in a smoggy futuristic city, growing a giant crystalline tree that cleans the atmosphere.',
    },
    {
      title: '🚀 Space Alchemist',
      text: 'An apprentice alchemist accidentally drops a potion of starlight into an asteroid core, creating an orbiting carnival for space travelers.',
    },
    {
      title: '☕ Time-Travel Cafe',
      text: 'A quaint barista in Paris brews an espresso so dark it creates a two-minute portal back to the 1920s jazz era.',
    },
  ];

  // Speech narration helper
  const speakScene = (text: string) => {
    if (!speechEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.05;
    window.speechSynthesis.speak(utterance);
    setActiveSpeechUtterance(utterance);
  };

  const handleGenerateStory = async () => {
    if (!plotText.trim()) return;
    setIsGenerating(true);
    setStatusMessage('Deconstructing plot with Gemini 3.8 Flash animation director...');

    try {
      const data = await generateStoryScenes({
        storyPlot: plotText,
        style: selectedStyle,
        sceneCount,
      });

      if (data && data.scenes) {
        setStoryTitle(data.title || 'Untitled Cartoon Production');
        setScenes(data.scenes);
        setCurrentSceneIndex(0);
        setSceneProgress(0);
        setStatusMessage('Animation scenes generated successfully!');
      }
    } catch (e: any) {
      console.error(e);
      setStatusMessage('Generated using creative animation fallback.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Video playback loop
  useEffect(() => {
    let interval: any = null;
    if (isPlaying && scenes.length > 0) {
      const activeScene = scenes[currentSceneIndex];
      const durationMs = (activeScene.duration || 5) * 1000;
      const stepMs = 50;

      interval = setInterval(() => {
        setSceneProgress((prev) => {
          const next = prev + (stepMs / durationMs) * 100;
          if (next >= 100) {
            // Next scene or loop
            if (currentSceneIndex < scenes.length - 1) {
              const nextIdx = currentSceneIndex + 1;
              setCurrentSceneIndex(nextIdx);
              speakScene(scenes[nextIdx].dialogue);
              return 0;
            } else {
              setIsPlaying(false);
              return 100;
            }
          }
          return next;
        });
      }, stepMs);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentSceneIndex, scenes, speechEnabled]);

  const togglePlay = () => {
    if (!isPlaying) {
      if (sceneProgress >= 100 && currentSceneIndex === scenes.length - 1) {
        setCurrentSceneIndex(0);
        setSceneProgress(0);
      }
      setIsPlaying(true);
      speakScene(scenes[currentSceneIndex].dialogue);
    } else {
      setIsPlaying(false);
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentSceneIndex(0);
    setSceneProgress(0);
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  // Render Vector Cartoon Illustrations per scene
  const renderCartoonIllustration = (scene: StoryScene) => {
    const isCurrentActive = isPlaying;
    const movementClass =
      scene.cameraMovement === 'zoom-in'
        ? 'scale-110'
        : scene.cameraMovement === 'zoom-out'
        ? 'scale-95'
        : scene.cameraMovement === 'pan-right'
        ? 'translate-x-3'
        : scene.cameraMovement === 'pan-left'
        ? '-translate-x-3'
        : 'scale-100';

    return (
      <div className={`relative w-full h-full overflow-hidden transition-all duration-700 ease-out ${movementClass}`}>
        <svg viewBox="0 0 800 500" className="w-full h-full object-cover">
          <defs>
            <linearGradient id={`grad-sky-${scene.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="60%" stopColor="#1e1b4b" />
              <stop offset="100%" stopColor={scene.accentColor || '#6366f1'} />
            </linearGradient>

            <linearGradient id={`grad-glow-${scene.id}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.2" />
            </linearGradient>

            <radialGradient id={`rad-sun-${scene.id}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
              <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background Sky */}
          <rect width="800" height="500" fill={`url(#grad-sky-${scene.id})`} />

          {/* Sun / Moon celestial body */}
          <circle cx="680" cy="110" r="80" fill={`url(#rad-sun-${scene.id})`} />

          {/* Starfield elements */}
          {[...Array(18)].map((_, i) => (
            <circle
              key={i}
              cx={(i * 47) % 780 + 10}
              cy={(i * 29) % 220 + 20}
              r={(i % 3) + 1.2}
              fill="#ffffff"
              opacity={(i % 5) * 0.2 + 0.3}
            />
          ))}

          {/* Scenery backdrop based on scene type */}
          {scene.svgSceneType === 'city' || scene.svgSceneType === 'lab' ? (
            <g opacity="0.85">
              {/* Skyline Silhouette */}
              <rect x="50" y="240" width="90" height="260" fill="#090d16" rx="6" />
              <rect x="160" y="190" width="110" height="310" fill="#0d1527" rx="6" />
              <rect x="290" y="220" width="85" height="280" fill="#090d16" rx="6" />
              <rect x="395" y="150" width="130" height="350" fill="#111c38" rx="8" />
              <rect x="545" y="210" width="95" height="290" fill="#090d16" rx="6" />
              <rect x="660" y="180" width="110" height="320" fill="#0d1527" rx="6" />

              {/* Glowing Cyber Windows */}
              {[...Array(16)].map((_, i) => (
                <rect
                  key={i}
                  x={175 + (i % 3) * 30}
                  y={210 + Math.floor(i / 3) * 35}
                  width="18"
                  height="18"
                  rx="3"
                  fill={i % 2 === 0 ? '#38bdf8' : '#ec4899'}
                  opacity="0.8"
                />
              ))}

              {[...Array(20)].map((_, i) => (
                <rect
                  key={i}
                  x={415 + (i % 3) * 35}
                  y={180 + Math.floor(i / 3) * 35}
                  width="22"
                  height="22"
                  rx="4"
                  fill={i % 3 === 0 ? '#a855f7' : '#38bdf8'}
                  opacity="0.85"
                />
              ))}
            </g>
          ) : (
            <g opacity="0.9">
              {/* Rolling Hills & Mountain Silhouette */}
              <path
                d="M0,380 Q200,280 400,340 T800,300 L800,500 L0,500 Z"
                fill="#064e3b"
                opacity="0.7"
              />
              <path
                d="M0,420 Q260,330 520,390 T800,370 L800,500 L0,500 Z"
                fill="#022c22"
              />
              {/* Botanical Crystal Tree Canopy */}
              <circle cx="400" cy="270" r="110" fill={scene.accentColor || '#10b981'} opacity="0.4" />
              <circle cx="400" cy="270" r="75" fill="#34d399" opacity="0.7" />
              <rect x="388" y="270" width="24" height="180" fill="#1e293b" rx="8" />
            </g>
          )}

          {/* Central Animated Hero Character (Cute Cartoon Mascot) */}
          <g transform="translate(360, 310)">
            {/* Soft Shadow */}
            <ellipse cx="40" cy="115" rx="50" ry="14" fill="#000000" opacity="0.4" />

            {/* Character Body */}
            <rect x="15" y="45" width="50" height="55" rx="25" fill="#e2e8f0" />
            <rect x="25" y="55" width="30" height="35" rx="15" fill={scene.accentColor || '#38bdf8'} opacity="0.8" />

            {/* Head */}
            <circle cx="40" cy="35" r="32" fill="#ffffff" />
            {/* Cute Ears */}
            <polygon points="12,18 24,3 32,22" fill="#e2e8f0" />
            <polygon points="17,17 25,6 30,20" fill={scene.accentColor || '#38bdf8'} />
            <polygon points="68,18 56,3 48,22" fill="#e2e8f0" />
            <polygon points="63,17 55,6 50,20" fill={scene.accentColor || '#38bdf8'} />

            {/* Big Expressive Cartoon Eyes */}
            <circle cx="28" cy="32" r="7" fill="#0f172a" />
            <circle cx="52" cy="32" r="7" fill="#0f172a" />
            <circle cx="26" cy="30" r="2.5" fill="#ffffff" />
            <circle cx="50" cy="30" r="2.5" fill="#ffffff" />

            {/* Cheerful Nose & Smile */}
            <polygon points="38,40 42,40 40,43" fill="#f43f5e" />
            <path d="M35,46 Q40,51 45,46" stroke="#0f172a" strokeWidth="2.5" fill="none" strokeLinecap="round" />

            {/* Animated Energy Orb in Paws */}
            <circle cx="40" cy="80" r="14" fill={scene.accentColor || '#ec4899'} className="animate-pulse" />
            <circle cx="40" cy="80" r="8" fill="#ffffff" opacity="0.8" />
          </g>
        </svg>

        {/* Cinematic Vignette */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-black/30" />
      </div>
    );
  };

  const activeScene = scenes[currentSceneIndex] || scenes[0];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Sparkles className="h-4 w-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Story-to-Cartoon AI Video Generator
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Turn any narrative plot or script into storyboarded animated scenes, synchronized voiceovers, and an assembled video player.
          </p>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap items-center gap-2">
          {storyPresets.map((p, i) => (
            <button
              key={i}
              onClick={() => setPlotText(p.text)}
              className="rounded-lg border border-slate-800 bg-slate-900/90 px-2.5 py-1 text-xs text-slate-300 hover:border-amber-500/50 hover:text-white transition-colors cursor-pointer"
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* Top Input & Style Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Plot Input */}
          <div className="md:col-span-8 space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              Story Plot, Script Prompt or Scene Synopsis
            </label>
            <textarea
              value={plotText}
              onChange={(e) => setPlotText(e.target.value)}
              rows={3}
              placeholder="Describe your story or paste a script..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Style & Scene Config */}
          <div className="md:col-span-4 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Cartoon Visual Style
              </label>
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              >
                {styles.map((st) => (
                  <option key={st.id} value={st.name}>
                    {st.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Scene Breakdown Count
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    onClick={() => setSceneCount(num)}
                    className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      sceneCount === num
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    {num} Scenes
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerateStory}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 py-2.5 text-xs sm:text-sm font-bold text-slate-950 hover:brightness-110 shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-slate-950" />
                  Generating Storyboard...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 text-slate-950" />
                  Generate Cartoon Animation (Gemini AI)
                </>
              )}
            </button>
          </div>
        </div>

        {statusMessage && (
          <div className="flex items-center gap-2 text-xs text-amber-300/90 pt-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>{statusMessage}</span>
          </div>
        )}
      </div>

      {/* Main Studio View: Assembled Video Player on Left (7 cols) + Storyboard Timeline on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Assembled Cartoon Video Player (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-2xl">
            {/* Title bar */}
            <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2.5">
              <div className="flex items-center gap-2">
                <Tv className="h-4 w-4 text-amber-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Assembled Cartoon Player
                </span>
                <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400 border border-amber-500/30">
                  {selectedStyle}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={() => setSpeechEnabled(!speechEnabled)}
                  className={`flex items-center gap-1 rounded-md px-2 py-1 text-[11px] border transition-colors ${
                    speechEnabled
                      ? 'bg-indigo-950/60 border-indigo-700 text-indigo-300'
                      : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}
                  title="Toggle voiceover narration"
                >
                  {speechEnabled ? (
                    <>
                      <Volume2 className="h-3 w-3 text-indigo-400" />
                      Voiceover ON
                    </>
                  ) : (
                    <>
                      <VolumeX className="h-3 w-3" />
                      Voiceover OFF
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Video Canvas Frame */}
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner">
              {/* Scene Vector Cartoon Graphic */}
              {renderCartoonIllustration(activeScene)}

              {/* Subtitles Overlay */}
              <div className="absolute bottom-6 inset-x-6 flex justify-center text-center pointer-events-none">
                <div className="max-w-xl rounded-xl bg-black/80 backdrop-blur-md px-4 py-2 border border-white/20 shadow-2xl">
                  <p className="text-xs sm:text-sm font-semibold text-white drop-shadow-md leading-relaxed">
                    "{activeScene.dialogue}"
                  </p>
                </div>
              </div>

              {/* Scene Indicator Overlay */}
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-amber-300 border border-amber-500/30 shadow-md">
                Scene {currentSceneIndex + 1} / {scenes.length}: {activeScene.title}
              </div>

              {/* Camera Pan Badge */}
              <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-mono text-slate-300 border border-white/10 uppercase">
                Cam: {activeScene.cameraMovement}
              </div>
            </div>

            {/* Playback Controls & Scrubber */}
            <div className="mt-4 space-y-3">
              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>Scene Progress</span>
                  <span>{Math.round(sceneProgress)}%</span>
                </div>
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 transition-all duration-75"
                    style={{ width: `${sceneProgress}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={togglePlay}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 px-5 py-2 text-xs font-bold text-slate-950 hover:brightness-110 shadow-md transition-all cursor-pointer"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="h-3.5 w-3.5 fill-current" />
                        Pause Video
                      </>
                    ) : (
                      <>
                        <Play className="h-3.5 w-3.5 fill-current" />
                        Play Assembled Movie
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reset
                  </button>
                </div>

                {/* Export Movie Button */}
                <a
                  href={`data:text/plain;charset=utf-8,${encodeURIComponent(
                    `OmniStudio Cartoon Movie Assembly\nTitle: ${storyTitle}\nStyle: ${selectedStyle}\nTotal Scenes: ${scenes.length}\nDialogue Script:\n` +
                      scenes.map((s) => `[Scene ${s.sceneNumber}] ${s.dialogue}`).join('\n')
                  )}`}
                  download={`${storyTitle.replace(/[^a-zA-Z0-9]/g, '_')}_assembled_movie.mp4`}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-xs font-bold shadow-md shadow-indigo-600/30 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  Export Assembled MP4
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Storyboard Panels & Timeline (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Film className="h-3.5 w-3.5 text-amber-400" />
              Storyboard Scene Timeline ({scenes.length} Panels)
            </span>
            <span className="text-[11px] text-slate-400">Click to preview scene</span>
          </div>

          <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
            {scenes.map((sc, idx) => (
              <div
                key={sc.id || idx}
                onClick={() => {
                  setCurrentSceneIndex(idx);
                  setSceneProgress(0);
                  speakScene(sc.dialogue);
                }}
                className={`rounded-xl border p-3 cursor-pointer transition-all ${
                  currentSceneIndex === idx
                    ? 'border-amber-500 bg-amber-950/20 shadow-md ring-1 ring-amber-500/40'
                    : 'border-slate-800/80 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-[10px] font-mono text-amber-300">
                      {sc.sceneNumber}
                    </span>
                    {sc.title}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {sc.duration}s • {sc.cameraMovement}
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 italic mb-2 line-clamp-2">
                  "{sc.dialogue}"
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-800/60 pt-2">
                  <span className="truncate max-w-[200px]">Prompt: {sc.visualPrompt}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      speakScene(sc.dialogue);
                    }}
                    className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    <Volume2 className="h-3 w-3" />
                    Read
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
