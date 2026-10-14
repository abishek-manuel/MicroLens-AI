import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD1NIpVC7xFCX3GIPmsrTDPbhaa3vXoVoU",
  authDomain: "microlens-97f0e.firebaseapp.com",
  projectId: "microlens-97f0e",
  storageBucket: "microlens-97f0e.firebasestorage.app",
  messagingSenderId: "627357095270",
  appId: "1:627357095270:web:ad5ffe28b27c421077a4a7",
  measurementId: "G-4CCM46FTT0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
