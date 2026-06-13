import { useState } from 'react';
import type { Phrase, Bookmark, UserNote, RefBookmark, LearnedItem } from '../data/types';
import { PhraseCard } from './PhraseCard';
import { RefItem } from './Reference';
import { speak } from '../utils/tts';

interface Props {
  phrases: Phrase[];
  bookmarks: Bookmark[];
  notes: UserNote[];
  refBookmarks: RefBookmark[];
  learnedItems: LearnedItem[];
  onToggleBookmark: (id: string) => void;
  onToggleRefBookmark: (item: { jp: string; hep: string; en: string; section: string }) => void;
  onToggleLearned: (id: string) => void;
  onSaveNote: (note: UserNote) => void;
  onDeleteNote: (id: string) => void;
  search: string;
}

type Section = 'bookmarks' | 'refbookmarks' | 'learned' | 'ai' | 'notes';

export function MyStuff({ phrases, bookmarks, notes, refBookmarks, learnedItems, onToggleBookmark, onToggleRefBookmark, onToggleLearned, onSaveNote, onDeleteNote, search }: Props) {
  const [expandedPhrase, setExpandedPhrase] = useState<string | null>(null);
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

  const handleSaveEdit = () => {
    if (!editText.trim() || !editingId) return;
    const now = Date.now();
    const existing = notes.find(n => n.id === editingId);
    onSaveNote({ id: editingId, text: editText.trim(), createdAt: existing?.createdAt || now, updatedAt: now });
    setEditingId(null);
    setEditText('');
  };

  const totalItems = bookmarks.length + refBookmarks.length + learnedItems.length + notes.length;

  return (
    <div className="scroll-area h-full">
      <div className="px-4 py-3 border-b border-slate-800">
        <h2 className="text-lg font-bold">📌 My Stuff</h2>
        <p className="text-base text-slate-400">{totalItems} saved items</p>
      </div>

      <div className="p-3 space-y-3">
        {/* ✅ Learned */}
        {learnedItems.length > 0 && (
          <div className="bg-slate-800/60 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection('learned')}
              className="w-full flex items-center justify-between px-3 py-3 text-left active:bg-slate-700/50 transition"
            >
              <div>
                <h3 className="text-base font-semibold text-slate-200">✅ Learned</h3>
                <p className="text-base text-slate-500">{learnedItems.length} mastered</p>
              </div>
              <span className="text-base text-slate-500">{openSections.has('learned') ? '▲' : '▼'}</span>
            </button>
            {openSections.has('learned') && (
              <div className="px-1.5 pb-1.5 space-y-1.5">
                {learnedItems
                  .sort((a, b) => b.createdAt - a.createdAt)
                  .map(item => {
                    const phrase = phrases.find(p => p.id === item.id);
                    if (phrase) {
                      return (
                        <PhraseCard
                          key={item.id}
                          phrase={phrase}
                          isBookmarked={bookmarks.some(b => b.phraseId === phrase.id)}
                          isLearned={true}
                          notes={notes.filter(n => n.phraseId === phrase.id)}
                          expanded={false}
                          onToggleExpand={() => {}}
                          onToggleBookmark={() => onToggleBookmark(phrase.id)}
                          onToggleLearned={() => onToggleLearned(item.id)}
                          onSaveNote={onSaveNote}
                          onDeleteNote={onDeleteNote}
                        />
                      );
                    }
                    const refBm = refBookmarks.find(r => r.id === item.id);
                    if (refBm) {
                      return (
                        <RefItem key={item.id} ex={{ jp: refBm.jp, hep: refBm.hep, en: refBm.en }} data={{ title: refBm.section }} isBm={undefined} isLearned={true} onToggleLearned={() => onToggleLearned(item.id)} />
                      );
                    }
                    return (
                      <div key={item.id} className="bg-slate-700/40 rounded-xl p-3">
                        <div className="flex items-center justify-between">
                          <p className="text-base text-slate-300">{item.id.replace('ref_', '')}</p>
                          <button onClick={() => onToggleLearned(item.id)} className="p-1 rounded-lg active:bg-slate-600 text-lg">✅</button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

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
                    <RefItem key={rb.id} ex={{ jp: rb.jp, hep: rb.hep, en: rb.en }} data={{ title: rb.section }} isBm={true} isLearned={undefined} onToggleRefBookmark={() => onToggleRefBookmark({ jp: rb.jp, hep: rb.hep, en: rb.en, section: rb.section })} />
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
              <div className="px-1.5 pb-1.5 space-y-1.5">
                {aiNotes
                  .sort((a, b) => b.updatedAt - a.updatedAt)
                  .map(note => {
                    // Parse: 🤖 target (pronunciation) — english / chinese_tc
                    const text = note.text.replace(/^🤖\s*/, '');
                    const parenMatch = text.match(/^(.+?)\s*\(([^)]+)\)\s*—\s*(.+)$/);
                    const target = parenMatch ? parenMatch[1].trim() : text;
                    const pron = parenMatch ? parenMatch[2].trim() : '';
                    const rest = parenMatch ? parenMatch[3].trim() : '';
                    const [eng, tc] = rest.includes(' / ') ? rest.split(' / ', 2) : [rest, ''];
                    return (
                      <div key={note.id} className="bg-slate-700/40 rounded-xl p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-lg font-medium text-slate-50">{target}</p>
                            {pron && <p className="text-base text-sakura-300 mt-0.5">{pron}</p>}
                            <p className="text-base text-slate-400 mt-0.5">{eng}</p>
                            {tc && <p className="text-base text-slate-500 mt-0.5">{tc}</p>}
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button onClick={() => speak(target, 'ja-JP')} className="p-1 rounded-lg active:bg-slate-600 text-lg">🔊</button>
                            <button onClick={() => onDeleteNote(note.id)} className="p-1 rounded-lg active:bg-slate-600 text-lg">🗑️</button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
                        <div key={note.id} className="bg-slate-700/30 rounded-xl overflow-hidden">
                          {phrase && (
                            <div className="p-3 pb-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <p className="text-lg font-medium text-slate-50">{phrase.target}</p>
                                  <p className="text-base text-slate-400 mt-0.5">{phrase.english}</p>
                                </div>
                                <button onClick={() => speak(phrase.target, 'ja-JP')} className="p-1 rounded-lg active:bg-slate-600 text-lg shrink-0">🔊</button>
                              </div>
                            </div>
                          )}
                          <div className="p-3 pt-2 flex items-start gap-2">
                            <p className="text-base text-slate-300 flex-1">📝 {note.text}</p>
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
