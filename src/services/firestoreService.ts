import {
  collection,
  addDoc,
  getDocs,
  Timestamp,
  doc,
  getDoc,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { UserInfo } from '../types';

// Generic function to fetch all documents from a collection
export const getCollection = async <T>(collectionName: string): Promise<T[]> => {
  const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
};

// Generic function to add a document to a collection
export const addDocument = async (collectionName: string, data: object, currentUser: UserInfo) => {
  return await addDoc(collection(db, collectionName), {
    ...data,
    createdBy: currentUser,
    createdAt: Timestamp.now(),
  });
};

// Specific function to fetch a single document by ID
export const getDocumentById = async <T>(collectionName: string, id: string): Promise<T | null> => {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
    } else {
        return null;
    }
}

// You can add more specific functions as needed, for example:
export const getRecentListings = async (count: number) => {
    const q = query(collection(db, 'listings'), orderBy('createdAt', 'desc'), limit(count));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
