// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBFd8yZQu7aWJeMKNHAp415P80N1K0wNjY",
  authDomain: "aequitasai.firebaseapp.com",
  projectId: "aequitasai",
  storageBucket: "aequitasai.appspot.com",
  messagingSenderId: "862865793605",
  appId: "1:862865793605:web:d64e2f5a0352594e22f92c",
  measurementId: "G-VBL8RQBDPV",
  databaseURL: "https://aequitasai-default-rtdb.firebaseio.com"  // Add this line for Realtime Database
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getDatabase(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };
