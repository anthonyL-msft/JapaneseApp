import { useState, useCallback } from 'react';
import { askCheckSentence, isAIConfigured } from '../utils/ai';
import type { AIPhrase } from '../utils/ai';
import { speak } from '../utils/tts';

interface Props {
  lang: string;
  explainLang?: string;
}

type CheckResult = {
  input: string;
  answer: string;
  example?: AIPhrase;
};

const HISTORY_KEY = 'sentence_check_history';
const MAX_HISTORY = 10;

function loadHistory(): CheckResult[] {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch { return []; }
}
function saveHistory(h: CheckResult[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(h.slice(0, MAX_HISTORY)));
}

export function SentenceCheck({ lang, explainLang = 'en' }: Props) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<CheckResult[]>(loadHistory);

  const handleCheck = useCallback(async () => {
    const sentence = input.trim();
    if (!sentence || loading) return;
    if (!isAIConfigured()) { setError('AI not configured'); return; }

    setLoading(true);
    setError(null);
    setResult(null);
    setInput('');
    try {
      const resp = await askCheckSentence(sentence, lang, explainLang);
      const item: CheckResult = { input: sentence, answer: resp.answer, example: resp.example };
      setResult(item);
      setHistory(prev => {
        const next = [item, ...prev.filter(h => h.input !== sentence).slice(0, MAX_HISTORY - 1)];
        saveHistory(next);
        return next;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [input, loading, lang, explainLang]);

  const handleHistoryTap = (item: CheckResult) => {
    setResult(item);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          {result && (
            <button onClick={() => { setResult(null); setInput(''); }} className="text-lg text-slate-400 active:text-slate-200 p-1">←</button>
          )}
          <div>
            <h2 className="text-lg font-bold">✍️ Sentence Check</h2>
            {!result && <p className="text-sm text-slate-400">Write a sentence and I'll check if it's correct</p>}
          </div>
        </div>
      </div>

      {/* Results area (scrollable) */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="space-y-3">
            {/* Your sentence */}
            <div className="bg-slate-800/40 rounded-xl p-3.5">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Your sentence</p>
              <p className="text-lg text-slate-200">{result.input}</p>
            </div>

            {/* Feedback — plain text, no container */}
            <div className="px-1">
              <div className="text-base text-slate-200 leading-relaxed whitespace-pre-line">{result.answer}</div>
            </div>

            {/* Corrected sentence card */}
            {result.example && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3.5">
                <p className="text-xs font-semibold text-emerald-300/80 uppercase tracking-wide mb-2">
                  {result.answer.startsWith('✅') ? 'Confirmed' : 'Corrected'}
                </p>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-medium text-slate-100">{result.example.target}</p>
                    {result.example.romanization && (
                      <p className="text-sm text-sakura-300 mt-0.5">{result.example.romanization}</p>
                    )}
                    <p className="text-sm text-slate-400 mt-0.5">{result.example.english}</p>
                  </div>
                  <button
                    onClick={() => speak(result.example!.target, 'ja-JP')}
                    className="text-lg p-1 active:scale-110 shrink-0"
                  >🔊</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* History — show when no result */}
        {!result && history.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Recent checks</p>
            <div className="space-y-2">
              {history.map((item, i) => (
                <button
                  key={i}
                  onClick={() => handleHistoryTap(item)}
                  className="w-full bg-slate-800/40 rounded-xl p-3 text-left active:bg-slate-700/50 transition"
                >
                  <p className="text-base text-slate-200 truncate">{item.input}</p>
                  <p className="text-sm text-slate-500 mt-0.5 truncate">
                    {item.answer.startsWith('✅') ? '✅ Correct' : '❌ Needs correction'}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Composer at bottom */}
      <div className="shrink-0 border-t border-slate-800 px-4 py-3 space-y-2">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={lang === 'ja' ? 'Type your Japanese sentence here...' : 'Type your sentence here...'}
          className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3 text-base text-slate-100 placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-sakura-400/50"
          rows={2}
        />
        <button
          onClick={handleCheck}
          disabled={!input.trim() || loading}
          className="w-full py-2.5 rounded-xl text-base font-semibold transition bg-sakura-500/80 text-white active:bg-sakura-600 disabled:opacity-40 disabled:active:bg-sakura-500/80"
        >
          {loading ? 'Checking...' : 'Check'}
        </button>
      </div>
    </div>
  );
}
