import { useState, useEffect, useRef, useCallback } from 'react';
import { speak } from '../utils/tts';
import { HIRAGANA_STROKES } from '../data/hiragana-strokes';

type Page = 'menu' | 'learn' | 'dictation' | 'sprint';

const CANVAS_SIZE = 260;
const DICTATION_TIME = 10; // seconds per word
const DICTATION_ROUNDS = 10;
const SPRINT_TIME = 60; // total seconds for sprint

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function DrawCanvas({ size, onClear }: { size: number; onClear?: (clearFn: () => void) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<[number, number] | null>(null);

  const clear = useCallback(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, size, size);
  }, [size]);

  useEffect(() => { onClear?.(clear); }, [clear, onClear]);

  const getPoint = (e: React.TouchEvent | React.MouseEvent): [number, number] | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const touch = 'touches' in e ? e.touches[0] || e.changedTouches[0] : e;
    return [touch.clientX - rect.left, touch.clientY - rect.top];
  };

  const start = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    isDrawingRef.current = true;
    lastPointRef.current = getPoint(e);
  };

  const move = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const pt = getPoint(e);
    if (!pt || !lastPointRef.current) return;
    ctx.strokeStyle = '#f472b6';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(lastPointRef.current[0], lastPointRef.current[1]);
    ctx.lineTo(pt[0], pt[1]);
    ctx.stroke();
    lastPointRef.current = pt;
  };

  const end = () => { isDrawingRef.current = false; lastPointRef.current = null; };

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="absolute inset-0 z-[2]"
      onTouchStart={start}
      onTouchMove={move}
      onTouchEnd={end}
      onMouseDown={start}
      onMouseMove={move}
      onMouseUp={end}
      onMouseLeave={end}
      style={{ touchAction: 'none' }}
    />
  );
}

// ========================
// Learning Page
// ========================
function LearningPage({ onBack }: { onBack: () => void }) {
  const [charIndex, setCharIndex] = useState(0);
  const [showGuide, setShowGuide] = useState(true);
  const clearRef = useRef<(() => void) | null>(null);

  const currentChar = HIRAGANA_STROKES[charIndex];
  const totalChars = HIRAGANA_STROKES.length;

  const goTo = (idx: number) => {
    setCharIndex(((idx % totalChars) + totalChars) % totalChars);
    clearRef.current?.();
  };

  return (
    <div className="h-full scroll-area">
      <div className="px-4 py-3 border-b border-slate-800 flex items-center gap-2">
        <button onClick={onBack} className="text-base text-slate-400 p-1">←</button>
        <div>
          <h2 className="text-lg font-bold">📖 Learning</h2>
          <p className="text-sm text-slate-400">Study stroke order & practice tracing</p>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Character info + navigation */}
        <div className="flex items-center justify-between">
          <button onClick={() => goTo(charIndex - 1)} className="px-3 py-2 rounded-lg bg-slate-800 text-slate-400 active:bg-slate-700">←</button>
          <div className="text-center">
            <p className="text-4xl font-bold text-slate-100">{currentChar.char}</p>
            <p className="text-lg text-sakura-300">{currentChar.rom}</p>
            <p className="text-xs text-slate-500">{charIndex + 1}/{totalChars} · {currentChar.strokes.length} strokes</p>
          </div>
          <button onClick={() => goTo(charIndex + 1)} className="px-3 py-2 rounded-lg bg-slate-800 text-slate-400 active:bg-slate-700">→</button>
        </div>

        {/* Canvas with guide */}
        <div className="relative mx-auto rounded-2xl bg-slate-800/60 border border-slate-700/50 overflow-hidden" style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}>
          {/* Grid lines */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-1/2 top-0 bottom-0 w-px border-l border-dashed border-slate-700/40" />
            <div className="absolute top-1/2 left-0 right-0 h-px border-t border-dashed border-slate-700/40" />
          </div>
          {/* Character guide */}
          {showGuide && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" style={{ opacity: 0.2 }}>
              <span style={{ fontSize: `${CANVAS_SIZE * 0.78}px`, lineHeight: 1, color: '#94a3b8', fontFamily: '"Zen Kurenaido", serif' }}>
                {currentChar.char}
              </span>
            </div>
          )}
          {/* Drawing canvas */}
          <DrawCanvas size={CANVAS_SIZE} onClear={(fn) => { clearRef.current = fn; }} />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => clearRef.current?.()} className="px-4 py-2 rounded-lg bg-slate-700 text-slate-300 text-sm active:bg-slate-600">Clear</button>
          <button onClick={() => speak(currentChar.char, 'ja-JP')} className="px-4 py-2 rounded-lg bg-slate-700 text-slate-300 text-sm active:bg-slate-600">🔊</button>
          <button
            onClick={() => setShowGuide(g => !g)}
            className={`px-4 py-2 rounded-lg text-sm ${showGuide ? 'bg-indigo-500/60 text-white' : 'bg-slate-800 text-slate-500'}`}
          >{showGuide ? 'Guide On' : 'Guide Off'}</button>
        </div>

        {/* Character grid */}
        <details className="bg-slate-800/40 rounded-xl">
          <summary className="px-4 py-2 text-sm text-slate-400 cursor-pointer">All Characters</summary>
          <div className="grid grid-cols-10 gap-1 p-3">
            {HIRAGANA_STROKES.map((c, i) => (
              <button
                key={c.char}
                onClick={() => goTo(i)}
                className={`aspect-square rounded-lg text-base flex items-center justify-center transition ${i === charIndex ? 'bg-sakura-500/60 text-white' : 'bg-slate-700/40 text-slate-300 active:bg-slate-600'}`}
              >
                {c.char}
              </button>
            ))}
          </div>
        </details>
      </div>
    </div>
  );
}

// ========================
// Dictation Game Page
// ========================
function DictationPage({ onBack }: { onBack: () => void }) {
  const [queue, setQueue] = useState(() => shuffle(HIRAGANA_STROKES).slice(0, DICTATION_ROUNDS));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DICTATION_TIME);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [started, setStarted] = useState(false);
  const [results, setResults] = useState<{ char: string; rom: string; correct: boolean }[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const clearRef = useRef<(() => void) | null>(null);

  const currentChar = queue[currentIdx];

  // Start timer
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(DICTATION_TIME);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setRevealed(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // Play sound for current character (only after started, skip first since handleStart already plays)
  const hasPlayedFirstRef = useRef(false);
  useEffect(() => {
    if (!started || finished || !currentChar) return;
    setRevealed(false);
    clearRef.current?.();
    startTimer();
    if (hasPlayedFirstRef.current) {
      setTimeout(() => speak(currentChar.char, 'ja-JP'), 300);
    } else {
      hasPlayedFirstRef.current = true;
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [currentIdx, started, finished]);

  const handleStart = () => {
    // User tap unlocks TTS on iOS
    speak(currentChar.char, 'ja-JP');
    setStarted(true);
  };

  const handleGrade = (correct: boolean) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setResults(prev => [...prev, { char: currentChar.char, rom: currentChar.rom, correct }]);
    if (correct) setScore(s => s + 1);

    if (currentIdx + 1 >= DICTATION_ROUNDS) {
      setFinished(true);
    } else {
      setCurrentIdx(prev => prev + 1);
    }
  };

  const restart = () => {
    setQueue(shuffle(HIRAGANA_STROKES).slice(0, DICTATION_ROUNDS));
    setCurrentIdx(0);
    setScore(0);
    setFinished(false);
    setResults([]);
    setRevealed(false);
  };

  if (finished) {
    return (
      <div className="h-full scroll-area">
        <div className="px-4 py-3 border-b border-slate-800 flex items-center gap-2">
          <button onClick={onBack} className="text-base text-slate-400 p-1">←</button>
          <h2 className="text-lg font-bold">👂 Results</h2>
        </div>
        <div className="p-4 flex flex-col items-center text-center">
          <p className="text-5xl mb-3">{score >= 8 ? '🎉' : score >= 5 ? '👍' : '💪'}</p>
          <p className="text-3xl font-bold text-slate-100">{score} / {DICTATION_ROUNDS}</p>
          <p className="text-base text-slate-400 mb-4">{score >= 8 ? 'Excellent!' : score >= 5 ? 'Good effort!' : 'Keep practicing!'}</p>

          {/* Results grid */}
          <div className="grid grid-cols-5 gap-2 w-full max-w-sm mb-4">
            {results.map((r, i) => (
              <div key={i} className={`rounded-lg p-2 text-center ${r.correct ? 'bg-emerald-900/30' : 'bg-red-900/30'}`}>
                <p className="text-xl">{r.char}</p>
                <p className="text-xs text-slate-400">{r.rom}</p>
                <p className="text-xs">{r.correct ? '✓' : '✗'}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={restart} className="px-5 py-2.5 rounded-xl bg-amber-900/50 text-amber-300 active:bg-amber-800/60 text-base">🔄 Again</button>
            <button onClick={onBack} className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-400 active:bg-slate-700 text-base">← Back</button>
          </div>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="h-full scroll-area">
        <div className="px-4 py-3 border-b border-slate-800 flex items-center gap-2">
          <button onClick={onBack} className="text-base text-slate-400 p-1">←</button>
          <h2 className="text-lg font-bold">👂 Dictation</h2>
        </div>
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <p className="text-5xl mb-4">👂</p>
          <p className="text-lg text-slate-200 mb-2">Ready?</p>
          <p className="text-base text-slate-400 mb-6">Listen to each sound and draw the character.<br/>{DICTATION_TIME}s per character × {DICTATION_ROUNDS} rounds.</p>
          <button
            onClick={handleStart}
            className="px-8 py-3 rounded-xl bg-indigo-500/80 text-white text-lg active:bg-indigo-600 transition"
          >🔊 Start</button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full scroll-area">
      <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="text-base text-slate-400 p-1">←</button>
          <p className="text-base text-slate-400">Q{currentIdx + 1}/{DICTATION_ROUNDS}</p>
        </div>
        <p className="text-base text-emerald-400">✓ {score}</p>
      </div>

      <div className="p-4 space-y-3">
        {/* Timer bar */}
        <div className="w-full">
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${timeLeft <= 3 ? 'bg-red-500' : 'bg-emerald-500'}`}
              style={{ width: `${(timeLeft / DICTATION_TIME) * 100}%` }}
            />
          </div>
          <p className="text-sm text-slate-500 text-right mt-1">{timeLeft}s</p>
        </div>

        {/* Prompt */}
        <div className="text-center">
          <p className="text-base text-slate-400 mb-1">Listen and draw:</p>
          <button onClick={() => speak(currentChar.char, 'ja-JP')} className="text-3xl active:scale-110 transition-transform">🔊</button>
        </div>

        {/* Canvas */}
        <div className="relative mx-auto rounded-2xl bg-slate-800/60 border border-slate-700/50 overflow-hidden" style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}>
          {/* Grid */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-1/2 top-0 bottom-0 w-px border-l border-dashed border-slate-700/40" />
            <div className="absolute top-1/2 left-0 right-0 h-px border-t border-dashed border-slate-700/40" />
          </div>
          {/* Reveal answer overlay */}
          {revealed && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" style={{ opacity: 0.35 }}>
              <span style={{ fontSize: `${CANVAS_SIZE * 0.78}px`, lineHeight: 1, color: '#34d399', fontFamily: '"Zen Kurenaido", serif' }}>
                {currentChar.char}
              </span>
            </div>
          )}
          {/* Drawing canvas */}
          <DrawCanvas size={CANVAS_SIZE} onClear={(fn) => { clearRef.current = fn; }} />
        </div>

        {/* Controls */}
        {!revealed ? (
          <div className="flex items-center justify-center gap-2">
            <button onClick={() => clearRef.current?.()} className="px-4 py-2 rounded-lg bg-slate-700 text-slate-300 text-sm">Clear</button>
            <button onClick={() => speak(currentChar.char, 'ja-JP')} className="px-4 py-2 rounded-lg bg-indigo-500/80 text-white text-sm">🔊 Again</button>
            <button onClick={() => { if (timerRef.current) clearInterval(timerRef.current); setRevealed(true); }} className="px-4 py-2 rounded-lg bg-amber-600/80 text-white text-sm">Check</button>
          </div>
        ) : (
          <div className="text-center space-y-2">
            <p className="text-2xl font-bold text-slate-100">{currentChar.char} <span className="text-lg text-sakura-300">({currentChar.rom})</span></p>
            <p className="text-base text-slate-400">Did you get it right?</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => handleGrade(true)} className="px-6 py-2.5 rounded-xl bg-emerald-600/80 text-white text-base active:bg-emerald-700">✓ Got it</button>
              <button onClick={() => handleGrade(false)} className="px-6 py-2.5 rounded-xl bg-red-600/60 text-red-100 text-base active:bg-red-700">✗ Missed</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ========================
// Sprint Game Page (60s, as many as possible)
// ========================
function SprintPage({ onBack }: { onBack: () => void }) {
  const [queue, setQueue] = useState(() => shuffle(HIRAGANA_STROKES));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(SPRINT_TIME);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [finished, setFinished] = useState(false);
  const [started, setStarted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const clearRef = useRef<(() => void) | null>(null);

  const currentChar = queue[currentIdx % queue.length];

  const beginSprint = () => {
    speak(currentChar.char, 'ja-JP');
    setStarted(true);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Play sound on new character (after started, skip first since beginSprint already plays)
  const hasPlayedFirstSprintRef = useRef(false);
  useEffect(() => {
    if (!started || finished) return;
    setRevealed(false);
    clearRef.current?.();
    if (hasPlayedFirstSprintRef.current) {
      setTimeout(() => speak(currentChar.char, 'ja-JP'), 200);
    } else {
      hasPlayedFirstSprintRef.current = true;
    }
  }, [currentIdx, started, finished]);

  // Cleanup
  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const handleGrade = (correct: boolean) => {
    if (correct) setScore(s => s + 1);
    setTotal(t => t + 1);
    setCurrentIdx(prev => prev + 1);
  };

  const handleCheck = () => setRevealed(true);

  const restart = () => {
    setQueue(shuffle(HIRAGANA_STROKES));
    setCurrentIdx(0);
    setScore(0);
    setTotal(0);
    setFinished(false);
    setTimeLeft(SPRINT_TIME);
    setRevealed(false);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  if (finished) {
    return (
      <div className="h-full scroll-area">
        <div className="px-4 py-3 border-b border-slate-800 flex items-center gap-2">
          <button onClick={onBack} className="text-base text-slate-400 p-1">←</button>
          <h2 className="text-lg font-bold">⚡ Sprint Results</h2>
        </div>
        <div className="p-4 flex flex-col items-center text-center">
          <p className="text-5xl mb-3">⚡</p>
          <p className="text-3xl font-bold text-slate-100">{score} / {total}</p>
          <p className="text-lg text-slate-400 mb-1">{total} characters attempted in {SPRINT_TIME}s</p>
          <p className="text-base text-slate-500 mb-4">{score >= total * 0.8 ? 'Excellent speed!' : score >= total * 0.5 ? 'Good pace!' : 'Keep practicing!'}</p>
          <div className="flex gap-3">
            <button onClick={restart} className="px-5 py-2.5 rounded-xl bg-amber-900/50 text-amber-300 active:bg-amber-800/60 text-base">🔄 Again</button>
            <button onClick={onBack} className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-400 active:bg-slate-700 text-base">← Back</button>
          </div>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="h-full scroll-area">
        <div className="px-4 py-3 border-b border-slate-800 flex items-center gap-2">
          <button onClick={onBack} className="text-base text-slate-400 p-1">←</button>
          <h2 className="text-lg font-bold">⚡ Sprint</h2>
        </div>
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <p className="text-5xl mb-4">⚡</p>
          <p className="text-lg text-slate-200 mb-2">Ready?</p>
          <p className="text-base text-slate-400 mb-6">{SPRINT_TIME} seconds — draw as many characters as you can!</p>
          <button
            onClick={beginSprint}
            className="px-8 py-3 rounded-xl bg-amber-500/80 text-white text-lg active:bg-amber-600 transition"
          >🔊 Go!</button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full scroll-area">
      <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="text-base text-slate-400 p-1">←</button>
          <p className="text-base text-slate-400">#{total + 1}</p>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-base text-emerald-400">✓ {score}</p>
          <p className={`text-base font-mono ${timeLeft <= 10 ? 'text-red-400' : 'text-slate-400'}`}>{timeLeft}s</p>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Timer bar */}
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${timeLeft <= 10 ? 'bg-red-500' : 'bg-amber-500'}`}
            style={{ width: `${(timeLeft / SPRINT_TIME) * 100}%` }}
          />
        </div>

        {/* Prompt */}
        <div className="text-center">
          <button onClick={() => speak(currentChar.char, 'ja-JP')} className="text-3xl active:scale-110 transition-transform">🔊</button>
        </div>

        {/* Canvas */}
        <div className="relative mx-auto rounded-2xl bg-slate-800/60 border border-slate-700/50 overflow-hidden" style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-1/2 top-0 bottom-0 w-px border-l border-dashed border-slate-700/40" />
            <div className="absolute top-1/2 left-0 right-0 h-px border-t border-dashed border-slate-700/40" />
          </div>
          {revealed && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" style={{ opacity: 0.35 }}>
              <span style={{ fontSize: `${CANVAS_SIZE * 0.78}px`, lineHeight: 1, color: '#34d399', fontFamily: '"Zen Kurenaido", serif' }}>
                {currentChar.char}
              </span>
            </div>
          )}
          <DrawCanvas size={CANVAS_SIZE} onClear={(fn) => { clearRef.current = fn; }} />
        </div>

        {/* Controls */}
        {!revealed ? (
          <div className="flex items-center justify-center gap-2">
            <button onClick={() => clearRef.current?.()} className="px-4 py-2 rounded-lg bg-slate-700 text-slate-300 text-sm">Clear</button>
            <button onClick={() => speak(currentChar.char, 'ja-JP')} className="px-4 py-2 rounded-lg bg-indigo-500/80 text-white text-sm">🔊</button>
            <button onClick={handleCheck} className="px-4 py-2 rounded-lg bg-amber-600/80 text-white text-sm">Check</button>
          </div>
        ) : (
          <div className="text-center space-y-2">
            <p className="text-2xl font-bold text-slate-100">{currentChar.char} <span className="text-lg text-sakura-300">({currentChar.rom})</span></p>
            <div className="flex justify-center gap-3">
              <button onClick={() => handleGrade(true)} className="px-6 py-2.5 rounded-xl bg-emerald-600/80 text-white text-base active:bg-emerald-700">✓</button>
              <button onClick={() => handleGrade(false)} className="px-6 py-2.5 rounded-xl bg-red-600/60 text-red-100 text-base active:bg-red-700">✗</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ========================
// Main Component (Menu)
// ========================
export function WritingPractice() {
  const [page, setPage] = useState<Page>('menu');

  if (page === 'learn') return <LearningPage onBack={() => setPage('menu')} />;
  if (page === 'dictation') return <DictationPage onBack={() => setPage('menu')} />;
  if (page === 'sprint') return <SprintPage onBack={() => setPage('menu')} />;

  return (
    <div className="h-full scroll-area">
      <div className="px-4 py-3 border-b border-slate-800">
        <h2 className="text-lg font-bold">✍️ Writing Practice</h2>
        <p className="text-base text-slate-400">Learn to write hiragana by hand</p>
      </div>

      <div className="p-4 space-y-3">
        <button
          onClick={() => setPage('learn')}
          className="w-full bg-indigo-900/30 border border-indigo-700/30 rounded-xl p-5 text-left active:bg-indigo-800/40 transition"
        >
          <p className="text-2xl mb-1">📖</p>
          <p className="text-lg font-semibold text-slate-100">Learning</p>
          <p className="text-sm text-slate-400">Study each character with guide overlay. Trace to build muscle memory.</p>
        </button>

        <button
          onClick={() => setPage('dictation')}
          className="w-full bg-purple-900/30 border border-purple-700/30 rounded-xl p-5 text-left active:bg-purple-800/40 transition"
        >
          <p className="text-2xl mb-1">👂</p>
          <p className="text-lg font-semibold text-slate-100">Dictation</p>
          <p className="text-sm text-slate-400">Hear the sound, draw from memory. 10 seconds × 10 random characters.</p>
        </button>

        <button
          onClick={() => setPage('sprint')}
          className="w-full bg-amber-900/30 border border-amber-700/30 rounded-xl p-5 text-left active:bg-amber-800/40 transition"
        >
          <p className="text-2xl mb-1">⚡</p>
          <p className="text-lg font-semibold text-slate-100">Sprint</p>
          <p className="text-sm text-slate-400">60 seconds — draw as many characters as you can! No time limit per word.</p>
        </button>
      </div>
    </div>
  );
}
