import { useState } from 'react';
import { Pencil, Trash2, X } from 'lucide-react';
import type { UserNote } from '../data/types';

interface Props {
  notes: UserNote[];
  onSaveNote: (note: UserNote) => void;
  onDeleteNote: (id: string) => void;
}

export function QuickNote({ notes, onSaveNote, onDeleteNote }: Props) {
  const [text, setText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const standaloneNotes = notes
    .filter(n => !n.phraseId && !n.text.startsWith('🤖'))
    .sort((a, b) => b.updatedAt - a.updatedAt);

  const handleAdd = () => {
    if (!text.trim()) return;
    const now = Date.now();
    onSaveNote({ id: `sn_${now}`, text: text.trim(), createdAt: now, updatedAt: now });
    setText('');
  };

  const handleSaveEdit = () => {
    if (!editText.trim() || !editingId) return;
    const now = Date.now();
    const existing = notes.find(n => n.id === editingId);
    onSaveNote({ id: editingId, text: editText.trim(), createdAt: existing?.createdAt || now, updatedAt: now });
    setEditingId(null);
    setEditText('');
  };

  return (
    <div className="scroll-area h-full">
      <div className="px-4 py-3 border-b border-slate-800">
        <h2 className="text-lg font-bold">Quick Note</h2>
        <p className="text-base text-slate-400">WiFi passwords, restaurant names, reminders</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
            placeholder="Type a note..."
            className="flex-1 bg-slate-800 text-slate-100 placeholder-slate-500 rounded-xl px-4 py-3 text-base outline-none focus:ring-2 focus:ring-sakura-400/50 transition"
          />
          <button
            onClick={handleAdd}
            disabled={!text.trim()}
            className="bg-sakura-500/80 text-white px-4 py-3 rounded-xl text-base font-medium disabled:opacity-30 active:bg-sakura-600 transition shrink-0"
          >
            Add
          </button>
        </div>

        {/* Notes list */}
        {standaloneNotes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-4xl mb-3">📝</p>
            <p className="text-base text-slate-500">No notes yet. Add one above!</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {standaloneNotes.map(note => (
              <div key={note.id} className="bg-slate-700/40 rounded-xl p-3">
                {editingId === note.id ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleSaveEdit(); if (e.key === 'Escape') setEditingId(null); }}
                      className="flex-1 bg-slate-700/50 text-base text-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-sakura-400/50"
                      autoFocus
                    />
                    <button onClick={handleSaveEdit} className="text-base text-emerald-400 px-2">Save</button>
                    <button onClick={() => setEditingId(null)} className="text-base text-slate-500 px-2"><X size={16} /></button>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-base text-slate-200 flex-1">{note.text}</p>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => { setEditingId(note.id); setEditText(note.text); }}
                        className="p-1 rounded-lg active:bg-slate-600 text-base text-slate-500"
                      ><Pencil size={14} /></button>
                      <button
                        onClick={() => onDeleteNote(note.id)}
                        className="p-1 rounded-lg active:bg-slate-600 text-base text-slate-500"
                      ><Trash2 size={14} /></button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
