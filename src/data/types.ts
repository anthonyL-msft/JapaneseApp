export type Level = 'basic' | 'intermediate' | 'advanced';

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
  level?: Level;               // basic | intermediate | advanced — for scaffolded learning
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
  | 'drinks'
  | 'shopping'
  | 'directions'
  | 'smalltalk'
  | 'culture'
  | 'local'
  | 'emergency'
  | 'vocab'
  | 'power';

export const CATEGORY_INFO: Record<Category, { label: string; emoji: string; labelTC: string }> = {
  greetings:  { label: 'Greetings',              emoji: '👋', labelTC: '問候用語' },
  basics:     { label: 'Basics',                  emoji: '🗣️', labelTC: '基本用語' },
  airport:    { label: 'Airport & Transit',       emoji: '✈️', labelTC: '機場與交通' },
  hotel:      { label: 'Hotel',                   emoji: '🏨', labelTC: '飯店住宿' },
  restaurant: { label: 'Restaurant',               emoji: '🍜', labelTC: '餐廳用餐' },
  food:       { label: 'Food',                      emoji: '🍱', labelTC: '食物' },
  drinks:     { label: 'Drinks',                    emoji: '🍵', labelTC: '飲品' },
  shopping:   { label: 'Shopping',                emoji: '🛍️', labelTC: '購物' },
  directions: { label: 'Directions & Navigation', emoji: '🗺️', labelTC: '問路與導航' },
  smalltalk:  { label: 'Small Talk & Politeness', emoji: '💬', labelTC: '閒聊與禮貌' },
  culture:    { label: 'Culture Tips',            emoji: '⛩️', labelTC: '文化禮儀' },
  local:      { label: 'Local Specials',          emoji: '📍', labelTC: '當地特色' },
  emergency:  { label: 'Emergency & Health',      emoji: '🚑', labelTC: '緊急與醫療' },
  vocab:      { label: 'Vocabulary',              emoji: '🔤', labelTC: '基本單字' },
  power:      { label: 'Power Phrases',            emoji: '⚡', labelTC: '實用短句' },
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

export interface SavedAIPhrase {
  id: string;
  lang: string;
  target: string;
  romanization?: string;
  pronunciation: string;
  pronunciation_chunks: string;
  english: string;
  chinese_tc: string;
  notes: string;
  native_hint?: string;
  query: string;           // the original question
  createdAt: number;
}

export type Tab = 'phrases' | 'scenes' | 'cards' | 'bookmarks' | 'notes' | 'reference' | 'ai' | 'builder' | 'progress' | 'settings' | 'converter' | 'grow' | 'quiz' | 'match' | 'daily' | 'writing' | 'check';
