// src/firebaseConfig.ts

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB-IwB0QI1pb_ndQi5GMANOWNBuSz0bEZw",
  authDomain: "skyon-app-us.firebaseapp.com",
  databaseURL: "https://skyon-app-us-default-rtdb.firebaseio.com",
  projectId: "skyon-app-us",
  storageBucket: "skyon-app-us.firebasestorage.app",
  messagingSenderId: "373148612723",
  appId: "1:373148612723:web:2bf25d7b59291ae8959206",
  measurementId: "G-QWQQF5RBMJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);