import { useState } from 'react';
import type { Phrase, UserNote, Category } from '../data/types';
import { CATEGORY_INFO } from '../data/types';
import { PhraseCard } from './PhraseCard';
import { Reference } from './Reference';

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
  const [openSituations, setOpenSituations] = useState<Set<string>>(new Set());
  const [showReference, setShowReference] = useState(false);

  const toggleSituation = (situation: string) => {
    setOpenSituations(prev => {
      const next = new Set(prev);
      if (next.has(situation)) next.delete(situation);
      else next.add(situation);
      return next;
    });
  };

  const categories = Object.entries(CATEGORY_INFO) as [Category, typeof CATEGORY_INFO[Category]][];

  if (showReference) {
    return (
      <div className="h-full flex flex-col">
        <div className="px-4 pt-3 pb-2 border-b border-slate-800 bg-slate-950/95">
          <button onClick={() => setShowReference(false)} className="text-sakura-400 text-sm flex items-center gap-1">
            ← Back to Phrases
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <Reference />
        </div>
      </div>
    );
  }

  if (!selectedCategory) {
    // Category grid
    return (
      <div className="scroll-area h-full p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold mb-0.5">📖 Phrase Book</h1>
            <p className="text-slate-400 text-sm">Select a category to start learning</p>
          </div>
          <button
            onClick={() => setShowReference(true)}
            className="bg-slate-800 text-slate-300 text-xs px-3 py-2 rounded-xl active:bg-slate-700 transition shrink-0"
          >
            📚 Reference
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {categories.map(([key, info]) => {
            const catPhrases = phrases.filter(p => p.category === key);
            const bookmarked = catPhrases.filter(p => bookmarkedIds.has(p.id)).length;
            return (
              <button
                key={key}
                onClick={() => { setSelectedCategory(key); setOpenSituations(new Set()); }}
                className="bg-slate-800/80 rounded-2xl p-4 text-left active:bg-slate-700 transition-colors"
              >
                <span className="text-2xl">{info.emoji}</span>
                <h3 className="text-sm font-semibold mt-2 text-slate-100">{info.label}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{info.labelTC}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {catPhrases.length} phrases
                  {bookmarked > 0 && <span className="text-amber-400"> · ⭐ {bookmarked}</span>}
                </p>
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
          onClick={() => { setSelectedCategory(null); setOpenSituations(new Set()); }}
          className="text-sakura-400 text-sm mb-1 flex items-center gap-1"
        >
          ← All Categories
        </button>
        <h2 className="text-lg font-bold">{info.emoji} {info.label}</h2>
        <p className="text-xs text-slate-400">{info.labelTC} · {categoryPhrases.length} phrases</p>
      </div>

      <div className="px-3 py-3 space-y-2">
        {Array.from(situations.entries()).map(([situation, pList]) => {
          const isOpen = openSituations.has(situation);
          return (
            <div key={situation} className="bg-slate-800/60 rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleSituation(situation)}
                className="w-full flex items-center justify-between p-3.5 active:bg-slate-700/50 transition"
              >
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">{situation}</h3>
                  <p className="text-[10px] text-slate-500">{pList.length} phrases</p>
                </div>
                <span className="text-slate-500 text-xs">{isOpen ? '▲' : '▼'}</span>
              </button>
              {isOpen && (
                <div className="px-2 pb-2 space-y-1.5">
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
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
