import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken, AuthError } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    await verifyAdminToken(request);

    const { public_id } = await request.json();
    if (!public_id) {
      return NextResponse.json({ error: 'public_id requis' }, { status: 400 });
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
