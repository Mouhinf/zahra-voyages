import { verifyAdminToken, AuthError } from '@/lib/firebase-admin';
import { getAnalyticsSummary } from '@/lib/firebase';

export async function POST(request: Request) {
  try {
    await verifyAdminToken(request);

    const summary = await getAnalyticsSummary();
    const csv = [
      'Date,Visits,Bookings,Revenue,UniqueVisitors,ConversionRate',
      `${new Date().toISOString().split('T')[0]},${summary.totalVisits},${summary.totalBookings},${summary.revenue},${summary.uniqueVisitors},${summary.conversionRate}`,
    ].join('\n');

    return new Response(csv, {
      headers: { 'Content-Type': 'text/csv' },
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: error.statusCode,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    console.error('Erreur export:', error);
    return new Response(JSON.stringify({ error: 'Erreur lors de l\'export' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
