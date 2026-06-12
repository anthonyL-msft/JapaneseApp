import { openDB } from 'idb';
import type { IDBPDatabase } from 'idb';
import type { UserNote, Bookmark, SRSCard, RefBookmark, LearnedItem } from '../data/types';

const DB_NAME = 'nihongo-travel';
const DB_VERSION = 3;

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('bookmarks')) {
          db.createObjectStore('bookmarks', { keyPath: 'phraseId' });
        }
        if (!db.objectStoreNames.contains('notes')) {
          const noteStore = db.createObjectStore('notes', { keyPath: 'id' });
          noteStore.createIndex('phraseId', 'phraseId');
        }
        if (!db.objectStoreNames.contains('srs')) {
          db.createObjectStore('srs', { keyPath: 'phraseId' });
        }
        if (!db.objectStoreNames.contains('ref-bookmarks')) {
          db.createObjectStore('ref-bookmarks', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('learned')) {
          db.createObjectStore('learned', { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

// Bookmarks
export async function getBookmarks(): Promise<Bookmark[]> {
  const db = await getDB();
  return db.getAll('bookmarks');
}

export async function addBookmark(phraseId: string): Promise<void> {
  const db = await getDB();
  await db.put('bookmarks', { phraseId, createdAt: Date.now() });
}

export async function removeBookmark(phraseId: string): Promise<void> {
  const db = await getDB();
  await db.delete('bookmarks', phraseId);
}

export async function isBookmarked(phraseId: string): Promise<boolean> {
  const db = await getDB();
  const bm = await db.get('bookmarks', phraseId);
  return !!bm;
}

// Notes
export async function getNotes(): Promise<UserNote[]> {
  const db = await getDB();
  return db.getAll('notes');
}

export async function getNotesForPhrase(phraseId: string): Promise<UserNote[]> {
  const db = await getDB();
  const idx = db.transaction('notes').store.index('phraseId');
  return idx.getAll(phraseId);
}

export async function saveNote(note: UserNote): Promise<void> {
  const db = await getDB();
  await db.put('notes', note);
}

export async function deleteNote(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('notes', id);
}

// SRS Cards
export async function getSRSCards(): Promise<SRSCard[]> {
  const db = await getDB();
  return db.getAll('srs');
}

export async function saveSRSCard(card: SRSCard): Promise<void> {
  const db = await getDB();
  await db.put('srs', card);
}

export async function getSRSCard(phraseId: string): Promise<SRSCard | undefined> {
  const db = await getDB();
  return db.get('srs', phraseId);
}

// Ref Bookmarks
export async function getRefBookmarks(): Promise<RefBookmark[]> {
  const db = await getDB();
  return db.getAll('ref-bookmarks');
}

export async function addRefBookmark(item: RefBookmark): Promise<void> {
  const db = await getDB();
  await db.put('ref-bookmarks', item);
}

export async function removeRefBookmark(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('ref-bookmarks', id);
}

// Learned Items
export async function getLearnedItems(): Promise<LearnedItem[]> {
  const db = await getDB();
  return db.getAll('learned');
}

export async function addLearnedItem(id: string): Promise<void> {
  const db = await getDB();
  await db.put('learned', { id, createdAt: Date.now() });
}

export async function removeLearnedItem(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('learned', id);
}
