import { useState, useCallback, useEffect, createContext, useContext } from 'react';
import { Volume2, Star, X } from 'lucide-react';
import { speak } from '../utils/tts';
import { useSlidePanel } from '../utils/useSlidePanel';

const TermTapContext = createContext<((term: string) => void) | null>(null);

type Section = 'gojuon' | 'grammar' | 'particles' | 'polite' | 'numbers' | 'counters' | 'yesno' | 'whquestions' | 'patterns' | 'signs' | 'listening' | 'verbs';

const LEARN_STEPS: { id: Section; label: string; emoji: string; desc: string }[] = [
  { id: 'gojuon', label: '50 Sounds', emoji: 'あ', desc: 'Hiragana & Katakana chart' },
  { id: 'grammar', label: 'Sentence Structure', emoji: '📝', desc: 'S は O を V ます word order' },
  { id: 'particles', label: 'Key Particles', emoji: '🔤', desc: 'は が を に で の and more' },
  { id: 'polite', label: 'Polite Forms', emoji: '🎩', desc: 'ます ません ました です' },
  { id: 'numbers', label: 'Numbers', emoji: '🔢', desc: 'Counting, prices, time' },
  { id: 'yesno', label: 'Yes/No Questions', emoji: '❓', desc: 'Statement + か = question' },
  { id: 'whquestions', label: 'Question Words', emoji: '🔍', desc: '何 どこ いつ いくら どう' },
];

const KNOWLEDGE: { id: Section; label: string; emoji: string; desc: string }[] = [
  { id: 'patterns', label: 'Sentence Patterns', emoji: '📐', desc: 'お願いします ありますか etc.' },
  { id: 'verbs', label: 'Verb Forms', emoji: '🔀', desc: '食べる → ます ない た て forms' },
  { id: 'counters', label: 'Counters', emoji: '📏', desc: 'つ 人 枚 本 杯 (like 量詞)' },
  { id: 'signs', label: 'Common Signs', emoji: '🪧', desc: '入口 出口 禁煙 営業中' },
  { id: 'listening', label: 'What You\'ll Hear', emoji: '👂', desc: 'Common staff phrases to recognize' },
];

const ALL_SECTIONS = [...LEARN_STEPS, ...KNOWLEDGE];

type DrawerData = {
  title: string;
  titleRom?: string;
  subtitle?: string;
  items: { jp: string; hep: string; en: string }[];
} | null;

function Drawer({ data, onClose, refBookmarkedIds, onToggleRefBookmark, learnedIds, onToggleLearned }: { data: DrawerData; onClose: () => void; refBookmarkedIds?: Set<string>; onToggleRefBookmark?: (item: { jp: string; hep: string; en: string; section: string }) => void; learnedIds?: Set<string>; onToggleLearned?: (id: string) => void }) {
  const [closing, setClosing] = useState(false);
  useEffect(() => {
    if (data) {
      document.body.style.overflow = 'hidden';
      const scrollAreas = document.querySelectorAll('.scroll-area');
      scrollAreas.forEach(el => (el as HTMLElement).style.overflow = 'hidden');
      setClosing(false);
      return () => {
        document.body.style.overflow = '';
        scrollAreas.forEach(el => (el as HTMLElement).style.overflow = '');
      };
    }
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
    <div className={`fixed inset-0 z-50 flex flex-col justify-end transition-opacity duration-200 ${closing ? 'opacity-0' : 'opacity-100'}`} onClick={handleClose} onTouchMove={e => e.preventDefault()}>
      <div className="absolute inset-0 bg-black/50" />
      <div
        className={`relative bg-slate-800 rounded-t-2xl max-h-[80vh] flex flex-col ${closing ? 'animate-slide-down' : 'animate-slide-up'}`}
        onClick={e => e.stopPropagation()}
        onTouchMove={e => e.stopPropagation()}
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
            <button onClick={handleClose} className="text-xl text-slate-400 p-2"><X size={20} /></button>
          </div>
          {data.subtitle && <p className="text-base text-slate-400 mt-0.5">{data.subtitle}</p>}
        </div>
        <div className="overflow-y-auto p-4 space-y-2">
          {data.items.map((ex, i) => {
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
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => speak(ex.jp, 'ja-JP')} className="p-1 rounded-lg active:bg-slate-600 text-lg"><Volume2 size={20} /></button>
                    {onToggleRefBookmark && (
                      <button onClick={() => onToggleRefBookmark({ ...ex, section: data.title })} className="p-1 rounded-lg active:bg-slate-600 text-lg">
                        <Star size={18} className={isBm ? 'fill-amber-400 text-amber-400' : ''} />
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-base text-slate-400 flex-1">{ex.en}</p>
                  {onToggleLearned && (
                    <button
                      onClick={() => onToggleLearned(learnId)}
                      className={`text-sm px-2 py-0.5 rounded-full transition shrink-0 ml-2 ${isLearned ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-600/30 text-slate-500'}`}
                    >
                      {isLearned ? 'Learned ✓' : 'Mark learned'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface RefProps {
  lang?: string;
  refBookmarkedIds?: Set<string>;
  onToggleRefBookmark?: (item: { jp: string; hep: string; en: string; section: string }) => void;
  learnedIds?: Set<string>;
  onToggleLearned?: (id: string) => void;
  onAskMore?: (item: { jp: string; hep: string; en: string }) => void;
  explainLang?: string;
}

// Exported for use in MyStuff
export function RefItem({ ex, data, isBm, isLearned, onToggleRefBookmark, onToggleLearned }: {
  ex: { jp: string; hep: string; en: string };
  data: { title: string };
  isBm?: boolean;
  isLearned?: boolean;
  onToggleRefBookmark?: () => void;
  onToggleLearned?: () => void;
}) {
  return (
    <div className="bg-slate-700/40 rounded-xl p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-base font-medium text-slate-100">{ex.jp}</p>
          <p className="text-sm text-sakura-300">{ex.hep}</p>
          <p className="text-sm text-slate-400 mt-0.5">{ex.en}</p>
          <p className="text-xs text-slate-500 mt-0.5">From: {data.title}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => speak(ex.jp, 'ja-JP')} className="p-1 text-lg active:scale-110"><Volume2 size={20} /></button>
          {onToggleRefBookmark && (
            <button onClick={onToggleRefBookmark} className="p-1 text-lg"><Star size={18} className={isBm ? 'fill-amber-400 text-amber-400' : ''} /></button>
          )}
          {onToggleLearned && (
            <button onClick={onToggleLearned} className={`text-xs px-2 py-0.5 rounded-full ${isLearned ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-600/30 text-slate-500'}`}>
              {isLearned ? '✓' : 'Learn'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function Reference({ lang = 'ja', refBookmarkedIds = new Set(), onToggleRefBookmark, learnedIds = new Set(), onToggleLearned, onAskMore: _onAskMore, explainLang = 'en' }: RefProps) {
  const panel = useSlidePanel<Section>();
  const [drawer, setDrawer] = useState<DrawerData>(null);
  const openDrawer = useCallback((d: DrawerData) => setDrawer(d), []);
  const closeDrawer = useCallback(() => setDrawer(null), []);
  const [refToggleAll, setRefToggleAll] = useState<number>(0); // increment to toggle

  const activeMeta = ALL_SECTIONS.find(s => s.id === panel.value);
  const hasAccordion = panel.value && !['gojuon', 'numbers', 'signs'].includes(panel.value);

  return (
    <div className="h-full relative">
      {/* L1: Section grid */}
      <div className="scroll-area h-full">
        <div className="px-4 py-3 border-b border-slate-800">
          <h2 className="text-lg font-bold">Quick Reference</h2>
          <p className="text-base text-slate-400">Grammar & knowledge for travel</p>
        </div>

        {lang === 'ja' ? (
        <div className="p-4 space-y-4">
          <div>
            <h3 className="text-base font-semibold text-slate-400 mb-2">Learn — 7 Steps</h3>
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
            <h3 className="text-base font-semibold text-slate-400 mb-2">Knowledge</h3>
            <div className="grid grid-cols-2 gap-2">
              {KNOWLEDGE.map(sec => (
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
        ) : (
        <div className="p-4 space-y-4">
          <div className="bg-slate-800/40 rounded-xl p-4">
            <p className="text-base text-slate-300 mb-3">Quick reference for {lang === 'fr' ? 'French' : lang === 'es' ? 'Spanish' : 'this language'} is coming soon!</p>
            <p className="text-sm text-slate-500">In the meantime, try these features:</p>
            <ul className="text-sm text-slate-400 mt-2 space-y-1.5">
              <li>📖 <strong>Learn tab</strong> — Browse phrases by category</li>
              <li>🤖 <strong>AI tab</strong> — Ask about grammar, pronunciation, or culture</li>
              <li>✍️ <strong>Sentence Check</strong> — Check if your sentences are correct</li>
              <li>🌱 <strong>Sentence Grow</strong> — Build sentences step by step</li>
            </ul>
          </div>

          {lang === 'fr' && (
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-slate-400">🇫🇷 French Essentials</h3>

            <div className="bg-slate-800/60 rounded-xl p-4">
              <h4 className="text-base font-semibold text-slate-200 mb-2">📝 Gender & Articles</h4>
              <div className="space-y-1.5 text-sm">
                <p className="text-slate-300"><strong className="text-sakura-300">le</strong> — masculine singular <span className="text-slate-500">(le train, le café)</span></p>
                <p className="text-slate-300"><strong className="text-sakura-300">la</strong> — feminine singular <span className="text-slate-500">(la gare, la rue)</span></p>
                <p className="text-slate-300"><strong className="text-sakura-300">les</strong> — plural (both) <span className="text-slate-500">(les billets, les crêpes)</span></p>
                <p className="text-slate-300"><strong className="text-sakura-300">l'</strong> — before vowels <span className="text-slate-500">(l'hôtel, l'eau)</span></p>
                <p className="text-slate-300"><strong className="text-sakura-300">un / une</strong> — a (masc / fem) <span className="text-slate-500">(un café, une bière)</span></p>
                <p className="text-slate-300"><strong className="text-sakura-300">des</strong> — some (plural) <span className="text-slate-500">(des croissants)</span></p>
              </div>
            </div>

            <div className="bg-slate-800/60 rounded-xl p-4">
              <h4 className="text-base font-semibold text-slate-200 mb-2">🗣️ Pronunciation Tips</h4>
              <div className="space-y-1.5 text-sm">
                <p className="text-slate-300"><strong className="text-sakura-300">r</strong> — French R is from the throat, like gargling</p>
                <p className="text-slate-300"><strong className="text-sakura-300">Silent letters</strong> — Final consonants are usually silent <span className="text-slate-500">(petit → puh-tee)</span></p>
                <p className="text-slate-300"><strong className="text-sakura-300">Nasal vowels</strong> — on, an, in are nasal <span className="text-slate-500">(bon, dans, vin)</span></p>
                <p className="text-slate-300"><strong className="text-sakura-300">Liaison</strong> — Link final consonant to next vowel <span className="text-slate-500">(les amis → lay-za-mee)</span></p>
                <p className="text-slate-300"><strong className="text-sakura-300">é vs è</strong> — é = "ay", è = "eh" <span className="text-slate-500">(café, crème)</span></p>
              </div>
            </div>

            <div className="bg-slate-800/60 rounded-xl p-4">
              <h4 className="text-base font-semibold text-slate-200 mb-2">🎩 Tu vs Vous</h4>
              <div className="space-y-1.5 text-sm">
                <p className="text-slate-300"><strong className="text-sakura-300">vous</strong> — Use with strangers, staff, elderly, formal</p>
                <p className="text-slate-300"><strong className="text-sakura-300">tu</strong> — Use with friends, children, same age after offered</p>
                <p className="text-slate-400 mt-1">💡 When in doubt, always use <strong>vous</strong>. Wait for the other person to suggest <em>on se tutoie?</em></p>
              </div>
            </div>

            <div className="bg-slate-800/60 rounded-xl p-4">
              <h4 className="text-base font-semibold text-slate-200 mb-2">🔧 Key Verb Forms</h4>
              <div className="space-y-1.5 text-sm">
                <p className="text-slate-300"><strong className="text-sakura-300">être</strong> (to be): je suis, vous êtes, c'est</p>
                <p className="text-slate-300"><strong className="text-sakura-300">avoir</strong> (to have): j'ai, vous avez, il y a</p>
                <p className="text-slate-300"><strong className="text-sakura-300">aller</strong> (to go): je vais, vous allez, on va</p>
                <p className="text-slate-300"><strong className="text-sakura-300">vouloir</strong> (to want): je voudrais, vous voulez</p>
                <p className="text-slate-300"><strong className="text-sakura-300">pouvoir</strong> (can): je peux, vous pouvez, on peut</p>
              </div>
            </div>

            <div className="bg-slate-800/60 rounded-xl p-4">
              <h4 className="text-base font-semibold text-slate-200 mb-2">🔢 Numbers</h4>
              <div className="grid grid-cols-2 gap-1 text-sm">
                <p className="text-slate-300"><strong className="text-sakura-300">1</strong> un/une</p>
                <p className="text-slate-300"><strong className="text-sakura-300">2</strong> deux</p>
                <p className="text-slate-300"><strong className="text-sakura-300">3</strong> trois</p>
                <p className="text-slate-300"><strong className="text-sakura-300">4</strong> quatre</p>
                <p className="text-slate-300"><strong className="text-sakura-300">5</strong> cinq</p>
                <p className="text-slate-300"><strong className="text-sakura-300">10</strong> dix</p>
                <p className="text-slate-300"><strong className="text-sakura-300">20</strong> vingt</p>
                <p className="text-slate-300"><strong className="text-sakura-300">100</strong> cent</p>
              </div>
            </div>

            <div className="bg-slate-800/60 rounded-xl p-4">
              <h4 className="text-base font-semibold text-slate-200 mb-2">🪧 Common Signs</h4>
              <div className="space-y-1.5 text-sm">
                <p className="text-slate-300"><strong className="text-sakura-300">Sortie</strong> — Exit</p>
                <p className="text-slate-300"><strong className="text-sakura-300">Entrée</strong> — Entrance</p>
                <p className="text-slate-300"><strong className="text-sakura-300">Interdit</strong> — Forbidden</p>
                <p className="text-slate-300"><strong className="text-sakura-300">Fermé</strong> — Closed</p>
                <p className="text-slate-300"><strong className="text-sakura-300">Ouvert</strong> — Open</p>
                <p className="text-slate-300"><strong className="text-sakura-300">Gratuit</strong> — Free</p>
                <p className="text-slate-300"><strong className="text-sakura-300">Défense de fumer</strong> — No smoking</p>
                <p className="text-slate-300"><strong className="text-sakura-300">Soldes</strong> — Sale / Discount</p>
              </div>
            </div>
          </div>
          )}
        </div>
        )}
      </div>

      {/* L2: Full-page slide-in (Japanese only) */}
      {lang === 'ja' && panel.visible && (
        <div className={`absolute inset-0 bg-slate-950 ${panel.animClass} flex flex-col z-40`}>
          <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 shrink-0">
            <button onClick={() => panel.close()} className="text-lg text-slate-400 active:text-slate-200 p-1">
              ←
            </button>
            <h2 className="text-lg font-bold flex-1">{activeMeta?.emoji} {activeMeta?.label}</h2>
            {hasAccordion && (
              <button
                onClick={() => setRefToggleAll(prev => prev + 1)}
                className="text-base bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg active:bg-slate-700 transition shrink-0"
              >
                ▼ Open All
              </button>
            )}
          </div>
          <div className="scroll-area flex-1 px-3 pb-3">
            {panel.value === 'gojuon' && <GojuonRef openDrawer={openDrawer} />}
            {panel.value === 'grammar' && <GrammarRef rbIds={refBookmarkedIds} onRbToggle={onToggleRefBookmark} learnedIds={learnedIds} onToggleLearned={onToggleLearned} toggleSignal={refToggleAll} explainLang={explainLang} onNavigateVerbs={() => panel.open('verbs')} />}
            {panel.value === 'numbers' && <NumbersRef />}
            {panel.value === 'particles' && <ParticlesRef rbIds={refBookmarkedIds} onRbToggle={onToggleRefBookmark} learnedIds={learnedIds} onToggleLearned={onToggleLearned} toggleSignal={refToggleAll} />}
            {panel.value === 'counters' && <CountersRef rbIds={refBookmarkedIds} onRbToggle={onToggleRefBookmark} learnedIds={learnedIds} onToggleLearned={onToggleLearned} toggleSignal={refToggleAll} />}
            {panel.value === 'patterns' && <PatternsRef rbIds={refBookmarkedIds} onRbToggle={onToggleRefBookmark} learnedIds={learnedIds} onToggleLearned={onToggleLearned} toggleSignal={refToggleAll} explainLang={explainLang} onNavigateVerbs={() => panel.open('verbs')} />}
            {panel.value === 'polite' && <PoliteRef rbIds={refBookmarkedIds} onRbToggle={onToggleRefBookmark} learnedIds={learnedIds} onToggleLearned={onToggleLearned} toggleSignal={refToggleAll} />}
            {panel.value === 'yesno' && <YesNoRef rbIds={refBookmarkedIds} onRbToggle={onToggleRefBookmark} learnedIds={learnedIds} onToggleLearned={onToggleLearned} toggleSignal={refToggleAll} />}
            {panel.value === 'whquestions' && <WHQuestionsRef rbIds={refBookmarkedIds} onRbToggle={onToggleRefBookmark} learnedIds={learnedIds} onToggleLearned={onToggleLearned} toggleSignal={refToggleAll} />}
            {panel.value === 'signs' && <SignsRef />}
            {panel.value === 'listening' && <ListeningRef rbIds={refBookmarkedIds} onRbToggle={onToggleRefBookmark} learnedIds={learnedIds} onToggleLearned={onToggleLearned} toggleSignal={refToggleAll} />}
            {panel.value === 'verbs' && <VerbsRef rbIds={refBookmarkedIds} onRbToggle={onToggleRefBookmark} learnedIds={learnedIds} onToggleLearned={onToggleLearned} toggleSignal={refToggleAll} />}
          </div>
        </div>
      )}

      {/* L3: Drawer for examples */}
      <Drawer data={drawer} onClose={closeDrawer} refBookmarkedIds={refBookmarkedIds} onToggleRefBookmark={onToggleRefBookmark} learnedIds={learnedIds} onToggleLearned={onToggleLearned} />
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
        <button onClick={() => speak(jp, 'ja-JP')} className="text-lg active:scale-110 transition-transform shrink-0 p-1"><Volume2 size={20} /></button>
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

      {/* Voiced toggle banner — fixed height */}
      <div className="flex items-center justify-between bg-slate-700/30 rounded-lg px-3 mb-2 h-12">
        <div className="flex-1 min-w-0">
          <p className={`text-base transition-colors ${showVoiced ? 'text-indigo-300' : 'text-slate-400'}`}>
            {showVoiced ? 'か→が　さ→ざ　た→だ　は→ば/ぱ' : 'Voiced ゛゜'}
          </p>
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
              <div key={i} className="rounded-lg h-14 flex flex-col items-center justify-center bg-slate-700/15 opacity-50">
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
export function NumberConverter() {
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
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-800 shrink-0">
        <h2 className="text-lg font-bold">Number Converter</h2>
        <p className="text-base text-slate-400">Type a number → kanji + reading</p>
      </div>

      {/* Result area (scrollable) */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {result && (
          <div className="space-y-3">
            {/* Kanji result */}
            <div className="bg-slate-800/40 rounded-xl p-3.5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-2xl font-bold text-slate-50 mb-1">{result.kanji}</p>
                  <p className="text-base text-sakura-300">{result.romaji}</p>
                  <p className="text-base text-slate-400">{result.reading}</p>
                </div>
                <button onClick={() => speak(result.reading, 'ja-JP')} className="p-1 rounded-lg active:bg-slate-600 shrink-0"><Volume2 size={20} /></button>
              </div>
            </div>

            {/* Currency conversion */}
            {!isNaN(num) && num > 0 && (
              <div className="bg-slate-800/40 rounded-xl p-3.5">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Approximate value</p>
                <p className="text-base text-slate-300">¥{num.toLocaleString()} ≈ HK${(num * HKD_RATE).toFixed(1)}</p>
                <p className="text-base text-slate-300 mt-0.5">¥{num.toLocaleString()} ≈ CA${(num * CAD_RATE).toFixed(2)}</p>
              </div>
            )}
          </div>
        )}

        {input && !result && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
            <p className="text-sm text-red-400">Enter a number between 0 and 9,999,999</p>
          </div>
        )}

        {!input && (
          <div className="text-center py-8">
            <p className="text-4xl mb-3">🔢</p>
            <p className="text-base text-slate-500">Type a number below to see it in Japanese</p>
          </div>
        )}
      </div>

      {/* Input at bottom */}
      <div className="shrink-0 border-t border-slate-800 px-4 py-3">
        <input
          type="number"
          inputMode="numeric"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a number (e.g., 3500)"
          className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3 text-base text-slate-100 placeholder-slate-500 outline-none focus:ring-2 focus:ring-sakura-400/50 transition"
        />
      </div>
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
  toggleSignal?: number;
  explainLang?: string;
  onNavigateVerbs?: () => void;
}

// Grammar term explanations for purple chips — bilingual (en / zh-TW)
type GrammarTerm = {
  title: { en: string; tc: string };
  what: { en: string; tc: string };
  how: { en: string[]; tc: string[] };
  table?: { headers: { en: string[]; tc: string[] }; rows: string[][] };
  examples: { jp: string; reading: string; en: string; tc: string }[];
};

const GRAMMAR_TERMS: Record<string, GrammarTerm> = {
  'noun': {
    title: { en: 'Noun', tc: '名詞' },
    what: { en: 'A thing, place, or concept — just a regular word.', tc: '事物、地點或概念 — 一般名詞，直接使用。' },
    how: { en: ['Use it as-is', 'No conjugation needed'], tc: ['直接使用', '不需要變化'] },
    examples: [
      { jp: '水', reading: 'mi·zu', en: 'water', tc: '水' },
      { jp: 'メニュー', reading: 'me·nyuu', en: 'menu', tc: '菜單' },
      { jp: 'パスポート', reading: 'pa·su·poo·to', en: 'passport', tc: '護照' },
    ],
  },
  'place': {
    title: { en: 'Place', tc: '地點' },
    what: { en: 'A location or named place.', tc: '地點或場所名稱。' },
    how: { en: ['Use the place name as-is'], tc: ['直接使用地名'] },
    examples: [
      { jp: 'トイレ', reading: 'toi·re', en: 'toilet', tc: '廁所' },
      { jp: '駅', reading: 'e·ki', en: 'station', tc: '車站' },
      { jp: 'コンビニ', reading: 'kon·bi·ni', en: 'convenience store', tc: '便利商店' },
    ],
  },
  'object': {
    title: { en: 'Object (thing being acted on)', tc: '受詞（被動作的對象）' },
    what: { en: 'The thing you\'re doing something to — what you eat, buy, take, etc.', tc: '你對它做動作的東西 — 你吃的、買的、拿的東西。' },
    how: { en: ['Use a noun — the thing receiving the action'], tc: ['用名詞 — 接受動作的對象'] },
    examples: [
      { jp: 'ラーメン', reading: 'raa·men', en: 'ramen', tc: '拉麵' },
      { jp: '切符', reading: 'kip·pu', en: 'ticket', tc: '車票' },
      { jp: '写真', reading: 'sha·shin', en: 'photo', tc: '照片' },
    ],
  },
  'subject': {
    title: { en: 'Subject (who/what does it)', tc: '主語（誰/什麼做的）' },
    what: { en: 'Who or what performs the action — usually dropped in Japanese when it\'s "I".', tc: '執行動作的人或物 — 日語中如果是「我」通常省略。' },
    how: { en: ['Only needed when it\'s NOT "I" — a bus, a friend, a shop, etc.'], tc: ['只有不是「我」時才需要 — 巴士、朋友、店家等'] },
    examples: [
      { jp: 'このバス', reading: 'ko·no ba·su', en: 'this bus', tc: '這台巴士' },
      { jp: '友達', reading: 'to·mo·da·chi', en: 'friend', tc: '朋友' },
      { jp: 'お店', reading: 'o·mi·se', en: 'the shop', tc: '店家' },
    ],
  },
  'verb stem': {
    title: { en: 'Verb Stem (ます-stem)', tc: '動詞語幹（ます形去掉ます）' },
    what: { en: 'The ます-form with ます removed. This is the "core" of the verb.', tc: '動詞的 ます 形去掉 ます 後的部分，是動詞的核心。' },
    how: {
      en: ['Take the ます-form and remove ます'],
      tc: ['把 ます形 去掉 ます'],
    },
    table: {
      headers: { en: ['ます-form', '→', 'Stem'], tc: ['ます形', '→', '語幹'] },
      rows: [
        ['食べます', '→', '食べ'],
        ['行きます', '→', '行き'],
        ['飲みます', '→', '飲み'],
        ['話します', '→', '話し'],
        ['します', '→', 'し'],
      ],
    },
    examples: [
      { jp: '食べ', reading: 'ta·be', en: 'eat (stem)', tc: '吃（語幹）' },
      { jp: '行き', reading: 'i·ki', en: 'go (stem)', tc: '去（語幹）' },
      { jp: '飲み', reading: 'no·mi', en: 'drink (stem)', tc: '喝（語幹）' },
    ],
  },
  'verb て-form': {
    title: { en: 'Verb て-form', tc: '動詞 て形' },
    what: { en: 'The "connecting" form — used for requests, linking actions, and permissions.', tc: '動詞的「連接形」— 用於請求、連接動作、表達許可。' },
    how: {
      en: ['Change the verb ending based on its last character'],
      tc: ['根據動詞字尾來變化'],
    },
    table: {
      headers: { en: ['Ending', 'Change', 'Example'], tc: ['字尾', '變化', '例子'] },
      rows: [
        ['る-verb', '→ て', '食べる → 食べて'],
        ['う/つ/る', '→ って', '買う → 買って'],
        ['む/ぶ/ぬ', '→ んで', '飲む → 飲んで'],
        ['く', '→ いて', '書く → 書いて'],
        ['ぐ', '→ いで', '泳ぐ → 泳いで'],
        ['す', '→ して', '話す → 話して'],
      ],
    },
    examples: [
      { jp: '食べて', reading: 'ta·be·te', en: 'eat (te-form)', tc: '吃（て形）' },
      { jp: '書いて', reading: 'kai·te', en: 'write (te-form)', tc: '寫（て形）' },
      { jp: '話して', reading: 'ha·na·shi·te', en: 'speak (te-form)', tc: '說（て形）' },
    ],
  },
  'verb た-form': {
    title: { en: 'Verb た-form (Past Plain)', tc: '動詞 た形（過去式）' },
    what: { en: 'The casual past tense — same rules as て-form, but ends in た/だ instead of て/で.', tc: '動詞的常體過去式 — 變化規則跟 て形一樣，只是結尾換成 た/だ。' },
    how: {
      en: ['Same pattern as て-form, swap て→た and で→だ'],
      tc: ['跟 て形 規則一樣，把 て→た, で→だ'],
    },
    table: {
      headers: { en: ['Ending', 'Change', 'Example'], tc: ['字尾', '變化', '例子'] },
      rows: [
        ['る-verb', '→ た', '食べる → 食べた'],
        ['う/つ/る', '→ った', '買う → 買った'],
        ['む/ぶ/ぬ', '→ んだ', '飲む → 飲んだ'],
        ['く', '→ いた', '書く → 書いた'],
        ['す', '→ した', '話す → 話した'],
      ],
    },
    examples: [
      { jp: '食べた', reading: 'ta·be·ta', en: 'ate', tc: '吃了' },
      { jp: '行った', reading: 'it·ta', en: 'went', tc: '去了' },
      { jp: '飲んだ', reading: 'non·da', en: 'drank', tc: '喝了' },
    ],
  },
  'verb dictionary': {
    title: { en: 'Verb Dictionary Form', tc: '動詞辭書形' },
    what: { en: 'The base form found in dictionaries — unconjugated, casual present/future.', tc: '字典裡查到的原形 — 未變化，表示現在或未來。' },
    how: {
      en: ['This IS the base form', 'Use the verb as-is, no change needed'],
      tc: ['這就是動詞原形', '直接使用，不需要變化'],
    },
    examples: [
      { jp: '食べる', reading: 'ta·be·ru', en: 'eat', tc: '吃' },
      { jp: '行く', reading: 'i·ku', en: 'go', tc: '去' },
      { jp: 'する', reading: 'su·ru', en: 'do', tc: '做' },
    ],
  },
  'plain form': {
    title: { en: 'Plain Form', tc: '常體（普通形）' },
    what: { en: 'The casual form of any word — verb, adjective, or noun+だ. The "non-polite" version.', tc: '任何詞的非敬語形式 — 動詞、形容詞、名詞+だ 都可以。' },
    how: {
      en: ['Use the casual/dictionary form of any word type'],
      tc: ['使用任何詞類的常體形式'],
    },
    table: {
      headers: { en: ['Type', 'Form', 'Example'], tc: ['詞類', '形式', '例子'] },
      rows: [
        ['Verb', 'dictionary', '食べる'],
        ['い-adj', 'as-is', '高い'],
        ['な-adj', '+だ', '静かだ'],
        ['Noun', '+だ', '雨だ'],
      ],
    },
    examples: [
      { jp: '遅れる', reading: 'o·ku·re·ru', en: 'will be late (verb)', tc: '會遲到（動詞）' },
      { jp: '高い', reading: 'ta·kai', en: 'expensive (i-adj)', tc: '貴（い形容詞）' },
      { jp: '雨だ', reading: 'a·me da', en: "it's rain (noun+da)", tc: '是雨（名詞+だ）' },
    ],
  },
  'verb ない-stem': {
    title: { en: 'Verb ない-stem', tc: '動詞 ない語幹' },
    what: { en: 'The negative stem — the part before ない. Used to build "must do" patterns.', tc: '否定語幹 — ない 前面的部分。用來組成「必須做」的句型。' },
    how: {
      en: ['Change the verb ending to the あ-row sound'],
      tc: ['把動詞字尾換成あ段音'],
    },
    table: {
      headers: { en: ['Type', 'Rule', 'Example'], tc: ['類型', '規則', '例子'] },
      rows: [
        ['る-verb', 'drop る', '食べる → 食べ'],
        ['う-verb', 'う → あ', '行く → 行か'],
        ['する', '→ し', 'する → し'],
        ['来る', '→ こ', '来る → こ'],
      ],
    },
    examples: [
      { jp: '食べ', reading: 'ta·be', en: 'eat (ない-stem)', tc: '吃（ない語幹）' },
      { jp: '行か', reading: 'i·ka', en: 'go (ない-stem)', tc: '去（ない語幹）' },
      { jp: 'し', reading: 'shi', en: 'do (ない-stem)', tc: '做（ない語幹）' },
    ],
  },
  'verb ば-form': {
    title: { en: 'Verb ば-form (Conditional)', tc: '動詞 ば形（條件形）' },
    what: { en: 'The "if" conditional form — "if you do X".', tc: '條件形 —「如果做 X 的話」。' },
    how: {
      en: ['Change the last vowel to え-row + ば'],
      tc: ['把字尾換成え段音 + ば'],
    },
    table: {
      headers: { en: ['Type', 'Rule', 'Example'], tc: ['類型', '規則', '例子'] },
      rows: [
        ['る-verb', 'る → れば', '食べる → 食べれば'],
        ['う-verb', 'う → えば', '行く → 行けば'],
        ['する', '→ すれば', 'する → すれば'],
        ['来る', '→ くれば', '来る → くれば'],
      ],
    },
    examples: [
      { jp: '食べれば', reading: 'ta·be·re·ba', en: 'if you eat', tc: '如果吃的話' },
      { jp: '行けば', reading: 'i·ke·ba', en: 'if you go', tc: '如果去的話' },
      { jp: 'すれば', reading: 'su·re·ba', en: 'if you do', tc: '如果做的話' },
    ],
  },
  'verb': {
    title: { en: 'Verb', tc: '動詞' },
    what: { en: 'An action word — use ます-form for politeness in travel.', tc: '表示動作的詞 — 旅遊時用 ます形 比較禮貌。' },
    how: { en: ['Use ます-form for polite speech'], tc: ['用 ます形 表示禮貌'] },
    examples: [
      { jp: '食べます', reading: 'ta·be·ma·su', en: 'eat', tc: '吃' },
      { jp: '行きます', reading: 'i·ki·ma·su', en: 'go', tc: '去' },
      { jp: '飲みます', reading: 'no·mi·ma·su', en: 'drink', tc: '喝' },
    ],
  },
  'adj stem': {
    title: { en: 'Adjective Stem', tc: '形容詞語幹' },
    what: { en: 'An い-adjective with the final い removed.', tc: 'い形容詞去掉最後的 い。' },
    how: { en: ['Drop the final い from い-adjectives'], tc: ['把 い形容詞 去掉最後的 い'] },
    table: {
      headers: { en: ['Adjective', '→', 'Stem'], tc: ['形容詞', '→', '語幹'] },
      rows: [
        ['高い (expensive)', '→', '高'],
        ['辛い (spicy)', '→', '辛'],
        ['遠い (far)', '→', '遠'],
        ['大きい (big)', '→', '大き'],
      ],
    },
    examples: [
      { jp: '高', reading: 'ta·ka', en: 'expensive (stem)', tc: '貴（語幹）' },
      { jp: '辛', reading: 'ka·ra', en: 'spicy (stem)', tc: '辣（語幹）' },
      { jp: '遠', reading: 'too', en: 'far (stem)', tc: '遠（語幹）' },
    ],
  },
  'clause': {
    title: { en: 'Clause (your thought)', tc: '子句（你想說的內容）' },
    what: { en: 'A thought, opinion, or observation you want to express — plug in any idea here.', tc: '你想表達的想法、意見或觀察 — 任何內容都可以放這裡。' },
    how: { en: ['Any statement or description — use plain form for verbs/adjectives inside'], tc: ['任何陳述或描述 — 內部用常體'] },
    examples: [
      { jp: 'おいしい', reading: 'o·i·shii', en: "it's delicious", tc: '好吃' },
      { jp: '電車のほうが早い', reading: 'den·sha no hou ga ha·yai', en: 'train is faster', tc: '電車比較快' },
      { jp: '漢字は難しい', reading: 'kan·ji wa mu·zu·ka·shii', en: 'kanji is difficult', tc: '漢字很難' },
      { jp: '便利だ', reading: 'ben·ri da', en: 'is convenient', tc: '很方便' },
    ],
  },
  'result': {
    title: { en: 'Result', tc: '結果' },
    what: { en: 'The outcome — what happens as a consequence.', tc: '結果 — 產生什麼變化。' },
    how: { en: ['Describe what changes or increases'], tc: ['描述什麼產生了變化'] },
    examples: [
      { jp: 'おいしい', reading: 'o·i·shii', en: 'more delicious', tc: '越好吃' },
      { jp: '上手になります', reading: 'jou·zu ni na·ri·ma·su', en: 'get better', tc: '越來越好' },
    ],
  },
  'person': {
    title: { en: 'Person', tc: '人物' },
    what: { en: 'Who the statement applies to — whose perspective.', tc: '這句話的對象 — 從誰的角度來看。' },
    how: { en: ['Use a person or group noun'], tc: ['使用人物或群體名詞'] },
    examples: [
      { jp: '外国人', reading: 'gai·ko·ku·jin', en: 'foreigners', tc: '外國人' },
      { jp: '私', reading: 'wa·ta·shi', en: 'me', tc: '我' },
      { jp: '旅行者', reading: 'ryo·kou·sha', en: 'travelers', tc: '旅客' },
    ],
  },
};

function GrammarTermDrawer({ term, onClose, lang = 'en', onNavigateVerbs }: { term: string | null; onClose: () => void; lang?: string; onNavigateVerbs?: () => void }) {
  const [closing, setClosing] = useState(false);
  const data = term ? GRAMMAR_TERMS[term] : null;
  const isTc = lang === 'zh-TW';
  useEffect(() => {
    if (term) {
      document.body.style.overflow = 'hidden';
      // Prevent scroll on all scroll-area containers behind the drawer
      const scrollAreas = document.querySelectorAll('.scroll-area');
      scrollAreas.forEach(el => (el as HTMLElement).style.overflow = 'hidden');
      setClosing(false);
      return () => {
        document.body.style.overflow = '';
        scrollAreas.forEach(el => (el as HTMLElement).style.overflow = '');
      };
    }
  }, [term]);
  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => { setClosing(false); onClose(); }, 200);
  }, [onClose]);
  if (!data) return null;
  return (
    <div className={`fixed inset-0 z-[60] flex flex-col justify-end transition-opacity duration-200 ${closing ? 'opacity-0' : 'opacity-100'}`} onClick={handleClose} onTouchMove={e => e.preventDefault()}>
      <div className="absolute inset-0 bg-black/50" />
      <div className={`relative bg-slate-800 rounded-t-2xl max-h-[85vh] flex flex-col ${closing ? 'animate-slide-down' : 'animate-slide-up'}`} onClick={e => e.stopPropagation()} onTouchMove={e => e.stopPropagation()}>
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 rounded-full bg-slate-600" />
        </div>
        <div className="px-4 pb-3 border-b border-slate-700/50 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="bg-purple-500/20 text-purple-300 px-2.5 py-1 rounded-lg text-base font-medium border border-purple-500/30">{term}</span>
              <h3 className="text-lg font-bold text-slate-100">{isTc ? data.title.tc : data.title.en}</h3>
            </div>
            <button onClick={handleClose} className="text-xl text-slate-400 p-2"><X size={20} /></button>
          </div>
        </div>
        <div className="overflow-y-auto flex-1 min-h-0 p-4 space-y-5">
          {/* What is it */}
          <div className="bg-slate-700/30 rounded-xl p-3.5">
            <p className="text-xs font-semibold text-purple-300/80 uppercase tracking-wide mb-1.5">{isTc ? '這是什麼？' : 'What is it?'}</p>
            <p className="text-base text-slate-200 leading-relaxed">{isTc ? data.what.tc : data.what.en}</p>
          </div>

          {/* How to form */}
          <div className="bg-slate-700/30 rounded-xl p-3.5">
            <p className="text-xs font-semibold text-emerald-300/80 uppercase tracking-wide mb-2">{isTc ? '怎麼變化？' : 'How to form'}</p>
            <div className="space-y-1.5">
              {(isTc ? data.how.tc : data.how.en).map((line, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-emerald-400/60 text-sm mt-0.5 shrink-0">{i === 0 ? '→' : '•'}</span>
                  <p className="text-base text-slate-200">{line}</p>
                </div>
              ))}
            </div>
            {/* Conjugation table */}
            {data.table && (
              <table className="w-full mt-3 text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-600/50">
                    {(isTc ? data.table.headers.tc : data.table.headers.en).map((h, i) => (
                      <th key={i} className="text-left py-1.5 px-2 text-slate-400 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.table.rows.map((row, i) => (
                    <tr key={i} className="border-b border-slate-700/30 last:border-0">
                      {row.map((cell, j) => (
                        <td key={j} className={`py-1.5 px-2 ${j === 0 ? 'text-purple-300' : j === 1 ? 'text-emerald-300' : 'text-slate-200'}`}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Examples */}
          <div>
            <p className="text-xs font-semibold text-sakura-300/80 uppercase tracking-wide mb-2 px-1">{isTc ? '例子' : 'Examples'}</p>
            <div className="space-y-2">
              {data.examples.map((ex, i) => (
                <div key={i} className="bg-slate-700/40 rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-baseline gap-2 min-w-0">
                    <span className="text-lg font-medium text-slate-100 shrink-0">{ex.jp}</span>
                    <span className="text-sm text-sakura-300">{ex.reading}</span>
                  </div>
                  <span className="text-sm text-slate-400 shrink-0">{isTc ? ex.tc : ex.en}</span>
                </div>
              ))}
            </div>
            {/* "More examples" link to Verb Forms section */}
            {onNavigateVerbs && term && term.startsWith('verb') && (
              <button
                onClick={() => { handleClose(); setTimeout(() => onNavigateVerbs(), 250); }}
                className="mt-3 w-full bg-purple-500/10 border border-purple-500/30 rounded-xl px-4 py-2.5 text-sm text-purple-300 font-medium active:bg-purple-500/20 transition"
              >
                {isTc ? '查看更多動詞變化 →' : 'More verb conjugations →'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AccordionRow({ id, jp, rom, meaning, structure, items, openSet, toggle, section, refBookmarkedIds, onToggleRefBookmark, learnedIds, onToggleLearned, onTermTap }: { id: string; jp: string; rom: string; meaning: string; structure?: string[]; items: { jp: string; hep: string; en: string }[]; openSet: Set<string>; toggle: (k: string) => void; section?: string; refBookmarkedIds?: Set<string>; onToggleRefBookmark?: (item: { jp: string; hep: string; en: string; section: string }) => void; learnedIds?: Set<string>; onToggleLearned?: (id: string) => void; onTermTap?: (term: string) => void }) {
  const isOpen = openSet.has(id);
  const termTapCtx = useContext(TermTapContext);
  const handleTermTap = onTermTap || termTapCtx;
  return (
    <div className={`bg-slate-700/40 rounded-xl overflow-hidden ${isOpen ? 'ring-1 ring-sakura-400/30' : ''}`}>
      <div className="flex items-start gap-2 p-3">
        <button onClick={() => toggle(id)} className="flex-1 text-left">
          <p className="text-lg font-medium text-slate-50">{jp}</p>
          <p className="text-base text-sakura-300 mt-0.5">{rom}</p>
          <p className="text-base text-slate-400 mt-0.5">{meaning}</p>
        </button>
        <button onClick={() => speak(jp, 'ja-JP')} className="p-1 rounded-lg active:bg-slate-600 text-lg shrink-0"><Volume2 size={20} /></button>
        <button onClick={() => toggle(id)} className="text-base text-slate-500 shrink-0 p-1">{isOpen ? '▲' : '▼'}</button>
      </div>
      {isOpen && (
        <div className="px-1.5 pb-1.5 space-y-1.5">
          {structure && structure.length > 0 && (
            <div className="bg-slate-600/20 rounded-lg px-3 py-2.5 space-y-2">
              {structure.map((line, i) => {
                const isQuestion = line.startsWith('❓') || line.startsWith('Ask:');
                const cleanLine = line.replace(/^(Say:|Ask:|❓|🗣️|\u{FE0F})\s*/gu, '');
                return (
                  <div key={i} className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs text-slate-500 shrink-0 w-8">{isQuestion ? 'Ask' : 'Say'}</span>
                    {cleanLine.split(/(\[[^\]]+\]|\{[^}]+\})/g).filter(Boolean).map((part, j) => {
                      if (part.startsWith('[') && part.endsWith(']')) {
                        const term = part.slice(1, -1);
                        const hasDef = term in GRAMMAR_TERMS;
                        return hasDef && handleTermTap ? (
                          <button key={j} onClick={() => handleTermTap(term)} className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded text-sm border border-purple-500/30 active:bg-purple-500/40 transition">
                            {term}
                          </button>
                        ) : (
                          <span key={j} className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded text-sm border border-purple-500/30">{term}</span>
                        );
                      }
                      if (part.startsWith('{') && part.endsWith('}')) {
                        return <span key={j} className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-sm border border-emerald-500/30">{part.slice(1, -1)}</span>;
                      }
                      const trimmed = part.trim();
                      if (!trimmed) return null;
                      return <span key={j} className="text-slate-400 text-sm">{trimmed}</span>;
                    })}
                  </div>
                );
              })}
            </div>
          )}
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
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => speak(ex.jp, 'ja-JP')} className="p-1 rounded-lg active:bg-slate-600 text-lg"><Volume2 size={20} /></button>
                    {onToggleRefBookmark && (
                      <button onClick={() => onToggleRefBookmark({ ...ex, section: section || id })} className="p-1 rounded-lg active:bg-slate-600 text-lg">
                        <Star size={18} className={isBm ? 'fill-amber-400 text-amber-400' : ''} />
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-base text-slate-400 flex-1">{ex.en}</p>
                  {onToggleLearned && (
                    <button
                      onClick={() => onToggleLearned(learnId)}
                      className={`text-sm px-2 py-0.5 rounded-full transition shrink-0 ml-2 ${isLearned ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-600/30 text-slate-500'}`}
                    >
                      {isLearned ? 'Learned ✓' : 'Mark learned'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function useAccordion(keys: string[], externalToggle?: number) {
  const [openSet, setOpenSet] = useState<Set<string>>(new Set());
  const allOpen = keys.length > 0 && keys.every(k => openSet.has(k));

  // React to external toggle signal from header
  useEffect(() => {
    if (externalToggle && externalToggle > 0) {
      setOpenSet(prev => {
        const currentlyAllOpen = keys.length > 0 && keys.every(k => prev.has(k));
        return currentlyAllOpen ? new Set() : new Set(keys);
      });
    }
  }, [externalToggle]);

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

function ParticlesRef({ rbIds, onRbToggle, learnedIds, onToggleLearned, toggleSignal }: RbProps) {
  const [group, setGroup] = useState<'all' | 'roles' | 'place' | 'connect' | 'range' | 'tone'>('all');

  const rolesKeys = ['は','が','を'];
  const placeKeys = ['に','で','へ'];
  const connectKeys = ['の','と','も'];
  const rangeKeys = ['から','まで','か'];
  const toneKeys = ['よ','ね','けど'];

  const activeKeys = group === 'all' ? [...rolesKeys, ...placeKeys, ...connectKeys, ...rangeKeys, ...toneKeys]
    : group === 'roles' ? rolesKeys
    : group === 'place' ? placeKeys
    : group === 'connect' ? connectKeys
    : group === 'range' ? rangeKeys
    : toneKeys;

  const { openSet, toggle } = useAccordion(activeKeys, toggleSignal);

  const tabs = [
    { id: 'all' as const, label: 'All' },
    { id: 'roles' as const, label: 'Roles' },
    { id: 'place' as const, label: 'Place' },
    { id: 'connect' as const, label: 'Connect' },
    { id: 'range' as const, label: 'Range' },
    { id: 'tone' as const, label: 'Tone' },
  ];

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-2 mb-3 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setGroup(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-base whitespace-nowrap transition ${
              group === tab.id
                ? 'bg-sakura-500/60 text-white'
                : 'bg-slate-700/50 text-slate-400 active:bg-slate-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {(group === 'all' || group === 'roles') && (
        <>
          {group === 'all' && <p className="text-sm text-slate-500 font-medium mt-2 mb-1">Marking Roles</p>}
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
        </>
      )}

      {(group === 'all' || group === 'place') && (
        <>
          {group === 'all' && <p className="text-sm text-slate-500 font-medium mt-4 mb-1">Place & Direction</p>}
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
        </>
      )}

      {(group === 'all' || group === 'connect') && (
        <>
          {group === 'all' && <p className="text-sm text-slate-500 font-medium mt-4 mb-1">Connecting</p>}
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
        </>
      )}

      {(group === 'all' || group === 'range') && (
        <>
          {group === 'all' && <p className="text-sm text-slate-500 font-medium mt-4 mb-1">Range & Question</p>}
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
        </>
      )}

      {(group === 'all' || group === 'tone') && (
        <>
          {group === 'all' && <p className="text-sm text-slate-500 font-medium mt-4 mb-1">Tone & Nuance</p>}
      <AccordionRow id="よ" jp="よ" rom="yo" meaning="Emphasis / informing — telling someone something new"
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: 'おいしいですよ', hep: 'o·i·shii de·su yo', en: 'It\'s delicious! (you should know)' },
          { jp: 'もう閉まりますよ', hep: 'mou shi·ma·ri·ma·su yo', en: 'It\'s closing soon! (heads up)' },
          { jp: 'ここですよ', hep: 'ko·ko de·su yo', en: 'It\'s right here! (informing)' },
        ]} />
      <AccordionRow id="ね" jp="ね" rom="ne" meaning="Agreement / confirmation — right?, isn't it?"
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: 'おいしいですね', hep: 'o·i·shii de·su ne', en: 'It\'s delicious, isn\'t it?' },
          { jp: 'いい天気ですね', hep: 'ii ten·ki de·su ne', en: 'Nice weather, right?' },
          { jp: '便利ですね', hep: 'ben·ri de·su ne', en: 'That\'s convenient, isn\'t it?' },
        ]} />
      <AccordionRow id="けど" jp="けど" rom="ke·do" meaning="But / however — softening or contrasting"
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '行きたいですけど、時間がありません', hep: 'i·ki·tai de·su ke·do, ji·kan ga a·ri·ma·sen', en: 'I want to go, but I don\'t have time' },
          { jp: 'すみませんけど、もう一度お願いします', hep: 'su·mi·ma·sen ke·do, mou i·chi·do o·ne·gai·shi·ma·su', en: 'Sorry, but could you say that again?' },
          { jp: 'おいしいですけど、辛いです', hep: 'o·i·shii de·su ke·do, ka·rai de·su', en: 'It\'s delicious, but spicy' },
        ]} />
        </>
      )}
    </div>
  );
}

function CountersRef({ rbIds, onRbToggle, learnedIds, onToggleLearned, toggleSignal }: RbProps) {
  const { openSet, toggle } = useAccordion(['〜つ','〜人','〜枚','〜本','〜杯','〜個','〜台','〜泊','〜名','〜階'], toggleSignal);
  return (
    <div className="mt-2 space-y-1.5">
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

function PatternsRef({ rbIds, onRbToggle, learnedIds, onToggleLearned, toggleSignal, explainLang = 'en', onNavigateVerbs }: RbProps) {
  const [patternLevel, setPatternLevel] = useState<'all' | 'basic' | 'intermediate' | 'advanced'>('all');
  const [activeTerm, setActiveTerm] = useState<string | null>(null);

  const basicKeys = ['○○をお願いします','○○はありますか','○○はどこですか','○○たいです','○○てください','○○ないでください','○○がわかりません','○○してもいいですか'];
  const intermediateKeys = ['〜てもらえますか','〜と思います','〜かもしれません','〜ほうがいい','〜すぎます','〜ことができますか','〜つもりです','〜たことがあります','AもBも','〜なければなりません'];
  const advancedKeys = ['〜てしまいました','〜ことにしました','〜わけではない','〜ようにしています','〜ば〜ほど','〜にとって'];

  const activeKeys = patternLevel === 'all' ? [...basicKeys, ...intermediateKeys, ...advancedKeys]
    : patternLevel === 'basic' ? basicKeys
    : patternLevel === 'intermediate' ? intermediateKeys
    : advancedKeys;

  const { openSet, toggle } = useAccordion(activeKeys, toggleSignal);

  const renderBasic = () => (
    <>
      <AccordionRow id="○○をお願いします" jp="○○をお願いします" rom="○○ wo o·ne·gai·shi·ma·su" meaning="○○ please — works for anything!"
        structure={['Say: [noun] を {お願いします}']}
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '水をお願いします', hep: 'mi·zu wo o·ne·gai·shi·ma·su', en: 'Water please' },
          { jp: 'メニューをお願いします', hep: 'me·nyuu wo o·ne·gai·shi·ma·su', en: 'Menu please' },
          { jp: 'お会計をお願いします', hep: 'o·kai·kei wo o·ne·gai·shi·ma·su', en: 'Check please' },
          { jp: '二つをお願いします', hep: 'fu·ta·tsu wo o·ne·gai·shi·ma·su', en: 'Two of them please' },
        ]} />
      <AccordionRow id="○○はありますか" jp="○○はありますか" rom="○○ wa a·ri·ma·su ka" meaning="Is there ○○? / Do you have ○○?"
        structure={['Ask: [noun] は {ありますか}？']}
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: 'Wi-Fiはありますか？', hep: 'wai·fai wa a·ri·ma·su ka', en: 'Is there Wi-Fi?' },
          { jp: '英語のメニューはありますか？', hep: 'ei·go no me·nyuu wa a·ri·ma·su ka', en: 'Do you have an English menu?' },
          { jp: '空いている席はありますか？', hep: 'ai·te i·ru se·ki wa a·ri·ma·su ka', en: 'Is there an empty seat?' },
        ]} />
      <AccordionRow id="○○はどこですか" jp="○○はどこですか" rom="○○ wa do·ko de·su ka" meaning="Where is ○○?"
        structure={['Ask: [place] は {どこですか}？']}
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: 'トイレはどこですか？', hep: 'toi·re wa do·ko de·su ka', en: 'Where is the toilet?' },
          { jp: '駅はどこですか？', hep: 'e·ki wa do·ko de·su ka', en: 'Where is the station?' },
          { jp: 'ATMはどこですか？', hep: 'ee·tii·e·mu wa do·ko de·su ka', en: 'Where is an ATM?' },
        ]} />
      <AccordionRow id="○○たいです" jp="○○たいです" rom="○○ tai de·su" meaning="I want to ○○ (desire)"
        structure={['Say: [verb stem] {たいです}', 'Ask: [verb stem] {たいですか}？']}
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '食べたいです', hep: 'ta·be·tai de·su', en: 'I want to eat' },
          { jp: '行きたいです', hep: 'i·ki·tai de·su', en: 'I want to go' },
          { jp: '荷物を送りたいです', hep: 'ni·mo·tsu wo o·ku·ri·tai de·su', en: 'I want to send luggage' },
        ]} />
      <AccordionRow id="○○てください" jp="○○てください" rom="○○ te ku·da·sai" meaning="Please do ○○ (polite request)"
        structure={['Say: [verb て-form] {ください}']}
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '書いてください', hep: 'kai·te ku·da·sai', en: 'Please write it down' },
          { jp: 'ゆっくり話してください', hep: 'yuk·ku·ri ha·na·shi·te ku·da·sai', en: 'Please speak slowly' },
          { jp: '温めてください', hep: 'a·ta·ta·me·te ku·da·sai', en: 'Please heat it up' },
        ]} />
      <AccordionRow id="○○ないでください" jp="○○ないでください" rom="○○ nai·de ku·da·sai" meaning="Please don't ○○ (polite negative request)"
        structure={['Say: [verb ない-stem] {ないでください}']}
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: 'わさびを入れないでください', hep: 'wa·sa·bi wo i·re·nai·de ku·da·sai', en: 'Please don\'t add wasabi' },
          { jp: '袋はいりません、入れないでください', hep: 'fu·ku·ro wa i·ri·ma·sen, i·re·nai·de ku·da·sai', en: 'No bag needed, please don\'t put it in' },
          { jp: '写真を撮らないでください', hep: 'sha·shin wo to·ra·nai·de ku·da·sai', en: 'Please don\'t take photos' },
          { jp: '氷を入れないでください', hep: 'kou·ri wo i·re·nai·de ku·da·sai', en: 'No ice please' },
        ]} />
      <AccordionRow id="○○がわかりません" jp="○○がわかりません" rom="○○ ga wa·ka·ri·ma·sen" meaning="I don't understand ○○"
        structure={['Say: [noun] が {わかりません}']}
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '日本語がわかりません', hep: 'ni·hon·go ga wa·ka·ri·ma·sen', en: "I don't understand Japanese" },
          { jp: '使い方がわかりません', hep: 'tsu·kai·ka·ta ga wa·ka·ri·ma·sen', en: "I don't know how to use it" },
          { jp: '道がわかりません', hep: 'mi·chi ga wa·ka·ri·ma·sen', en: "I don't know the way" },
        ]} />
      <AccordionRow id="○○してもいいですか" jp="○○してもいいですか" rom="○○ shi·te mo ii de·su ka" meaning="May I ○○? (asking permission)"
        structure={['Ask: [verb て-form] {もいいですか}？']}
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '写真を撮ってもいいですか？', hep: 'sha·shin wo tot·te mo ii de·su ka', en: 'May I take photos?' },
          { jp: 'ここで食べてもいいですか？', hep: 'ko·ko de ta·be·te mo ii de·su ka', en: 'May I eat here?' },
          { jp: '試着してもいいですか？', hep: 'shi·cha·ku shi·te mo ii de·su ka', en: 'May I try it on?' },
        ]} />
    </>
  );

  const renderIntermediate = () => (
    <>
      <AccordionRow id="〜てもらえますか" jp="〜てもらえますか" rom="te mo·ra·e·ma·su ka" meaning="Could you ○○ for me? (polite request)"
        structure={['Ask: [verb て-form] {もらえますか}？']}
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '写真を撮ってもらえますか？', hep: 'sha·shin wo tot·te mo·ra·e·ma·su ka', en: 'Could you take a photo for me?' },
          { jp: 'ここまで連れて行ってもらえますか？', hep: 'ko·ko ma·de tsu·re·te it·te mo·ra·e·ma·su ka', en: 'Could you take me here?' },
          { jp: '説明してもらえますか？', hep: 'se·tsu·mei shi·te mo·ra·e·ma·su ka', en: 'Could you explain it?' },
        ]} />
      <AccordionRow id="〜と思います" jp="〜と思います" rom="to o·mo·i·ma·su" meaning="I think ○○"
        structure={['Say: [clause] {と思います}', 'Ask: [clause] {と思いますか}？']}
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: 'おいしいと思います', hep: 'o·i·shii to o·mo·i·ma·su', en: 'I think it\'s delicious' },
          { jp: '電車のほうが早いと思います', hep: 'den·sha no hou ga ha·yai to o·mo·i·ma·su', en: 'I think the train is faster' },
          { jp: '大丈夫だと思います', hep: 'dai·jou·bu da to o·mo·i·ma·su', en: 'I think it\'s fine' },
        ]} />
      <AccordionRow id="〜かもしれません" jp="〜かもしれません" rom="ka·mo shi·re·ma·sen" meaning="Maybe ○○ / It might ○○"
        structure={['Say: [plain form] {かもしれません}']}
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '遅れるかもしれません', hep: 'o·ku·re·ru ka·mo shi·re·ma·sen', en: 'I might be late' },
          { jp: '雨が降るかもしれません', hep: 'a·me ga fu·ru ka·mo shi·re·ma·sen', en: 'It might rain' },
          { jp: '売り切れかもしれません', hep: 'u·ri·ki·re ka·mo shi·re·ma·sen', en: 'It might be sold out' },
        ]} />
      <AccordionRow id="〜ほうがいい" jp="〜ほうがいい" rom="hou ga ii" meaning="Should ○○ / It's better to ○○"
        structure={['Say: [verb た-form] {ほうがいい} です', 'Ask: [verb た-form] {ほうがいい} ですか？']}
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '早く行ったほうがいいです', hep: 'ha·ya·ku it·ta hou ga ii de·su', en: "It's better to go early" },
          { jp: '予約したほうがいいですか？', hep: 'yo·ya·ku shi·ta hou ga ii de·su ka', en: 'Should I make a reservation?' },
          { jp: '現金を持ったほうがいいです', hep: 'gen·kin wo mot·ta hou ga ii de·su', en: "It's better to carry cash" },
        ]} />
      <AccordionRow id="〜すぎます" jp="〜すぎます" rom="su·gi·ma·su" meaning="Too ○○ (excessive)"
        structure={['Say: [verb stem] {すぎます}', 'Say: [adj stem] {すぎます}']}
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '高すぎます', hep: 'ta·ka·su·gi·ma·su', en: 'Too expensive' },
          { jp: '辛すぎます', hep: 'ka·ra·su·gi·ma·su', en: 'Too spicy' },
          { jp: '遠すぎます', hep: 'too·su·gi·ma·su', en: 'Too far' },
          { jp: '食べすぎました', hep: 'ta·be·su·gi·ma·shi·ta', en: 'I ate too much' },
        ]} />
      <AccordionRow id="〜ことができますか" jp="〜ことができますか" rom="ko·to ga de·ki·ma·su ka" meaning="Can I ○○? / Is it possible?"
        structure={['Ask: [verb dictionary] {ことができますか}？']}
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: 'カードで払うことができますか？', hep: 'kaa·do de ha·ra·u ko·to ga de·ki·ma·su ka', en: 'Can I pay by card?' },
          { jp: '英語を話すことができますか？', hep: 'ei·go wo ha·na·su ko·to ga de·ki·ma·su ka', en: 'Can you speak English?' },
          { jp: '予約を変更することができますか？', hep: 'yo·ya·ku wo hen·kou su·ru ko·to ga de·ki·ma·su ka', en: 'Can I change my reservation?' },
        ]} />
      <AccordionRow id="〜つもりです" jp="〜つもりです" rom="tsu·mo·ri de·su" meaning="I plan to ○○"
        structure={['Say: [verb dictionary] {つもりです}']}
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '明日京都に行くつもりです', hep: 'a·shi·ta kyou·to ni i·ku tsu·mo·ri de·su', en: 'I plan to go to Kyoto tomorrow' },
          { jp: '三泊するつもりです', hep: 'san·pa·ku su·ru tsu·mo·ri de·su', en: 'I plan to stay three nights' },
          { jp: '電車で行くつもりです', hep: 'den·sha de i·ku tsu·mo·ri de·su', en: 'I plan to go by train' },
        ]} />
      <AccordionRow id="〜たことがあります" jp="〜たことがあります" rom="ta ko·to ga a·ri·ma·su" meaning="I have experienced ○○ (past experience)"
        structure={['Say: [verb た-form] {ことがあります}', 'Ask: [verb た-form] {ことがありますか}？']}
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '日本に来たことがあります', hep: 'ni·hon ni ki·ta ko·to ga a·ri·ma·su', en: 'I have been to Japan before' },
          { jp: 'すしを食べたことがあります', hep: 'su·shi wo ta·be·ta ko·to ga a·ri·ma·su', en: 'I have eaten sushi before' },
          { jp: '新幹線に乗ったことがあります', hep: 'shin·kan·sen ni not·ta ko·to ga a·ri·ma·su', en: 'I have ridden the Shinkansen' },
        ]} />
      <AccordionRow id="AもBも" jp="AもBも" rom="A mo B mo" meaning="Both A and B — listing multiple things"
        structure={['Say: [noun] {も} [noun] {も} [verb]']}
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: 'ラーメンもぎょうざもください', hep: 'raa·men mo gyou·za mo ku·da·sai', en: 'I\'ll have both ramen and gyoza' },
          { jp: '日本語も英語も話します', hep: 'ni·hon·go mo ei·go mo ha·na·shi·ma·su', en: 'I speak both Japanese and English' },
          { jp: '東京も京都も行きたいです', hep: 'tou·kyou mo kyou·to mo i·ki·tai de·su', en: 'I want to go to both Tokyo and Kyoto' },
          { jp: 'これもそれもおいしいです', hep: 'ko·re mo so·re mo o·i·shii de·su', en: 'Both this and that are delicious' },
        ]} />
      <AccordionRow id="〜なければなりません" jp="〜なければなりません" rom="na·ke·re·ba na·ri·ma·sen" meaning="Must ○○ / Have to ○○"
        structure={['Say: [verb ない-stem] {なければなりません}']}
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '予約しなければなりません', hep: 'yo·ya·ku shi·na·ke·re·ba na·ri·ma·sen', en: 'I must make a reservation' },
          { jp: 'パスポートを見せなければなりません', hep: 'pa·su·poo·to wo mi·se·na·ke·re·ba na·ri·ma·sen', en: 'I have to show my passport' },
          { jp: '靴を脱がなければなりません', hep: 'ku·tsu wo nu·ga·na·ke·re·ba na·ri·ma·sen', en: 'I have to take off my shoes' },
        ]} />
    </>
  );

  const renderAdvanced = () => (
    <>
      <AccordionRow id="〜てしまいました" jp="〜てしまいました" rom="te shi·mai·ma·shi·ta" meaning="I accidentally / unfortunately did ○○"
        structure={['Say: [verb て-form] {しまいました}']}
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '財布をなくしてしまいました', hep: 'sai·fu wo na·ku·shi·te shi·mai·ma·shi·ta', en: 'I lost my wallet' },
          { jp: '電車に乗り過ごしてしまいました', hep: 'den·sha ni no·ri·su·go·shi·te shi·mai·ma·shi·ta', en: 'I missed my train stop' },
          { jp: '携帯を壊してしまいました', hep: 'kei·tai wo ko·wa·shi·te shi·mai·ma·shi·ta', en: 'I broke my phone' },
          { jp: 'パスポートを忘れてしまいました', hep: 'pa·su·poo·to wo wa·su·re·te shi·mai·ma·shi·ta', en: 'I forgot my passport' },
        ]} />
      <AccordionRow id="〜ことにしました" jp="〜ことにしました" rom="ko·to ni shi·ma·shi·ta" meaning="I decided to ○○"
        structure={['Say: [verb dictionary] {ことにしました}']}
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '京都に行くことにしました', hep: 'kyou·to ni i·ku ko·to ni shi·ma·shi·ta', en: 'I decided to go to Kyoto' },
          { jp: '新幹線に乗ることにしました', hep: 'shin·kan·sen ni no·ru ko·to ni shi·ma·shi·ta', en: 'I decided to take the Shinkansen' },
          { jp: 'もう一泊することにしました', hep: 'mou ip·pa·ku su·ru ko·to ni shi·ma·shi·ta', en: 'I decided to stay one more night' },
        ]} />
      <AccordionRow id="〜ようにしています" jp="〜ようにしています" rom="you ni shi·te i·ma·su" meaning="I make a point to ○○ (habitual effort)"
        structure={['Say: [verb dictionary] {ようにしています}']}
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '毎日日本語を練習するようにしています', hep: 'mai·ni·chi ni·hon·go wo ren·shuu su·ru you ni shi·te i·ma·su', en: 'I make a point to practice Japanese every day' },
          { jp: 'なるべく現金を使うようにしています', hep: 'na·ru·be·ku gen·kin wo tsu·ka·u you ni shi·te i·ma·su', en: 'I try to use cash as much as possible' },
          { jp: '早く寝るようにしています', hep: 'ha·ya·ku ne·ru you ni shi·te i·ma·su', en: 'I try to go to bed early' },
        ]} />
      <AccordionRow id="〜わけではない" jp="〜わけではない" rom="wa·ke de wa nai" meaning="It's not that ○○ (clarifying nuance)"
        structure={['Say: [plain form] {わけではない} です']}
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '日本語がわからないわけではないです', hep: 'ni·hon·go ga wa·ka·ra·nai wa·ke de wa nai de·su', en: "It's not that I don't understand Japanese (a little)" },
          { jp: '嫌いなわけではないです', hep: 'ki·rai na wa·ke de wa nai de·su', en: "It's not that I dislike it" },
          { jp: '高いわけではないです', hep: 'ta·kai wa·ke de wa nai de·su', en: "It's not that it's expensive" },
        ]} />
      <AccordionRow id="〜ば〜ほど" jp="〜ば〜ほど" rom="ba ... ho·do" meaning="The more ○○, the more ○○"
        structure={['Say: [verb ば-form] [verb dictionary] ほど [result]']}
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '食べれば食べるほどおいしい', hep: 'ta·be·re·ba ta·be·ru ho·do o·i·shii', en: 'The more you eat, the more delicious it is' },
          { jp: '日本語を勉強すればするほど面白い', hep: 'ni·hon·go wo ben·kyou su·re·ba su·ru ho·do o·mo·shi·roi', en: 'The more I study Japanese, the more interesting it is' },
          { jp: '練習すればするほど上手になります', hep: 'ren·shuu su·re·ba su·ru ho·do jou·zu ni na·ri·ma·su', en: 'The more you practice, the better you get' },
        ]} />
      <AccordionRow id="〜にとって" jp="〜にとって" rom="ni tot·te" meaning="For ○○ / From ○○'s perspective"
        structure={['Say: [person] {にとって} [clause]']}
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '外国人にとって漢字は難しいです', hep: 'gai·ko·ku·jin ni tot·te kan·ji wa mu·zu·ka·shii de·su', en: 'For foreigners, kanji is difficult' },
          { jp: '私にとって日本は特別な場所です', hep: 'wa·ta·shi ni tot·te ni·hon wa to·ku·be·tsu na ba·sho de·su', en: 'For me, Japan is a special place' },
          { jp: '旅行者にとってICカードは便利です', hep: 'ryo·kou·sha ni tot·te ai·shii kaa·do wa ben·ri de·su', en: 'For travelers, IC cards are convenient' },
        ]} />
    </>
  );

  return (
    <TermTapContext.Provider value={setActiveTerm}>
    <div className="mt-2 space-y-1.5">
      {/* Level tabs */}
      <div className="flex gap-2 mb-3">
        {(['all', 'basic', 'intermediate', 'advanced'] as const).map(level => {
          const label = level === 'all' ? 'All' : level === 'intermediate' ? 'Intermediate' : level.charAt(0).toUpperCase() + level.slice(1);
          return (
            <button
              key={level}
              onClick={() => setPatternLevel(level)}
              className={`px-3 py-1.5 rounded-lg text-base whitespace-nowrap transition ${
                patternLevel === level
                  ? 'bg-sakura-500/60 text-white'
                  : 'bg-slate-700/50 text-slate-400 active:bg-slate-600'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {(patternLevel === 'all' || patternLevel === 'basic') && (
        <>
          {patternLevel === 'all' && <p className="text-sm text-slate-500 font-medium mt-2 mb-1">Basic</p>}
          {renderBasic()}
        </>
      )}
      {(patternLevel === 'all' || patternLevel === 'intermediate') && (
        <>
          {patternLevel === 'all' && <p className="text-sm text-slate-500 font-medium mt-4 mb-1">Intermediate</p>}
          {renderIntermediate()}
        </>
      )}
      {(patternLevel === 'all' || patternLevel === 'advanced') && (
        <>
          {patternLevel === 'all' && <p className="text-sm text-slate-500 font-medium mt-4 mb-1">Advanced</p>}
          {renderAdvanced()}
        </>
      )}
      <GrammarTermDrawer term={activeTerm} onClose={() => setActiveTerm(null)} lang={explainLang} onNavigateVerbs={onNavigateVerbs} />
    </div>
    </TermTapContext.Provider>
  );
}

function PoliteRef({ rbIds, onRbToggle, learnedIds, onToggleLearned, toggleSignal }: RbProps) {
  const [group, setGroup] = useState<'all' | 'statements' | 'requests' | 'responses'>('all');

  const statementsKeys = ['〜ます','〜ません','〜ました','〜ませんでした','〜です','〜ています','〜たいです'];
  const requestsKeys = ['〜てください','〜てもいいですか','〜ないでください'];
  const responsesKeys = ['〜ですね','ちょっと…'];

  const activeKeys = group === 'all' ? [...statementsKeys, ...requestsKeys, ...responsesKeys]
    : group === 'statements' ? statementsKeys
    : group === 'requests' ? requestsKeys
    : responsesKeys;

  const { openSet, toggle } = useAccordion(activeKeys, toggleSignal);

  const tabs = [
    { id: 'all' as const, label: 'All' },
    { id: 'statements' as const, label: 'Statements' },
    { id: 'requests' as const, label: 'Requests' },
    { id: 'responses' as const, label: 'Responses' },
  ];

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-2 mb-3">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setGroup(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-base whitespace-nowrap transition ${
              group === tab.id
                ? 'bg-sakura-500/60 text-white'
                : 'bg-slate-700/50 text-slate-400 active:bg-slate-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {(group === 'all' || group === 'statements') && (
        <>
          {group === 'all' && <p className="text-sm text-slate-500 font-medium mt-2 mb-1">Statements</p>}
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
      <AccordionRow id="〜ませんでした" jp="〜ませんでした" rom="ma·sen·de·shi·ta" meaning="🕐 Didn't / wasn't — past negative"
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '届きませんでした', hep: 'to·do·ki·ma·sen·de·shi·ta', en: 'It didn\'t arrive' },
          { jp: '知りませんでした', hep: 'shi·ri·ma·sen·de·shi·ta', en: 'I didn\'t know' },
          { jp: '間に合いませんでした', hep: 'ma·ni·a·i·ma·sen·de·shi·ta', en: 'I didn\'t make it in time' },
        ]} />
      <AccordionRow id="〜です" jp="〜です" rom="de·su" meaning='🕐 Stating what something IS — identity, quantities'
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: 'ふたりです', hep: 'fu·ta·ri de·su', en: 'Two people (party size)' },
          { jp: 'アレルギーです', hep: 'a·re·ru·gii de·su', en: "It's an allergy" },
          { jp: 'これです', hep: 'ko·re de·su', en: "It's this one" },
          { jp: '大丈夫です', hep: 'dai·jou·bu de·su', en: "It's fine / I'm okay" },
        ]} />
      <AccordionRow id="〜ています" jp="〜ています" rom="te i·ma·su" meaning="🕐 Currently doing / ongoing state — am ~ing"
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '探しています', hep: 'sa·ga·shi·te i·ma·su', en: 'I\'m looking for (something)' },
          { jp: 'ホテルに泊まっています', hep: 'ho·te·ru ni to·mat·te i·ma·su', en: 'I\'m staying at a hotel' },
          { jp: '友達を待っています', hep: 'to·mo·da·chi wo mat·te i·ma·su', en: 'I\'m waiting for a friend' },
          { jp: '旅行しています', hep: 'ryo·kou shi·te i·ma·su', en: 'I\'m traveling' },
        ]} />
      <AccordionRow id="〜たいです" jp="〜たいです" rom="tai de·su" meaning="🕐 Want to — expressing desire"
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '食べたいです', hep: 'ta·be·tai de·su', en: 'I want to eat' },
          { jp: '行きたいです', hep: 'i·ki·tai de·su', en: 'I want to go' },
          { jp: '買いたいです', hep: 'kai·tai de·su', en: 'I want to buy' },
          { jp: '温泉に入りたいです', hep: 'on·sen ni hai·ri·tai de·su', en: 'I want to go to an onsen' },
        ]} />
        </>
      )}

      {(group === 'all' || group === 'requests') && (
        <>
          {group === 'all' && <p className="text-sm text-slate-500 font-medium mt-4 mb-1">Requests</p>}
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
      <AccordionRow id="〜ないでください" jp="〜ないでください" rom="nai·de ku·da·sai" meaning="🕐 Please don't — polite negative request"
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: 'わさびを入れないでください', hep: 'wa·sa·bi wo i·re·nai·de ku·da·sai', en: 'Please don\'t add wasabi' },
          { jp: '写真を撮らないでください', hep: 'sha·shin wo to·ra·nai·de ku·da·sai', en: 'Please don\'t take photos' },
          { jp: '氷を入れないでください', hep: 'kou·ri wo i·re·nai·de ku·da·sai', en: 'No ice please' },
        ]} />
        </>
      )}

      {(group === 'all' || group === 'responses') && (
        <>
          {group === 'all' && <p className="text-sm text-slate-500 font-medium mt-4 mb-1">Soft Responses</p>}
      <AccordionRow id="〜ですね" jp="〜ですね" rom="de·su ne" meaning="🕐 Agreement / shared feeling — right?, isn't it?"
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: 'そうですね', hep: 'sou de·su ne', en: 'That\'s right / I agree' },
          { jp: 'おいしいですね', hep: 'o·i·shii de·su ne', en: 'It\'s delicious, isn\'t it?' },
          { jp: 'きれいですね', hep: 'ki·rei de·su ne', en: 'It\'s beautiful, isn\'t it?' },
          { jp: 'いいですね', hep: 'ii de·su ne', en: 'That\'s nice / Sounds good' },
        ]} />
      <AccordionRow id="ちょっと…" jp="ちょっと…" rom="chot·to…" meaning="🕐 Soft decline — politely saying no without saying no"
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: 'ちょっと難しいです', hep: 'chot·to mu·zu·ka·shii de·su', en: 'That\'s a bit difficult (= no)' },
          { jp: 'ちょっと…すみません', hep: 'chot·to… su·mi·ma·sen', en: 'Umm… sorry (soft refusal)' },
          { jp: '今日はちょっと…', hep: 'kyou wa chot·to…', en: 'Today is a bit… (= can\'t today)' },
          { jp: 'ちょっと高いです', hep: 'chot·to ta·kai de·su', en: 'It\'s a bit expensive' },
        ]} />
        </>
      )}
    </div>
  );
}

// ============================================================
// Sentence Structure (Step 2)
// ============================================================
function GrammarRef({ rbIds, onRbToggle, learnedIds, onToggleLearned, toggleSignal, explainLang = 'en', onNavigateVerbs }: RbProps) {
  const { openSet, toggle } = useAccordion(['O を V ます','V ます','S は O を V ます','Place で V ます','Place に V ます','S は ... です'], toggleSignal);
  const [activeTerm, setActiveTerm] = useState<string | null>(null);
  return (
    <TermTapContext.Provider value={setActiveTerm}>
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


      <AccordionRow id="O を V ます" jp="O を V ます" rom="O wo V ma·su" meaning="Most common: Object + Verb (subject dropped)"
        structure={['Say: [object] を [verb] {ます}']}
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: 'ラーメンを食べます', hep: 'raa·men wo ta·be·ma·su', en: 'I eat ramen' },
          { jp: '切符を買います', hep: 'kip·pu wo kai·ma·su', en: 'I buy a ticket' },
          { jp: '写真を撮ります', hep: 'sha·shin wo to·ri·ma·su', en: 'I take a photo' },
        ]} />
      <AccordionRow id="V ます" jp="V ます" rom="V ma·su" meaning="Simplest: just the verb"
        structure={['Say: [verb] {ます}']}
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '行きます', hep: 'i·ki·ma·su', en: 'I go / I will go' },
          { jp: '食べます', hep: 'ta·be·ma·su', en: 'I eat' },
          { jp: 'わかりました', hep: 'wa·ka·ri·ma·shi·ta', en: 'I understood / Got it' },
        ]} />
      <AccordionRow id="S は O を V ます" jp="S は O を V ます" rom="S wa O wo V ma·su" meaning="Full sentence with subject (when it's not 'I')"
        structure={['Say: [subject] は [object] を [verb] {ます}']}
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: 'このバスは東京駅を通ります', hep: 'ko·no ba·su wa tou·kyou·e·ki wo too·ri·ma·su', en: 'This bus passes Tokyo Station' },
          { jp: 'お店は朝食を出します', hep: 'o·mi·se wa chou·sho·ku wo da·shi·ma·su', en: 'The restaurant serves breakfast' },
          { jp: '友達はお土産を買います', hep: 'to·mo·da·chi wa o·mi·ya·ge wo kai·ma·su', en: 'My friend buys souvenirs' },
        ]} />
      <AccordionRow id="Place で V ます" jp="Place で V ます" rom="Place de V ma·su" meaning="Where: do something AT a place"
        structure={['Say: [place] で [object] を [verb] {ます}']}
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: 'ここで食べます', hep: 'ko·ko de ta·be·ma·su', en: 'I eat here' },
          { jp: 'コンビニでコーヒーを買います', hep: 'kon·bi·ni de koo·hii wo kai·ma·su', en: 'I buy coffee at the convenience store' },
          { jp: 'ホテルで休みます', hep: 'ho·te·ru de ya·su·mi·ma·su', en: 'I rest at the hotel' },
        ]} />
      <AccordionRow id="Place に V ます" jp="Place に V ます" rom="Place ni V ma·su" meaning="Direction: go TO a place"
        structure={['Say: [place] に [verb] {ます}']}
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '東京に行きます', hep: 'tou·kyou ni i·ki·ma·su', en: 'I go to Tokyo' },
          { jp: 'ホテルに帰ります', hep: 'ho·te·ru ni ka·e·ri·ma·su', en: 'I return to the hotel' },
          { jp: '駅に着きました', hep: 'e·ki ni tsu·ki·ma·shi·ta', en: 'I arrived at the station' },
        ]} />
      <AccordionRow id="S は ... です" jp="S は ... です" rom="S wa ... de·su" meaning="Describing something: Subject is ..."
        structure={['Say: [subject] は [clause] {です}']}
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
      <GrammarTermDrawer term={activeTerm} onClose={() => setActiveTerm(null)} lang={explainLang} onNavigateVerbs={onNavigateVerbs} />
    </div>
    </TermTapContext.Provider>
  );
}

// ============================================================
// Yes/No Questions (Step 6)
// ============================================================
function YesNoRef({ rbIds, onRbToggle, learnedIds, onToggleLearned, toggleSignal }: RbProps) {
  const { openSet, toggle } = useAccordion(['○○ですか？','○○ますか？','○○ありますか？'], toggleSignal);
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
            <button onClick={() => speak('はい', 'ja-JP')} className="text-lg active:scale-110 p-1"><Volume2 size={20} /></button>
          </div>
          <div className="flex items-center justify-center gap-2 bg-slate-700/30 rounded-lg p-2">
            <span className="text-red-400 text-base">❌</span>
            <div>
              <p className="text-base text-slate-200">いいえ</p>
              <p className="text-base text-sakura-300">ii·e</p>
              <p className="text-base text-slate-400">No</p>
            </div>
            <button onClick={() => speak('いいえ', 'ja-JP')} className="text-lg active:scale-110 p-1"><Volume2 size={20} /></button>
          </div>
        </div>
      </div>


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
function WHQuestionsRef({ rbIds, onRbToggle, learnedIds, onToggleLearned, toggleSignal }: RbProps) {
  const [tab, setTab] = useState<'thing' | 'action'>('thing');
  const thingAcc = useAccordion(['何 / なに','どこ','いつ','いくら','どれ','どっち / どちら'], toggleSignal);
  const actionAcc = useAccordion(['どう','だれ','なぜ / どうして'], toggleSignal);
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

function ListeningRef({ rbIds, onRbToggle, learnedIds, onToggleLearned, toggleSignal }: RbProps) {
  const { openSet, toggle } = useAccordion(['shops', 'restaurants', 'trains', 'hotels', 'general'], toggleSignal);
  return (
    <div className="mt-2 space-y-1.5">
      <p className="text-base text-slate-500 mb-2">Phrases you'll hear from staff — learn to recognize, not produce</p>

      <AccordionRow id="shops" jp="🏪 Shops & Convenience Stores" rom="" meaning="Greetings, bags, heating, points cards, totals"
        openSet={openSet} toggle={toggle} section="listening" refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: 'いらっしゃいませ！', hep: 'i·ras·shai·ma·se', en: 'Welcome! (no need to reply, just nod)' },
          { jp: '袋はご利用ですか？', hep: 'fu·ku·ro wa go·ri·you de·su ka', en: 'Do you need a bag? → はい / いいえ' },
          { jp: '温めますか？', hep: 'a·ta·ta·me·ma·su ka', en: 'Heat it up? → はい / いいえ' },
          { jp: 'お箸をお付けしますか？', hep: 'o·ha·shi wo o·tsu·ke shi·ma·su ka', en: 'Include chopsticks? → はい' },
          { jp: 'ポイントカードはお持ちですか？', hep: 'poin·to kaa·do wa o·mo·chi de·su ka', en: 'Do you have a points card? → いいえ' },
          { jp: '○○円になります', hep: '○○ en ni na·ri·ma·su', en: "That'll be ○○ yen" },
          { jp: 'お会計は○○円です', hep: 'o·kai·kei wa ○○ en de·su', en: 'Your total is ○○ yen' },
        ]} />

      <AccordionRow id="restaurants" jp="🍜 Restaurants" rom="" meaning="Seating, ordering, clearing, last order"
        openSet={openSet} toggle={toggle} section="listening" refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '何名様ですか？', hep: 'nan·mei·sa·ma de·su ka', en: 'How many people? → ふたりです' },
          { jp: 'こちらへどうぞ', hep: 'ko·chi·ra e dou·zo', en: 'This way please (follow them)' },
          { jp: 'ご注文はお決まりですか？', hep: 'go·chuu·mon wa o·ki·ma·ri de·su ka', en: 'Ready to order? → はい / もう少し待ってください' },
          { jp: '少々お待ちください', hep: 'shou·shou o·ma·chi ku·da·sai', en: 'Please wait a moment' },
          { jp: 'お待たせいたしました', hep: 'o·ma·ta·se i·ta·shi·ma·shi·ta', en: 'Sorry to keep you waiting (food arriving)' },
          { jp: 'お下げしてもよろしいですか？', hep: 'o·sa·ge shi·te mo yo·ro·shii de·su ka', en: 'May I clear this? → はい' },
          { jp: 'ラストオーダーです', hep: 'ra·su·to oo·daa de·su', en: 'Last order (kitchen closing soon)' },
        ]} />

      <AccordionRow id="trains" jp="🚆 Trains & Stations" rom="" meaning="Arrivals, doors, next stop, belongings"
        openSet={openSet} toggle={toggle} section="listening" refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: 'まもなく電車が参ります', hep: 'ma·mo·na·ku den·sha ga mai·ri·ma·su', en: 'The train is arriving shortly' },
          { jp: 'ドアが閉まります。ご注意ください', hep: 'do·a ga shi·ma·ri·ma·su go·chuu·i ku·da·sai', en: 'Doors closing. Please be careful' },
          { jp: '次は○○駅です', hep: 'tsu·gi wa ○○ e·ki de·su', en: 'Next stop is ○○ station' },
          { jp: 'お忘れ物のないようご注意ください', hep: 'o·wa·su·re·mo·no no nai you go·chuu·i ku·da·sai', en: 'Please check you have all belongings' },
          { jp: 'この電車は○○行きです', hep: 'ko·no den·sha wa ○○ i·ki de·su', en: 'This train goes to ○○' },
        ]} />

      <AccordionRow id="hotels" jp="🏨 Hotels" rom="" meaning="Check-in, passport, room, breakfast, farewell"
        openSet={openSet} toggle={toggle} section="listening" refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: 'チェックインでございますか？', hep: 'chek·ku·in de go·zai·ma·su ka', en: 'Are you checking in?' },
          { jp: 'パスポートをお見せください', hep: 'pa·su·poo·to wo o·mi·se ku·da·sai', en: 'Please show your passport' },
          { jp: 'お部屋は○○号室です', hep: 'o·he·ya wa ○○ gou·shi·tsu de·su', en: 'Your room is number ○○' },
          { jp: '朝食は○時から○時までです', hep: 'chou·sho·ku wa ○·ji ka·ra ○·ji ma·de de·su', en: 'Breakfast is from ○ to ○' },
          { jp: 'ごゆっくりお過ごしください', hep: 'go·yuk·ku·ri o·su·go·shi ku·da·sai', en: 'Please enjoy your stay' },
        ]} />

      <AccordionRow id="general" jp="🔔 General" rom="" meaning="Thanks, come again, apologies, understood"
        openSet={openSet} toggle={toggle} section="listening" refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: 'ありがとうございました', hep: 'a·ri·ga·tou go·zai·ma·shi·ta', en: 'Thank you (past tense — after service)' },
          { jp: 'またお越しくださいませ', hep: 'ma·ta o·ko·shi ku·da·sai·ma·se', en: 'Please come again' },
          { jp: '申し訳ございません', hep: 'mou·shi·wa·ke go·zai·ma·sen', en: "I'm very sorry (formal apology)" },
          { jp: 'かしこまりました', hep: 'ka·shi·ko·ma·ri·ma·shi·ta', en: 'Understood / Certainly (formal yes)' },
        ]} />
    </div>
  );
}

// ============================================================
// Verb Forms (Knowledge)
// ============================================================
function VerbsRef({ rbIds, onRbToggle, learnedIds, onToggleLearned, toggleSignal }: RbProps) {
  const [group, setGroup] = useState<'all' | 'ru' | 'u' | 'irregular'>('all');

  const ruKeys = ['食べる','見る','起きる','寝る','教える','開ける','出る'];
  const uKeys = ['行く','飲む','買う','話す','書く','読む','聞く','歩く','作る','待つ','使う','乗る','遊ぶ','泳ぐ'];
  const irregularKeys = ['する','来る'];

  const activeKeys = group === 'all' ? [...ruKeys, ...uKeys, ...irregularKeys]
    : group === 'ru' ? ruKeys
    : group === 'u' ? uKeys
    : irregularKeys;

  const { openSet, toggle } = useAccordion(activeKeys, toggleSignal);

  const tabs = [
    { id: 'all' as const, label: 'All' },
    { id: 'ru' as const, label: 'る-verb' },
    { id: 'u' as const, label: 'う-verb' },
    { id: 'irregular' as const, label: 'Irregular' },
  ];

  return (
    <div className="mt-2 space-y-1.5">
      {/* Quick rule summary */}
      <div className="bg-slate-700/30 rounded-xl p-3 mb-3">
        <p className="text-base text-slate-400 mb-2 text-center">Verb Groups — How to Conjugate</p>
        <div className="space-y-1.5 text-sm">
          <div className="flex items-center gap-2">
            <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30 shrink-0">る-verb</span>
            <span className="text-slate-400">Drop る, add ending</span>
            <span className="text-slate-500 ml-auto">食べ<span className="text-red-400/70 line-through">る</span> → 食べます</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 shrink-0">う-verb</span>
            <span className="text-slate-400">Change last sound to い-row</span>
            <span className="text-slate-500 ml-auto">飲<span className="text-red-400/70 line-through">む</span> → 飲<span className="text-emerald-400">み</span>ます</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 shrink-0">Irregular</span>
            <span className="text-slate-400">Memorize these two</span>
            <span className="text-slate-500 ml-auto">する → します</span>
          </div>
        </div>
        <div className="border-t border-slate-600/30 mt-2.5 pt-2.5">
          <p className="text-xs text-slate-500 mb-1.5">う-verb て-form patterns (6 types):</p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
            <span className="text-slate-400">う/つ/る → <span className="text-emerald-300">って</span></span>
            <span className="text-slate-500">買う→買って</span>
            <span className="text-slate-400">む/ぶ/ぬ → <span className="text-emerald-300">んで</span></span>
            <span className="text-slate-500">飲む→飲んで</span>
            <span className="text-slate-400">く → <span className="text-emerald-300">いて</span></span>
            <span className="text-slate-500">書く→書いて</span>
            <span className="text-slate-400">ぐ → <span className="text-emerald-300">いで</span></span>
            <span className="text-slate-500">泳ぐ→泳いで</span>
            <span className="text-slate-400">す → <span className="text-emerald-300">して</span></span>
            <span className="text-slate-500">話す→話して</span>
            <span className="text-slate-400">行く → <span className="text-amber-300">行って</span></span>
            <span className="text-slate-500">(exception!)</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-3 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setGroup(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-base whitespace-nowrap transition ${
              group === tab.id
                ? 'bg-sakura-500/60 text-white'
                : 'bg-slate-700/50 text-slate-400 active:bg-slate-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* る-verbs */}
      {(group === 'all' || group === 'ru') && (
        <>
          {group === 'all' && <p className="text-sm text-slate-500 font-medium mt-2 mb-1">る-verbs (Group II) — drop る, add ending</p>}
      <AccordionRow id="食べる" jp="食べる" rom="ta·be·ru" meaning="Eat"
        structure={['る-verb: 食べ{る} → 食べ + [ending]']}
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '食べます', hep: 'ta·be·ma·su', en: 'eat (polite)' },
          { jp: '食べません', hep: 'ta·be·ma·sen', en: "don't eat" },
          { jp: '食べました', hep: 'ta·be·ma·shi·ta', en: 'ate (past)' },
          { jp: '食べて', hep: 'ta·be·te', en: 'eat (te-form / request)' },
          { jp: '食べた', hep: 'ta·be·ta', en: 'ate (plain past)' },
          { jp: '食べない', hep: 'ta·be·nai', en: "don't eat (plain)" },
          { jp: '食べたい', hep: 'ta·be·tai', en: 'want to eat' },
          { jp: '食べられる', hep: 'ta·be·ra·re·ru', en: 'can eat / be eaten' },
          { jp: '食べさせる', hep: 'ta·be·sa·se·ru', en: 'make (someone) eat' },
          { jp: '食べよう', hep: 'ta·be·you', en: "let's eat" },
        ]} />
      <AccordionRow id="見る" jp="見る" rom="mi·ru" meaning="See / Look / Watch"
        structure={['る-verb: 見{る} → 見 + [ending]']}
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '見ます', hep: 'mi·ma·su', en: 'see (polite)' },
          { jp: '見ません', hep: 'mi·ma·sen', en: "don't see" },
          { jp: '見ました', hep: 'mi·ma·shi·ta', en: 'saw (past)' },
          { jp: '見て', hep: 'mi·te', en: 'look (te-form)' },
          { jp: '見た', hep: 'mi·ta', en: 'saw (plain past)' },
          { jp: '見ない', hep: 'mi·nai', en: "don't look (plain)" },
          { jp: '見たい', hep: 'mi·tai', en: 'want to see' },
          { jp: '見られる', hep: 'mi·ra·re·ru', en: 'can see' },
          { jp: '見よう', hep: 'mi·you', en: "let's watch" },
        ]} />
      <AccordionRow id="起きる" jp="起きる" rom="o·ki·ru" meaning="Wake up / Get up"
        structure={['る-verb: 起き{る} → 起き + [ending]']}
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '起きます', hep: 'o·ki·ma·su', en: 'wake up (polite)' },
          { jp: '起きません', hep: 'o·ki·ma·sen', en: "don't wake up" },
          { jp: '起きました', hep: 'o·ki·ma·shi·ta', en: 'woke up (past)' },
          { jp: '起きて', hep: 'o·ki·te', en: 'wake up (te-form)' },
          { jp: '起きた', hep: 'o·ki·ta', en: 'woke up (plain)' },
          { jp: '起きない', hep: 'o·ki·nai', en: "don't wake up (plain)" },
          { jp: '起きたい', hep: 'o·ki·tai', en: 'want to wake up' },
          { jp: '起きられる', hep: 'o·ki·ra·re·ru', en: 'can wake up' },
          { jp: '起きよう', hep: 'o·ki·you', en: "let's get up" },
        ]} />
      <AccordionRow id="寝る" jp="寝る" rom="ne·ru" meaning="Sleep / Go to bed"
        structure={['る-verb: 寝{る} → 寝 + [ending]']}
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '寝ます', hep: 'ne·ma·su', en: 'sleep (polite)' },
          { jp: '寝ません', hep: 'ne·ma·sen', en: "don't sleep" },
          { jp: '寝ました', hep: 'ne·ma·shi·ta', en: 'slept (past)' },
          { jp: '寝て', hep: 'ne·te', en: 'sleep (te-form)' },
          { jp: '寝た', hep: 'ne·ta', en: 'slept (plain)' },
          { jp: '寝ない', hep: 'ne·nai', en: "don't sleep (plain)" },
          { jp: '寝たい', hep: 'ne·tai', en: 'want to sleep' },
          { jp: '寝られる', hep: 'ne·ra·re·ru', en: 'can sleep' },
          { jp: '寝させる', hep: 'ne·sa·se·ru', en: 'make (someone) sleep' },
          { jp: '寝よう', hep: 'ne·you', en: "let's sleep" },
        ]} />
      <AccordionRow id="教える" jp="教える" rom="o·shi·e·ru" meaning="Teach / Tell"
        structure={['る-verb: 教え{る} → 教え + [ending]']}
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '教えます', hep: 'o·shi·e·ma·su', en: 'teach (polite)' },
          { jp: '教えません', hep: 'o·shi·e·ma·sen', en: "don't teach" },
          { jp: '教えました', hep: 'o·shi·e·ma·shi·ta', en: 'taught (past)' },
          { jp: '教えて', hep: 'o·shi·e·te', en: 'tell me (te-form)' },
          { jp: '教えた', hep: 'o·shi·e·ta', en: 'taught (plain)' },
          { jp: '教えない', hep: 'o·shi·e·nai', en: "don't teach (plain)" },
          { jp: '教えたい', hep: 'o·shi·e·tai', en: 'want to teach' },
          { jp: '教えられる', hep: 'o·shi·e·ra·re·ru', en: 'can teach / be taught' },
          { jp: '教えさせる', hep: 'o·shi·e·sa·se·ru', en: 'make (someone) teach' },
          { jp: '教えよう', hep: 'o·shi·e·you', en: "let's teach" },
        ]} />
      <AccordionRow id="開ける" jp="開ける" rom="a·ke·ru" meaning="Open"
        structure={['る-verb: 開け{る} → 開け + [ending]']}
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '開けます', hep: 'a·ke·ma·su', en: 'open (polite)' },
          { jp: '開けません', hep: 'a·ke·ma·sen', en: "don't open" },
          { jp: '開けました', hep: 'a·ke·ma·shi·ta', en: 'opened (past)' },
          { jp: '開けて', hep: 'a·ke·te', en: 'open (te-form)' },
          { jp: '開けた', hep: 'a·ke·ta', en: 'opened (plain)' },
          { jp: '開けない', hep: 'a·ke·nai', en: "don't open (plain)" },
          { jp: '開けたい', hep: 'a·ke·tai', en: 'want to open' },
          { jp: '開けられる', hep: 'a·ke·ra·re·ru', en: 'can open / be opened' },
          { jp: '開けさせる', hep: 'a·ke·sa·se·ru', en: 'make (someone) open' },
          { jp: '開けよう', hep: 'a·ke·you', en: "let's open" },
        ]} />
      <AccordionRow id="出る" jp="出る" rom="de·ru" meaning="Leave / Go out / Exit"
        structure={['る-verb: 出{る} → 出 + [ending]']}
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '出ます', hep: 'de·ma·su', en: 'leave (polite)' },
          { jp: '出ません', hep: 'de·ma·sen', en: "don't leave" },
          { jp: '出ました', hep: 'de·ma·shi·ta', en: 'left (past)' },
          { jp: '出て', hep: 'de·te', en: 'leave (te-form)' },
          { jp: '出た', hep: 'de·ta', en: 'left (plain)' },
          { jp: '出ない', hep: 'de·nai', en: "don't leave (plain)" },
          { jp: '出たい', hep: 'de·tai', en: 'want to leave' },
          { jp: '出られる', hep: 'de·ra·re·ru', en: 'can leave' },
          { jp: '出させる', hep: 'de·sa·se·ru', en: 'make (someone) leave' },
          { jp: '出よう', hep: 'de·you', en: "let's leave" },
        ]} />
        </>
      )}

      {/* う-verbs */}
      {(group === 'all' || group === 'u') && (
        <>
          {group === 'all' && <p className="text-sm text-slate-500 font-medium mt-4 mb-1">う-verbs (Group I) — change last sound</p>}
      <AccordionRow id="行く" jp="行く" rom="i·ku" meaning="Go"
        structure={['う-verb: 行{く} → 行き + [ending]']}
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '行きます', hep: 'i·ki·ma·su', en: 'go (polite)' },
          { jp: '行きません', hep: 'i·ki·ma·sen', en: "don't go" },
          { jp: '行きました', hep: 'i·ki·ma·shi·ta', en: 'went (past)' },
          { jp: '行って', hep: 'it·te', en: 'go (te-form) ⚠️ irregular' },
          { jp: '行った', hep: 'it·ta', en: 'went (plain) ⚠️ irregular' },
          { jp: '行かない', hep: 'i·ka·nai', en: "don't go (plain)" },
          { jp: '行きたい', hep: 'i·ki·tai', en: 'want to go' },
          { jp: '行ける', hep: 'i·ke·ru', en: 'can go' },
          { jp: '行かせる', hep: 'i·ka·se·ru', en: 'make (someone) go' },
          { jp: '行こう', hep: 'i·kou', en: "let's go" },
        ]} />
      <AccordionRow id="飲む" jp="飲む" rom="no·mu" meaning="Drink"
        structure={['う-verb: 飲{む} → 飲み + [ending]']}
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '飲みます', hep: 'no·mi·ma·su', en: 'drink (polite)' },
          { jp: '飲みません', hep: 'no·mi·ma·sen', en: "don't drink" },
          { jp: '飲みました', hep: 'no·mi·ma·shi·ta', en: 'drank (past)' },
          { jp: '飲んで', hep: 'non·de', en: 'drink (te-form)' },
          { jp: '飲んだ', hep: 'non·da', en: 'drank (plain)' },
          { jp: '飲まない', hep: 'no·ma·nai', en: "don't drink (plain)" },
          { jp: '飲みたい', hep: 'no·mi·tai', en: 'want to drink' },
          { jp: '飲める', hep: 'no·me·ru', en: 'can drink' },
          { jp: '飲まれる', hep: 'no·ma·re·ru', en: 'be drunk (passive)' },
          { jp: '飲ませる', hep: 'no·ma·se·ru', en: 'make (someone) drink' },
          { jp: '飲もう', hep: 'no·mou', en: "let's drink" },
        ]} />
      <AccordionRow id="買う" jp="買う" rom="ka·u" meaning="Buy"
        structure={['う-verb: 買{う} → 買い + [ending]']}
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '買います', hep: 'kai·ma·su', en: 'buy (polite)' },
          { jp: '買いません', hep: 'kai·ma·sen', en: "don't buy" },
          { jp: '買いました', hep: 'kai·ma·shi·ta', en: 'bought (past)' },
          { jp: '買って', hep: 'kat·te', en: 'buy (te-form)' },
          { jp: '買った', hep: 'kat·ta', en: 'bought (plain)' },
          { jp: '買わない', hep: 'ka·wa·nai', en: "don't buy (plain)" },
          { jp: '買いたい', hep: 'kai·tai', en: 'want to buy' },
          { jp: '買える', hep: 'ka·e·ru', en: 'can buy' },
          { jp: '買われる', hep: 'ka·wa·re·ru', en: 'be bought (passive)' },
          { jp: '買わせる', hep: 'ka·wa·se·ru', en: 'make (someone) buy' },
          { jp: '買おう', hep: 'ka·ou', en: "let's buy" },
        ]} />
      <AccordionRow id="話す" jp="話す" rom="ha·na·su" meaning="Speak / Talk"
        structure={['う-verb: 話{す} → 話し + [ending]']}
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '話します', hep: 'ha·na·shi·ma·su', en: 'speak (polite)' },
          { jp: '話しません', hep: 'ha·na·shi·ma·sen', en: "don't speak" },
          { jp: '話しました', hep: 'ha·na·shi·ma·shi·ta', en: 'spoke (past)' },
          { jp: '話して', hep: 'ha·na·shi·te', en: 'speak (te-form)' },
          { jp: '話した', hep: 'ha·na·shi·ta', en: 'spoke (plain)' },
          { jp: '話さない', hep: 'ha·na·sa·nai', en: "don't speak (plain)" },
          { jp: '話したい', hep: 'ha·na·shi·tai', en: 'want to speak' },
          { jp: '話せる', hep: 'ha·na·se·ru', en: 'can speak' },
          { jp: '話そう', hep: 'ha·na·sou', en: "let's talk" },
        ]} />
      <AccordionRow id="書く" jp="書く" rom="ka·ku" meaning="Write"
        structure={['う-verb: 書{く} → 書き + [ending]']}
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '書きます', hep: 'ka·ki·ma·su', en: 'write (polite)' },
          { jp: '書きません', hep: 'ka·ki·ma·sen', en: "don't write" },
          { jp: '書きました', hep: 'ka·ki·ma·shi·ta', en: 'wrote (past)' },
          { jp: '書いて', hep: 'kai·te', en: 'write (te-form)' },
          { jp: '書いた', hep: 'kai·ta', en: 'wrote (plain)' },
          { jp: '書かない', hep: 'ka·ka·nai', en: "don't write (plain)" },
          { jp: '書きたい', hep: 'ka·ki·tai', en: 'want to write' },
          { jp: '書ける', hep: 'ka·ke·ru', en: 'can write' },
          { jp: '書こう', hep: 'ka·kou', en: "let's write" },
        ]} />
      <AccordionRow id="読む" jp="読む" rom="yo·mu" meaning="Read"
        structure={['う-verb: 読{む} → 読み + [ending]']}
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '読みます', hep: 'yo·mi·ma·su', en: 'read (polite)' },
          { jp: '読みません', hep: 'yo·mi·ma·sen', en: "don't read" },
          { jp: '読みました', hep: 'yo·mi·ma·shi·ta', en: 'read — past (polite)' },
          { jp: '読んで', hep: 'yon·de', en: 'read (te-form)' },
          { jp: '読んだ', hep: 'yon·da', en: 'read — past (plain)' },
          { jp: '読まない', hep: 'yo·ma·nai', en: "don't read (plain)" },
          { jp: '読みたい', hep: 'yo·mi·tai', en: 'want to read' },
          { jp: '読める', hep: 'yo·me·ru', en: 'can read' },
          { jp: '読もう', hep: 'yo·mou', en: "let's read" },
        ]} />
      <AccordionRow id="聞く" jp="聞く" rom="ki·ku" meaning="Listen / Ask"
        structure={['う-verb: 聞{く} → 聞き + [ending]']}
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '聞きます', hep: 'ki·ki·ma·su', en: 'listen (polite)' },
          { jp: '聞きません', hep: 'ki·ki·ma·sen', en: "don't listen" },
          { jp: '聞きました', hep: 'ki·ki·ma·shi·ta', en: 'listened (past)' },
          { jp: '聞いて', hep: 'kii·te', en: 'listen (te-form)' },
          { jp: '聞いた', hep: 'kii·ta', en: 'listened (plain)' },
          { jp: '聞かない', hep: 'ki·ka·nai', en: "don't listen (plain)" },
          { jp: '聞きたい', hep: 'ki·ki·tai', en: 'want to ask' },
          { jp: '聞ける', hep: 'ki·ke·ru', en: 'can listen/ask' },
          { jp: '聞こう', hep: 'ki·kou', en: "let's listen" },
        ]} />
      <AccordionRow id="歩く" jp="歩く" rom="a·ru·ku" meaning="Walk"
        structure={['う-verb: 歩{く} → 歩き + [ending]']}
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '歩きます', hep: 'a·ru·ki·ma·su', en: 'walk (polite)' },
          { jp: '歩きません', hep: 'a·ru·ki·ma·sen', en: "don't walk" },
          { jp: '歩きました', hep: 'a·ru·ki·ma·shi·ta', en: 'walked (past)' },
          { jp: '歩いて', hep: 'a·rui·te', en: 'walk (te-form)' },
          { jp: '歩いた', hep: 'a·rui·ta', en: 'walked (plain)' },
          { jp: '歩かない', hep: 'a·ru·ka·nai', en: "don't walk (plain)" },
          { jp: '歩きたい', hep: 'a·ru·ki·tai', en: 'want to walk' },
          { jp: '歩ける', hep: 'a·ru·ke·ru', en: 'can walk' },
          { jp: '歩かせる', hep: 'a·ru·ka·se·ru', en: 'make (someone) walk' },
          { jp: '歩こう', hep: 'a·ru·kou', en: "let's walk" },
        ]} />
      <AccordionRow id="作る" jp="作る" rom="tsu·ku·ru" meaning="Make / Create"
        structure={['う-verb: 作{る} → 作り + [ending]']}
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '作ります', hep: 'tsu·ku·ri·ma·su', en: 'make (polite)' },
          { jp: '作りません', hep: 'tsu·ku·ri·ma·sen', en: "don't make" },
          { jp: '作りました', hep: 'tsu·ku·ri·ma·shi·ta', en: 'made (past)' },
          { jp: '作って', hep: 'tsukut·te', en: 'make (te-form)' },
          { jp: '作った', hep: 'tsukut·ta', en: 'made (plain)' },
          { jp: '作らない', hep: 'tsu·ku·ra·nai', en: "don't make (plain)" },
          { jp: '作りたい', hep: 'tsu·ku·ri·tai', en: 'want to make' },
          { jp: '作れる', hep: 'tsu·ku·re·ru', en: 'can make' },
          { jp: '作られる', hep: 'tsu·ku·ra·re·ru', en: 'be made (passive)' },
          { jp: '作らせる', hep: 'tsu·ku·ra·se·ru', en: 'make (someone) create' },
          { jp: '作ろう', hep: 'tsu·ku·rou', en: "let's make" },
        ]} />
      <AccordionRow id="待つ" jp="待つ" rom="ma·tsu" meaning="Wait"
        structure={['う-verb: 待{つ} → 待ち + [ending]']}
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '待ちます', hep: 'ma·chi·ma·su', en: 'wait (polite)' },
          { jp: '待ちません', hep: 'ma·chi·ma·sen', en: "don't wait" },
          { jp: '待ちました', hep: 'ma·chi·ma·shi·ta', en: 'waited (past)' },
          { jp: '待って', hep: 'mat·te', en: 'wait (te-form)' },
          { jp: '待った', hep: 'mat·ta', en: 'waited (plain)' },
          { jp: '待たない', hep: 'ma·ta·nai', en: "don't wait (plain)" },
          { jp: '待ちたい', hep: 'ma·chi·tai', en: 'want to wait' },
          { jp: '待てる', hep: 'ma·te·ru', en: 'can wait' },
          { jp: '待たせる', hep: 'ma·ta·se·ru', en: 'make (someone) wait' },
          { jp: '待とう', hep: 'ma·tou', en: "let's wait" },
        ]} />
      <AccordionRow id="使う" jp="使う" rom="tsu·ka·u" meaning="Use"
        structure={['う-verb: 使{う} → 使い + [ending]']}
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '使います', hep: 'tsu·kai·ma·su', en: 'use (polite)' },
          { jp: '使いません', hep: 'tsu·kai·ma·sen', en: "don't use" },
          { jp: '使いました', hep: 'tsu·kai·ma·shi·ta', en: 'used (past)' },
          { jp: '使って', hep: 'tsu·kat·te', en: 'use (te-form)' },
          { jp: '使った', hep: 'tsu·kat·ta', en: 'used (plain)' },
          { jp: '使わない', hep: 'tsu·ka·wa·nai', en: "don't use (plain)" },
          { jp: '使いたい', hep: 'tsu·kai·tai', en: 'want to use' },
          { jp: '使える', hep: 'tsu·ka·e·ru', en: 'can use' },
          { jp: '使われる', hep: 'tsu·ka·wa·re·ru', en: 'be used (passive)' },
          { jp: '使わせる', hep: 'tsu·ka·wa·se·ru', en: 'make (someone) use' },
          { jp: '使おう', hep: 'tsu·ka·ou', en: "let's use" },
        ]} />
      <AccordionRow id="乗る" jp="乗る" rom="no·ru" meaning="Ride / Get on"
        structure={['う-verb: 乗{る} → 乗り + [ending]']}
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '乗ります', hep: 'no·ri·ma·su', en: 'ride (polite)' },
          { jp: '乗りません', hep: 'no·ri·ma·sen', en: "don't ride" },
          { jp: '乗りました', hep: 'no·ri·ma·shi·ta', en: 'rode (past)' },
          { jp: '乗って', hep: 'not·te', en: 'ride (te-form)' },
          { jp: '乗った', hep: 'not·ta', en: 'rode (plain)' },
          { jp: '乗らない', hep: 'no·ra·nai', en: "don't ride (plain)" },
          { jp: '乗りたい', hep: 'no·ri·tai', en: 'want to ride' },
          { jp: '乗れる', hep: 'no·re·ru', en: 'can ride' },
          { jp: '乗られる', hep: 'no·ra·re·ru', en: 'be ridden (passive)' },
          { jp: '乗らせる', hep: 'no·ra·se·ru', en: 'make (someone) ride' },
          { jp: '乗ろう', hep: 'no·rou', en: "let's ride" },
        ]} />
      <AccordionRow id="遊ぶ" jp="遊ぶ" rom="a·so·bu" meaning="Play / Hang out"
        structure={['う-verb: 遊{ぶ} → 遊び + [ending]']}
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '遊びます', hep: 'a·so·bi·ma·su', en: 'play (polite)' },
          { jp: '遊びません', hep: 'a·so·bi·ma·sen', en: "don't play" },
          { jp: '遊びました', hep: 'a·so·bi·ma·shi·ta', en: 'played (past)' },
          { jp: '遊んで', hep: 'a·son·de', en: 'play (te-form)' },
          { jp: '遊んだ', hep: 'a·son·da', en: 'played (plain)' },
          { jp: '遊ばない', hep: 'a·so·ba·nai', en: "don't play (plain)" },
          { jp: '遊びたい', hep: 'a·so·bi·tai', en: 'want to play' },
          { jp: '遊べる', hep: 'a·so·be·ru', en: 'can play' },
          { jp: '遊ばせる', hep: 'a·so·ba·se·ru', en: 'let (someone) play' },
          { jp: '遊ぼう', hep: 'a·so·bou', en: "let's play / hang out" },
        ]} />
      <AccordionRow id="泳ぐ" jp="泳ぐ" rom="o·yo·gu" meaning="Swim"
        structure={['う-verb: 泳{ぐ} → 泳ぎ + [ending]']}
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '泳ぎます', hep: 'o·yo·gi·ma·su', en: 'swim (polite)' },
          { jp: '泳ぎません', hep: 'o·yo·gi·ma·sen', en: "don't swim" },
          { jp: '泳ぎました', hep: 'o·yo·gi·ma·shi·ta', en: 'swam (past)' },
          { jp: '泳いで', hep: 'o·yoi·de', en: 'swim (te-form)' },
          { jp: '泳いだ', hep: 'o·yoi·da', en: 'swam (plain)' },
          { jp: '泳がない', hep: 'o·yo·ga·nai', en: "don't swim (plain)" },
          { jp: '泳ぎたい', hep: 'o·yo·gi·tai', en: 'want to swim' },
          { jp: '泳げる', hep: 'o·yo·ge·ru', en: 'can swim' },
          { jp: '泳がせる', hep: 'o·yo·ga·se·ru', en: 'make (someone) swim' },
          { jp: '泳ごう', hep: 'o·yo·gou', en: "let's swim" },
        ]} />
        </>
      )}

      {/* Irregular */}
      {(group === 'all' || group === 'irregular') && (
        <>
          {group === 'all' && <p className="text-sm text-slate-500 font-medium mt-4 mb-1">Irregular — memorize these two!</p>}
      <AccordionRow id="する" jp="する" rom="su·ru" meaning="Do / Make"
        structure={['Irregular: する changes completely']}
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: 'します', hep: 'shi·ma·su', en: 'do (polite)' },
          { jp: 'しません', hep: 'shi·ma·sen', en: "don't do" },
          { jp: 'しました', hep: 'shi·ma·shi·ta', en: 'did (past)' },
          { jp: 'して', hep: 'shi·te', en: 'do (te-form)' },
          { jp: 'した', hep: 'shi·ta', en: 'did (plain)' },
          { jp: 'しない', hep: 'shi·nai', en: "don't do (plain)" },
          { jp: 'したい', hep: 'shi·tai', en: 'want to do' },
          { jp: 'できる', hep: 'de·ki·ru', en: 'can do' },
          { jp: 'される', hep: 'sa·re·ru', en: 'be done (passive)' },
          { jp: 'させる', hep: 'sa·se·ru', en: 'make (someone) do' },
          { jp: 'しよう', hep: 'shi·you', en: "let's do" },
        ]} />
      <AccordionRow id="来る" jp="来る" rom="ku·ru" meaning="Come"
        structure={['Irregular: 来る changes reading too (く→き/こ)']}
        openSet={openSet} toggle={toggle} refBookmarkedIds={rbIds} onToggleRefBookmark={onRbToggle} learnedIds={learnedIds} onToggleLearned={onToggleLearned} items={[
          { jp: '来ます', hep: 'ki·ma·su', en: 'come (polite)' },
          { jp: '来ません', hep: 'ki·ma·sen', en: "don't come" },
          { jp: '来ました', hep: 'ki·ma·shi·ta', en: 'came (past)' },
          { jp: '来て', hep: 'ki·te', en: 'come (te-form)' },
          { jp: '来た', hep: 'ki·ta', en: 'came (plain)' },
          { jp: '来ない', hep: 'ko·nai', en: "don't come (plain)" },
          { jp: '来たい', hep: 'ki·tai', en: 'want to come' },
          { jp: '来られる', hep: 'ko·ra·re·ru', en: 'can come' },
          { jp: '来させる', hep: 'ko·sa·se·ru', en: 'make (someone) come' },
          { jp: '来よう', hep: 'ko·you', en: "let's come" },
        ]} />
        </>
      )}
    </div>
  );
}
