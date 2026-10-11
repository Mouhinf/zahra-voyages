/**
 * Client Cloudinary de l'administration.
 *
 * Sécurité : les uploads et suppressions transitent désormais par des routes
 * serveur protégées (vérification du token admin Firebase + validation du
 * fichier / du public_id). Les secrets Cloudinary et l'upload_preset public
 * ne sont plus utilisés côté client.
 */

async function getAdminIdToken(): Promise<string> {
  const { getAuthInstance } = await import('@/lib/firebase');
  const user = getAuthInstance().currentUser;
  if (!user) {
    throw new Error('Authentification administrateur requise');
  }
  return user.getIdToken();
}

export async function uploadImageToCloudinary(file: File): Promise<{ secure_url: string; public_id: string }> {
  const token = await getAdminIdToken();

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/cloudinary-upload', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!response.ok) {
    let message = 'Image upload failed';
    try {
      const json = await response.json();
      if (json?.error) message = json.error;
    } catch {
      // réponse non JSON — message par défaut
    }
    throw new Error(message);
  }

  const { secure_url, public_id } = await response.json();
  return { secure_url, public_id };
}

export async function deleteImageFromCloudinary(public_id: string): Promise<void> {
  if (!public_id) return;
  try {
    const token = await getAdminIdToken();
    await fetch('/api/cloudinary-delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ public_id }),
    });
  } catch (e) {
    console.error('Cloudinary delete failed:', e);
  }
}
