// Fix: Update to Firebase v9 modular syntax
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDRHqqgfR4mrkeFOcnU_LxjcTtdfaksaNA",
  authDomain: "skyon-bc49d.firebaseapp.com",
  databaseURL: "https://skyon-bc49d-default-rtdb.firebaseio.com",
  projectId: "skyon-bc49d",
  storageBucket: "skyon-bc49d.appspot.com",
  messagingSenderId: "714161476555",
  appId: "1:714161476555:web:716607c5271ec2e2769c4e",
  measurementId: "G-721GWE0EFM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Fix: Export auth and database instances initialized with v9 functions
export const auth = getAuth(app);
export const db = getDatabase(app);
