import { useState, useEffect, useRef, useMemo } from 'react';
import { Target, Trophy, RefreshCw, X, Type } from 'lucide-react';
import { speak, getTtsLang } from '../utils/tts';
import { useSlidePanel } from '../utils/useSlidePanel';
import { HIRAGANA_VOCAB_CARDS, KATAKANA_VOCAB_CARDS } from '../data/kana-data';
import type { KanaVocabCard } from '../data/kana-data';
import { phrases } from '../data/phrases';

type MatchCategory = 'vocab-h' | 'vocab-k' | 'mixed' | 'phrases' | 'vocab-words' | 'vocab-actions' | 'vocab-time' | 'vocab-world' | 'vocab-people' | 'phrases-power' | 'phrases-travel' | 'phrases-food' | 'patterns' | 'counters' | 'signs' | 'particles';

const PAIR_COUNT = 6; // 6 pairs per round

// Build phrase vocab cards by situation groups
const buildPhraseCards = (lang: string, situations: string[]): KanaVocabCard[] => phrases
  .filter(p => p.lang === lang && p.category === 'vocab' && situations.includes(p.situation))
  .map(p => ({ jp: p.target, hep: p.pronunciation_chunks || p.pronunciation, en: p.english, kanaKey: p.pronunciation.slice(0, 2) }));

const buildCategoryCards = (lang: string, categories: string[]): KanaVocabCard[] => phrases
  .filter(p => p.lang === lang && categories.includes(p.category))
  .map(p => ({ jp: p.target, hep: p.pronunciation_chunks || p.pronunciation, en: p.english, kanaKey: p.pronunciation.slice(0, 2) }));

const VOCAB_WORDS_CARDS = buildPhraseCards('ja', ['Basic nouns', 'Pointing words', 'Colors']);
const VOCAB_ACTIONS_CARDS = buildPhraseCards('ja', ['Basic verbs', 'Daily actions']);
const VOCAB_TIME_CARDS = buildPhraseCards('ja', ['Numbers', 'Time', 'Meals', 'Days of the week']);
const VOCAB_WORLD_CARDS = buildPhraseCards('ja', ['Basic places', 'Directions']);
const VOCAB_PEOPLE_CARDS = buildPhraseCards('ja', ['People & Family', 'Body & Health', 'Basic adjectives']);
const PHRASES_POWER_CARDS = buildCategoryCards('ja', ['power']);
const PHRASES_TRAVEL_CARDS = buildCategoryCards('ja', ['airport', 'directions', 'hotel']);
const PHRASES_FOOD_CARDS = buildCategoryCards('ja', ['restaurant', 'food', 'drinks']);
const PHRASE_VOCAB_CARDS = buildCategoryCards('ja', ['vocab']);

// Sentence patterns for match
const PATTERNS_CARDS: KanaVocabCard[] = [
  { jp: '○○をお願いします', hep: 'wo o·ne·gai·shi·ma·su', en: '○○ please', kanaKey: 'wo' },
  { jp: '○○てください', hep: 'te ku·da·sai', en: 'Please do ○○', kanaKey: 'te' },
  { jp: '○○はありますか', hep: 'wa a·ri·ma·su ka', en: 'Do you have ○○?', kanaKey: 'wa' },
  { jp: '○○はどこですか', hep: 'wa do·ko de·su ka', en: 'Where is ○○?', kanaKey: 'wa' },
  { jp: '○○してもいいですか', hep: 'shi·te mo ii de·su ka', en: 'May I ○○?', kanaKey: 'sh' },
  { jp: '○○たいです', hep: 'tai de·su', en: 'I want to ○○', kanaKey: 'ta' },
  { jp: '○○がわかりません', hep: 'ga wa·ka·ri·ma·sen', en: "I don't understand ○○", kanaKey: 'ga' },
  { jp: '〜てもらえますか', hep: 'te mo·ra·e·ma·su ka', en: 'Could you ○○ for me?', kanaKey: 'te' },
  { jp: '〜ほうがいい', hep: 'hou ga ii', en: 'Should / Better to ○○', kanaKey: 'ho' },
  { jp: '〜と思います', hep: 'to o·mo·i·ma·su', en: 'I think ○○', kanaKey: 'to' },
  { jp: '〜かもしれません', hep: 'ka·mo shi·re·ma·sen', en: 'Maybe / Might ○○', kanaKey: 'ka' },
  { jp: '〜たことがあります', hep: 'ta ko·to ga a·ri·ma·su', en: 'I have experienced ○○', kanaKey: 'ta' },
  { jp: '〜なければなりません', hep: 'na·ke·re·ba na·ri·ma·sen', en: 'Must / Have to ○○', kanaKey: 'na' },
  { jp: 'AもBも', hep: 'A mo B mo', en: 'Both A and B', kanaKey: 'mo' },
  { jp: '〜ことにしました', hep: 'ko·to ni shi·ma·shi·ta', en: 'I decided to ○○', kanaKey: 'ko' },
  { jp: '〜ようにしています', hep: 'you ni shi·te i·ma·su', en: 'I make a point to ○○', kanaKey: 'yo' },
  { jp: '〜わけではない', hep: 'wa·ke de wa nai', en: "It's not that ○○", kanaKey: 'wa' },
  { jp: '〜ば〜ほど', hep: 'ba ... ho·do', en: 'The more ○○, the more ○○', kanaKey: 'ba' },
  { jp: '〜にとって', hep: 'ni tot·te', en: "For ○○ / From ○○'s perspective", kanaKey: 'ni' },
];

const COUNTERS_CARDS: KanaVocabCard[] = [
  { jp: '〜つ', hep: '-tsu', en: 'General counter (1-10)', kanaKey: 'ts' },
  { jp: '〜人', hep: '-nin', en: 'People', kanaKey: 'ni' },
  { jp: '〜枚', hep: '-mai', en: 'Flat objects (tickets, shirts)', kanaKey: 'ma' },
  { jp: '〜本', hep: '-hon', en: 'Long objects (bottles, pens)', kanaKey: 'ho' },
  { jp: '〜杯', hep: '-hai', en: 'Cups / glasses / bowls', kanaKey: 'ha' },
  { jp: '〜個', hep: '-ko', en: 'Small round objects', kanaKey: 'ko' },
  { jp: '〜台', hep: '-dai', en: 'Machines / vehicles', kanaKey: 'da' },
  { jp: '〜泊', hep: '-haku', en: 'Nights (hotel stay)', kanaKey: 'ha' },
  { jp: '〜名', hep: '-mei', en: 'People (formal)', kanaKey: 'me' },
  { jp: '〜階', hep: '-kai', en: 'Floors / stories', kanaKey: 'ka' },
];

const SIGNS_CARDS: KanaVocabCard[] = [
  { jp: '入口', hep: 'i·ri·gu·chi', en: 'Entrance', kanaKey: 'ir' },
  { jp: '出口', hep: 'de·gu·chi', en: 'Exit', kanaKey: 'de' },
  { jp: '禁煙', hep: 'kin·en', en: 'No smoking', kanaKey: 'ki' },
  { jp: '営業中', hep: 'ei·gyou·chuu', en: 'Open (for business)', kanaKey: 'ei' },
  { jp: '準備中', hep: 'jun·bi·chuu', en: 'Preparing / Closed', kanaKey: 'ju' },
  { jp: 'お手洗い', hep: 'o·te·a·rai', en: 'Toilet / Restroom', kanaKey: 'ot' },
  { jp: '非常口', hep: 'hi·jou·gu·chi', en: 'Emergency exit', kanaKey: 'hi' },
  { jp: '立入禁止', hep: 'ta·chi·i·ri kin·shi', en: 'No entry', kanaKey: 'ta' },
  { jp: '無料', hep: 'mu·ryou', en: 'Free (no charge)', kanaKey: 'mu' },
  { jp: '有料', hep: 'yuu·ryou', en: 'Paid / Fee required', kanaKey: 'yu' },
  { jp: '定休日', hep: 'tei·kyuu·bi', en: 'Regular holiday / Closed day', kanaKey: 'te' },
  { jp: '割引', hep: 'wa·ri·bi·ki', en: 'Discount', kanaKey: 'wa' },
  { jp: '売り切れ', hep: 'u·ri·ki·re', en: 'Sold out', kanaKey: 'ur' },
  { jp: '使用中', hep: 'shi·you·chuu', en: 'In use / Occupied', kanaKey: 'sh' },
  { jp: '空き', hep: 'a·ki', en: 'Vacant / Available', kanaKey: 'ak' },
];

const PARTICLES_CARDS: KanaVocabCard[] = [
  { jp: 'は', hep: 'wa', en: 'Topic marker (about)', kanaKey: 'wa' },
  { jp: 'が', hep: 'ga', en: 'Subject marker (who/what does it)', kanaKey: 'ga' },
  { jp: 'を', hep: 'wo', en: 'Object marker (receives action)', kanaKey: 'wo' },
  { jp: 'に', hep: 'ni', en: 'Direction / time (to, at)', kanaKey: 'ni' },
  { jp: 'で', hep: 'de', en: 'Location of action / by means of', kanaKey: 'de' },
  { jp: 'へ', hep: 'e', en: 'Towards (direction)', kanaKey: 'he' },
  { jp: 'の', hep: 'no', en: "Possessive / connecting ('s, of)", kanaKey: 'no' },
  { jp: 'と', hep: 'to', en: 'And, with (listing/companion)', kanaKey: 'to' },
  { jp: 'も', hep: 'mo', en: 'Also, too', kanaKey: 'mo' },
  { jp: 'か', hep: 'ka', en: 'Question marker', kanaKey: 'ka' },
  { jp: 'から', hep: 'ka·ra', en: 'From (place/time)', kanaKey: 'ka' },
  { jp: 'まで', hep: 'ma·de', en: 'Until, to (endpoint)', kanaKey: 'ma' },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getBestTime(cat: MatchCategory): number | null {
  try {
    const v = localStorage.getItem(`match_best_${cat}`);
    return v ? parseInt(v, 10) : null;
  } catch { return null; }
}

function saveBestTime(cat: MatchCategory, ms: number) {
  const prev = getBestTime(cat);
  if (!prev || ms < prev) localStorage.setItem(`match_best_${cat}`, String(ms));
}

interface MatchPair {
  id: number;
  jp: string;
  en: string;
  hep: string;
}

export function MatchGame({ lang = 'ja' }: { lang?: string }) {
  const panel = useSlidePanel<MatchCategory>();

  // Rebuild card pools when lang changes
  const langCards = useMemo(() => ({
    'vocab-words': buildPhraseCards(lang, ['Basic nouns', 'Pointing words', 'Colors']),
    'vocab-actions': buildPhraseCards(lang, ['Basic verbs', 'Daily actions']),
    'vocab-time': buildPhraseCards(lang, ['Numbers', 'Time', 'Meals', 'Days of the week']),
    'vocab-world': buildPhraseCards(lang, ['Basic places', 'Directions']),
    'vocab-people': buildPhraseCards(lang, ['People & Family', 'Body & Health', 'Basic adjectives']),
    'phrases-power': buildCategoryCards(lang, ['power']),
    'phrases-travel': buildCategoryCards(lang, ['airport', 'directions', 'hotel']),
    'phrases-food': buildCategoryCards(lang, ['restaurant', 'food', 'drinks']),
    'phrases': buildCategoryCards(lang, ['vocab']),
    'all-phrases': buildCategoryCards(lang, ['greetings', 'basics', 'airport', 'hotel', 'restaurant', 'food', 'drinks', 'shopping', 'directions', 'emergency', 'smalltalk', 'power']),
  }), [lang]);

  // Game state
  const [pairs, setPairs] = useState<MatchPair[]>([]);
  const [leftItems, setLeftItems] = useState<{ id: number; jp: string }[]>([]);
  const [rightItems, setRightItems] = useState<{ id: number; en: string }[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [wrong, setWrong] = useState<[number, number] | null>(null);
  const [startTime, setStartTime] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [finished, setFinished] = useState(false);
  const [round, setRound] = useState(1);
  const [totalTime, setTotalTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startGame = (cat: MatchCategory) => {
    panel.open(cat);
    setRound(1);
    setTotalTime(0);
    startRound(cat);
  };

  const startRound = (cat?: MatchCategory) => {
    const category = cat || panel.value;
    let pool: KanaVocabCard[];
    const poolMap: Record<string, KanaVocabCard[]> = {
      'vocab-h': HIRAGANA_VOCAB_CARDS,
      'vocab-k': KATAKANA_VOCAB_CARDS,
      'mixed': [...HIRAGANA_VOCAB_CARDS, ...KATAKANA_VOCAB_CARDS],
      'phrases': langCards['phrases'],
      'vocab-words': langCards['vocab-words'],
      'vocab-actions': langCards['vocab-actions'],
      'vocab-time': langCards['vocab-time'],
      'vocab-world': langCards['vocab-world'],
      'vocab-people': langCards['vocab-people'],
      'phrases-power': langCards['phrases-power'],
      'phrases-travel': langCards['phrases-travel'],
      'phrases-food': langCards['phrases-food'],
      'patterns': PATTERNS_CARDS,
      'counters': COUNTERS_CARDS,
      'signs': SIGNS_CARDS,
      'particles': PARTICLES_CARDS,
    };
    pool = poolMap[category || 'mixed'] || langCards['all-phrases'];

    const selected = shuffle(pool).slice(0, PAIR_COUNT);
    const newPairs = selected.map((v, i) => ({ id: i, jp: v.jp, en: v.en, hep: v.hep }));
    setPairs(newPairs);
    setLeftItems(shuffle(newPairs.map(p => ({ id: p.id, jp: p.jp }))));
    setRightItems(shuffle(newPairs.map(p => ({ id: p.id, en: p.en }))));
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatched(new Set());
    setWrong(null);
    setFinished(false);
    setStartTime(Date.now());
    setElapsed(0);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setElapsed(Date.now() - Date.now()); // will be overwritten
    }, 100);
    // Use a fresh reference for the timer
    const start = Date.now();
    timerRef.current = setInterval(() => {
      setElapsed(Date.now() - start);
    }, 100);
  };

  // Check match when both sides selected
  useEffect(() => {
    if (selectedLeft === null || selectedRight === null) return;

    if (selectedLeft === selectedRight) {
      // Correct match
      const newMatched = new Set(matched);
      newMatched.add(selectedLeft);
      setMatched(newMatched);
      speak(pairs.find(p => p.id === selectedLeft)?.jp || '', getTtsLang(lang));
      setSelectedLeft(null);
      setSelectedRight(null);

      // Check if all matched
      if (newMatched.size === PAIR_COUNT) {
        if (timerRef.current) clearInterval(timerRef.current);
        const roundTime = Date.now() - startTime;
        const newTotal = totalTime + roundTime;
        setTotalTime(newTotal);
        if (round >= 3) {
          setFinished(true);
          if (panel.value) saveBestTime(panel.value, newTotal);
        } else {
          // Auto-advance to next round after brief pause
          setTimeout(() => {
            setRound(r => r + 1);
            startRound();
          }, 800);
        }
      }
    } else {
      // Wrong match
      setWrong([selectedLeft, selectedRight]);
      setTimeout(() => {
        setWrong(null);
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 600);
    }
  }, [selectedLeft, selectedRight]);

  // Cleanup
  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const exitGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    panel.close();
  };

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const ds = Math.floor((ms % 1000) / 100);
    return `${s}.${ds}s`;
  };

  return (
    <div className="h-full relative">
      {/* Landing */}
      <div className="scroll-area h-full">
        <div className="px-4 py-3 border-b border-slate-800">
          <h2 className="text-lg font-bold">Match Game</h2>
          <p className="text-base text-slate-400">Match pairs as fast as you can!</p>
        </div>

        <div className="p-4 space-y-4">
          <div className="bg-slate-800/40 rounded-xl p-3">
            <p className="text-sm text-slate-400 flex items-center gap-1"><Target size={14} /> {PAIR_COUNT} pairs × 3 rounds · Match all pairs to finish</p>
            <p className="text-sm text-slate-500 mt-1">Tap one word, then tap its English meaning. Speed counts!</p>
          </div>

          <div>
            <p className="text-sm text-slate-500 mb-2">Vocabulary</p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => startGame('vocab-words')} className="bg-purple-900/30 border border-purple-700/30 rounded-xl p-4 text-left active:bg-purple-800/40 transition flex flex-col gap-1">
                <span className="text-2xl">📦</span>
                <span className="text-base font-semibold text-slate-100">Words</span>
                <span className="text-sm text-slate-500">{langCards["vocab-words"].length} words</span>
                {getBestTime('vocab-words') && <span className="text-xs text-amber-400"><Trophy size={12} className="inline-block mr-0.5" /> {formatTime(getBestTime('vocab-words')!)}</span>}
              </button>
              <button onClick={() => startGame('vocab-actions')} className="bg-purple-900/30 border border-purple-700/30 rounded-xl p-4 text-left active:bg-purple-800/40 transition flex flex-col gap-1">
                <span className="text-2xl">🎯</span>
                <span className="text-base font-semibold text-slate-100">Actions</span>
                <span className="text-sm text-slate-500">{langCards["vocab-actions"].length} words</span>
                {getBestTime('vocab-actions') && <span className="text-xs text-amber-400"><Trophy size={12} className="inline-block mr-0.5" /> {formatTime(getBestTime('vocab-actions')!)}</span>}
              </button>
              <button onClick={() => startGame('vocab-time')} className="bg-purple-900/30 border border-purple-700/30 rounded-xl p-4 text-left active:bg-purple-800/40 transition flex flex-col gap-1">
                <span className="text-2xl">🕐</span>
                <span className="text-base font-semibold text-slate-100">Time</span>
                <span className="text-sm text-slate-500">{langCards["vocab-time"].length} words</span>
                {getBestTime('vocab-time') && <span className="text-xs text-amber-400"><Trophy size={12} className="inline-block mr-0.5" /> {formatTime(getBestTime('vocab-time')!)}</span>}
              </button>
              <button onClick={() => startGame('vocab-world')} className="bg-purple-900/30 border border-purple-700/30 rounded-xl p-4 text-left active:bg-purple-800/40 transition flex flex-col gap-1">
                <span className="text-2xl">🌍</span>
                <span className="text-base font-semibold text-slate-100">World</span>
                <span className="text-sm text-slate-500">{langCards["vocab-world"].length} words</span>
                {getBestTime('vocab-world') && <span className="text-xs text-amber-400"><Trophy size={12} className="inline-block mr-0.5" /> {formatTime(getBestTime('vocab-world')!)}</span>}
              </button>
              <button onClick={() => startGame('vocab-people')} className="bg-purple-900/30 border border-purple-700/30 rounded-xl p-4 text-left active:bg-purple-800/40 transition flex flex-col gap-1">
                <span className="text-2xl">👥</span>
                <span className="text-base font-semibold text-slate-100">People</span>
                <span className="text-sm text-slate-500">{langCards["vocab-people"].length} words</span>
                {getBestTime('vocab-people') && <span className="text-xs text-amber-400"><Trophy size={12} className="inline-block mr-0.5" /> {formatTime(getBestTime('vocab-people')!)}</span>}
              </button>
            </div>
          </div>

          <div>
            <p className="text-sm text-slate-500 mb-2">Phrases</p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => startGame('phrases-power')} className="bg-emerald-900/30 border border-emerald-700/30 rounded-xl p-4 text-left active:bg-emerald-800/40 transition flex flex-col gap-1">
                <span className="text-2xl">⚡</span>
                <span className="text-base font-semibold text-slate-100">Power Phrases</span>
                <span className="text-sm text-slate-500">{langCards["phrases-power"].length} phrases</span>
                {getBestTime('phrases-power') && <span className="text-xs text-amber-400"><Trophy size={12} className="inline-block mr-0.5" /> {formatTime(getBestTime('phrases-power')!)}</span>}
              </button>
              <button onClick={() => startGame('phrases-travel')} className="bg-emerald-900/30 border border-emerald-700/30 rounded-xl p-4 text-left active:bg-emerald-800/40 transition flex flex-col gap-1">
                <span className="text-2xl">✈️</span>
                <span className="text-base font-semibold text-slate-100">Travel</span>
                <span className="text-sm text-slate-500">{langCards["phrases-travel"].length} phrases</span>
                {getBestTime('phrases-travel') && <span className="text-xs text-amber-400"><Trophy size={12} className="inline-block mr-0.5" /> {formatTime(getBestTime('phrases-travel')!)}</span>}
              </button>
              <button onClick={() => startGame('phrases-food')} className="bg-emerald-900/30 border border-emerald-700/30 rounded-xl p-4 text-left active:bg-emerald-800/40 transition flex flex-col gap-1">
                <span className="text-2xl">🍜</span>
                <span className="text-base font-semibold text-slate-100">Food</span>
                <span className="text-sm text-slate-500">{langCards["phrases-food"].length} phrases</span>
                {getBestTime('phrases-food') && <span className="text-xs text-amber-400"><Trophy size={12} className="inline-block mr-0.5" /> {formatTime(getBestTime('phrases-food')!)}</span>}
              </button>
              {lang === 'ja' && (<>
              <button onClick={() => startGame('patterns')} className="bg-emerald-900/30 border border-emerald-700/30 rounded-xl p-4 text-left active:bg-emerald-800/40 transition flex flex-col gap-1">
                <span className="text-2xl">📐</span>
                <span className="text-base font-semibold text-slate-100">Patterns</span>
                <span className="text-sm text-slate-500">{PATTERNS_CARDS.length} patterns</span>
                {getBestTime('patterns') && <span className="text-xs text-amber-400"><Trophy size={12} className="inline-block mr-0.5" /> {formatTime(getBestTime('patterns')!)}</span>}
              </button>
              <button onClick={() => startGame('counters')} className="bg-emerald-900/30 border border-emerald-700/30 rounded-xl p-4 text-left active:bg-emerald-800/40 transition flex flex-col gap-1">
                <span className="text-2xl">📏</span>
                <span className="text-base font-semibold text-slate-100">Counters</span>
                <span className="text-sm text-slate-500">{COUNTERS_CARDS.length} counters</span>
                {getBestTime('counters') && <span className="text-xs text-amber-400"><Trophy size={12} className="inline-block mr-0.5" /> {formatTime(getBestTime('counters')!)}</span>}
              </button>
              <button onClick={() => startGame('signs')} className="bg-emerald-900/30 border border-emerald-700/30 rounded-xl p-4 text-left active:bg-emerald-800/40 transition flex flex-col gap-1">
                <span className="text-2xl">🪧</span>
                <span className="text-base font-semibold text-slate-100">Signs</span>
                <span className="text-sm text-slate-500">{SIGNS_CARDS.length} signs</span>
                {getBestTime('signs') && <span className="text-xs text-amber-400"><Trophy size={12} className="inline-block mr-0.5" /> {formatTime(getBestTime('signs')!)}</span>}
              </button>
              <button onClick={() => startGame('particles')} className="bg-emerald-900/30 border border-emerald-700/30 rounded-xl p-4 text-left active:bg-emerald-800/40 transition flex flex-col gap-1">
                <span className="text-2xl">🔤</span>
                <span className="text-base font-semibold text-slate-100">Particles</span>
                <span className="text-sm text-slate-500">{PARTICLES_CARDS.length} particles</span>
                {getBestTime('particles') && <span className="text-xs text-amber-400"><Trophy size={12} className="inline-block mr-0.5" /> {formatTime(getBestTime('particles')!)}</span>}
              </button>
              </>)}
            </div>
          </div>
        </div>
      </div>

      {/* Game Panel */}
      {panel.visible && (
        <div className={`absolute inset-0 bg-slate-950 ${panel.animClass} flex flex-col z-40`}>
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div>
              <button onClick={exitGame} className="text-base text-slate-400 active:text-slate-200 p-1">←</button>
              {!finished && (
                <p className="text-base text-slate-400">
                  Round {round}/3 · {formatTime(elapsed)}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-emerald-400">{matched.size}/{PAIR_COUNT}</span>
              {!finished && (
                <button onClick={exitGame} className="text-sm px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 active:bg-slate-700"><X size={20} /></button>
              )}
            </div>
          </div>

          {!finished ? (
            <div className="flex-1 flex flex-col px-4 py-3 overflow-y-auto">
              {/* Two columns */}
              <div className="flex gap-2 flex-1">
                {/* Left: Japanese */}
                <div className="flex-1 space-y-2">
                  {leftItems.map(item => {
                    const isMatched = matched.has(item.id);
                    const isSelected = selectedLeft === item.id;
                    const isWrong = wrong && wrong[0] === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => { if (!isMatched) setSelectedLeft(item.id); }}
                        disabled={isMatched}
                        className={`w-full py-3 px-3 rounded-xl text-base text-center transition ${
                          isMatched ? 'bg-emerald-900/30 text-emerald-400/50 line-through' :
                          isWrong ? 'bg-red-600/40 text-red-200 ring-2 ring-red-500' :
                          isSelected ? 'bg-sakura-500/50 text-white ring-2 ring-sakura-400' :
                          'bg-slate-800 text-slate-100 active:bg-slate-700'
                        }`}
                      >
                        {item.jp}
                      </button>
                    );
                  })}
                </div>

                {/* Right: English */}
                <div className="flex-1 space-y-2">
                  {rightItems.map(item => {
                    const isMatched = matched.has(item.id);
                    const isSelected = selectedRight === item.id;
                    const isWrong = wrong && wrong[1] === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => { if (!isMatched) setSelectedRight(item.id); }}
                        disabled={isMatched}
                        className={`w-full py-3 px-3 rounded-xl text-sm text-center transition ${
                          isMatched ? 'bg-emerald-900/30 text-emerald-400/50 line-through' :
                          isWrong ? 'bg-red-600/40 text-red-200 ring-2 ring-red-500' :
                          isSelected ? 'bg-sakura-500/50 text-white ring-2 ring-sakura-400' :
                          'bg-slate-800 text-slate-100 active:bg-slate-700'
                        }`}
                      >
                        {item.en}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* End Screen */
            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
              <p className="text-5xl mb-4">🎉</p>
              <p className="text-3xl font-bold text-slate-100 mb-2">{formatTime(totalTime)}</p>
              <p className="text-lg text-slate-400 mb-1">3 rounds completed!</p>
              {panel.value && getBestTime(panel.value) && (
                <p className="text-base text-amber-400 mb-4 flex items-center justify-center gap-1"><Trophy size={16} /> Best: {formatTime(getBestTime(panel.value)!)}</p>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => { setRound(1); setTotalTime(0); startRound(); }}
                  className="px-5 py-2.5 rounded-xl bg-amber-900/50 text-amber-300 active:bg-amber-800/60 text-base"
                ><RefreshCw size={14} className="inline-block mr-1" /> Play Again</button>
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
