export async function uploadImageToCloudinary(file: File): Promise<{ secure_url: string; public_id: string }> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Image upload failed');
  }

  const { secure_url, public_id } = await response.json();
  return { secure_url, public_id };
}

export async function deleteImageFromCloudinary(public_id: string): Promise<void> {
  if (!public_id) return;
  try {
    await fetch('/api/cloudinary-delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ public_id }),
    });
  } catch (e) {
    console.error('Cloudinary delete failed:', e);
  }
}
