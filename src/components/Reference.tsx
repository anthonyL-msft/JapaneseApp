import { useState } from 'react';

type Section = 'numbers' | 'particles' | 'counters' | 'patterns' | 'polite' | 'signs';

const SECTIONS: { id: Section; label: string; emoji: string }[] = [
  { id: 'numbers', label: 'Numbers & Digits', emoji: '🔢' },
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
        <p className="text-xs text-slate-400">Grammar cheat sheet for travel</p>
      </div>

      <div className="p-4 space-y-2">
        {SECTIONS.map(sec => (
          <div key={sec.id} className="bg-slate-800/60 rounded-xl overflow-hidden">
            <button
              onClick={() => setOpen(open === sec.id ? null : sec.id)}
              className="w-full flex items-center justify-between p-3 active:bg-slate-700/50 transition"
            >
              <span className="text-sm font-semibold">
                {sec.emoji} {sec.label}
              </span>
              <span className="text-slate-500 text-xs">{open === sec.id ? '▲' : '▼'}</span>
            </button>
            {open === sec.id && (
              <div className="px-3 pb-3 border-t border-slate-700/50">
                {sec.id === 'numbers' && <NumbersRef />}
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
      <div className="flex items-baseline gap-2">
        <span className="text-base font-medium text-slate-100 shrink-0">{jp}</span>
        <span className="text-xs text-sakura-300">{rom}</span>
      </div>
      <p className="text-xs text-slate-400 mt-0.5">{meaning}</p>
    </div>
  );
}

function NumbersRef() {
  return (
    <div className="mt-2 space-y-4">
      {/* Basic 1-10 */}
      <div>
        <p className="text-xs text-slate-500 mb-1">Basic Numbers</p>
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
      </div>

      {/* Tens */}
      <div>
        <p className="text-xs text-slate-500 mb-1">Tens — just add じゅう (juu)</p>
        <RefRow jp="二十" rom="ni·juu" meaning="20" />
        <RefRow jp="三十" rom="san·juu" meaning="30" />
        <RefRow jp="五十" rom="go·juu" meaning="50" />
        <RefRow jp="百" rom="hya·ku" meaning="100" />
        <RefRow jp="千" rom="sen" meaning="1,000" />
        <RefRow jp="万" rom="man" meaning="10,000 (Japanese counts in 万!)" />
      </div>

      {/* Prices you'll see */}
      <div>
        <p className="text-xs text-slate-500 mb-1">Common Prices (practice reading!)</p>
        <RefRow jp="150円" rom="hya·ku go·juu en" meaning="¥150 (convenience store onigiri)" />
        <RefRow jp="500円" rom="go·hya·ku en" meaning="¥500 (lunch set, goshuin stamp)" />
        <RefRow jp="800円" rom="hap·pya·ku en" meaning="¥800 (ramen bowl)" />
        <RefRow jp="1,000円" rom="sen en" meaning="¥1,000 (one bill)" />
        <RefRow jp="2,500円" rom="ni·sen go·hya·ku en" meaning="¥2,500 (nice dinner)" />
        <RefRow jp="5,000円" rom="go·sen en" meaning="¥5,000 (tax-free minimum)" />
        <RefRow jp="10,000円" rom="i·chi·man en" meaning="¥10,000 (one big bill)" />
      </div>

      {/* Time */}
      <div>
        <p className="text-xs text-slate-500 mb-1">Hours — 〜時 (ji)</p>
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

      {/* Minutes */}
      <div>
        <p className="text-xs text-slate-500 mb-1">Minutes — 〜分 (fun/pun) — tricky!</p>
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

      {/* Days */}
      <div>
        <p className="text-xs text-slate-500 mb-1">Days of Stay — 〜泊 (haku/paku)</p>
        <RefRow jp="一泊" rom="ip·pa·ku" meaning="1 night ⚠️" />
        <RefRow jp="二泊" rom="ni·ha·ku" meaning="2 nights" />
        <RefRow jp="三泊" rom="san·pa·ku" meaning="3 nights ⚠️" />
        <RefRow jp="四泊" rom="yon·ha·ku" meaning="4 nights" />
        <RefRow jp="五泊" rom="go·ha·ku" meaning="5 nights" />
      </div>

      {/* People */}
      <div>
        <p className="text-xs text-slate-500 mb-1">People — 〜人 (special readings!)</p>
        <RefRow jp="ひとり" rom="hi·to·ri" meaning="1 person (NOT ichi·nin)" />
        <RefRow jp="ふたり" rom="fu·ta·ri" meaning="2 people (NOT ni·nin) ← your default!" />
        <RefRow jp="三人" rom="san·nin" meaning="3 people" />
        <RefRow jp="四人" rom="yo·nin" meaning="4 people (NOT yon·nin)" />
        <RefRow jp="五人" rom="go·nin" meaning="5 people" />
      </div>
    </div>
  );
}

function ParticlesRef() {
  return (
    <div className="mt-2">
      <RefRow jp="は" rom="wa" meaning="Topic marker — marks what you're talking about" />
      <RefRow jp="が" rom="ga" meaning="Subject marker — marks who/what does the action" />
      <RefRow jp="を" rom="wo" meaning="Object marker — marks what receives the action" />
      <RefRow jp="に" rom="ni" meaning="Direction/time — to, at, in, on" />
      <RefRow jp="で" rom="de" meaning="Location of action / by means of" />
      <RefRow jp="へ" rom="e" meaning="Towards (direction)" />
      <RefRow jp="の" rom="no" meaning="Possessive / connecting — 's, of" />
      <RefRow jp="と" rom="to" meaning="And, with (listing/companion)" />
      <RefRow jp="も" rom="mo" meaning="Also, too" />
      <RefRow jp="か" rom="ka" meaning="Question marker (end of sentence)" />
      <RefRow jp="から" rom="ka·ra" meaning="From (place/time)" />
      <RefRow jp="まで" rom="ma·de" meaning="Until, to (endpoint)" />
    </div>
  );
}

function CountersRef() {
  return (
    <div className="mt-2">
      <p className="text-xs text-slate-500 mb-2">Japanese uses different counters for different objects (like Chinese 量詞)</p>
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

function PatternsRef() {
  return (
    <div className="mt-2 space-y-3">
      <div className="bg-slate-700/30 rounded-lg p-2">
        <p className="text-sm text-slate-200 font-medium">○○をお願いします</p>
        <p className="text-xs text-sakura-300">○○ wo onegaishimasu</p>
        <p className="text-xs text-slate-400 mt-1">○○ please — works for anything! Water, menu, bill...</p>
      </div>
      <div className="bg-slate-700/30 rounded-lg p-2">
        <p className="text-sm text-slate-200 font-medium">○○はありますか</p>
        <p className="text-xs text-sakura-300">○○ wa arimasu ka</p>
        <p className="text-xs text-slate-400 mt-1">Is there ○○? / Do you have ○○?</p>
      </div>
      <div className="bg-slate-700/30 rounded-lg p-2">
        <p className="text-sm text-slate-200 font-medium">○○はどこですか</p>
        <p className="text-xs text-sakura-300">○○ wa doko desu ka</p>
        <p className="text-xs text-slate-400 mt-1">Where is ○○?</p>
      </div>
      <div className="bg-slate-700/30 rounded-lg p-2">
        <p className="text-sm text-slate-200 font-medium">○○してもいいですか</p>
        <p className="text-xs text-sakura-300">○○ shite mo ii desu ka</p>
        <p className="text-xs text-slate-400 mt-1">May I ○○? (asking permission)</p>
      </div>
      <div className="bg-slate-700/30 rounded-lg p-2">
        <p className="text-sm text-slate-200 font-medium">○○てください</p>
        <p className="text-xs text-sakura-300">○○ te kudasai</p>
        <p className="text-xs text-slate-400 mt-1">Please do ○○ (polite request)</p>
      </div>
      <div className="bg-slate-700/30 rounded-lg p-2">
        <p className="text-sm text-slate-200 font-medium">○○がわかりません</p>
        <p className="text-xs text-sakura-300">○○ ga wakarimasen</p>
        <p className="text-xs text-slate-400 mt-1">I don't understand ○○</p>
      </div>
      <div className="bg-slate-700/30 rounded-lg p-2">
        <p className="text-sm text-slate-200 font-medium">○○たいです</p>
        <p className="text-xs text-sakura-300">○○ tai desu</p>
        <p className="text-xs text-slate-400 mt-1">I want to ○○ (desire)</p>
      </div>
    </div>
  );
}

function PoliteRef() {
  return (
    <div className="mt-2">
      <p className="text-xs text-slate-500 mb-2">Japanese has different politeness levels. Use ます (masu) form for all travel situations.</p>
      <div className="space-y-2">
        <div className="bg-slate-700/30 rounded-lg p-2">
          <div className="flex justify-between">
            <span className="text-sm text-slate-200">〜ます</span>
            <span className="text-xs text-slate-500">Polite positive</span>
          </div>
          <p className="text-xs text-slate-400">行きます (ikimasu) = I go</p>
        </div>
        <div className="bg-slate-700/30 rounded-lg p-2">
          <div className="flex justify-between">
            <span className="text-sm text-slate-200">〜ません</span>
            <span className="text-xs text-slate-500">Polite negative</span>
          </div>
          <p className="text-xs text-slate-400">行きません (ikimasen) = I don't go</p>
        </div>
        <div className="bg-slate-700/30 rounded-lg p-2">
          <div className="flex justify-between">
            <span className="text-sm text-slate-200">〜ました</span>
            <span className="text-xs text-slate-500">Polite past</span>
          </div>
          <p className="text-xs text-slate-400">行きました (ikimashita) = I went</p>
        </div>
        <div className="bg-slate-700/30 rounded-lg p-2">
          <div className="flex justify-between">
            <span className="text-sm text-slate-200">〜です</span>
            <span className="text-xs text-slate-500">Polite copula (is/am)</span>
          </div>
          <p className="text-xs text-slate-400">二人です (futari desu) = There are two of us</p>
        </div>
      </div>
    </div>
  );
}

function SignsRef() {
  return (
    <div className="mt-2">
      <p className="text-xs text-slate-500 mb-2">Common signs you'll see everywhere — your Chinese kanji knowledge helps!</p>
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
