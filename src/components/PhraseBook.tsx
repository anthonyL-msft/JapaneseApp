import { useState } from 'react';
import { Star, Tag } from 'lucide-react';
import type { Phrase, UserNote, Category, Level } from '../data/types';
import { CATEGORY_INFO } from '../data/types';
import { PhraseCard } from './PhraseCard';
import { useSlidePanel } from '../utils/useSlidePanel';

interface Props {
  phrases: Phrase[];
  bookmarkedIds: Set<string>;
  notes: UserNote[];
  onToggleBookmark: (id: string) => void;
  onSaveNote: (note: UserNote) => void;
  onDeleteNote: (id: string) => void;
  onShowCards?: () => void;
  learnedIds?: Set<string>;
  onToggleLearned?: (id: string) => void;
  onAskMore?: (phrase: Phrase) => void;
}

export function PhraseBook({ phrases, bookmarkedIds, notes, onToggleBookmark, onSaveNote, onDeleteNote, onShowCards, learnedIds, onToggleLearned, onAskMore }: Props) {
  const panel = useSlidePanel<Category>();
  const [expandedPhrase, setExpandedPhrase] = useState<string | null>(null);
  const [openSituations, setOpenSituations] = useState<Set<string>>(new Set());
  const [initializedCategory, setInitializedCategory] = useState<string | null>(null);
  const [levelFilter, setLevelFilter] = useState<'all' | Level>('all');
  const [vocabTab, setVocabTab] = useState<string>('words');

  // Vocab topic grouping
  const VOCAB_TABS: { id: string; label: string; situations: string[] }[] = [
    { id: 'words', label: 'Words', situations: ['Basic nouns', 'Pointing words', 'Colors'] },
    { id: 'actions', label: 'Actions', situations: ['Basic verbs', 'Daily actions'] },
    { id: 'time', label: 'Time', situations: ['Numbers', 'Time', 'Meals', 'Days of the week'] },
    { id: 'world', label: 'World', situations: ['Basic places', 'Directions'] },
    { id: 'people', label: 'People', situations: ['People & Family', 'Body & Health', 'Basic adjectives'] },
  ];

  const toggleSituation = (situation: string) => {
    setOpenSituations(prev => {
      const next = new Set(prev);
      if (next.has(situation)) next.delete(situation);
      else next.add(situation);
      return next;
    });
  };

  // Phrase list for selected category
  const categoryPhrases = panel.value ? phrases.filter(p => p.category === panel.value) : [];
  const info = panel.value ? CATEGORY_INFO[panel.value] : null;

  // Level counts for tabs
  const levelCounts = {
    all: categoryPhrases.length,
    basic: categoryPhrases.filter(p => (p.level || 'basic') === 'basic').length,
    intermediate: categoryPhrases.filter(p => p.level === 'intermediate').length,
    advanced: categoryPhrases.filter(p => p.level === 'advanced').length,
  };

  // Filter by level
  const filteredPhrases = levelFilter === 'all'
    ? categoryPhrases
    : categoryPhrases.filter(p => (p.level || 'basic') === levelFilter);

  // Filter by vocab tab when in Vocabulary category
  const activeVocabSituations = panel.value === 'vocab'
    ? VOCAB_TABS.find(t => t.id === vocabTab)?.situations ?? []
    : null;
  const displayPhrases = activeVocabSituations
    ? filteredPhrases.filter(p => activeVocabSituations.includes(p.situation))
    : filteredPhrases;

  // Group by situation
  const situations = new Map<string, Phrase[]>();
  displayPhrases.forEach(p => {
    const list = situations.get(p.situation) || [];
    list.push(p);
    situations.set(p.situation, list);
  });

  const situationKeys = Array.from(situations.keys());
  const allOpen = situationKeys.length > 0 && situationKeys.every(k => openSituations.has(k));

  const toggleAll = () => {
    if (allOpen) {
      setOpenSituations(new Set());
    } else {
      setOpenSituations(new Set(situationKeys));
    }
  };

  // Default open all when first entering a category
  if (panel.value && panel.value !== initializedCategory && situationKeys.length > 0) {
    setOpenSituations(new Set(situationKeys));
    setInitializedCategory(panel.value);
  }

  return (
    <div className="h-full relative">
      {/* L1: Category grid */}
      <div className="scroll-area h-full p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold mb-0.5">Phrase Book</h1>
            <p className="text-slate-400 text-base">Select a category to start learning</p>
          </div>
          <div className="flex gap-2">
            {onShowCards && (
              <button
                onClick={onShowCards}
                className="bg-slate-800 text-slate-300 text-base px-3 py-2 rounded-xl active:bg-slate-700 transition shrink-0 flex items-center gap-1"
              >
                <Tag size={14} /> Cards
              </button>
            )}
          </div>
        </div>
        {/* Grouped category grid */}
        {[
          { title: 'Foundation', cats: ['greetings', 'basics', 'power', 'vocab'] },
          { title: 'Travel & Stay', cats: ['airport', 'directions', 'hotel'] },
          { title: 'Food & Drinks', cats: ['restaurant', 'food', 'drinks'] },
          { title: 'Shopping & Daily', cats: ['shopping', 'smalltalk', 'emergency'] },
          { title: 'Culture & Local', cats: ['culture', 'local'] },
        ].map(group => (
          <div key={group.title} className="mb-4">
            <h3 className="text-sm text-slate-500 font-medium mb-1.5 px-1">{group.title}</h3>
            <div className="grid grid-cols-2 gap-2">
              {group.cats.map(key => {
                const catInfo = CATEGORY_INFO[key as Category];
                if (!catInfo) return null;
                const catPhrases = phrases.filter(p => p.category === key);
                const bookmarked = catPhrases.filter(p => bookmarkedIds.has(p.id)).length;
                return (
                  <button
                    key={key}
                    onClick={() => { panel.open(key as Category); setOpenSituations(new Set()); setExpandedPhrase(null); setLevelFilter('all'); setVocabTab('words'); }}
                    className="bg-slate-800/80 rounded-xl p-4 text-left active:bg-slate-700 transition-colors"
                  >
                    <span className="text-2xl">{catInfo.emoji}</span>
                    <h3 className="text-base font-semibold mt-2 text-slate-100">{catInfo.label}</h3>
                    <p className="text-base text-slate-400 mt-0.5">{catInfo.labelTC}</p>
                    <p className="text-base text-slate-500 mt-1">
                      {catPhrases.length} phrases
                      {bookmarked > 0 && <span className="text-amber-400 flex items-center gap-0.5"> · <Star size={12} className="fill-amber-400" /> {bookmarked}</span>}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* L2: Full-page slide-in for selected category */}
      {panel.visible && info && (
        <div className={`absolute inset-0 bg-slate-950 ${panel.animClass} flex flex-col z-40`}>
          <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 shrink-0">
            <button onClick={() => panel.close()} className="text-lg text-slate-400 active:text-slate-200 p-1">
              ←
            </button>
            <h2 className="text-lg font-bold flex-1">{info.emoji} {info.label}</h2>
            <button
              onClick={toggleAll}
              className="text-base bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg active:bg-slate-700 transition shrink-0"
            >
              {allOpen ? '▲ Close All' : '▼ Open All'}
            </button>
          </div>

          {/* Level filter tabs */}
          {(levelCounts.intermediate > 0 || levelCounts.advanced > 0) && (
            <div className="flex gap-1 overflow-x-auto px-4 py-2 border-b border-slate-800 shrink-0">
              {(['all', 'basic', 'intermediate', 'advanced'] as const).map(level => {
                const count = levelCounts[level];
                if (level !== 'all' && count === 0) return null;
                const label = level === 'all' ? 'All' : level === 'intermediate' ? 'Intermediate' : level.charAt(0).toUpperCase() + level.slice(1);
                return (
                  <button
                    key={level}
                    onClick={() => setLevelFilter(level)}
                    className={`px-3 py-1.5 rounded-lg text-base whitespace-nowrap transition ${
                      levelFilter === level
                        ? 'bg-sakura-500/60 text-white'
                        : 'bg-slate-700/50 text-slate-400 active:bg-slate-600'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Vocab topic tabs */}
          {panel.value === 'vocab' && (
            <div className="flex gap-1 overflow-x-auto px-4 py-2 border-b border-slate-800 shrink-0">
              {VOCAB_TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { 
                    setVocabTab(tab.id); 
                    // Auto-open all situations in this tab
                    const tabSituations = tab.situations;
                    const matchingSituations = filteredPhrases
                      .filter(p => tabSituations.includes(p.situation))
                      .map(p => p.situation);
                    setOpenSituations(new Set(matchingSituations));
                  }}
                  className={`px-3 py-1.5 rounded-lg text-base whitespace-nowrap transition ${
                    vocabTab === tab.id
                      ? 'bg-sakura-500/60 text-white'
                      : 'bg-slate-700/50 text-slate-400 active:bg-slate-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          <div className="scroll-area flex-1 px-2 py-2 space-y-1.5">
            {Array.from(situations.entries())
              .sort(([a], [b]) => {
                // Custom ordering for specific situations
                const order: Record<string, number> = {
                  // Food & Drinks
                  'Common dishes': 1, 'Sashimi & Seafood': 2, 'Food vocabulary': 3,
                  'Flavors & Condiments': 4, 'Drinks': 5, 'Winter drinks': 6, 'Table items': 7,
                  // Restaurant
                  'Entering': 1, 'Ordering': 2, 'Allergies': 3, 'Dietary': 4,
                  'Preferences': 5, 'Takeout vs Dine-in': 6, 'Takeout': 7,
                  'Getting service': 8, 'Compliments': 9, 'Paying': 10,
                  "What you'll hear": 11, 'Mistake recovery': 12,
                  // Basics — push numbers/time to bottom
                  'Numbers': 90, 'Time': 91,
                };
                const aOrder = order[a] ?? 50;
                const bOrder = order[b] ?? 50;
                return aOrder - bOrder;
              })
              .map(([situation, pList]) => {
              const isOpen = openSituations.has(situation);
              return (
                <div key={situation} className="bg-slate-800/60 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleSituation(situation)}
                    className="w-full flex items-center justify-between px-3 py-3 text-left active:bg-slate-700/50 transition"
                  >
                    <div className="text-left">
                      <h3 className="text-base font-semibold text-slate-200">{situation}</h3>
                      <p className="text-base text-slate-500">{pList.length} phrases</p>
                    </div>
                    <span className="text-slate-500 text-base shrink-0 ml-2">{isOpen ? '▲' : '▼'}</span>
                  </button>
                  {isOpen && (
                    <div className="px-1.5 pb-1.5 space-y-1.5">
                      {pList.map(phrase => (
                        <PhraseCard
                          key={phrase.id}
                          phrase={phrase}
                          isBookmarked={bookmarkedIds.has(phrase.id)}
                          notes={notes.filter(n => n.phraseId === phrase.id)}
                          expanded={expandedPhrase === phrase.id}
                          onToggleExpand={() => setExpandedPhrase(expandedPhrase === phrase.id ? null : phrase.id)}
                          onToggleBookmark={() => onToggleBookmark(phrase.id)}
                          isLearned={learnedIds?.has(phrase.id)}
                          onToggleLearned={onToggleLearned ? () => onToggleLearned(phrase.id) : undefined}
                          onSaveNote={onSaveNote}
                          onDeleteNote={onDeleteNote}
                          onAskMore={onAskMore ? () => onAskMore(phrase) : undefined}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
