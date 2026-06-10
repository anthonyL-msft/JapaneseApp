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

type Section = 'bookmarks' | 'ai' | 'notes';

export function MyStuff({ phrases, bookmarks, notes, onToggleBookmark, onSaveNote, onDeleteNote, search }: Props) {
  const [expandedPhrase, setExpandedPhrase] = useState<string | null>(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [openSections, setOpenSections] = useState<Set<Section>>(new Set(['bookmarks']));

  const toggleSection = (s: Section) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  };

  const bookmarkedPhrases = bookmarks
    .sort((a, b) => b.createdAt - a.createdAt)
    .map(b => phrases.find(p => p.id === b.phraseId))
    .filter((p): p is Phrase => !!p)
    .filter(p => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        p.target.toLowerCase().includes(q) ||
        p.pronunciation.toLowerCase().includes(q) ||
        p.english.toLowerCase().includes(q) ||
        p.chinese_tc.toLowerCase().includes(q)
      );
    });

  const aiNotes = notes.filter(n => !n.phraseId && n.text.startsWith('🤖'));
  const standaloneNotes = notes.filter(n => !n.phraseId && !n.text.startsWith('🤖'));
  const phraseNotes = notes.filter(n => n.phraseId);

  const handleSaveStandalone = () => {
    if (!newNoteText.trim()) return;
    const now = Date.now();
    onSaveNote({ id: `sn_${now}`, text: newNoteText.trim(), createdAt: now, updatedAt: now });
    setNewNoteText('');
  };

  const handleSaveEdit = () => {
    if (!editText.trim() || !editingId) return;
    const now = Date.now();
    const existing = notes.find(n => n.id === editingId);
    onSaveNote({ id: editingId, text: editText.trim(), createdAt: existing?.createdAt || now, updatedAt: now });
    setEditingId(null);
    setEditText('');
  };

  const totalItems = bookmarks.length + notes.length;

  return (
    <div className="scroll-area h-full">
      <div className="px-4 py-3 border-b border-slate-800">
        <h2 className="text-lg font-bold">📌 My Stuff</h2>
        <p className="text-base text-slate-400">{totalItems} saved items</p>
      </div>

      <div className="p-3 space-y-3">
        {/* Quick Note Input */}
        <div className="bg-slate-800/60 rounded-xl p-3">
          <p className="text-base text-slate-400 mb-2">Quick Note</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={newNoteText}
              onChange={e => setNewNoteText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSaveStandalone()}
              placeholder="WiFi password, restaurant name..."
              className="flex-1 bg-slate-700/50 text-base text-slate-200 placeholder-slate-500 rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-sakura-400/50"
            />
            <button
              onClick={handleSaveStandalone}
              disabled={!newNoteText.trim()}
              className="bg-sakura-500/80 text-base text-white px-4 py-2.5 rounded-xl disabled:opacity-30 active:bg-sakura-600 transition"
            >
              Add
            </button>
          </div>
        </div>

        {/* ⭐ Bookmarked Phrases */}
        <div className="bg-slate-800/60 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('bookmarks')}
            className="w-full flex items-center justify-between px-3 py-3 text-left active:bg-slate-700/50 transition"
          >
            <div>
              <h3 className="text-base font-semibold text-slate-200">⭐ Bookmarked Phrases</h3>
              <p className="text-base text-slate-500">{bookmarkedPhrases.length} phrases</p>
            </div>
            <span className="text-base text-slate-500">{openSections.has('bookmarks') ? '▲' : '▼'}</span>
          </button>
          {openSections.has('bookmarks') && (
            <div className="px-2 pb-2 space-y-1.5">
              {bookmarkedPhrases.length === 0 ? (
                <p className="text-base text-slate-500 text-center py-4">Tap ☆ on any phrase to bookmark it</p>
              ) : (
                bookmarkedPhrases.map(phrase => (
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
                ))
              )}
            </div>
          )}
        </div>

        {/* 🤖 AI Translations */}
        {aiNotes.length > 0 && (
          <div className="bg-slate-800/60 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection('ai')}
              className="w-full flex items-center justify-between px-3 py-3 text-left active:bg-slate-700/50 transition"
            >
              <div>
                <h3 className="text-base font-semibold text-slate-200">🤖 AI Translations</h3>
                <p className="text-base text-slate-500">{aiNotes.length} saved</p>
              </div>
              <span className="text-base text-slate-500">{openSections.has('ai') ? '▲' : '▼'}</span>
            </button>
            {openSections.has('ai') && (
              <div className="px-3 pb-3 space-y-2">
                {aiNotes
                  .sort((a, b) => b.updatedAt - a.updatedAt)
                  .map(note => (
                    <div key={note.id} className="bg-slate-700/30 rounded-xl p-3 flex items-start gap-2">
                      <p className="text-base text-slate-200 flex-1">{note.text}</p>
                      <button
                        onClick={() => onDeleteNote(note.id)}
                        className="text-base text-slate-500 hover:text-red-400 shrink-0"
                      >🗑️</button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* 📝 Personal Notes */}
        <div className="bg-slate-800/60 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('notes')}
            className="w-full flex items-center justify-between px-3 py-3 text-left active:bg-slate-700/50 transition"
          >
            <div>
              <h3 className="text-base font-semibold text-slate-200">📝 Personal Notes</h3>
              <p className="text-base text-slate-500">{standaloneNotes.length + phraseNotes.length} notes</p>
            </div>
            <span className="text-base text-slate-500">{openSections.has('notes') ? '▲' : '▼'}</span>
          </button>
          {openSections.has('notes') && (
            <div className="px-3 pb-3 space-y-2">
              {standaloneNotes.length === 0 && phraseNotes.length === 0 ? (
                <p className="text-base text-slate-500 text-center py-4">Add notes above or tap any phrase to add remarks</p>
              ) : (
                <>
                  {standaloneNotes
                    .sort((a, b) => b.updatedAt - a.updatedAt)
                    .map(note => (
                      <div key={note.id} className="bg-slate-700/30 rounded-xl p-3">
                        {editingId === note.id ? (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={editText}
                              onChange={e => setEditText(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') handleSaveEdit();
                                if (e.key === 'Escape') { setEditingId(null); setEditText(''); }
                              }}
                              autoFocus
                              className="flex-1 bg-slate-600/50 text-base text-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-sakura-400/50"
                            />
                            <button onClick={handleSaveEdit} className="text-base text-sakura-400 active:text-sakura-300 px-2">✓</button>
                            <button onClick={() => { setEditingId(null); setEditText(''); }} className="text-base text-slate-500 active:text-slate-300 px-2">✕</button>
                          </div>
                        ) : (
                          <div className="flex items-start gap-2">
                            <p className="text-base text-slate-200 flex-1">{note.text}</p>
                            <button
                              onClick={() => { setEditText(note.text); setEditingId(note.id); }}
                              className="text-base text-slate-500 hover:text-slate-300 shrink-0"
                            >✏️</button>
                            <button
                              onClick={() => onDeleteNote(note.id)}
                              className="text-base text-slate-500 hover:text-red-400 shrink-0"
                            >🗑️</button>
                          </div>
                        )}
                      </div>
                    ))}
                  {phraseNotes
                    .sort((a, b) => b.updatedAt - a.updatedAt)
                    .map(note => {
                      const phrase = phrases.find(p => p.id === note.phraseId);
                      return (
                        <div key={note.id} className="bg-slate-700/30 rounded-xl p-3">
                          {phrase && (
                            <p className="text-base text-sakura-400 mb-1">
                              {phrase.target} · {phrase.pronunciation}
                            </p>
                          )}
                          <div className="flex items-start gap-2">
                            <p className="text-base text-slate-300 flex-1">{note.text}</p>
                            <button
                              onClick={() => onDeleteNote(note.id)}
                              className="text-base text-slate-500 hover:text-red-400 shrink-0"
                            >🗑️</button>
                          </div>
                        </div>
                      );
                    })}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
