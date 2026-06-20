import { LANGUAGES } from '../data/types';

const RATE_KEY = 'tts-rate';

export function getTtsRate(): number {
  const stored = localStorage.getItem(RATE_KEY);
  return stored ? parseFloat(stored) : 0.7;
}

export function setTtsRate(rate: number): void {
  localStorage.setItem(RATE_KEY, String(rate));
}

export function speak(text: string, lang = 'ja-JP'): void {
  if (!('speechSynthesis' in window)) return;

  // iOS fix: cancel can leave synth in a broken state, resume first
  const synth = window.speechSynthesis;
  synth.cancel();
  // iOS requires a resume after cancel to unstick the queue
  synth.resume();

  // For single kana characters, extend with vowel mark for clarity
  let speakText = text;
  if (text.length === 1 && lang === 'ja-JP') {
    speakText = text + 'ー'; // makes "あ" → "あー" (longer, clearer)
  }

  const utterance = new SpeechSynthesisUtterance(speakText);
  utterance.lang = lang;
  // Use normal rate for single characters (slow rate warps short sounds)
  utterance.rate = text.length <= 2 ? Math.max(getTtsRate(), 0.85) : getTtsRate();
  utterance.pitch = 1;

  // Try to find a matching voice
  const voices = synth.getVoices();
  const langPrefix = lang.split('-')[0];
  const voice = voices.find(v => v.lang.startsWith(langPrefix));
  if (voice) utterance.voice = voice;

  // iOS workaround: small delay before speaking after cancel
  setTimeout(() => {
    synth.speak(utterance);
  }, 10);
}

/** Get TTS language code from phrase lang code */
export function getTtsLang(langCode: string): string {
  return LANGUAGES.find(l => l.code === langCode)?.ttsLang || 'ja-JP';
}

// Pre-load voices (needed on some browsers)
if ('speechSynthesis' in window) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}
