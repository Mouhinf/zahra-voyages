// src/app/admin/dashboard/api/export.ts
'use server';

import { adminGuardFromRequest } from '@/lib/guard';

export async function POST() {
  const isAdmin = adminGuardFromRequest(import.meta.request);
  if (!isAdmin) {
    return new Response(JSON.stringify({ error: 'Accès non autorisé' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  // Simulate CSV export of stats
  const summary = await import('@/lib/firebase').getAnalyticsSummary();
  const csv = `Date,Visits,Bookings,Revenue,UniqueVisitors,ConversionRate\n`;
  // For demo, produce a single line with total stats
  csv += `${new Date().toISOString().split('T')[0]},${summary.totalVisits},${summary.totalBookings},${summary.revenue},${summary.uniqueVisitors},${summary.conversionRate}\n`;
  return new Response(csv, {
    headers: { 'Content-Type': 'text/csv' },
  });
}