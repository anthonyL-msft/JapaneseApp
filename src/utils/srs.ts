import type { SRSCard } from '../data/types';

// SM-2 Spaced Repetition Algorithm
// Quality: 0 = complete blackout, 5 = perfect response
export function reviewCard(card: SRSCard, quality: number): SRSCard {
  const q = Math.max(0, Math.min(5, quality));

  let { easeFactor, interval, repetitions } = card;

  if (q < 3) {
    // Failed — reset
    repetitions = 0;
    interval = 1;
  } else {
    // Success
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  }

  // Update ease factor
  easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  const now = Date.now();
  return {
    ...card,
    easeFactor,
    interval,
    repetitions,
    lastReview: now,
    nextReview: now + interval * 24 * 60 * 60 * 1000,
  };
}

export function createNewCard(phraseId: string): SRSCard {
  return {
    phraseId,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReview: 0,
    lastReview: 0,
  };
}

export function isDueForReview(card: SRSCard): boolean {
  return Date.now() >= card.nextReview;
}
