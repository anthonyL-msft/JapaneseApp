import { useState, useEffect } from 'react';
import { LANGUAGES } from '../data/types';
import { getTtsRate, setTtsRate, speak } from '../utils/tts';

interface Props {
  value: string;
  onChange: (value: string) => void;
  lang: string;
  onLangChange: (lang: string) => void;
}

const SPEED_LABELS: Record<string, string> = {
  '0.5': 'Very Slow',
  '0.6': 'Slow',
  '0.7': 'Normal',
  '0.85': 'Fast',
  '1': 'Native',
};

export function SearchBar({ value, onChange, lang, onLangChange }: Props) {
  const currentLang = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];
  const [showSettings, setShowSettings] = useState(false);
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
        {/* Language Picker */}
        <select
          value={lang}
          onChange={e => onLangChange(e.target.value)}
          className="bg-slate-800 text-slate-100 rounded-xl py-2.5 px-2 text-sm outline-none border border-slate-700 focus:ring-2 focus:ring-sakura-400/50 transition shrink-0 appearance-none text-center"
          style={{ width: '54px' }}
        >
          {LANGUAGES.map(l => (
            <option key={l.code} value={l.code}>{l.flag}</option>
          ))}
        </select>

        {/* Search Input */}
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">🔍</span>
          <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={`Search ${currentLang.name} phrases...`}
            className="w-full bg-slate-800 text-slate-100 placeholder-slate-500 rounded-xl py-2.5 pl-9 pr-8 text-sm outline-none focus:ring-2 focus:ring-sakura-400/50 transition"
          />
          {value && (
            <button
              onClick={() => onChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-sm"
            >
              ✕
            </button>
          )}
        </div>

        {/* Online/Offline indicator + Settings */}
        {!isOnline && (
          <span className="shrink-0 text-xs bg-amber-900/50 text-amber-300 px-2 py-1 rounded-lg">
            Offline
          </span>
        )}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`shrink-0 text-lg p-1.5 rounded-lg transition ${showSettings ? 'bg-slate-700 text-slate-200' : 'text-slate-500 active:text-slate-300'}`}
        >
          ⚙️
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="mt-2 bg-slate-800/80 rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">🔊 Speech Speed</span>
            <span className="text-sm text-sakura-300 font-medium">{SPEED_LABELS[String(rate)] || rate.toFixed(1)}</span>
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
          <div className="flex justify-between text-xs text-slate-600">
            <span>Slow</span>
            <span>Normal</span>
            <span>Native</span>
          </div>
        </div>
      )}
    </div>
  );
}
