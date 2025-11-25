export type PlatformId = 'youtube' | 'tiktok' | 'wechat' | 'xiaohongshu' | 'twitter' | 'zhihu' | 'bilibili';

export interface PlatformConfig {
  id: PlatformId;
  name: string;
  icon: string; // Lucide icon name or emoji
  color: string;
  placeholder: string;
  description: string;
  aspectRatio: "16:9" | "9:16" | "3:4" | "1:1"; // For image generation
}

export interface BilingualText {
  zh: string;
  en: string;
}

export interface BilingualTags {
  zh: string[];
  en: string[];
}

export interface GeneratedContent {
  platformId: string;
  title: BilingualText;
  content: BilingualText;
  tags: BilingualTags;
  coverText: string; // Usually overlaid, kept as single string but can be mixed
  visualPrompt: string; // Prompt for the AI image generator
  extraMetadata?: string; // e.g. BGM suggestions, Location tagging tips
}

export interface GenerateRequest {
  description: string;
  platforms: PlatformId[];
  tone: string;
}