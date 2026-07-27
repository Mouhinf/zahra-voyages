// src/app/admin/dashboard/api/seed.ts
'use server';

import { adminGuard } from '@/lib/guard';
import { seedDashboard } from '@/lib/firebase';

export async function POST() {
  // Guarde d'accès : seulement l'administrateur
  const isAdmin = adminGuard();
  if (!isAdmin) {
    return new Response(JSON.stringify({ error: 'Accès non autorisé' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  try {
    await seedDashboard();
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Erreur lors du seed:', err);
    return new Response(JSON.stringify({ error: 'Échec du seed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}