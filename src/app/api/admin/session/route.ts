import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken, AuthError, ConfigError } from '@/lib/firebase-admin';

export const runtime = 'nodejs';

// ---------------------------------------------------------------------------
// Vérification de session administrateur (côté serveur).
// Utilisée par les layouts admin et useGuard() : un utilisateur authentifié
// sans rôle admin obtient 403 — impossible de contourner côté client.
// Un environnement mal configuré (clé de service absente) renvoie 503 avec
// un message explicite — jamais un 401 trompeur.
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const { uid, email } = await verifyAdminToken(request);
    return NextResponse.json({ ok: true, uid, email: email ?? null });
  } catch (error) {
    if (error instanceof ConfigError) {
      return NextResponse.json(
        { error: 'Administration non configurée sur ce serveur : ajoutez FIREBASE_SERVICE_ACCOUNT_KEY dans .env.local (local) ou dans les variables Vercel (production), puis redémarrez.' },
        { status: 503 }
      );
    }
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('Session check error:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
