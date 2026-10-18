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

/**
 * Compte de service lu une seule fois. Une clé absente ou mal formée ne doit
 * pas faire échouer l'import de tout le module (toutes les routes API) :
 * elle est signalée et ignorée, et assertAdminConfigured() refuse alors
 * proprement au lieu de produire un 401 trompeur.
 */
function parseServiceAccount(): object | undefined {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!raw) return undefined;
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' && 'private_key' in parsed ? parsed : undefined;
  } catch {
    console.error("FIREBASE_SERVICE_ACCOUNT_KEY n'est pas un JSON valide : compte de service ignoré.");
    return undefined;
  }
}

const SERVICE_ACCOUNT = parseServiceAccount();

function getAdminApp() {
  if (getApps().length) {
    return getApps()[0];
  }

  // Sans compte de service : initialisation minimale.
  // - En local avec les émulateurs Firebase, ce mode fonctionne.
  // - En production (Vercel), FIREBASE_SERVICE_ACCOUNT_KEY est requis.
  return initializeApp(
    SERVICE_ACCOUNT
      ? { credential: cert(SERVICE_ACCOUNT as Parameters<typeof cert>[0]), projectId }
      : { projectId },
  );
}

/**
 * Vrai si le SDK Admin est réellement configuré (compte de service valide
 * OU émulateur Firestore détecté). En production sans clé, les écritures
 * Firestore échouent — les routes doivent renvoyer un 503 clair plutôt qu'un 500 opaque.
 */
export function isAdminConfigured(): boolean {
  return !!SERVICE_ACCOUNT || !!process.env.FIRESTORE_EMULATOR_HOST;
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

import {
  type AdminRole,
  type Permission,
  hasPermission,
  DEFAULT_ROLE_PERMISSIONS,
} from './rbac';

export class AuthError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
  }
}

export interface AdminSession {
  uid: string;
  email: string;
  role: AdminRole;
  permissions: readonly Permission[];
  customPermissions?: Permission[];
  isActive: boolean;
}

/**
 * Vérifie que la requête provient d'un utilisateur du back-office authentifié :
 * en-tête `Authorization: Bearer <Firebase ID token>` valide, non révoqué,
 * avec compte actif dans Firestore (`admin_users/{uid}`), custom claim, ou email autorisé.
 */
export async function verifyAdminToken(request: Request): Promise<AdminSession> {
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
    const uid = decodedToken.uid;

    let userRole: AdminRole | null = null;
    let customPerms: Permission[] | undefined = undefined;
    let isActive = true;

    // 1. Recherche du profil interne dans Firestore admin_users
    try {
      const { getFirestore } = await import('firebase-admin/firestore');
      const userDoc = await getFirestore(adminApp).collection('admin_users').doc(uid).get();
      if (userDoc.exists) {
        const data = userDoc.data();
        if (data) {
          if (data.isActive === false) {
            throw new AuthError('Compte désactivé. Veuillez contacter un Super Administrateur.', 403);
          }
          userRole = data.role as AdminRole;
          customPerms = data.customPermissions as Permission[];
          isActive = true;
        }
      }
    } catch (e) {
      if (e instanceof AuthError) throw e;
      // En l'absence de base accessible, repli sur les claims
    }

    // 2. Si aucun profil Firestore, vérification des custom claims ou fallback bootstrap ADMIN_EMAILS
    if (!userRole) {
      const isAdminEmail = !!decodedToken.email_verified && ADMIN_EMAILS.includes(email);
      if (decodedToken.role && typeof decodedToken.role === 'string') {
        userRole = decodedToken.role as AdminRole;
      } else if (decodedToken.admin === true || isAdminEmail) {
        userRole = 'SUPER_ADMIN';
      }
    }

    if (!userRole) {
      throw new AuthError('Rôle administrateur requis ou compte non autorisé', 403);
    }

    const perms = DEFAULT_ROLE_PERMISSIONS[userRole] || [];

    return {
      uid,
      email: decodedToken.email || email,
      role: userRole,
      permissions: perms,
      customPermissions: customPerms,
      isActive,
    };
  } catch (err) {
    if (err instanceof AuthError) throw err;
    throw new AuthError('Token invalide ou expiré', 401);
  }
}

/**
 * Exige une permission granulaire pour exécuter une action API.
 */
export async function requirePermission(request: Request, permission: Permission): Promise<AdminSession> {
  const session = await verifyAdminToken(request);
  if (!hasPermission(session.role, permission, session.customPermissions)) {
    throw new AuthError(`Permission insuffisante : requiert '${permission}'`, 403);
  }
  return session;
}

/**
 * Exige un des rôles autorisés pour accéder à une route API.
 */
export async function requireRole(request: Request, allowedRoles: AdminRole[]): Promise<AdminSession> {
  const session = await verifyAdminToken(request);
  if (!allowedRoles.includes(session.role) && session.role !== 'SUPER_ADMIN') {
    throw new AuthError('Accès restreint aux rôles autorisés', 403);
  }
  return session;
}

