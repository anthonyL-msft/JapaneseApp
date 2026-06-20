import { useState, useEffect, useCallback, useRef } from 'react';
import { speak } from '../utils/tts';
import { useSlidePanel } from '../utils/useSlidePanel';
import { HIRAGANA_VOCAB_CARDS, KATAKANA_VOCAB_CARDS } from '../data/kana-data';
import type { KanaVocabCard } from '../data/kana-data';

type MatchCategory = 'vocab-h' | 'vocab-k' | 'mixed';

const PAIR_COUNT = 6; // 6 pairs per round

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getBestTime(cat: MatchCategory): number | null {
  try {
    const v = localStorage.getItem(`match_best_${cat}`);
    return v ? parseInt(v, 10) : null;
  } catch { return null; }
}

function saveBestTime(cat: MatchCategory, ms: number) {
  const prev = getBestTime(cat);
  if (!prev || ms < prev) localStorage.setItem(`match_best_${cat}`, String(ms));
}

interface MatchPair {
  id: number;
  jp: string;
  en: string;
  hep: string;
}

export function MatchGame() {
  const panel = useSlidePanel<MatchCategory>();

  // Game state
  const [pairs, setPairs] = useState<MatchPair[]>([]);
  const [leftItems, setLeftItems] = useState<{ id: number; jp: string }[]>([]);
  const [rightItems, setRightItems] = useState<{ id: number; en: string }[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [wrong, setWrong] = useState<[number, number] | null>(null);
  const [startTime, setStartTime] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [finished, setFinished] = useState(false);
  const [round, setRound] = useState(1);
  const [totalTime, setTotalTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startGame = (cat: MatchCategory) => {
    panel.open(cat);
    setRound(1);
    setTotalTime(0);
    startRound(cat);
  };

  const startRound = (cat?: MatchCategory) => {
    const category = cat || panel.value;
    let pool: KanaVocabCard[];
    if (category === 'vocab-h') pool = HIRAGANA_VOCAB_CARDS;
    else if (category === 'vocab-k') pool = KATAKANA_VOCAB_CARDS;
    else pool = [...HIRAGANA_VOCAB_CARDS, ...KATAKANA_VOCAB_CARDS];

    const selected = shuffle(pool).slice(0, PAIR_COUNT);
    const newPairs = selected.map((v, i) => ({ id: i, jp: v.jp, en: v.en, hep: v.hep }));
    setPairs(newPairs);
    setLeftItems(shuffle(newPairs.map(p => ({ id: p.id, jp: p.jp }))));
    setRightItems(shuffle(newPairs.map(p => ({ id: p.id, en: p.en }))));
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatched(new Set());
    setWrong(null);
    setFinished(false);
    setStartTime(Date.now());
    setElapsed(0);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setElapsed(Date.now() - Date.now()); // will be overwritten
    }, 100);
    // Use a fresh reference for the timer
    const start = Date.now();
    timerRef.current = setInterval(() => {
      setElapsed(Date.now() - start);
    }, 100);
  };

  // Check match when both sides selected
  useEffect(() => {
    if (selectedLeft === null || selectedRight === null) return;

    if (selectedLeft === selectedRight) {
      // Correct match
      const newMatched = new Set(matched);
      newMatched.add(selectedLeft);
      setMatched(newMatched);
      speak(pairs.find(p => p.id === selectedLeft)?.jp || '', 'ja-JP');
      setSelectedLeft(null);
      setSelectedRight(null);

      // Check if all matched
      if (newMatched.size === PAIR_COUNT) {
        if (timerRef.current) clearInterval(timerRef.current);
        const roundTime = Date.now() - startTime;
        const newTotal = totalTime + roundTime;
        setTotalTime(newTotal);
        if (round >= 3) {
          setFinished(true);
          if (panel.value) saveBestTime(panel.value, newTotal);
        } else {
          // Auto-advance to next round after brief pause
          setTimeout(() => {
            setRound(r => r + 1);
            startRound();
          }, 800);
        }
      }
    } else {
      // Wrong match
      setWrong([selectedLeft, selectedRight]);
      setTimeout(() => {
        setWrong(null);
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 600);
    }
  }, [selectedLeft, selectedRight]);

  // Cleanup
  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const exitGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    panel.close();
  };

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const ds = Math.floor((ms % 1000) / 100);
    return `${s}.${ds}s`;
  };

  return (
    <div className="h-full relative">
      {/* Landing */}
      <div className="scroll-area h-full">
        <div className="px-4 py-3 border-b border-slate-800">
          <h2 className="text-lg font-bold">🃏 Match Game</h2>
          <p className="text-base text-slate-400">Match Japanese ↔ English pairs as fast as you can!</p>
        </div>

        <div className="p-4 space-y-4">
          <div className="bg-slate-800/40 rounded-xl p-3">
            <p className="text-sm text-slate-400">🎯 {PAIR_COUNT} pairs × 3 rounds · Match all pairs to finish</p>
            <p className="text-sm text-slate-500 mt-1">Tap one Japanese word, then tap its English meaning. Speed counts!</p>
          </div>

          <div>
            <p className="text-sm text-slate-500 mb-2">Pick a deck</p>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => startGame('vocab-h')}
                className="bg-purple-900/30 border border-purple-700/30 rounded-xl p-4 text-left active:bg-purple-800/40 transition flex items-center gap-3"
              >
                <span className="text-2xl">🏷️</span>
                <div className="flex-1">
                  <p className="text-base font-semibold text-slate-100">Vocab ひらがな</p>
                  <p className="text-sm text-slate-500">{HIRAGANA_VOCAB_CARDS.length} words</p>
                </div>
                {getBestTime('vocab-h') && (
                  <span className="text-xs text-amber-400">🏆 {formatTime(getBestTime('vocab-h')!)}</span>
                )}
              </button>
              <button
                onClick={() => startGame('vocab-k')}
                className="bg-purple-900/30 border border-purple-700/30 rounded-xl p-4 text-left active:bg-purple-800/40 transition flex items-center gap-3"
              >
                <span className="text-2xl">🏷️</span>
                <div className="flex-1">
                  <p className="text-base font-semibold text-slate-100">Vocab カタカナ</p>
                  <p className="text-sm text-slate-500">{KATAKANA_VOCAB_CARDS.length} words</p>
                </div>
                {getBestTime('vocab-k') && (
                  <span className="text-xs text-amber-400">🏆 {formatTime(getBestTime('vocab-k')!)}</span>
                )}
              </button>
              <button
                onClick={() => startGame('mixed')}
                className="bg-indigo-900/30 border border-indigo-700/30 rounded-xl p-4 text-left active:bg-indigo-800/40 transition flex items-center gap-3"
              >
                <span className="text-2xl">🎲</span>
                <div className="flex-1">
                  <p className="text-base font-semibold text-slate-100">Mixed (All Vocab)</p>
                  <p className="text-sm text-slate-500">{HIRAGANA_VOCAB_CARDS.length + KATAKANA_VOCAB_CARDS.length} words</p>
                </div>
                {getBestTime('mixed') && (
                  <span className="text-xs text-amber-400">🏆 {formatTime(getBestTime('mixed')!)}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Game Panel */}
      {panel.visible && (
        <div className={`absolute inset-0 bg-slate-950 ${panel.animClass} flex flex-col z-40`}>
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div>
              <button onClick={exitGame} className="text-base text-slate-400 active:text-slate-200 p-1">←</button>
              {!finished && (
                <p className="text-base text-slate-400">
                  Round {round}/3 · {formatTime(elapsed)}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-emerald-400">{matched.size}/{PAIR_COUNT}</span>
              {!finished && (
                <button onClick={exitGame} className="text-sm px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 active:bg-slate-700">✕</button>
              )}
            </div>
          </div>

          {!finished ? (
            <div className="flex-1 flex flex-col px-4 py-3 overflow-y-auto">
              {/* Two columns */}
              <div className="flex gap-2 flex-1">
                {/* Left: Japanese */}
                <div className="flex-1 space-y-2">
                  {leftItems.map(item => {
                    const isMatched = matched.has(item.id);
                    const isSelected = selectedLeft === item.id;
                    const isWrong = wrong && wrong[0] === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => { if (!isMatched) setSelectedLeft(item.id); }}
                        disabled={isMatched}
                        className={`w-full py-3 px-3 rounded-xl text-base text-center transition ${
                          isMatched ? 'bg-emerald-900/30 text-emerald-400/50 line-through' :
                          isWrong ? 'bg-red-600/40 text-red-200 ring-2 ring-red-500' :
                          isSelected ? 'bg-sakura-500/50 text-white ring-2 ring-sakura-400' :
                          'bg-slate-800 text-slate-100 active:bg-slate-700'
                        }`}
                      >
                        {item.jp}
                      </button>
                    );
                  })}
                </div>

                {/* Right: English */}
                <div className="flex-1 space-y-2">
                  {rightItems.map(item => {
                    const isMatched = matched.has(item.id);
                    const isSelected = selectedRight === item.id;
                    const isWrong = wrong && wrong[1] === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => { if (!isMatched) setSelectedRight(item.id); }}
                        disabled={isMatched}
                        className={`w-full py-3 px-3 rounded-xl text-sm text-center transition ${
                          isMatched ? 'bg-emerald-900/30 text-emerald-400/50 line-through' :
                          isWrong ? 'bg-red-600/40 text-red-200 ring-2 ring-red-500' :
                          isSelected ? 'bg-sakura-500/50 text-white ring-2 ring-sakura-400' :
                          'bg-slate-800 text-slate-100 active:bg-slate-700'
                        }`}
                      >
                        {item.en}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* End Screen */
            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
              <p className="text-5xl mb-4">⚡</p>
              <p className="text-3xl font-bold text-slate-100 mb-2">{formatTime(totalTime)}</p>
              <p className="text-lg text-slate-400 mb-1">3 rounds completed!</p>
              {panel.value && getBestTime(panel.value) && (
                <p className="text-base text-amber-400 mb-4">🏆 Best: {formatTime(getBestTime(panel.value)!)}</p>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => { setRound(1); setTotalTime(0); startRound(); }}
                  className="px-5 py-2.5 rounded-xl bg-amber-900/50 text-amber-300 active:bg-amber-800/60 text-base"
                >🔄 Play Again</button>
                <button
                  onClick={exitGame}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-400 active:bg-slate-700 text-base"
                >← Back</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
