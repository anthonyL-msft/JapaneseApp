import { useState, useEffect, useCallback } from 'react';
import type { Phrase, SRSCard, RefBookmark, Category } from '../data/types';
import { CATEGORY_INFO } from '../data/types';
import { speak, getTtsLang } from '../utils/tts';
import { getSRSCards, saveSRSCard } from '../db';
import { createNewCard, reviewCard, isDueForReview } from '../utils/srs';
import { useSlidePanel } from '../utils/useSlidePanel';

interface Props {
  phrases: Phrase[];
  learnedIds: Set<string>;
  refBookmarks: RefBookmark[];
}

// Convert ref bookmarks to Phrase-compatible objects for the card UI
function refToPseudoPhrase(rb: RefBookmark): Phrase {
  return {
    id: rb.id,
    lang: 'ja',
    target: rb.jp,
    pronunciation: rb.hep,
    pronunciation_chunks: rb.hep,
    english: rb.en,
    chinese_tc: '',
    category: 'culture' as Category,
    situation: rb.section,
    difficulty: 1,
    notes: `From: ${rb.section}`,
  };
}

type DeckMode = 'all' | Category | 'ref';

export function Flashcards({ phrases, learnedIds, refBookmarks }: Props) {
  const [cards, setCards] = useState<SRSCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [reviewMode, setReviewMode] = useState<'review' | 'all'>('all');
  const [loaded, setLoaded] = useState(false);
  const deck = useSlidePanel<DeckMode>();

  useEffect(() => {
    getSRSCards().then(c => { setCards(c); setLoaded(true); });
  }, []);

  // Build learned phrases by category
  const learnedPhrases = phrases.filter(p => learnedIds.has(p.id));
  const learnedRefPhrases = refBookmarks
    .filter(rb => learnedIds.has(rb.id))
    .map(refToPseudoPhrase);

  // Category counts (only categories with learned items)
  const categoryCounts = new Map<Category, number>();
  for (const p of learnedPhrases) {
    categoryCounts.set(p.category, (categoryCounts.get(p.category) || 0) + 1);
  }

  const totalLearned = learnedPhrases.length + learnedRefPhrases.length;

  // Active deck
  const getActivePhrases = (): Phrase[] => {
    if (!deck.value) return [];
    let pool: Phrase[];
    if (deck.value === 'all') {
      pool = [...learnedPhrases, ...learnedRefPhrases];
    } else if (deck.value === 'ref') {
      pool = learnedRefPhrases;
    } else {
      pool = learnedPhrases.filter(p => p.category === deck.value);
    }
    return pool;
  };

  const activePhrases = getActivePhrases();
  const dueCards = cards.filter(isDueForReview);
  const displayPhrases = reviewMode === 'review'
    ? activePhrases.filter(p => dueCards.some(c => c.phraseId === p.id))
    : activePhrases;

  const currentPhrase = displayPhrases.length > 0
    ? displayPhrases[currentIndex % displayPhrases.length]
    : null;

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

  const handleNext = () => { setShowAnswer(false); setCurrentIndex(prev => prev + 1); };
  const handlePrev = () => { setShowAnswer(false); setCurrentIndex(prev => Math.max(0, prev - 1)); };

  const startDeck = (mode: DeckMode) => {
    deck.open(mode);
    setCurrentIndex(0);
    setShowAnswer(false);
    setReviewMode('all');
  };

  if (!loaded) {
    return <div className="flex items-center justify-center h-full text-slate-500">Loading...</div>;
  }

  return (
    <div className="h-full relative">
      {/* Step 1: Category picker */}
      <div className="scroll-area h-full">
        <div className="px-4 py-3 border-b border-slate-800">
          <h2 className="text-lg font-bold">🃏 Flashcards</h2>
          <p className="text-base text-slate-400">{totalLearned} learned items ready to practice</p>
        </div>

        {totalLearned === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 px-6 text-center">
            <p className="text-4xl mb-4">📝</p>
            <p className="text-lg font-semibold text-slate-200">No learned items yet</p>
            <p className="text-base text-slate-400 mt-2">Mark phrases or reference examples as "Learned ✓" to add them to your flashcard deck</p>
          </div>
        ) : (
          <div className="p-4 grid grid-cols-2 gap-2">
            {/* All Learned */}
            <button
              onClick={() => startDeck('all')}
              className="bg-slate-800/60 rounded-xl p-3 text-left active:bg-slate-700/50 transition flex flex-col gap-1"
            >
              <span className="text-2xl">🎲</span>
              <span className="text-base font-semibold text-slate-100">All Learned</span>
              <span className="text-sm text-slate-500">{totalLearned} cards</span>
            </button>

            {/* Per-category */}
            {(Object.entries(CATEGORY_INFO) as [Category, { label: string; emoji: string; labelTC: string }][])
              .filter(([cat]) => categoryCounts.has(cat))
              .map(([cat, info]) => (
                <button
                  key={cat}
                  onClick={() => startDeck(cat)}
                  className="bg-slate-800/60 rounded-xl p-3 text-left active:bg-slate-700/50 transition flex flex-col gap-1"
                >
                  <span className="text-2xl">{info.emoji}</span>
                  <span className="text-base font-semibold text-slate-100">{info.label}</span>
                  <span className="text-sm text-slate-500">{categoryCounts.get(cat)} cards</span>
                </button>
              ))}

            {/* Reference Examples */}
            {learnedRefPhrases.length > 0 && (
              <button
                onClick={() => startDeck('ref')}
                className="bg-slate-800/60 rounded-xl p-3 text-left active:bg-slate-700/50 transition flex flex-col gap-1"
              >
                <span className="text-2xl">📚</span>
                <span className="text-base font-semibold text-slate-100">Reference</span>
                <span className="text-sm text-slate-500">{learnedRefPhrases.length} cards</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Step 2: Flashcard game (slide-in) */}
      {deck.visible && (
        <div className={`absolute inset-0 bg-slate-950 ${deck.animClass} flex flex-col z-40`}>
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div>
              <button onClick={() => deck.close()} className="text-base text-slate-400 active:text-slate-200 p-1">
                ←
              </button>
              <p className="text-base text-slate-400">
                {reviewMode === 'review'
                  ? `${displayPhrases.length} due for review`
                  : `${displayPhrases.length} cards`}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setReviewMode('review'); setCurrentIndex(0); setShowAnswer(false); }}
                className={`text-sm px-3 py-1.5 rounded-lg ${reviewMode === 'review' ? 'bg-sakura-500/80 text-white' : 'bg-slate-800 text-slate-400'}`}
              >Due</button>
              <button
                onClick={() => { setReviewMode('all'); setCurrentIndex(0); setShowAnswer(false); }}
                className={`text-sm px-3 py-1.5 rounded-lg ${reviewMode === 'all' ? 'bg-sakura-500/80 text-white' : 'bg-slate-800 text-slate-400'}`}
              >All</button>
            </div>
          </div>

          {displayPhrases.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 px-6 text-center">
              <p className="text-4xl mb-4">🎉</p>
              <p className="text-lg font-semibold text-slate-200">No cards due!</p>
              <p className="text-base text-slate-400 mt-2">Switch to "All" to study anyway</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center px-6">
              <p className="text-base text-slate-500 mb-4">
                {(currentIndex % displayPhrases.length) + 1} / {displayPhrases.length}
              </p>

              <div
                onClick={() => setShowAnswer(!showAnswer)}
                className="w-full max-w-sm bg-slate-800/80 rounded-2xl p-6 text-center cursor-pointer active:bg-slate-700/80 transition min-h-[280px] flex flex-col items-center justify-center"
              >
                {!showAnswer ? (
                  <>
                    <p className="text-3xl font-bold text-slate-50 mb-3">{currentPhrase!.target}</p>
                    <button
                      onClick={(e) => { e.stopPropagation(); speak(currentPhrase!.target, getTtsLang(currentPhrase!.lang)); }}
                      className="text-2xl mb-4 active:scale-110 transition-transform"
                    >🔊</button>
                    <p className="text-base text-slate-500">Tap to reveal answer</p>
                  </>
                ) : (
                  <>
                    <p className="text-2xl font-bold text-slate-50 mb-2">{currentPhrase!.target}</p>
                    <p className="text-lg text-sakura-300 mb-1">{currentPhrase!.pronunciation_chunks || currentPhrase!.pronunciation}</p>
                    {currentPhrase!.romanization && (
                      <p className="text-base text-slate-400 mb-1">{currentPhrase!.romanization}</p>
                    )}
                    <div className="border-t border-slate-700 w-full my-3" />
                    <p className="text-base text-slate-200 mb-1">{currentPhrase!.english}</p>
                    {currentPhrase!.chinese_tc && (
                      <p className="text-base text-slate-400">{currentPhrase!.chinese_tc}</p>
                    )}
                    {currentPhrase!.native_hint && (
                      <p className="text-base text-amber-400 mt-2">🌉 {currentPhrase!.native_hint}</p>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); speak(currentPhrase!.target, getTtsLang(currentPhrase!.lang)); }}
                      className="text-xl mt-3 active:scale-110 transition-transform"
                    >🔊</button>
                  </>
                )}
              </div>

              {showAnswer && (
                <div className="flex gap-2 mt-4 w-full max-w-sm">
                  <button onClick={() => handleRate(1)} className="flex-1 bg-red-900/40 text-red-300 py-2.5 rounded-xl text-base active:bg-red-800/60 transition">Again</button>
                  <button onClick={() => handleRate(3)} className="flex-1 bg-amber-900/40 text-amber-300 py-2.5 rounded-xl text-base active:bg-amber-800/60 transition">Hard</button>
                  <button onClick={() => handleRate(4)} className="flex-1 bg-green-900/40 text-green-300 py-2.5 rounded-xl text-base active:bg-green-800/60 transition">Good</button>
                  <button onClick={() => handleRate(5)} className="flex-1 bg-emerald-900/40 text-emerald-300 py-2.5 rounded-xl text-base active:bg-emerald-800/60 transition">Easy</button>
                </div>
              )}

              {!showAnswer && (
                <div className="flex gap-4 mt-4">
                  <button onClick={handlePrev} className="text-slate-400 px-4 py-2 rounded-xl bg-slate-800 active:bg-slate-700 text-base" disabled={currentIndex === 0}>← Prev</button>
                  <button onClick={handleNext} className="text-slate-400 px-4 py-2 rounded-xl bg-slate-800 active:bg-slate-700 text-base">Next →</button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
