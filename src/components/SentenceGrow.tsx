import { useState, useRef, useEffect } from 'react';
import { speak } from '../utils/tts';
import { askSentenceExpansion, isAIConfigured } from '../utils/ai';
import type { SentenceExpansion } from '../utils/ai';
import { SEED_SENTENCES, SEED_GROUPS, FALLBACK_CHAINS } from '../data/sentence-grow';
import type { SeedSentence } from '../data/sentence-grow';

interface TimelineEntry {
  label: string;
  target: string;
  pronunciation: string;
  pronunciation_chunks: string;
  english: string;
  added: string;
}

interface Props {
  onSave?: (phrase: { jp: string; rom: string; en: string }) => void;
}

export function SentenceGrow({ onSave }: Props) {
  const [seed, setSeed] = useState<SeedSentence | null>(null);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [options, setOptions] = useState<SentenceExpansion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const configured = isAIConfigured();

  const currentSentence = timeline.length > 0 ? timeline[timeline.length - 1] : null;
  const currentTarget = currentSentence?.target || seed?.target || '';
  const currentEnglish = currentSentence?.english || seed?.english || '';
  const usedLabels = timeline.map(t => t.label);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [timeline, options]);

  const loadExpansions = async (target: string, english: string, labels: string[]) => {
    setLoading(true);
    setError('');
    try {
      const expansions = await askSentenceExpansion(target, english, labels);
      setOptions(expansions);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to get expansions');
    } finally {
      setLoading(false);
    }
  };

  const startSeed = (s: SeedSentence) => {
    setSeed(s);
    setTimeline([]);
    setOptions([]);
    setDone(false);
    setError('');

    if (configured) {
      loadExpansions(s.target, s.english, []);
    } else {
      // Use fallback chains
      const chain = FALLBACK_CHAINS[s.id];
      if (chain && chain[0]) {
        setOptions(chain[0]);
      }
    }
  };

  const pickExpansion = (exp: SentenceExpansion) => {
    const newTimeline = [...timeline, {
      label: exp.label,
      target: exp.target,
      pronunciation: exp.pronunciation,
      pronunciation_chunks: exp.pronunciation_chunks,
      english: exp.english,
      added: exp.added,
    }];
    setTimeline(newTimeline);
    setOptions([]);

    const newLabels = newTimeline.map(t => t.label);

    // Stop after 4 expansions
    if (newTimeline.length >= 4) {
      setDone(true);
      return;
    }

    if (configured) {
      loadExpansions(exp.target, exp.english, newLabels);
    } else {
      // No more fallback chains for deeper levels — mark done
      setDone(true);
    }
  };

  const reset = () => {
    setSeed(null);
    setTimeline([]);
    setOptions([]);
    setDone(false);
    setError('');
  };

  // Seed picker view
  if (!seed) {
    return (
      <div className="scroll-area h-full">
        <div className="px-4 py-3 border-b border-slate-800">
          <h2 className="text-lg font-bold">🌱 Sentence Grow</h2>
          <p className="text-base text-slate-400">Start simple, expand step by step</p>
        </div>

        <div className="p-4 space-y-4">
          <div className="bg-emerald-900/20 border border-emerald-700/30 rounded-xl p-3">
            <p className="text-sm text-emerald-300">Pick a seed sentence, then grow it by adding grammar layers — destination, companion, time, and more.</p>
          </div>

          {SEED_GROUPS.map(group => {
            const seeds = SEED_SENTENCES.filter(s => s.group === group.id);
            if (seeds.length === 0) return null;
            return (
              <div key={group.id}>
                <p className="text-sm text-slate-500 mb-2">{group.emoji} {group.label}</p>
                <div className="grid grid-cols-2 gap-2">
                  {seeds.map(s => (
                    <button
                      key={s.id}
                      onClick={() => startSeed(s)}
                      className="bg-slate-800/60 rounded-xl p-3 text-left active:bg-slate-700/50 transition"
                    >
                      <p className="text-lg font-medium text-slate-100">{s.target}</p>
                      <p className="text-sm text-sakura-300 mt-0.5">{s.pronunciation_chunks}</p>
                      <p className="text-sm text-slate-400 mt-0.5">{s.english}</p>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          {!configured && (
            <p className="text-sm text-amber-400 text-center">⚠️ AI not configured — using pre-built expansions (1 level only)</p>
          )}
        </div>
      </div>
    );
  }

  // Growth view
  const finalEntry = timeline.length > 0 ? timeline[timeline.length - 1] : null;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div>
          <button onClick={reset} className="text-base text-slate-400 active:text-slate-200 p-1">← Back</button>
          <p className="text-sm text-slate-500">Level {timeline.length} / 4</p>
        </div>
        <div className="flex items-center gap-2">
          {done && onSave && finalEntry && (
            <button
              onClick={() => onSave({ jp: finalEntry.target, rom: finalEntry.pronunciation_chunks, en: finalEntry.english })}
              className="text-sm px-3 py-1.5 rounded-lg bg-emerald-600/60 text-emerald-100 active:bg-emerald-600/80 transition"
            >⭐ Save</button>
          )}
        </div>
      </div>

      {/* Timeline + Options */}
      <div ref={scrollRef} className="scroll-area flex-1 px-4 py-3">
        {/* Seed card */}
        <div className="mb-3">
          <p className="text-xs text-slate-500 mb-1">Seed</p>
          <div className="bg-slate-800/60 rounded-xl p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-bold text-slate-100">{seed.target}</p>
                <p className="text-sm text-sakura-300">{seed.pronunciation_chunks}</p>
                <p className="text-sm text-slate-400">{seed.english}</p>
              </div>
              <button
                onClick={() => speak(seed.target, 'ja-JP')}
                className="text-lg p-1 active:scale-110 transition-transform shrink-0"
              >🔊</button>
            </div>
          </div>
        </div>

        {/* Expansion timeline */}
        {timeline.map((entry, i) => (
          <div key={i} className="mb-3 relative">
            {/* Connector line */}
            <div className="absolute left-4 -top-3 w-px h-3 bg-emerald-600/40" />
            <p className="text-xs text-emerald-400 mb-1">
              <span className="inline-block bg-emerald-800/40 px-2 py-0.5 rounded-full">{entry.label}</span>
              <span className="text-slate-600 ml-1">Level {i + 1}</span>
            </p>
            <div className="bg-slate-800/60 rounded-xl p-3 border border-emerald-700/20">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-medium text-slate-100">
                    {highlightAdded(entry.target, entry.added)}
                  </p>
                  <p className="text-sm text-sakura-300">{entry.pronunciation_chunks}</p>
                  <p className="text-sm text-slate-400">{entry.english}</p>
                </div>
                <button
                  onClick={() => speak(entry.target, 'ja-JP')}
                  className="text-lg p-1 active:scale-110 transition-transform shrink-0"
                >🔊</button>
              </div>
            </div>
          </div>
        ))}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-6">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-400" />
            <p className="text-sm text-slate-500 ml-2">Thinking of expansions...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-900/20 border border-red-700/30 rounded-xl p-3 mb-3">
            <p className="text-sm text-red-300">{error}</p>
            <button
              onClick={() => loadExpansions(currentTarget, currentEnglish, usedLabels)}
              className="text-sm text-red-400 underline mt-1"
            >Retry</button>
          </div>
        )}

        {/* Expansion options */}
        {!loading && !done && options.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-slate-500 mb-2">Choose an expansion:</p>
            <div className="space-y-2">
              {options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => pickExpansion(opt)}
                  className="w-full bg-emerald-900/20 border border-emerald-700/30 rounded-xl p-3 text-left active:bg-emerald-800/30 transition"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs bg-emerald-800/50 text-emerald-300 px-2 py-0.5 rounded-full">{opt.label}</span>
                    <span className="text-xs text-slate-500">+{opt.added}</span>
                  </div>
                  <p className="text-base text-slate-100">{opt.target}</p>
                  <p className="text-sm text-sakura-300">{opt.pronunciation_chunks}</p>
                  <p className="text-sm text-slate-400">{opt.english}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Done state */}
        {done && (
          <div className="bg-emerald-900/20 border border-emerald-700/30 rounded-xl p-4 text-center mb-3">
            <p className="text-2xl mb-2">🎉</p>
            <p className="text-base font-semibold text-emerald-300">Sentence complete!</p>
            <p className="text-sm text-slate-400 mt-1">
              {seed.target} grew into {timeline.length} levels
            </p>
            <div className="flex gap-2 mt-3 justify-center">
              <button
                onClick={reset}
                className="text-sm px-4 py-2 rounded-lg bg-slate-700/60 text-slate-300 active:bg-slate-600 transition"
              >Try another</button>
              {!configured && timeline.length <= 1 && (
                <p className="text-xs text-amber-400 self-center">Configure AI for deeper expansions</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Highlight the added portion in the sentence
function highlightAdded(sentence: string, added: string): React.ReactNode {
  if (!added) return sentence;
  const idx = sentence.indexOf(added);
  if (idx === -1) return sentence;
  return (
    <>
      {sentence.slice(0, idx)}
      <span className="text-emerald-300 font-semibold">{added}</span>
      {sentence.slice(idx + added.length)}
    </>
  );
}
