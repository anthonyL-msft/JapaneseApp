import { useState, useCallback, useRef, useEffect } from 'react';
import { scenarios, SCENARIO_GROUPS } from '../data/scenarios';
import type { Scenario, ConversationLine, ScenarioGroup } from '../data/scenarios';
import type { LanguageConfig } from '../data/types';
import { speak } from '../utils/tts';
import { useSlidePanel } from '../utils/useSlidePanel';

interface Props {
  lang: string;
  langConfig: LanguageConfig;
  search?: string;
}

export function Scenarios({ lang, langConfig, search = '' }: Props) {
  const conversationPanel = useSlidePanel<Scenario>();
  const groupPanel = useSlidePanel<ScenarioGroup>();
  const [revealedCount, setRevealedCount] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const autoPlayRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const allLangScenarios = scenarios.filter(s => s.lang === lang);

  // Filter scenarios by search query
  const langScenarios = search.trim()
    ? allLangScenarios.filter(sc => {
        const q = search.toLowerCase();
        return (
          sc.title.toLowerCase().includes(q) ||
          sc.titleTC.toLowerCase().includes(q) ||
          sc.description.toLowerCase().includes(q) ||
          sc.lines.some(line =>
            line.target.toLowerCase().includes(q) ||
            line.pronunciation.toLowerCase().includes(q) ||
            line.english.toLowerCase().includes(q) ||
            line.chinese_tc.toLowerCase().includes(q)
          )
        );
      })
    : allLangScenarios;

  const handleSelect = (scenario: Scenario) => {
    conversationPanel.open(scenario);
    setRevealedCount(0);
    setIsAutoPlaying(false);
    autoPlayRef.current = false;
  };

  const handleBack = () => {
    conversationPanel.close();
    setRevealedCount(0);
    setIsAutoPlaying(false);
    autoPlayRef.current = false;
    window.speechSynthesis.cancel();
  };

  const selectedScenario = conversationPanel.value;

  const revealNext = useCallback(() => {
    if (!selectedScenario) return;
    setRevealedCount(prev => {
      const next = Math.min(prev + 1, selectedScenario.lines.length);
      return next;
    });
  }, [selectedScenario]);

  // Scroll to latest revealed line
  useEffect(() => {
    if (revealedCount > 0 && scrollRef.current) {
      const lines = scrollRef.current.querySelectorAll('[data-line]');
      const lastLine = lines[lines.length - 1];
      if (lastLine) {
        lastLine.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [revealedCount]);

  const handleAutoPlay = useCallback(async () => {
    if (!selectedScenario) return;
    if (isAutoPlaying) {
      setIsAutoPlaying(false);
      autoPlayRef.current = false;
      window.speechSynthesis.cancel();
      return;
    }

    setIsAutoPlaying(true);
    autoPlayRef.current = true;
    const startFrom = revealedCount;

    for (let i = startFrom; i < selectedScenario.lines.length; i++) {
      if (!autoPlayRef.current) break;

      setRevealedCount(i + 1);

      // Speak and wait
      await new Promise<void>((resolve) => {
        const line = selectedScenario.lines[i];
        if (line.target.startsWith('（')) {
          // Action line, skip TTS
          setTimeout(resolve, 1500);
          return;
        }
        const utterance = new SpeechSynthesisUtterance(line.target);
        utterance.lang = langConfig.ttsLang;
        utterance.rate = 0.85;
        const voices = window.speechSynthesis.getVoices();
        const voice = voices.find(v => v.lang.startsWith(langConfig.code));
        if (voice) utterance.voice = voice;
        utterance.onend = () => setTimeout(resolve, 1200);
        utterance.onerror = () => resolve();
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      });
    }

    setIsAutoPlaying(false);
    autoPlayRef.current = false;
  }, [selectedScenario, revealedCount, isAutoPlaying]);

  const handleReset = () => {
    setRevealedCount(0);
    setIsAutoPlaying(false);
    autoPlayRef.current = false;
    window.speechSynthesis.cancel();
  };

  // Scenario list
  if (langScenarios.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center">
        <p className="text-4xl mb-4">{search.trim() ? '🔍' : '🎭'}</p>
        <p className="text-lg font-semibold text-slate-200">
          {search.trim() ? `No conversations matching "${search}"` : `No conversations yet for ${langConfig.name}`}
        </p>
        <p className="text-base text-slate-400 mt-2">
          {search.trim() ? 'Try a different search term' : 'Conversations will be added soon! Try switching to Japanese 🇯🇵 to see examples.'}
        </p>
      </div>
    );
  }

  // Group scenarios
  const isSearching = !!search.trim();
  const groups = (Object.entries(SCENARIO_GROUPS) as [ScenarioGroup, { label: string; emoji: string }][])
    .map(([groupKey, groupInfo]) => ({
      key: groupKey as ScenarioGroup,
      ...groupInfo,
      scenarios: langScenarios.filter(s => s.group === groupKey),
    }))
    .filter(g => g.scenarios.length > 0);

  // When searching, show flat list
  if (isSearching) {
    return (
      <div className="scroll-area h-full p-4">
        <h1 className="text-xl font-bold mb-1">🎭 Conversations</h1>
        <p className="text-slate-400 text-base mb-4">
          {langScenarios.length} conversations matching "{search}"
        </p>
        <div className="space-y-1.5">
          {langScenarios.map(sc => (
            <button
              key={sc.id}
              onClick={() => handleSelect(sc)}
              className="w-full bg-slate-700/40 rounded-xl p-3 text-left active:bg-slate-600/50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">{sc.emoji}</span>
                <div>
                  <h4 className="text-base font-medium text-slate-200">{sc.title}</h4>
                  <p className="text-base text-slate-500">{sc.titleTC} · {sc.lines.length} lines</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const allRevealed = selectedScenario ? revealedCount >= selectedScenario.lines.length : false;

  return (
    <div className="h-full relative">
      {/* L1: Group grid */}
      <div className="scroll-area h-full p-4">
        <h1 className="text-xl font-bold mb-1">🎭 Conversations</h1>
        <p className="text-slate-400 text-base mb-4">
          Practice real {langConfig.name} dialogues step-by-step
        </p>
        <div className="grid grid-cols-2 gap-2">
          {groups.map(g => (
            <button
              key={g.key}
              onClick={() => groupPanel.open(g.key)}
              className="bg-slate-800/60 rounded-xl p-3 text-left active:bg-slate-700/50 transition flex flex-col gap-1"
            >
              <span className="text-2xl">{g.emoji}</span>
              <span className="text-base font-semibold text-slate-100">{g.label}</span>
              <span className="text-sm text-slate-500">{g.scenarios.length} conversations</span>
            </button>
          ))}
        </div>
      </div>

      {/* L2: Slide-in scenario list for selected group */}
      {groupPanel.visible && (() => {
        const groupInfo = SCENARIO_GROUPS[groupPanel.value!];
        const groupScenarios = langScenarios.filter(s => s.group === groupPanel.value);
        return (
          <div className={`absolute inset-0 bg-slate-950 ${groupPanel.animClass} flex flex-col z-40`}>
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 shrink-0">
              <button onClick={() => groupPanel.close()} className="text-base text-slate-400 active:text-slate-200 p-1">
                ←
              </button>
              <h2 className="text-lg font-bold flex-1">{groupInfo.emoji} {groupInfo.label}</h2>
            </div>
            <div className="scroll-area flex-1 p-4 space-y-1.5">
              {groupScenarios.map(sc => (
                <button
                  key={sc.id}
                  onClick={() => handleSelect(sc)}
                  className="w-full bg-slate-700/40 rounded-xl p-3 text-left active:bg-slate-600/50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{sc.emoji}</span>
                    <div>
                      <h4 className="text-base font-medium text-slate-200">{sc.title}</h4>
                      <p className="text-base text-slate-500">{sc.titleTC} · {sc.lines.length} lines</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      })()}

      {/* L3: Slide-in conversation view */}
      {conversationPanel.visible && selectedScenario && (
        <div className={`absolute inset-0 bg-slate-950 ${conversationPanel.animClass} flex flex-col z-50`}>
          <div className="bg-slate-950/95 backdrop-blur-sm px-4 py-3 border-b border-slate-800 shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <button onClick={handleBack} className="text-base text-slate-400 active:text-slate-200 p-1">
                  ← {groupPanel.value ? SCENARIO_GROUPS[groupPanel.value].label : ''}
                </button>
                <h2 className="text-lg font-bold">{selectedScenario.emoji} {selectedScenario.title}</h2>
                <p className="text-base text-slate-400">{selectedScenario.titleTC} · {selectedScenario.description}</p>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button
                  onClick={handleReset}
                  className="text-base bg-slate-800 text-slate-400 px-2.5 py-1.5 rounded-lg active:bg-slate-700"
                >
                  ↺
                </button>
                <button
                  onClick={handleAutoPlay}
                  className={`text-base px-3 py-1.5 rounded-lg transition ${
                    isAutoPlaying
                      ? 'bg-red-900/60 text-red-300 active:bg-red-800'
                      : 'bg-sakura-500/80 text-white active:bg-sakura-600'
                  }`}
                >
                  {isAutoPlaying ? '⏹ Stop' : '▶ Play All'}
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 scroll-area p-4 space-y-3" ref={scrollRef}>
            {selectedScenario.lines.slice(0, revealedCount).map((line, idx) => (
              <ConversationBubble key={idx} line={line} index={idx} ttsLang={langConfig.ttsLang} />
            ))}

            {!allRevealed && !isAutoPlaying && (
              <button
                onClick={revealNext}
                className="w-full py-4 text-center text-base text-slate-500 active:text-slate-300 transition"
              >
                <span className="bg-slate-800/80 px-4 py-2 rounded-xl">
                  Tap to reveal next line ({revealedCount + 1}/{selectedScenario.lines.length})
                </span>
              </button>
            )}

            {allRevealed && (
              <div className="text-center py-4">
                <p className="text-base text-slate-500 mb-3">🎉 Conversation complete!</p>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={handleReset}
                    className="text-base bg-slate-800 text-slate-300 px-4 py-2 rounded-xl active:bg-slate-700"
                  >
                    ↺ Start Over
                  </button>
                  <button
                    onClick={() => { handleReset(); handleAutoPlay(); }}
                    className="text-base bg-sakura-500/80 text-white px-4 py-2 rounded-xl active:bg-sakura-600"
                  >
                    ▶ Auto Play
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ConversationBubble({ line, index, ttsLang }: { line: ConversationLine; index: number; ttsLang: string }) {
  const isStaff = line.speaker === 'staff';
  const [showDetail, setShowDetail] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [varSelections, setVarSelections] = useState<Record<string, number>>({});

  const hasOptions = line.options && line.options.length > 0;
  const hasVariables = line.variables && line.variables.length > 0;

  // Apply variable substitutions to the display text
  const applyVarSubstitutions = (text: string) => {
    if (!hasVariables) return text;
    let result = text;
    for (const v of line.variables!) {
      const selectedIdx = varSelections[v.placeholder];
      if (selectedIdx !== undefined) {
        result = result.replaceAll(v.placeholder, v.options[selectedIdx].value);
      }
    }
    return result;
  };

  // Apply variable substitutions to pronunciation (swap default option's pron with selected)
  const applyPronSubstitutions = (text: string) => {
    if (!hasVariables) return text;
    let result = text;
    for (const v of line.variables!) {
      const selectedIdx = varSelections[v.placeholder];
      if (selectedIdx !== undefined) {
        const defaultPron = v.options[0].pronunciation;
        const selectedPron = v.options[selectedIdx].pronunciation;
        if (defaultPron !== selectedPron) {
          result = result.replaceAll(defaultPron, selectedPron);
        }
        result = result.replaceAll(v.placeholder, v.options[selectedIdx].value);
      }
    }
    return result;
  };

  // Apply variable substitutions to English
  const applyEngSubstitutions = (text: string) => {
    if (!hasVariables) return text;
    let result = text;
    for (const v of line.variables!) {
      const selectedIdx = varSelections[v.placeholder];
      if (selectedIdx !== undefined) {
        const defaultEng = v.options[0].english;
        const selectedEng = v.options[selectedIdx].english;
        if (defaultEng !== selectedEng) {
          result = result.replaceAll(defaultEng, selectedEng);
        }
        result = result.replaceAll(v.placeholder, v.options[selectedIdx].value);
      }
    }
    return result;
  };

  const baseDisplayLine = hasOptions && selectedOption !== null
    ? { ...line, ...line.options![selectedOption] }
    : line;

  const displayLine = {
    ...baseDisplayLine,
    target: applyVarSubstitutions(baseDisplayLine.target),
    pronunciation: applyPronSubstitutions(baseDisplayLine.pronunciation),
    pronunciation_chunks: baseDisplayLine.pronunciation_chunks
      ? applyPronSubstitutions(baseDisplayLine.pronunciation_chunks)
      : undefined,
    english: applyEngSubstitutions(baseDisplayLine.english),
    chinese_tc: applyVarSubstitutions(baseDisplayLine.chinese_tc),
  };

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!displayLine.target.startsWith('（')) {
      speak(displayLine.target, ttsLang);
    }
  };

  const handleSelectOption = (idx: number) => {
    setSelectedOption(idx);
    speak(line.options![idx].target, ttsLang);
  };

  return (
    <div data-line={index} className={`flex ${isStaff ? 'justify-start' : 'justify-end'}`}>
      <div className={`max-w-[85%] ${isStaff ? 'order-2' : 'order-1'}`}>
        {/* Speaker label */}
        <p className={`text-base font-semibold mb-1 ${isStaff ? 'text-blue-400' : 'text-emerald-400'} ${isStaff ? 'text-left' : 'text-right'}`}>
          {isStaff ? '🧑‍🍳 Staff' : '👤 You'}
        </p>

        {/* Options selector — show before the bubble when there are choices */}
        {hasOptions && selectedOption === null && (
          <div className="mb-2 space-y-1.5">
            <p className="text-base text-slate-500 text-right">Choose your response:</p>
            {line.options!.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className="w-full bg-indigo-900/30 border border-indigo-700/40 rounded-xl p-2.5 text-left active:bg-indigo-800/50 transition"
              >
                <p className="text-base text-slate-100">{opt.target}</p>
                <p className="text-base text-sakura-300 mt-0.5">{opt.pronunciation_chunks || opt.pronunciation}</p>
                <p className="text-base text-slate-400 mt-0.5">{opt.english} · {opt.chinese_tc}</p>
              </button>
            ))}
          </div>
        )}

        {/* Bubble — show after selection (or immediately if no options) */}
        {(!hasOptions || selectedOption !== null) && (
          <div
            onClick={() => setShowDetail(!showDetail)}
            className={`rounded-2xl p-3 cursor-pointer active:opacity-80 transition ${
              isStaff
                ? 'bg-slate-800 rounded-tl-sm'
                : 'bg-indigo-900/60 rounded-tr-sm'
            }`}
          >
            <div className="flex items-start gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-base text-slate-50">{displayLine.target}</p>
                <p className="text-base text-sakura-300 mt-0.5">{displayLine.pronunciation_chunks || displayLine.pronunciation}</p>
              </div>
              {!displayLine.target.startsWith('（') && (
                <button onClick={handleSpeak} className="text-lg shrink-0 p-1 active:scale-110 transition-transform">
                  🔊
                </button>
              )}
            </div>

            {/* Always show translation */}
            <div className="mt-2 pt-2 border-t border-slate-700/40">
              <p className="text-base text-slate-400">{displayLine.english}</p>
              <p className="text-base text-slate-500">{displayLine.chinese_tc}</p>
            </div>

            {/* Variable chips — swap places, times, etc. */}
            {hasVariables && (
              <div className="mt-2 pt-2 border-t border-slate-700/40 space-y-2">
                {line.variables!.map(v => (
                  <div key={v.placeholder}>
                    <p className="text-base text-slate-500 mb-1">🔄 {v.label}:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {v.options.map((opt, oi) => {
                        const isSelected = (varSelections[v.placeholder] ?? 0) === oi;
                        return (
                          <button
                            key={oi}
                            onClick={(e) => {
                              e.stopPropagation();
                              setVarSelections(prev => ({ ...prev, [v.placeholder]: oi }));
                            }}
                            className={`text-base px-2 py-1 rounded-lg transition ${
                              isSelected
                                ? 'bg-sakura-500/60 text-white'
                                : 'bg-slate-700/50 text-slate-300 active:bg-slate-600'
                            }`}
                          >
                            {opt.value} <span className="text-slate-400">{opt.english}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Change selection */}
            {hasOptions && (
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedOption(null); }}
                className="mt-2 text-base text-indigo-400 active:text-indigo-300"
              >
                ↻ Choose different response
              </button>
            )}

            {/* Expanded detail */}
            {showDetail && line.note && (
              <div className="mt-2 bg-amber-900/20 border border-amber-700/30 rounded-lg p-2">
                <p className="text-base text-amber-400">💡 {line.note}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
