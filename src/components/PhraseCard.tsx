import { useState } from 'react';
import type { Phrase, UserNote } from '../data/types';
import { speak, getTtsLang } from '../utils/tts';

interface Props {
  phrase: Phrase;
  isBookmarked: boolean;
  isLearned?: boolean;
  notes: UserNote[];
  expanded: boolean;
  onToggleExpand: () => void;
  onToggleBookmark: () => void;
  onToggleLearned?: () => void;
  onSaveNote: (note: UserNote) => void;
  onDeleteNote: (id: string) => void;
}

export function PhraseCard({ phrase, isBookmarked, isLearned, notes, expanded, onToggleExpand, onToggleBookmark, onToggleLearned, onSaveNote, onDeleteNote }: Props) {
  const [noteText, setNoteText] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [showBig, setShowBig] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    speak(phrase.target, getTtsLang(phrase.lang));
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${phrase.target}\n${phrase.pronunciation_chunks || phrase.pronunciation}\n${phrase.english}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveNote = () => {
    if (!noteText.trim()) return;
    const now = Date.now();
    if (editingNoteId) {
      onSaveNote({ id: editingNoteId, phraseId: phrase.id, text: noteText.trim(), createdAt: now, updatedAt: now });
      setEditingNoteId(null);
    } else {
      onSaveNote({ id: `n_${phrase.id}_${now}`, phraseId: phrase.id, text: noteText.trim(), createdAt: now, updatedAt: now });
    }
    setNoteText('');
  };

  return (
    <div className={`bg-slate-700/40 rounded-xl overflow-hidden transition-all ${expanded ? 'ring-1 ring-sakura-400/30' : ''}`}>
      {/* Compact view */}
      <div onClick={onToggleExpand} className="w-full text-left p-3 active:bg-slate-700/50 transition cursor-pointer">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-lg font-medium text-slate-50">{phrase.target}</p>
            <p className="text-base text-sakura-300 mt-0.5">{phrase.pronunciation_chunks || phrase.pronunciation}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={handleSpeak} className="p-1 rounded-lg active:bg-slate-600 text-lg" title="Play pronunciation">
              🔊
            </button>
            <button onClick={(e) => { e.stopPropagation(); onToggleBookmark(); }} className="p-1 rounded-lg active:bg-slate-600 text-lg">
              {isBookmarked ? '⭐' : '☆'}
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-base text-slate-400 flex-1">{phrase.english}</p>
          {onToggleLearned && (
            <button
              onClick={(e) => { e.stopPropagation(); onToggleLearned(); }}
              className={`text-sm px-2 py-0.5 rounded-full transition shrink-0 ml-2 ${isLearned ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-600/30 text-slate-500'}`}
            >
              {isLearned ? 'Learned ✓' : 'Mark learned'}
            </button>
          )}
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="px-3 pb-3 border-t border-slate-700/40 space-y-3">
          {phrase.pronunciation_chunks && (
            <div className="mt-3 bg-indigo-900/20 border border-indigo-700/30 rounded-lg p-2">
              <span className="text-slate-500 text-base">Pronunciation</span>
              <p className="text-base text-indigo-300 font-mono tracking-wide">{phrase.pronunciation_chunks}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 mt-3 text-base">
            {phrase.romanization && (
              <div>
                <span className="text-slate-500 text-base">Reading</span>
                <p className="text-slate-200">{phrase.romanization}</p>
              </div>
            )}
            <div>
              <span className="text-slate-500 text-base">繁體中文</span>
              <p className="text-slate-200">{phrase.chinese_tc}</p>
            </div>
          </div>

          {phrase.native_hint && (
            <div className="bg-amber-900/20 border border-amber-700/30 rounded-lg p-2">
              <p className="text-base text-amber-400">🌉 {phrase.native_hint}</p>
            </div>
          )}

          {phrase.notes && (
            <div className="bg-slate-700/30 rounded-lg p-2">
              <p className="text-base text-slate-300">💡 {phrase.notes}</p>
            </div>
          )}

          {/* User notes */}
          {notes.length > 0 && (
            <div className="space-y-1">
              <p className="text-base text-slate-500">Your notes:</p>
              {notes.map(n => (
                <div key={n.id} className="flex items-start gap-2 bg-slate-700/20 rounded-lg p-2">
                  <p className="text-base text-slate-300 flex-1">{n.text}</p>
                  <button
                    onClick={() => { setNoteText(n.text); setEditingNoteId(n.id); }}
                    className="text-base text-slate-500 hover:text-slate-300"
                  >✏️</button>
                  <button
                    onClick={() => onDeleteNote(n.id)}
                    className="text-base text-slate-500 hover:text-red-400"
                  >🗑️</button>
                </div>
              ))}
            </div>
          )}

          {/* Add note */}
          <div className="flex gap-2">
            <input
              type="text"
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSaveNote()}
              placeholder="Add a note or remark..."
              className="flex-1 bg-slate-700/50 text-base text-slate-200 placeholder-slate-500 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-sakura-400/50"
            />
            <button
              onClick={handleSaveNote}
              disabled={!noteText.trim()}
              className="bg-sakura-500/80 text-white text-base px-3 py-2 rounded-lg disabled:opacity-30 active:bg-sakura-600 transition"
            >
              {editingNoteId ? 'Update' : 'Save'}
            </button>
          </div>

          {/* Quick actions */}
          <div className="flex gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); setShowBig(true); }}
              className="flex-1 bg-slate-700/50 text-slate-300 text-base py-1.5 rounded-lg active:bg-slate-600 transition"
            >📺 Show Big</button>
            <button
              onClick={handleCopy}
              className="flex-1 bg-slate-700/50 text-slate-300 text-base py-1.5 rounded-lg active:bg-slate-600 transition"
            >{copied ? '✓ Copied' : '📋 Copy'}</button>
          </div>

          {/* Difficulty indicator */}
          <div className="flex items-center gap-2 text-base text-slate-500">
            <span>Difficulty:</span>
            {[1, 2, 3].map(d => (
              <span key={d} className={d <= phrase.difficulty ? 'text-sakura-400' : 'text-slate-700'}>●</span>
            ))}
          </div>
        </div>
      )}

      {/* Show Big Overlay */}
      {showBig && (
        <div
          onClick={() => setShowBig(false)}
          className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-8 cursor-pointer"
        >
          <p className="text-4xl font-bold text-white text-center leading-relaxed">{phrase.target}</p>
          <p className="text-lg text-sakura-300 mt-4 text-center">{phrase.pronunciation_chunks || phrase.pronunciation}</p>
          <p className="text-base text-slate-400 mt-2 text-center">{phrase.english}</p>
          <p className="text-base text-slate-500 mt-1 text-center">{phrase.chinese_tc}</p>
          <button
            onClick={(e) => { e.stopPropagation(); speak(phrase.target, getTtsLang(phrase.lang)); }}
            className="mt-6 text-4xl active:scale-110 transition-transform"
          >🔊</button>
          <p className="text-base text-slate-600 mt-8">Tap anywhere to close</p>
        </div>
      )}
    </div>
  );
}
