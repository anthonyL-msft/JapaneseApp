import { useState, useEffect, useCallback } from 'react';
import type { Tab, Bookmark, UserNote, RefBookmark, LearnedItem, SavedAIPhrase } from './data/types';
import { LANGUAGES } from './data/types';
import { phrases as allPhrases } from './data/phrases';
import { getBookmarks, addBookmark, removeBookmark, getNotes, saveNote, deleteNote, getRefBookmarks, addRefBookmark, removeRefBookmark, getLearnedItems, addLearnedItem, removeLearnedItem, getSavedAIPhrases, saveAIPhrase, deleteAIPhrase } from './db';
import { PhraseBook } from './components/PhraseBook';
import { Flashcards } from './components/Flashcards';
import { MyStuff } from './components/MyStuff';
import { Reference, NumberConverter } from './components/Reference';
import { Scenarios } from './components/Scenarios';
import { AskAI } from './components/AskAI';
import { SentenceBuilder } from './components/SentenceBuilder';
import { QuickNote } from './components/QuickNote';
import { Progress } from './components/Progress';
import { Settings } from './components/Settings';
import { SearchBar } from './components/SearchBar';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'phrases', label: 'Learn', icon: '📖' },
  { id: 'reference', label: 'Ref', icon: '📚' },
  { id: 'scenes', label: 'Scenes', icon: '🎭' },
  { id: 'ai', label: 'AI', icon: '🤖' },
  { id: 'bookmarks', label: 'Mine', icon: '📌' },
];

function App() {
  const [tab, setTab] = useState<Tab>('phrases');
  const [search, setSearch] = useState('');
  const [lang, setLang] = useState('ja');
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [notes, setNotes] = useState<UserNote[]>([]);
  const [refBookmarks, setRefBookmarks] = useState<RefBookmark[]>([]);
  const [learnedItems, setLearnedItems] = useState<LearnedItem[]>([]);
  const [savedAIPhrases, setSavedAIPhrases] = useState<SavedAIPhrase[]>([]);
  const currentLang = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  useEffect(() => {
    getBookmarks().then(setBookmarks);
    getNotes().then(setNotes);
    getRefBookmarks().then(setRefBookmarks);
    getLearnedItems().then(setLearnedItems);
    getSavedAIPhrases().then(setSavedAIPhrases);
  }, []);

  const toggleRefBookmark = useCallback(async (item: { jp: string; hep: string; en: string; section: string }) => {
    const id = `ref_${item.jp}`;
    const existing = refBookmarks.find(b => b.id === id);
    if (existing) {
      await removeRefBookmark(id);
      setRefBookmarks(prev => prev.filter(b => b.id !== id));
    } else {
      const rb: RefBookmark = { id, ...item, createdAt: Date.now() };
      await addRefBookmark(rb);
      setRefBookmarks(prev => [...prev, rb]);
    }
  }, [refBookmarks]);

  const toggleLearned = useCallback(async (id: string) => {
    const existing = learnedItems.find(l => l.id === id);
    if (existing) {
      await removeLearnedItem(id);
      setLearnedItems(prev => prev.filter(l => l.id !== id));
    } else {
      await addLearnedItem(id);
      setLearnedItems(prev => [...prev, { id, createdAt: Date.now() }]);
    }
  }, [learnedItems]);

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

  const handleSaveAIPhrase = useCallback(async (phrase: SavedAIPhrase) => {
    await saveAIPhrase(phrase);
    setSavedAIPhrases(prev => [...prev, phrase]);
  }, []);

  const handleDeleteAIPhrase = useCallback(async (id: string) => {
    await deleteAIPhrase(id);
    setSavedAIPhrases(prev => prev.filter(p => p.id !== id));
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
      <SearchBar
        value={search}
        onChange={setSearch}
        lang={lang}
        onOpenCards={() => setTab('cards')}
        onOpenConverter={() => setTab('converter')}
        onOpenBuilder={() => setTab('builder')}
        onOpenNotes={() => setTab('notes')}
        onOpenProgress={() => setTab('progress')}
        onOpenSettings={() => setTab('settings')}
      />

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
            learnedIds={new Set(learnedItems.map(l => l.id))}
            onToggleLearned={toggleLearned}
          />
        )}
        {tab === 'cards' && (
          <Flashcards phrases={langPhrases} learnedIds={new Set(learnedItems.map(l => l.id))} refBookmarks={refBookmarks} />
        )}
        {tab === 'bookmarks' && (
          <MyStuff
            phrases={langPhrases}
            bookmarks={bookmarks}
            notes={notes}
            refBookmarks={refBookmarks}
            learnedItems={learnedItems}
            savedAIPhrases={savedAIPhrases}
            onToggleBookmark={toggleBookmark}
            onToggleRefBookmark={toggleRefBookmark}
            onToggleLearned={toggleLearned}
            onSaveNote={handleSaveNote}
            onDeleteNote={handleDeleteNote}
            onDeleteAIPhrase={handleDeleteAIPhrase}
            search={search}
          />
        )}
        {tab === 'reference' && <Reference refBookmarkedIds={new Set(refBookmarks.map(b => b.id))} onToggleRefBookmark={toggleRefBookmark} learnedIds={new Set(learnedItems.map(l => l.id))} onToggleLearned={toggleLearned} />}
        {tab === 'scenes' && <Scenarios lang={lang} langConfig={currentLang} search={search} />}
        {tab === 'ai' && <AskAI lang={lang} savedAIPhrases={savedAIPhrases} onSaveAIPhrase={handleSaveAIPhrase} onDeleteAIPhrase={handleDeleteAIPhrase} />}
        {tab === 'builder' && <SentenceBuilder />}
        {tab === 'notes' && <QuickNote notes={notes} onSaveNote={handleSaveNote} onDeleteNote={handleDeleteNote} />}
        {tab === 'progress' && <Progress phrases={langPhrases} learnedItems={learnedItems} />}
        {tab === 'settings' && <Settings lang={lang} onLangChange={setLang} />}
        {tab === 'converter' && (
          <div className="scroll-area h-full">
            <div className="px-4 py-3 border-b border-slate-800">
              <h2 className="text-lg font-bold">🔄 Number Converter</h2>
              <p className="text-base text-slate-400">Type a number → kanji + reading</p>
            </div>
            <div className="px-3"><NumberConverter /></div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-slate-900" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <nav className="flex border-t border-slate-800">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex flex-col items-center py-2.5 text-base transition-colors ${
              tab === t.id
                ? 'text-sakura-400'
                : 'text-slate-500 active:text-slate-300'
            }`}
          >
            <span className="text-xl mb-0.5">{t.icon}</span>
            <span>{t.label}</span>
            {t.id === 'bookmarks' && bookmarks.length > 0 && (
              <span className="absolute -mt-1 ml-6 bg-sakura-500 text-white text-base rounded-full w-4 h-4 flex items-center justify-center">
                {bookmarks.length}
              </span>
            )}
          </button>
        ))}
        </nav>
      </div>
    </div>
  );
}

export default App
