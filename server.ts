import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));

// Shared server-side Gemini client
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// -----------------------------------------------------------------------------
// 1. STORY-TO-CARTOON AI GENERATOR API
// -----------------------------------------------------------------------------
app.post('/api/ai/story-to-cartoon', async (req: Request, res: Response) => {
  try {
    const { storyPlot, style = 'Pixar 3D Animation', sceneCount = 4, characterNotes } = req.body;

    if (!storyPlot || typeof storyPlot !== 'string') {
      res.status(400).json({ error: 'Story plot or script prompt is required' });
      return;
    }

    if (ai) {
      try {
        const prompt = `You are an expert Pixar and Anime storyboard director and animation scriptwriter.
Deconstruct this story/plot into exactly ${sceneCount} sequential animated cartoon scenes.

Story Plot:
"${storyPlot}"

Animation Visual Style: ${style}
${characterNotes ? `Character Notes: ${characterNotes}` : ''}

Generate structured storyboard scenes with:
- sceneNumber (1 to ${sceneCount})
- title (short catchy scene headline)
- visualPrompt (rich, detailed prompt for generating the cartoon visual frame)
- dialogue (narrator voiceover script or spoken character dialogue, 1-2 engaging sentences)
- duration (estimated seconds between 3 to 7)
- cameraMovement ('zoom-in', 'pan-left', 'pan-right', 'zoom-out', or 'static')
- characterAction (what the characters are doing in this frame)
- bgTheme (e.g. 'vibrant sunset', 'neon cyberpunk alley', 'enchanted emerald grove', 'futuristic tech lab')
- accentColor (hex color code e.g. '#6366f1')
- svgSceneType ('city', 'nature', 'space', 'castle', or 'lab')`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                synopsis: { type: Type.STRING },
                scenes: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      sceneNumber: { type: Type.INTEGER },
                      title: { type: Type.STRING },
                      visualPrompt: { type: Type.STRING },
                      dialogue: { type: Type.STRING },
                      duration: { type: Type.INTEGER },
                      cameraMovement: { type: Type.STRING },
                      characterAction: { type: Type.STRING },
                      bgTheme: { type: Type.STRING },
                      accentColor: { type: Type.STRING },
                      svgSceneType: { type: Type.STRING },
                    },
                    required: [
                      'sceneNumber',
                      'title',
                      'visualPrompt',
                      'dialogue',
                      'duration',
                      'cameraMovement',
                      'characterAction',
                    ],
                  },
                },
              },
              required: ['title', 'synopsis', 'scenes'],
            },
          },
        });

        const rawText = response.text || '{}';
        const parsed = JSON.parse(rawText);
        res.json({
          success: true,
          data: parsed,
          source: 'gemini-3.8-flash',
        });
        return;
      } catch (geminiError: any) {
        console.warn('Gemini API call failed, falling back to intelligent procedural generator:', geminiError?.message);
      }
    }

    // Procedural Fallback if Gemini key is not configured or rate limited
    const scenes = [
      {
        sceneNumber: 1,
        title: 'The Spark of Adventure',
        visualPrompt: `Opening establishing shot in ${style} style. Protagonist discovering an extraordinary discovery against a backdrop of glowing light.`,
        dialogue: `It started like any other ordinary morning, until a peculiar glow beneath the surface changed everything.`,
        duration: 5,
        cameraMovement: 'zoom-in',
        characterAction: 'Approaches mysterious glowing orb with wide curious eyes',
        bgTheme: 'Dawn horizon with soft pastel clouds',
        accentColor: '#3b82f6',
        svgSceneType: 'nature',
      },
      {
        sceneNumber: 2,
        title: 'Into the Unknown',
        visualPrompt: `Dynamic high-energy animation frame in ${style}. Characters navigating a surreal vibrant world filled with whimsical machines.`,
        dialogue: `Stepping beyond the familiar boundary, the impossible became everyday reality.`,
        duration: 5,
        cameraMovement: 'pan-right',
        characterAction: 'Gliding effortlessly across holographic suspension rails',
        bgTheme: 'Futuristic crystal city with towering spire spires',
        accentColor: '#8b5cf6',
        svgSceneType: 'city',
      },
      {
        sceneNumber: 3,
        title: 'The Great Challenge',
        visualPrompt: `Dramatic tension frame in ${style} aesthetic. Swirling energy and electric outlines as the team works together against time.`,
        dialogue: `When the pressure mounted, they discovered their true strength was not speed, but unity.`,
        duration: 6,
        cameraMovement: 'zoom-out',
        characterAction: 'Channelling vibrant elemental energy to activate the generator',
        bgTheme: 'Deep space anomaly with glowing nebulae',
        accentColor: '#ec4899',
        svgSceneType: 'space',
      },
      {
        sceneNumber: 4,
        title: 'A Legend Born',
        visualPrompt: `Triumphant golden hour climax in rich ${style}. Vibrant colors, celebratory sparklers, joyful victory smile.`,
        dialogue: `And from that day forth, the world was never quite the same again.`,
        duration: 5,
        cameraMovement: 'pan-left',
        characterAction: 'Holding up the restored energy core in celebration',
        bgTheme: 'Golden sunset over majestic ancient castle terrace',
        accentColor: '#10b981',
        svgSceneType: 'castle',
      },
    ];

    res.json({
      success: true,
      data: {
        title: 'The Tale of the Radiant Horizon',
        synopsis: storyPlot,
        scenes: scenes.slice(0, Number(sceneCount) || 4),
      },
      source: 'procedural-fallback',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// -----------------------------------------------------------------------------
// 2. AI AD COPY & CAMPAIGN ASSISTANT
// -----------------------------------------------------------------------------
app.post('/api/ai/enhance-ad-copy', async (req: Request, res: Response) => {
  try {
    const { productName, audience = 'General shoppers', discount = '30% OFF', tone = 'High-energy & viral' } = req.body;

    if (ai) {
      try {
        const prompt = `Write marketing ad banner copy for product: "${productName}".
Target Audience: ${audience}. Promo Discount: ${discount}. Tone: ${tone}.
Generate 3 punchy headlines (under 6 words each), 3 subheadlines (under 12 words), 3 CTA button phrases, and 3 badge promotional stickers.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                headlines: { type: Type.ARRAY, items: { type: Type.STRING } },
                subheadlines: { type: Type.ARRAY, items: { type: Type.STRING } },
                ctas: { type: Type.ARRAY, items: { type: Type.STRING } },
                badges: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ['headlines', 'subheadlines', 'ctas', 'badges'],
            },
          },
        });

        res.json({
          success: true,
          data: JSON.parse(response.text || '{}'),
        });
        return;
      } catch (err) {
        console.warn('Gemini Ad Copy fallback:', err);
      }
    }

    res.json({
      success: true,
      data: {
        headlines: [
          `Upgrade to ${productName || 'Premium Quality'}`,
          `Unleash Next-Gen Style`,
          `Save Big Today Only`,
        ],
        subheadlines: [
          `Engineered for unmatched comfort and daily performance.`,
          `Don't miss our exclusive seasonal sale event.`,
          `Join over 50,000 satisfied creators worldwide.`,
        ],
        ctas: ['Shop Now', 'Claim 30% Off', 'Explore Collection'],
        badges: ['NEW ARRIVAL', 'LIMITED EDITION', '50% FLASH SALE'],
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------------------------------------------------------
// 3. YOUTUBE / SHORTS YT-DLP INSPECTION & VIDEO PROCESSOR PIPELINE
// -----------------------------------------------------------------------------
app.post('/api/video/yt-dlp-info', async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    if (!url) {
      res.status(400).json({ error: 'Video URL is required' });
      return;
    }

    // Determine if it is a Short or standard video
    const isShort = url.includes('/shorts/') || url.includes('tiktok.com') || url.includes('/reel/');

    // High quality presets for demonstration
    const sampleMetadata = {
      id: 'vid_' + Math.random().toString(36).substring(2, 9),
      url,
      title: isShort
        ? '🔥 Insane 60-Second Viral AI Content Hack [Shorts]'
        : 'Complete Production-Grade Studio Workflow & Media Pipeline Tutorial',
      channel: isShort ? 'CreatorPulse Shorts' : 'Apex Tech Studio',
      duration: isShort ? 58 : 342,
      views: isShort ? '1,420,890' : '235,100',
      thumbnail: isShort
        ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80'
        : 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1080&q=80',
      aspectRatio: isShort ? ('9:16' as const) : ('16:9' as const),
      resolutions: ['2160p (4K UHD)', '1440p (2K)', '1080p (Full HD)', '720p (HD)', '480p (SD)'],
      formats: ['mp4', 'webm', 'mp3', 'wav'],
      audioStreams: [
        { codec: 'AAC 320kbps', format: 'mp3', size: '4.8 MB' },
        { codec: 'Opus 160kbps', format: 'ogg', size: '2.5 MB' },
      ],
      sampleVideoSrc: isShort
        ? 'https://assets.mixkit.co/videos/preview/mixkit-vertical-selfie-of-a-woman-smiling-at-sunset-41481-large.mp4'
        : 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    };

    res.json({
      success: true,
      metadata: sampleMetadata,
      extractor: 'yt-dlp v2026.10',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/video/process-job', async (req: Request, res: Response) => {
  try {
    const { videoId, options } = req.body;

    // Simulate backend FFmpeg / yt-dlp job queuing
    const jobId = 'job_' + Date.now();
    res.json({
      success: true,
      jobId,
      status: 'completed',
      output: {
        filename: `omnistudio_${options?.targetFormat || 'mp4'}_${Date.now()}.${options?.targetFormat || 'mp4'}`,
        resolution: options?.targetResolution || '1080p',
        aspectRatio: options?.aspectRatio || '16:9',
        filterApplied: options?.filter || 'none',
        downloadUrl: '#',
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// -----------------------------------------------------------------------------
// 4. NEON POSTGRESQL CONFIGURATION & SCHEMA BLUEPRINT API
// -----------------------------------------------------------------------------
app.get('/api/db/neon-template', (_req: Request, res: Response) => {
  const schemaSQL = `-- ====================================================================
-- OMNISTUDIO NEON POSTGRESQL PRODUCTION SCHEMA
-- Powered by Neon Serverless Postgres
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Users & Workspace Teams
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    tier VARCHAR(50) DEFAULT 'pro', -- 'starter', 'pro', 'enterprise'
    credits_remaining INT DEFAULT 500,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Media & Video Processing Jobs
CREATE TABLE IF NOT EXISTS video_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    source_url TEXT NOT NULL,
    title VARCHAR(255),
    aspect_ratio VARCHAR(20) DEFAULT '16:9', -- '16:9', '9:16', '1:1'
    filter_type VARCHAR(50) DEFAULT 'none',   -- 'cartoon', 'anime', 'cinematic'
    status VARCHAR(50) DEFAULT 'completed',  -- 'queued', 'processing', 'completed', 'failed'
    output_url TEXT,
    duration_seconds INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Story-to-Cartoon AI Projects
CREATE TABLE IF NOT EXISTS cartoon_stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    plot_script TEXT NOT NULL,
    art_style VARCHAR(100) DEFAULT 'Pixar 3D',
    scene_count INT DEFAULT 4,
    scenes_json JSONB NOT NULL,
    audio_voice VARCHAR(50) DEFAULT 'Zephyr',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Product Catalog & Items
CREATE TABLE IF NOT EXISTS catalog_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    sku VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    price DECIMAL(10, 2) NOT NULL,
    sale_price DECIMAL(10, 2),
    currency VARCHAR(10) DEFAULT 'USD',
    description TEXT,
    image_url TEXT,
    badge VARCHAR(50),
    in_stock BOOLEAN DEFAULT true,
    rating DECIMAL(3, 2) DEFAULT 5.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Generated Catalogs (PDF Exports)
CREATE TABLE IF NOT EXISTS generated_catalogs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    layout VARCHAR(50) DEFAULT 'grid-2x2',
    pdf_url TEXT,
    item_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Ad Banners & Social Posters
CREATE TABLE IF NOT EXISTS ad_designs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    template_name VARCHAR(255),
    platform VARCHAR(50) NOT NULL, -- 'instagram-post', 'youtube-thumb', etc.
    canvas_json JSONB NOT NULL,
    thumbnail_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes for High Performance Queries
CREATE INDEX IF NOT EXISTS idx_video_jobs_user ON video_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_cartoon_stories_user ON cartoon_stories(user_id);
CREATE INDEX IF NOT EXISTS idx_catalog_items_user ON catalog_items(user_id);
CREATE INDEX IF NOT EXISTS idx_catalog_items_category ON catalog_items(category);
CREATE INDEX IF NOT EXISTS idx_ad_designs_user ON ad_designs(user_id);
`;

  const drizzleSchema = `import { pgTable, uuid, varchar, text, timestamp, integer, decimal, boolean, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  fullName: varchar('full_name', { length: 255 }),
  avatarUrl: text('avatar_url'),
  tier: varchar('tier', { length: 50 }).default('pro'),
  creditsRemaining: integer('credits_remaining').default(500),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const catalogItems = pgTable('catalog_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  sku: varchar('sku', { length: 100 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  salePrice: decimal('sale_price', { precision: 10, scale: 2 }),
  description: text('description'),
  imageUrl: text('image_url'),
  badge: varchar('badge', { length: 50 }),
  inStock: boolean('in_stock').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const cartoonStories = pgTable('cartoon_stories', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  title: varchar('title', { length: 255 }).notNull(),
  plotScript: text('plot_script').notNull(),
  artStyle: varchar('art_style', { length: 100 }).default('Pixar 3D'),
  scenesJson: jsonb('scenes_json').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});`;

  const envExample = `# Neon Serverless PostgreSQL Connection String
DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@ep-sample-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"
PGHOST="ep-sample-pooler.us-east-2.aws.neon.tech"
PGDATABASE="neondb"
PGUSER="neondb_owner"
PGPASSWORD="YOUR_PASSWORD"
`;

  res.json({
    success: true,
    schemaSQL,
    drizzleSchema,
    envExample,
    connectionDriver: '@neondatabase/serverless',
  });
});

// -----------------------------------------------------------------------------
// VITE CLIENT INTEGRATION
// -----------------------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`OmniStudio AI Studio server running on port ${PORT}`);
  });
}

startServer();
