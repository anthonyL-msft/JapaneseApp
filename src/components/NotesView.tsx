import { useState } from 'react';
import type { Phrase, UserNote } from '../data/types';

interface Props {
  phrases: Phrase[];
  notes: UserNote[];
  onSaveNote: (note: UserNote) => void;
  onDeleteNote: (id: string) => void;
}

export function NotesView({ phrases, notes, onSaveNote, onDeleteNote }: Props) {
  const [newNoteText, setNewNoteText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const phraseNotes = notes.filter(n => n.phraseId);
  const standaloneNotes = notes.filter(n => !n.phraseId);

  const handleSaveStandalone = () => {
    if (!newNoteText.trim()) return;
    const now = Date.now();
    if (editingId) {
      const existing = notes.find(n => n.id === editingId);
      onSaveNote({ id: editingId, text: newNoteText.trim(), createdAt: existing?.createdAt || now, updatedAt: now });
      setEditingId(null);
    } else {
      onSaveNote({ id: `sn_${now}`, text: newNoteText.trim(), createdAt: now, updatedAt: now });
    }
    setNewNoteText('');
  };

  return (
    <div className="scroll-area h-full">
      <div className="px-4 py-3 border-b border-slate-800">
        <h2 className="text-lg font-bold">📝 My Notes</h2>
        <p className="text-xs text-slate-400">{notes.length} total notes</p>
      </div>

      <div className="p-4 space-y-6">
        {/* Add standalone note */}
        <div>
          <h3 className="text-sm font-semibold text-slate-300 mb-2">Quick Note</h3>
          <p className="text-xs text-slate-500 mb-2">WiFi passwords, restaurant names, travel tips...</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={newNoteText}
              onChange={e => setNewNoteText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSaveStandalone()}
              placeholder="Add a note..."
              className="flex-1 bg-slate-800 text-sm text-slate-200 placeholder-slate-500 rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-sakura-400/50"
            />
            <button
              onClick={handleSaveStandalone}
              disabled={!newNoteText.trim()}
              className="bg-sakura-500/80 text-white text-sm px-4 py-2.5 rounded-xl disabled:opacity-30 active:bg-sakura-600 transition"
            >
              {editingId ? 'Update' : 'Add'}
            </button>
          </div>
        </div>

        {/* Standalone notes */}
        {standaloneNotes.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-2">📌 Personal Notes</h3>
            <div className="space-y-2">
              {standaloneNotes
                .sort((a, b) => b.updatedAt - a.updatedAt)
                .map(note => (
                  <div key={note.id} className="bg-slate-800/60 rounded-xl p-3 flex items-start gap-2">
                    <p className="text-base text-slate-200 flex-1">{note.text}</p>
                    <button
                      onClick={() => { setNewNoteText(note.text); setEditingId(note.id); }}
                      className="text-base text-slate-500 hover:text-slate-300 shrink-0"
                    >✏️</button>
                    <button
                      onClick={() => onDeleteNote(note.id)}
                      className="text-base text-slate-500 hover:text-red-400 shrink-0"
                    >🗑️</button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Phrase-attached notes */}
        {phraseNotes.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-2">💬 Phrase Notes</h3>
            <div className="space-y-2">
              {phraseNotes
                .sort((a, b) => b.updatedAt - a.updatedAt)
                .map(note => {
                  const phrase = phrases.find(p => p.id === note.phraseId);
                  return (
                    <div key={note.id} className="bg-slate-800/60 rounded-xl p-3">
                      {phrase && (
                        <p className="text-sm text-sakura-400 mb-1">
                          {phrase.target} · {phrase.pronunciation}
                        </p>
                      )}
                      <div className="flex items-start gap-2">
                        <p className="text-sm text-slate-300 flex-1">{note.text}</p>
                        <button
                          onClick={() => onDeleteNote(note.id)}
                          className="text-base text-slate-500 hover:text-red-400 shrink-0"
                        >🗑️</button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {notes.length === 0 && (
          <div className="text-center py-8">
            <p className="text-4xl mb-3">📝</p>
            <p className="text-slate-400 text-sm">No notes yet. Add quick notes above or tap any phrase to add remarks.</p>
          </div>
        )}
      </div>
    </div>
  );
}
