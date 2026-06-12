import { useState, useCallback } from 'react';
import { speak } from '../utils/tts';

// === Pattern Templates ===
interface Pattern {
  id: string;
  group: 'request' | 'question' | 'want';
  template: string;
  templateRom: string;
  meaning: string;
  slotType: SlotType;
  slotLabel: string;
  build: (vocab: Vocab) => { jp: string; rom: string; en: string };
}

type SlotType = 'noun' | 'place' | 'food' | 'drink' | 'quantity' | 'action';

interface Vocab {
  jp: string;
  rom: string;
  en: string;
}

const PATTERNS: Pattern[] = [
  {
    id: 'onegai', group: 'request', template: '○○をお願いします', templateRom: '○○ wo o·ne·gai·shi·ma·su',
    meaning: '○○ please', slotType: 'noun', slotLabel: 'What do you want?',
    build: (v) => ({ jp: `${v.jp}をお願いします`, rom: `${v.rom} wo o·ne·gai·shi·ma·su`, en: `${v.en} please` }),
  },
  {
    id: 'doko', group: 'question', template: '○○はどこですか？', templateRom: '○○ wa do·ko de·su ka',
    meaning: 'Where is ○○?', slotType: 'place', slotLabel: 'What are you looking for?',
    build: (v) => ({ jp: `${v.jp}はどこですか？`, rom: `${v.rom} wa do·ko de·su ka`, en: `Where is ${v.en.toLowerCase()}?` }),
  },
  {
    id: 'arimasu', group: 'question', template: '○○はありますか？', templateRom: '○○ wa a·ri·ma·su ka',
    meaning: 'Do you have ○○?', slotType: 'noun', slotLabel: 'What are you asking for?',
    build: (v) => ({ jp: `${v.jp}はありますか？`, rom: `${v.rom} wa a·ri·ma·su ka`, en: `Do you have ${v.en.toLowerCase()}?` }),
  },
  {
    id: 'kudasai', group: 'request', template: '○○をください', templateRom: '○○ wo ku·da·sai',
    meaning: 'Give me ○○', slotType: 'noun', slotLabel: 'What do you want?',
    build: (v) => ({ jp: `${v.jp}をください`, rom: `${v.rom} wo ku·da·sai`, en: `${v.en} please (give me)` }),
  },
  {
    id: 'ikitai', group: 'want', template: '○○に行きたいです', templateRom: '○○ ni i·ki·tai de·su',
    meaning: 'I want to go to ○○', slotType: 'place', slotLabel: 'Where do you want to go?',
    build: (v) => ({ jp: `${v.jp}に行きたいです`, rom: `${v.rom} ni i·ki·tai de·su`, en: `I want to go to ${v.en.toLowerCase()}` }),
  },
  {
    id: 'hoshii', group: 'want', template: '○○がほしいです', templateRom: '○○ ga ho·shii de·su',
    meaning: 'I want ○○', slotType: 'noun', slotLabel: 'What do you want?',
    build: (v) => ({ jp: `${v.jp}がほしいです`, rom: `${v.rom} ga ho·shii de·su`, en: `I want ${v.en.toLowerCase()}` }),
  },
  {
    id: 'tabetai', group: 'want', template: '○○を食べたいです', templateRom: '○○ wo ta·be·tai de·su',
    meaning: 'I want to eat ○○', slotType: 'food', slotLabel: 'What do you want to eat?',
    build: (v) => ({ jp: `${v.jp}を食べたいです`, rom: `${v.rom} wo ta·be·tai de·su`, en: `I want to eat ${v.en.toLowerCase()}` }),
  },
  {
    id: 'nomitai', group: 'want', template: '○○を飲みたいです', templateRom: '○○ wo no·mi·tai de·su',
    meaning: 'I want to drink ○○', slotType: 'drink', slotLabel: 'What do you want to drink?',
    build: (v) => ({ jp: `${v.jp}を飲みたいです`, rom: `${v.rom} wo no·mi·tai de·su`, en: `I want to drink ${v.en.toLowerCase()}` }),
  },
  {
    id: 'ikura', group: 'question', template: '○○はいくらですか？', templateRom: '○○ wa i·ku·ra de·su ka',
    meaning: 'How much is ○○?', slotType: 'noun', slotLabel: 'What are you asking about?',
    build: (v) => ({ jp: `${v.jp}はいくらですか？`, rom: `${v.rom} wa i·ku·ra de·su ka`, en: `How much is ${v.en.toLowerCase()}?` }),
  },
  {
    id: 'temo', group: 'request', template: '○○してもいいですか？', templateRom: '○○ shi·te mo ii de·su ka',
    meaning: 'May I ○○? (permission)', slotType: 'action', slotLabel: 'What do you want to do?',
    build: (v) => ({ jp: `${v.jp}してもいいですか？`, rom: `${v.rom} shi·te mo ii de·su ka`, en: `May I ${v.en.toLowerCase()}?` }),
  },
  {
    id: 'dekimasu', group: 'question', template: '○○できますか？', templateRom: '○○ de·ki·ma·su ka',
    meaning: 'Can I ○○? (possible?)', slotType: 'action', slotLabel: 'What do you want to do?',
    build: (v) => ({ jp: `${v.jp}できますか？`, rom: `${v.rom} de·ki·ma·su ka`, en: `Can I ${v.en.toLowerCase()}?` }),
  },
  {
    id: 'count', group: 'request', template: '○○を△△お願いします', templateRom: '○○ wo △△ o·ne·gai·shi·ma·su',
    meaning: '△△ of ○○ please', slotType: 'food', slotLabel: 'What do you want?',
    build: (v) => ({ jp: `${v.jp}をお願いします`, rom: `${v.rom} wo o·ne·gai·shi·ma·su`, en: `${v.en} please` }),
  },
];

// === Vocab Banks ===
const VOCAB: Record<SlotType, Vocab[]> = {
  noun: [
    { jp: '水', rom: 'mi·zu', en: 'Water' },
    { jp: 'メニュー', rom: 'me·nyuu', en: 'Menu' },
    { jp: 'お会計', rom: 'o·kai·kei', en: 'The check' },
    { jp: '領収書', rom: 'ryou·shuu·sho', en: 'Receipt' },
    { jp: 'Wi-Fi', rom: 'wai·fai', en: 'Wi-Fi' },
    { jp: '英語のメニュー', rom: 'ei·go no me·nyuu', en: 'English menu' },
    { jp: '袋', rom: 'fu·ku·ro', en: 'Bag' },
    { jp: '地図', rom: 'chi·zu', en: 'Map' },
    { jp: 'おしぼり', rom: 'o·shi·bo·ri', en: 'Wet towel' },
    { jp: '充電器', rom: 'juu·den·ki', en: 'Charger' },
    { jp: '傘', rom: 'ka·sa', en: 'Umbrella' },
    { jp: '薬', rom: 'ku·su·ri', en: 'Medicine' },
    { jp: 'タオル', rom: 'ta·o·ru', en: 'Towel' },
    { jp: '毛布', rom: 'mou·fu', en: 'Blanket' },
    { jp: 'ICカード', rom: 'ai·shii kaa·do', en: 'IC card' },
  ],
  place: [
    { jp: 'トイレ', rom: 'toi·re', en: 'Toilet' },
    { jp: '駅', rom: 'e·ki', en: 'Station' },
    { jp: 'ホテル', rom: 'ho·te·ru', en: 'Hotel' },
    { jp: 'ATM', rom: 'ee·tii·e·mu', en: 'ATM' },
    { jp: 'コンビニ', rom: 'kon·bi·ni', en: 'Convenience store' },
    { jp: '薬局', rom: 'yak·kyo·ku', en: 'Pharmacy' },
    { jp: '出口', rom: 'de·gu·chi', en: 'Exit' },
    { jp: '入口', rom: 'i·ri·gu·chi', en: 'Entrance' },
    { jp: '東京駅', rom: 'tou·kyou·e·ki', en: 'Tokyo Station' },
    { jp: '名古屋城', rom: 'na·go·ya·jou', en: 'Nagoya Castle' },
    { jp: '空港', rom: 'kuu·kou', en: 'Airport' },
    { jp: 'バス停', rom: 'ba·su·tei', en: 'Bus stop' },
    { jp: 'レストラン', rom: 're·su·to·ran', en: 'Restaurant' },
    { jp: '病院', rom: 'byou·in', en: 'Hospital' },
    { jp: '交番', rom: 'kou·ban', en: 'Police box' },
  ],
  food: [
    { jp: 'ラーメン', rom: 'raa·men', en: 'Ramen' },
    { jp: '寿司', rom: 'su·shi', en: 'Sushi' },
    { jp: '天ぷら', rom: 'ten·pu·ra', en: 'Tempura' },
    { jp: 'うどん', rom: 'u·don', en: 'Udon' },
    { jp: 'そば', rom: 'so·ba', en: 'Soba' },
    { jp: 'カレーライス', rom: 'ka·ree·rai·su', en: 'Curry rice' },
    { jp: '焼肉', rom: 'ya·ki·ni·ku', en: 'Grilled meat' },
    { jp: 'とんかつ', rom: 'ton·ka·tsu', en: 'Pork cutlet' },
    { jp: 'たこ焼き', rom: 'ta·ko·ya·ki', en: 'Takoyaki' },
    { jp: 'おにぎり', rom: 'o·ni·gi·ri', en: 'Rice ball' },
    { jp: '刺身', rom: 'sa·shi·mi', en: 'Sashimi' },
    { jp: '味噌カツ', rom: 'mi·so·ka·tsu', en: 'Miso pork cutlet' },
    { jp: 'ひつまぶし', rom: 'hi·tsu·ma·bu·shi', en: 'Grilled eel on rice' },
  ],
  drink: [
    { jp: '水', rom: 'mi·zu', en: 'Water' },
    { jp: 'お茶', rom: 'o·cha', en: 'Green tea' },
    { jp: 'コーヒー', rom: 'koo·hii', en: 'Coffee' },
    { jp: 'ビール', rom: 'bii·ru', en: 'Beer' },
    { jp: '日本酒', rom: 'ni·hon·shu', en: 'Sake' },
    { jp: 'ジュース', rom: 'juu·su', en: 'Juice' },
    { jp: 'お湯', rom: 'o·yu', en: 'Hot water' },
    { jp: 'ほうじ茶', rom: 'hou·ji·cha', en: 'Roasted tea' },
    { jp: '麦茶', rom: 'mu·gi·cha', en: 'Barley tea' },
    { jp: '抹茶ラテ', rom: 'mat·cha ra·te', en: 'Matcha latte' },
    { jp: 'コーラ', rom: 'koo·ra', en: 'Cola' },
    { jp: '紅茶', rom: 'kou·cha', en: 'Black tea' },
  ],
  quantity: [
    { jp: 'ひとつ', rom: 'hi·to·tsu', en: 'One' },
    { jp: 'ふたつ', rom: 'fu·ta·tsu', en: 'Two' },
    { jp: 'みっつ', rom: 'mit·tsu', en: 'Three' },
    { jp: '一枚', rom: 'i·chi·mai', en: 'One (flat)' },
    { jp: '二枚', rom: 'ni·mai', en: 'Two (flat)' },
    { jp: '一本', rom: 'ip·pon', en: 'One (bottle)' },
    { jp: '二本', rom: 'ni·hon', en: 'Two (bottles)' },
  ],
  action: [
    { jp: '写真を撮って', rom: 'sha·shin wo tot·te', en: 'Take a photo' },
    { jp: 'ここで食べて', rom: 'ko·ko de ta·be·te', en: 'Eat here' },
    { jp: '試着', rom: 'shi·cha·ku', en: 'Try on clothes' },
    { jp: 'ここに座って', rom: 'ko·ko ni su·wat·te', en: 'Sit here' },
    { jp: 'カードで払って', rom: 'kaa·do de ha·rat·te', en: 'Pay by card' },
    { jp: '荷物を預けて', rom: 'ni·mo·tsu wo a·zu·ke·te', en: 'Leave luggage' },
    { jp: 'キャンセル', rom: 'kyan·se·ru', en: 'Cancel' },
    { jp: '予約', rom: 'yo·ya·ku', en: 'Reserve / book' },
    { jp: '変更', rom: 'hen·kou', en: 'Change' },
    { jp: '返品', rom: 'hen·pin', en: 'Return (item)' },
    { jp: 'Wi-Fiを使って', rom: 'wai·fai wo tsu·kat·te', en: 'Use Wi-Fi' },
    { jp: '充電', rom: 'juu·den', en: 'Charge (phone)' },
  ],
};

// Slot type labels for the chip category headers
const SLOT_LABELS: Record<SlotType, string> = {
  noun: '📦 Things',
  place: '📍 Places',
  food: '🍜 Food',
  drink: '🍵 Drinks',
  quantity: '🔢 Quantities',
  action: '🎯 Actions',
};

export function SentenceBuilder() {
  const [selectedPattern, setSelectedPattern] = useState<Pattern | null>(null);
  const [result, setResult] = useState<{ jp: string; rom: string; en: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<'request' | 'question' | 'want'>('request');

  const handleSelectVocab = useCallback((vocab: Vocab) => {
    if (!selectedPattern) return;
    const built = selectedPattern.build(vocab);
    setResult(built);
    speak(built.jp, 'ja-JP');
  }, [selectedPattern]);

  const handleCopy = useCallback(() => {
    if (!result) return;
    navigator.clipboard.writeText(`${result.jp}\n${result.rom}\n${result.en}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [result]);

  const handleBack = () => {
    setSelectedPattern(null);
    setResult(null);
  };

  // Step 1: Pattern picker
  if (!selectedPattern) {
    return (
      <div className="scroll-area h-full">
        <div className="px-4 py-3 border-b border-slate-800">
          <h2 className="text-lg font-bold">🔧 Sentence Builder</h2>
          <p className="text-base text-slate-400">Pick a pattern, fill the blank, speak it!</p>
        </div>
        <div className="px-4 pt-3">
          <div className="flex gap-2 mb-3">
            <button onClick={() => setTab('request')} className={`flex-1 py-2 rounded-lg text-base transition ${tab === 'request' ? 'bg-sakura-500/60 text-white' : 'bg-slate-700/50 text-slate-400'}`}>
              🙏 Requests
            </button>
            <button onClick={() => setTab('question')} className={`flex-1 py-2 rounded-lg text-base transition ${tab === 'question' ? 'bg-sakura-500/60 text-white' : 'bg-slate-700/50 text-slate-400'}`}>
              ❓ Questions
            </button>
            <button onClick={() => setTab('want')} className={`flex-1 py-2 rounded-lg text-base transition ${tab === 'want' ? 'bg-sakura-500/60 text-white' : 'bg-slate-700/50 text-slate-400'}`}>
              💭 I want...
            </button>
          </div>
        </div>
        <div className="px-4 pb-4 space-y-1.5">
          {PATTERNS.filter(p => p.group === tab).map(p => (
            <button
              key={p.id}
              onClick={() => { setSelectedPattern(p); setResult(null); }}
              className="w-full bg-slate-700/40 rounded-xl p-3 text-left active:bg-slate-600/50 transition"
            >
              <p className="text-lg font-medium text-slate-50">{p.template}</p>
              <p className="text-base text-sakura-300 mt-0.5">{p.templateRom}</p>
              <p className="text-base text-slate-400 mt-0.5">{p.meaning}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Step 2: Fill the blank
  const vocabList = VOCAB[selectedPattern.slotType];
  // Also show related types (noun patterns can use food/drink too)
  const extraTypes: SlotType[] = selectedPattern.slotType === 'noun'
    ? ['food', 'drink']
    : selectedPattern.slotType === 'food'
    ? ['drink']
    : [];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 shrink-0">
        <button onClick={handleBack} className="text-lg text-slate-400 active:text-slate-200 p-1">←</button>
        <div className="flex-1">
          <h2 className="text-lg font-bold">{selectedPattern.template}</h2>
          <p className="text-base text-sakura-300">{selectedPattern.meaning}</p>
        </div>
      </div>

      {/* Sticky result card */}
      <div className="px-4 py-3 border-b border-slate-800 shrink-0 bg-slate-950">
        {result ? (
          <div className="bg-slate-700/40 rounded-xl p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="text-xl font-bold text-slate-50">{result.jp}</p>
                <p className="text-base text-sakura-300 mt-0.5">{result.rom}</p>
                <p className="text-base text-slate-400 mt-0.5">{result.en}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => speak(result.jp, 'ja-JP')} className="p-1 rounded-lg active:bg-slate-600 text-lg">🔊</button>
                <button onClick={handleCopy} className="p-1 rounded-lg active:bg-slate-600 text-base">
                  {copied ? '✓' : '📋'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-800/40 rounded-xl p-3 border border-dashed border-slate-700">
            <p className="text-base text-slate-500 text-center">{selectedPattern.slotLabel}</p>
          </div>
        )}
      </div>

      {/* Scrollable vocab chips */}
      <div className="scroll-area flex-1 p-4 space-y-4">
        <div>
          <p className="text-sm text-slate-500 mb-2">{SLOT_LABELS[selectedPattern.slotType]}</p>
          <div className="flex flex-wrap gap-1.5">
            {vocabList.map(v => (
              <button
                key={v.jp}
                onClick={() => handleSelectVocab(v)}
                className={`px-3 py-2 rounded-xl text-base transition ${
                  result?.jp.includes(v.jp)
                    ? 'bg-sakura-500/40 text-sakura-200 ring-1 ring-sakura-400/50'
                    : 'bg-slate-700/40 text-slate-300 active:bg-slate-600'
                }`}
              >
                <span className="font-medium">{v.jp}</span>
                <span className="text-slate-500 ml-1">{v.en}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Extra vocab types */}
        {extraTypes.map(type => (
          <div key={type}>
            <p className="text-sm text-slate-500 mb-2">{SLOT_LABELS[type]}</p>
            <div className="flex flex-wrap gap-1.5">
              {VOCAB[type].map(v => (
                <button
                  key={v.jp}
                  onClick={() => handleSelectVocab(v)}
                  className={`px-3 py-2 rounded-xl text-base transition ${
                    result?.jp.includes(v.jp)
                      ? 'bg-sakura-500/40 text-sakura-200 ring-1 ring-sakura-400/50'
                      : 'bg-slate-700/40 text-slate-300 active:bg-slate-600'
                  }`}
                >
                  <span className="font-medium">{v.jp}</span>
                  <span className="text-slate-500 ml-1">{v.en}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
