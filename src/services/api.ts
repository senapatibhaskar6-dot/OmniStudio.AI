import { VideoInfo, StoryScene } from '../types';

export async function fetchVideoInfo(url: string): Promise<VideoInfo> {
  const res = await fetch('/api/video/yt-dlp-info', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
  if (!res.ok) {
    throw new Error('Failed to retrieve video details');
  }
  const data = await res.json();
  return data.metadata;
}

export async function processVideoJob(videoId: string, options: any) {
  const res = await fetch('/api/video/process-job', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ videoId, options }),
  });
  if (!res.ok) {
    throw new Error('Video processing request failed');
  }
  return await res.json();
}

export async function generateStoryScenes(params: {
  storyPlot: string;
  style?: string;
  sceneCount?: number;
  characterNotes?: string;
}): Promise<{ title: string; synopsis: string; scenes: StoryScene[] }> {
  const res = await fetch('/api/ai/story-to-cartoon', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error('Failed to generate story scenes');
  }
  const result = await res.json();
  return result.data;
}

export async function generateAdCopy(params: {
  productName: string;
  audience?: string;
  discount?: string;
  tone?: string;
}) {
  const res = await fetch('/api/ai/enhance-ad-copy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error('Failed to generate ad copy');
  }
  const result = await res.json();
  return result.data;
}

export async function getNeonDbTemplate() {
  const res = await fetch('/api/db/neon-template');
  if (!res.ok) {
    throw new Error('Failed to fetch Neon DB blueprint');
  }
  return await res.json();
}
