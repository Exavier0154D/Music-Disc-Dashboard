import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCq3Sw1RSwKsF37tcMX71JC6UaxXhDo29c",
  authDomain: "music-sales-dashboard.firebaseapp.com",
  databaseURL: "https://music-sales-dashboard-default-rtdb.firebaseio.com",
  projectId: "music-sales-dashboard",
  storageBucket: "music-sales-dashboard.firebasestorage.app",
  messagingSenderId: "829002084670",
  appId: "1:829002084670:web:b10346eb416c4c24693c6f"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);