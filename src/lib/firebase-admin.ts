import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'slaac-voyages';

/**
 * Emails considérés comme administrateurs : variable d'environnement ADMIN_EMAILS
 * (séparés par des virgules). L'email doit être vérifié dans Firebase Auth.
 * Le mécanisme recommandé reste le custom claim `admin: true`
 * (voir scripts/set-admin-claim.mjs).
 */
const ADMIN_EMAILS: string[] = (process.env.ADMIN_EMAILS || 'mouhopap@gmail.com')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

function getAdminApp() {
  if (getApps().length) {
    return getApps()[0];
  }

  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    : undefined;

  // Sans clé de service explicite : initialisation minimale.
  // - En local avec les émulateurs Firebase (FIREBASE_AUTH_EMULATOR_HOST /
  //   FIRESTORE_EMULATOR_HOST), ce mode fonctionne.
  // - En production (Vercel), FIREBASE_SERVICE_ACCOUNT_KEY est requis :
  //   verifyIdToken() échouera sinon avec une erreur explicite.
  return initializeApp(
    serviceAccount
      ? { credential: cert(serviceAccount), projectId }
      : { projectId },
  );
}

/**
 * Vrai si le SDK Admin est réellement configuré (compte de service présent
 * OU émulateur Firestore détecté). En production sans clé, les écritures
 * Firestore échouent — les routes publiques doivent renvoyer un 503 clair
 * plutôt qu'un 500 opaque.
 */
export function isAdminConfigured(): boolean {
  return (
    !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY ||
    !!process.env.FIRESTORE_EMULATOR_HOST
  );
}

/** Erreur de configuration serveur — distinguée des erreurs d'auth. */
export class ConfigError extends Error {
  constructor(message: string, public statusCode = 503) {
    super(message);
  }
}

/** Lève ConfigError si le SDK Admin n'est pas utilisable dans cet environnement. */
export function assertAdminConfigured(): void {
  if (!isAdminConfigured()) {
    throw new ConfigError(
      'Service non configuré : FIREBASE_SERVICE_ACCOUNT_KEY est manquant (voir .env.example — Configuration Vercel)',
    );
  }
}

export const adminApp = getAdminApp();
export const adminAuth = getAuth(adminApp);

export class AuthError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
  }
}

/**
 * Vérifie que la requête provient d'un administrateur authentifié :
 * en-tête `Authorization: Bearer <Firebase ID token>` valide, non révoqué,
 * avec custom claim `admin: true` OU email vérifié présent dans ADMIN_EMAILS.
 */
export async function verifyAdminToken(request: Request): Promise<{ uid: string; email?: string }> {
  // Sans clé de compte de service (et sans émulateur), la vérification est
  // impossible : lever 503 explicite plutôt qu'un 401 trompeur qui fait
  // croire à un mauvais mot de passe.
  assertAdminConfigured();

  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new AuthError('Token manquant', 401);
  }

  const idToken = authHeader.substring(7);
  try {
    // `true` : vérifie également que le token n'a pas été révoqué
    // (déconnexion / changement de mot de passe).
    const decodedToken = await adminAuth.verifyIdToken(idToken, true);

    const email = (decodedToken.email || '').toLowerCase();
    const isAdminEmail =
      !!decodedToken.email_verified && ADMIN_EMAILS.includes(email);

    if (decodedToken.admin === true || isAdminEmail) {
      return { uid: decodedToken.uid, email: decodedToken.email };
    }

    throw new AuthError('Rôle admin requis', 403);
  } catch (err) {
    if (err instanceof AuthError) throw err;
    throw new AuthError('Token invalide ou expiré', 401);
  }
}
