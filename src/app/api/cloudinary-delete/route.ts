import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken, AuthError } from '@/lib/firebase-admin';
import { clientIpFromHeaders, rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

// ---------------------------------------------------------------------------
// Suppression d'images Cloudinary — route protégée.
//
// Avant correction : cette route était PUBLIQUE (aucune authentification) et
// permettait à quiconque de supprimer n'importe quelle image du compte.
// Désormais : token admin requis + validation stricte du format du public_id
// (anti-injection de chemin / IDs arbitraires) + rate limiting.
// ---------------------------------------------------------------------------

// public_id Cloudinary : segments alphanumériques séparés par "/" ou "_",
// sans traversal (".."), 200 caractères max.
const PUBLIC_ID_PATTERN = /^(?!.*\.\.)[A-Za-z0-9][A-Za-z0-9_\-/]{0,199}$/;

export async function POST(request: NextRequest) {
  try {
    await verifyAdminToken(request);

    const ip = clientIpFromHeaders(request.headers);
    if (!rateLimit('cloudinary-delete', ip, 30, 5 * 60 * 1000)) {
      return NextResponse.json({ error: 'Trop de requêtes, essayez plus tard' }, { status: 429 });
    }

    let public_id: unknown;
    try {
      const body = await request.json();
      public_id = body?.public_id;
    } catch {
      return NextResponse.json({ error: 'Corps de requête invalide' }, { status: 400 });
    }

    if (typeof public_id !== 'string' || !PUBLIC_ID_PATTERN.test(public_id)) {
      return NextResponse.json({ error: 'public_id invalide' }, { status: 400 });
    }

    const { v2: cloudinary } = await import('cloudinary');
    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const result = await cloudinary.uploader.destroy(public_id);
    return NextResponse.json({ result: result.result });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('Erreur suppression Cloudinary:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
  }
}
