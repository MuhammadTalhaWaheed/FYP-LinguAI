// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getDatabase, ref, set } from 'firebase/database';  // Correct import for Realtime Database

const firebaseConfig = {
  apiKey: "AIzaSyAz5l_N81gYP4uh9gJBU0VxL5KfUrT-GbQ",
  authDomain: "linguaai-ab6ae.firebaseapp.com",
  projectId: "linguaai-ab6ae",
  storageBucket: "linguaai-ab6ae.firebasestorage.app",
  messagingSenderId: "596304930103",
  appId: "1:596304930103:web:74ee12acb9458ae4db26b2",
  measurementId: "G-QPN2XF4QG5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getDatabase(app); // Initialize database

export { auth, storage, db, createUserWithEmailAndPassword, updateProfile, ref, set }; // Export functions properly
