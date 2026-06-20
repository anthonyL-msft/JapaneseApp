import { useState, useEffect, useCallback } from 'react';
import type { Phrase } from '../data/types';
import { speak, getTtsLang } from '../utils/tts';

interface Props {
  phrases: Phrase[];
  learnedIds: Set<string>;
  onToggleLearned: (id: string) => void;
}

interface DailyState {
  date: string; // YYYY-MM-DD
  completed: boolean;
  learnedToday: string[]; // phrase IDs learned today
  reviewedToday: string[]; // phrase IDs reviewed today
}

interface StreakState {
  current: number;
  lastDate: string; // YYYY-MM-DD
  best: number;
}

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

function loadDaily(): DailyState {
  try {
    const raw = localStorage.getItem('daily_challenge');
    if (raw) {
      const state = JSON.parse(raw) as DailyState;
      if (state.date === getToday()) return state;
    }
  } catch {}
  return { date: getToday(), completed: false, learnedToday: [], reviewedToday: [] };
}

function saveDaily(state: DailyState) {
  localStorage.setItem('daily_challenge', JSON.stringify(state));
}

function loadStreak(): StreakState {
  try {
    const raw = localStorage.getItem('daily_streak');
    if (raw) return JSON.parse(raw);
  } catch {}
  return { current: 0, lastDate: '', best: 0 };
}

function saveStreak(state: StreakState) {
  localStorage.setItem('daily_streak', JSON.stringify(state));
}

function isYesterday(dateStr: string): boolean {
  const d = new Date(dateStr);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return d.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0];
}

const LEARN_TARGET = 3;
const REVIEW_TARGET = 5;

export function DailyChallenge({ phrases, learnedIds, onToggleLearned }: Props) {
  const [daily, setDaily] = useState<DailyState>(loadDaily);
  const [streak, setStreak] = useState<StreakState>(loadStreak);
  const [phase, setPhase] = useState<'overview' | 'learn' | 'review' | 'done'>('overview');
  const [learnQueue, setLearnQueue] = useState<Phrase[]>([]);
  const [reviewQueue, setReviewQueue] = useState<Phrase[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  // Compute progress
  const learnProgress = daily.learnedToday.length;
  const reviewProgress = daily.reviewedToday.length;
  const learnDone = learnProgress >= LEARN_TARGET;
  const reviewDone = reviewProgress >= REVIEW_TARGET;
  const allDone = daily.completed;

  // Build queues on mount
  useEffect(() => {
    // Learn queue: phrases NOT yet learned, shuffled, pick some
    const unlearned = phrases.filter(p => !learnedIds.has(p.id) && !daily.learnedToday.includes(p.id));
    const shuffled = [...unlearned].sort(() => Math.random() - 0.5);
    setLearnQueue(shuffled.slice(0, LEARN_TARGET - learnProgress));

    // Review queue: phrases already learned, shuffled
    const learned = phrases.filter(p => learnedIds.has(p.id) && !daily.reviewedToday.includes(p.id));
    const shuffledReview = [...learned].sort(() => Math.random() - 0.5);
    setReviewQueue(shuffledReview.slice(0, REVIEW_TARGET - reviewProgress));
  }, []);

  const markLearnComplete = useCallback(() => {
    const current = learnQueue[currentIndex];
    if (!current) return;
    onToggleLearned(current.id);
    const newDaily = { ...daily, learnedToday: [...daily.learnedToday, current.id] };

    if (currentIndex + 1 >= learnQueue.length || newDaily.learnedToday.length >= LEARN_TARGET) {
      // Learning phase complete
      setDaily(newDaily);
      saveDaily(newDaily);
      setPhase('overview');
      setCurrentIndex(0);
      setShowAnswer(false);
    } else {
      setDaily(newDaily);
      saveDaily(newDaily);
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
    }
  }, [currentIndex, learnQueue, daily, onToggleLearned]);

  const markReviewComplete = useCallback(() => {
    const current = reviewQueue[currentIndex];
    if (!current) return;
    const newDaily = { ...daily, reviewedToday: [...daily.reviewedToday, current.id] };

    if (currentIndex + 1 >= reviewQueue.length || newDaily.reviewedToday.length >= REVIEW_TARGET) {
      setDaily(newDaily);
      saveDaily(newDaily);
      setPhase('overview');
      setCurrentIndex(0);
      setShowAnswer(false);
    } else {
      setDaily(newDaily);
      saveDaily(newDaily);
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
    }
  }, [currentIndex, reviewQueue, daily]);

  const completeChallenge = useCallback(() => {
    const newDaily = { ...daily, completed: true };
    setDaily(newDaily);
    saveDaily(newDaily);

    // Update streak
    const today = getToday();
    let newStreak = { ...streak };
    if (streak.lastDate === today) {
      // Already counted today
    } else if (isYesterday(streak.lastDate)) {
      newStreak = { current: streak.current + 1, lastDate: today, best: Math.max(streak.best, streak.current + 1) };
    } else {
      newStreak = { current: 1, lastDate: today, best: Math.max(streak.best, 1) };
    }
    setStreak(newStreak);
    saveStreak(newStreak);
    setPhase('done');
  }, [daily, streak]);

  // Auto-complete when both targets met
  useEffect(() => {
    if (learnDone && reviewDone && !allDone) {
      completeChallenge();
    }
  }, [learnDone, reviewDone, allDone]);

  const currentLearn = learnQueue[currentIndex];
  const currentReview = reviewQueue[currentIndex];

  // Check if streak is still valid (didn't break)
  const streakValid = streak.lastDate === getToday() || isYesterday(streak.lastDate);
  const displayStreak = streakValid ? streak.current : 0;

  return (
    <div className="h-full scroll-area">
      {phase === 'overview' && (
        <div className="px-4 py-3">
          {/* Header */}
          <div className="border-b border-slate-800 pb-3 mb-4">
            <h2 className="text-lg font-bold">🎯 Daily Challenge</h2>
            <p className="text-base text-slate-400">A few minutes a day keeps the language growing!</p>
          </div>

          {/* Streak */}
          <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 border border-amber-700/30 rounded-xl p-4 mb-4 text-center">
            <p className="text-3xl font-bold text-amber-300">🔥 {allDone ? (displayStreak || streak.current) : displayStreak}</p>
            <p className="text-base text-amber-400/80">day streak</p>
            {streak.best > 1 && <p className="text-sm text-slate-500 mt-1">Best: {streak.best} days</p>}
          </div>

          {allDone ? (
            <div className="text-center py-8">
              <p className="text-4xl mb-3">✅</p>
              <p className="text-lg font-semibold text-slate-200">Today's challenge complete!</p>
              <p className="text-base text-slate-400 mt-1">Come back tomorrow to keep your streak</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Learn task */}
              <div className={`rounded-xl p-4 border ${learnDone ? 'bg-emerald-900/20 border-emerald-700/30' : 'bg-slate-800/60 border-slate-700/30'}`}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-base font-semibold text-slate-100">📖 Learn New Phrases</p>
                  <span className={`text-sm px-2 py-0.5 rounded-full ${learnDone ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                    {learnProgress}/{LEARN_TARGET}
                  </span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-sakura-500 rounded-full transition-all" style={{ width: `${(learnProgress / LEARN_TARGET) * 100}%` }} />
                </div>
                {!learnDone && (
                  <button
                    onClick={() => { setPhase('learn'); setCurrentIndex(0); setShowAnswer(false); }}
                    className="w-full py-2.5 rounded-lg bg-sakura-500/80 text-white text-base active:bg-sakura-600 transition mt-1"
                  >Start Learning</button>
                )}
              </div>

              {/* Review task */}
              <div className={`rounded-xl p-4 border ${reviewDone ? 'bg-emerald-900/20 border-emerald-700/30' : 'bg-slate-800/60 border-slate-700/30'}`}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-base font-semibold text-slate-100">🔄 Review Learned</p>
                  <span className={`text-sm px-2 py-0.5 rounded-full ${reviewDone ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                    {reviewProgress}/{REVIEW_TARGET}
                  </span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${(reviewProgress / REVIEW_TARGET) * 100}%` }} />
                </div>
                {!reviewDone && learnedIds.size > 0 && (
                  <button
                    onClick={() => { setPhase('review'); setCurrentIndex(0); setShowAnswer(false); }}
                    className="w-full py-2.5 rounded-lg bg-indigo-500/80 text-white text-base active:bg-indigo-600 transition mt-1"
                  >Start Review</button>
                )}
                {!reviewDone && learnedIds.size === 0 && (
                  <p className="text-sm text-slate-500 mt-1">Learn some phrases first!</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Learn Phase */}
      {phase === 'learn' && currentLearn && (
        <div className="flex flex-col h-full">
          <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <button onClick={() => setPhase('overview')} className="text-base text-slate-400 p-1">← Back</button>
            <p className="text-base text-slate-400">{currentIndex + 1} / {learnQueue.length}</p>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <div
              onClick={() => setShowAnswer(!showAnswer)}
              className="w-full max-w-sm bg-slate-800/80 rounded-2xl p-6 text-center cursor-pointer active:bg-slate-700/80 transition min-h-[280px] flex flex-col items-center justify-center"
            >
              {!showAnswer ? (
                <>
                  <p className="text-3xl font-bold text-slate-50 mb-3">{currentLearn.target}</p>
                  <p className="text-base text-sakura-300 mb-2">{currentLearn.pronunciation_chunks || currentLearn.pronunciation}</p>
                  <button onClick={(e) => { e.stopPropagation(); speak(currentLearn.target, getTtsLang(currentLearn.lang)); }} className="text-2xl mb-3 active:scale-110">🔊</button>
                  <p className="text-base text-slate-500">Tap to see meaning</p>
                </>
              ) : (
                <>
                  <p className="text-2xl font-bold text-slate-50 mb-2">{currentLearn.target}</p>
                  <p className="text-base text-sakura-300 mb-1">{currentLearn.pronunciation_chunks || currentLearn.pronunciation}</p>
                  <div className="border-t border-slate-700 w-full my-3" />
                  <p className="text-lg text-slate-200 mb-1">{currentLearn.english}</p>
                  {currentLearn.chinese_tc && <p className="text-base text-slate-400">{currentLearn.chinese_tc}</p>}
                  {currentLearn.notes && <p className="text-sm text-amber-400 mt-2">💡 {currentLearn.notes}</p>}
                  <button onClick={(e) => { e.stopPropagation(); speak(currentLearn.target, getTtsLang(currentLearn.lang)); }} className="text-xl mt-3 active:scale-110">🔊</button>
                </>
              )}
            </div>
            {showAnswer && (
              <button
                onClick={markLearnComplete}
                className="mt-4 px-6 py-3 rounded-xl bg-emerald-600/80 text-white text-base active:bg-emerald-700 transition"
              >✓ Got it — Mark Learned</button>
            )}
          </div>
        </div>
      )}

      {/* Review Phase */}
      {phase === 'review' && currentReview && (
        <div className="flex flex-col h-full">
          <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <button onClick={() => setPhase('overview')} className="text-base text-slate-400 p-1">← Back</button>
            <p className="text-base text-slate-400">{currentIndex + 1} / {reviewQueue.length}</p>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <div
              onClick={() => setShowAnswer(!showAnswer)}
              className="w-full max-w-sm bg-slate-800/80 rounded-2xl p-6 text-center cursor-pointer active:bg-slate-700/80 transition min-h-[280px] flex flex-col items-center justify-center"
            >
              {!showAnswer ? (
                <>
                  <p className="text-lg text-slate-200 mb-3">{currentReview.english}</p>
                  <p className="text-base text-slate-500">Can you say it in Japanese? Tap to check</p>
                </>
              ) : (
                <>
                  <p className="text-2xl font-bold text-slate-50 mb-2">{currentReview.target}</p>
                  <p className="text-base text-sakura-300 mb-1">{currentReview.pronunciation_chunks || currentReview.pronunciation}</p>
                  <div className="border-t border-slate-700 w-full my-3" />
                  <p className="text-base text-slate-200">{currentReview.english}</p>
                  {currentReview.chinese_tc && <p className="text-base text-slate-400">{currentReview.chinese_tc}</p>}
                  <button onClick={(e) => { e.stopPropagation(); speak(currentReview.target, getTtsLang(currentReview.lang)); }} className="text-xl mt-3 active:scale-110">🔊</button>
                </>
              )}
            </div>
            {showAnswer && (
              <div className="flex gap-3 mt-4">
                <button
                  onClick={markReviewComplete}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600/80 text-white text-base active:bg-emerald-700 transition"
                >✓ Remembered</button>
                <button
                  onClick={() => { setShowAnswer(false); }}
                  className="px-5 py-2.5 rounded-xl bg-slate-700 text-slate-300 text-base active:bg-slate-600 transition"
                >Try Again</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Done Phase */}
      {phase === 'done' && (
        <div className="flex flex-col items-center justify-center h-full px-6 text-center">
          <p className="text-5xl mb-4">🎉</p>
          <p className="text-2xl font-bold text-slate-100 mb-2">Challenge Complete!</p>
          <p className="text-lg text-amber-300 mb-1">🔥 {streak.current} day streak</p>
          <p className="text-base text-slate-400 mb-6">
            Learned {daily.learnedToday.length} new · Reviewed {daily.reviewedToday.length}
          </p>
          <button
            onClick={() => setPhase('overview')}
            className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-400 active:bg-slate-700 text-base"
          >← Back</button>
        </div>
      )}
    </div>
  );
}
