import { useState } from 'react';
import type { Phrase, UserNote } from '../data/types';
import { speak, getTtsLang } from '../utils/tts';

interface Props {
  phrase: Phrase;
  isBookmarked: boolean;
  notes: UserNote[];
  expanded: boolean;
  onToggleExpand: () => void;
  onToggleBookmark: () => void;
  onSaveNote: (note: UserNote) => void;
  onDeleteNote: (id: string) => void;
}

export function PhraseCard({ phrase, isBookmarked, notes, expanded, onToggleExpand, onToggleBookmark, onSaveNote, onDeleteNote }: Props) {
  const [noteText, setNoteText] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    speak(phrase.target, getTtsLang(phrase.lang));
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
            <p className="text-base font-medium text-slate-50">{phrase.target}</p>
            <p className="text-sm text-sakura-300 mt-0.5">{phrase.pronunciation_chunks || phrase.pronunciation}</p>
            <p className="text-sm text-slate-400 mt-0.5">{phrase.english}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={handleSpeak} className="p-2 rounded-lg active:bg-slate-600 text-lg" title="Play pronunciation">
              🔊
            </button>
            <button onClick={(e) => { e.stopPropagation(); onToggleBookmark(); }} className="p-2 rounded-lg active:bg-slate-600 text-lg">
              {isBookmarked ? '⭐' : '☆'}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="px-3 pb-3 border-t border-slate-700/50 space-y-3">
          {phrase.pronunciation_chunks && (
            <div className="mt-3 bg-indigo-900/20 border border-indigo-700/30 rounded-lg p-2">
              <span className="text-slate-500 text-xs">Pronunciation</span>
              <p className="text-base text-indigo-300 font-mono tracking-wide">{phrase.pronunciation_chunks}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
            {phrase.romanization && (
              <div>
                <span className="text-slate-500 text-xs">Reading</span>
                <p className="text-slate-200">{phrase.romanization}</p>
              </div>
            )}
            <div>
              <span className="text-slate-500 text-xs">繁體中文</span>
              <p className="text-slate-200">{phrase.chinese_tc}</p>
            </div>
          </div>

          {phrase.native_hint && (
            <div className="bg-amber-900/20 border border-amber-700/30 rounded-lg p-2">
              <p className="text-xs text-amber-400">🌉 {phrase.native_hint}</p>
            </div>
          )}

          {phrase.notes && (
            <div className="bg-slate-700/30 rounded-lg p-2">
              <p className="text-xs text-slate-300">💡 {phrase.notes}</p>
            </div>
          )}

          {/* User notes */}
          {notes.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs text-slate-500">Your notes:</p>
              {notes.map(n => (
                <div key={n.id} className="flex items-start gap-2 bg-slate-700/20 rounded-lg p-2">
                  <p className="text-xs text-slate-300 flex-1">{n.text}</p>
                  <button
                    onClick={() => { setNoteText(n.text); setEditingNoteId(n.id); }}
                    className="text-xs text-slate-500 hover:text-slate-300"
                  >✏️</button>
                  <button
                    onClick={() => onDeleteNote(n.id)}
                    className="text-xs text-slate-500 hover:text-red-400"
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
              className="flex-1 bg-slate-700/50 text-sm text-slate-200 placeholder-slate-500 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-sakura-400/50"
            />
            <button
              onClick={handleSaveNote}
              disabled={!noteText.trim()}
              className="bg-sakura-500/80 text-white text-sm px-3 py-2 rounded-lg disabled:opacity-30 active:bg-sakura-600 transition"
            >
              {editingNoteId ? 'Update' : 'Save'}
            </button>
          </div>

          {/* Difficulty indicator */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Difficulty:</span>
            {[1, 2, 3].map(d => (
              <span key={d} className={d <= phrase.difficulty ? 'text-sakura-400' : 'text-slate-700'}>●</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
