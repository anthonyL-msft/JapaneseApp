import { LANGUAGES } from '../data/types';

interface Props {
  value: string;
  onChange: (value: string) => void;
  lang: string;
  onLangChange: (lang: string) => void;
}

export function SearchBar({ value, onChange, lang, onLangChange }: Props) {
  const currentLang = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

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
      </div>
    </div>
  );
}
