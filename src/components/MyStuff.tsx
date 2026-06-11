import { useState } from 'react';
import type { Phrase, Bookmark, UserNote, RefBookmark } from '../data/types';
import { PhraseCard } from './PhraseCard';
import { speak } from '../utils/tts';

interface Props {
  phrases: Phrase[];
  bookmarks: Bookmark[];
  notes: UserNote[];
  refBookmarks: RefBookmark[];
  onToggleBookmark: (id: string) => void;
  onToggleRefBookmark: (item: { jp: string; hep: string; en: string; section: string }) => void;
  onSaveNote: (note: UserNote) => void;
  onDeleteNote: (id: string) => void;
  search: string;
}

type Section = 'bookmarks' | 'refbookmarks' | 'ai' | 'notes';

export function MyStuff({ phrases, bookmarks, notes, refBookmarks, onToggleBookmark, onToggleRefBookmark, onSaveNote, onDeleteNote, search }: Props) {
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

  const totalItems = bookmarks.length + refBookmarks.length + notes.length;

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
          <div className="flex gap-2 items-end">
            <textarea
              value={newNoteText}
              onChange={e => setNewNoteText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSaveStandalone(); } }}
              placeholder="WiFi password, restaurant name..."
              rows={1}
              className="flex-1 bg-slate-700/50 text-base text-slate-200 placeholder-slate-500 rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-sakura-400/50 resize-none min-h-[44px] max-h-[120px]"
              style={{ height: 'auto', overflow: 'hidden' }}
              ref={el => { if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; } }}
            />
            <button
              onClick={handleSaveStandalone}
              disabled={!newNoteText.trim()}
              className="bg-sakura-500/80 text-base text-white px-4 py-2.5 rounded-xl disabled:opacity-30 active:bg-sakura-600 transition shrink-0"
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

        {/* 📚 Reference Bookmarks */}
        {refBookmarks.length > 0 && (
          <div className="bg-slate-800/60 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection('refbookmarks')}
              className="w-full flex items-center justify-between px-3 py-3 text-left active:bg-slate-700/50 transition"
            >
              <div>
                <h3 className="text-base font-semibold text-slate-200">📚 Reference Examples</h3>
                <p className="text-base text-slate-500">{refBookmarks.length} saved</p>
              </div>
              <span className="text-base text-slate-500">{openSections.has('refbookmarks') ? '▲' : '▼'}</span>
            </button>
            {openSections.has('refbookmarks') && (
              <div className="px-2 pb-2 space-y-1.5">
                {refBookmarks
                  .sort((a, b) => b.createdAt - a.createdAt)
                  .filter(rb => {
                    if (!search.trim()) return true;
                    const q = search.toLowerCase();
                    return rb.jp.toLowerCase().includes(q) || rb.hep.toLowerCase().includes(q) || rb.en.toLowerCase().includes(q);
                  })
                  .map(rb => (
                    <div key={rb.id} className="bg-slate-700/40 rounded-xl p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-lg font-medium text-slate-50">{rb.jp}</p>
                          <p className="text-base text-sakura-300 mt-0.5">{rb.hep}</p>
                          <p className="text-base text-slate-400 mt-0.5">{rb.en}</p>
                        </div>
                        <button onClick={() => speak(rb.jp, 'ja-JP')} className="p-1 rounded-lg active:bg-slate-600 text-lg shrink-0">🔊</button>
                        <button onClick={() => onToggleRefBookmark({ jp: rb.jp, hep: rb.hep, en: rb.en, section: rb.section })} className="p-1 rounded-lg active:bg-slate-600 text-lg shrink-0">⭐</button>
                      </div>
                      <p className="text-base text-slate-600 mt-1">from {rb.section}</p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

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
                      <p className="text-base text-slate-200 flex-1 whitespace-pre-wrap">{note.text}</p>
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
                          <div className="space-y-2">
                            <textarea
                              value={editText}
                              onChange={e => setEditText(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSaveEdit(); }
                                if (e.key === 'Escape') { setEditingId(null); setEditText(''); }
                              }}
                              autoFocus
                              rows={2}
                              className="w-full bg-slate-600/50 text-base text-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-sakura-400/50 resize-none min-h-[60px] max-h-[150px]"
                            />
                            <div className="flex gap-2 justify-end">
                              <button onClick={() => { setEditingId(null); setEditText(''); }} className="text-base text-slate-500 active:text-slate-300 px-3 py-1 rounded-lg bg-slate-700/50">Cancel</button>
                              <button onClick={handleSaveEdit} className="text-base text-white active:bg-sakura-600 px-3 py-1 rounded-lg bg-sakura-500/80">Save</button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start gap-2">
                            <p className="text-base text-slate-200 flex-1 whitespace-pre-wrap">{note.text}</p>
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
