interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: Props) {
  return (
    <div className="bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-2" style={{ paddingTop: 'max(env(safe-area-inset-top), 12px)' }}>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">🔍</span>
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Search phrases, hepburn, 中文, notes..."
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
  );
}
