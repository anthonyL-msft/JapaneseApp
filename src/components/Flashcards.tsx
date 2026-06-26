import { useState, useEffect, useCallback } from 'react';
import { Volume2, Shuffle } from 'lucide-react';
import type { Phrase, SRSCard, RefBookmark, Category } from '../data/types';
import { CATEGORY_INFO } from '../data/types';
import { speak, getTtsLang } from '../utils/tts';
import { getSRSCards, saveSRSCard } from '../db';
import { createNewCard, reviewCard, isDueForReview } from '../utils/srs';
import { useSlidePanel } from '../utils/useSlidePanel';
import { HIRAGANA_CARDS, KATAKANA_CARDS, HIRAGANA_VOCAB_CARDS, KATAKANA_VOCAB_CARDS } from '../data/kana-data';
import type { KanaCard, KanaVocabCard } from '../data/kana-data';

interface Props {
  phrases: Phrase[];
  learnedIds: Set<string>;
  refBookmarks: RefBookmark[];
  lang?: string;
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

type DeckMode = 'all' | Category | 'ref' | 'hiragana' | 'katakana' | 'vocab-h' | 'vocab-k';

// Shuffle array (Fisher-Yates)
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function Flashcards({ phrases, learnedIds, refBookmarks, lang = 'ja' }: Props) {
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
    if (mode === 'hiragana' || mode === 'katakana') {
      setKanaCards(shuffle(mode === 'hiragana' ? HIRAGANA_CARDS : KATAKANA_CARDS));
    } else if (mode === 'vocab-h' || mode === 'vocab-k') {
      setVocabCards(shuffle(mode === 'vocab-h' ? HIRAGANA_VOCAB_CARDS : KATAKANA_VOCAB_CARDS));
    }
    deck.open(mode);
    setCurrentIndex(0);
    setShowAnswer(false);
    setReviewMode('all');
  };

  // Kana deck state
  const [kanaCards, setKanaCards] = useState<KanaCard[]>([]);
  const isKanaDeck = deck.value === 'hiragana' || deck.value === 'katakana';
  const currentKana = isKanaDeck && kanaCards.length > 0 ? kanaCards[currentIndex % kanaCards.length] : null;

  // Vocab deck state
  const [vocabCards, setVocabCards] = useState<KanaVocabCard[]>([]);
  const isVocabDeck = deck.value === 'vocab-h' || deck.value === 'vocab-k';
  const currentVocab = isVocabDeck && vocabCards.length > 0 ? vocabCards[currentIndex % vocabCards.length] : null;

  if (!loaded) {
    return <div className="flex items-center justify-center h-full text-slate-500">Loading...</div>;
  }

  return (
    <div className="h-full relative">
      {/* Step 1: Category picker */}
      <div className="scroll-area h-full">
        <div className="px-4 py-3 border-b border-slate-800">
          <h2 className="text-lg font-bold">Flashcards</h2>
          <p className="text-base text-slate-400">{lang === 'ja' ? 'Practice kana recognition & learned phrases' : 'Review your learned phrases'}</p>
        </div>

        <div className="p-4 space-y-4">
          {/* Kana Recognition Section — JP only */}
          {lang === 'ja' && (
          <div>
            <p className="text-sm text-slate-500 mb-2">Kana Recognition</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => startDeck('hiragana')}
                className="bg-indigo-900/30 border border-indigo-700/30 rounded-xl p-3 text-left active:bg-indigo-800/40 transition flex flex-col gap-1"
              >
                <span className="text-2xl">あ</span>
                <span className="text-base font-semibold text-slate-100">Hiragana</span>
                <span className="text-sm text-slate-500">{HIRAGANA_CARDS.length} characters</span>
              </button>
              <button
                onClick={() => startDeck('katakana')}
                className="bg-indigo-900/30 border border-indigo-700/30 rounded-xl p-3 text-left active:bg-indigo-800/40 transition flex flex-col gap-1"
              >
                <span className="text-2xl">ア</span>
                <span className="text-base font-semibold text-slate-100">Katakana</span>
                <span className="text-sm text-slate-500">{KATAKANA_CARDS.length} characters</span>
              </button>
            </div>
          </div>
          )}

          {/* Kana Vocab Section — JP only */}
          {lang === 'ja' && (
          <div>
            <p className="text-sm text-slate-500 mb-2">Kana Vocab Practice</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => startDeck('vocab-h')}
                className="bg-purple-900/30 border border-purple-700/30 rounded-xl p-3 text-left active:bg-purple-800/40 transition flex flex-col gap-1"
              >
                <span className="text-2xl">🏷️</span>
                <span className="text-base font-semibold text-slate-100">Vocab (ひらがな)</span>
                <span className="text-sm text-slate-500">{HIRAGANA_VOCAB_CARDS.length} words</span>
              </button>
              <button
                onClick={() => startDeck('vocab-k')}
                className="bg-purple-900/30 border border-purple-700/30 rounded-xl p-3 text-left active:bg-purple-800/40 transition flex flex-col gap-1"
              >
                <span className="text-2xl">🏷️</span>
                <span className="text-base font-semibold text-slate-100">Vocab (カタカナ)</span>
                <span className="text-sm text-slate-500">{KATAKANA_VOCAB_CARDS.length} words</span>
              </button>
            </div>
          </div>
          )}

          {/* Learned Phrases Section */}
          {totalLearned > 0 && (
            <div>
              <p className="text-sm text-slate-500 mb-2">Learned Phrases ({totalLearned})</p>
              <div className="grid grid-cols-2 gap-2">
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
            </div>
          )}
        </div>
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
              {(isKanaDeck || isVocabDeck) ? (
                <p className="text-base text-slate-400">
                  {deck.value === 'hiragana' ? 'ひらがな' : deck.value === 'katakana' ? 'カタカナ' : deck.value === 'vocab-h' ? 'Vocab ひらがな' : 'Vocab カタカナ'} · {(currentIndex % (isKanaDeck ? kanaCards.length : vocabCards.length || 1)) + 1} / {isKanaDeck ? kanaCards.length : vocabCards.length}
                </p>
              ) : (
                <p className="text-base text-slate-400">
                  {reviewMode === 'review'
                    ? `${displayPhrases.length} due for review`
                    : `${displayPhrases.length} cards`}
                </p>
              )}
            </div>
            {!isKanaDeck && !isVocabDeck && (
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
            )}
            {(isKanaDeck || isVocabDeck) && (
              <button
                onClick={() => {
                  if (isKanaDeck) setKanaCards(shuffle(kanaCards));
                  else setVocabCards(shuffle(vocabCards));
                  setCurrentIndex(0); setShowAnswer(false);
                }}
                className="text-sm px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 active:bg-slate-700"
              ><Shuffle size={14} className="inline-block mr-1" /> Shuffle</button>
            )}
          </div>

          {/* Vocab Flashcard (free study) */}
          {isVocabDeck && currentVocab ? (
            /* Vocab Flashcard (free study) */
            <div className="flex-1 flex flex-col items-center justify-center px-6">
              <div
                onClick={() => setShowAnswer(!showAnswer)}
                className="w-full max-w-sm bg-slate-800/80 rounded-2xl p-6 text-center cursor-pointer active:bg-slate-700/80 transition min-h-[300px] flex flex-col items-center justify-center"
              >
                {!showAnswer ? (
                  <>
                    <p className="text-3xl font-bold text-slate-50 mb-3">{currentVocab.jp}</p>
                    <button
                      onClick={(e) => { e.stopPropagation(); speak(currentVocab.jp, getTtsLang(lang)); }}
                      className="text-2xl mb-4 active:scale-110 transition-transform"
                    ><Volume2 size={20} /></button>
                    <p className="text-base text-slate-500">What does this word mean? Tap to reveal</p>
                  </>
                ) : (
                  <>
                    <p className="text-3xl font-bold text-slate-50 mb-2">{currentVocab.jp}</p>
                    <p className="text-lg text-sakura-300 mb-1">{currentVocab.hep}</p>
                    <div className="border-t border-slate-700 w-full my-3" />
                    <p className="text-lg text-slate-200 mb-2">{currentVocab.en}</p>
                    <p className="text-sm text-indigo-300 bg-indigo-900/30 px-3 py-1 rounded-full">
                      Kana: {currentVocab.kanaKey}
                    </p>
                    <button
                      onClick={(e) => { e.stopPropagation(); speak(currentVocab.jp, getTtsLang(lang)); }}
                      className="text-xl mt-3 active:scale-110 transition-transform"
                    ><Volume2 size={20} /></button>
                  </>
                )}
              </div>

              <div className="flex gap-4 mt-4">
                <button onClick={handlePrev} className="text-slate-400 px-4 py-2 rounded-xl bg-slate-800 active:bg-slate-700 text-base" disabled={currentIndex === 0}>← Prev</button>
                <button onClick={handleNext} className="text-slate-400 px-4 py-2 rounded-xl bg-slate-800 active:bg-slate-700 text-base">Next →</button>
              </div>
            </div>
          ) : isKanaDeck && currentKana ? (
            <div className="flex-1 flex flex-col items-center justify-center px-6">
              <div
                onClick={() => setShowAnswer(!showAnswer)}
                className="w-full max-w-sm bg-slate-800/80 rounded-2xl p-6 text-center cursor-pointer active:bg-slate-700/80 transition min-h-[320px] flex flex-col items-center justify-center"
              >
                {!showAnswer ? (
                  <>
                    <p className="text-7xl font-bold text-slate-50 mb-4">{currentKana.char}</p>
                    <button
                      onClick={(e) => { e.stopPropagation(); speak(currentKana.char, getTtsLang(lang)); }}
                      className="text-2xl mb-4 active:scale-110 transition-transform"
                    ><Volume2 size={20} /></button>
                    <p className="text-base text-slate-500">What sound is this? Tap to reveal</p>
                  </>
                ) : (
                  <>
                    <p className="text-5xl font-bold text-slate-50 mb-2">{currentKana.char}</p>
                    <p className="text-2xl text-indigo-300 font-semibold mb-1">{currentKana.rom}</p>
                    {currentKana.altChar && (
                      <p className="text-base text-slate-400 mb-3">
                        {deck.value === 'hiragana' ? 'Katakana' : 'Hiragana'}: <span className="text-slate-200 text-lg">{currentKana.altChar}</span>
                      </p>
                    )}
                    {currentKana.vocab.length > 0 && (
                      <>
                        <div className="border-t border-slate-700 w-full my-3" />
                        <p className="text-sm text-slate-500 mb-2">Words with 「{currentKana.rom}」</p>
                        <div className="space-y-1.5 w-full">
                          {currentKana.vocab.slice(0, 3).map((v, i) => (
                            <button
                              key={i}
                              onClick={(e) => { e.stopPropagation(); speak(v.jp, getTtsLang(lang)); }}
                              className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-700/40 active:bg-slate-600/50 transition text-left"
                            >
                              <span className="text-base text-slate-100">{v.jp}</span>
                              <span className="text-sm text-slate-400">{v.en}</span>
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); speak(currentKana.char, getTtsLang(lang)); }}
                      className="text-xl mt-3 active:scale-110 transition-transform"
                    ><Volume2 size={20} /></button>
                  </>
                )}
              </div>

              <div className="flex gap-4 mt-4">
                <button onClick={handlePrev} className="text-slate-400 px-4 py-2 rounded-xl bg-slate-800 active:bg-slate-700 text-base" disabled={currentIndex === 0}>← Prev</button>
                <button onClick={handleNext} className="text-slate-400 px-4 py-2 rounded-xl bg-slate-800 active:bg-slate-700 text-base">Next →</button>
              </div>
            </div>
          ) : !isKanaDeck && displayPhrases.length === 0 ? (
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
                    ><Volume2 size={20} /></button>
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
                      <p className="text-base text-amber-400 mt-2">{currentPhrase!.native_hint}</p>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); speak(currentPhrase!.target, getTtsLang(currentPhrase!.lang)); }}
                      className="text-xl mt-3 active:scale-110 transition-transform"
                    ><Volume2 size={20} /></button>
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
