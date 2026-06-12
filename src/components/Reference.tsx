import { useState, useCallback, useEffect } from 'react';
import { speak } from '../utils/tts';
import { useSlidePanel } from '../utils/useSlidePanel';

type Section = 'gojuon' | 'grammar' | 'particles' | 'polite' | 'numbers' | 'converter' | 'counters' | 'yesno' | 'whquestions' | 'patterns' | 'signs';

const LEARN_STEPS: { id: Section; label: string; emoji: string; desc: string }[] = [
  { id: 'gojuon', label: '50 Sounds', emoji: 'あ', desc: 'Hiragana & Katakana chart' },
  { id: 'grammar', label: 'Sentence Structure', emoji: '📝', desc: 'S は O を V ます word order' },
  { id: 'particles', label: 'Key Particles', emoji: '🔤', desc: 'は が を に で の and more' },
  { id: 'polite', label: 'Polite Forms', emoji: '🎩', desc: 'ます ません ました です' },
  { id: 'numbers', label: 'Numbers', emoji: '🔢', desc: 'Counting, prices, time' },
  { id: 'yesno', label: 'Yes/No Questions', emoji: '❓', desc: 'Statement + か = question' },
  { id: 'whquestions', label: 'Question Words', emoji: '🔍', desc: '何 どこ いつ いくら どう' },
];

const TOOLS: { id: Section; label: string; emoji: string; desc: string }[] = [
  { id: 'converter', label: 'Number Converter', emoji: '🔄', desc: 'Type a number → kanji + reading' },
  { id: 'counters', label: 'Counters', emoji: '📏', desc: 'つ 人 枚 本 杯 (like 量詞)' },
  { id: 'patterns', label: 'Sentence Patterns', emoji: '📐', desc: 'お願いします ありますか etc.' },
  { id: 'signs', label: 'Common Signs', emoji: '🪧', desc: '入口 出口 禁煙 営業中' },
];

const ALL_SECTIONS = [...LEARN_STEPS, ...TOOLS];

type DrawerData = {
  title: string;
  titleRom?: string;
  subtitle?: string;
  items: { jp: string; hep: string; en: string }[];
} | null;

function Drawer({ data, onClose }: { data: DrawerData; onClose: () => void }) {
  const [closing, setClosing] = useState(false);
  useEffect(() => {
    if (data) {
      document.body.style.overflow = 'hidden';
      setClosing(false);
    }
    return () => { document.body.style.overflow = ''; };
  }, [data]);
  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 200);
  }, [onClose]);
  if (!data) return null;
  return (
    <div className={`fixed inset-0 z-50 flex flex-col justify-end transition-opacity duration-200 ${closing ? 'opacity-0' : 'opacity-100'}`} onClick={handleClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div
        className={`relative bg-slate-800 rounded-t-2xl max-h-[80vh] flex flex-col ${closing ? 'animate-slide-down' : 'animate-slide-up'}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 rounded-full bg-slate-600" />
        </div>
        <div className="px-4 pb-2 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-100">{data.title}</h3>
              {data.titleRom && <p className="text-base text-sakura-300">{data.titleRom}</p>}
            </div>
            <button onClick={handleClose} className="text-xl text-slate-400 p-2">✕</button>
          </div>
          {data.subtitle && <p className="text-base text-slate-400 mt-0.5">{data.subtitle}</p>}
        </div>
        <div className="overflow-y-auto p-4 space-y-2">
          {data.items.map((ex, i) => (
            <div key={i} className="bg-slate-700/30 rounded-lg p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1">
                  <p className="text-base text-slate-200">{ex.jp}</p>
                  <p className="text-base text-sakura-300">{ex.hep}</p>
                </div>
                <button onClick={() => speak(ex.jp, 'ja-JP')} className="text-lg active:scale-110 shrink-0 p-1">🔊</button>
              </div>
              <p className="text-base text-slate-400 mt-1">{ex.en}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface RefProps {
  refBookmarkedIds?: Set<string>;
  onToggleRefBookmark?: (item: { jp: string; hep: string; en: string; section: string }) => void;
  learnedIds?: Set<string>;
  onToggleLearned?: (id: string) => void;
}

export function Reference({ refBookmarkedIds = new Set(), onToggleRefBookmark, learnedIds = new Set(), onToggleLearned }: RefProps) {
  const panel = useSlidePanel<Section>();
  const [drawer, setDrawer] = useState<DrawerData>(null);
  const openDrawer = useCallback((d: DrawerData) => setDrawer(d), []);
  const closeDrawer = useCallback(() => setDrawer(null), []);

  const activeMeta = ALL_SECTIONS.find(s => s.id === panel.value);

  return (
    <div className="h-full relative">
      {/* L1: Section grid */}
      <div className="scroll-area h-full">
        <div className="px-4 py-3 border-b border-slate-800">
          <h2 className="text-lg font-bold">📚 Quick Reference</h2>
          <p className="text-base text-slate-400">Grammar & tools for travel</p>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <h3 className="text-base font-semibold text-slate-400 mb-2">📖 Learn — 7 Steps</h3>
            <div className="grid grid-cols-2 gap-2">
              {LEARN_STEPS.map((sec, i) => (
                <button
                  key={sec.id}
                  onClick={() => panel.open(sec.id)}
                  className="bg-slate-800/60 rounded-xl p-3 text-left active:bg-slate-700/50 transition flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-2xl">{sec.emoji}</span>
                    <span className="text-sm text-sakura-400/60 font-medium">{i + 1}</span>
                  </div>
                  <span className="text-base font-semibold text-slate-100">{sec.label}</span>
                  <span className="text-sm text-slate-500 leading-tight">{sec.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-base font-semibold text-slate-400 mb-2">🧰 Tools & Reference</h3>
            <div className="grid grid-cols-2 gap-2">
              {TOOLS.map(sec => (
                <button
                  key={sec.id}
                  onClick={() => panel.open(sec.id)}
                  className="bg-slate-800/60 rounded-xl p-3 text-left active:bg-slate-700/50 transition flex flex-col gap-1"
                >
                  <span className="text-2xl">{sec.emoji}</span>
                  <span className="text-base font-semibold text-slate-100">{sec.label}</span>
                  <span className="text-sm text-slate-500 leading-tight">{sec.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* L2: Full-page slide-in */}
      {panel.visible && (
        <div className={`absolute inset-0 bg-slate-950 ${panel.animClass} flex flex-col z-40`}>
          <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 shrink-0">
            <button onClick={() => panel.close()} className="text-base text-slate-400 active:text-slate-200 p-1">
              ← Quick Reference
            </button>
            <h2 className="text-lg font-bold flex-1">{activeMeta?.emoji} {activeMeta?.label}</h2>
          </div>
          <div className="scroll-area flex-1 px-3 pb-3">
            {panel.value === 'gojuon' && <GojuonRef openDrawer={openDrawer} />}
            {panel.value === 'grammar' && <GrammarRef rbIds={refBookmarkedIds} onRbToggle={onToggleRefBookmark} learnedIds={learnedIds} onToggleLearned={onToggleLearned} />}
            {panel.value === 'numbers' && <NumbersRef />}
            {panel.value === 'converter' && <NumberConverter />}
            {panel.value === 'particles' && <ParticlesRef rbIds={refBookmarkedIds} onRbToggle={onToggleRefBookmark} learnedIds={learnedIds} onToggleLearned={onToggleLearned} />}
            {panel.value === 'counters' && <CountersRef rbIds={refBookmarkedIds} onRbToggle={onToggleRefBookmark} learnedIds={learnedIds} onToggleLearned={onToggleLearned} />}
            {panel.value === 'patterns' && <PatternsRef rbIds={refBookmarkedIds} onRbToggle={onToggleRefBookmark} learnedIds={learnedIds} onToggleLearned={onToggleLearned} />}
            {panel.value === 'polite' && <PoliteRef rbIds={refBookmarkedIds} onRbToggle={onToggleRefBookmark} learnedIds={learnedIds} onToggleLearned={onToggleLearned} />}
            {panel.value === 'yesno' && <YesNoRef rbIds={refBookmarkedIds} onRbToggle={onToggleRefBookmark} learnedIds={learnedIds} onToggleLearned={onToggleLearned} />}
            {panel.value === 'whquestions' && <WHQuestionsRef rbIds={refBookmarkedIds} onRbToggle={onToggleRefBookmark} learnedIds={learnedIds} onToggleLearned={onToggleLearned} />}
            {panel.value === 'signs' && <SignsRef />}
          </div>
        </div>
      )}

      {/* L3: Drawer for examples */}
      <Drawer data={drawer} onClose={closeDrawer} />
    </div>
  );
}

function RefRow({ jp, rom, meaning }: { jp: string; rom: string; meaning: string }) {
  return (
    <div className="py-1.5 border-b border-slate-700/40 last:border-0">
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
// Vocab examples keyed by romanization — travel-useful words featuring each sound
const KANA_VOCAB: Record<string, { jp: string; hep: string; en: string }[]> = {
  a: [{ jp: 'ありがとう', hep: 'a·ri·ga·tou', en: 'Thank you' }, { jp: 'あさ', hep: 'a·sa', en: 'Morning' }, { jp: 'あつい', hep: 'a·tsu·i', en: 'Hot (weather)' }],
  i: [{ jp: 'いくら', hep: 'i·ku·ra', en: 'How much?' }, { jp: 'いち', hep: 'i·chi', en: 'One (1)' }, { jp: 'いりません', hep: 'i·ri·ma·sen', en: "I don't need it" }],
  u: [{ jp: 'うどん', hep: 'u·don', en: 'Udon noodles' }, { jp: 'うえ', hep: 'u·e', en: 'Up / above' }],
  e: [{ jp: 'えき', hep: 'e·ki', en: 'Station' }, { jp: '円', hep: 'en', en: 'Yen (¥)' }, { jp: 'エレベーター', hep: 'e·re·bee·taa', en: 'Elevator' }],
  o: [{ jp: 'おいしい', hep: 'o·i·shii', en: 'Delicious' }, { jp: 'お願いします', hep: 'o·ne·gai·shi·ma·su', en: 'Please' }, { jp: 'おはよう', hep: 'o·ha·you', en: 'Good morning' }],
  ka: [{ jp: 'かわいい', hep: 'ka·wa·ii', en: 'Cute' }, { jp: '会計', hep: 'kai·kei', en: 'Bill/check' }, { jp: 'かさ', hep: 'ka·sa', en: 'Umbrella' }],
  ki: [{ jp: '切符', hep: 'kip·pu', en: 'Ticket' }, { jp: 'きれい', hep: 'ki·rei', en: 'Beautiful/clean' }, { jp: '昨日', hep: 'ki·nou', en: 'Yesterday' }],
  ku: [{ jp: '空港', hep: 'kuu·kou', en: 'Airport' }, { jp: 'ください', hep: 'ku·da·sai', en: 'Please (give me)' }, { jp: '薬', hep: 'ku·su·ri', en: 'Medicine' }],
  ke: [{ jp: '今朝', hep: 'ke·sa', en: 'This morning' }, { jp: '携帯', hep: 'kei·tai', en: 'Mobile phone' }],
  ko: [{ jp: 'ここ', hep: 'ko·ko', en: 'Here' }, { jp: 'これ', hep: 'ko·re', en: 'This' }, { jp: 'コンビニ', hep: 'kon·bi·ni', en: 'Convenience store' }],
  sa: [{ jp: 'さむい', hep: 'sa·mu·i', en: 'Cold (weather)' }, { jp: 'さかな', hep: 'sa·ka·na', en: 'Fish' }, { jp: 'さくら', hep: 'sa·ku·ra', en: 'Cherry blossom' }],
  shi: [{ jp: '新幹線', hep: 'shin·kan·sen', en: 'Bullet train' }, { jp: '写真', hep: 'sha·shin', en: 'Photo' }, { jp: 'しお', hep: 'shi·o', en: 'Salt' }],
  su: [{ jp: 'すみません', hep: 'su·mi·ma·sen', en: 'Excuse me / Sorry' }, { jp: 'すし', hep: 'su·shi', en: 'Sushi' }, { jp: 'すき', hep: 'su·ki', en: 'Like / favorite' }],
  se: [{ jp: 'せき', hep: 'se·ki', en: 'Seat' }, { jp: '先生', hep: 'sen·sei', en: 'Teacher' }],
  so: [{ jp: 'そこ', hep: 'so·ko', en: 'There' }, { jp: 'そば', hep: 'so·ba', en: 'Soba noodles' }],
  ta: [{ jp: '食べます', hep: 'ta·be·ma·su', en: 'Eat' }, { jp: 'タクシー', hep: 'ta·ku·shii', en: 'Taxi' }, { jp: 'たかい', hep: 'ta·kai', en: 'Expensive / tall' }],
  chi: [{ jp: '地下鉄', hep: 'chi·ka·te·tsu', en: 'Subway' }, { jp: 'ちかい', hep: 'chi·kai', en: 'Near / close' }, { jp: 'チェックイン', hep: 'chek·ku·in', en: 'Check-in' }],
  tsu: [{ jp: 'つめたい', hep: 'tsu·me·tai', en: 'Cold (drink/food)' }, { jp: 'ひとつ', hep: 'hi·to·tsu', en: 'One (counter)' }],
  te: [{ jp: '天気', hep: 'ten·ki', en: 'Weather' }, { jp: '手', hep: 'te', en: 'Hand' }, { jp: 'てんぷら', hep: 'ten·pu·ra', en: 'Tempura' }],
  to: [{ jp: 'トイレ', hep: 'toi·re', en: 'Toilet' }, { jp: '東京', hep: 'tou·kyou', en: 'Tokyo' }, { jp: 'とりにく', hep: 'to·ri·ni·ku', en: 'Chicken meat' }],
  na: [{ jp: '名古屋', hep: 'na·go·ya', en: 'Nagoya' }, { jp: '名前', hep: 'na·ma·e', en: 'Name' }, { jp: 'なに', hep: 'na·ni', en: 'What?' }],
  ni: [{ jp: '日本語', hep: 'ni·hon·go', en: 'Japanese language' }, { jp: '荷物', hep: 'ni·mo·tsu', en: 'Luggage' }, { jp: 'にく', hep: 'ni·ku', en: 'Meat' }],
  nu: [{ jp: 'ぬるい', hep: 'nu·ru·i', en: 'Lukewarm' }],
  ne: [{ jp: '値段', hep: 'ne·dan', en: 'Price' }, { jp: 'ねこ', hep: 'ne·ko', en: 'Cat' }],
  no: [{ jp: '飲みます', hep: 'no·mi·ma·su', en: 'Drink' }, { jp: 'のりもの', hep: 'no·ri·mo·no', en: 'Vehicle / ride' }],
  ha: [{ jp: 'はい', hep: 'hai', en: 'Yes' }, { jp: '話します', hep: 'ha·na·shi·ma·su', en: 'Speak' }, { jp: '花', hep: 'ha·na', en: 'Flower' }],
  hi: [{ jp: 'ひとり', hep: 'hi·to·ri', en: 'One person / alone' }, { jp: 'ひだり', hep: 'hi·da·ri', en: 'Left (direction)' }, { jp: '飛行機', hep: 'hi·kou·ki', en: 'Airplane' }],
  fu: [{ jp: 'ふたり', hep: 'fu·ta·ri', en: 'Two people' }, { jp: 'ふゆ', hep: 'fu·yu', en: 'Winter' }],
  he: [{ jp: '部屋', hep: 'he·ya', en: 'Room' }, { jp: 'へいわ', hep: 'hei·wa', en: 'Peace' }],
  ho: [{ jp: 'ホテル', hep: 'ho·te·ru', en: 'Hotel' }, { jp: 'ほしい', hep: 'ho·shii', en: 'Want (something)' }],
  ma: [{ jp: '待ちます', hep: 'ma·chi·ma·su', en: 'Wait' }, { jp: 'まっすぐ', hep: 'mas·su·gu', en: 'Straight ahead' }, { jp: 'まずい', hep: 'ma·zui', en: 'Bad taste' }],
  mi: [{ jp: '水', hep: 'mi·zu', en: 'Water' }, { jp: 'みぎ', hep: 'mi·gi', en: 'Right (direction)' }, { jp: 'みせ', hep: 'mi·se', en: 'Shop / store' }],
  mu: [{ jp: '無料', hep: 'mu·ryou', en: 'Free (no charge)' }, { jp: 'むずかしい', hep: 'mu·zu·ka·shii', en: 'Difficult' }],
  me: [{ jp: 'メニュー', hep: 'me·nyuu', en: 'Menu' }, { jp: 'めがね', hep: 'me·ga·ne', en: 'Glasses' }],
  mo: [{ jp: 'もう一度', hep: 'mou i·chi·do', en: 'One more time' }, { jp: 'もの', hep: 'mo·no', en: 'Thing / item' }],
  ya: [{ jp: 'やすい', hep: 'ya·su·i', en: 'Cheap' }, { jp: 'やさい', hep: 'ya·sai', en: 'Vegetables' }, { jp: '薬局', hep: 'yak·kyoku', en: 'Pharmacy' }],
  yu: [{ jp: 'ゆっくり', hep: 'yuk·ku·ri', en: 'Slowly' }, { jp: 'ゆき', hep: 'yu·ki', en: 'Snow' }],
  yo: [{ jp: '予約', hep: 'yo·ya·ku', en: 'Reservation' }, { jp: 'よる', hep: 'yo·ru', en: 'Night' }, { jp: 'ようこそ', hep: 'you·ko·so', en: 'Welcome' }],
  ra: [{ jp: 'ラーメン', hep: 'raa·men', en: 'Ramen' }, { jp: '来週', hep: 'rai·shuu', en: 'Next week' }],
  ri: [{ jp: '旅行', hep: 'ryo·kou', en: 'Travel / trip' }, { jp: 'りんご', hep: 'rin·go', en: 'Apple' }],
  ru: [{ jp: 'るすばん', hep: 'ru·su·ban', en: 'House-sitting' }],
  re: [{ jp: 'レストラン', hep: 're·su·to·ran', en: 'Restaurant' }, { jp: '冷蔵庫', hep: 'rei·zou·ko', en: 'Refrigerator' }],
  ro: [{ jp: '六', hep: 'ro·ku', en: 'Six (6)' }, { jp: 'ロッカー', hep: 'rok·kaa', en: 'Locker' }],
  wa: [{ jp: 'わかります', hep: 'wa·ka·ri·ma·su', en: 'Understand' }, { jp: 'わさび', hep: 'wa·sa·bi', en: 'Wasabi' }],
  wo: [{ jp: '水をください', hep: 'mi·zu wo ku·da·sai', en: 'Water please' }],
  n: [{ jp: '何', hep: 'na·ni', en: 'What?' }, { jp: 'パン', hep: 'pan', en: 'Bread' }, { jp: 'ラーメン', hep: 'raa·men', en: 'Ramen' }],
  // Voiced (dakuten)
  ga: [{ jp: '外国人', hep: 'gai·ko·ku·jin', en: 'Foreigner' }, { jp: 'がんばって', hep: 'gan·bat·te', en: 'Good luck / Do your best' }],
  gi: [{ jp: '牛肉', hep: 'gyuu·ni·ku', en: 'Beef' }, { jp: '銀行', hep: 'gin·kou', en: 'Bank' }],
  gu: [{ jp: 'ぐらい', hep: 'gu·rai', en: 'About / approximately' }],
  ge: [{ jp: '元気', hep: 'gen·ki', en: 'Healthy / fine' }, { jp: '下車', hep: 'ge·sha', en: 'Getting off (train)' }],
  go: [{ jp: 'ごめんなさい', hep: 'go·men·na·sai', en: 'I\'m sorry' }, { jp: '午後', hep: 'go·go', en: 'Afternoon / PM' }],
  za: [{ jp: '座席', hep: 'za·se·ki', en: 'Seat' }],
  ji: [{ jp: '時間', hep: 'ji·kan', en: 'Time / hours' }, { jp: '自動販売機', hep: 'ji·dou·han·bai·ki', en: 'Vending machine' }],
  zu: [{ jp: 'ずっと', hep: 'zut·to', en: 'All the time / much more' }],
  ze: [{ jp: '全部', hep: 'zen·bu', en: 'Everything / all' }],
  zo: [{ jp: '雑巾', hep: 'zou·kin', en: 'Cloth / rag' }],
  da: [{ jp: '大丈夫', hep: 'dai·jou·bu', en: 'It\'s okay / I\'m fine' }, { jp: '大学', hep: 'dai·ga·ku', en: 'University' }],
  di: [{ jp: 'ぢは使わない', hep: 'di wa tsu·ka·wa·nai', en: 'Rarely used — じ(ji) is standard' }],
  du: [{ jp: 'づは使わない', hep: 'du wa tsu·ka·wa·nai', en: 'Rarely used — ず(zu) is standard' }],
  de: [{ jp: '電車', hep: 'den·sha', en: 'Train' }, { jp: '出口', hep: 'de·gu·chi', en: 'Exit' }],
  do: [{ jp: 'どこ', hep: 'do·ko', en: 'Where?' }, { jp: 'どうぞ', hep: 'dou·zo', en: 'Please / Go ahead' }],
  ba: [{ jp: 'バス', hep: 'ba·su', en: 'Bus' }, { jp: '場所', hep: 'ba·sho', en: 'Place / location' }],
  bi: [{ jp: 'ビール', hep: 'bii·ru', en: 'Beer' }, { jp: '美術館', hep: 'bi·ju·tsu·kan', en: 'Art museum' }],
  bu: [{ jp: '部屋', hep: 'bu? → he·ya', en: 'Note: 部屋 reads he·ya not bu·ya' }, { jp: 'ぶたにく', hep: 'bu·ta·ni·ku', en: 'Pork' }],
  be: [{ jp: '弁当', hep: 'ben·tou', en: 'Bento / lunchbox' }, { jp: '便利', hep: 'ben·ri', en: 'Convenient' }],
  bo: [{ jp: '帽子', hep: 'bou·shi', en: 'Hat / cap' }],
  // Handakuten (p-sounds)
  pa: [{ jp: 'パスポート', hep: 'pa·su·poo·to', en: 'Passport' }, { jp: 'パン', hep: 'pan', en: 'Bread' }],
  pi: [{ jp: 'ピザ', hep: 'pi·za', en: 'Pizza' }],
  pu: [{ jp: 'プレゼント', hep: 'pu·re·zen·to', en: 'Gift / present' }],
  pe: [{ jp: 'ペットボトル', hep: 'pet·to·bo·to·ru', en: 'Plastic bottle' }],
  po: [{ jp: 'ポケット', hep: 'po·ket·to', en: 'Pocket' }, { jp: 'ポスト', hep: 'po·su·to', en: 'Mailbox / post' }],
};

function GojuonRef({ openDrawer }: { openDrawer: DrawerOpener }) {
  const [chart, setChart] = useState<'hiragana' | 'katakana'>('hiragana');
  const [showVoiced, setShowVoiced] = useState(false);

  // Map: base romanization → voiced version (char + romanization)
  const voicedMap: Record<string, { h: string; k: string; rom: string }> = {
    ka: { h: 'が', k: 'ガ', rom: 'ga' }, ki: { h: 'ぎ', k: 'ギ', rom: 'gi' }, ku: { h: 'ぐ', k: 'グ', rom: 'gu' }, ke: { h: 'げ', k: 'ゲ', rom: 'ge' }, ko: { h: 'ご', k: 'ゴ', rom: 'go' },
    sa: { h: 'ざ', k: 'ザ', rom: 'za' }, shi: { h: 'じ', k: 'ジ', rom: 'ji' }, su: { h: 'ず', k: 'ズ', rom: 'zu' }, se: { h: 'ぜ', k: 'ゼ', rom: 'ze' }, so: { h: 'ぞ', k: 'ゾ', rom: 'zo' },
    ta: { h: 'だ', k: 'ダ', rom: 'da' }, chi: { h: 'ぢ', k: 'ヂ', rom: 'di' }, tsu: { h: 'づ', k: 'ヅ', rom: 'du' }, te: { h: 'で', k: 'デ', rom: 'de' }, to: { h: 'ど', k: 'ド', rom: 'do' },
    ha: { h: 'ば', k: 'バ', rom: 'ba' }, hi: { h: 'び', k: 'ビ', rom: 'bi' }, fu: { h: 'ぶ', k: 'ブ', rom: 'bu' }, he: { h: 'べ', k: 'ベ', rom: 'be' }, ho: { h: 'ぼ', k: 'ボ', rom: 'bo' },
  };
  const handakutenMap: Record<string, { h: string; k: string; rom: string }> = {
    ha: { h: 'ぱ', k: 'パ', rom: 'pa' }, hi: { h: 'ぴ', k: 'ピ', rom: 'pi' }, fu: { h: 'ぷ', k: 'プ', rom: 'pu' }, he: { h: 'ぺ', k: 'ペ', rom: 'pe' }, ho: { h: 'ぽ', k: 'ポ', rom: 'po' },
  };

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

  const baseData = chart === 'hiragana' ? hiragana : katakana;

  const handleTap = (char: string, rom: string) => {
    speak(char, 'ja-JP');
    const vocab = KANA_VOCAB[rom];
    if (vocab && vocab.length > 0) {
      openDrawer({
        title: char,
        titleRom: rom,
        subtitle: `Words with ${rom} — tap 🔊 to hear`,
        items: vocab,
      });
    }
  };

  return (
    <div className="mt-2">
      <p className="text-base text-slate-500 mb-2">Tap any character to hear it + see real vocab</p>

      {/* Tablist */}
      <div className="flex gap-2 mb-2">
        <button onClick={() => setChart('hiragana')} className={`flex-1 py-2 rounded-lg text-base transition ${chart === 'hiragana' ? 'bg-sakura-500/60 text-white' : 'bg-slate-700/50 text-slate-400'}`}>
          ひらがな
        </button>
        <button onClick={() => setChart('katakana')} className={`flex-1 py-2 rounded-lg text-base transition ${chart === 'katakana' ? 'bg-sakura-500/60 text-white' : 'bg-slate-700/50 text-slate-400'}`}>
          カタカナ
        </button>
      </div>

      {/* Voiced toggle banner */}
      <div className="flex items-center justify-between bg-slate-700/30 rounded-lg px-3 py-2 mb-2">
        <div className="flex-1">
          <p className="text-base text-slate-400">Voiced ゛゜</p>
          {showVoiced && (
            <p className="text-sm text-indigo-300 mt-0.5">か→が　さ→ざ　た→だ　は→ば/ぱ</p>
          )}
        </div>
        <button
          onClick={() => setShowVoiced(!showVoiced)}
          className={`px-3 py-1 rounded-full text-sm transition ${showVoiced ? 'bg-indigo-500/50 text-indigo-200' : 'bg-slate-600/40 text-slate-500'}`}
        >
          {showVoiced ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-5 gap-1">
        {baseData.flat().map((cell, i) => {
          if (!cell) return <div key={i} className="h-14" />;
          const [baseChar, baseRom] = [cell.split(' ')[0], cell.split(' ')[1]];

          // When voiced toggle is ON, show voiced version if available
          const voiced = showVoiced ? voicedMap[baseRom] : null;
          const handaku = showVoiced ? handakutenMap[baseRom] : null;

          if (showVoiced && !voiced && !handaku) {
            // No voiced variant — show dimmed base
            return (
              <div key={i} className="rounded-lg h-14 flex flex-col items-center justify-center bg-slate-700/10 opacity-30">
                <span className="text-lg text-slate-500">{baseChar}</span>
                <span className="text-base text-slate-600">{baseRom}</span>
              </div>
            );
          }

          if (showVoiced && (voiced || handaku)) {
            // Show voiced + handakuten variants stacked
            const isHaRow = !!handaku;
            return (
              <div key={i} className="flex flex-col gap-0.5">
                {voiced && (() => {
                  const vChar = chart === 'hiragana' ? voiced.h : voiced.k;
                  return (
                    <button
                      onClick={() => handleTap(vChar, voiced.rom)}
                      className={`rounded-lg flex flex-col items-center justify-center active:bg-indigo-600 transition bg-indigo-500/20 ${isHaRow ? 'h-14' : 'h-14'}`}
                    >
                      <span className="text-lg text-slate-100">{vChar}</span>
                      <span className="text-base text-indigo-300">{voiced.rom}</span>
                    </button>
                  );
                })()}
                {handaku && (() => {
                  const pChar = chart === 'hiragana' ? handaku.h : handaku.k;
                  return (
                    <button
                      onClick={() => handleTap(pChar, handaku.rom)}
                      className="rounded-lg h-14 flex flex-col items-center justify-center active:bg-purple-600 transition bg-purple-500/20"
                    >
                      <span className="text-lg text-slate-100">{pChar}</span>
                      <span className="text-base text-purple-300">{handaku.rom}</span>
                    </button>
                  );
                })()}
              </div>
            );
          }

          // Normal (voiced OFF)
          const hasVocab = KANA_VOCAB[baseRom] && KANA_VOCAB[baseRom].length > 0;
          return (
            <button
              key={i}
              onClick={() => handleTap(baseChar, baseRom)}
              className={`rounded-lg h-14 flex flex-col items-center justify-center active:bg-slate-600 transition ${hasVocab ? 'bg-slate-700/40' : 'bg-slate-700/20'}`}
            >
              <span className="text-lg text-slate-100">{baseChar}</span>
              <span className="text-base text-sakura-300">{baseRom}</span>
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
        <div className="bg-slate-700/40 rounded-xl p-3 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="text-lg font-medium text-slate-50">{result.kanji}</p>
              <p className="text-base text-sakura-300">{result.romaji}</p>
              <p className="text-base text-slate-400">{result.reading}</p>
            </div>
            <button onClick={() => speak(result.reading, 'ja-JP')} className="p-1 rounded-lg active:bg-slate-600 text-lg shrink-0">🔊</button>
          </div>
          {!isNaN(num) && num > 0 && (
            <div className="mt-1 pt-2 border-t border-slate-700/40 space-y-1">
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
          <div className="mt-2 pt-2 border-t border-slate-700/40">
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

type DrawerOpener = (d: DrawerData) => void;

interface RbProps {
  rbIds?: Set<string>;
  onRbToggle?: (item: { jp: string; hep: string; en: string; section: string }) => void;
  learnedIds?: Set<string>;
  onToggleLearned?: (id: string) => void;
}

function AccordionRow({ id, jp, rom, meaning, items, openSet, toggle, section, refBookmarkedIds, onToggleRefBookmark, learnedIds, onToggleLearned }: { id: string; jp: string; rom: string; meaning: string; items: { jp: string; hep: string; en: string }[]; openSet: Set<string>; toggle: (k: string) => void; section?: string; refBookmarkedIds?: Set<string>; onToggleRefBookmark?: (item: { jp: string; hep: string; en: string; section: string }) => void; learnedIds?: Set<string>; onToggleLearned?: (id: string) => void }) {
  const isOpen = openSet.has(id);
  return (
    <div className={`bg-slate-700/40 rounded-xl overflow-hidden ${isOpen ? 'ring-1 ring-sakura-400/30' : ''}`}>
      <div className="flex items-start gap-2 p-3">
        <button onClick={() => toggle(id)} className="flex-1 text-left">
          <p className="text-lg font-medium text-slate-50">{jp}</p>
          <p className="text-base text-sakura-300 mt-0.5">{rom}</p>
          <p className="text-base text-slate-400 mt-0.5">{meaning}</p>
        </button>
        <button onClick={() => speak(jp, 'ja-JP')} className="p-1 rounded-lg active:bg-slate-600 text-lg shrink-0">🔊</button>
        <button onClick={() => toggle(id)} className="text-base text-slate-500 shrink-0 p-1">{isOpen ? '▲' : '▼'}</button>
      </div>
      {isOpen && (
        <div className="px-1.5 pb-1.5 space-y-1.5">
          {items.map((ex, i) => {
            const bmId = `ref_${ex.jp}`;
            const isBm = refBookmarkedIds?.has(bmId);
            const learnId = `ref_${ex.jp}`;
            const isLearned = learnedIds?.has(learnId);
            return (
              <div key={i} className="bg-slate-700/40 rounded-xl p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-medium text-slate-50">{ex.jp}</p>
                    <p className="text-base text-sakura-300 mt-0.5">{ex.hep}</p>
                    <p className="text-base text-slate-400 mt-0.5">{ex.en}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => speak(ex.jp, 'ja-JP')} className="p-1 rounded-lg active:bg-slate-600 text-lg">🔊</button>
                    {onToggleRefBookmark && (
                      <button onClick={() => onToggleRefBookmark({ ...ex, section: section || id })} className="p-1 rounded-lg active:bg-slate-600 text-lg">
                        {isBm ? '⭐' : '☆'}
                      </button>
                    )}
                    {onToggleLearned && (
                      <button
                        onClick={() => onToggleLearned(learnId)}
                        className={`px-2 py-0.5 rounded-full text-sm transition ${isLearned ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-600/30 text-slate-500'}`}
                      >
                        {isLearned ? '✓' : '···'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function useAccordion(keys: string[]) {
  const [openSet, setOpenSet] = useState<Set<string>>(new Set());
  const allOpen = keys.length > 0 && keys.every(k => openSet.has(k));

  const toggle = (key: string) => {
    setOpenSet(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleAll = () => {
    if (allOpen) setOpenSet(new Set());
    else setOpenSet(new Set(keys));
  };

  return { openSet, allOpen, toggle, toggleAll };
}

function AccordionHeader({ label, allOpen, toggleAll }: { label: string; allOpen: boolean; toggleAll: () => void }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <p className="text-base text-slate-500">{label}</p>
      <button onClick={toggleAll} className="text-base bg-slate-700/40 text-slate-400 px-2.5 py-1 rounded-lg active:bg-slate-600 transition">
        {allOpen ? '▲ Close All' : '▼ Open All'}
      </button>
    </div>
  );
}

function ParticlesRef({ rbIds, onRbToggle, learnedIds, onToggleLearned }: RbProps) {
  const { openSet, allOpen, toggle, toggleAll } = useAccordion(['は','が','を','に','で','へ','の','と','も','か','から','まで']);
  return (
    <div className="mt-2 space-y-1.5">
      <AccordionHeader label="Tap a particle to see examples" allOpen={allOpen} toggleAll={toggleAll} />
      <AccordionRow id="は" jp="は" rom="wa" meaning="Topic marker — marks what you're talking about"
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: 'これは何ですか？', hep: 'ko·re wa nan de·su ka', en: 'What is this?' },
          { jp: '私はアンソニーです', hep: 'wa·ta·shi wa an·so·nii de·su', en: 'I am Anthony' },
          { jp: 'トイレはどこですか？', hep: 'toi·re wa do·ko de·su ka', en: 'Where is the toilet?' },
        ]} />
      <AccordionRow id="が" jp="が" rom="ga" meaning="Subject marker — marks who/what does the action"
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '水がほしいです', hep: 'mi·zu ga ho·shii de·su', en: 'I want water' },
          { jp: '日本語がわかりません', hep: 'ni·hon·go ga wa·ka·ri·ma·sen', en: "I don't understand Japanese" },
          { jp: 'これが一番おいしいです', hep: 'ko·re ga i·chi·ban o·i·shii de·su', en: 'This is the most delicious' },
        ]} />
      <AccordionRow id="を" jp="を" rom="wo" meaning="Object marker — marks what receives the action"
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: 'ラーメンを二つお願いします', hep: 'raa·men wo fu·ta·tsu o·ne·gai·shi·ma·su', en: 'Two ramen please' },
          { jp: '写真を撮ってもらえますか？', hep: 'sha·shin wo tot·te mo·ra·e·ma·su ka', en: 'Can you take a photo?' },
          { jp: '切符を買います', hep: 'kip·pu wo kai·ma·su', en: 'I buy a ticket' },
        ]} />
      <AccordionRow id="に" jp="に" rom="ni" meaning="Direction/time — to, at, in, on"
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '6時に予約しました', hep: 'ro·ku·ji ni yo·ya·ku shi·ma·shi·ta', en: 'I reserved at 6 o\'clock' },
          { jp: '東京に行きます', hep: 'tou·kyou ni i·ki·ma·su', en: 'I go to Tokyo' },
          { jp: 'ホテルに荷物を送ります', hep: 'ho·te·ru ni ni·mo·tsu wo o·ku·ri·ma·su', en: 'I send luggage to the hotel' },
        ]} />
      <AccordionRow id="で" jp="で" rom="de" meaning="Location of action / by means of"
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: 'Suicaで払います', hep: 'sui·ka de ha·rai·ma·su', en: 'I pay with Suica' },
          { jp: 'ここで食べます', hep: 'ko·ko de ta·be·ma·su', en: 'I eat here' },
          { jp: '電車で行きます', hep: 'den·sha de i·ki·ma·su', en: 'I go by train' },
        ]} />
      <AccordionRow id="へ" jp="へ" rom="e" meaning="Towards (direction)"
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '東京へ行きます', hep: 'tou·kyou e i·ki·ma·su', en: 'I\'m heading to Tokyo' },
          { jp: 'こちらへどうぞ', hep: 'ko·chi·ra e dou·zo', en: 'This way please' },
          { jp: '出口へ向かいます', hep: 'de·gu·chi e mu·kai·ma·su', en: 'I\'m heading to the exit' },
        ]} />
      <AccordionRow id="の" jp="の" rom="no" meaning="Possessive / connecting — 's, of"
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '名古屋の名物', hep: 'na·go·ya no mei·bu·tsu', en: 'Nagoya\'s specialty' },
          { jp: '日本語のメニュー', hep: 'ni·hon·go no me·nyuu', en: 'Japanese menu' },
          { jp: 'ホテルの電話番号', hep: 'ho·te·ru no den·wa ban·gou', en: 'Hotel\'s phone number' },
        ]} />
      <AccordionRow id="と" jp="と" rom="to" meaning="And, with (listing/companion)"
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: 'ビールと枝豆をお願いします', hep: 'bii·ru to e·da·ma·me wo o·ne·gai·shi·ma·su', en: 'Beer and edamame please' },
          { jp: 'ふたりで旅行しています', hep: 'fu·ta·ri de ryo·kou shi·te i·ma·su', en: 'Traveling as two people' },
          { jp: '朝と夜、二食付きです', hep: 'a·sa to yo·ru ni·sho·ku tsu·ki de·su', en: 'Breakfast and dinner included' },
        ]} />
      <AccordionRow id="も" jp="も" rom="mo" meaning="Also, too"
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: 'これもお願いします', hep: 'ko·re mo o·ne·gai·shi·ma·su', en: 'This one too please' },
          { jp: '日本語もわかりません', hep: 'ni·hon·go mo wa·ka·ri·ma·sen', en: 'I don\'t understand Japanese either' },
          { jp: '私も同じものをお願いします', hep: 'wa·ta·shi mo o·na·ji mo·no wo o·ne·gai·shi·ma·su', en: 'Same thing for me too please' },
        ]} />
      <AccordionRow id="か" jp="か" rom="ka" meaning="Question marker (end of sentence)"
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: 'いくらですか？', hep: 'i·ku·ra de·su ka', en: 'How much?' },
          { jp: 'クレジットカードは使えますか？', hep: 'ku·re·jit·to kaa·do wa tsu·ka·e·ma·su ka', en: 'Can I use credit card?' },
          { jp: 'これはなんですか？', hep: 'ko·re wa nan de·su ka', en: 'What is this?' },
        ]} />
      <AccordionRow id="から" jp="から" rom="ka·ra" meaning="From (place/time)"
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '名古屋から東京まで', hep: 'na·go·ya ka·ra tou·kyou ma·de', en: 'From Nagoya to Tokyo' },
          { jp: '7時から朝食です', hep: 'shi·chi·ji ka·ra chou·sho·ku de·su', en: 'Breakfast from 7 o\'clock' },
          { jp: 'ここから駅まで歩けますか？', hep: 'ko·ko ka·ra e·ki ma·de a·ru·ke·ma·su ka', en: 'Can I walk from here to the station?' },
        ]} />
      <AccordionRow id="まで" jp="まで" rom="ma·de" meaning="Until, to (endpoint)"
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: 'この住所までお願いします', hep: 'ko·no juu·sho ma·de o·ne·gai·shi·ma·su', en: 'To this address please' },
          { jp: '10時まで営業です', hep: 'juu·ji ma·de ei·gyou de·su', en: 'Open until 10 o\'clock' },
          { jp: '名古屋まで何時間ですか？', hep: 'na·go·ya ma·de nan·ji·kan de·su ka', en: 'How many hours to Nagoya?' },
        ]} />
    </div>
  );
}

function CountersRef({ rbIds, onRbToggle, learnedIds, onToggleLearned }: RbProps) {
  const { openSet, allOpen, toggle, toggleAll } = useAccordion(['〜つ','〜人','〜枚','〜本','〜杯','〜個','〜台','〜泊','〜名','〜階']);
  return (
    <div className="mt-2 space-y-1.5">
      <AccordionHeader label="Counters (like Chinese 量詞)" allOpen={allOpen} toggleAll={toggleAll} />
      <AccordionRow id="〜つ" jp="〜つ" rom="-tsu" meaning="General counter (1-10)"
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: 'ひとつください', hep: 'hi·to·tsu ku·da·sai', en: 'One please' },
          { jp: 'ふたつお願いします', hep: 'fu·ta·tsu o·ne·gai·shi·ma·su', en: 'Two please' },
          { jp: 'みっつあります', hep: 'mit·tsu a·ri·ma·su', en: 'There are three' },
        ]} />
      <AccordionRow id="〜人" jp="〜人" rom="-nin" meaning="People"
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: 'ふたりです', hep: 'fu·ta·ri de·su', en: 'Two people' },
          { jp: 'さんにんで予約しました', hep: 'san·nin de yo·ya·ku shi·ma·shi·ta', en: 'Reserved for three people' },
          { jp: 'ひとりです', hep: 'hi·to·ri de·su', en: 'Just one person' },
        ]} />
      <AccordionRow id="〜枚" jp="〜枚" rom="-mai" meaning="Flat objects: tickets, plates, shirts"
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '切符を二枚ください', hep: 'kip·pu wo ni·mai ku·da·sai', en: 'Two tickets please' },
          { jp: 'Tシャツを一枚お願いします', hep: 'tii·sha·tsu wo i·chi·mai o·ne·gai·shi·ma·su', en: 'One T-shirt please' },
          { jp: 'お皿を三枚ください', hep: 'o·sa·ra wo san·mai ku·da·sai', en: 'Three plates please' },
        ]} />
      <AccordionRow id="〜本" jp="〜本" rom="-hon" meaning="Long objects: bottles, pens, umbrellas"
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '水を一本ください', hep: 'mi·zu wo ip·pon ku·da·sai', en: 'One bottle of water please' },
          { jp: 'ビールを二本お願いします', hep: 'bii·ru wo ni·hon o·ne·gai·shi·ma·su', en: 'Two beers please' },
          { jp: '傘を一本貸してください', hep: 'ka·sa wo ip·pon ka·shi·te ku·da·sai', en: 'Please lend me an umbrella' },
        ]} />
      <AccordionRow id="〜杯" jp="〜杯" rom="-hai" meaning="Cups / glasses / bowls"
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: 'コーヒーを一杯ください', hep: 'koo·hii wo ip·pai ku·da·sai', en: 'One coffee please' },
          { jp: 'お茶を二杯お願いします', hep: 'o·cha wo ni·hai o·ne·gai·shi·ma·su', en: 'Two teas please' },
          { jp: 'ラーメンを一杯お願いします', hep: 'raa·men wo ip·pai o·ne·gai·shi·ma·su', en: 'One bowl of ramen please' },
        ]} />
      <AccordionRow id="〜個" jp="〜個" rom="-ko" meaning="Small round objects: eggs, apples, onigiri"
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: 'おにぎりを三個ください', hep: 'o·ni·gi·ri wo san·ko ku·da·sai', en: 'Three onigiri please' },
          { jp: 'りんごを一個お願いします', hep: 'rin·go wo ik·ko o·ne·gai·shi·ma·su', en: 'One apple please' },
          { jp: 'たこ焼きを二個ください', hep: 'ta·ko·ya·ki wo ni·ko ku·da·sai', en: 'Two takoyaki please' },
        ]} />
      <AccordionRow id="〜台" jp="〜台" rom="-dai" meaning="Machines / vehicles"
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: 'タクシーを一台お願いします', hep: 'ta·ku·shii wo i·chi·dai o·ne·gai·shi·ma·su', en: 'One taxi please' },
          { jp: 'バスは何台来ますか？', hep: 'ba·su wa nan·dai ki·ma·su ka', en: 'How many buses are coming?' },
          { jp: 'ロッカーは一台空いていますか？', hep: 'rok·kaa wa i·chi·dai ai·te i·ma·su ka', en: 'Is there a locker available?' },
        ]} />
      <AccordionRow id="〜泊" jp="〜泊" rom="-ha·ku" meaning="Nights (hotel stay)"
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '二泊お願いします', hep: 'ni·ha·ku o·ne·gai·shi·ma·su', en: 'Two nights please' },
          { jp: '一泊いくらですか？', hep: 'ip·pa·ku i·ku·ra de·su ka', en: 'How much per night?' },
          { jp: '三泊四日です', hep: 'san·pa·ku yok·ka de·su', en: 'Three nights, four days' },
        ]} />
      <AccordionRow id="〜名" jp="〜名" rom="-mei" meaning="People (formal, restaurants)"
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '二名で予約しました', hep: 'ni·mei de yo·ya·ku shi·ma·shi·ta', en: 'Reserved for two (formal)' },
          { jp: '三名様でございますか？', hep: 'san·mei·sa·ma de go·zai·ma·su ka', en: 'Party of three? (staff may ask)' },
          { jp: '一名です', hep: 'i·chi·mei de·su', en: 'Just one person (formal)' },
        ]} />
      <AccordionRow id="〜階" jp="〜階" rom="-kai" meaning="Floors / stories"
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: 'トイレは二階です', hep: 'toi·re wa ni·kai de·su', en: 'The toilet is on the 2nd floor' },
          { jp: '三階に行きたいです', hep: 'san·gai ni i·ki·tai de·su', en: 'I want to go to the 3rd floor' },
          { jp: 'レストランは何階ですか？', hep: 're·su·to·ran wa nan·kai de·su ka', en: 'What floor is the restaurant?' },
        ]} />
    </div>
  );
}

function PatternsRef({ rbIds, onRbToggle, learnedIds, onToggleLearned }: RbProps) {
  const { openSet, allOpen, toggle, toggleAll } = useAccordion(['○○をお願いします','○○はありますか','○○はどこですか','○○してもいいですか','○○てください','○○がわかりません','○○たいです']);
  return (
    <div className="mt-2 space-y-1.5">
      <AccordionHeader label="Tap a pattern to see real examples" allOpen={allOpen} toggleAll={toggleAll} />
      <AccordionRow id="○○をお願いします" jp="○○をお願いします" rom="○○ wo o·ne·gai·shi·ma·su" meaning="○○ please — works for anything!"
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '水をお願いします', hep: 'mi·zu wo o·ne·gai·shi·ma·su', en: 'Water please' },
          { jp: 'メニューをお願いします', hep: 'me·nyuu wo o·ne·gai·shi·ma·su', en: 'Menu please' },
          { jp: 'お会計をお願いします', hep: 'o·kai·kei wo o·ne·gai·shi·ma·su', en: 'Check please' },
          { jp: '二つをお願いします', hep: 'fu·ta·tsu wo o·ne·gai·shi·ma·su', en: 'Two of them please' },
        ]} />
      <AccordionRow id="○○はありますか" jp="○○はありますか" rom="○○ wa a·ri·ma·su ka" meaning="Is there ○○? / Do you have ○○?"
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: 'Wi-Fiはありますか？', hep: 'wai·fai wa a·ri·ma·su ka', en: 'Is there Wi-Fi?' },
          { jp: '英語のメニューはありますか？', hep: 'ei·go no me·nyuu wa a·ri·ma·su ka', en: 'Do you have an English menu?' },
          { jp: '空いている席はありますか？', hep: 'ai·te i·ru se·ki wa a·ri·ma·su ka', en: 'Is there an empty seat?' },
        ]} />
      <AccordionRow id="○○はどこですか" jp="○○はどこですか" rom="○○ wa do·ko de·su ka" meaning="Where is ○○?"
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: 'トイレはどこですか？', hep: 'toi·re wa do·ko de·su ka', en: 'Where is the toilet?' },
          { jp: '駅はどこですか？', hep: 'e·ki wa do·ko de·su ka', en: 'Where is the station?' },
          { jp: 'ATMはどこですか？', hep: 'ee·tii·e·mu wa do·ko de·su ka', en: 'Where is an ATM?' },
        ]} />
      <AccordionRow id="○○してもいいですか" jp="○○してもいいですか" rom="○○ shi·te mo ii de·su ka" meaning="May I ○○? (asking permission)"
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '写真を撮ってもいいですか？', hep: 'sha·shin wo tot·te mo ii de·su ka', en: 'May I take photos?' },
          { jp: 'ここで食べてもいいですか？', hep: 'ko·ko de ta·be·te mo ii de·su ka', en: 'May I eat here?' },
          { jp: '試着してもいいですか？', hep: 'shi·cha·ku shi·te mo ii de·su ka', en: 'May I try it on?' },
        ]} />
      <AccordionRow id="○○てください" jp="○○てください" rom="○○ te ku·da·sai" meaning="Please do ○○ (polite request)"
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '書いてください', hep: 'kai·te ku·da·sai', en: 'Please write it down' },
          { jp: 'ゆっくり話してください', hep: 'yuk·ku·ri ha·na·shi·te ku·da·sai', en: 'Please speak slowly' },
          { jp: '温めてください', hep: 'a·ta·ta·me·te ku·da·sai', en: 'Please heat it up' },
        ]} />
      <AccordionRow id="○○がわかりません" jp="○○がわかりません" rom="○○ ga wa·ka·ri·ma·sen" meaning="I don't understand ○○"
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '日本語がわかりません', hep: 'ni·hon·go ga wa·ka·ri·ma·sen', en: "I don't understand Japanese" },
          { jp: '使い方がわかりません', hep: 'tsu·kai·ka·ta ga wa·ka·ri·ma·sen', en: "I don't know how to use it" },
          { jp: '道がわかりません', hep: 'mi·chi ga wa·ka·ri·ma·sen', en: "I don't know the way" },
        ]} />
      <AccordionRow id="○○たいです" jp="○○たいです" rom="○○ tai de·su" meaning="I want to ○○ (desire)"
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '食べたいです', hep: 'ta·be·tai de·su', en: 'I want to eat' },
          { jp: '行きたいです', hep: 'i·ki·tai de·su', en: 'I want to go' },
          { jp: '荷物を送りたいです', hep: 'ni·mo·tsu wo o·ku·ri·tai de·su', en: 'I want to send luggage' },
        ]} />
    </div>
  );
}

function PoliteRef({ rbIds, onRbToggle, learnedIds, onToggleLearned }: RbProps) {
  const { openSet, allOpen, toggle, toggleAll } = useAccordion(['〜ます','〜ません','〜ました','〜です','〜てください','〜てもいいですか']);
  return (
    <div className="mt-2 space-y-1.5">
      <AccordionHeader label="Use ます form — polite and always safe" allOpen={allOpen} toggleAll={toggleAll} />
      <AccordionRow id="〜ます" jp="〜ます" rom="ma·su" meaning="🕐 Default for ALL travel — ordering, asking, stating"
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '行きます', hep: 'i·ki·ma·su', en: 'I go / I will go' },
          { jp: 'わかります', hep: 'wa·ka·ri·ma·su', en: 'I understand' },
          { jp: '食べます', hep: 'ta·be·ma·su', en: 'I eat' },
          { jp: '払います', hep: 'ha·rai·ma·su', en: 'I pay' },
        ]} />
      <AccordionRow id="〜ません" jp="〜ません" rom="ma·sen" meaning="🕐 Saying you can't / don't — declining, limitations"
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '日本語がわかりません', hep: 'ni·hon·go ga wa·ka·ri·ma·sen', en: "I don't understand Japanese" },
          { jp: '食べられません', hep: 'ta·be·ra·re·ma·sen', en: "I can't eat (allergies)" },
          { jp: 'いりません', hep: 'i·ri·ma·sen', en: "I don't need it" },
        ]} />
      <AccordionRow id="〜ました" jp="〜ました" rom="ma·shi·ta" meaning="🕐 Already done — reservations, things you saw"
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '予約しました', hep: 'yo·ya·ku shi·ma·shi·ta', en: 'I made a reservation' },
          { jp: 'もう払いました', hep: 'mou ha·rai·ma·shi·ta', en: 'I already paid' },
          { jp: '荷物をなくしました', hep: 'ni·mo·tsu wo na·ku·shi·ma·shi·ta', en: 'I lost my luggage' },
        ]} />
      <AccordionRow id="〜です" jp="〜です" rom="de·su" meaning='🕐 Stating what something IS — identity, quantities'
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: 'ふたりです', hep: 'fu·ta·ri de·su', en: 'Two people (party size)' },
          { jp: 'アレルギーです', hep: 'a·re·ru·gii de·su', en: "It's an allergy" },
          { jp: 'これです', hep: 'ko·re de·su', en: "It's this one" },
          { jp: '大丈夫です', hep: 'dai·jou·bu de·su', en: "It's fine / I'm okay" },
        ]} />
      <AccordionRow id="〜てください" jp="〜てください" rom="te ku·da·sai" meaning='🕐 Asking someone to do something — "please do ○○"'
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: 'ゆっくり話してください', hep: 'yuk·ku·ri ha·na·shi·te ku·da·sai', en: 'Please speak slowly' },
          { jp: '書いてください', hep: 'kai·te ku·da·sai', en: 'Please write it down' },
          { jp: 'もう一度お願いします', hep: 'mou i·chi·do o·ne·gai·shi·ma·su', en: 'One more time please' },
        ]} />
      <AccordionRow id="〜てもいいですか" jp="〜てもいいですか" rom="te mo ii de·su ka" meaning='🕐 Asking "may I?" — photos, trying on, sitting'
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '写真を撮ってもいいですか？', hep: 'sha·shin wo tot·te mo ii de·su ka', en: 'May I take photos?' },
          { jp: 'ここに座ってもいいですか？', hep: 'ko·ko ni su·wat·te mo ii de·su ka', en: 'May I sit here?' },
          { jp: '試着してもいいですか？', hep: 'shi·cha·ku shi·te mo ii de·su ka', en: 'May I try it on?' },
        ]} />
    </div>
  );
}

// ============================================================
// Sentence Structure (Step 2)
// ============================================================
function GrammarRef({ rbIds, onRbToggle, learnedIds, onToggleLearned }: RbProps) {
  const { openSet, allOpen, toggle, toggleAll } = useAccordion(['O を V ます','V ます','S は O を V ます','Place で V ます','Place に V ます','S は ... です']);
  return (
    <div className="mt-2 space-y-1.5">
      <p className="text-base text-slate-500 mb-3">Japanese word order is Subject → Object → Verb (verb goes LAST, opposite of English)</p>

      <div className="bg-slate-700/30 rounded-xl p-3 mb-3">
        <p className="text-base text-slate-400 mb-2 text-center">Basic Pattern:</p>
        <div className="flex items-center justify-center gap-1 flex-wrap">
          <span className="bg-blue-500/20 text-blue-400/60 px-2 py-1 rounded text-base border border-dashed border-blue-500/30">(Subject)</span>
          <span className="bg-green-500/30 text-green-300 px-2 py-1 rounded text-base font-medium">Object</span>
          <span className="text-slate-500 text-base">を</span>
          <span className="bg-purple-500/30 text-purple-300 px-2 py-1 rounded text-base font-medium">Verb</span>
          <span className="text-slate-500 text-base">ます</span>
        </div>
        <p className="text-base text-sakura-300 text-center mt-1">O wo V ma·su</p>
        <p className="text-base text-slate-500 text-center mt-1">Subject (I/you) is usually dropped — it's understood!</p>
      </div>

      <AccordionHeader label="Tap to see examples of each structure" allOpen={allOpen} toggleAll={toggleAll} />

      <AccordionRow id="O を V ます" jp="O を V ます" rom="O wo V ma·su" meaning="Most common: Object + Verb (subject dropped)"
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: 'ラーメンを食べます', hep: 'raa·men wo ta·be·ma·su', en: 'I eat ramen' },
          { jp: '切符を買います', hep: 'kip·pu wo kai·ma·su', en: 'I buy a ticket' },
          { jp: '写真を撮ります', hep: 'sha·shin wo to·ri·ma·su', en: 'I take a photo' },
        ]} />
      <AccordionRow id="V ます" jp="V ます" rom="V ma·su" meaning="Simplest: just the verb"
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '行きます', hep: 'i·ki·ma·su', en: 'I go / I will go' },
          { jp: '食べます', hep: 'ta·be·ma·su', en: 'I eat' },
          { jp: 'わかりました', hep: 'wa·ka·ri·ma·shi·ta', en: 'I understood / Got it' },
        ]} />
      <AccordionRow id="S は O を V ます" jp="S は O を V ます" rom="S wa O wo V ma·su" meaning="Full sentence with subject (when it's not 'I')"
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: 'このバスは東京駅を通ります', hep: 'ko·no ba·su wa tou·kyou·e·ki wo too·ri·ma·su', en: 'This bus passes Tokyo Station' },
          { jp: 'お店は朝食を出します', hep: 'o·mi·se wa chou·sho·ku wo da·shi·ma·su', en: 'The restaurant serves breakfast' },
          { jp: '友達はお土産を買います', hep: 'to·mo·da·chi wa o·mi·ya·ge wo kai·ma·su', en: 'My friend buys souvenirs' },
        ]} />
      <AccordionRow id="Place で V ます" jp="Place で V ます" rom="Place de V ma·su" meaning="Where: do something AT a place"
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: 'ここで食べます', hep: 'ko·ko de ta·be·ma·su', en: 'I eat here' },
          { jp: 'コンビニでコーヒーを買います', hep: 'kon·bi·ni de koo·hii wo kai·ma·su', en: 'I buy coffee at the convenience store' },
          { jp: 'ホテルで休みます', hep: 'ho·te·ru de ya·su·mi·ma·su', en: 'I rest at the hotel' },
        ]} />
      <AccordionRow id="Place に V ます" jp="Place に V ます" rom="Place ni V ma·su" meaning="Direction: go TO a place"
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '東京に行きます', hep: 'tou·kyou ni i·ki·ma·su', en: 'I go to Tokyo' },
          { jp: 'ホテルに帰ります', hep: 'ho·te·ru ni ka·e·ri·ma·su', en: 'I return to the hotel' },
          { jp: '駅に着きました', hep: 'e·ki ni tsu·ki·ma·shi·ta', en: 'I arrived at the station' },
        ]} />
      <AccordionRow id="S は ... です" jp="S は ... です" rom="S wa ... de·su" meaning="When you DO need to name the subject"
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '電車が来ます', hep: 'den·sha ga ki·ma·su', en: 'The train comes (it, not me)' },
          { jp: '友達が待っています', hep: 'to·mo·da·chi ga mat·te i·ma·su', en: 'My friend is waiting (they, not me)' },
          { jp: 'このお店は人気です', hep: 'ko·no o·mi·se wa nin·ki de·su', en: 'This shop is popular' },
        ]} />

      <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-3 mt-1">
        <p className="text-base text-indigo-300 font-medium">💡 When to say 私は?</p>
        <p className="text-base text-slate-400 mt-1">Only when introducing yourself or contrasting with someone else:</p>
        <div className="mt-2 space-y-1">
          <p className="text-base text-slate-300">✅ 私はアンソニーです <span className="text-slate-500">(I am Anthony — introduction)</span></p>
          <p className="text-base text-slate-300">✅ 私はラーメン、彼女はうどん <span className="text-slate-500">(I'll have ramen, she'll have udon)</span></p>
          <p className="text-base text-slate-300">❌ 私はラーメンを食べます <span className="text-slate-500">(sounds textbook-ish)</span></p>
          <p className="text-base text-slate-300">✅ ラーメンを食べます <span className="text-slate-500">(natural!)</span></p>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Yes/No Questions (Step 6)
// ============================================================
function YesNoRef({ rbIds, onRbToggle, learnedIds, onToggleLearned }: RbProps) {
  const { openSet, allOpen, toggle, toggleAll } = useAccordion(['○○ですか？','○○ますか？','○○ありますか？']);
  return (
    <div className="mt-2 space-y-1.5">
      <p className="text-base text-slate-500 mb-3">Take any statement, add か (ka) at the end = question. That's it!</p>

      <div className="bg-slate-700/30 rounded-xl p-3 mb-3">
        <p className="text-base text-slate-400 mb-2 text-center">The Rule:</p>
        <div className="flex items-center justify-center gap-2">
          <span className="bg-slate-600/50 text-slate-200 px-3 py-1 rounded text-base">any statement</span>
          <span className="text-slate-500 text-lg">+</span>
          <span className="bg-sakura-500/30 text-sakura-300 px-3 py-1 rounded text-base font-bold">か？</span>
        </div>
      </div>

      <div className="bg-slate-700/30 rounded-lg p-3 mb-3">
        <p className="text-base text-slate-400 mb-2">Answering:</p>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center justify-center gap-2 bg-slate-700/30 rounded-lg p-2">
            <span className="text-green-400 text-base">✅</span>
            <div>
              <p className="text-base text-slate-200">はい</p>
              <p className="text-base text-sakura-300">hai</p>
              <p className="text-base text-slate-400">Yes</p>
            </div>
            <button onClick={() => speak('はい', 'ja-JP')} className="text-lg active:scale-110 p-1">🔊</button>
          </div>
          <div className="flex items-center justify-center gap-2 bg-slate-700/30 rounded-lg p-2">
            <span className="text-red-400 text-base">❌</span>
            <div>
              <p className="text-base text-slate-200">いいえ</p>
              <p className="text-base text-sakura-300">ii·e</p>
              <p className="text-base text-slate-400">No</p>
            </div>
            <button onClick={() => speak('いいえ', 'ja-JP')} className="text-lg active:scale-110 p-1">🔊</button>
          </div>
        </div>
      </div>

      <AccordionHeader label="Tap to see examples" allOpen={allOpen} toggleAll={toggleAll} />

      <AccordionRow id="○○ですか？" jp="○○ですか？" rom="○○ de·su ka" meaning="Is it ○○? / Are you ○○?"
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: 'これは味噌ラーメンですか？', hep: 'ko·re wa mi·so raa·men de·su ka', en: 'Is this miso ramen?' },
          { jp: '無料ですか？', hep: 'mu·ryou de·su ka', en: 'Is it free?' },
          { jp: 'ここですか？', hep: 'ko·ko de·su ka', en: 'Is it here?' },
        ]} />
      <AccordionRow id="○○ますか？" jp="○○ますか？" rom="○○ ma·su ka" meaning="Do you ○○? / Can you ○○?"
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '英語を話しますか？', hep: 'ei·go wo ha·na·shi·ma·su ka', en: 'Do you speak English?' },
          { jp: 'クレジットカードは使えますか？', hep: 'ku·re·jit·to kaa·do wa tsu·ka·e·ma·su ka', en: 'Can I use credit card?' },
          { jp: '配達しますか？', hep: 'hai·ta·tsu shi·ma·su ka', en: 'Do you deliver?' },
        ]} />
      <AccordionRow id="○○ありますか？" jp="○○ありますか？" rom="○○ a·ri·ma·su ka" meaning="Is there ○○? / Do you have ○○?"
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: 'Wi-Fiはありますか？', hep: 'wai·fai wa a·ri·ma·su ka', en: 'Is there Wi-Fi?' },
          { jp: '空いている部屋はありますか？', hep: 'ai·te i·ru he·ya wa a·ri·ma·su ka', en: 'Do you have a vacant room?' },
          { jp: 'おすすめはありますか？', hep: 'o·su·su·me wa a·ri·ma·su ka', en: 'Do you have any recommendations?' },
        ]} />

      <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-3 mt-3">
        <p className="text-base text-indigo-300 font-medium">💡 Softer alternatives</p>
        <p className="text-base text-slate-400 mt-1">Instead of direct はい/いいえ, Japanese often uses softer responses:</p>
        <div className="mt-2 space-y-1">
          <p className="text-base text-slate-300">大丈夫です <span className="text-sakura-300">dai·jou·bu de·su</span> <span className="text-slate-500">= It's okay (soft yes)</span></p>
          <p className="text-base text-slate-300">ちょっと… <span className="text-sakura-300">chot·to…</span> <span className="text-slate-500">= A little… (soft no)</span></p>
          <p className="text-base text-slate-300">すみません <span className="text-sakura-300">su·mi·ma·sen</span> <span className="text-slate-500">= Sorry (polite no)</span></p>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// WH Question Words (Step 7)
// ============================================================
function WHQuestionsRef({ rbIds, onRbToggle, learnedIds, onToggleLearned }: RbProps) {
  const [tab, setTab] = useState<'thing' | 'action'>('thing');
  const thingAcc = useAccordion(['何 / なに','どこ','いつ','いくら','どれ','どっち / どちら']);
  const actionAcc = useAccordion(['どう','だれ','なぜ / どうして']);
  const acc = tab === 'thing' ? thingAcc : actionAcc;

  return (
    <div className="mt-2 space-y-1.5">
      {/* Tabs */}
      <div className="flex gap-2 mb-2">
        <button onClick={() => setTab('thing')} className={`flex-1 py-2 rounded-lg text-base transition ${tab === 'thing' ? 'bg-sakura-500/60 text-white' : 'bg-slate-700/50 text-slate-400'}`}>
          Asking about things
        </button>
        <button onClick={() => setTab('action')} className={`flex-1 py-2 rounded-lg text-base transition ${tab === 'action' ? 'bg-sakura-500/60 text-white' : 'bg-slate-700/50 text-slate-400'}`}>
          Asking about actions
        </button>
      </div>

      {/* Rule card — Pattern 1 */}
      {tab === 'thing' && (
        <>
          <div className="bg-slate-700/30 rounded-xl p-3">
            <p className="text-base text-slate-400 mb-2 text-center">Pattern: asking about things / places / time</p>
            <div className="flex items-center justify-center gap-1 flex-wrap">
              <span className="bg-slate-600/50 text-slate-200 px-2 py-1 rounded text-base">○○</span>
              <span className="text-slate-500 text-base">は</span>
              <span className="bg-sakura-500/30 text-sakura-300 px-2 py-1 rounded text-base font-bold">Q word</span>
              <span className="text-slate-500 text-base">ですか？</span>
            </div>
            <div className="mt-3 space-y-1">
              <p className="text-base text-slate-300 text-center">トイレは <span className="text-sakura-300 font-medium">どこ</span> ですか？</p>
              <p className="text-base text-sakura-300 text-center">toi·re wa <span className="font-medium">do·ko</span> de·su ka</p>
              <p className="text-base text-slate-500 text-center">The toilet is <span className="text-sakura-300">where</span>?</p>
            </div>
          </div>

          <AccordionHeader label="Question words" allOpen={acc.allOpen} toggleAll={acc.toggleAll} />

          <AccordionRow id="何 / なに" jp="何 / なに" rom="na·ni" meaning="What?"
            openSet={acc.openSet} toggle={acc.toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
              { jp: 'これは何ですか？', hep: 'ko·re wa nan de·su ka', en: 'What is this?' },
              { jp: '何がおすすめですか？', hep: 'na·ni ga o·su·su·me de·su ka', en: 'What do you recommend?' },
              { jp: '何時ですか？', hep: 'nan·ji de·su ka', en: 'What time is it?' },
            ]} />
          <AccordionRow id="どこ" jp="どこ" rom="do·ko" meaning="Where?"
            openSet={acc.openSet} toggle={acc.toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
              { jp: 'トイレはどこですか？', hep: 'toi·re wa do·ko de·su ka', en: 'Where is the toilet?' },
              { jp: '駅はどこですか？', hep: 'e·ki wa do·ko de·su ka', en: 'Where is the station?' },
              { jp: 'ATMはどこですか？', hep: 'ee·tii·e·mu wa do·ko de·su ka', en: 'Where is an ATM?' },
            ]} />
          <AccordionRow id="いつ" jp="いつ" rom="i·tsu" meaning="When?"
            openSet={acc.openSet} toggle={acc.toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
              { jp: 'チェックアウトはいつですか？', hep: 'chek·ku au·to wa i·tsu de·su ka', en: 'When is checkout?' },
              { jp: 'いつ開きますか？', hep: 'i·tsu a·ki·ma·su ka', en: 'When does it open?' },
              { jp: 'いつ出発しますか？', hep: 'i·tsu shup·pa·tsu shi·ma·su ka', en: 'When does it depart?' },
            ]} />
          <AccordionRow id="いくら" jp="いくら" rom="i·ku·ra" meaning="How much? (price)"
            openSet={acc.openSet} toggle={acc.toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
              { jp: 'いくらですか？', hep: 'i·ku·ra de·su ka', en: 'How much is it?' },
              { jp: '全部でいくらですか？', hep: 'zen·bu de i·ku·ra de·su ka', en: 'How much in total?' },
              { jp: '一泊いくらですか？', hep: 'ip·pa·ku i·ku·ra de·su ka', en: 'How much per night?' },
            ]} />
          <AccordionRow id="どれ" jp="どれ" rom="do·re" meaning="Which one? (of 3+)"
            openSet={acc.openSet} toggle={acc.toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
              { jp: 'どれがおすすめですか？', hep: 'do·re ga o·su·su·me de·su ka', en: 'Which do you recommend?' },
              { jp: 'どれにしますか？', hep: 'do·re ni shi·ma·su ka', en: 'Which one will you have?' },
              { jp: 'どれが一番人気ですか？', hep: 'do·re ga i·chi·ban nin·ki de·su ka', en: 'Which is the most popular?' },
            ]} />
          <AccordionRow id="どっち / どちら" jp="どっち / どちら" rom="dot·chi / do·chi·ra" meaning="Which? (of 2) / Which way?"
            openSet={acc.openSet} toggle={acc.toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
              { jp: 'どちらがいいですか？', hep: 'do·chi·ra ga ii de·su ka', en: 'Which is better?' },
              { jp: '出口はどちらですか？', hep: 'de·gu·chi wa do·chi·ra de·su ka', en: 'Which way is the exit?' },
              { jp: 'どっちが大きいですか？', hep: 'dot·chi ga oo·kii de·su ka', en: 'Which one is bigger?' },
            ]} />

          <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-3 mt-1">
            <p className="text-base text-indigo-300 font-medium">💡 Casual shortcut</p>
            <p className="text-base text-slate-400 mt-1">In shops or casual situations, you can just say the question word alone — no ですか needed:</p>
            <div className="mt-2 space-y-1">
              <p className="text-base text-slate-300">いくら？ <span className="text-slate-500">— How much? (pointing at item)</span></p>
              <p className="text-base text-slate-300">どれ？ <span className="text-slate-500">— Which one? (choosing)</span></p>
              <p className="text-base text-slate-300">いつ？ <span className="text-slate-500">— When? (quick follow-up)</span></p>
              <p className="text-base text-slate-300">なに？ <span className="text-slate-500">— What? (surprised reaction)</span></p>
            </div>
          </div>
        </>
      )}

      {/* Rule card — Pattern 2 */}
      {tab === 'action' && (
        <>
          <div className="bg-slate-700/30 rounded-xl p-3">
            <p className="text-base text-slate-400 mb-2 text-center">Pattern: asking about actions / methods</p>
            <div className="flex items-center justify-center gap-1 flex-wrap">
              <span className="bg-sakura-500/30 text-sakura-300 px-2 py-1 rounded text-base font-bold">Q word</span>
              <span className="text-slate-500 text-base">+</span>
              <span className="bg-slate-600/50 text-slate-200 px-2 py-1 rounded text-base">verb</span>
              <span className="text-slate-500 text-base">ますか？</span>
            </div>
            <div className="mt-3 space-y-1">
              <p className="text-base text-slate-300 text-center"><span className="text-sakura-300 font-medium">どう</span> 行きますか？</p>
              <p className="text-base text-sakura-300 text-center"><span className="font-medium">dou</span> i·ki·ma·su ka</p>
              <p className="text-base text-slate-500 text-center"><span className="text-sakura-300">How</span> do I get there?</p>
            </div>
          </div>

          <AccordionHeader label="Question words" allOpen={acc.allOpen} toggleAll={acc.toggleAll} />

          <AccordionRow id="どう" jp="どう" rom="dou" meaning="How? (method/manner)"
            openSet={acc.openSet} toggle={acc.toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
              { jp: 'どう行きますか？', hep: 'dou i·ki·ma·su ka', en: 'How do I get there?' },
              { jp: 'これはどう使いますか？', hep: 'ko·re wa dou tsu·kai·ma·su ka', en: 'How do I use this?' },
              { jp: 'どうですか？', hep: 'dou de·su ka', en: 'How is it? / What do you think?' },
            ]} />
          <AccordionRow id="だれ" jp="だれ" rom="da·re" meaning="Who?"
            openSet={acc.openSet} toggle={acc.toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
              { jp: 'だれに聞けばいいですか？', hep: 'da·re ni ki·ke·ba ii de·su ka', en: 'Who should I ask?' },
              { jp: 'だれが案内してくれますか？', hep: 'da·re ga an·nai shi·te ku·re·ma·su ka', en: 'Who will guide us?' },
              { jp: 'だれの荷物ですか？', hep: 'da·re no ni·mo·tsu de·su ka', en: 'Whose luggage is this?' },
            ]} />
          <AccordionRow id="なぜ / どうして" jp="なぜ / どうして" rom="na·ze / dou·shi·te" meaning="Why?"
            openSet={acc.openSet} toggle={acc.toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
              { jp: 'どうして閉まっていますか？', hep: 'dou·shi·te shi·mat·te i·ma·su ka', en: 'Why is it closed?' },
              { jp: 'どうしてだめですか？', hep: 'dou·shi·te da·me de·su ka', en: 'Why is it not allowed?' },
              { jp: 'どうして遅れていますか？', hep: 'dou·shi·te o·ku·re·te i·ma·su ka', en: 'Why is it delayed?' },
            ]} />
        </>
      )}
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
