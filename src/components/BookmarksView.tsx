import { useState } from 'react';
import type { Phrase, Bookmark, UserNote } from '../data/types';
import { PhraseCard } from './PhraseCard';

interface Props {
  phrases: Phrase[];
  bookmarks: Bookmark[];
  notes: UserNote[];
  onToggleBookmark: (id: string) => void;
  onSaveNote: (note: UserNote) => void;
  onDeleteNote: (id: string) => void;
  search: string;
}

export function BookmarksView({ phrases, bookmarks, notes, onToggleBookmark, onSaveNote, onDeleteNote, search }: Props) {
  const [expandedPhrase, setExpandedPhrase] = useState<string | null>(null);

  const bookmarkedPhrases = bookmarks
    .sort((a, b) => b.createdAt - a.createdAt)
    .map(b => phrases.find(p => p.id === b.phraseId))
    .filter((p): p is Phrase => !!p)
    .filter(p => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        p.japanese.toLowerCase().includes(q) ||
        p.hepburn.toLowerCase().includes(q) ||
        p.english.toLowerCase().includes(q) ||
        p.chinese_tc.toLowerCase().includes(q)
      );
    });

  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center">
        <p className="text-4xl mb-4">⭐</p>
        <p className="text-lg font-semibold text-slate-200">No bookmarks yet</p>
        <p className="text-sm text-slate-400 mt-2">
          Tap the ☆ on any phrase to save it here for quick access during your trip.
        </p>
      </div>
    );
  }

  return (
    <div className="scroll-area h-full">
      <div className="px-4 py-3 border-b border-slate-800">
        <h2 className="text-lg font-bold">⭐ Saved Phrases</h2>
        <p className="text-xs text-slate-400">{bookmarkedPhrases.length} bookmarked phrases</p>
      </div>

      <div className="p-4 space-y-2">
        {bookmarkedPhrases.map(phrase => (
          <PhraseCard
            key={phrase.id}
            phrase={phrase}
            isBookmarked={true}
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
  );
}
