import { useState, useEffect, useCallback } from 'react';
import type { Phrase, SRSCard } from '../data/types';
import { speak, getTtsLang } from '../utils/tts';
import { getSRSCards, saveSRSCard } from '../db';
import { createNewCard, reviewCard, isDueForReview } from '../utils/srs';

interface Props {
  phrases: Phrase[];
}

export function Flashcards({ phrases }: Props) {
  const [cards, setCards] = useState<SRSCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [mode, setMode] = useState<'review' | 'all'>('all');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getSRSCards().then(c => { setCards(c); setLoaded(true); });
  }, []);

  const dueCards = cards.filter(isDueForReview);
  const activePhrases = mode === 'review'
    ? phrases.filter(p => dueCards.some(c => c.phraseId === p.id))
    : phrases;

  const currentPhrase = activePhrases[currentIndex % Math.max(activePhrases.length, 1)];

  const handleRate = useCallback(async (quality: number) => {
    if (!currentPhrase) return;
    let card = cards.find(c => c.phraseId === currentPhrase.id);
    if (!card) card = createNewCard(currentPhrase.id);
    const updated = reviewCard(card, quality);
    await saveSRSCard(updated);
    setCards(prev => {
      const idx = prev.findIndex(c => c.phraseId === currentPhrase.id);
      if (idx >= 0) { const next = [...prev]; next[idx] = updated; return next; }
      return [...prev, updated];
    });
    setShowAnswer(false);
    setCurrentIndex(prev => prev + 1);
  }, [currentPhrase, cards]);

  const handleNext = () => {
    setShowAnswer(false);
    setCurrentIndex(prev => prev + 1);
  };

  const handlePrev = () => {
    setShowAnswer(false);
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  if (!loaded) {
    return <div className="flex items-center justify-center h-full text-slate-500">Loading...</div>;
  }

  if (activePhrases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center">
        <p className="text-4xl mb-4">🎉</p>
        <p className="text-lg font-semibold text-slate-200">No cards due for review!</p>
        <p className="text-sm text-slate-400 mt-2">Come back later or switch to "All Cards" mode.</p>
        <button
          onClick={() => setMode('all')}
          className="mt-4 bg-sakura-500/80 text-white px-4 py-2 rounded-xl text-sm active:bg-sakura-600"
        >
          Study All Cards
        </button>
      </div>
    );
  }

  const idx = currentIndex % activePhrases.length;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">🃏 Flashcards</h2>
          <p className="text-xs text-slate-400">
            {mode === 'review' ? `${dueCards.length} due for review` : `${activePhrases.length} total cards`}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { setMode('review'); setCurrentIndex(0); setShowAnswer(false); }}
            className={`text-xs px-3 py-1.5 rounded-lg ${mode === 'review' ? 'bg-sakura-500/80 text-white' : 'bg-slate-800 text-slate-400'}`}
          >Due ({dueCards.length})</button>
          <button
            onClick={() => { setMode('all'); setCurrentIndex(0); setShowAnswer(false); }}
            className={`text-xs px-3 py-1.5 rounded-lg ${mode === 'all' ? 'bg-sakura-500/80 text-white' : 'bg-slate-800 text-slate-400'}`}
          >All</button>
        </div>
      </div>

      {/* Card */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <p className="text-xs text-slate-500 mb-4">{idx + 1} / {activePhrases.length}</p>

        <div
          onClick={() => setShowAnswer(!showAnswer)}
          className="w-full max-w-sm bg-slate-800/80 rounded-2xl p-6 text-center cursor-pointer active:bg-slate-700/80 transition min-h-[280px] flex flex-col items-center justify-center"
        >
          {!showAnswer ? (
            <>
              <p className="text-3xl font-bold text-slate-50 mb-3">{currentPhrase.target}</p>
              <button
                onClick={(e) => { e.stopPropagation(); speak(currentPhrase.target, getTtsLang(currentPhrase.lang)); }}
                className="text-2xl mb-4 active:scale-110 transition-transform"
              >🔊</button>
              <p className="text-sm text-slate-500">Tap to reveal answer</p>
            </>
          ) : (
            <>
              <p className="text-2xl font-bold text-slate-50 mb-2">{currentPhrase.target}</p>
              <p className="text-lg text-sakura-300 mb-1">{currentPhrase.pronunciation_chunks || currentPhrase.pronunciation}</p>
              {currentPhrase.pronunciation_chunks && (
                <p className="text-xs text-slate-500 mb-1">{currentPhrase.pronunciation}</p>
              )}
              <p className="text-sm text-slate-300 mb-1">{currentPhrase.romanization}</p>
              <div className="border-t border-slate-700 w-full my-3" />
              <p className="text-base text-slate-200 mb-1">{currentPhrase.english}</p>
              <p className="text-sm text-slate-400">{currentPhrase.chinese_tc}</p>
              {currentPhrase.native_hint && (
                <p className="text-xs text-amber-400 mt-2">🌉 {currentPhrase.native_hint}</p>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); speak(currentPhrase.target, getTtsLang(currentPhrase.lang)); }}
                className="text-xl mt-3 active:scale-110 transition-transform"
              >🔊</button>
            </>
          )}
        </div>

        {/* Rating buttons */}
        {showAnswer && (
          <div className="flex gap-2 mt-4 w-full max-w-sm">
            <button onClick={() => handleRate(1)} className="flex-1 bg-red-900/40 text-red-300 py-2.5 rounded-xl text-sm active:bg-red-800/60 transition">
              Again
            </button>
            <button onClick={() => handleRate(3)} className="flex-1 bg-amber-900/40 text-amber-300 py-2.5 rounded-xl text-sm active:bg-amber-800/60 transition">
              Hard
            </button>
            <button onClick={() => handleRate(4)} className="flex-1 bg-green-900/40 text-green-300 py-2.5 rounded-xl text-sm active:bg-green-800/60 transition">
              Good
            </button>
            <button onClick={() => handleRate(5)} className="flex-1 bg-emerald-900/40 text-emerald-300 py-2.5 rounded-xl text-sm active:bg-emerald-800/60 transition">
              Easy
            </button>
          </div>
        )}

        {/* Nav */}
        {!showAnswer && (
          <div className="flex gap-4 mt-4">
            <button onClick={handlePrev} className="text-slate-400 px-4 py-2 rounded-xl bg-slate-800 active:bg-slate-700 text-sm" disabled={idx === 0}>
              ← Prev
            </button>
            <button onClick={handleNext} className="text-slate-400 px-4 py-2 rounded-xl bg-slate-800 active:bg-slate-700 text-sm">
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
