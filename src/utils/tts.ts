import { LANGUAGES } from '../data/types';

export function speak(text: string, lang = 'ja-JP'): void {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.85;
  utterance.pitch = 1;

  // Try to find a matching voice
  const voices = window.speechSynthesis.getVoices();
  const langPrefix = lang.split('-')[0];
  const voice = voices.find(v => v.lang.startsWith(langPrefix));
  if (voice) utterance.voice = voice;

  window.speechSynthesis.speak(utterance);
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
