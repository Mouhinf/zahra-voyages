import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken, AuthError } from '@/lib/firebase-admin';
import { clientIpFromHeaders, rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

// ---------------------------------------------------------------------------
// Upload d'images Cloudinary — route protégée.
//
// Remplace l'upload direct non signé (upload_preset public) : le fichier
// transite par le serveur, qui vérifie l'authentification admin, le type
// MIME, la taille, puis transmet à Cloudinary avec les secrets (jamais
// exposés au client).
// ---------------------------------------------------------------------------

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 Mo
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
]);

export async function POST(request: NextRequest) {
  try {
    await verifyAdminToken(request);

    // Anti-abus : 30 uploads / 5 min / IP (par instance).
    const ip = clientIpFromHeaders(request.headers);
    if (!rateLimit('cloudinary-upload', ip, 30, 5 * 60 * 1000)) {
      return NextResponse.json({ error: 'Trop de requêtes, essayez plus tard' }, { status: 429 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'Fichier manquant' }, { status: 400 });
    }

    // Double validation : type MIME déclaré et signature d'extension.
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json({ error: `Type de fichier non autorisé (${file.type || 'inconnu'}). Formats acceptés : JPEG, PNG, WebP, AVIF.` }, { status: 415 });
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: 'Fichier trop volumineux (5 Mo maximum)' }, { status: 413 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Vérification basique de l'en-tête binaire (magic numbers) pour les
    // formats autorisés — évite d'uploader un fichier déguisé.
    const isJpeg = buffer.length > 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    const isPng = buffer.length > 8 && buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
    const isWebp = buffer.length > 12 && buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP';
    const isAvif = buffer.length > 12 && buffer.subarray(4, 8).toString('ascii') === 'ftyp' && buffer.subarray(8, 12).toString('ascii').includes('av');
    if (!isJpeg && !isPng && !isWebp && !isAvif) {
      return NextResponse.json({ error: 'Contenu de fichier invalide ou format non reconnu' }, { status: 415 });
    }

    const { v2: cloudinary } = await import('cloudinary');
    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'slaac-voyages', resource_type: 'image' },
        (error, result) => {
          if (error || !result) reject(error || new Error('Upload Cloudinary échoué'));
          else resolve({ secure_url: result.secure_url, public_id: result.public_id });
        },
      );
      stream.end(buffer);
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('Erreur upload Cloudinary:', error);
    return NextResponse.json({ error: 'Erreur lors de l\'upload' }, { status: 500 });
  }
}
