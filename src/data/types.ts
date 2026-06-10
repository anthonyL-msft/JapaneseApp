export interface Phrase {
  id: string;
  japanese: string;
  reading: string;
  hepburn: string;
  hepburn_chunks?: string; // syllable-broken pronunciation: ku·u·kou
  english: string;
  chinese_tc: string;
  category: Category;
  situation: string;
  difficulty: 1 | 2 | 3;
  notes: string;
  kanji_bridge?: string; // Chinese kanji meaning hint
}

export type Category =
  | 'greetings'
  | 'airport'
  | 'hotel'
  | 'restaurant'
  | 'shopping'
  | 'directions'
  | 'emergency'
  | 'smalltalk'
  | 'culture';

export const CATEGORY_INFO: Record<Category, { label: string; emoji: string; labelTC: string }> = {
  greetings:  { label: 'Greetings & Basics',     emoji: '👋', labelTC: '問候與基本用語' },
  airport:    { label: 'Airport & Transit',       emoji: '✈️', labelTC: '機場與交通' },
  hotel:      { label: 'Hotel',                   emoji: '🏨', labelTC: '飯店住宿' },
  restaurant: { label: 'Restaurant & Food',       emoji: '🍜', labelTC: '餐廳與美食' },
  shopping:   { label: 'Shopping',                emoji: '🛍️', labelTC: '購物' },
  directions: { label: 'Directions & Navigation', emoji: '🗺️', labelTC: '問路與導航' },
  emergency:  { label: 'Emergency & Health',      emoji: '🚑', labelTC: '緊急與醫療' },
  smalltalk:  { label: 'Small Talk & Politeness', emoji: '💬', labelTC: '閒聊與禮貌' },
  culture:    { label: 'Culture Tips',            emoji: '⛩️', labelTC: '文化禮儀' },
};

export interface UserNote {
  id: string;
  phraseId?: string; // if attached to a phrase
  text: string;
  createdAt: number;
  updatedAt: number;
}

export interface Bookmark {
  phraseId: string;
  createdAt: number;
}

export interface SRSCard {
  phraseId: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: number;
  lastReview: number;
}

export type Tab = 'phrases' | 'scenes' | 'cards' | 'bookmarks' | 'notes' | 'reference';
