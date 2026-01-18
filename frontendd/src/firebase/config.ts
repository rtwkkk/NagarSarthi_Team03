// Firebase Configuration for Nagar Sarthi
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
// Replace these with your actual Firebase project credentials
const firebaseConfig = {
  apiKey: "AIzaSyBtz-ffsUwNmAKBZBHp5HbS_1dfubTHBJg",

  authDomain: "nagar-alert-app.firebaseapp.com",

  projectId: "nagar-alert-app",

  storageBucket: "nagar-alert-app.firebasestorage.app",

  messagingSenderId: "1001892553814",

  appId: "1:1001892553814:web:d3c774ca037b2f5c6447f7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;