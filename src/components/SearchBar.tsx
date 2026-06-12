import { useState, useEffect } from 'react';
import { LANGUAGES } from '../data/types';
import { getTtsRate, setTtsRate, speak } from '../utils/tts';

interface Props {
  value: string;
  onChange: (value: string) => void;
  lang: string;
  onLangChange: (lang: string) => void;
  onOpenCards: () => void;
  onOpenConverter: () => void;
}

const SPEED_LABELS: Record<string, string> = {
  '0.5': 'Very Slow',
  '0.6': 'Slow',
  '0.7': 'Normal',
  '0.85': 'Fast',
  '1': 'Native',
};

export function SearchBar({ value, onChange, lang, onLangChange, onOpenCards, onOpenConverter }: Props) {
  const currentLang = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];
  const [showMenu, setShowMenu] = useState(false);
  const [rate, setRate] = useState(getTtsRate);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => { window.removeEventListener('online', handleOnline); window.removeEventListener('offline', handleOffline); };
  }, []);

  const handleRateChange = (newRate: number) => {
    setRate(newRate);
    setTtsRate(newRate);
    speak('こんにちは', currentLang.ttsLang);
  };

  return (
    <div className="bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-2" style={{ paddingTop: 'max(env(safe-area-inset-top), 12px)' }}>
      <div className="flex items-center gap-2">
        {/* Hamburger Menu */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          className={`shrink-0 text-lg p-1.5 rounded-lg transition ${showMenu ? 'bg-slate-700 text-slate-200' : 'text-slate-500 active:text-slate-300'}`}
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

        {/* Online/Offline indicator */}
        {!isOnline && (
          <span className="shrink-0 text-base bg-amber-900/50 text-amber-300 px-2 py-1 rounded-lg">
            Offline
          </span>
        )}

        {/* Cards shortcut */}
        <button
          onClick={onOpenCards}
          className="shrink-0 text-lg p-1.5 rounded-lg text-slate-500 active:text-slate-300 transition"
        >
          🃏
        </button>
      </div>

      {/* Menu Panel */}
      {showMenu && (
        <div className="mt-2 bg-slate-800/80 rounded-xl overflow-hidden">
          {/* Language */}
          <div className="px-3 py-2.5 border-b border-slate-700/40">
            <p className="text-sm text-slate-500 mb-1.5">Language</p>
            <div className="flex gap-2">
              {LANGUAGES.map(l => (
                <button
                  key={l.code}
                  onClick={() => { onLangChange(l.code); }}
                  className={`flex-1 py-1.5 rounded-lg text-base transition ${lang === l.code ? 'bg-sakura-500/60 text-white' : 'bg-slate-700/50 text-slate-400'}`}
                >
                  {l.flag} {l.nameNative}
                </button>
              ))}
            </div>
          </div>

          {/* Quick tools */}
          <button
            onClick={() => { setShowMenu(false); onOpenCards(); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-left active:bg-slate-700/50 transition border-b border-slate-700/40"
          >
            <span className="text-lg">🃏</span>
            <div>
              <p className="text-base text-slate-200">Flashcards</p>
              <p className="text-sm text-slate-500">Practice learned items</p>
            </div>
          </button>

          <button
            onClick={() => { setShowMenu(false); onOpenConverter(); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-left active:bg-slate-700/50 transition border-b border-slate-700/40"
          >
            <span className="text-lg">🔄</span>
            <div>
              <p className="text-base text-slate-200">Number Converter</p>
              <p className="text-sm text-slate-500">Number → kanji + reading</p>
            </div>
          </button>

          {/* Settings */}
          <div className="px-3 py-2.5">
            <div className="flex items-center justify-between mb-1.5">
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
            <div className="flex justify-between text-sm text-slate-600 mt-0.5">
              <span>Slow</span>
              <span>Normal</span>
              <span>Native</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
