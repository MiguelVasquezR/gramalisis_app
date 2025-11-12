import { Timestamp, addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export type Entry = {
  id: string;
  text: string;
  summary: string;
  createdAt?: Date;
};

const userEntriesCollection = (uid: string) => collection(db, 'users', uid, 'entries');

export const createEntry = async (uid: string, text: string) => {
  const trimmedText = text.trim();
  if (!trimmedText) {
    throw new Error('El texto no puede estar vacío');
  }

  const summary = buildSummary(trimmedText);

  await addDoc(userEntriesCollection(uid), {
    uid,
    text: trimmedText,
    summary,
    createdAt: serverTimestamp(),
  });
};

export const subscribeToEntries = (uid: string, onChange: (entries: Entry[]) => void) => {
  const q = query(userEntriesCollection(uid), orderBy('createdAt', 'desc'));

  return onSnapshot(q, (snapshot) => {
    const nextEntries: Entry[] = snapshot.docs.map((docSnapshot) => {
      const data = docSnapshot.data() as {
        text: string;
        summary: string;
        createdAt?: Timestamp;
      };

      return {
        id: docSnapshot.id,
        text: data.text,
        summary: data.summary,
        createdAt: data.createdAt ? data.createdAt.toDate() : undefined,
      };
    });

    onChange(nextEntries);
  });
};

const buildSummary = (text: string) => {
  const words = text.split(/\s+/).filter(Boolean);
  const characters = text.replace(/\s/g, '').length;
  return `${words.length} palabras • ${characters} caracteres`;
};
