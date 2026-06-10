import { useState } from 'react';

type Section = 'particles' | 'counters' | 'patterns' | 'polite' | 'signs';

const SECTIONS: { id: Section; label: string; emoji: string }[] = [
  { id: 'particles', label: 'Key Particles', emoji: '🔤' },
  { id: 'counters', label: 'Counters', emoji: '🔢' },
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
    <div className="flex items-baseline gap-2 py-1.5 border-b border-slate-700/30 last:border-0">
      <span className="text-base font-medium text-slate-100 w-10 shrink-0">{jp}</span>
      <span className="text-xs text-sakura-300 w-12 shrink-0">{rom}</span>
      <span className="text-xs text-slate-400 flex-1">{meaning}</span>
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
      <RefRow jp="から" rom="kara" meaning="From (place/time)" />
      <RefRow jp="まで" rom="made" meaning="Until, to (endpoint)" />
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
      <RefRow jp="〜泊" rom="-haku" meaning="Nights (hotel): いっぱく(1), にはく(2)" />
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
      <RefRow jp="入口" rom="iriguchi" meaning="Entrance 入口" />
      <RefRow jp="出口" rom="deguchi" meaning="Exit 出口" />
      <RefRow jp="非常口" rom="hijōguchi" meaning="Emergency exit 緊急出口" />
      <RefRow jp="禁煙" rom="kinen" meaning="No smoking 禁菸" />
      <RefRow jp="立入禁止" rom="tachiiri kinshi" meaning="No entry 禁止進入" />
      <RefRow jp="撮影禁止" rom="satsuei kinshi" meaning="No photography 禁止攝影" />
      <RefRow jp="営業中" rom="eigyōchū" meaning="Open for business 營業中" />
      <RefRow jp="準備中" rom="junbichū" meaning="Preparing (not open yet) 準備中" />
      <RefRow jp="定休日" rom="teikyūbi" meaning="Regular holiday/closed day 定休日" />
      <RefRow jp="男" rom="otoko" meaning="Male (bathroom) 男" />
      <RefRow jp="女" rom="onna" meaning="Female (bathroom) 女" />
      <RefRow jp="押" rom="osu" meaning="Push 推" />
      <RefRow jp="引" rom="hiku" meaning="Pull 拉" />
      <RefRow jp="無料" rom="muryō" meaning="Free (no charge) 免費" />
      <RefRow jp="有料" rom="yūryō" meaning="Paid 收費" />
      <RefRow jp="割引" rom="waribiki" meaning="Discount 折扣" />
      <RefRow jp="税込" rom="zeikomi" meaning="Tax included 含稅" />
      <RefRow jp="税抜" rom="zeinuki" meaning="Tax excluded 未稅" />
    </div>
  );
}
