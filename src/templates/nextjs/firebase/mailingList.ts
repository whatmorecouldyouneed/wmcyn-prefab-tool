import { db } from './config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function addToMailingList(email: string) {
  try {
    await addDoc(collection(db, 'mailingList'), {
      email,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error adding to mailing list:', error);
    throw error;
  }
} 