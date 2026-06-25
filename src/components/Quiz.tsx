import { useState, useEffect, useCallback, useRef } from 'react';
import { speak } from '../utils/tts';
import { useSlidePanel } from '../utils/useSlidePanel';
import { HIRAGANA_CARDS, KATAKANA_CARDS, HIRAGANA_VOCAB_CARDS, KATAKANA_VOCAB_CARDS } from '../data/kana-data';
import type { KanaCard, KanaVocabCard } from '../data/kana-data';
import { phrases } from '../data/phrases';

type QuizCategory = 'hiragana' | 'katakana' | 'vocab-h' | 'vocab-k' | 'phrases' | 'vocab-words' | 'vocab-actions' | 'vocab-time' | 'vocab-world' | 'vocab-people' | 'phrases-power' | 'phrases-travel' | 'phrases-food';
type QuizMode = 'easy' | 'reverse' | 'hard';

// Build phrase vocab cards from phrases.ts by situation groups
const buildPhraseCards = (situations: string[]): KanaVocabCard[] => phrases
  .filter(p => p.lang === 'ja' && p.category === 'vocab' && situations.includes(p.situation))
  .map(p => ({ jp: p.target, hep: p.pronunciation_chunks || p.pronunciation, en: p.english, kanaKey: p.pronunciation.slice(0, 2) }));

const buildCategoryCards = (categories: string[]): KanaVocabCard[] => phrases
  .filter(p => p.lang === 'ja' && categories.includes(p.category))
  .map(p => ({ jp: p.target, hep: p.pronunciation_chunks || p.pronunciation, en: p.english, kanaKey: p.pronunciation.slice(0, 2) }));

// Topic-based vocab pools
const VOCAB_WORDS_CARDS = buildPhraseCards(['Basic nouns', 'Pointing words', 'Colors']);
const VOCAB_ACTIONS_CARDS = buildPhraseCards(['Basic verbs', 'Daily actions']);
const VOCAB_TIME_CARDS = buildPhraseCards(['Numbers', 'Time', 'Meals', 'Days of the week']);
const VOCAB_WORLD_CARDS = buildPhraseCards(['Basic places', 'Directions']);
const VOCAB_PEOPLE_CARDS = buildPhraseCards(['People & Family', 'Body & Health', 'Basic adjectives']);

// Phrase category pools
const PHRASES_POWER_CARDS = buildCategoryCards(['power']);
const PHRASES_TRAVEL_CARDS = buildCategoryCards(['airport', 'directions', 'hotel']);
const PHRASES_FOOD_CARDS = buildCategoryCards(['restaurant', 'food', 'drinks']);

// Legacy (keep for backward compat with high scores)
const PHRASE_VOCAB_CARDS: KanaVocabCard[] = phrases
  .filter(p => p.lang === 'ja' && p.category === 'vocab')
  .map(p => ({ jp: p.target, hep: p.pronunciation_chunks || p.pronunciation, en: p.english, kanaKey: p.pronunciation.slice(0, 2) }));

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
  const [startPage, setStartPage] = useState<'hiragana' | 'katakana' | null>(null);
  const [quizMode, setQuizMode] = useState<QuizMode>('easy');

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
  const [typedAnswer, setTypedAnswer] = useState('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isKana = panel.value === 'hiragana' || panel.value === 'katakana';
  const isVocab = !isKana && !!panel.value;

  const currentKana = isKana && kanaCards.length > 0 ? kanaCards[currentIndex % kanaCards.length] : null;
  const currentVocab = isVocab && vocabCards.length > 0 ? vocabCards[currentIndex % vocabCards.length] : null;

  // Generate 4 choices
  const generateChoices = useCallback((idx: number, kCards: KanaCard[], vCards: KanaVocabCard[], isKanaMode: boolean, mode: QuizMode = 'easy') => {
    if (isKanaMode && kCards.length > 0) {
      const card = kCards[idx % kCards.length];
      if (mode === 'reverse') {
        // Show romaji, pick character
        const correct = card.char;
        const pool = kCards.map(c => c.char).filter(c => c !== correct);
        const wrong = shuffle(pool).slice(0, 3);
        setCorrectAnswer(correct);
        setChoices(shuffle([correct, ...wrong]));
      } else if (mode === 'hard') {
        // Type mode — no choices needed
        setCorrectAnswer(card.rom);
        setChoices([]);
      } else {
        // Easy — show character, pick romaji
        const correct = card.rom;
        const pool = kCards.map(c => c.rom).filter(r => r !== correct);
        const wrong = shuffle(pool).slice(0, 3);
        setCorrectAnswer(correct);
        setChoices(shuffle([correct, ...wrong]));
      }
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
        if (panel.value) setHighScore(panel.value, gameScore.correct);
      } else {
        const nextIdx = currentIndex + 1;
        setCurrentIndex(nextIdx);
        setAnswered(null);
        setTypedAnswer('');
        generateChoices(nextIdx, kanaCards, vocabCards, isKana, quizMode);
        startTimer();
        if (quizMode === 'hard' && inputRef.current) setTimeout(() => inputRef.current?.focus(), 100);
      }
    }, 1500);
    return () => { clearTimeout(speakTimeout); clearTimeout(advanceTimeout); };
  }, [answered]);

  // Cleanup
  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const startGame = (cat: QuizCategory, mode: QuizMode = 'easy') => {
    let kCards: KanaCard[] = [];
    let vCards: KanaVocabCard[] = [];
    const isKanaMode = cat === 'hiragana' || cat === 'katakana';
    setQuizMode(mode);
    setTypedAnswer('');

    if (isKanaMode) {
      kCards = shuffle(cat === 'hiragana' ? HIRAGANA_CARDS : KATAKANA_CARDS);
      setKanaCards(kCards);
    } else {
      const vocabMap: Record<string, KanaVocabCard[]> = {
        'vocab-h': HIRAGANA_VOCAB_CARDS,
        'vocab-k': KATAKANA_VOCAB_CARDS,
        'phrases': PHRASE_VOCAB_CARDS,
        'vocab-words': VOCAB_WORDS_CARDS,
        'vocab-actions': VOCAB_ACTIONS_CARDS,
        'vocab-time': VOCAB_TIME_CARDS,
        'vocab-world': VOCAB_WORLD_CARDS,
        'vocab-people': VOCAB_PEOPLE_CARDS,
        'phrases-power': PHRASES_POWER_CARDS,
        'phrases-travel': PHRASES_TRAVEL_CARDS,
        'phrases-food': PHRASES_FOOD_CARDS,
      };
      vCards = shuffle(vocabMap[cat] || PHRASE_VOCAB_CARDS);
      setVocabCards(vCards);
    }

    setCurrentIndex(0);
    setGameScore({ correct: 0, total: 0 });
    setGameFinished(false);
    setAnswered(null);
    setStartPage(null);
    panel.open(cat);

    setTimeout(() => {
      generateChoices(0, kCards, vCards, isKanaMode, mode);
      startTimer();
      if (mode === 'hard' && inputRef.current) inputRef.current.focus();
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
                onClick={() => setStartPage('hiragana')}
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
                onClick={() => setStartPage('katakana')}
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

          {/* Vocabulary by Topic */}
          <div>
            <p className="text-sm text-slate-500 mb-2">Vocabulary</p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => startGame('vocab-words')} className="bg-purple-900/30 border border-purple-700/30 rounded-xl p-4 text-left active:bg-purple-800/40 transition flex flex-col gap-1">
                <span className="text-3xl">📦</span>
                <span className="text-base font-semibold text-slate-100">Words</span>
                <span className="text-sm text-slate-500">{VOCAB_WORDS_CARDS.length} words</span>
                {getHighScore('vocab-words') > 0 && <span className="text-xs text-amber-400 mt-1">🏆 Best: {getHighScore('vocab-words')}/{GAME_ROUNDS}</span>}
              </button>
              <button onClick={() => startGame('vocab-actions')} className="bg-purple-900/30 border border-purple-700/30 rounded-xl p-4 text-left active:bg-purple-800/40 transition flex flex-col gap-1">
                <span className="text-3xl">🎯</span>
                <span className="text-base font-semibold text-slate-100">Actions</span>
                <span className="text-sm text-slate-500">{VOCAB_ACTIONS_CARDS.length} words</span>
                {getHighScore('vocab-actions') > 0 && <span className="text-xs text-amber-400 mt-1">🏆 Best: {getHighScore('vocab-actions')}/{GAME_ROUNDS}</span>}
              </button>
              <button onClick={() => startGame('vocab-time')} className="bg-purple-900/30 border border-purple-700/30 rounded-xl p-4 text-left active:bg-purple-800/40 transition flex flex-col gap-1">
                <span className="text-3xl">🕐</span>
                <span className="text-base font-semibold text-slate-100">Time</span>
                <span className="text-sm text-slate-500">{VOCAB_TIME_CARDS.length} words</span>
                {getHighScore('vocab-time') > 0 && <span className="text-xs text-amber-400 mt-1">🏆 Best: {getHighScore('vocab-time')}/{GAME_ROUNDS}</span>}
              </button>
              <button onClick={() => startGame('vocab-world')} className="bg-purple-900/30 border border-purple-700/30 rounded-xl p-4 text-left active:bg-purple-800/40 transition flex flex-col gap-1">
                <span className="text-3xl">🌍</span>
                <span className="text-base font-semibold text-slate-100">World</span>
                <span className="text-sm text-slate-500">{VOCAB_WORLD_CARDS.length} words</span>
                {getHighScore('vocab-world') > 0 && <span className="text-xs text-amber-400 mt-1">🏆 Best: {getHighScore('vocab-world')}/{GAME_ROUNDS}</span>}
              </button>
              <button onClick={() => startGame('vocab-people')} className="bg-purple-900/30 border border-purple-700/30 rounded-xl p-4 text-left active:bg-purple-800/40 transition flex flex-col gap-1">
                <span className="text-3xl">👥</span>
                <span className="text-base font-semibold text-slate-100">People</span>
                <span className="text-sm text-slate-500">{VOCAB_PEOPLE_CARDS.length} words</span>
                {getHighScore('vocab-people') > 0 && <span className="text-xs text-amber-400 mt-1">🏆 Best: {getHighScore('vocab-people')}/{GAME_ROUNDS}</span>}
              </button>
            </div>
          </div>

          {/* Phrases */}
          <div>
            <p className="text-sm text-slate-500 mb-2">Phrases</p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => startGame('phrases-power')} className="bg-emerald-900/30 border border-emerald-700/30 rounded-xl p-4 text-left active:bg-emerald-800/40 transition flex flex-col gap-1">
                <span className="text-3xl">⚡</span>
                <span className="text-base font-semibold text-slate-100">Power Phrases</span>
                <span className="text-sm text-slate-500">{PHRASES_POWER_CARDS.length} phrases</span>
                {getHighScore('phrases-power') > 0 && <span className="text-xs text-amber-400 mt-1">🏆 Best: {getHighScore('phrases-power')}/{GAME_ROUNDS}</span>}
              </button>
              <button onClick={() => startGame('phrases-travel')} className="bg-emerald-900/30 border border-emerald-700/30 rounded-xl p-4 text-left active:bg-emerald-800/40 transition flex flex-col gap-1">
                <span className="text-3xl">✈️</span>
                <span className="text-base font-semibold text-slate-100">Travel</span>
                <span className="text-sm text-slate-500">{PHRASES_TRAVEL_CARDS.length} phrases</span>
                {getHighScore('phrases-travel') > 0 && <span className="text-xs text-amber-400 mt-1">🏆 Best: {getHighScore('phrases-travel')}/{GAME_ROUNDS}</span>}
              </button>
              <button onClick={() => startGame('phrases-food')} className="bg-emerald-900/30 border border-emerald-700/30 rounded-xl p-4 text-left active:bg-emerald-800/40 transition flex flex-col gap-1">
                <span className="text-3xl">🍜</span>
                <span className="text-base font-semibold text-slate-100">Food</span>
                <span className="text-sm text-slate-500">{PHRASES_FOOD_CARDS.length} phrases</span>
                {getHighScore('phrases-food') > 0 && <span className="text-xs text-amber-400 mt-1">🏆 Best: {getHighScore('phrases-food')}/{GAME_ROUNDS}</span>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Start Page — Kana difficulty picker */}
      {startPage && !panel.visible && (
        <div className="absolute inset-0 bg-slate-950 animate-slide-in-right flex flex-col z-40">
          <div className="px-4 py-3 border-b border-slate-800 flex items-center gap-2">
            <button onClick={() => setStartPage(null)} className="text-lg text-slate-400 active:text-slate-200 p-1">←</button>
            <h2 className="text-lg font-bold">{startPage === 'hiragana' ? 'あ' : 'ア'} {startPage === 'hiragana' ? 'Hiragana' : 'Katakana'}</h2>
          </div>
          <div className="flex-1 flex flex-col justify-center px-4 space-y-3">
            <p className="text-base text-slate-400 text-center mb-2">Choose your challenge</p>
            <button
              onClick={() => startGame(startPage, 'easy')}
              className="bg-emerald-900/30 border border-emerald-700/30 rounded-xl p-4 text-left active:bg-emerald-800/40 transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🟢</span>
                <div>
                  <p className="text-base font-semibold text-slate-100">Easy — Pick the sound</p>
                  <p className="text-sm text-slate-500">See character → pick from 4 romaji</p>
                </div>
              </div>
            </button>
            <button
              onClick={() => startGame(startPage, 'reverse')}
              className="bg-amber-900/30 border border-amber-700/30 rounded-xl p-4 text-left active:bg-amber-800/40 transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🟡</span>
                <div>
                  <p className="text-base font-semibold text-slate-100">Reverse — Pick the character</p>
                  <p className="text-sm text-slate-500">See romaji → pick the correct character</p>
                </div>
              </div>
            </button>
            <button
              onClick={() => startGame(startPage, 'hard')}
              className="bg-red-900/30 border border-red-700/30 rounded-xl p-4 text-left active:bg-red-800/40 transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔴</span>
                <div>
                  <p className="text-base font-semibold text-slate-100">Hard — Type the answer</p>
                  <p className="text-sm text-slate-500">See character → type the romaji yourself</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Game Panel (slide-in) */}
      {panel.visible && (
        <div className={`absolute inset-0 bg-slate-950 ${panel.animClass} flex flex-col z-40`}>
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div>
              <button onClick={exitGame} className="text-base text-slate-400 active:text-slate-200 p-1">←</button>
              {!gameFinished && (
                <p className="text-base text-slate-400">
                  {panel.value === 'hiragana' ? 'ひらがな' : panel.value === 'katakana' ? 'カタカナ' : panel.value?.replace('vocab-', '').replace('phrases-', '')} · {quizMode === 'reverse' ? 'Reverse' : quizMode === 'hard' ? 'Hard' : ''} Q{gameScore.total + 1}/{GAME_ROUNDS}
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
                {isKana && currentKana && quizMode === 'easy' && (
                  <>
                    <p className="text-6xl font-bold text-slate-50 mb-2">{currentKana.char}</p>
                    <p className="text-base text-slate-500">What sound is this?</p>
                  </>
                )}
                {isKana && currentKana && quizMode === 'reverse' && (
                  <>
                    <p className="text-4xl font-bold text-sakura-300 mb-2">{currentKana.rom}</p>
                    <p className="text-base text-slate-500">Which character is this?</p>
                  </>
                )}
                {isKana && currentKana && quizMode === 'hard' && (
                  <>
                    <p className="text-6xl font-bold text-slate-50 mb-2">{currentKana.char}</p>
                    <p className="text-base text-slate-500">Type the romaji</p>
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

              {/* Choices (Easy & Reverse) or Text Input (Hard) */}
              {quizMode === 'hard' && isKana ? (
                <div className="w-full max-w-sm">
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={typedAnswer}
                      onChange={e => setTypedAnswer(e.target.value.toLowerCase())}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && typedAnswer && !answered) {
                          const isCorrect = typedAnswer.trim() === correctAnswer;
                          handleAnswer(isCorrect ? correctAnswer : typedAnswer.trim());
                        }
                      }}
                      disabled={!!answered}
                      placeholder="Type romaji..."
                      autoComplete="off"
                      className={`flex-1 px-4 py-3 rounded-xl text-lg text-center outline-none transition ${
                        answered
                          ? typedAnswer.trim() === correctAnswer ? 'bg-emerald-600/40 text-emerald-100' : 'bg-red-600/40 text-red-100'
                          : 'bg-slate-800 text-slate-100 focus:ring-1 focus:ring-sakura-400/50'
                      }`}
                    />
                    {!answered && (
                      <button
                        onClick={() => {
                          if (typedAnswer && !answered) {
                            const isCorrect = typedAnswer.trim() === correctAnswer;
                            handleAnswer(isCorrect ? correctAnswer : typedAnswer.trim());
                          }
                        }}
                        className="px-4 py-3 rounded-xl bg-sakura-500/60 text-white active:bg-sakura-600 transition"
                      >→</button>
                    )}
                  </div>
                  {answered && typedAnswer.trim() !== correctAnswer && (
                    <p className="text-base text-emerald-400 text-center mt-2">Correct: {correctAnswer}</p>
                  )}
                </div>
              ) : (
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
                        className={`w-full py-3 px-4 rounded-xl ${quizMode === 'reverse' && isKana ? 'text-2xl text-center' : 'text-base text-left'} transition ${btnClass}`}
                      >
                        {choice}
                      </button>
                    );
                  })}
                </div>
              )}
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
