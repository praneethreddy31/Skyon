import { User } from '../types';

// This is a mock service to simulate Firebase Authentication.
// In a real app, you would use the actual Firebase SDK.

const MOCK_USER_KEY = 'skyon_mock_user';

export const authService = {
  
  onAuthStateChanged: (callback: (user: User | null) => void): (() => void) => {
    // Simulate initial state check
    const userJson = localStorage.getItem(MOCK_USER_KEY);
    const user = userJson ? JSON.parse(userJson) : null;
    callback(user);

    // Simulate real-time updates (e.g., if another tab logs out)
    const handleStorageChange = () => {
      const newUserJson = localStorage.getItem(MOCK_USER_KEY);
      const newUser = newUserJson ? JSON.parse(newUserJson) : null;
      callback(newUser);
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Return unsubscribe function
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  },
  
  signInWithGoogle: async (): Promise<User> => {
    // Simulate a successful Google sign-in
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const existingUserJson = localStorage.getItem(MOCK_USER_KEY);
    if (existingUserJson) {
      return JSON.parse(existingUserJson);
    }

    const newUser: User = {
      uid: 'mock_user_123',
      email: 'resident@skyon.com',
      displayName: 'A. Resident',
      // block and flatNumber are missing to trigger profile completion
    };

    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(newUser));
    window.dispatchEvent(new Event('storage')); // Notify other components
    return newUser;
  },

  signOut: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    localStorage.removeItem(MOCK_USER_KEY);
    window.dispatchEvent(new Event('storage')); // Notify other components
  },
  
  updateUserProfile: async (profileData: Partial<User>): Promise<User> => {
     await new Promise(resolve => setTimeout(resolve, 500));
     const userJson = localStorage.getItem(MOCK_USER_KEY);
     if (!userJson) {
       throw new Error("No user is signed in.");
     }
     
     const currentUser = JSON.parse(userJson);
     const updatedUser = { ...currentUser, ...profileData };
     
     localStorage.setItem(MOCK_USER_KEY, JSON.stringify(updatedUser));
     window.dispatchEvent(new Event('storage')); // Notify other components
     
     return updatedUser;
  }

};
