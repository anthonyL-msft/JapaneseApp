import { useMemo } from 'react';
import type { Phrase, LearnedItem, Category } from '../data/types';
import { CATEGORY_INFO } from '../data/types';

interface Props {
  phrases: Phrase[];
  learnedItems: LearnedItem[];
}

export function Progress({ phrases, learnedItems }: Props) {
  const learnedIds = useMemo(() => new Set(learnedItems.map(l => l.id)), [learnedItems]);

  // Per-category stats
  const categoryStats = useMemo(() => {
    const stats: { cat: Category; label: string; emoji: string; total: number; learned: number }[] = [];
    const entries = Object.entries(CATEGORY_INFO) as [Category, { label: string; emoji: string; labelTC: string }][];
    for (const [cat, info] of entries) {
      const catPhrases = phrases.filter(p => p.category === cat);
      const learned = catPhrases.filter(p => learnedIds.has(p.id)).length;
      if (catPhrases.length > 0) {
        stats.push({ cat, label: info.label, emoji: info.emoji, total: catPhrases.length, learned });
      }
    }
    return stats.sort((a, b) => (b.learned / b.total) - (a.learned / a.total));
  }, [phrases, learnedIds]);

  // Also count ref-learned items (id starts with ref_)
  const refLearned = learnedItems.filter(l => l.id.startsWith('ref_')).length;

  const totalPhrases = phrases.length;
  const learnedPhrases = phrases.filter(p => learnedIds.has(p.id)).length;
  const totalLearned = learnedPhrases + refLearned;
  const overallPercent = totalPhrases > 0 ? Math.round((learnedPhrases / totalPhrases) * 100) : 0;

  // Recent activity (last 10)
  const recentItems = useMemo(() => {
    return learnedItems
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 10)
      .map(item => {
        const phrase = phrases.find(p => p.id === item.id);
        return {
          id: item.id,
          label: phrase ? phrase.target : item.id.replace('ref_', ''),
          sub: phrase ? phrase.english : 'Reference example',
          date: new Date(item.createdAt),
        };
      });
  }, [learnedItems, phrases]);

  // Streak (simple: count consecutive days with learned items)
  const streak = useMemo(() => {
    if (learnedItems.length === 0) return 0;
    const days = new Set(learnedItems.map(l => {
      const d = new Date(l.createdAt);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    }));
    const today = new Date();
    let count = 0;
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      if (days.has(key)) {
        count++;
      } else if (i > 0) {
        break;
      }
    }
    return count;
  }, [learnedItems]);

  return (
    <div className="scroll-area h-full">
      <div className="px-4 py-3 border-b border-slate-800">
        <h2 className="text-lg font-bold">📊 My Progress</h2>
        <p className="text-base text-slate-400">Track your learning journey</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Overview cards */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-slate-800/60 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-emerald-400">{totalLearned}</p>
            <p className="text-sm text-slate-500">Learned</p>
          </div>
          <div className="bg-slate-800/60 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-sakura-400">{overallPercent}%</p>
            <p className="text-sm text-slate-500">Complete</p>
          </div>
          <div className="bg-slate-800/60 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-amber-400">{streak}</p>
            <p className="text-sm text-slate-500">{streak === 1 ? 'Day' : 'Days'}</p>
          </div>
        </div>

        {/* Overall progress bar */}
        <div className="bg-slate-800/60 rounded-xl p-3">
          <div className="flex justify-between mb-2">
            <span className="text-base text-slate-300">Phrases Mastered</span>
            <span className="text-base text-slate-400">{learnedPhrases} / {totalPhrases}</span>
          </div>
          <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
          {refLearned > 0 && (
            <p className="text-sm text-slate-500 mt-1.5">+ {refLearned} reference examples</p>
          )}
        </div>

        {/* Per-category breakdown */}
        <div className="bg-slate-800/60 rounded-xl p-3">
          <p className="text-base text-slate-300 mb-3">By Category</p>
          <div className="space-y-4">
            {[
              { title: 'Getting Started', cats: ['greetings', 'basics', 'smalltalk', 'vocab'] },
              { title: 'Travel', cats: ['airport', 'directions', 'hotel'] },
              { title: 'Food & Shopping', cats: ['restaurant', 'food', 'drinks', 'shopping'] },
              { title: 'Culture & Safety', cats: ['culture', 'local', 'emergency'] },
            ].map(group => (
              <div key={group.title}>
                <p className="text-sm text-slate-500 mb-1.5">{group.title}</p>
                <div className="space-y-2.5">
                  {categoryStats.filter(s => group.cats.includes(s.cat)).map(s => {
                    const pct = s.total > 0 ? Math.round((s.learned / s.total) * 100) : 0;
                    return (
                      <div key={s.cat}>
                        <div className="flex justify-between mb-1">
                          <span className="text-base text-slate-400">{s.emoji} {s.label}</span>
                          <span className="text-sm text-slate-500">{s.learned}/{s.total}</span>
                        </div>
                        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${pct === 100 ? 'bg-emerald-400' : pct > 0 ? 'bg-sakura-400' : 'bg-slate-600'}`}
                            style={{ width: `${Math.max(pct, 0)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        {recentItems.length > 0 && (
          <div className="bg-slate-800/60 rounded-xl p-3">
            <p className="text-base text-slate-300 mb-2">Recent Activity</p>
            <div className="space-y-1.5">
              {recentItems.map(item => (
                <div key={item.id} className="flex items-center justify-between py-1">
                  <div className="flex-1 min-w-0">
                    <p className="text-base text-slate-200 truncate">{item.label}</p>
                    <p className="text-sm text-slate-500 truncate">{item.sub}</p>
                  </div>
                  <span className="text-sm text-slate-600 shrink-0 ml-2">
                    {item.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {totalLearned === 0 && (
          <div className="text-center py-8">
            <p className="text-4xl mb-3">🌱</p>
            <p className="text-lg font-semibold text-slate-200">Start your journey!</p>
            <p className="text-base text-slate-400 mt-2">Mark phrases as "Learned ✓" to track your progress here</p>
          </div>
        )}
      </div>
    </div>
  );
}
