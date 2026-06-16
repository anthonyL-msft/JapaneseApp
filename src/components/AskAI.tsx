import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { askHowToSay, askFollowUp, askFollowUpExplain, askFollowUpMulti, askBreakdown, askGrammarQuestion, isAIConfigured } from '../utils/ai';
import type { AIPhrase, FollowUpMessage, BreakdownBlock } from '../utils/ai';
import type { SavedAIPhrase } from '../data/types';
import { speak } from '../utils/tts';
import { LANGUAGES } from '../data/types';
import { breakdownKana, markLengtheners, type KanaUnit } from '../utils/kana';

/** Mark word boundaries in kana units using the pronunciation field (which has word spaces) */
function markWordBoundaries(units: KanaUnit[], pronunciation: string): KanaUnit[] {
  // Split pronunciation into words by spaces
  const words = pronunciation.trim().split(/\s+/);
  const result = units.map(u => ({ ...u }));
  const nonSpace = result.filter(u => !u.isSpace);

  let ki = 0;
  for (let wi = 0; wi < words.length; wi++) {
    if (ki >= nonSpace.length) break;
    // Mark first kana in this word as word break (except first word)
    if (wi > 0) {
      nonSpace[ki].isWordBreak = true;
    }
    // Accumulate romaji from kana units until we match this word exactly
    const wordClean = words[wi].replace(/[·\-ー]/g, '').toLowerCase();
    let acc = '';
    while (ki < nonSpace.length) {
      const rom = (nonSpace[ki].romaji || '').replace(/[–·]/g, '');
      acc += rom.toLowerCase();
      ki++;
      // Only break when we've matched the full word
      if (acc === wordClean) break;
      // Safety: if we've accumulated more chars than the word, we overshot — break
      if (acc.length > wordClean.length + 2) break;
    }
  }
  return result;
}

interface Props {
  lang: string;
  savedAIPhrases: SavedAIPhrase[];
  onSaveAIPhrase: (phrase: SavedAIPhrase) => void;
  onDeleteAIPhrase: (id: string) => void;
  askMorePhrase?: { target: string; pronunciation: string; pronunciation_chunks: string; english: string } | null;
  onClearAskMore?: () => void;
  aiExplainLang?: string;
  aiTutorMode?: string;
  onGoBack?: () => void;
}

function AISounds({ phrase }: { phrase: AIPhrase }) {
  // Only show Sounds when we have a proper hiragana romanization
  const reading = phrase.romanization;
  if (!reading) return null;
  let units = breakdownKana(reading);
  // Use pronunciation field (has word spaces) to mark word boundaries
  if (phrase.pronunciation) {
    units = markWordBoundaries(units, phrase.pronunciation);
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

function toHepburnFromKana(term: string): string | null {
  const units = markLengtheners(breakdownKana(term));
  const hasReadable = units.some(u => !!u.romaji);
  if (!hasReadable) return null;

  // If token contains kanji/non-kana only chars with no reading map, skip clickable reading.
  const hasUnmappedSymbol = units.some(u => !u.isSpace && !u.romaji && /[\u3400-\u9FFF々]/.test(u.char));
  if (hasUnmappedSymbol) return null;

  const parts = units
    .filter(u => !u.isSpace && !!u.romaji)
    .map(u => (u.romaji === '–' ? '-' : u.romaji));

  if (parts.length === 0) return null;
  return parts.join(' ');
}

function ExplanationBubble({ text, example, onSpeak }: { text: string; example?: AIPhrase; onSpeak?: (text: string) => void }) {
  const [activeTerm, setActiveTerm] = useState<string | null>(null);
  const parts = text.split(/(「[^」]+」|『[^』]+』|“[^”]+”|"[^"]+")/g).filter(Boolean);

  const parseQuoted = (part: string): { inner: string; raw: string } | null => {
    let m = part.match(/^「([^」]+)」$/);
    if (m) return { inner: m[1], raw: part };
    m = part.match(/^『([^』]+)』$/);
    if (m) return { inner: m[1], raw: part };
    m = part.match(/^“([^”]+)”$/);
    if (m) return { inner: m[1], raw: part };
    m = part.match(/^"([^"]+)"$/);
    if (m) return { inner: m[1], raw: part };
    return null;
  };

  return (
    <div className="bg-slate-800 rounded-2xl rounded-tl-sm px-3 py-2 space-y-2">
      <p className="text-base text-slate-200 whitespace-pre-wrap leading-relaxed">
        {parts.map((part, i) => {
          const quoted = parseQuoted(part);
          if (!quoted) return <span key={i}>{part}</span>;
          const inner = quoted.inner;
          const hepburn = toHepburnFromKana(inner);
          if (!hepburn) return <span key={i}>{quoted.raw}</span>;

          const isActive = activeTerm === inner;
          return (
            <button
              key={i}
              onClick={() => setActiveTerm(prev => (prev === inner ? null : inner))}
              className={`inline rounded-md px-1 py-0.5 mx-0.5 transition ${isActive ? 'bg-indigo-700/40 text-indigo-200' : 'bg-indigo-900/20 text-indigo-300 active:bg-indigo-800/40'}`}
              title="Tap to show Hepburn"
              type="button"
            >
              {quoted.raw}
            </button>
          );
        })}
      </p>
      {activeTerm && (
        <div className="bg-indigo-900/20 border border-indigo-700/30 rounded-lg px-2.5 py-1.5">
          <p className="text-xs text-slate-500">Hepburn</p>
          <p className="text-sm text-indigo-200 font-mono">{toHepburnFromKana(activeTerm)}</p>
        </div>
      )}
      {example && (
        <div className="bg-slate-700/40 rounded-lg p-2.5 mt-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-base font-medium text-slate-100">{example.target}</p>
              <p className="text-sm text-sakura-300">{example.pronunciation}</p>
              <p className="text-sm text-slate-400">{example.english}</p>
            </div>
            {onSpeak && <button onClick={() => onSpeak(example.target)} className="p-1 rounded-lg active:bg-slate-600 text-base shrink-0">🔊</button>}
          </div>
        </div>
      )}
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
            <p className="text-base text-sakura-300 mt-0.5">{phrase.pronunciation}</p>
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
  { label: 'When to use?', prompt: 'When and where would I use this phrase? Is it polite enough for strangers? Any situations where I should NOT use it?', mode: 'explain' as const },
  { label: 'More examples', prompt: 'Show me 3-5 more examples using the same sentence pattern but with different objects, contexts, or similar expressions.', mode: 'multi' as const },
  { label: 'Break it down', prompt: '', mode: 'breakdown' as const },
];

const HISTORY_KEY = 'ai_history';
const GRAMMAR_HISTORY_KEY = 'ai_grammar_history';
const THREADS_KEY = 'ai_threads';
const MAX_HISTORY = 10;
const MAX_THREADS = 5;

type FollowUpResult = { query: string; phrase?: AIPhrase; phrases?: AIPhrase[]; blocks?: BreakdownBlock[]; explanation?: string; explanationExample?: AIPhrase; error?: string };

function isExplanationQuestion(q: string): boolean {
  const text = q.toLowerCase();
  const normalized = text.replace(/\s+/g, ' ').trim();

  // Phrase-generation intent takes priority — NOT explanation
  if (/\b(give\s+me|make\s+it|say\s+it|version|simpler|shorter|polite|casual|formal|turn\s+(this|it)\s+into|how\s+do\s+i\s+(say|ask)|how\s+to\s+say)\b/.test(normalized)) {
    return false;
  }

  return /why|difference|grammar|particle|what\s+does|what\s+is|part\s+of\s+speech|word class|usage|meaning/.test(normalized)
    || /\bhow\s+to\s+use\b/.test(normalized)
    || /\bcan\s+i\s+use\b/.test(normalized)
    || /\b(is|does)\s+(this|it|that)\b/.test(normalized)
    || /\bwhen\s+(do|can|should|would)\s+i\s+use\b/.test(normalized)
    || /\bwhere\s+(do|can|should|would)\s+i\s+use\b/.test(normalized)
    || /\bdo\s+i\s+(need|have)\s+to\b/.test(normalized)
    || /\bwhat\s+about\b/.test(normalized)
    || /\bwhat\s+if\b/.test(normalized)
    || /\bis\s+(this|it)\s+(rude|polite|formal|casual|natural|correct|wrong|ok|okay)\b/.test(normalized)
    || /\buse\s+(this|it|that)\s+for\b/.test(normalized)
    || /\bso\s+(i|we|you)\s+(just|can|should|need)\b/.test(normalized)
    || /怎麼用|如何使用|用法|什麼時候用/.test(q)
    || /為什麼|文法|語法|詞性|差別|差異|是什麼|什麼意思|為何|可以用在|能用在|適合用在/.test(q);
}

function getThreadKey(phrase: AIPhrase): string {
  const target = phrase.target.trim().toLowerCase();
  const pron = phrase.pronunciation.trim().toLowerCase();
  const en = phrase.english.trim().toLowerCase();
  return `${target}||${pron}||${en}`;
}

function loadHistory(): AIPhrase[] {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch { return []; }
}

function saveHistory(history: AIPhrase[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));
}

type GrammarHistoryItem = { question: string; answer: string; example?: AIPhrase };

function loadGrammarHistory(): GrammarHistoryItem[] {
  try { return JSON.parse(localStorage.getItem(GRAMMAR_HISTORY_KEY) || '[]'); } catch { return []; }
}

function saveGrammarHistory(history: GrammarHistoryItem[]) {
  localStorage.setItem(GRAMMAR_HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));
}

function loadThread(threadKey: string, legacyTarget?: string): FollowUpResult[] {
  try {
    const threads = JSON.parse(localStorage.getItem(THREADS_KEY) || '{}');
    if (threads[threadKey]) return threads[threadKey];
    if (legacyTarget && threads[legacyTarget]) return threads[legacyTarget];
    return [];
  } catch { return []; }
}

function saveThread(threadKey: string, results: FollowUpResult[]) {
  try {
    const threads = JSON.parse(localStorage.getItem(THREADS_KEY) || '{}');
    threads[threadKey] = results;
    // Cap at MAX_THREADS — keep most recent
    const keys = Object.keys(threads);
    if (keys.length > MAX_THREADS) {
      delete threads[keys[0]];
    }
    localStorage.setItem(THREADS_KEY, JSON.stringify(threads));
  } catch { /* ignore */ }
}

function clearThread(threadKey: string, legacyTarget?: string) {
  try {
    const threads = JSON.parse(localStorage.getItem(THREADS_KEY) || '{}');
    delete threads[threadKey];
    if (legacyTarget) delete threads[legacyTarget];
    localStorage.setItem(THREADS_KEY, JSON.stringify(threads));
  } catch { /* ignore */ }
}

export function AskAI({ lang, savedAIPhrases, onSaveAIPhrase, onDeleteAIPhrase, askMorePhrase, onClearAskMore, aiExplainLang = 'en', aiTutorMode = 'teacher', onGoBack }: Props) {
  const [query, setQuery] = useState('');
  const [aiMode, setAiMode] = useState<'translate' | 'grammar'>('translate');
  const [result, setResult] = useState<AIPhrase | null>(null);
  const [grammarResult, setGrammarResult] = useState<{ question: string; answer: string; example?: AIPhrase } | null>(null);
  const [grammarThread, setGrammarThread] = useState<{ question: string; answer: string; example?: AIPhrase }[]>([]);
  const [grammarFollowUpQuery, setGrammarFollowUpQuery] = useState('');
  const [grammarFollowUpLoading, setGrammarFollowUpLoading] = useState(false);
  const [grammarDrawerOpen, setGrammarDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBig, setShowBig] = useState<string | null>(null);
  const [history, setHistory] = useState<AIPhrase[]>(loadHistory);
  const [grammarHistory, setGrammarHistory] = useState<GrammarHistoryItem[]>(loadGrammarHistory);
  const [followUpOpen, setFollowUpOpen] = useState(false);
  const [followUpPhrase, setFollowUpPhrase] = useState<AIPhrase | null>(null);
  const [followUpQuery, setFollowUpQuery] = useState('');
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const [followUpResults, setFollowUpResults] = useState<FollowUpResult[]>([]);
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
      const threadKey = getThreadKey(phrase);
      setFollowUpPhrase(phrase);
      setFollowUpResults(loadThread(threadKey, phrase.target));
      setFollowUpHistory([]);
      setFollowUpQuery('');
      setFollowUpOpen(true);
      // Save to history so it appears in Recent Translations
      setHistory(prev => {
        const next = [phrase, ...prev.filter(h => h.target !== phrase.target).slice(0, MAX_HISTORY - 1)];
        saveHistory(next);
        return next;
      });
      onClearAskMore?.();
    }
  }, [askMorePhrase, onClearAskMore]);

  const handleAsk = async () => {
    if (!query.trim() || loading) return;
    setLoading(true); setError(null); setResult(null); setGrammarResult(null); setGrammarThread([]);
    const q = query.trim();
    try {
      // Use toggle mode: grammar mode always explains, translate mode always translates
      if (aiMode === 'grammar') {
        const resp = await askGrammarQuestion(q, lang, aiExplainLang);
        const item = { question: q, answer: resp.answer, example: resp.example };
        setGrammarResult(item);
        setGrammarThread([]);
        setGrammarFollowUpQuery('');
        setGrammarDrawerOpen(true);
        setGrammarHistory(prev => {
          const next = [item, ...prev.filter(h => h.question !== q).slice(0, MAX_HISTORY - 1)];
          saveGrammarHistory(next);
          return next;
        });
      } else {
        const phrase = await askHowToSay(q, lang, aiExplainLang);
        setResult(phrase);
        setHistory(prev => {
          const next = [phrase, ...prev.filter(h => h.target !== phrase.target).slice(0, MAX_HISTORY - 1)];
          saveHistory(next);
          return next;
        });
      }
    } catch (err) { setError(err instanceof Error ? err.message : 'Something went wrong'); }
    finally { setLoading(false); }
  };

  const handleSpeak = (text: string) => speak(text, currentLang.ttsLang);

  const handleGrammarFollowUp = async (promptText?: string) => {
    const q = promptText || grammarFollowUpQuery.trim();
    if (!q || grammarFollowUpLoading || !grammarResult) return;
    setGrammarFollowUpLoading(true); setGrammarFollowUpQuery('');
    try {
      const resp = await askGrammarQuestion(q, lang, aiExplainLang);
      const item = { question: q, answer: resp.answer, example: resp.example };
      setGrammarThread(prev => [...prev, item]);
    } catch { /* ignore */ }
    finally { setGrammarFollowUpLoading(false); }
  };

  const handleSave = useCallback((phrase: AIPhrase, originalQuery: string) => {
    // Toggle: if already saved, delete it; otherwise save
    const existing = savedAIPhrases.find(s => s.target === phrase.target);
    if (existing) {
      onDeleteAIPhrase(existing.id);
    } else {
      const id = `ai_${Date.now()}`;
      onSaveAIPhrase({ id, lang, target: phrase.target, romanization: phrase.romanization, pronunciation: phrase.pronunciation, pronunciation_chunks: phrase.pronunciation_chunks, english: phrase.english, chinese_tc: phrase.chinese_tc, notes: phrase.notes, native_hint: phrase.native_hint, query: originalQuery, createdAt: Date.now() });
    }
  }, [lang, onSaveAIPhrase, onDeleteAIPhrase, savedAIPhrases]);

  const closeFollowUpDrawer = useCallback(() => {
    setFollowUpOpen(false);
    if (onGoBack) onGoBack();
  }, [onGoBack]);

  const openFollowUp = (phrase: AIPhrase) => {
    const threadKey = getThreadKey(phrase);
    setFollowUpPhrase(phrase);
    setFollowUpResults(loadThread(threadKey, phrase.target));
    setFollowUpHistory([]);
    setFollowUpQuery('');
    setFollowUpOpen(true);
  };

  const handleFollowUp = async (promptText?: string, mode: 'single' | 'multi' | 'breakdown' | 'explain' = 'single') => {
    const q = promptText || followUpQuery.trim();
    const isFromChip = !!promptText; // chips pass promptText; textbox does not
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
      } else if (mode === 'explain') {
        // Explicit explanation mode (from chip or forced)
        const explanation = await askFollowUpExplain(followUpPhrase, q, lang, aiExplainLang, aiTutorMode);
        setFollowUpResults(prev => [...prev, { query: displayQuery, explanation: explanation.answer, explanationExample: explanation.example }]);
        setFollowUpHistory(prev => [...prev, { role: 'user', content: q }, { role: 'assistant', content: explanation.answer }]);
      } else {
        // Chips always generate phrases; textbox uses intent detection
        const shouldExplain = !isFromChip && isExplanationQuestion(q);
        if (shouldExplain) {
          const explanation = await askFollowUpExplain(followUpPhrase, q, lang, aiExplainLang, aiTutorMode);
          setFollowUpResults(prev => [...prev, { query: displayQuery, explanation: explanation.answer, explanationExample: explanation.example }]);
          setFollowUpHistory(prev => [...prev, { role: 'user', content: q }, { role: 'assistant', content: explanation.answer }]);
        } else {
          const response = await askFollowUp(followUpPhrase, q, followUpHistory, lang, aiExplainLang);
          setFollowUpResults(prev => [...prev, { query: displayQuery, phrase: response }]);
          setFollowUpHistory(prev => [...prev, { role: 'user', content: q }, { role: 'assistant', content: JSON.stringify(response) }]);
        }
      }
    } catch (err) {
      setFollowUpResults(prev => [...prev, { query: displayQuery, error: err instanceof Error ? err.message : 'Error' }]);
    } finally { setFollowUpLoading(false); }
  };

  // Persist follow-up thread to localStorage whenever results change
  useEffect(() => {
    if (followUpPhrase && followUpResults.length > 0) {
      saveThread(getThreadKey(followUpPhrase), followUpResults);
    }
  }, [followUpResults, followUpPhrase]);

  useEffect(() => {
    if (followUpScrollRef.current) followUpScrollRef.current.scrollTop = followUpScrollRef.current.scrollHeight;
  }, [followUpResults, followUpLoading]);

  if (!configured) return (
    <div className="scroll-area h-full flex flex-col items-center justify-center px-6 text-center">
      <p className="text-4xl mb-4">🤖</p>
      <p className="text-lg font-semibold text-slate-200">AI not configured</p>
      <p className="text-base text-slate-400 mt-2">Add your Azure OpenAI API key in <code className="text-sakura-300">.env.local</code> to enable the AI tutor.</p>
    </div>
  );

  return (
    <div className="scroll-area h-full">
      <div className="px-4 py-3 border-b border-slate-800">
        <h2 className="text-lg font-bold">🤖 AI Language Tutor</h2>
        <p className="text-base text-slate-400">Translate, ask follow-ups, and learn {currentLang.name} naturally</p>
      </div>
      <div className="p-4 space-y-4">
        {/* Mode toggle */}
        <div className="flex gap-1 bg-slate-800/60 p-1 rounded-lg">
          <button onClick={() => setAiMode('translate')} className={`flex-1 py-1.5 text-sm rounded-md transition ${aiMode === 'translate' ? 'bg-slate-700 text-slate-100' : 'text-slate-500 active:bg-slate-700/50'}`}>🗣️ Translate</button>
          <button onClick={() => setAiMode('grammar')} className={`flex-1 py-1.5 text-sm rounded-md transition ${aiMode === 'grammar' ? 'bg-slate-700 text-slate-100' : 'text-slate-500 active:bg-slate-700/50'}`}>📐 Grammar</button>
        </div>
        <div className="flex gap-2">
          <input type="text" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAsk()} placeholder={aiMode === 'grammar' ? 'e.g., how to use は? / why に not で?' : 'e.g., I want to split the bill'} className="flex-1 bg-slate-800 text-slate-100 placeholder-slate-500 rounded-xl px-4 py-3 text-base outline-none focus:ring-2 focus:ring-sakura-400/50 transition" disabled={loading} />
          <button onClick={handleAsk} disabled={loading || !query.trim()} className="bg-sakura-500/80 text-white px-4 py-3 rounded-xl text-base font-medium disabled:opacity-30 active:bg-sakura-600 transition shrink-0">{loading ? '...' : 'Ask'}</button>
        </div>

        {!result && !grammarResult && !loading && ((aiMode === 'translate' && history.length === 0) || (aiMode === 'grammar' && grammarHistory.length === 0)) && (
          <div>
            <p className="text-base text-slate-500 mb-2">Try asking:</p>
            <div className="flex flex-wrap gap-1.5">
              {(aiMode === 'grammar'
                ? ['How to use は?', 'Why に not で?', 'What does か do?', 'は vs が difference', 'When to use を?', 'What is ます form?']
                : ['I want to split the bill', 'Is this seat taken?', 'Can I have the vegetarian option?', 'Where is the nearest ATM?', "I'm allergic to peanuts", 'Can you take a photo of us?']
              ).map(s => (
                <button key={s} onClick={() => setQuery(s)} className="text-base bg-slate-800 text-slate-400 px-2.5 py-1.5 rounded-lg active:bg-slate-700 transition">{s}</button>
              ))}
            </div>
          </div>
        )}

        {loading && <div className="flex items-center justify-center py-8"><div className="animate-pulse text-slate-400 text-base">{aiMode === 'grammar' ? 'Thinking...' : 'Translating...'}</div></div>}
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

        {/* Grammar results shown in drawer below */}

        {aiMode === 'translate' && history.length > 0 && (
          <div>
            <h3 className="text-base text-slate-500 mb-2">History</h3>
            <div className="space-y-1.5">
              {history.map((h, i) => (
                <div key={i} className="bg-slate-800/50 rounded-xl p-2.5 flex items-center gap-2 active:bg-slate-700/50 transition cursor-pointer" onClick={() => openFollowUp(h)}>
                  <div className="flex-1 min-w-0">
                    <p className="text-base text-slate-200 truncate">{h.target}</p>
                    <p className="text-base text-sakura-300 truncate">{h.pronunciation}</p>
                    <p className="text-base text-slate-500 truncate">{h.english}</p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); handleSpeak(h.target); }} className="p-1 rounded-lg active:bg-slate-600 text-lg shrink-0">🔊</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {aiMode === 'grammar' && grammarHistory.length > 0 && (
          <div>
            <h3 className="text-base text-slate-500 mb-2">History</h3>
            <div className="space-y-1.5">
              {grammarHistory.map((h, i) => (
                <div key={i} className="bg-slate-800/50 rounded-xl p-2.5 cursor-pointer active:bg-slate-700/50 transition" onClick={() => { setGrammarResult(h); setGrammarThread([]); setGrammarFollowUpQuery(''); setGrammarDrawerOpen(true); }}>
                  <p className="text-base text-slate-200 truncate">{h.question}</p>
                  <p className="text-base text-slate-500 truncate">{h.answer.slice(0, 60)}...</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showBig && createPortal(
        <div onClick={() => setShowBig(null)} className="fixed inset-0 z-[90] bg-slate-950 flex flex-col items-center justify-center p-8 cursor-pointer">
          <p className="text-4xl font-bold text-white text-center leading-relaxed">{showBig}</p>
          <p className="text-lg text-sakura-300 mt-4 text-center">{result?.pronunciation_chunks || result?.pronunciation}</p>
          <button onClick={(e) => { e.stopPropagation(); if (result) handleSpeak(result.target); }} className="mt-6 text-4xl active:scale-110 transition-transform">🔊</button>
          <p className="text-base text-slate-600 mt-8">Tap anywhere to close</p>
        </div>,
        document.body
      )}

      {followUpOpen && followUpPhrase && createPortal(
        <div className="fixed inset-0 z-[80] flex flex-col justify-end" onClick={closeFollowUpDrawer}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative bg-slate-950 rounded-t-2xl flex flex-col animate-slide-up" style={{ height: '100dvh', paddingTop: 'env(safe-area-inset-top, 0px)' }} onClick={e => e.stopPropagation()}>
            <div className="shrink-0">
              <div className="flex justify-center pt-2 pb-1"><div className="w-10 h-1 rounded-full bg-slate-600" /></div>
              <div className="px-4 pb-3 border-b border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-slate-100 truncate">{followUpPhrase.target}</p>
                    <p className="text-sm text-sakura-300 truncate">{followUpPhrase.pronunciation}</p>
                    <p className="text-sm text-slate-500 truncate">{followUpPhrase.english}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {followUpResults.length > 0 && (
                      <button onClick={() => { setFollowUpResults([]); setFollowUpHistory([]); clearThread(getThreadKey(followUpPhrase), followUpPhrase.target); }} className="text-sm text-slate-500 px-2 py-1 rounded-lg active:bg-slate-700 transition">Clear</button>
                    )}
                    <button onClick={closeFollowUpDrawer} className="text-xl text-slate-400 p-2">✕</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3" ref={followUpScrollRef}>
              {/* Original phrase card */}
              <AIResultCard
                phrase={followUpPhrase}
                lang={lang}
                onSave={() => handleSave(followUpPhrase, 'Original')}
                onSpeak={() => handleSpeak(followUpPhrase.target)}
                isSaved={savedAIPhrases.some(s => s.target === followUpPhrase.target)}
                defaultExpanded={followUpResults.length === 0}
              />
              {followUpResults.length === 0 && !followUpLoading && (
                <div className="text-center py-4">
                  <p className="text-sm text-slate-600">Tap a chip or type a question below</p>
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
                  ) : r.explanation ? (
                    <ExplanationBubble text={r.explanation} example={r.explanationExample} onSpeak={handleSpeak} />
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
            <div className="shrink-0 px-4 pt-3 pb-2 border-t border-slate-700/50 space-y-2">
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
        </div>,
        document.body
      )}

      {grammarDrawerOpen && grammarResult && createPortal(
        <div className="fixed inset-0 z-[80] flex flex-col justify-end" onClick={() => setGrammarDrawerOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative bg-slate-950 rounded-t-2xl flex flex-col animate-slide-up" style={{ height: '100dvh', paddingTop: 'env(safe-area-inset-top, 0px)' }} onClick={e => e.stopPropagation()}>
            <div className="shrink-0">
              <div className="flex justify-center pt-2 pb-1"><div className="w-10 h-1 rounded-full bg-slate-600" /></div>
              <div className="px-4 pb-3 border-b border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-indigo-400">Grammar Q&A</p>
                    <p className="text-base font-semibold text-slate-100 truncate">{grammarResult.question}</p>
                  </div>
                  <button onClick={() => setGrammarDrawerOpen(false)} className="text-xl text-slate-400 p-2">✕</button>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <ExplanationBubble text={grammarResult.answer} example={grammarResult.example} onSpeak={handleSpeak} />

              {grammarThread.map((t, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-end">
                    <div className="bg-indigo-900/60 rounded-2xl rounded-tr-sm px-3 py-2 max-w-[85%]">
                      <p className="text-base text-slate-200">{t.question}</p>
                    </div>
                  </div>
                  <ExplanationBubble text={t.answer} example={t.example} onSpeak={handleSpeak} />
                </div>
              ))}

              {grammarFollowUpLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3">
                    <span className="text-sm text-slate-400 animate-pulse">Thinking...</span>
                  </div>
                </div>
              )}
            </div>
            <div className="shrink-0 px-4 pt-3 pb-2 border-t border-slate-700/50 space-y-2">
              <div className="flex flex-wrap gap-1.5">
                {['More examples', 'Compare with が', 'When NOT to use?'].map(chip => (
                  <button key={chip} onClick={() => handleGrammarFollowUp(chip)} disabled={grammarFollowUpLoading} className="text-sm bg-indigo-900/30 text-indigo-300 px-2.5 py-1 rounded-lg active:bg-indigo-800/50 transition disabled:opacity-30">{chip}</button>
                ))}
              </div>
              <div className="flex gap-2">
                <textarea value={grammarFollowUpQuery} onChange={e => setGrammarFollowUpQuery(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleGrammarFollowUp(); } }} placeholder="Ask a follow-up..." rows={2} className="flex-1 bg-slate-800 text-slate-100 placeholder-slate-500 rounded-xl px-4 py-2.5 text-base outline-none focus:ring-2 focus:ring-indigo-400/50 transition resize-none" disabled={grammarFollowUpLoading} />
                <button onClick={() => handleGrammarFollowUp()} disabled={grammarFollowUpLoading || !grammarFollowUpQuery.trim()} className="bg-indigo-600 text-white px-4 rounded-xl text-base font-medium disabled:opacity-30 active:bg-indigo-700 transition shrink-0 self-end py-2.5">Ask</button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
