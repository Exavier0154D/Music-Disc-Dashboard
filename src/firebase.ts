import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
 
const firebaseConfig = {
  apiKey: "AIzaSyAzqdNEwFgvwHtNNbdNXwSAFmRN6ttkiPc",
  authDomain: "music-industry-dashboard.firebaseapp.com",
  projectId: "music-industry-dashboard",
  storageBucket: "music-industry-dashboard.firebasestorage.app",
  messagingSenderId: "360704066649",
  appId: "1:360704066649:web:593f1ece7864360eed9d48",
  measurementId: "G-9MYTN975L8"
};
 
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);