import { initializeApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

/**
 * Configuration Firebase côté client (SDK web).
 *
 * ⚠️ Ces valeurs proviennent exclusivement de l'environnement
 * (variables NEXT_PUBLIC_FIREBASE_*) — aucun fallback codé en dur.
 * Les clés API web Firebase ne sont pas des secrets, mais elles
 * identifient le projet : elles doivent rester configurables et
 * ne pas être figées dans le code source.
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let appInstance: ReturnType<typeof initializeApp> | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;

function getAppInstance() {
  if (!appInstance) {
    appInstance = initializeApp(firebaseConfig);
  }
  return appInstance;
}

export function getAuthInstance() {
  if (!authInstance) authInstance = getAuth(getAppInstance());
  return authInstance;
}

export function getDbInstance() {
  if (!dbInstance) dbInstance = getFirestore(getAppInstance());
  return dbInstance;
}
