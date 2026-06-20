import { useState, useEffect, useRef, useCallback } from 'react';
import { speak } from '../utils/tts';
import { HIRAGANA_STROKES } from '../data/hiragana-strokes';
import type { StrokeChar } from '../data/hiragana-strokes';

type Mode = 'learn' | 'trace' | 'dictation';

const CANVAS_SIZE = 280;
const SCALE = CANVAS_SIZE / 100;

function drawGrid(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = 'rgba(100, 116, 139, 0.2)';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(CANVAS_SIZE / 2, 0);
  ctx.lineTo(CANVAS_SIZE / 2, CANVAS_SIZE);
  ctx.moveTo(0, CANVAS_SIZE / 2);
  ctx.lineTo(CANVAS_SIZE, CANVAS_SIZE / 2);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawSmoothStroke(ctx: CanvasRenderingContext2D, points: number[][], color: string, width: number, progress = 1) {
  if (points.length < 2) return;
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();

  const totalPoints = points.length;
  const drawUpTo = Math.ceil(totalPoints * progress);

  ctx.moveTo(points[0][0] * SCALE, points[0][1] * SCALE);
  for (let i = 1; i < drawUpTo; i++) {
    if (i < totalPoints - 1) {
      const xc = ((points[i][0] + points[i + 1][0]) / 2) * SCALE;
      const yc = ((points[i][1] + points[i + 1][1]) / 2) * SCALE;
      ctx.quadraticCurveTo(points[i][0] * SCALE, points[i][1] * SCALE, xc, yc);
    } else {
      ctx.lineTo(points[i][0] * SCALE, points[i][1] * SCALE);
    }
  }
  ctx.stroke();
}

export function WritingPractice() {
  const [charIndex, setCharIndex] = useState(0);
  const [mode, setMode] = useState<Mode>('learn');
  const [showGrid, setShowGrid] = useState(true);
  const [animating, setAnimating] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [animStroke, setAnimStroke] = useState(-1); // which stroke is currently highlighted

  const animCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<[number, number] | null>(null);

  const currentChar = HIRAGANA_STROKES[charIndex];
  const totalChars = HIRAGANA_STROKES.length;

  // Animate stroke order overlay
  const animateStrokes = useCallback(() => {
    const canvas = animCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setAnimating(true);
    setAnimStroke(0);
    const strokes = currentChar.strokes;
    let strokeIdx = 0;
    let progress = 0;
    const speed = 0.035;

    const draw = () => {
      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      if (showGrid) drawGrid(ctx);

      // Draw completed strokes (with numbers)
      for (let i = 0; i < strokeIdx; i++) {
        drawSmoothStroke(ctx, strokes[i], 'rgba(244, 114, 182, 0.7)', 5);
        const start = strokes[i][0];
        ctx.fillStyle = '#f43f5e';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText(`${i + 1}`, start[0] * SCALE - 10, start[1] * SCALE - 10);
      }

      // Draw current stroke with progress
      if (strokeIdx < strokes.length) {
        drawSmoothStroke(ctx, strokes[strokeIdx], '#f472b6', 6, progress);
        const start = strokes[strokeIdx][0];
        ctx.fillStyle = '#f43f5e';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText(`${strokeIdx + 1}`, start[0] * SCALE - 10, start[1] * SCALE - 10);

        // Draw direction arrow at current tip
        const tipIdx = Math.min(Math.floor(progress * strokes[strokeIdx].length), strokes[strokeIdx].length - 1);
        const tip = strokes[strokeIdx][tipIdx];
        ctx.beginPath();
        ctx.arc(tip[0] * SCALE, tip[1] * SCALE, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#f43f5e';
        ctx.fill();

        progress += speed;
        if (progress >= 1) {
          strokeIdx++;
          progress = 0;
          setAnimStroke(strokeIdx);
          if (strokeIdx >= strokes.length) {
            setAnimating(false);
            // Show all stroke numbers at end
            ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
            if (showGrid) drawGrid(ctx);
            for (let i = 0; i < strokes.length; i++) {
              drawSmoothStroke(ctx, strokes[i], 'rgba(244, 114, 182, 0.5)', 4);
              const s = strokes[i][0];
              ctx.fillStyle = '#f43f5e';
              ctx.font = 'bold 16px sans-serif';
              ctx.fillText(`${i + 1}`, s[0] * SCALE - 10, s[1] * SCALE - 10);
            }
            return;
          }
        }
        animFrameRef.current = requestAnimationFrame(draw);
      }
    };
    animFrameRef.current = requestAnimationFrame(draw);
  }, [currentChar, showGrid]);

  // Clear drawing canvas
  const clearDrawing = useCallback(() => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  }, []);

  // Clear animation canvas
  const clearAnim = useCallback(() => {
    const canvas = animCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    if (showGrid) drawGrid(ctx);
  }, [showGrid]);

  // Setup for mode/character changes
  useEffect(() => {
    cancelAnimationFrame(animFrameRef.current);
    setAnimating(false);
    setRevealed(false);
    setAnimStroke(-1);
    clearDrawing();

    if (mode === 'learn') {
      setTimeout(() => animateStrokes(), 100);
    } else if (mode === 'trace') {
      clearAnim();
    } else {
      // Dictation: play sound
      clearAnim();
      setTimeout(() => speak(currentChar.char, 'ja-JP'), 300);
    }
  }, [mode, charIndex]);

  // Touch drawing handlers
  const getCanvasPoint = (e: React.TouchEvent | React.MouseEvent): [number, number] | null => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const touch = 'touches' in e ? e.touches[0] || e.changedTouches[0] : e;
    return [touch.clientX - rect.left, touch.clientY - rect.top];
  };

  const startDraw = (e: React.TouchEvent | React.MouseEvent) => {
    if (mode === 'learn') return;
    e.preventDefault();
    isDrawingRef.current = true;
    const pt = getCanvasPoint(e);
    if (pt) lastPointRef.current = pt;
  };

  const moveDraw = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawingRef.current || mode === 'learn') return;
    e.preventDefault();
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const pt = getCanvasPoint(e);
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

  const endDraw = () => {
    isDrawingRef.current = false;
    lastPointRef.current = null;
  };

  const handleReveal = () => {
    setRevealed(true);
  };

  const goTo = (idx: number) => {
    setCharIndex(((idx % totalChars) + totalChars) % totalChars);
  };

  // Should we show the large text character as guide?
  const showCharGuide = mode === 'trace' || (mode === 'learn') || (mode === 'dictation' && revealed);

  return (
    <div className="h-full scroll-area">
      <div className="px-4 py-3 border-b border-slate-800">
        <h2 className="text-lg font-bold">✍️ Writing Practice</h2>
        <p className="text-base text-slate-400">Learn stroke order, trace, and draw from memory</p>
      </div>

      <div className="p-4 space-y-3">
        {/* Mode tabs */}
        <div className="flex gap-1 bg-slate-800/50 rounded-xl p-1">
          {([['learn', '📺 Learn'], ['trace', '✏️ Trace'], ['dictation', '👂 Dictation']] as [Mode, string][]).map(([m, label]) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2 rounded-lg text-sm transition ${mode === m ? 'bg-sakura-500/60 text-white' : 'text-slate-400'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Character info */}
        <div className="flex items-center justify-between">
          <button onClick={() => goTo(charIndex - 1)} className="px-3 py-2 rounded-lg bg-slate-800 text-slate-400 active:bg-slate-700 text-base">←</button>
          <div className="text-center">
            <p className="text-3xl font-bold text-slate-100">{mode === 'dictation' && !revealed ? '?' : currentChar.char}</p>
            <p className="text-base text-sakura-300">{mode === 'dictation' && !revealed ? '???' : currentChar.rom}</p>
            <p className="text-xs text-slate-500">{charIndex + 1} / {totalChars} · {currentChar.strokes.length} strokes</p>
          </div>
          <button onClick={() => goTo(charIndex + 1)} className="px-3 py-2 rounded-lg bg-slate-800 text-slate-400 active:bg-slate-700 text-base">→</button>
        </div>

        {/* Canvas area */}
        <div className="relative mx-auto rounded-2xl bg-slate-800/60 border border-slate-700/50 overflow-hidden" style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}>
          {/* Text character as guide (system font = perfect shape) */}
          {showCharGuide && (
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
              style={{ opacity: mode === 'learn' ? 0.15 : 0.2 }}
            >
              <span style={{ fontSize: `${CANVAS_SIZE * 0.75}px`, lineHeight: 1, color: '#94a3b8' }}>
                {currentChar.char}
              </span>
            </div>
          )}
          {/* Animation/guide overlay canvas */}
          <canvas
            ref={animCanvasRef}
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            className="absolute inset-0 z-[1]"
          />
          {/* Drawing canvas (user input) */}
          <canvas
            ref={drawCanvasRef}
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            className="absolute inset-0 z-[2]"
            onTouchStart={startDraw}
            onTouchMove={moveDraw}
            onTouchEnd={endDraw}
            onMouseDown={startDraw}
            onMouseMove={moveDraw}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
            style={{ touchAction: 'none' }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {mode === 'learn' && (
            <>
              <button
                onClick={() => { cancelAnimationFrame(animFrameRef.current); animateStrokes(); }}
                disabled={animating}
                className="px-4 py-2 rounded-lg bg-sakura-500/80 text-white text-sm active:bg-sakura-600 transition"
              >▶ Replay</button>
              <button onClick={() => speak(currentChar.char, 'ja-JP')} className="px-4 py-2 rounded-lg bg-slate-700 text-slate-300 text-sm active:bg-slate-600">🔊</button>
            </>
          )}
          {mode === 'trace' && (
            <>
              <button onClick={clearDrawing} className="px-4 py-2 rounded-lg bg-slate-700 text-slate-300 text-sm active:bg-slate-600">Clear</button>
              <button onClick={() => speak(currentChar.char, 'ja-JP')} className="px-4 py-2 rounded-lg bg-slate-700 text-slate-300 text-sm active:bg-slate-600">🔊</button>
            </>
          )}
          {mode === 'dictation' && (
            <>
              <button onClick={() => speak(currentChar.char, 'ja-JP')} className="px-4 py-2 rounded-lg bg-indigo-500/80 text-white text-sm active:bg-indigo-600">🔊 Play</button>
              <button onClick={clearDrawing} className="px-4 py-2 rounded-lg bg-slate-700 text-slate-300 text-sm active:bg-slate-600">Clear</button>
              <button onClick={handleReveal} className={`px-4 py-2 rounded-lg text-sm ${revealed ? 'bg-emerald-600/80 text-white' : 'bg-amber-600/80 text-white active:bg-amber-700'}`}>{revealed ? '✓ Shown' : 'Reveal'}</button>
            </>
          )}
          <button
            onClick={() => setShowGrid(g => !g)}
            className={`px-3 py-2 rounded-lg text-sm ${showGrid ? 'bg-slate-600 text-slate-200' : 'bg-slate-800 text-slate-500'}`}
          >⊞</button>
        </div>

        {/* Character grid picker */}
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
