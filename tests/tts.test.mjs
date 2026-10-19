import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

function loadTts({ voices = [], supported = true, audioSession } = {}) {
  const calls = [];
  const errors = [];
  const storage = new Map();
  const synth = {
    speaking: false,
    pending: false,
    paused: false,
    getVoices: () => voices,
    cancel: () => calls.push('cancel'),
    resume: () => calls.push('resume'),
    speak: utterance => calls.push(utterance),
  };
  const context = {
    window: supported ? { speechSynthesis: synth } : {},
    navigator: audioSession === undefined ? {} : { audioSession },
    SpeechSynthesisUtterance: class {
      constructor(text) { this.text = text; }
    },
    localStorage: {
      getItem: key => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
    },
    console: { error: message => errors.push(message) },
    setTimeout: () => { assert.fail('Speech startup must not use a timer'); },
  };
  const compile = path => ts.transpileModule(
    readFileSync(new URL(path, import.meta.url), 'utf8'),
    { compilerOptions: { module: ts.ModuleKind.CommonJS } },
  ).outputText;
  const languages = {};
  runInNewContext(compile('../src/data/types.ts'), { exports: languages });
  const api = {};
  runInNewContext(compile('../src/utils/tts.ts'), {
    ...context,
    exports: api,
    require: id => {
      assert.equal(id, '../data/types');
      return languages;
    },
  });
  return { api, synth, calls, errors };
}

test('starts speech synchronously without resetting an idle queue', () => {
  const { api, calls } = loadTts();
  api.speak('こんにちは');
  assert.equal(calls.length, 1);
  assert.equal(calls[0].text, 'こんにちは');
  assert.equal(calls[0].lang, 'ja-JP');
  assert.equal(calls[0].rate, 0.7);
  assert.equal(calls[0].pitch, 1);
});

test('rapid taps replace active or pending speech immediately', () => {
  for (const state of ['speaking', 'pending']) {
    const { api, synth, calls } = loadTts();
    api.speak('first', 'en-US');
    const previous = calls[0];
    synth[state] = true;
    api.speak('second', 'en-US');
    assert.equal(calls[1], 'cancel');
    assert.equal(calls[2].text, 'second');
    previous.onerror({ error: 'interrupted' });
    calls[2].onend();
  }
});

test('resumes a paused synthesizer after enqueueing speech', () => {
  const { api, synth, calls } = loadTts();
  synth.paused = true;
  api.speak('bonjour', 'fr-FR');
  assert.equal(calls[0].text, 'bonjour');
  assert.equal(calls[1], 'resume');
});

test('supports empty initial voice lists and voices loaded later', () => {
  const voices = [];
  const { api, calls } = loadTts({ voices });
  api.speak('hola', 'es-ES');
  assert.equal(calls[0].voice, undefined);
  const voice = { lang: 'es-ES' };
  voices.push(voice);
  api.speak('hola', 'es-ES');
  assert.equal(calls[1].voice, voice);
});

test('preserves speed settings, kana pronunciation and language mapping', () => {
  const { api, calls } = loadTts();
  api.setTtsRate(0.5);
  assert.equal(api.getTtsRate(), 0.5);
  api.speak('あ');
  api.speak('こんにちは');
  api.speak('a', 'fr-FR');
  assert.equal(calls[0].text, 'あー');
  assert.equal(calls[0].rate, 0.85);
  assert.equal(calls[1].rate, 0.5);
  assert.equal(calls[2].text, 'a');
  assert.equal(api.getTtsLang('fr'), 'fr-FR');
  assert.equal(api.getTtsLang('es'), 'es-ES');
  assert.equal(api.getTtsLang('ja'), 'ja-JP');
});

test('reports playback failures but not expected interruptions', () => {
  const { api, calls, errors } = loadTts();
  api.speak('こんにちは');
  calls[0].onerror({ error: 'not-allowed' });
  calls[0].onerror({ error: 'interrupted' });
  calls[0].onerror({ error: 'canceled' });
  assert.deepEqual(errors, ['Text-to-speech failed (ja-JP): not-allowed']);
});

test('reports unsupported browsers instead of silently ignoring taps', () => {
  const { api, calls, errors } = loadTts({ supported: false });
  api.speak('こんにちは');
  assert.equal(calls.length, 0);
  assert.deepEqual(errors, ['Text-to-speech is not supported by this browser.']);
});

test('requests playback before speaking without changing the session on load', () => {
  let type = 'auto';
  const audioSession = {
    get type() { return type; },
    set type(value) { type = value; },
  };
  const { api, synth, calls } = loadTts({ audioSession });
  assert.equal(type, 'auto');
  synth.speak = utterance => {
    assert.equal(type, 'playback');
    calls.push(utterance);
  };
  api.speak('こんにちは');
  assert.equal(calls.length, 1);
});

test('conversation playback can request the same audio session independently', () => {
  const audioSession = { type: 'auto' };
  const { api, calls } = loadTts({ audioSession });
  api.prepareSpeechPlayback();
  assert.equal(audioSession.type, 'playback');
  assert.equal(calls.length, 0);
});

test('logs rejected audio session changes and still attempts speech', () => {
  const audioSession = {
    get type() { return 'auto'; },
    set type(value) {
      assert.equal(value, 'playback');
      throw new Error('Audio session unavailable');
    },
  };
  const { api, calls, errors } = loadTts({ audioSession });
  api.speak('こんにちは');
  assert.equal(calls.length, 1);
  assert.deepEqual(errors, ['Could not configure speech for playback in Silent Mode.']);
});

test('unavailable audio sessions preserve normal speech playback', () => {
  for (const audioSession of [undefined, null]) {
    const { api, calls, errors } = loadTts({ audioSession });
    api.speak('こんにちは');
    assert.equal(calls.length, 1);
    assert.equal(errors.length, 0);
  }
});
