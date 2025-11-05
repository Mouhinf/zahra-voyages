import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(request: Request) {
  const { public_id } = await request.json();

  if (!public_id) {
    return NextResponse.json({ error: 'public_id is required.' }, { status: 400 });
  }

  try {
    const result = await cloudinary.uploader.destroy(public_id);
    return NextResponse.json({ result });
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return NextResponse.json({ error: 'Deletion failed.' }, { status: 500 });
  }
}