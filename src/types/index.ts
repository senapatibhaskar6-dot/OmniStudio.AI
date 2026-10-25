export type StudioTab = 
  | 'overview'
  | 'video-processor'
  | 'face-swap-filter'
  | 'story-to-cartoon'
  | 'pdf-catalog'
  | 'ad-banner-maker'
  | 'neon-db'
  | 'setup-guide';

export interface VideoInfo {
  id: string;
  url: string;
  title: string;
  channel: string;
  duration: number; // in seconds
  thumbnail: string;
  views: string;
  resolutions: string[];
  formats: ('mp4' | 'webm' | 'mp3' | 'wav')[];
  aspectRatio: '16:9' | '9:16' | '1:1';
}

export interface VideoProcessOptions {
  startTime: number;
  endTime: number;
  targetResolution: string;
  targetFormat: 'mp4' | 'webm' | 'mp3';
  aspectRatio: '16:9' | '9:16' | '1:1';
  speed: number;
  removeAudio: boolean;
  addWatermark: boolean;
  watermarkText?: string;
  burnSubtitles: boolean;
  filter: 'none' | 'cartoon' | 'anime' | 'cinematic' | 'vibrant';
}

export interface StoryScene {
  id: string;
  sceneNumber: number;
  title: string;
  visualPrompt: string;
  dialogue: string;
  duration: number; // in seconds
  cameraMovement: 'zoom-in' | 'pan-left' | 'pan-right' | 'zoom-out' | 'static';
  bgTheme: string;
  accentColor: string;
  characterAction: string;
  svgSceneType: 'city' | 'nature' | 'space' | 'castle' | 'lab';
}

export interface CartoonStyle {
  id: string;
  name: string;
  description: string;
  previewUrl: string;
  promptModifier: string;
  colorPalette: string[];
}

export interface CatalogProduct {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  salePrice?: number;
  description: string;
  imageUrl: string;
  badge?: 'NEW' | 'HOT' | 'SALE' | 'BESTSELLER' | 'LIMITED';
  inStock: boolean;
  rating: number;
}

export interface CatalogSettings {
  catalogTitle: string;
  companyName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  currency: string;
  primaryColor: string;
  secondaryColor: string;
  layout: 'grid-2x2' | 'grid-3x2' | 'luxury-list';
  showPrices: boolean;
  showSku: boolean;
  headerNote: string;
  footerNote: string;
  coverImage?: string;
}

export interface AdBannerElement {
  id: string;
  type: 'headline' | 'subhead' | 'badge' | 'cta' | 'product-img' | 'sticker';
  text?: string;
  color?: string;
  bgColor?: string;
  fontSize?: number;
  x: number; // percentage
  y: number; // percentage
  rotation?: number;
}

export interface AdTemplate {
  id: string;
  name: string;
  platform: 'instagram-post' | 'instagram-story' | 'youtube-thumb' | 'facebook-ad' | 'linkedin-banner';
  width: number;
  height: number;
  aspectLabel: string;
  bgGradient: string;
  headline: string;
  subhead: string;
  badge: string;
  ctaText: string;
  productImg: string;
}
