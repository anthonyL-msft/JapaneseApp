import { useState, useRef } from 'react';
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
  const [selectedSituation, setSelectedSituation] = useState<string>('all');
  const [showReference, setShowReference] = useState(false);
  const sectionRefs = useRef<Map<string, HTMLDivElement>>(new Map());

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
                onClick={() => { setSelectedCategory(key); setSelectedSituation('all'); }}
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

  const situationKeys = Array.from(situations.keys());

  const handleSituationChange = (value: string) => {
    setSelectedSituation(value);
    if (value !== 'all') {
      const el = sectionRefs.current.get(value);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const visibleSituations = selectedSituation === 'all'
    ? Array.from(situations.entries())
    : Array.from(situations.entries()).filter(([s]) => s === selectedSituation);

  return (
    <div className="scroll-area h-full">
      <div className="sticky top-0 z-10 bg-slate-950/95 backdrop-blur-sm px-4 py-3 border-b border-slate-800">
        <div className="flex items-start justify-between gap-2">
          <div>
            <button
              onClick={() => { setSelectedCategory(null); setSelectedSituation('all'); }}
              className="text-sakura-400 text-sm mb-1 flex items-center gap-1"
            >
              ← All Categories
            </button>
            <h2 className="text-lg font-bold">{info.emoji} {info.label}</h2>
            <p className="text-xs text-slate-400">{info.labelTC} · {categoryPhrases.length} phrases</p>
          </div>

          {/* Situation filter dropdown */}
          <select
            value={selectedSituation}
            onChange={e => handleSituationChange(e.target.value)}
            className="mt-5 bg-slate-800 text-slate-200 text-xs rounded-lg px-2 py-1.5 border border-slate-700 outline-none focus:ring-1 focus:ring-sakura-400/50 max-w-[140px] shrink-0"
          >
            <option value="all">All groups</option>
            {situationKeys.map(s => (
              <option key={s} value={s}>{s} ({situations.get(s)?.length})</option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {visibleSituations.map(([situation, pList]) => (
          <div
            key={situation}
            ref={el => { if (el) sectionRefs.current.set(situation, el); }}
          >
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
