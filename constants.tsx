import React from 'react';
import { Youtube, Twitter, MessageCircle, Instagram, BookOpen, Video, Tv } from 'lucide-react';
import { PlatformConfig, PlatformId } from './types';

export const PLATFORMS: PlatformConfig[] = [
  {
    id: 'youtube',
    name: 'YouTube',
    icon: 'Youtube',
    color: 'text-red-500',
    placeholder: 'SEO focused, long description...',
    description: 'Optimized for search, timecodes, and detailed info.',
    aspectRatio: '16:9'
  },
  {
    id: 'bilibili',
    name: 'Bilibili (B站)',
    icon: 'Tv',
    color: 'text-pink-400',
    placeholder: 'Memes, "Sanlian", medium-long form...',
    description: 'Bullet comment culture, professional or entertaining, 16:9.',
    aspectRatio: '16:9'
  },
  {
    id: 'tiktok',
    name: 'TikTok / Douyin',
    icon: 'Video',
    color: 'text-black dark:text-white',
    placeholder: 'Short, punchy, trending tags...',
    description: 'High energy, viral hooks, trending hashtags.',
    aspectRatio: '9:16'
  },
  {
    id: 'xiaohongshu',
    name: 'Xiaohongshu (Red)',
    icon: 'Instagram',
    color: 'text-pink-500',
    placeholder: 'Emoji heavy, "Sisters!", experience sharing...',
    description: 'Lifestyle focused, emoji-rich, "Title + Text" format.',
    aspectRatio: '3:4'
  },
  {
    id: 'wechat',
    name: 'WeChat Channels (视频号)',
    icon: 'MessageCircle',
    color: 'text-green-500',
    placeholder: 'Engaging title, community-focused...',
    description: 'Strictly for Video Accounts (feed). Short, social & authentic.',
    aspectRatio: '9:16'
  },
  {
    id: 'twitter',
    name: 'Twitter / X',
    icon: 'Twitter',
    color: 'text-blue-400',
    placeholder: 'Under 280 chars, thread hook...',
    description: 'Concise, witty, thread-starter style.',
    aspectRatio: '16:9'
  },
  {
    id: 'zhihu',
    name: 'Zhihu',
    icon: 'BookOpen',
    color: 'text-blue-600',
    placeholder: 'Intellectual, Q&A style, professional...',
    description: 'Deep dive, professional, knowledge-sharing tone.',
    aspectRatio: '16:9'
  }
];

export const TONES = [
  { value: 'professional', label: 'Professional / 专业' },
  { value: 'funny', label: 'Funny & Witty / 幽默' },
  { value: 'emotional', label: 'Emotional / 情感' },
  { value: 'casual', label: 'Casual & Friendly / 亲切' },
  { value: 'sales', label: 'Sales / 种草带货' },
];

export const getIcon = (iconName: string, className?: string) => {
  const props = { className };
  switch (iconName) {
    case 'Youtube': return <Youtube {...props} />;
    case 'Twitter': return <Twitter {...props} />;
    case 'MessageCircle': return <MessageCircle {...props} />;
    case 'Instagram': return <Instagram {...props} />;
    case 'BookOpen': return <BookOpen {...props} />;
    case 'Video': return <Video {...props} />;
    case 'Tv': return <Tv {...props} />;
    default: return <Video {...props} />;
  }
};