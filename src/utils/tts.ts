import { LANGUAGES } from '../data/types';

const RATE_KEY = 'tts-rate';
let activeUtterance: SpeechSynthesisUtterance | null = null;

export function getTtsRate(): number {
  const stored = localStorage.getItem(RATE_KEY);
  return stored ? parseFloat(stored) : 0.7;
}

export function setTtsRate(rate: number): void {
  localStorage.setItem(RATE_KEY, String(rate));
}

export function speak(text: string, lang = 'ja-JP'): void {
  if (!('speechSynthesis' in window)) {
    console.error('Text-to-speech is not supported by this browser.');
    return;
  }

  const synth = window.speechSynthesis;
  if (synth.speaking || synth.pending) synth.cancel();

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

  // Keep the utterance alive until Safari finishes delivering its events.
  activeUtterance = utterance;
  const release = () => {
    if (activeUtterance === utterance) activeUtterance = null;
  };
  utterance.onend = release;
  utterance.onerror = (event) => {
    release();
    if (event.error !== 'canceled' && event.error !== 'interrupted') {
      console.error(`Text-to-speech failed (${lang}): ${event.error}`);
    }
  };

  // Start in the tap handler's call stack so iOS can authorize playback.
  synth.speak(utterance);
  if (synth.paused) synth.resume();
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
