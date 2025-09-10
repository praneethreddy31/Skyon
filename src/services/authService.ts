// src/services/authService.ts

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
    return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // User is signed in, get their profile from our Realtime Database
        const userProfile = await authService.getUserProfile(firebaseUser.uid);

        if (userProfile) {
          // If a profile exists, combine it with the live email from Firebase Auth
          // This ensures the email is never missing.
          const combinedUser = {
            ...userProfile, // Profile data from DB (block, flatNumber, etc.)
            uid: firebaseUser.uid,
            email: firebaseUser.email, // ALWAYS use the email from the auth provider
          };
          callback(combinedUser);
        } else {
          // This happens right after sign-up, before a profile is created in our DB.
          // We create a temporary user object to proceed to the profile page.
          callback({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            block: undefined, // Explicitly undefined
            flatNumber: undefined, // Explicitly undefined
          });
        }
      } else {
        // User is signed out
        callback(null);
      }
    });
  },

  signInWithGoogle: async (): Promise<FirebaseUser> => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    if (!result.user) {
      throw new Error("Sign in failed: no user returned.");
    }
    return result.user;
  },

  signOut: async (): Promise<void> => {
    await firebaseSignOut(auth);
  },

  // This is used for NEW users completing their profile for the first time
  createUserProfile: async (
    user: { uid: string; email: string | null },
    profileData: { displayName: string | null; block: string; flatNumber: string }
  ): Promise<void> => {
    const userRef = ref(db, `users/${user.uid}`);
    await set(userRef, {
      email: user.email, // Make sure email is saved on creation
      ...profileData,
    });
  },

  // This is used for EXISTING users updating their profile
  updateUserProfile: async (
    uid: string,
    profileData: { displayName: string; block: string; flatNumber: string }
  ): Promise<void> => {
    const userRef = ref(db, `users/${uid}`);
    // "update" only changes the fields provided, it doesn't delete others
    await update(userRef, profileData);
  },

  getUserProfile: async (uid: string): Promise<User | null> => {
     const userRef = ref(db, `users/${uid}`);
     const snapshot = await get(userRef);
     if(snapshot.exists()) {
       return { uid, ...snapshot.val() } as User;
     }
     return null;
  }
};