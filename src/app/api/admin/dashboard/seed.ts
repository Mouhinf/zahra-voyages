import { verifyAdminToken, AuthError } from '@/lib/firebase-admin';
import { seedDashboard } from '@/lib/admin-db';

export const runtime = 'nodejs';

/**
 * ⚠️ Écrit des données de TEST dans les collections réelles.
 * Exige une confirmation explicite dans le corps de la requête
 * (`{ "confirm": true }`) pour éviter tout déclenchement accidentel.
 */
export async function POST(request: Request) {
  try {
    await verifyAdminToken(request);

    let confirm = false;
    try {
      const body = await request.json();
      confirm = body?.confirm === true;
    } catch {
      confirm = false;
    }
    if (!confirm) {
      return new Response(JSON.stringify({ error: 'Confirmation explicite requise ({ "confirm": true })' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

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
