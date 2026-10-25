import React, { useState } from 'react';
import {
  Code2,
  FolderTree,
  Terminal,
  Server,
  Layers,
  FileCode,
  CheckCircle2,
  Copy,
  Check,
  Cpu,
  BookOpen,
} from 'lucide-react';

export const SetupGuideStudio: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const projectTree = `omnistudio-suite/
├── .env.example                  # Environment variables (GEMINI_API_KEY, DATABASE_URL)
├── package.json                  # Dependencies (React 19, Express, @google/genai, jsPDF, Lucide)
├── tsconfig.json                 # TypeScript strict configuration
├── vite.config.ts                # Vite build and Tailwind v4 configuration
├── server.ts                     # Express full-stack API server + Vite middleware
├── src/
│   ├── main.tsx                  # Application entry point
│   ├── App.tsx                   # Main studio navigation & dashboard shell
│   ├── index.css                 # Tailwind CSS v4 directives
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces for video, stories, catalogs & ads
│   ├── services/
│   │   └── api.ts                # Client API for Gemini AI, video processing & Neon DB
│   └── components/
│       ├── layout/
│       │   ├── Header.tsx        # Top status bar & brand navigation
│       │   └── Sidebar.tsx       # Unified studio module switcher
│       └── modules/
│           ├── OverviewDashboard.tsx      # Multi-module launcher & statistics
│           ├── VideoStudio.tsx            # YouTube/Shorts processor & trimmer
│           ├── FaceSwapStudio.tsx         # Face swap & anime/cartoon shader split-slider
│           ├── StoryToCartoonStudio.tsx   # Gemini 3.8 AI scriptwriter & video assembler
│           ├── PdfCatalogStudio.tsx       # jsPDF product line sheet generator
│           ├── AdBannerStudio.tsx         # Social poster maker & AI copywriting
│           ├── NeonDatabaseStudio.tsx     # Neon PostgreSQL schema & SQL console
│           └── SetupGuideStudio.tsx       # Architecture & deployment docs
└── python_backend/               # Optional Python FastAPI service
    ├── main.py                   # yt-dlp & ReportLab processing endpoints
    └── requirements.txt          # yt-dlp, reportlab, fastapi, uvicorn, opencv-python`;

  const pythonServiceCode = `# python_backend/main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import yt_dlp
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import cv2

app = FastAPI(title="OmniStudio Media Worker")

class VideoRequest(BaseModel):
    url: str

@app.post("/api/py/yt-dlp/info")
def get_video_info(req: VideoRequest):
    ydl_opts = {'quiet': True, 'skip_download': True}
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(req.url, download=False)
        return {
            "title": info.get("title"),
            "duration": info.get("duration"),
            "thumbnail": info.get("thumbnail"),
            "formats": [f["format_id"] for f in info.get("formats", [])[:5]]
        }

@app.post("/api/py/cartoon-filter")
def apply_cartoon_shader(image_path: str):
    # OpenCV Bilateral Filter + Adaptive Thresholding for Cel-Shaded Cartoon
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray = cv2.medianBlur(gray, 5)
    edges = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 9, 9)
    color = cv2.bilateralFilter(img, 9, 250, 250)
    cartoon = cv2.bitwise_and(color, color, mask=edges)
    return {"status": "success"}`;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <BookOpen className="h-4 w-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Project Architecture & Setup Instructions
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Complete technical blueprint, file tree layout, Next.js / Express routes, Python yt-dlp & ReportLab workers, and Neon PostgreSQL deployment.
          </p>
        </div>
      </div>

      {/* Grid: File Tree on Left (6 cols) + Architecture Guide on Right (6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Project File Structure (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <FolderTree className="h-4 w-4 text-indigo-400" />
                Complete Project File Structure
              </span>
              <button
                onClick={() => handleCopy(projectTree, 'tree')}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
              >
                {copied === 'tree' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                Copy Tree
              </button>
            </div>

            <pre className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-[540px]">
              {projectTree}
            </pre>
          </div>
        </div>

        {/* Right Column: Setup Steps & Tech Stack Details (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Quick Setup Commands Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <Terminal className="h-4 w-4 text-emerald-400" />
              Quickstart Installation (Node.js & Vite / Next.js)
            </span>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 font-mono text-[11px]">
                <div className="text-slate-500"># 1. Clone & install dependencies</div>
                <div className="text-emerald-400">npm install</div>
                <div className="text-slate-500 mt-2"># 2. Configure environment variables (.env)</div>
                <div className="text-cyan-300">cp .env.example .env</div>
                <div className="text-slate-500 mt-2"># 3. Start development server</div>
                <div className="text-indigo-400">npm run dev</div>
              </div>
            </div>
          </div>

          {/* Python Worker Setup Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Cpu className="h-4 w-4 text-purple-400" />
                Python Worker (yt-dlp, OpenCV & ReportLab)
              </span>
              <button
                onClick={() => handleCopy(pythonServiceCode, 'py')}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
              >
                {copied === 'py' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                Copy Python Code
              </button>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              If running a standalone Python backend for native yt-dlp binary processing and OpenCV bilateral filter rendering:
            </p>

            <pre className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-[10px] font-mono text-purple-300 overflow-x-auto max-h-[220px]">
              {pythonServiceCode}
            </pre>
          </div>

          {/* Tech Stack Components Summary */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-cyan-400" />
              Integrated Tech Stack Summary
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800">
                <div className="font-semibold text-white">Frontend</div>
                <div className="text-[11px] text-slate-400">React 19 / Next.js, Tailwind CSS v4, Lucide Icons</div>
              </div>
              <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800">
                <div className="font-semibold text-white">AI Engine</div>
                <div className="text-[11px] text-slate-400">@google/genai (Gemini 3.8 Flash) & Web Speech TTS</div>
              </div>
              <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800">
                <div className="font-semibold text-white">Document Publishing</div>
                <div className="text-[11px] text-slate-400">jsPDF client vector engine & ReportLab Python</div>
              </div>
              <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800">
                <div className="font-semibold text-white">Database</div>
                <div className="text-[11px] text-slate-400">Neon Serverless PostgreSQL & Drizzle ORM</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
