import { useState } from 'react';
import type { Phrase, UserNote, Category } from '../data/types';
import { CATEGORY_INFO } from '../data/types';
import { PhraseCard } from './PhraseCard';

interface Props {
  phrases: Phrase[];
  bookmarkedIds: Set<string>;
  notes: UserNote[];
  onToggleBookmark: (id: string) => void;
  onSaveNote: (note: UserNote) => void;
  onDeleteNote: (id: string) => void;
}

export function PhraseBook({ phrases, bookmarkedIds, notes, onToggleBookmark, onSaveNote, onDeleteNote }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [expandedPhrase, setExpandedPhrase] = useState<string | null>(null);

  const categories = Object.entries(CATEGORY_INFO) as [Category, typeof CATEGORY_INFO[Category]][];

  if (!selectedCategory) {
    // Category grid
    return (
      <div className="scroll-area h-full p-4">
        <h1 className="text-xl font-bold mb-1">📖 Phrase Book</h1>
        <p className="text-slate-400 text-sm mb-4">Select a category to start learning</p>
        <div className="grid grid-cols-2 gap-3">
          {categories.map(([key, info]) => {
            const count = phrases.filter(p => p.category === key).length;
            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className="bg-slate-800/80 rounded-2xl p-4 text-left active:bg-slate-700 transition-colors"
              >
                <span className="text-2xl">{info.emoji}</span>
                <h3 className="text-sm font-semibold mt-2 text-slate-100">{info.label}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{info.labelTC}</p>
                <p className="text-xs text-slate-500 mt-1">{count} phrases</p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Phrase list for selected category
  const categoryPhrases = phrases.filter(p => p.category === selectedCategory);
  const info = CATEGORY_INFO[selectedCategory];

  // Group by situation
  const situations = new Map<string, Phrase[]>();
  categoryPhrases.forEach(p => {
    const list = situations.get(p.situation) || [];
    list.push(p);
    situations.set(p.situation, list);
  });

  return (
    <div className="scroll-area h-full">
      <div className="sticky top-0 z-10 bg-slate-950/95 backdrop-blur-sm px-4 py-3 border-b border-slate-800">
        <button
          onClick={() => setSelectedCategory(null)}
          className="text-sakura-400 text-sm mb-1 flex items-center gap-1"
        >
          ← All Categories
        </button>
        <h2 className="text-lg font-bold">{info.emoji} {info.label}</h2>
        <p className="text-xs text-slate-400">{info.labelTC} · {categoryPhrases.length} phrases</p>
      </div>

      <div className="p-4 space-y-6">
        {Array.from(situations.entries()).map(([situation, pList]) => (
          <div key={situation}>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{situation}</h3>
            <div className="space-y-2">
              {pList.map(phrase => (
                <PhraseCard
                  key={phrase.id}
                  phrase={phrase}
                  isBookmarked={bookmarkedIds.has(phrase.id)}
                  notes={notes.filter(n => n.phraseId === phrase.id)}
                  expanded={expandedPhrase === phrase.id}
                  onToggleExpand={() => setExpandedPhrase(expandedPhrase === phrase.id ? null : phrase.id)}
                  onToggleBookmark={() => onToggleBookmark(phrase.id)}
                  onSaveNote={onSaveNote}
                  onDeleteNote={onDeleteNote}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
