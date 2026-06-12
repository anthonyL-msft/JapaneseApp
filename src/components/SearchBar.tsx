import { useState, useEffect, useCallback } from 'react';
import { LANGUAGES } from '../data/types';
import { getTtsRate, setTtsRate, speak } from '../utils/tts';

interface Props {
  value: string;
  onChange: (value: string) => void;
  lang: string;
  onLangChange: (lang: string) => void;
  onOpenCards: () => void;
  onOpenConverter: () => void;
  onOpenBuilder: () => void;
}

const SPEED_LABELS: Record<string, string> = {
  '0.5': 'Very Slow',
  '0.6': 'Slow',
  '0.7': 'Normal',
  '0.85': 'Fast',
  '1': 'Native',
};

export function SearchBar({ value, onChange, lang, onLangChange, onOpenCards, onOpenConverter, onOpenBuilder }: Props) {
  const currentLang = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerAnim, setDrawerAnim] = useState('animate-slide-in-left');
  const [rate, setRate] = useState(getTtsRate);
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

  const handleRateChange = (newRate: number) => {
    setRate(newRate);
    setTtsRate(newRate);
    speak('こんにちは', currentLang.ttsLang);
  };

  return (
    <>
      <div className="bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-2" style={{ paddingTop: 'max(env(safe-area-inset-top), 12px)' }}>
        <div className="flex items-center gap-2">
          {/* Hamburger */}
          <button
            onClick={openDrawer}
            className="shrink-0 text-lg p-1.5 rounded-lg text-slate-500 active:text-slate-300 transition"
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
        <div className="fixed inset-0 z-50 flex" onClick={closeDrawer}>
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
              {/* Language */}
              <div className="px-4 py-3 border-b border-slate-800/50">
                <p className="text-sm text-slate-500 mb-2">Language</p>
                <div className="space-y-1">
                  {LANGUAGES.map(l => (
                    <button
                      key={l.code}
                      onClick={() => onLangChange(l.code)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition ${lang === l.code ? 'bg-sakura-500/20 text-sakura-300' : 'text-slate-400 active:bg-slate-800'}`}
                    >
                      <span className="text-lg">{l.flag}</span>
                      <span className="text-base">{l.name}</span>
                      <span className="text-sm text-slate-500">{l.nameNative}</span>
                      {lang === l.code && <span className="ml-auto text-sakura-400">✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tools */}
              <div className="px-4 py-3 border-b border-slate-800/50">
                <p className="text-sm text-slate-500 mb-2">Tools</p>
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
              </div>

              {/* Settings */}
              <div className="px-4 py-3">
                <p className="text-sm text-slate-500 mb-2">Settings</p>
                <div className="px-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base text-slate-400">🔊 Speech Speed</span>
                    <span className="text-base text-sakura-300 font-medium">{SPEED_LABELS[String(rate)] || rate.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="1"
                    step="0.05"
                    value={rate}
                    onChange={e => handleRateChange(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sakura-400"
                  />
                  <div className="flex justify-between text-sm text-slate-600 mt-1">
                    <span>Slow</span>
                    <span>Normal</span>
                    <span>Native</span>
                  </div>
                </div>
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
