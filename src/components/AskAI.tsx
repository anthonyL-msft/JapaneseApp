import { useState } from 'react';
import { askHowToSay, isAIConfigured } from '../utils/ai';
import type { AIPhrase } from '../utils/ai';
import { speak } from '../utils/tts';
import { LANGUAGES } from '../data/types';
import type { UserNote } from '../data/types';

interface Props {
  lang: string;
  onSaveNote?: (note: UserNote) => void;
}

export function AskAI({ lang, onSaveNote }: Props) {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<AIPhrase | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBig, setShowBig] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [history, setHistory] = useState<AIPhrase[]>([]);

  const currentLang = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];
  const configured = isAIConfigured();

  const handleAsk = async () => {
    if (!query.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const phrase = await askHowToSay(query.trim(), lang);
      setResult(phrase);
      setHistory(prev => [phrase, ...prev.slice(0, 9)]); // Keep last 10
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = (text: string) => {
    speak(text, currentLang.ttsLang);
  };

  if (!configured) {
    return (
      <div className="scroll-area h-full flex flex-col items-center justify-center px-6 text-center">
        <p className="text-4xl mb-4">🤖</p>
        <p className="text-lg font-semibold text-slate-200">AI not configured</p>
        <p className="text-sm text-slate-400 mt-2">Add your Azure OpenAI API key in <code className="text-sakura-300">.env.local</code> to enable "How do I say...?" feature.</p>
      </div>
    );
  }

  return (
    <div className="scroll-area h-full">
      <div className="px-4 py-3 border-b border-slate-800">
        <h2 className="text-lg font-bold">🤖 How do I say...?</h2>
        <p className="text-xs text-slate-400">Ask in English or 中文, get {currentLang.name} translation</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAsk()}
            placeholder="e.g., I want to split the bill"
            className="flex-1 bg-slate-800 text-slate-100 placeholder-slate-500 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sakura-400/50 transition"
            disabled={loading}
          />
          <button
            onClick={handleAsk}
            disabled={loading || !query.trim()}
            className="bg-sakura-500/80 text-white px-4 py-3 rounded-xl text-sm font-medium disabled:opacity-30 active:bg-sakura-600 transition shrink-0"
          >
            {loading ? '...' : 'Ask'}
          </button>
        </div>

        {/* Quick suggestions */}
        {!result && !loading && history.length === 0 && (
          <div>
            <p className="text-xs text-slate-500 mb-2">Try asking:</p>
            <div className="flex flex-wrap gap-1.5">
              {[
                'I want to split the bill',
                'Is this seat taken?',
                'Can I have the vegetarian option?',
                'Where is the nearest ATM?',
                'I\'m allergic to peanuts',
                'Can you take a photo of us?',
              ].map(s => (
                <button
                  key={s}
                  onClick={() => { setQuery(s); }}
                  className="text-xs bg-slate-800 text-slate-400 px-2.5 py-1.5 rounded-lg active:bg-slate-700 transition"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-pulse text-slate-400 text-sm">Translating...</div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-900/30 border border-red-700/40 rounded-xl p-3">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="bg-slate-800/80 rounded-2xl p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xl font-bold text-slate-50">{result.target}</p>
                <p className="text-base text-sakura-300 mt-1">{result.pronunciation_chunks || result.pronunciation}</p>
              </div>
              <button
                onClick={() => handleSpeak(result.target)}
                className="text-2xl p-1 active:scale-110 transition-transform shrink-0"
              >🔊</button>
            </div>

            {result.romanization && (
              <div>
                <span className="text-slate-500 text-xs">Reading</span>
                <p className="text-sm text-slate-300">{result.romanization}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-slate-500 text-xs">English</span>
                <p className="text-slate-200">{result.english}</p>
              </div>
              <div>
                <span className="text-slate-500 text-xs">繁體中文</span>
                <p className="text-slate-200">{result.chinese_tc}</p>
              </div>
            </div>

            {result.native_hint && (
              <div className="bg-amber-900/20 border border-amber-700/30 rounded-lg p-2">
                <p className="text-sm text-amber-400">🌉 {result.native_hint}</p>
              </div>
            )}

            {result.notes && (
              <div className="bg-slate-700/30 rounded-lg p-2">
                <p className="text-sm text-slate-300">💡 {result.notes}</p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setShowBig(result.target)}
                className="flex-1 bg-slate-700/50 text-slate-300 text-xs py-2 rounded-lg active:bg-slate-600 transition"
              >📺 Show Big</button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${result.target}\n${result.pronunciation_chunks || result.pronunciation}\n${result.english}`);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="flex-1 bg-slate-700/50 text-slate-300 text-xs py-2 rounded-lg active:bg-slate-600 transition"
              >{copied ? '✓ Copied' : '📋 Copy'}</button>
              {onSaveNote && (
                <button
                  onClick={() => {
                    const now = Date.now();
                    onSaveNote({
                      id: `ai_${now}`,
                      text: `🤖 ${result.target} (${result.pronunciation_chunks || result.pronunciation}) — ${result.english} / ${result.chinese_tc}`,
                      createdAt: now,
                      updatedAt: now,
                    });
                    setSaved(true);
                    setTimeout(() => setSaved(false), 2000);
                  }}
                  className="flex-1 bg-sakura-500/30 text-sakura-300 text-xs py-2 rounded-lg active:bg-sakura-500/50 transition"
                >{saved ? '✓ Saved' : '💾 Save'}</button>
              )}
            </div>
          </div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div>
            <h3 className="text-xs text-slate-500 mb-2">Recent translations</h3>
            <div className="space-y-1.5">
              {history.map((h, i) => (
                <div
                  key={i}
                  className="bg-slate-800/50 rounded-xl p-2.5 flex items-center gap-2 active:bg-slate-700/50 transition cursor-pointer"
                  onClick={() => setResult(h)}
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); handleSpeak(h.target); }}
                    className="text-sm shrink-0"
                  >🔊</button>
                  <div className="flex-1 min-w-0">
                    <p className="text-base text-slate-200 truncate">{h.target}</p>
                    <p className="text-sm text-sakura-300 truncate">{h.pronunciation_chunks || h.pronunciation}</p>
                    <p className="text-xs text-slate-500 truncate">{h.english}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Show Big Overlay */}
      {showBig && (
        <div
          onClick={() => setShowBig(null)}
          className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-8 cursor-pointer"
        >
          <p className="text-4xl font-bold text-white text-center leading-relaxed">{showBig}</p>
          <p className="text-lg text-sakura-300 mt-4 text-center">{result?.pronunciation_chunks || result?.pronunciation}</p>
          <button
            onClick={(e) => { e.stopPropagation(); if (result) handleSpeak(result.target); }}
            className="mt-6 text-4xl active:scale-110 transition-transform"
          >🔊</button>
          <p className="text-xs text-slate-600 mt-8">Tap anywhere to close</p>
        </div>
      )}
    </div>
  );
}
