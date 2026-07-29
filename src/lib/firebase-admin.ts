import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'slaac-voyages';

function getAdminApp() {
  if (getApps().length) {
    return getApps()[0];
  }

  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    : undefined;

  return initializeApp(
    serviceAccount
      ? { credential: cert(serviceAccount), projectId }
      : { projectId },
  );
}

export const adminApp = getAdminApp();
export const adminAuth = getAuth(adminApp);

const ADMIN_EMAIL = 'mouhopap@gmail.com';

export class AuthError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
  }
}

export async function verifyAdminToken(request: Request): Promise<{ uid: string }> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new AuthError('Token manquant', 401);
  }

  const idToken = authHeader.substring(7);
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    if (decodedToken.admin || decodedToken.email === ADMIN_EMAIL) {
      return { uid: decodedToken.uid };
    }

    throw new AuthError('Rôle admin requis', 403);
  } catch (err) {
    if (err instanceof AuthError) throw err;
    throw new AuthError('Token invalide ou expiré', 401);
  }
}
