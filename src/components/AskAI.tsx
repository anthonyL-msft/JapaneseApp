import { useState, useRef, useEffect, useCallback } from 'react';
import { askHowToSay, askFollowUp, askFollowUpMulti, askBreakdown, isAIConfigured } from '../utils/ai';
import type { AIPhrase, FollowUpMessage, BreakdownBlock } from '../utils/ai';
import type { SavedAIPhrase } from '../data/types';
import { speak } from '../utils/tts';
import { LANGUAGES } from '../data/types';
import { breakdownKana, markChunkBoundaries, markLengtheners, romajiToHiragana } from '../utils/kana';

interface Props {
  lang: string;
  savedAIPhrases: SavedAIPhrase[];
  onSaveAIPhrase: (phrase: SavedAIPhrase) => void;
  onDeleteAIPhrase: (id: string) => void;
  askMorePhrase?: { target: string; pronunciation: string; pronunciation_chunks: string; english: string } | null;
  onClearAskMore?: () => void;
  aiExplainLang?: string;
}

function AISounds({ phrase }: { phrase: AIPhrase }) {
  // Only show Sounds when we have a proper hiragana romanization
  const reading = phrase.romanization;
  if (!reading) return null;
  let units = breakdownKana(reading);
  if (phrase.pronunciation_chunks && phrase.pronunciation_chunks.includes(' ')) {
    // Normalize AI chunks: " · " → "·", then ensure word boundaries are clean spaces
    const cleanChunks = phrase.pronunciation_chunks
      .replace(/\s*·\s*/g, '·')  // "ko · no" → "ko·no"
      .replace(/\s+/g, ' ')       // collapse multiple spaces
      .trim();
    units = markChunkBoundaries(units, cleanChunks);
  }
  units = markLengtheners(units);
  const visible = units.filter(u => !u.isSpace);
  if (visible.length === 0) return null;
  return (
    <div className="bg-indigo-900/20 border border-indigo-700/30 rounded-lg p-2">
      <span className="text-slate-500 text-xs block mb-1">Sounds</span>
      <div className="flex flex-wrap items-end">
        {visible.map((u, i) => (
          <div key={i} className={`flex flex-col items-center py-0.5 ${u.isLengthener ? 'min-w-[0.9rem] -ml-px' : 'min-w-[1.2rem] px-px'} ${u.isLengthener ? '' : u.isWordBreak ? 'ml-4' : u.isChunkStart && i > 0 ? 'ml-2' : ''}`}>
            <span className={`leading-tight ${u.isLengthener ? 'text-sm text-slate-300' : 'text-base text-slate-100'}`}>{u.char}</span>
            <span className={`leading-none font-mono mt-0.5 ${u.isLengthener ? 'text-[9px] text-slate-500' : 'text-[10px] text-slate-400'}`}>{u.romaji || '·'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AIResultCard({ phrase, lang, onSave, onSpeak, isSaved, defaultExpanded, onFollowUp, onShowBig }: {
  phrase: AIPhrase; lang: string; onSave: () => void; onSpeak: () => void; isSaved: boolean; defaultExpanded?: boolean; onFollowUp?: () => void; onShowBig?: () => void;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded ?? false);
  const [copied, setCopied] = useState(false);
  return (
    <div className="bg-slate-800/80 rounded-xl overflow-hidden">
      <div className="p-3 cursor-pointer active:bg-slate-700/50 transition" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-lg font-medium text-slate-50">{phrase.target}</p>
            <p className="text-base text-sakura-300 mt-0.5">{phrase.pronunciation_chunks || phrase.pronunciation}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={(e) => { e.stopPropagation(); onSpeak(); }} className="p-1 rounded-lg active:bg-slate-600 text-lg">🔊</button>
            <button onClick={(e) => { e.stopPropagation(); onSave(); }} className="p-1 rounded-lg active:bg-slate-600 text-lg">{isSaved ? '⭐' : '☆'}</button>
          </div>
        </div>
        <p className="text-base text-slate-400 mt-0.5">{phrase.english}</p>
      </div>
      {expanded && (
        <div className="px-3 pb-3 border-t border-slate-700/40 space-y-2 pt-2">
          {lang === 'ja' && <AISounds phrase={phrase} />}
          <div className="grid grid-cols-2 gap-2 text-base">
            <div><span className="text-slate-500 text-base">繁體中文</span><p className="text-slate-200">{phrase.chinese_tc}</p></div>
          </div>
          {phrase.native_hint && <div className="bg-amber-900/20 border border-amber-700/30 rounded-lg p-2"><p className="text-base text-amber-400">🌉 {phrase.native_hint}</p></div>}
          {phrase.notes && <div className="bg-slate-700/30 rounded-lg p-2"><p className="text-base text-slate-300">💡 {phrase.notes}</p></div>}
          <div className="flex gap-2 pt-1">
            {onShowBig && <button onClick={(e) => { e.stopPropagation(); onShowBig(); }} className="flex-1 bg-slate-700/50 text-slate-300 text-base py-1.5 rounded-lg active:bg-slate-600 transition">📺 Show Big</button>}
            <button onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(`${phrase.target}\n${phrase.pronunciation_chunks || phrase.pronunciation}\n${phrase.english}`); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="flex-1 bg-slate-700/50 text-slate-300 text-base py-1.5 rounded-lg active:bg-slate-600 transition">{copied ? '✓ Copied' : '📋 Copy'}</button>
            {onFollowUp && <button onClick={(e) => { e.stopPropagation(); onFollowUp(); }} className="flex-1 bg-indigo-900/40 text-indigo-300 text-base py-1.5 rounded-lg active:bg-indigo-800/50 transition">💬 Ask more</button>}
          </div>
        </div>
      )}
    </div>
  );
}

/** Render a breakdown as a section layout — text blocks + phrase cards */
function BreakdownSection({ blocks, lang, onSave, onSpeak, savedAIPhrases }: {
  blocks: BreakdownBlock[];
  lang: string;
  onSave: (phrase: AIPhrase, query: string) => void;
  onSpeak: (text: string) => void;
  savedAIPhrases: SavedAIPhrase[];
}) {
  return (
    <div className="space-y-2">
      {blocks.map((block, i) => {
        if (block.type === 'text') {
          return (
            <div key={i} className="px-1 py-1">
              <p className="text-base text-slate-300 whitespace-pre-wrap leading-relaxed">{block.content}</p>
            </div>
          );
        }
        return (
          <AIResultCard
            key={i}
            phrase={block.phrase}
            lang={lang}
            onSave={() => onSave(block.phrase, 'Breakdown example')}
            onSpeak={() => onSpeak(block.phrase.target)}
            isSaved={savedAIPhrases.some(s => s.target === block.phrase.target)}
          />
        );
      })}
    </div>
  );
}

const FOLLOW_UP_CHIPS = [
  { label: 'Simpler?', prompt: 'Can you give me a simpler/shorter version of this phrase?', mode: 'single' as const },
  { label: 'As a question', prompt: 'How do I turn this into a question?', mode: 'single' as const },
  { label: 'Break it down', prompt: '', mode: 'breakdown' as const },
  { label: 'More examples', prompt: 'Show me 3-5 more examples using the same sentence pattern but with different objects or contexts. Keep the grammar structure the same.', mode: 'multi' as const },
  { label: 'Similar phrases', prompt: 'What are similar expressions I could use instead? Show me 3-5 alternatives that convey a similar meaning.', mode: 'multi' as const },
];

export function AskAI({ lang, savedAIPhrases, onSaveAIPhrase, onDeleteAIPhrase: _onDeleteAIPhrase, askMorePhrase, onClearAskMore, aiExplainLang = 'en' }: Props) {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<AIPhrase | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBig, setShowBig] = useState<string | null>(null);
  const [history, setHistory] = useState<AIPhrase[]>([]);
  const [followUpOpen, setFollowUpOpen] = useState(false);
  const [followUpPhrase, setFollowUpPhrase] = useState<AIPhrase | null>(null);
  const [followUpQuery, setFollowUpQuery] = useState('');
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const [followUpResults, setFollowUpResults] = useState<{ query: string; phrase?: AIPhrase; phrases?: AIPhrase[]; blocks?: BreakdownBlock[]; error?: string }[]>([]);
  const [followUpHistory, setFollowUpHistory] = useState<FollowUpMessage[]>([]);
  const followUpScrollRef = useRef<HTMLDivElement>(null);
  const currentLang = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];
  const configured = isAIConfigured();

  // Auto-open follow-up drawer when askMorePhrase is passed from PhraseCard
  useEffect(() => {
    if (askMorePhrase) {
      const phrase: AIPhrase = {
        target: askMorePhrase.target,
        pronunciation: askMorePhrase.pronunciation,
        pronunciation_chunks: askMorePhrase.pronunciation_chunks,
        english: askMorePhrase.english,
        chinese_tc: '',
        notes: '',
      };
      setFollowUpPhrase(phrase);
      setFollowUpResults([]);
      setFollowUpHistory([]);
      setFollowUpQuery('');
      setFollowUpOpen(true);
      onClearAskMore?.();
    }
  }, [askMorePhrase, onClearAskMore]);

  const handleAsk = async () => {
    if (!query.trim() || loading) return;
    setLoading(true); setError(null); setResult(null);
    try {
      const phrase = await askHowToSay(query.trim(), lang, aiExplainLang);
      setResult(phrase);
      setHistory(prev => [phrase, ...prev.slice(0, 9)]);
    } catch (err) { setError(err instanceof Error ? err.message : 'Something went wrong'); }
    finally { setLoading(false); }
  };

  const handleSpeak = (text: string) => speak(text, currentLang.ttsLang);

  const handleSave = useCallback((phrase: AIPhrase, originalQuery: string) => {
    const id = `ai_${Date.now()}`;
    onSaveAIPhrase({ id, lang, target: phrase.target, romanization: phrase.romanization, pronunciation: phrase.pronunciation, pronunciation_chunks: phrase.pronunciation_chunks, english: phrase.english, chinese_tc: phrase.chinese_tc, notes: phrase.notes, native_hint: phrase.native_hint, query: originalQuery, createdAt: Date.now() });
  }, [lang, onSaveAIPhrase]);

  const openFollowUp = (phrase: AIPhrase) => {
    setFollowUpPhrase(phrase); setFollowUpResults([]); setFollowUpHistory([]); setFollowUpQuery(''); setFollowUpOpen(true);
  };

  const handleFollowUp = async (promptText?: string, mode: 'single' | 'multi' | 'breakdown' = 'single') => {
    const q = promptText || followUpQuery.trim();
    if ((!q && mode !== 'breakdown') || !followUpPhrase || followUpLoading) return;
    setFollowUpLoading(true); setFollowUpQuery('');
    const displayQuery = mode === 'breakdown' ? 'Break it down' : q;
    try {
      if (mode === 'breakdown') {
        const blocks = await askBreakdown(followUpPhrase, lang, aiExplainLang);
        setFollowUpResults(prev => [...prev, { query: displayQuery, blocks }]);
      } else if (mode === 'multi') {
        const responses = await askFollowUpMulti(followUpPhrase, q, lang, aiExplainLang);
        setFollowUpResults(prev => [...prev, { query: displayQuery, phrases: responses }]);
      } else {
        const response = await askFollowUp(followUpPhrase, q, followUpHistory, lang, aiExplainLang);
        setFollowUpResults(prev => [...prev, { query: displayQuery, phrase: response }]);
        setFollowUpHistory(prev => [...prev, { role: 'user', content: q }, { role: 'assistant', content: JSON.stringify(response) }]);
      }
    } catch (err) {
      setFollowUpResults(prev => [...prev, { query: displayQuery, error: err instanceof Error ? err.message : 'Error' }]);
    } finally { setFollowUpLoading(false); }
  };

  useEffect(() => {
    if (followUpScrollRef.current) followUpScrollRef.current.scrollTop = followUpScrollRef.current.scrollHeight;
  }, [followUpResults, followUpLoading]);

  if (!configured) return (
    <div className="scroll-area h-full flex flex-col items-center justify-center px-6 text-center">
      <p className="text-4xl mb-4">🤖</p>
      <p className="text-lg font-semibold text-slate-200">AI not configured</p>
      <p className="text-base text-slate-400 mt-2">Add your Azure OpenAI API key in <code className="text-sakura-300">.env.local</code> to enable &quot;How do I say...?&quot; feature.</p>
    </div>
  );

  return (
    <div className="scroll-area h-full">
      <div className="px-4 py-3 border-b border-slate-800">
        <h2 className="text-lg font-bold">🤖 How do I say...?</h2>
        <p className="text-base text-slate-400">Ask in English or 中文, get {currentLang.name} translation</p>
      </div>
      <div className="p-4 space-y-4">
        <div className="flex gap-2">
          <input type="text" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAsk()} placeholder="e.g., I want to split the bill" className="flex-1 bg-slate-800 text-slate-100 placeholder-slate-500 rounded-xl px-4 py-3 text-base outline-none focus:ring-2 focus:ring-sakura-400/50 transition" disabled={loading} />
          <button onClick={handleAsk} disabled={loading || !query.trim()} className="bg-sakura-500/80 text-white px-4 py-3 rounded-xl text-base font-medium disabled:opacity-30 active:bg-sakura-600 transition shrink-0">{loading ? '...' : 'Ask'}</button>
        </div>

        {!result && !loading && history.length === 0 && (
          <div>
            <p className="text-base text-slate-500 mb-2">Try asking:</p>
            <div className="flex flex-wrap gap-1.5">
              {['I want to split the bill', 'Is this seat taken?', 'Can I have the vegetarian option?', 'Where is the nearest ATM?', "I'm allergic to peanuts", 'Can you take a photo of us?'].map(s => (
                <button key={s} onClick={() => setQuery(s)} className="text-base bg-slate-800 text-slate-400 px-2.5 py-1.5 rounded-lg active:bg-slate-700 transition">{s}</button>
              ))}
            </div>
          </div>
        )}

        {loading && <div className="flex items-center justify-center py-8"><div className="animate-pulse text-slate-400 text-base">Translating...</div></div>}
        {error && <div className="bg-red-900/30 border border-red-700/40 rounded-xl p-3"><p className="text-base text-red-300">{error}</p></div>}

        {result && (
          <div className="space-y-2">
            <AIResultCard
              phrase={result}
              lang={lang}
              onSave={() => handleSave(result, query)}
              onSpeak={() => handleSpeak(result.target)}
              isSaved={savedAIPhrases.some(s => s.target === result.target)}
              defaultExpanded={true}
              onFollowUp={() => openFollowUp(result)}
              onShowBig={() => setShowBig(result.target)}
            />
          </div>
        )}

        {history.length > 0 && (
          <div>
            <h3 className="text-base text-slate-500 mb-2">Recent translations</h3>
            <div className="space-y-1.5">
              {history.map((h, i) => (
                <div key={i} className="bg-slate-800/50 rounded-xl p-2.5 flex items-center gap-2 active:bg-slate-700/50 transition cursor-pointer" onClick={() => setResult(h)}>
                  <button onClick={(e) => { e.stopPropagation(); handleSpeak(h.target); }} className="text-base shrink-0">🔊</button>
                  <div className="flex-1 min-w-0">
                    <p className="text-base text-slate-200 truncate">{h.target}</p>
                    <p className="text-base text-sakura-300 truncate">{h.pronunciation_chunks || h.pronunciation}</p>
                    <p className="text-base text-slate-500 truncate">{h.english}</p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); openFollowUp(h); }} className="text-base text-indigo-400 shrink-0 p-1">💬</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showBig && (
        <div onClick={() => setShowBig(null)} className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-8 cursor-pointer">
          <p className="text-4xl font-bold text-white text-center leading-relaxed">{showBig}</p>
          <p className="text-lg text-sakura-300 mt-4 text-center">{result?.pronunciation_chunks || result?.pronunciation}</p>
          <button onClick={(e) => { e.stopPropagation(); if (result) handleSpeak(result.target); }} className="mt-6 text-4xl active:scale-110 transition-transform">🔊</button>
          <p className="text-base text-slate-600 mt-8">Tap anywhere to close</p>
        </div>
      )}

      {followUpOpen && followUpPhrase && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end" onClick={() => setFollowUpOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative bg-slate-900 rounded-t-2xl flex flex-col animate-slide-up" style={{ height: '100vh' }} onClick={e => e.stopPropagation()}>
            <div className="shrink-0">
              <div className="flex justify-center pt-2 pb-1"><div className="w-10 h-1 rounded-full bg-slate-600" /></div>
              <div className="px-4 pb-3 border-b border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-slate-100 truncate">{followUpPhrase.target}</p>
                    <p className="text-sm text-sakura-300 truncate">{followUpPhrase.pronunciation_chunks || followUpPhrase.pronunciation}</p>
                    <p className="text-sm text-slate-500 truncate">{followUpPhrase.english}</p>
                  </div>
                  <button onClick={() => setFollowUpOpen(false)} className="text-xl text-slate-400 p-2 shrink-0">✕</button>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3" ref={followUpScrollRef}>
              {followUpResults.length === 0 && !followUpLoading && (
                <div className="text-center py-8">
                  <p className="text-base text-slate-500">Tap a chip or type a question below</p>
                  <p className="text-sm text-slate-600 mt-1">e.g., &quot;Can I make this shorter?&quot; or &quot;How to use with different food?&quot;</p>
                </div>
              )}
              {followUpResults.map((r, i) => (
                <div key={i} className="space-y-2">
                  {/* User bubble — right */}
                  <div className="flex justify-end">
                    <div className="bg-indigo-900/60 rounded-2xl rounded-tr-sm px-3 py-2 max-w-[85%]">
                      <p className="text-base text-slate-200">{r.query}</p>
                    </div>
                  </div>
                  {/* AI response as section (no bubble) */}
                  {r.error ? (
                    <div className="bg-red-900/30 border border-red-700/40 rounded-xl px-3 py-2"><p className="text-base text-red-300">{r.error}</p></div>
                  ) : r.blocks ? (
                    <BreakdownSection blocks={r.blocks} lang={lang} onSave={handleSave} onSpeak={handleSpeak} savedAIPhrases={savedAIPhrases} />
                  ) : r.phrases ? (
                    <div className="space-y-1.5">
                      {r.phrases.map((p, pi) => (
                        <AIResultCard key={pi} phrase={p} lang={lang} onSave={() => handleSave(p, `Follow-up: ${r.query}`)} onSpeak={() => handleSpeak(p.target)} isSaved={savedAIPhrases.some(s => s.target === p.target)} />
                      ))}
                    </div>
                  ) : r.phrase?.target ? (
                    <AIResultCard phrase={r.phrase} lang={lang} onSave={() => handleSave(r.phrase!, `Follow-up: ${r.query}`)} onSpeak={() => handleSpeak(r.phrase!.target)} isSaved={savedAIPhrases.some(s => s.target === r.phrase!.target)} />
                  ) : null}
                  {i < followUpResults.length - 1 && <div className="border-t border-slate-800/50 my-1" />}
                </div>
              ))}
              {followUpLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-sm text-slate-400">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="shrink-0 px-4 py-3 border-t border-slate-700/50 space-y-2">
              <div className="flex gap-2">
                <textarea value={followUpQuery} onChange={e => setFollowUpQuery(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleFollowUp(); } }} placeholder="Ask a follow-up..." rows={2} className="flex-1 bg-slate-800 text-slate-100 placeholder-slate-500 rounded-xl px-4 py-2.5 text-base outline-none focus:ring-2 focus:ring-indigo-400/50 transition resize-none" disabled={followUpLoading} />
                <button onClick={() => handleFollowUp()} disabled={followUpLoading || !followUpQuery.trim()} className="bg-indigo-600 text-white px-4 rounded-xl text-base font-medium disabled:opacity-30 active:bg-indigo-700 transition shrink-0 self-end py-2.5">Ask</button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {FOLLOW_UP_CHIPS.map(chip => (
                  <button key={chip.label} onClick={() => handleFollowUp(chip.prompt || undefined, chip.mode)} disabled={followUpLoading} className="text-sm bg-indigo-900/30 text-indigo-300 px-2.5 py-1 rounded-lg active:bg-indigo-800/50 transition disabled:opacity-30">{chip.label}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
