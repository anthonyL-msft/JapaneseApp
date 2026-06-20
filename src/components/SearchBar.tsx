import { useState, useCallback, useEffect } from 'react';
import { LANGUAGES } from '../data/types';

interface Props {
  value: string;
  onChange: (value: string) => void;
  lang: string;
  onOpenCards: () => void;
  onOpenConverter: () => void;
  onOpenBuilder: () => void;
  onOpenGrow: () => void;
  onOpenNotes: () => void;
  onOpenProgress: () => void;
  onOpenSettings: () => void;
  onOpenQuiz: () => void;
  onOpenMatch: () => void;
  onOpenDaily: () => void;
}

export function SearchBar({ value, onChange, lang, onOpenCards, onOpenConverter, onOpenBuilder, onOpenGrow, onOpenNotes, onOpenProgress, onOpenSettings, onOpenQuiz, onOpenMatch, onOpenDaily }: Props) {
  const currentLang = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerAnim, setDrawerAnim] = useState('animate-slide-in-left');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => { window.removeEventListener('online', handleOnline); window.removeEventListener('offline', handleOffline); };
  }, []);

  const openDrawer = useCallback(() => {
    setDrawerAnim('animate-slide-in-left');
    setDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerAnim('animate-slide-out-left');
    setTimeout(() => setDrawerOpen(false), 200);
  }, []);

  return (
    <>
      <div className="bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-2" style={{ paddingTop: 'max(env(safe-area-inset-top), 12px)' }}>
        <div className="flex items-center gap-2">
          {/* Hamburger */}
          <button
            onClick={openDrawer}
            className="shrink-0 text-xl p-2 rounded-lg text-slate-500 active:text-slate-300 transition"
          >
            ☰
          </button>

          {/* Search Input */}
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-base">🔍</span>
            <input
              type="text"
              value={value}
              onChange={e => onChange(e.target.value)}
              placeholder={`Search ${currentLang.name} phrases...`}
              className="w-full bg-slate-800 text-slate-100 placeholder-slate-500 rounded-xl py-2.5 pl-9 pr-8 text-base outline-none focus:ring-2 focus:ring-sakura-400/50 transition"
            />
            {value && (
              <button
                onClick={() => onChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-base"
              >
                ✕
              </button>
            )}
          </div>

          {!isOnline && (
            <span className="shrink-0 text-base bg-amber-900/50 text-amber-300 px-2 py-1 rounded-lg">
              Offline
            </span>
          )}
        </div>
      </div>

      {/* Left Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[60] flex" onClick={closeDrawer}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" />

          {/* Drawer panel */}
          <div
            className={`relative w-72 max-w-[80vw] h-full bg-slate-900 flex flex-col ${drawerAnim}`}
            onClick={e => e.stopPropagation()}
            style={{ paddingTop: 'max(env(safe-area-inset-top), 12px)' }}
          >
            {/* Header */}
            <div className="px-4 py-4 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-100">{currentLang.flag} {currentLang.nameNative}</h2>
                <button onClick={closeDrawer} className="text-xl text-slate-400 p-1">✕</button>
              </div>
              <p className="text-sm text-slate-500 mt-0.5">Travel Language Companion</p>
            </div>

            {/* Menu items */}
            <div className="flex-1 overflow-y-auto">
              {/* Tools */}
              <div className="px-4 py-3 border-b border-slate-800/50">
                <p className="text-sm text-slate-500 mb-2">Tools</p>
                <button
                  onClick={() => { closeDrawer(); onOpenProgress(); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left active:bg-slate-800 transition"
                >
                  <span className="text-lg">📊</span>
                  <div>
                    <p className="text-base text-slate-200">My Progress</p>
                    <p className="text-sm text-slate-500">Track your learning</p>
                  </div>
                </button>
                <button
                  onClick={() => { closeDrawer(); onOpenCards(); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left active:bg-slate-800 transition"
                >
                  <span className="text-lg">🃏</span>
                  <div>
                    <p className="text-base text-slate-200">Flashcards</p>
                    <p className="text-sm text-slate-500">Practice learned items</p>
                  </div>
                </button>
                <button
                  onClick={() => { closeDrawer(); onOpenQuiz(); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left active:bg-slate-800 transition"
                >
                  <span className="text-lg">🎮</span>
                  <div>
                    <p className="text-base text-slate-200">Quiz</p>
                    <p className="text-sm text-slate-500">Timed multiple choice game</p>
                  </div>
                </button>
                <button
                  onClick={() => { closeDrawer(); onOpenMatch(); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left active:bg-slate-800 transition"
                >
                  <span className="text-lg">🃏</span>
                  <div>
                    <p className="text-base text-slate-200">Match Game</p>
                    <p className="text-sm text-slate-500">Pair Japanese ↔ English</p>
                  </div>
                </button>
                <button
                  onClick={() => { closeDrawer(); onOpenDaily(); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left active:bg-slate-800 transition"
                >
                  <span className="text-lg">🎯</span>
                  <div>
                    <p className="text-base text-slate-200">Daily Challenge</p>
                    <p className="text-sm text-slate-500">Learn 3 + review 5 daily</p>
                  </div>
                </button>
                <button
                  onClick={() => { closeDrawer(); onOpenConverter(); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left active:bg-slate-800 transition"
                >
                  <span className="text-lg">🔄</span>
                  <div>
                    <p className="text-base text-slate-200">Number Converter</p>
                    <p className="text-sm text-slate-500">Number → kanji + reading</p>
                  </div>
                </button>
                <button
                  onClick={() => { closeDrawer(); onOpenBuilder(); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left active:bg-slate-800 transition"
                >
                  <span className="text-lg">🔧</span>
                  <div>
                    <p className="text-base text-slate-200">Sentence Builder</p>
                    <p className="text-sm text-slate-500">Pick a pattern, fill the blank</p>
                  </div>
                </button>
                <button
                  onClick={() => { closeDrawer(); onOpenGrow(); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left active:bg-slate-800 transition"
                >
                  <span className="text-lg">🌱</span>
                  <div>
                    <p className="text-base text-slate-200">Sentence Grow</p>
                    <p className="text-sm text-slate-500">Expand sentences step by step</p>
                  </div>
                </button>
                <button
                  onClick={() => { closeDrawer(); onOpenNotes(); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left active:bg-slate-800 transition"
                >
                  <span className="text-lg">📝</span>
                  <div>
                    <p className="text-base text-slate-200">Quick Note</p>
                    <p className="text-sm text-slate-500">Jot down anything</p>
                  </div>
                </button>
              </div>

              {/* Settings */}
              <div className="px-4 py-3 border-b border-slate-800/50">
                <button
                  onClick={() => { closeDrawer(); onOpenSettings(); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left active:bg-slate-800 transition"
                >
                  <span className="text-lg">⚙️</span>
                  <div>
                    <p className="text-base text-slate-200">Settings</p>
                    <p className="text-sm text-slate-500">Theme, language, speech</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-slate-800 text-center">
              <p className="text-sm text-slate-600">Made with ❤️ by Anthony</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
