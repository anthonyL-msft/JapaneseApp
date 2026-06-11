import { useState } from 'react';
import { speak } from '../utils/tts';

type Section = 'gojuon' | 'numbers' | 'converter' | 'particles' | 'counters' | 'patterns' | 'polite' | 'signs';

const SECTIONS: { id: Section; label: string; emoji: string }[] = [
  { id: 'gojuon', label: '50 Sounds (Gojūon)', emoji: 'あ' },
  { id: 'numbers', label: 'Numbers & Digits', emoji: '🔢' },
  { id: 'converter', label: 'Number Converter', emoji: '🔄' },
  { id: 'particles', label: 'Key Particles', emoji: '🔤' },
  { id: 'counters', label: 'Counters', emoji: '📏' },
  { id: 'patterns', label: 'Sentence Patterns', emoji: '📐' },
  { id: 'polite', label: 'Polite Forms', emoji: '🎩' },
  { id: 'signs', label: 'Common Signs', emoji: '🪧' },
];

export function Reference() {
  const [open, setOpen] = useState<Section | null>(null);

  return (
    <div className="scroll-area h-full">
      <div className="px-4 py-3 border-b border-slate-800">
        <h2 className="text-lg font-bold">📚 Quick Reference</h2>
        <p className="text-base text-slate-400">Grammar cheat sheet for travel</p>
      </div>

      <div className="p-4 space-y-2">
        {SECTIONS.map(sec => (
          <div key={sec.id} className="bg-slate-800/60 rounded-xl overflow-hidden">
            <button
              onClick={() => setOpen(open === sec.id ? null : sec.id)}
              className="w-full flex items-center justify-between p-3 active:bg-slate-700/50 transition"
            >
              <span className="text-base font-semibold">
                {sec.emoji} {sec.label}
              </span>
              <span className="text-slate-500 text-base">{open === sec.id ? '▲' : '▼'}</span>
            </button>
            {open === sec.id && (
              <div className="px-3 pb-3 border-t border-slate-700/50">
                {sec.id === 'gojuon' && <GojuonRef />}
                {sec.id === 'numbers' && <NumbersRef />}
                {sec.id === 'converter' && <NumberConverter />}
                {sec.id === 'particles' && <ParticlesRef />}
                {sec.id === 'counters' && <CountersRef />}
                {sec.id === 'patterns' && <PatternsRef />}
                {sec.id === 'polite' && <PoliteRef />}
                {sec.id === 'signs' && <SignsRef />}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function RefRow({ jp, rom, meaning }: { jp: string; rom: string; meaning: string }) {
  return (
    <div className="py-1.5 border-b border-slate-700/30 last:border-0">
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-medium text-slate-100">{jp}</span>
            <span className="text-base text-sakura-300">{rom}</span>
          </div>
          <p className="text-base text-slate-400 mt-0.5">{meaning}</p>
        </div>
        <button onClick={() => speak(jp, 'ja-JP')} className="text-lg active:scale-110 transition-transform shrink-0 p-1">🔊</button>
      </div>
    </div>
  );
}

// ============================================================
// 50-Sound Chart (Gojūon)
// ============================================================
function GojuonRef() {
  const [chart, setChart] = useState<'hiragana' | 'katakana'>('hiragana');

  const hiragana = [
    ['あ a', 'い i', 'う u', 'え e', 'お o'],
    ['か ka', 'き ki', 'く ku', 'け ke', 'こ ko'],
    ['さ sa', 'し shi', 'す su', 'せ se', 'そ so'],
    ['た ta', 'ち chi', 'つ tsu', 'て te', 'と to'],
    ['な na', 'に ni', 'ぬ nu', 'ね ne', 'の no'],
    ['は ha', 'ひ hi', 'ふ fu', 'へ he', 'ほ ho'],
    ['ま ma', 'み mi', 'む mu', 'め me', 'も mo'],
    ['や ya', '', 'ゆ yu', '', 'よ yo'],
    ['ら ra', 'り ri', 'る ru', 'れ re', 'ろ ro'],
    ['わ wa', '', '', '', 'を wo'],
    ['ん n', '', '', '', ''],
  ];

  const katakana = [
    ['ア a', 'イ i', 'ウ u', 'エ e', 'オ o'],
    ['カ ka', 'キ ki', 'ク ku', 'ケ ke', 'コ ko'],
    ['サ sa', 'シ shi', 'ス su', 'セ se', 'ソ so'],
    ['タ ta', 'チ chi', 'ツ tsu', 'テ te', 'ト to'],
    ['ナ na', 'ニ ni', 'ヌ nu', 'ネ ne', 'ノ no'],
    ['ハ ha', 'ヒ hi', 'フ fu', 'ヘ he', 'ホ ho'],
    ['マ ma', 'ミ mi', 'ム mu', 'メ me', 'モ mo'],
    ['ヤ ya', '', 'ユ yu', '', 'ヨ yo'],
    ['ラ ra', 'リ ri', 'ル ru', 'レ re', 'ロ ro'],
    ['ワ wa', '', '', '', 'ヲ wo'],
    ['ン n', '', '', '', ''],
  ];

  const data = chart === 'hiragana' ? hiragana : katakana;

  return (
    <div className="mt-2">
      <div className="flex gap-2 mb-3">
        <button onClick={() => setChart('hiragana')} className={`flex-1 py-2 rounded-lg text-base transition ${chart === 'hiragana' ? 'bg-sakura-500/60 text-white' : 'bg-slate-700/50 text-slate-400'}`}>
          ひらがな Hiragana
        </button>
        <button onClick={() => setChart('katakana')} className={`flex-1 py-2 rounded-lg text-base transition ${chart === 'katakana' ? 'bg-sakura-500/60 text-white' : 'bg-slate-700/50 text-slate-400'}`}>
          カタカナ Katakana
        </button>
      </div>
      <div className="grid grid-cols-5 gap-1">
        {data.flat().map((cell, i) => {
          if (!cell) return <div key={i} className="h-14" />;
          const [char, rom] = [cell.split(' ')[0], cell.split(' ')[1]];
          return (
            <button
              key={i}
              onClick={() => speak(char, 'ja-JP')}
              className="bg-slate-700/40 rounded-lg h-14 flex flex-col items-center justify-center active:bg-slate-600 transition"
            >
              <span className="text-lg text-slate-100">{char}</span>
              <span className="text-base text-sakura-300">{rom}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// Number Converter
// ============================================================
function NumberConverter() {
  const [input, setInput] = useState('');
  const HKD_RATE = 0.054; // 1 JPY ≈ 0.054 HKD
  const CAD_RATE = 0.0096; // 1 JPY ≈ 0.0096 CAD

  const numberToJapanese = (num: number): { kanji: string; reading: string; romaji: string } | null => {
    if (num < 0 || num > 9999999 || !Number.isInteger(num)) return null;
    const digits: Record<number, { k: string; r: string; rom: string }> = {
      0: { k: '零', r: 'れい', rom: 'rei' },
      1: { k: '一', r: 'いち', rom: 'i·chi' },
      2: { k: '二', r: 'に', rom: 'ni' },
      3: { k: '三', r: 'さん', rom: 'san' },
      4: { k: '四', r: 'よん', rom: 'yon' },
      5: { k: '五', r: 'ご', rom: 'go' },
      6: { k: '六', r: 'ろく', rom: 'ro·ku' },
      7: { k: '七', r: 'なな', rom: 'na·na' },
      8: { k: '八', r: 'はち', rom: 'ha·chi' },
      9: { k: '九', r: 'きゅう', rom: 'kyuu' },
    };
    if (num === 0) return { kanji: '零', reading: 'れい', romaji: 'rei' };
    
    let kanji = '', reading = '', romaji = '';
    const man = Math.floor(num / 10000);
    const sen = Math.floor((num % 10000) / 1000);
    const hyaku = Math.floor((num % 1000) / 100);
    const juu = Math.floor((num % 100) / 10);
    const ichi = num % 10;
    
    if (man > 0) {
      if (man > 1) { kanji += digits[man].k; reading += digits[man].r; romaji += digits[man].rom + '·'; }
      kanji += '万'; reading += 'まん'; romaji += 'man';
    }
    if (sen > 0) {
      if (kanji) { romaji += ' '; }
      if (sen === 3) { kanji += '三千'; reading += 'さんぜん'; romaji += 'san·zen'; }
      else if (sen === 8) { kanji += '八千'; reading += 'はっせん'; romaji += 'has·sen'; }
      else { if (sen > 1) { kanji += digits[sen].k; reading += digits[sen].r; romaji += digits[sen].rom + '·'; } kanji += '千'; reading += 'せん'; romaji += 'sen'; }
    }
    if (hyaku > 0) {
      if (kanji) { romaji += ' '; }
      if (hyaku === 3) { kanji += '三百'; reading += 'さんびゃく'; romaji += 'san·bya·ku'; }
      else if (hyaku === 6) { kanji += '六百'; reading += 'ろっぴゃく'; romaji += 'rop·pya·ku'; }
      else if (hyaku === 8) { kanji += '八百'; reading += 'はっぴゃく'; romaji += 'hap·pya·ku'; }
      else { if (hyaku > 1) { kanji += digits[hyaku].k; reading += digits[hyaku].r; romaji += digits[hyaku].rom + '·'; } kanji += '百'; reading += 'ひゃく'; romaji += 'hya·ku'; }
    }
    if (juu > 0) {
      if (kanji) { romaji += ' '; }
      if (juu > 1) { kanji += digits[juu].k; reading += digits[juu].r; romaji += digits[juu].rom + '·'; }
      kanji += '十'; reading += 'じゅう'; romaji += 'juu';
    }
    if (ichi > 0) {
      if (kanji) { romaji += ' '; }
      kanji += digits[ichi].k; reading += digits[ichi].r; romaji += digits[ichi].rom;
    }
    return { kanji, reading, romaji };
  };

  const num = parseInt(input);
  const result = !isNaN(num) && num >= 0 ? numberToJapanese(num) : null;

  return (
    <div className="mt-2 space-y-3">
      <input
        type="number"
        inputMode="numeric"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Type a number (e.g., 3500)"
        className="w-full bg-slate-700/50 text-base text-slate-200 placeholder-slate-500 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-sakura-400/50"
      />
      {result && (
        <div className="bg-slate-700/30 rounded-xl p-3 space-y-2">
          <div className="flex items-center gap-2">
            <button onClick={() => speak(result.reading, 'ja-JP')} className="text-lg active:scale-110 transition-transform">🔊</button>
            <span className="text-xl font-bold text-slate-100">{result.kanji}</span>
          </div>
          <p className="text-base text-sakura-300 ml-8">{result.romaji}</p>
          <p className="text-base text-slate-300 ml-8">{result.reading}</p>
          {!isNaN(num) && num > 0 && (
            <div className="mt-2 pt-2 border-t border-slate-700/30 ml-8 space-y-1">
              <p className="text-base text-slate-400">¥{num.toLocaleString()} ≈ HK${(num * HKD_RATE).toFixed(1)}</p>
              <p className="text-base text-slate-400">¥{num.toLocaleString()} ≈ CA${(num * CAD_RATE).toFixed(2)}</p>
            </div>
          )}
        </div>
      )}
      {input && !result && (
        <p className="text-base text-red-400">Enter a number between 0 and 9,999,999</p>
      )}
    </div>
  );
}

function NumbersRef() {
  const [numTab, setNumTab] = useState<string>('basic');

  const tabs = [
    { id: 'basic', label: '1-10' },
    { id: 'prices', label: 'Prices' },
    { id: 'hours', label: 'Hours' },
    { id: 'minutes', label: 'Minutes' },
    { id: 'nights', label: 'Nights' },
    { id: 'people', label: 'People' },
  ];

  return (
    <div className="mt-2">
      {/* Tab strip */}
      <div className="flex gap-1 overflow-x-auto pb-2 mb-2">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setNumTab(t.id)}
            className={`px-3 py-1.5 rounded-lg text-base whitespace-nowrap transition ${
              numTab === t.id
                ? 'bg-sakura-500/60 text-white'
                : 'bg-slate-700/50 text-slate-400 active:bg-slate-600'
            }`}
          >{t.label}</button>
        ))}
      </div>

      {numTab === 'basic' && (
        <div>
          <RefRow jp="一" rom="i·chi" meaning="1" />
          <RefRow jp="二" rom="ni" meaning="2" />
          <RefRow jp="三" rom="san" meaning="3" />
          <RefRow jp="四" rom="yon" meaning="4 (also shi)" />
          <RefRow jp="五" rom="go" meaning="5" />
          <RefRow jp="六" rom="ro·ku" meaning="6" />
          <RefRow jp="七" rom="na·na" meaning="7 (also shichi)" />
          <RefRow jp="八" rom="ha·chi" meaning="8" />
          <RefRow jp="九" rom="kyuu" meaning="9 (also ku)" />
          <RefRow jp="十" rom="juu" meaning="10" />
          <div className="mt-2 pt-2 border-t border-slate-700/30">
            <RefRow jp="二十" rom="ni·juu" meaning="20" />
            <RefRow jp="三十" rom="san·juu" meaning="30" />
            <RefRow jp="五十" rom="go·juu" meaning="50" />
            <RefRow jp="百" rom="hya·ku" meaning="100" />
            <RefRow jp="千" rom="sen" meaning="1,000" />
            <RefRow jp="万" rom="man" meaning="10,000 (Japanese counts in 万!)" />
          </div>
        </div>
      )}

      {numTab === 'prices' && (
        <div>
          <RefRow jp="150円" rom="hya·ku go·juu en" meaning="¥150 (convenience store onigiri)" />
          <RefRow jp="500円" rom="go·hya·ku en" meaning="¥500 (lunch set, goshuin stamp)" />
          <RefRow jp="800円" rom="hap·pya·ku en" meaning="¥800 (ramen bowl)" />
          <RefRow jp="1,000円" rom="sen en" meaning="¥1,000 (one bill)" />
          <RefRow jp="2,500円" rom="ni·sen go·hya·ku en" meaning="¥2,500 (nice dinner)" />
          <RefRow jp="5,000円" rom="go·sen en" meaning="¥5,000 (tax-free minimum)" />
          <RefRow jp="10,000円" rom="i·chi·man en" meaning="¥10,000 (one big bill)" />
        </div>
      )}

      {numTab === 'hours' && (
        <div>
          <RefRow jp="1時" rom="i·chi·ji" meaning="1 o'clock" />
          <RefRow jp="2時" rom="ni·ji" meaning="2 o'clock" />
          <RefRow jp="3時" rom="san·ji" meaning="3 o'clock" />
          <RefRow jp="4時" rom="yo·ji" meaning="4 o'clock (NOT yon·ji)" />
          <RefRow jp="5時" rom="go·ji" meaning="5 o'clock" />
          <RefRow jp="6時" rom="ro·ku·ji" meaning="6 o'clock" />
          <RefRow jp="7時" rom="shi·chi·ji" meaning="7 o'clock" />
          <RefRow jp="8時" rom="ha·chi·ji" meaning="8 o'clock" />
          <RefRow jp="9時" rom="ku·ji" meaning="9 o'clock (NOT kyuu·ji)" />
          <RefRow jp="10時" rom="juu·ji" meaning="10 o'clock" />
          <RefRow jp="11時" rom="juu·i·chi·ji" meaning="11 o'clock" />
          <RefRow jp="12時" rom="juu·ni·ji" meaning="12 o'clock" />
        </div>
      )}

      {numTab === 'minutes' && (
        <div>
          <RefRow jp="1分" rom="ip·pun" meaning="1 min ⚠️" />
          <RefRow jp="2分" rom="ni·fun" meaning="2 min" />
          <RefRow jp="3分" rom="san·pun" meaning="3 min ⚠️" />
          <RefRow jp="4分" rom="yon·pun" meaning="4 min ⚠️" />
          <RefRow jp="5分" rom="go·fun" meaning="5 min" />
          <RefRow jp="10分" rom="jup·pun" meaning="10 min ⚠️" />
          <RefRow jp="15分" rom="juu·go·fun" meaning="15 min" />
          <RefRow jp="30分" rom="san·jup·pun" meaning="30 min (half)" />
          <RefRow jp="半" rom="han" meaning="half (3時半 = 3:30)" />
        </div>
      )}

      {numTab === 'nights' && (
        <div>
          <RefRow jp="一泊" rom="ip·pa·ku" meaning="1 night ⚠️" />
          <RefRow jp="二泊" rom="ni·ha·ku" meaning="2 nights" />
          <RefRow jp="三泊" rom="san·pa·ku" meaning="3 nights ⚠️" />
          <RefRow jp="四泊" rom="yon·ha·ku" meaning="4 nights" />
          <RefRow jp="五泊" rom="go·ha·ku" meaning="5 nights" />
        </div>
      )}

      {numTab === 'people' && (
        <div>
          <RefRow jp="ひとり" rom="hi·to·ri" meaning="1 person (NOT ichi·nin)" />
          <RefRow jp="ふたり" rom="fu·ta·ri" meaning="2 people (NOT ni·nin) ← your default!" />
          <RefRow jp="三人" rom="san·nin" meaning="3 people" />
          <RefRow jp="四人" rom="yo·nin" meaning="4 people (NOT yon·nin)" />
          <RefRow jp="五人" rom="go·nin" meaning="5 people" />
        </div>
      )}
    </div>
  );
}

function ParticleRow({ jp, rom, meaning, examples }: { jp: string; rom: string; meaning: string; examples: { jp: string; hep: string; en: string }[] }) {
  const [showEx, setShowEx] = useState(false);
  return (
    <div className="py-2 border-b border-slate-700/30 last:border-0">
      <div className="flex items-center gap-2">
        <button onClick={() => setShowEx(!showEx)} className="flex-1 text-left">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-medium text-slate-100">{jp}</span>
            <span className="text-base text-sakura-300">{rom}</span>
          </div>
          <p className="text-base text-slate-400 mt-0.5">{meaning}</p>
        </button>
        <button onClick={() => speak(jp, 'ja-JP')} className="text-lg active:scale-110 transition-transform shrink-0 p-1">🔊</button>
        <button onClick={() => setShowEx(!showEx)} className="text-base text-slate-500 shrink-0">{showEx ? '▲' : '▼'}</button>
      </div>
      {showEx && (
        <div className="mt-2 space-y-1.5">
          {examples.map((ex, i) => (
            <div key={i} className="bg-slate-700/20 rounded-lg p-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1">
                  <p className="text-base text-slate-200">{ex.jp}</p>
                  <p className="text-base text-sakura-300">{ex.hep}</p>
                </div>
                <button onClick={() => speak(ex.jp, 'ja-JP')} className="text-lg active:scale-110 shrink-0 p-1">🔊</button>
              </div>
              <p className="text-base text-slate-400">{ex.en}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ParticlesRef() {
  return (
    <div className="mt-2">
      <p className="text-base text-slate-500 mb-2">Tap a particle to see example sentences</p>
      <ParticleRow jp="は" rom="wa" meaning="Topic marker — marks what you're talking about"
        examples={[
          { jp: 'これは何ですか？', hep: 'ko·re wa nan de·su ka', en: 'What is this?' },
          { jp: '私はアンソニーです', hep: 'wa·ta·shi wa an·so·nii de·su', en: 'I am Anthony' },
          { jp: 'トイレはどこですか？', hep: 'toi·re wa do·ko de·su ka', en: 'Where is the toilet?' },
        ]} />
      <ParticleRow jp="が" rom="ga" meaning="Subject marker — marks who/what does the action"
        examples={[
          { jp: '水がほしいです', hep: 'mi·zu ga ho·shii de·su', en: 'I want water' },
          { jp: '日本語がわかりません', hep: 'ni·hon·go ga wa·ka·ri·ma·sen', en: "I don't understand Japanese" },
          { jp: 'これが一番おいしいです', hep: 'ko·re ga i·chi·ban o·i·shii de·su', en: 'This is the most delicious' },
        ]} />
      <ParticleRow jp="を" rom="wo" meaning="Object marker — marks what receives the action"
        examples={[
          { jp: 'ラーメンを二つお願いします', hep: 'raa·men wo fu·ta·tsu o·ne·gai·shi·ma·su', en: 'Two ramen please' },
          { jp: '写真を撮ってもらえますか？', hep: 'sha·shin wo tot·te mo·ra·e·ma·su ka', en: 'Can you take a photo?' },
          { jp: '切符を買います', hep: 'kip·pu wo kai·ma·su', en: 'I buy a ticket' },
        ]} />
      <ParticleRow jp="に" rom="ni" meaning="Direction/time — to, at, in, on"
        examples={[
          { jp: '6時に予約しました', hep: 'ro·ku·ji ni yo·ya·ku shi·ma·shi·ta', en: 'I reserved at 6 o\'clock' },
          { jp: '東京に行きます', hep: 'tou·kyou ni i·ki·ma·su', en: 'I go to Tokyo' },
          { jp: 'ホテルに荷物を送ります', hep: 'ho·te·ru ni ni·mo·tsu wo o·ku·ri·ma·su', en: 'I send luggage to the hotel' },
        ]} />
      <ParticleRow jp="で" rom="de" meaning="Location of action / by means of"
        examples={[
          { jp: 'Suicaで払います', hep: 'sui·ka de ha·rai·ma·su', en: 'I pay with Suica' },
          { jp: 'ここで食べます', hep: 'ko·ko de ta·be·ma·su', en: 'I eat here' },
          { jp: '電車で行きます', hep: 'den·sha de i·ki·ma·su', en: 'I go by train' },
        ]} />
      <ParticleRow jp="へ" rom="e" meaning="Towards (direction)"
        examples={[
          { jp: '東京へ行きます', hep: 'tou·kyou e i·ki·ma·su', en: 'I\'m heading to Tokyo' },
          { jp: 'こちらへどうぞ', hep: 'ko·chi·ra e dou·zo', en: 'This way please' },
        ]} />
      <ParticleRow jp="の" rom="no" meaning="Possessive / connecting — 's, of"
        examples={[
          { jp: '名古屋の名物', hep: 'na·go·ya no mei·bu·tsu', en: 'Nagoya\'s specialty' },
          { jp: '日本語のメニュー', hep: 'ni·hon·go no me·nyuu', en: 'Japanese menu' },
          { jp: 'ホテルの電話番号', hep: 'ho·te·ru no den·wa ban·gou', en: 'Hotel\'s phone number' },
        ]} />
      <ParticleRow jp="と" rom="to" meaning="And, with (listing/companion)"
        examples={[
          { jp: 'ビールと枝豆をお願いします', hep: 'bii·ru to e·da·ma·me wo o·ne·gai·shi·ma·su', en: 'Beer and edamame please' },
          { jp: 'ふたりで旅行しています', hep: 'fu·ta·ri de ryo·kou shi·te i·ma·su', en: 'Traveling as two people' },
        ]} />
      <ParticleRow jp="も" rom="mo" meaning="Also, too"
        examples={[
          { jp: 'これもお願いします', hep: 'ko·re mo o·ne·gai·shi·ma·su', en: 'This one too please' },
          { jp: '日本語もわかりません', hep: 'ni·hon·go mo wa·ka·ri·ma·sen', en: 'I don\'t understand Japanese either' },
        ]} />
      <ParticleRow jp="か" rom="ka" meaning="Question marker (end of sentence)"
        examples={[
          { jp: 'いくらですか？', hep: 'i·ku·ra de·su ka', en: 'How much?' },
          { jp: 'クレジットカードは使えますか？', hep: 'ku·re·jit·to kaa·do wa tsu·ka·e·ma·su ka', en: 'Can I use credit card?' },
          { jp: 'これはなんですか？', hep: 'ko·re wa nan de·su ka', en: 'What is this?' },
        ]} />
      <ParticleRow jp="から" rom="ka·ra" meaning="From (place/time)"
        examples={[
          { jp: '名古屋から東京まで', hep: 'na·go·ya ka·ra tou·kyou ma·de', en: 'From Nagoya to Tokyo' },
          { jp: '7時から朝食です', hep: 'shi·chi·ji ka·ra chou·sho·ku de·su', en: 'Breakfast from 7 o\'clock' },
        ]} />
      <ParticleRow jp="まで" rom="ma·de" meaning="Until, to (endpoint)"
        examples={[
          { jp: 'この住所までお願いします', hep: 'ko·no juu·sho ma·de o·ne·gai·shi·ma·su', en: 'To this address please' },
          { jp: '10時まで営業です', hep: 'juu·ji ma·de ei·gyou de·su', en: 'Open until 10 o\'clock' },
        ]} />
    </div>
  );
}

function CountersRef() {
  return (
    <div className="mt-2">
      <p className="text-base text-slate-500 mb-2">Japanese uses different counters for different objects (like Chinese 量詞)</p>
      <RefRow jp="〜つ" rom="-tsu" meaning="General counter: ひとつ(1), ふたつ(2), みっつ(3)" />
      <RefRow jp="〜人" rom="-nin" meaning="People: ひとり(1), ふたり(2), さんにん(3)" />
      <RefRow jp="〜枚" rom="-mai" meaning="Flat objects: tickets, plates, shirts" />
      <RefRow jp="〜本" rom="-hon" meaning="Long objects: bottles, pens, umbrellas" />
      <RefRow jp="〜杯" rom="-hai" meaning="Cups/glasses: いっぱい(1), にはい(2)" />
      <RefRow jp="〜個" rom="-ko" meaning="Small round objects: eggs, apples" />
      <RefRow jp="〜台" rom="-dai" meaning="Machines/vehicles: cars, computers" />
      <RefRow jp="〜泊" rom="-ha·ku" meaning="Nights (hotel): いっぱく(1), にはく(2)" />
      <RefRow jp="〜名" rom="-mei" meaning="People (formal): にめい(2), さんめい(3)" />
      <RefRow jp="〜階" rom="-kai" meaning="Floors: いっかい(1F), にかい(2F)" />
    </div>
  );
}

function PatternCard({ pattern, rom, meaning, examples }: { pattern: string; rom: string; meaning: string; examples: { jp: string; hep: string; en: string }[] }) {
  const [showEx, setShowEx] = useState(false);
  return (
    <div className="bg-slate-700/30 rounded-lg p-2">
      <div className="flex items-center gap-2">
        <button onClick={() => setShowEx(!showEx)} className="flex-1 text-left">
          <p className="text-base text-slate-200 font-medium">{pattern}</p>
          <p className="text-base text-sakura-300">{rom}</p>
          <p className="text-base text-slate-400 mt-1">{meaning}</p>
        </button>
        <button onClick={() => speak(pattern, 'ja-JP')} className="text-lg active:scale-110 shrink-0 p-1">🔊</button>
        <button onClick={() => setShowEx(!showEx)} className="text-base text-slate-500 shrink-0">{showEx ? '▲' : '▼'}</button>
      </div>
      {showEx && (
        <div className="mt-2 space-y-1.5 border-t border-slate-700/30 pt-2">
          <p className="text-base text-slate-500">Examples:</p>
          {examples.map((ex, i) => (
            <div key={i} className="bg-slate-700/20 rounded-lg p-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1">
                  <p className="text-base text-slate-200">{ex.jp}</p>
                  <p className="text-base text-sakura-300">{ex.hep}</p>
                </div>
                <button onClick={() => speak(ex.jp, 'ja-JP')} className="text-lg active:scale-110 shrink-0 p-1">🔊</button>
              </div>
              <p className="text-base text-slate-400">{ex.en}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PatternsRef() {
  return (
    <div className="mt-2 space-y-3">
      <p className="text-base text-slate-500">Tap a pattern to see real examples</p>
      <PatternCard pattern="○○をお願いします" rom="○○ wo o·ne·gai·shi·ma·su" meaning="○○ please — works for anything!"
        examples={[
          { jp: '水をお願いします', hep: 'mi·zu wo o·ne·gai·shi·ma·su', en: 'Water please' },
          { jp: 'メニューをお願いします', hep: 'me·nyuu wo o·ne·gai·shi·ma·su', en: 'Menu please' },
          { jp: 'お会計をお願いします', hep: 'o·kai·kei wo o·ne·gai·shi·ma·su', en: 'Check please' },
          { jp: '二つをお願いします', hep: 'fu·ta·tsu wo o·ne·gai·shi·ma·su', en: 'Two of them please' },
        ]} />
      <PatternCard pattern="○○はありますか" rom="○○ wa a·ri·ma·su ka" meaning="Is there ○○? / Do you have ○○?"
        examples={[
          { jp: 'Wi-Fiはありますか？', hep: 'wai·fai wa a·ri·ma·su ka', en: 'Is there Wi-Fi?' },
          { jp: '英語のメニューはありますか？', hep: 'ei·go no me·nyuu wa a·ri·ma·su ka', en: 'Do you have an English menu?' },
          { jp: '空いている席はありますか？', hep: 'ai·te i·ru se·ki wa a·ri·ma·su ka', en: 'Is there an empty seat?' },
        ]} />
      <PatternCard pattern="○○はどこですか" rom="○○ wa do·ko de·su ka" meaning="Where is ○○?"
        examples={[
          { jp: 'トイレはどこですか？', hep: 'toi·re wa do·ko de·su ka', en: 'Where is the toilet?' },
          { jp: '駅はどこですか？', hep: 'e·ki wa do·ko de·su ka', en: 'Where is the station?' },
          { jp: 'ATMはどこですか？', hep: 'ee·tii·e·mu wa do·ko de·su ka', en: 'Where is an ATM?' },
        ]} />
      <PatternCard pattern="○○してもいいですか" rom="○○ shi·te mo ii de·su ka" meaning="May I ○○? (asking permission)"
        examples={[
          { jp: '写真を撮ってもいいですか？', hep: 'sha·shin wo tot·te mo ii de·su ka', en: 'May I take photos?' },
          { jp: 'ここで食べてもいいですか？', hep: 'ko·ko de ta·be·te mo ii de·su ka', en: 'May I eat here?' },
          { jp: '試着してもいいですか？', hep: 'shi·cha·ku shi·te mo ii de·su ka', en: 'May I try it on?' },
        ]} />
      <PatternCard pattern="○○てください" rom="○○ te ku·da·sai" meaning="Please do ○○ (polite request)"
        examples={[
          { jp: '書いてください', hep: 'kai·te ku·da·sai', en: 'Please write it down' },
          { jp: 'ゆっくり話してください', hep: 'yuk·ku·ri ha·na·shi·te ku·da·sai', en: 'Please speak slowly' },
          { jp: '温めてください', hep: 'a·ta·ta·me·te ku·da·sai', en: 'Please heat it up' },
        ]} />
      <PatternCard pattern="○○がわかりません" rom="○○ ga wa·ka·ri·ma·sen" meaning="I don't understand ○○"
        examples={[
          { jp: '日本語がわかりません', hep: 'ni·hon·go ga wa·ka·ri·ma·sen', en: "I don't understand Japanese" },
          { jp: '使い方がわかりません', hep: 'tsu·kai·ka·ta ga wa·ka·ri·ma·sen', en: "I don't know how to use it" },
        ]} />
      <PatternCard pattern="○○たいです" rom="○○ tai de·su" meaning="I want to ○○ (desire)"
        examples={[
          { jp: '食べたいです', hep: 'ta·be·tai de·su', en: 'I want to eat' },
          { jp: '行きたいです', hep: 'i·ki·tai de·su', en: 'I want to go' },
          { jp: '荷物を送りたいです', hep: 'ni·mo·tsu wo o·ku·ri·tai de·su', en: 'I want to send luggage' },
        ]} />
    </div>
  );
}

function PoliteRef() {
  return (
    <div className="mt-2">
      <p className="text-base text-slate-500 mb-2">Japanese has different politeness levels. Use ます (masu) form for all travel situations.</p>
      <div className="space-y-2">
        <div className="bg-slate-700/30 rounded-lg p-2">
          <div className="flex justify-between">
            <span className="text-base text-slate-200">〜ます</span>
            <span className="text-base text-slate-500">Polite positive</span>
          </div>
          <p className="text-base text-sakura-300">ma·su</p>
          <p className="text-base text-slate-400">行きます (i·ki·ma·su) = I go</p>
        </div>
        <div className="bg-slate-700/30 rounded-lg p-2">
          <div className="flex justify-between">
            <span className="text-base text-slate-200">〜ません</span>
            <span className="text-base text-slate-500">Polite negative</span>
          </div>
          <p className="text-base text-sakura-300">ma·sen</p>
          <p className="text-base text-slate-400">行きません (i·ki·ma·sen) = I don't go</p>
        </div>
        <div className="bg-slate-700/30 rounded-lg p-2">
          <div className="flex justify-between">
            <span className="text-base text-slate-200">〜ました</span>
            <span className="text-base text-slate-500">Polite past</span>
          </div>
          <p className="text-base text-sakura-300">ma·shi·ta</p>
          <p className="text-base text-slate-400">行きました (i·ki·ma·shi·ta) = I went</p>
        </div>
        <div className="bg-slate-700/30 rounded-lg p-2">
          <div className="flex justify-between">
            <span className="text-base text-slate-200">〜です</span>
            <span className="text-base text-slate-500">Polite copula (is/am)</span>
          </div>
          <p className="text-base text-sakura-300">de·su</p>
          <p className="text-base text-slate-400">ふたりです (fu·ta·ri de·su) = There are two of us</p>
        </div>
      </div>
    </div>
  );
}

function SignsRef() {
  return (
    <div className="mt-2">
      <p className="text-base text-slate-500 mb-2">Common signs you'll see everywhere — your Chinese kanji knowledge helps!</p>
      <RefRow jp="入口" rom="i·ri·gu·chi" meaning="Entrance 入口" />
      <RefRow jp="出口" rom="de·gu·chi" meaning="Exit 出口" />
      <RefRow jp="非常口" rom="hi·jou·gu·chi" meaning="Emergency exit 緊急出口" />
      <RefRow jp="禁煙" rom="ki·nen" meaning="No smoking 禁菸" />
      <RefRow jp="立入禁止" rom="ta·chi·i·ri kin·shi" meaning="No entry 禁止進入" />
      <RefRow jp="撮影禁止" rom="sa·tsu·ei kin·shi" meaning="No photography 禁止攝影" />
      <RefRow jp="営業中" rom="ei·gyou·chuu" meaning="Open for business 營業中" />
      <RefRow jp="準備中" rom="jun·bi·chuu" meaning="Preparing (not open yet) 準備中" />
      <RefRow jp="定休日" rom="tei·kyuu·bi" meaning="Regular holiday/closed day 定休日" />
      <RefRow jp="男" rom="o·to·ko" meaning="Male (bathroom) 男" />
      <RefRow jp="女" rom="on·na" meaning="Female (bathroom) 女" />
      <RefRow jp="押" rom="osu" meaning="Push 推" />
      <RefRow jp="引" rom="hi·ku" meaning="Pull 拉" />
      <RefRow jp="無料" rom="mu·ryou" meaning="Free (no charge) 免費" />
      <RefRow jp="有料" rom="yuu·ryou" meaning="Paid 收費" />
      <RefRow jp="割引" rom="wa·ri·bi·ki" meaning="Discount 折扣" />
      <RefRow jp="税込" rom="zei·ko·mi" meaning="Tax included 含稅" />
      <RefRow jp="税抜" rom="zei·nu·ki" meaning="Tax excluded 未稅" />
    </div>
  );
}
