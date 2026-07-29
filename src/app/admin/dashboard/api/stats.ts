// src/app/admin/dashboard/api/stats.ts
'use server';

import { getAnalyticsSummary } from '@/lib/firebase';
import { verifyAdminToken, AuthError } from '@/lib/firebase-admin';

export async function GET(request: Request) {
  try {
    await verifyAdminToken(request);
    const summary = await getAnalyticsSummary();
    return new Response(JSON.stringify(summary), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: error.statusCode,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    console.error('Dashboard stats error:', error);
    return new Response(JSON.stringify({ error: 'Impossible de récupérer les statistiques' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}