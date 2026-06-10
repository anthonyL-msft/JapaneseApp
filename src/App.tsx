import { useState, useEffect, useCallback } from 'react';
import type { Tab, Bookmark, UserNote } from './data/types';
import { LANGUAGES } from './data/types';
import { phrases as allPhrases } from './data/phrases';
import { getBookmarks, addBookmark, removeBookmark, getNotes, saveNote, deleteNote } from './db';
import { PhraseBook } from './components/PhraseBook';
import { Flashcards } from './components/Flashcards';
import { BookmarksView } from './components/BookmarksView';
import { NotesView } from './components/NotesView';
import { Reference } from './components/Reference';
import { Scenarios } from './components/Scenarios';
import { AskAI } from './components/AskAI';
import { SearchBar } from './components/SearchBar';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'phrases', label: 'Phrases', icon: '📖' },
  { id: 'scenes', label: 'Scenes', icon: '🎭' },
  { id: 'ai', label: 'Ask AI', icon: '🤖' },
  { id: 'bookmarks', label: 'Saved', icon: '⭐' },
  { id: 'notes', label: 'Notes', icon: '📝' },
];

function App() {
  const [tab, setTab] = useState<Tab>('phrases');
  const [search, setSearch] = useState('');
  const [lang, setLang] = useState('ja');
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [notes, setNotes] = useState<UserNote[]>([]);
  const currentLang = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  useEffect(() => {
    getBookmarks().then(setBookmarks);
    getNotes().then(setNotes);
  }, []);

  const toggleBookmark = useCallback(async (phraseId: string) => {
    const existing = bookmarks.find(b => b.phraseId === phraseId);
    if (existing) {
      await removeBookmark(phraseId);
      setBookmarks(prev => prev.filter(b => b.phraseId !== phraseId));
    } else {
      await addBookmark(phraseId);
      setBookmarks(prev => [...prev, { phraseId, createdAt: Date.now() }]);
    }
  }, [bookmarks]);

  const handleSaveNote = useCallback(async (note: UserNote) => {
    await saveNote(note);
    setNotes(prev => {
      const idx = prev.findIndex(n => n.id === note.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = note;
        return next;
      }
      return [...prev, note];
    });
  }, []);

  const handleDeleteNote = useCallback(async (id: string) => {
    await deleteNote(id);
    setNotes(prev => prev.filter(n => n.id !== id));
  }, []);

  const bookmarkedIds = new Set(bookmarks.map(b => b.phraseId));

  const langPhrases = allPhrases.filter(p => p.lang === lang);

  const filteredPhrases = search.trim()
    ? langPhrases.filter(p => {
        const q = search.toLowerCase();
        return (
          p.target.toLowerCase().includes(q) ||
          (p.romanization?.toLowerCase().includes(q) ?? false) ||
          p.pronunciation.toLowerCase().includes(q) ||
          p.english.toLowerCase().includes(q) ||
          p.chinese_tc.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.situation.toLowerCase().includes(q) ||
          p.notes.toLowerCase().includes(q) ||
          (p.native_hint?.toLowerCase().includes(q) ?? false) ||
          notes.some(n => n.phraseId === p.id && n.text.toLowerCase().includes(q))
        );
      })
    : langPhrases;

  return (
    <div className="flex flex-col h-full">
      {/* Search Bar */}
      <SearchBar value={search} onChange={setSearch} lang={lang} onLangChange={setLang} />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {tab === 'phrases' && (
          <PhraseBook
            phrases={filteredPhrases}
            bookmarkedIds={bookmarkedIds}
            notes={notes}
            onToggleBookmark={toggleBookmark}
            onSaveNote={handleSaveNote}
            onDeleteNote={handleDeleteNote}
            onShowCards={() => setTab('cards')}
          />
        )}
        {tab === 'cards' && (
          <Flashcards phrases={langPhrases} />
        )}
        {tab === 'bookmarks' && (
          <BookmarksView
            phrases={langPhrases}
            bookmarks={bookmarks}
            notes={notes}
            onToggleBookmark={toggleBookmark}
            onSaveNote={handleSaveNote}
            onDeleteNote={handleDeleteNote}
            search={search}
          />
        )}
        {tab === 'notes' && (
          <NotesView
            phrases={langPhrases}
            notes={notes}
            onSaveNote={handleSaveNote}
            onDeleteNote={handleDeleteNote}
          />
        )}
        {tab === 'reference' && <Reference />}
        {tab === 'scenes' && <Scenarios lang={lang} langConfig={currentLang} />}
        {tab === 'ai' && <AskAI lang={lang} />}
        {tab === 'cards' && <Flashcards phrases={langPhrases} />}
      </div>

      {/* Bottom Navigation */}
      <nav className="flex border-t border-slate-800 bg-slate-900/95 backdrop-blur-sm" style={{ paddingBottom: 'var(--safe-bottom)' }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex flex-col items-center py-2 text-xs transition-colors ${
              tab === t.id
                ? 'text-sakura-400'
                : 'text-slate-500 active:text-slate-300'
            }`}
          >
            <span className="text-lg mb-0.5">{t.icon}</span>
            <span>{t.label}</span>
            {t.id === 'bookmarks' && bookmarks.length > 0 && (
              <span className="absolute -mt-1 ml-6 bg-sakura-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {bookmarks.length}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default App
