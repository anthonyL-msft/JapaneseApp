import { useState, useEffect, useCallback, useRef } from 'react';
import { speak } from '../utils/tts';
import { useSlidePanel } from '../utils/useSlidePanel';
import { HIRAGANA_CARDS, KATAKANA_CARDS, HIRAGANA_VOCAB_CARDS, KATAKANA_VOCAB_CARDS } from '../data/kana-data';
import type { KanaCard, KanaVocabCard } from '../data/kana-data';

type QuizCategory = 'hiragana' | 'katakana' | 'vocab-h' | 'vocab-k';

const GAME_TIME = 10;
const GAME_ROUNDS = 20;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getHighScore(cat: QuizCategory): number {
  try {
    return parseInt(localStorage.getItem(`quiz_high_${cat}`) || '0', 10);
  } catch { return 0; }
}

function setHighScore(cat: QuizCategory, score: number) {
  const prev = getHighScore(cat);
  if (score > prev) localStorage.setItem(`quiz_high_${cat}`, String(score));
}

export function Quiz() {
  const panel = useSlidePanel<QuizCategory>();

  // Game state
  const [kanaCards, setKanaCards] = useState<KanaCard[]>([]);
  const [vocabCards, setVocabCards] = useState<KanaVocabCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameScore, setGameScore] = useState({ correct: 0, total: 0 });
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [choices, setChoices] = useState<string[]>([]);
  const [answered, setAnswered] = useState<string | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [gameFinished, setGameFinished] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isKana = panel.value === 'hiragana' || panel.value === 'katakana';
  const isVocab = panel.value === 'vocab-h' || panel.value === 'vocab-k';

  const currentKana = isKana && kanaCards.length > 0 ? kanaCards[currentIndex % kanaCards.length] : null;
  const currentVocab = isVocab && vocabCards.length > 0 ? vocabCards[currentIndex % vocabCards.length] : null;

  // Generate 4 choices
  const generateChoices = useCallback((idx: number, kCards: KanaCard[], vCards: KanaVocabCard[], isKanaMode: boolean) => {
    if (isKanaMode && kCards.length > 0) {
      const card = kCards[idx % kCards.length];
      const correct = card.rom;
      const pool = kCards.map(c => c.rom).filter(r => r !== correct);
      const wrong = shuffle(pool).slice(0, 3);
      setCorrectAnswer(correct);
      setChoices(shuffle([correct, ...wrong]));
    } else if (!isKanaMode && vCards.length > 0) {
      const card = vCards[idx % vCards.length];
      const correct = card.en;
      const pool = vCards.map(c => c.en).filter(e => e !== correct);
      const wrong = shuffle(pool).slice(0, 3);
      setCorrectAnswer(correct);
      setChoices(shuffle([correct, ...wrong]));
    }
  }, []);

  // Timer
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(GAME_TIME);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setAnswered('__timeout__');
          setGameScore(s => ({ correct: s.correct, total: s.total + 1 }));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // Handle answer
  const handleAnswer = useCallback((choice: string) => {
    if (answered) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setAnswered(choice);
    const isCorrect = choice === correctAnswer;
    setGameScore(s => ({ correct: s.correct + (isCorrect ? 1 : 0), total: s.total + 1 }));
  }, [answered, correctAnswer]);

  // Auto-advance after answer
  useEffect(() => {
    if (!answered) return;
    const speakTimeout = setTimeout(() => {
      if (isKana && currentKana) speak(currentKana.char, 'ja-JP');
      else if (isVocab && currentVocab) speak(currentVocab.jp, 'ja-JP');
    }, 300);
    const advanceTimeout = setTimeout(() => {
      if (gameScore.total >= GAME_ROUNDS) {
        setGameFinished(true);
        if (panel.value) setHighScore(panel.value, gameScore.correct + (answered === correctAnswer ? 1 : 0));
      } else {
        const nextIdx = currentIndex + 1;
        setCurrentIndex(nextIdx);
        setAnswered(null);
        generateChoices(nextIdx, kanaCards, vocabCards, isKana);
        startTimer();
      }
    }, 1500);
    return () => { clearTimeout(speakTimeout); clearTimeout(advanceTimeout); };
  }, [answered]);

  // Cleanup
  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const startGame = (cat: QuizCategory) => {
    let kCards: KanaCard[] = [];
    let vCards: KanaVocabCard[] = [];
    const isKanaMode = cat === 'hiragana' || cat === 'katakana';

    if (isKanaMode) {
      kCards = shuffle(cat === 'hiragana' ? HIRAGANA_CARDS : KATAKANA_CARDS);
      setKanaCards(kCards);
    } else {
      vCards = shuffle(cat === 'vocab-h' ? HIRAGANA_VOCAB_CARDS : KATAKANA_VOCAB_CARDS);
      setVocabCards(vCards);
    }

    setCurrentIndex(0);
    setGameScore({ correct: 0, total: 0 });
    setGameFinished(false);
    setAnswered(null);
    panel.open(cat);

    setTimeout(() => {
      generateChoices(0, kCards, vCards, isKanaMode);
      startTimer();
    }, 50);
  };

  const restartGame = () => {
    if (panel.value) startGame(panel.value);
  };

  const exitGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    panel.close();
  };

  return (
    <div className="h-full relative">
      {/* Landing: Category Picker */}
      <div className="scroll-area h-full">
        <div className="px-4 py-3 border-b border-slate-800">
          <h2 className="text-lg font-bold">🎮 Quiz</h2>
          <p className="text-base text-slate-400">Timed multiple choice — test your speed!</p>
        </div>

        <div className="p-4 space-y-4">
          {/* Info */}
          <div className="bg-slate-800/40 rounded-xl p-3">
            <p className="text-sm text-slate-400">⏱️ {GAME_TIME}s per question · {GAME_ROUNDS} questions per round</p>
            <p className="text-sm text-slate-500 mt-1">Pick the correct answer from 4 choices before time runs out!</p>
          </div>

          {/* Kana Characters */}
          <div>
            <p className="text-sm text-slate-500 mb-2">Kana Characters</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => startGame('hiragana')}
                className="bg-indigo-900/30 border border-indigo-700/30 rounded-xl p-4 text-left active:bg-indigo-800/40 transition flex flex-col gap-1"
              >
                <span className="text-3xl">あ</span>
                <span className="text-base font-semibold text-slate-100">Hiragana</span>
                <span className="text-sm text-slate-500">{HIRAGANA_CARDS.length} characters</span>
                {getHighScore('hiragana') > 0 && (
                  <span className="text-xs text-amber-400 mt-1">🏆 Best: {getHighScore('hiragana')}/{GAME_ROUNDS}</span>
                )}
              </button>
              <button
                onClick={() => startGame('katakana')}
                className="bg-indigo-900/30 border border-indigo-700/30 rounded-xl p-4 text-left active:bg-indigo-800/40 transition flex flex-col gap-1"
              >
                <span className="text-3xl">ア</span>
                <span className="text-base font-semibold text-slate-100">Katakana</span>
                <span className="text-sm text-slate-500">{KATAKANA_CARDS.length} characters</span>
                {getHighScore('katakana') > 0 && (
                  <span className="text-xs text-amber-400 mt-1">🏆 Best: {getHighScore('katakana')}/{GAME_ROUNDS}</span>
                )}
              </button>
            </div>
          </div>

          {/* Kana Vocab */}
          <div>
            <p className="text-sm text-slate-500 mb-2">Kana Vocab</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => startGame('vocab-h')}
                className="bg-purple-900/30 border border-purple-700/30 rounded-xl p-4 text-left active:bg-purple-800/40 transition flex flex-col gap-1"
              >
                <span className="text-3xl">🏷️</span>
                <span className="text-base font-semibold text-slate-100">Vocab ひらがな</span>
                <span className="text-sm text-slate-500">{HIRAGANA_VOCAB_CARDS.length} words</span>
                {getHighScore('vocab-h') > 0 && (
                  <span className="text-xs text-amber-400 mt-1">🏆 Best: {getHighScore('vocab-h')}/{GAME_ROUNDS}</span>
                )}
              </button>
              <button
                onClick={() => startGame('vocab-k')}
                className="bg-purple-900/30 border border-purple-700/30 rounded-xl p-4 text-left active:bg-purple-800/40 transition flex flex-col gap-1"
              >
                <span className="text-3xl">🏷️</span>
                <span className="text-base font-semibold text-slate-100">Vocab カタカナ</span>
                <span className="text-sm text-slate-500">{KATAKANA_VOCAB_CARDS.length} words</span>
                {getHighScore('vocab-k') > 0 && (
                  <span className="text-xs text-amber-400 mt-1">🏆 Best: {getHighScore('vocab-k')}/{GAME_ROUNDS}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Game Panel (slide-in) */}
      {panel.visible && (
        <div className={`absolute inset-0 bg-slate-950 ${panel.animClass} flex flex-col z-40`}>
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div>
              <button onClick={exitGame} className="text-base text-slate-400 active:text-slate-200 p-1">←</button>
              {!gameFinished && (
                <p className="text-base text-slate-400">
                  {panel.value === 'hiragana' ? 'ひらがな' : panel.value === 'katakana' ? 'カタカナ' : panel.value === 'vocab-h' ? 'Vocab ひらがな' : 'Vocab カタカナ'} · Q{gameScore.total + 1}/{GAME_ROUNDS}
                </p>
              )}
            </div>
            {!gameFinished && (
              <button onClick={exitGame} className="text-sm px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 active:bg-slate-700">✕ Quit</button>
            )}
          </div>

          {/* Game Playing */}
          {!gameFinished ? (
            <div className="flex-1 flex flex-col items-center justify-center px-6">
              {/* Timer bar */}
              <div className="w-full max-w-sm mb-4">
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${timeLeft <= 3 ? 'bg-red-500' : 'bg-emerald-500'}`}
                    style={{ width: `${(timeLeft / GAME_TIME) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-slate-500 text-right mt-1">{timeLeft}s</p>
              </div>

              {/* Score */}
              <p className="text-base text-slate-400 mb-3">✓ {gameScore.correct} / {gameScore.total}</p>

              {/* Question */}
              <div className="w-full max-w-sm bg-slate-800/80 rounded-2xl p-6 text-center mb-4 min-h-[120px] flex flex-col items-center justify-center">
                {isKana && currentKana && (
                  <>
                    <p className="text-6xl font-bold text-slate-50 mb-2">{currentKana.char}</p>
                    <p className="text-base text-slate-500">What sound is this?</p>
                  </>
                )}
                {isVocab && currentVocab && (
                  <>
                    <p className="text-3xl font-bold text-slate-50 mb-1">{currentVocab.jp}</p>
                    <p className="text-base text-sakura-300">{currentVocab.hep}</p>
                    <p className="text-base text-slate-500 mt-1">What does this mean?</p>
                  </>
                )}
              </div>

              {/* 4 Choices */}
              <div className="w-full max-w-sm grid grid-cols-1 gap-2">
                {choices.map((choice, i) => {
                  let btnClass = 'bg-slate-800 text-slate-200 active:bg-slate-700';
                  if (answered) {
                    if (choice === correctAnswer) btnClass = 'bg-emerald-600/60 text-emerald-100';
                    else if (choice === answered) btnClass = 'bg-red-600/60 text-red-100';
                    else btnClass = 'bg-slate-800/50 text-slate-500';
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(choice)}
                      disabled={!!answered}
                      className={`w-full py-3 px-4 rounded-xl text-base text-left transition ${btnClass}`}
                    >
                      {choice}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* End Screen */
            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
              <p className="text-5xl mb-4">{gameScore.correct >= GAME_ROUNDS * 0.8 ? '🎉' : gameScore.correct >= GAME_ROUNDS * 0.5 ? '👍' : '💪'}</p>
              <p className="text-3xl font-bold text-slate-100 mb-2">
                {gameScore.correct} / {gameScore.total}
              </p>
              <p className="text-lg text-slate-400 mb-1">
                {Math.round((gameScore.correct / gameScore.total) * 100)}% correct
              </p>
              {panel.value && getHighScore(panel.value) > 0 && (
                <p className="text-base text-amber-400 mb-2">🏆 Best: {getHighScore(panel.value)}/{GAME_ROUNDS}</p>
              )}
              <p className="text-base text-slate-500 mb-6">
                {gameScore.correct >= GAME_ROUNDS * 0.8 ? 'Excellent!' : gameScore.correct >= GAME_ROUNDS * 0.5 ? 'Good effort!' : 'Keep practicing!'}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={restartGame}
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
