import { useState, useCallback, useRef, useEffect } from 'react';
import { scenarios } from '../data/scenarios';
import type { Scenario, ConversationLine } from '../data/scenarios';
import type { LanguageConfig } from '../data/types';
import { speak } from '../utils/tts';

interface Props {
  lang: string;
  langConfig: LanguageConfig;
}

export function Scenarios({ lang, langConfig }: Props) {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [revealedCount, setRevealedCount] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const autoPlayRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const langScenarios = scenarios.filter(s => s.lang === lang);

  const handleSelect = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setRevealedCount(0);
    setIsAutoPlaying(false);
    autoPlayRef.current = false;
  };

  const handleBack = () => {
    setSelectedScenario(null);
    setRevealedCount(0);
    setIsAutoPlaying(false);
    autoPlayRef.current = false;
    window.speechSynthesis.cancel();
  };

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
  if (!selectedScenario) {
    if (langScenarios.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full px-6 text-center">
          <p className="text-4xl mb-4">🎭</p>
          <p className="text-lg font-semibold text-slate-200">No conversations yet for {langConfig.name}</p>
          <p className="text-sm text-slate-400 mt-2">Conversations will be added soon! Try switching to Japanese 🇯🇵 to see examples.</p>
        </div>
      );
    }
    return (
      <div className="scroll-area h-full p-4">
        <h1 className="text-xl font-bold mb-1">🎭 Conversations</h1>
        <p className="text-slate-400 text-sm mb-4">Practice real {langConfig.name} dialogues step-by-step</p>
        <div className="space-y-2">
          {langScenarios.map(sc => (
            <button
              key={sc.id}
              onClick={() => handleSelect(sc)}
              className="w-full bg-slate-800/80 rounded-2xl p-4 text-left active:bg-slate-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{sc.emoji}</span>
                <div>
                  <h3 className="text-sm font-semibold text-slate-100">{sc.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{sc.titleTC}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{sc.description} · {sc.lines.length} lines</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const allRevealed = revealedCount >= selectedScenario.lines.length;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-950/95 backdrop-blur-sm px-4 py-3 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <button onClick={handleBack} className="text-sakura-400 text-sm mb-1 flex items-center gap-1">
              ← All Scenes
            </button>
            <h2 className="text-lg font-bold">{selectedScenario.emoji} {selectedScenario.title}</h2>
            <p className="text-xs text-slate-400">{selectedScenario.titleTC} · {selectedScenario.description}</p>
          </div>
          <div className="flex gap-1.5 shrink-0">
            <button
              onClick={handleReset}
              className="text-xs bg-slate-800 text-slate-400 px-2.5 py-1.5 rounded-lg active:bg-slate-700"
            >
              ↺
            </button>
            <button
              onClick={handleAutoPlay}
              className={`text-xs px-3 py-1.5 rounded-lg transition ${
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

      {/* Conversation */}
      <div className="flex-1 scroll-area p-4 space-y-3" ref={scrollRef}>
        {selectedScenario.lines.slice(0, revealedCount).map((line, idx) => (
          <ConversationBubble key={idx} line={line} index={idx} ttsLang={langConfig.ttsLang} />
        ))}

        {/* Tap to reveal next */}
        {!allRevealed && !isAutoPlaying && (
          <button
            onClick={revealNext}
            className="w-full py-4 text-center text-sm text-slate-500 active:text-slate-300 transition"
          >
            <span className="bg-slate-800/80 px-4 py-2 rounded-xl">
              Tap to reveal next line ({revealedCount + 1}/{selectedScenario.lines.length})
            </span>
          </button>
        )}

        {allRevealed && (
          <div className="text-center py-4">
            <p className="text-sm text-slate-500 mb-3">🎉 Conversation complete!</p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={handleReset}
                className="text-xs bg-slate-800 text-slate-300 px-4 py-2 rounded-xl active:bg-slate-700"
              >
                ↺ Start Over
              </button>
              <button
                onClick={() => { handleReset(); handleAutoPlay(); }}
                className="text-xs bg-sakura-500/80 text-white px-4 py-2 rounded-xl active:bg-sakura-600"
              >
                ▶ Auto Play
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ConversationBubble({ line, index, ttsLang }: { line: ConversationLine; index: number; ttsLang: string }) {
  const isStaff = line.speaker === 'staff';
  const [showDetail, setShowDetail] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const hasOptions = line.options && line.options.length > 0;
  const displayLine = hasOptions && selectedOption !== null
    ? { ...line, ...line.options![selectedOption] }
    : line;

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
        <p className={`text-[10px] font-semibold mb-1 ${isStaff ? 'text-blue-400' : 'text-emerald-400'} ${isStaff ? 'text-left' : 'text-right'}`}>
          {isStaff ? '🧑‍🍳 Staff' : '👤 You'}
        </p>

        {/* Options selector — show before the bubble when there are choices */}
        {hasOptions && selectedOption === null && (
          <div className="mb-2 space-y-1.5">
            <p className="text-[10px] text-slate-500 text-right">Choose your response:</p>
            {line.options!.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className="w-full bg-indigo-900/30 border border-indigo-700/40 rounded-xl p-2.5 text-left active:bg-indigo-800/50 transition"
              >
                <p className="text-sm text-slate-100">{opt.target}</p>
                <p className="text-xs text-sakura-300 mt-0.5">{opt.pronunciation_chunks || opt.pronunciation}</p>
                <p className="text-xs text-slate-400 mt-0.5">{opt.english} · {opt.chinese_tc}</p>
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
                <p className="text-sm text-sakura-300 mt-0.5">{displayLine.pronunciation_chunks || displayLine.pronunciation}</p>
              </div>
              {!displayLine.target.startsWith('（') && (
                <button onClick={handleSpeak} className="text-lg shrink-0 p-1 active:scale-110 transition-transform">
                  🔊
                </button>
              )}
            </div>

            {/* Always show translation */}
            <div className="mt-2 pt-2 border-t border-slate-700/40">
              <p className="text-sm text-slate-300">{displayLine.english}</p>
              <p className="text-xs text-slate-500">{displayLine.chinese_tc}</p>
            </div>

            {/* Change selection */}
            {hasOptions && (
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedOption(null); }}
                className="mt-2 text-[10px] text-indigo-400 active:text-indigo-300"
              >
                ↻ Choose different response
              </button>
            )}

            {/* Expanded detail */}
            {showDetail && line.note && (
              <div className="mt-2 bg-amber-900/20 border border-amber-700/30 rounded-lg p-2">
                <p className="text-xs text-amber-400">💡 {line.note}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
