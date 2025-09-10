
import {
  ref,
  get,
  push,
  set,
  serverTimestamp,
  update,
  remove,
  DataSnapshot,
} from 'firebase/database';
// AFTER
import { db } from "../firebaseConfig";
import { UserInfo } from './types';

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

export const getCollection = async <T>(path: string): Promise<T[]> => {
  const dbRef = ref(db, path);
  const snapshot = await get(dbRef);
  const asArray = snapshotToArray<T>(snapshot);
  return asArray.sort((a, b) => (b as any).createdAt - (a as any).createdAt);
};

export const addDocument = async (path: string, data: object, owner: UserInfo) => {
  const collectionRef = ref(db, path);
  const newDocRef = push(collectionRef);
  return await set(newDocRef, {
    ...data,
    owner: owner,
    createdAt: serverTimestamp(),
  });
};

export const getDocumentById = async <T>(path: string, id: string): Promise<T | null> => {
    const docRef = ref(db, `${path}/${id}`);
    const snapshot = await get(docRef);
    if (snapshot.exists()) {
        return { id: snapshot.key, ...snapshot.val() } as T;
    }
    return null;
}

export const updateDocument = async (path: string, id: string, data: object) => {
    const docRef = ref(db, `${path}/${id}`);
    return await update(docRef, data);
};

export const deleteDocument = async (path: string, id: string) => {
    const docRef = ref(db, `${path}/${id}`);
    return await remove(docRef);
};
