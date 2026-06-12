export interface Phrase {
  id: string;
  lang: string;
  target: string;              // phrase in target language
  romanization?: string;       // phonetic reading (hiragana for JP, not needed for Latin scripts)
  pronunciation: string;       // romanized pronunciation guide
  pronunciation_chunks?: string; // syllable-broken: ku·u·kou, por·fa·vor
  english: string;
  chinese_tc: string;
  category: Category;
  situation: string;
  difficulty: 1 | 2 | 3;
  notes: string;
  native_hint?: string;        // kanji bridge for JP, cognate hints for ES/FR
}

export interface LanguageConfig {
  code: string;
  name: string;
  nameNative: string;
  flag: string;
  ttsLang: string;
  hasRomanization: boolean;    // true for JP/KR, false for Latin-script languages
}

export const LANGUAGES: LanguageConfig[] = [
  { code: 'ja', name: 'Japanese', nameNative: '日本語', flag: '🇯🇵', ttsLang: 'ja-JP', hasRomanization: true },
  { code: 'es', name: 'Spanish', nameNative: 'Español', flag: '🇪🇸', ttsLang: 'es-ES', hasRomanization: false },
  { code: 'fr', name: 'French', nameNative: 'Français', flag: '🇫🇷', ttsLang: 'fr-FR', hasRomanization: false },
];

export type Category =
  | 'greetings'
  | 'basics'
  | 'airport'
  | 'hotel'
  | 'restaurant'
  | 'food'
  | 'shopping'
  | 'directions'
  | 'emergency'
  | 'smalltalk'
  | 'culture'
  | 'local';

export const CATEGORY_INFO: Record<Category, { label: string; emoji: string; labelTC: string }> = {
  greetings:  { label: 'Greetings',              emoji: '👋', labelTC: '問候用語' },
  basics:     { label: 'Basics & Vocab',          emoji: '🔤', labelTC: '基本單字與用語' },
  airport:    { label: 'Airport & Transit',       emoji: '✈️', labelTC: '機場與交通' },
  hotel:      { label: 'Hotel',                   emoji: '🏨', labelTC: '飯店住宿' },
  restaurant: { label: 'Restaurant',               emoji: '🍜', labelTC: '餐廳用餐' },
  food:       { label: 'Food & Drinks',             emoji: '🍱', labelTC: '食物與飲品' },
  shopping:   { label: 'Shopping',                emoji: '🛍️', labelTC: '購物' },
  directions: { label: 'Directions & Navigation', emoji: '🗺️', labelTC: '問路與導航' },
  emergency:  { label: 'Emergency & Health',      emoji: '🚑', labelTC: '緊急與醫療' },
  smalltalk:  { label: 'Small Talk & Politeness', emoji: '💬', labelTC: '閒聊與禮貌' },
  culture:    { label: 'Culture Tips',            emoji: '⛩️', labelTC: '文化禮儀' },
  local:      { label: 'Local Specials',          emoji: '📍', labelTC: '當地特色' },
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

export interface RefBookmark {
  id: string;
  jp: string;
  hep: string;
  en: string;
  section: string;
  createdAt: number;
}

export interface LearnedItem {
  id: string;
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

export type Tab = 'phrases' | 'scenes' | 'cards' | 'bookmarks' | 'notes' | 'reference' | 'ai' | 'builder' | 'progress' | 'settings' | 'converter';
