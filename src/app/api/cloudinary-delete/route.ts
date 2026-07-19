import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const { public_id } = await request.json();
    if (!public_id) {
      return NextResponse.json({ error: 'public_id requis' }, { status: 400 });
    }
    const result = await cloudinary.uploader.destroy(public_id);
    return NextResponse.json({ result: result.result });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
  }
}
