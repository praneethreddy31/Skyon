// Fix: Use Firebase v9 modular syntax
import {
  ref,
  get,
  push,
  set,
  serverTimestamp,
  DataSnapshot,
} from 'firebase/database';
import { db } from '../firebaseConfig';
import { UserInfo } from '../types';

// Helper to convert snapshot object to array
const snapshotToArray = <T>(snapshot: DataSnapshot): T[] => {
    const data = snapshot.val();
    if (data) {
        return Object.keys(data).map(key => ({
            id: key,
            ...data[key]
        }));
    }
    return [];
}

// Generic function to fetch all documents from a collection path
export const getCollection = async <T>(path: string): Promise<T[]> => {
  // Fix: Use v9 ref() and get()
  const dbRef = ref(db, path);
  const snapshot = await get(dbRef);
  return snapshotToArray<T>(snapshot);
};

// Generic function to add a document to a collection path
export const addDocument = async (path: string, data: object, currentUser: UserInfo) => {
  const collectionRef = ref(db, path);
  // Fix: use v9 push()
  const newDocRef = push(collectionRef);
  // Fix: use v9 set() and serverTimestamp()
  return await set(newDocRef, {
    ...data,
    createdBy: currentUser,
    createdAt: serverTimestamp(),
  });
};

// Specific function to fetch a single document by ID
export const getDocumentById = async <T>(path: string, id: string): Promise<T | null> => {
    // Fix: Use v9 ref() and get()
    const docRef = ref(db, `${path}/${id}`);
    const snapshot = await get(docRef);

    if (snapshot.exists()) {
        return { id: snapshot.key, ...snapshot.val() } as T;
    } else {
        return null;
    }
}
