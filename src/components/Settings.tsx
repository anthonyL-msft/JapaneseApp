import { useState } from 'react';
import { LANGUAGES } from '../data/types';
import { getTtsRate, setTtsRate, speak } from '../utils/tts';

interface Props {
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

export function Settings({ lang, onLangChange }: Props) {
  const currentLang = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];
  const [rate, setRate] = useState(getTtsRate);
  const [isDark, setIsDark] = useState(() => !document.documentElement.classList.contains('light'));

  const handleRateChange = (newRate: number) => {
    setRate(newRate);
    setTtsRate(newRate);
    speak('こんにちは', currentLang.ttsLang);
  };

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className="scroll-area h-full">
      <div className="px-4 py-3 border-b border-slate-800">
        <h2 className="text-lg font-bold">⚙️ Settings</h2>
        <p className="text-base text-slate-400">Customize your experience</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Appearance */}
        <div className="bg-slate-800/60 rounded-xl p-4">
          <p className="text-base font-semibold text-slate-300 mb-3">Appearance</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base text-slate-200">{isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}</p>
              <p className="text-sm text-slate-500">Switch between dark and light theme</p>
            </div>
            <button
              onClick={toggleTheme}
              className={`px-4 py-1.5 rounded-full text-base transition ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-amber-100 text-amber-700'}`}
            >
              {isDark ? 'Dark' : 'Light'}
            </button>
          </div>
        </div>

        {/* Language */}
        <div className="bg-slate-800/60 rounded-xl p-4">
          <p className="text-base font-semibold text-slate-300 mb-3">Language</p>
          <div className="space-y-1">
            {LANGUAGES.map(l => (
              <button
                key={l.code}
                onClick={() => onLangChange(l.code)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition ${lang === l.code ? 'bg-sakura-500/20 text-sakura-300' : 'text-slate-400 active:bg-slate-700'}`}
              >
                <span className="text-lg">{l.flag}</span>
                <span className="text-base">{l.name}</span>
                <span className="text-sm text-slate-500">{l.nameNative}</span>
                {lang === l.code && <span className="ml-auto text-sakura-400">✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Speech */}
        <div className="bg-slate-800/60 rounded-xl p-4">
          <p className="text-base font-semibold text-slate-300 mb-3">Speech</p>
          <div>
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
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sakura-400"
            />
            <div className="flex justify-between text-sm text-slate-600 mt-1">
              <span>Slow</span>
              <span>Normal</span>
              <span>Native</span>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="bg-slate-800/60 rounded-xl p-4">
          <p className="text-base font-semibold text-slate-300 mb-2">About</p>
          <p className="text-base text-slate-400">Travel Language Companion</p>
          <p className="text-sm text-slate-500 mt-1">Made with ❤️ by Anthony</p>
        </div>
      </div>
    </div>
  );
}
