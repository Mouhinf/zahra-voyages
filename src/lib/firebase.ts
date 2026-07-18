import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyD6jQBcC97mljSHrQU0JPjUxuT4TPrrGRw',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'slaac-voyages.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'slaac-voyages',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'slaac-voyages.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '1068036954211',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:1068036954211:web:857db1c86c589491220056',
};

let app: ReturnType<typeof initializeApp> | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

function initFirebase() {
  if (typeof window === 'undefined') return;
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
}

export function getAuthInstance(): Auth {
  if (!auth) initFirebase();
  return auth!;
}

export function getDbInstance(): Firestore {
  if (!db) initFirebase();
  return db!;
}
