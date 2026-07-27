// src/app/admin/dashboard/api/stats.ts
'use server';

import { getAnalyticsSummary } from '@/lib/firebase';

export async function GET() {
  try {
    const summary = await getAnalyticsSummary();
    return new Response(JSON.stringify(summary), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    return new Response('{"error": "Impossible de récupérer les statistiques"}', {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}