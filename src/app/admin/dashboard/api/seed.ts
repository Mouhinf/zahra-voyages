import { verifyAdminToken, AuthError } from '@/lib/firebase-admin';
import { seedDashboard } from '@/lib/firebase';

export async function POST(request: Request) {
  try {
    await verifyAdminToken(request);

    await seedDashboard();
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: error.statusCode,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    console.error('Erreur lors du seed:', error);
    return new Response(JSON.stringify({ error: 'Échec du seed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
