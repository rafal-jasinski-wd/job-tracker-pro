import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import type { Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Configuration validation
if (!firebaseConfig.apiKey && typeof window !== 'undefined') {
  console.warn(
    "🔥 Firebase Configuration Warning: VITE_FIREBASE_API_KEY is missing!\n" +
    "The app will load but database features will be disabled. Check your Netlify environment variables."
  );
}

let app;
let auth: Auth | undefined;
let googleProvider: GoogleAuthProvider | undefined;
let db: Firestore | undefined;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);

  // Initialize Auth
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();

  // Initialize Firestore
  db = getFirestore(app);
} catch (error) {
  console.error("🔥 Firebase Failed to Initialize:", error);
  // We export these as undefined so the rest of the app can handle the "Not Connected" state 
  // gracefully instead of crashing the whole browser bundle.
}

export { auth, googleProvider, db };
