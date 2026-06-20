import { useState, useEffect, useRef, useCallback } from 'react';
import { speak } from '../utils/tts';
import { HIRAGANA_STROKES } from '../data/hiragana-strokes';
import type { StrokeChar } from '../data/hiragana-strokes';

type Mode = 'learn' | 'trace' | 'dictation';

const CANVAS_SIZE = 280;
const SCALE = CANVAS_SIZE / 100;

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

function drawFullCharacter(ctx: CanvasRenderingContext2D, char: StrokeChar, color: string, width: number) {
  for (const stroke of char.strokes) {
    drawSmoothStroke(ctx, stroke, color, width);
  }
}

export function WritingPractice() {
  const [charIndex, setCharIndex] = useState(0);
  const [mode, setMode] = useState<Mode>('learn');
  const [showGrid, setShowGrid] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const guideCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<[number, number] | null>(null);

  const currentChar = HIRAGANA_STROKES[charIndex];
  const totalChars = HIRAGANA_STROKES.length;

  // Draw guide character (faded) on guide canvas
  const drawGuide = useCallback((char: StrokeChar, opacity: number) => {
    const canvas = guideCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Grid
    if (showGrid) {
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

    // Character strokes
    const color = `rgba(148, 163, 184, ${opacity})`;
    drawFullCharacter(ctx, char, color, 4);
  }, [showGrid]);

  // Animate stroke-by-stroke
  const animateStrokes = useCallback(() => {
    const canvas = guideCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setAnimating(true);
    const strokes = currentChar.strokes;
    let strokeIdx = 0;
    let progress = 0;
    const speed = 0.04; // progress per frame

    const draw = () => {
      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      // Grid
      if (showGrid) {
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

      // Draw completed strokes
      for (let i = 0; i < strokeIdx; i++) {
        drawSmoothStroke(ctx, strokes[i], '#e2e8f0', 4);
        // Stroke number
        const start = strokes[i][0];
        ctx.fillStyle = '#f43f5e';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText(`${i + 1}`, start[0] * SCALE - 8, start[1] * SCALE - 8);
      }

      // Draw current stroke with progress
      if (strokeIdx < strokes.length) {
        drawSmoothStroke(ctx, strokes[strokeIdx], '#f472b6', 5, progress);
        // Stroke number for current
        const start = strokes[strokeIdx][0];
        ctx.fillStyle = '#f43f5e';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText(`${strokeIdx + 1}`, start[0] * SCALE - 8, start[1] * SCALE - 8);

        progress += speed;
        if (progress >= 1) {
          strokeIdx++;
          progress = 0;
          if (strokeIdx >= strokes.length) {
            setAnimating(false);
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

  // Setup for mode changes
  useEffect(() => {
    cancelAnimationFrame(animFrameRef.current);
    setAnimating(false);
    setRevealed(false);
    clearDrawing();

    if (mode === 'learn') {
      animateStrokes();
    } else if (mode === 'trace') {
      drawGuide(currentChar, 0.3);
    } else {
      // Dictation: blank canvas, play sound
      const canvas = guideCanvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
          if (showGrid) {
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
        }
      }
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
    drawGuide(currentChar, 0.5);
  };

  const goTo = (idx: number) => {
    setCharIndex(((idx % totalChars) + totalChars) % totalChars);
  };

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
          {/* Guide layer */}
          <canvas
            ref={guideCanvasRef}
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            className="absolute inset-0"
          />
          {/* Drawing layer */}
          <canvas
            ref={drawCanvasRef}
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            className="absolute inset-0 z-10"
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
        <div className="flex items-center justify-center gap-2">
          {mode === 'learn' && (
            <button
              onClick={() => { cancelAnimationFrame(animFrameRef.current); animateStrokes(); }}
              disabled={animating}
              className="px-4 py-2 rounded-lg bg-sakura-500/80 text-white text-sm active:bg-sakura-600 transition"
            >▶ Replay</button>
          )}
          {mode === 'trace' && (
            <>
              <button onClick={clearDrawing} className="px-4 py-2 rounded-lg bg-slate-700 text-slate-300 text-sm active:bg-slate-600">Clear</button>
              <button onClick={() => speak(currentChar.char, 'ja-JP')} className="px-4 py-2 rounded-lg bg-slate-700 text-slate-300 text-sm active:bg-slate-600">🔊</button>
            </>
          )}
          {mode === 'dictation' && (
            <>
              <button onClick={() => speak(currentChar.char, 'ja-JP')} className="px-4 py-2 rounded-lg bg-indigo-500/80 text-white text-sm active:bg-indigo-600">🔊 Play Again</button>
              <button onClick={clearDrawing} className="px-4 py-2 rounded-lg bg-slate-700 text-slate-300 text-sm active:bg-slate-600">Clear</button>
              <button onClick={handleReveal} className="px-4 py-2 rounded-lg bg-amber-600/80 text-white text-sm active:bg-amber-700">{revealed ? '✓ Shown' : 'Reveal'}</button>
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
