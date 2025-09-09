// Fix: Use Firebase v9 modular syntax
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  User as FirebaseUser,
} from 'firebase/auth';
import { ref, set, get, update } from 'firebase/database';
import { auth, db } from '../firebaseConfig';
import { User } from '../types';

export const authService = {
  onAuthStateChanged: (callback: (user: User | null) => void): (() => void) => {
    // Fix: Use v9 onAuthStateChanged method
    return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // User is signed in, get their profile from Realtime Database
        const userProfile = await authService.getUserProfile(firebaseUser.uid);
        if (userProfile) {
          callback(userProfile);
        } else {
          // This case happens right after sign-up, before profile is created.
          callback({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
          });
        }
      } else {
        // User is signed out
        callback(null);
      }
    });
  },

  signInWithGoogle: async (): Promise<FirebaseUser> => {
    // Fix: Use v9 GoogleAuthProvider and signInWithPopup
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    if (!result.user) {
      throw new Error("Sign in failed: no user returned.");
    }
    return result.user;
  },

  signOut: async (): Promise<void> => {
    // Fix: Use v9 signOut method
    await firebaseSignOut(auth);
  },

  createUserProfile: async (
    // Fix: Adjusted type to match what's available in ProfilePage
    user: { uid: string; email: string | null },
    profileData: { displayName: string | null; block: string; flatNumber: string }
  ): Promise<void> => {
    // Fix: Use v9 Realtime Database syntax
    const userRef = ref(db, `users/${user.uid}`);
    await set(userRef, {
      email: user.email,
      ...profileData,
    });
  },

  updateUserProfile: async (
    uid: string,
    profileData: { displayName: string; block: string; flatNumber: string }
  ): Promise<void> => {
    // Fix: Use v9 Realtime Database syntax with `update` to avoid deleting existing data
    const userRef = ref(db, `users/${uid}`);
    await update(userRef, profileData);
  },

  getUserProfile: async (uid: string): Promise<User | null> => {
    // Fix: Use v9 Realtime Database syntax
     const userRef = ref(db, `users/${uid}`);
     const snapshot = await get(userRef);
     if(snapshot.exists()) {
       return { uid, ...snapshot.val() } as User;
     }
     return null;
  }
};
