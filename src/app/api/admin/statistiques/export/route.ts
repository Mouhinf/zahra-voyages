import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken, AuthError } from '@/lib/firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { adminApp } from '@/lib/firebase-admin';
import { getDakarDate } from '@/lib/analytics';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    await verifyAdminToken(req);
    const { searchParams } = new URL(req.url);
    const days = Math.min(Math.max(parseInt(searchParams.get('days') || '30', 10), 1), 365);
    const format = searchParams.get('format') || 'csv';

    const db = getFirestore(adminApp);
    const now = new Date();
    const dates: string[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      dates.push(getDakarDate(d));
    }

    const refs = dates.map((date) => db.collection('analyticsDaily').doc(date));
    const snaps = await db.getAll(...refs);

    const rows = dates.map((date, idx) => {
      const data = snaps[idx].exists ? snaps[idx].data() || {} : {};
      return {
        date,
        pageViews: Number(data.pageViews || 0),
        uniqueSessions: Number(data.uniqueSessions || data.pageViews || 0),
        ctaClicks: Number(data.ctaClicks || 0),
        whatsappClicks: Number(data.whatsappClicks || 0),
        quoteStarts: Number(data.quoteStarts || 0),
      };
    });

    if (format === 'json') {
      return NextResponse.json(rows);
    }

    // Export CSV
    const csvHeader = 'Date,Pages_Vues,Sessions_Uniques,Clics_CTA,Clics_WhatsApp,Ouvertures_Formulaire\n';
    const csvLines = rows
      .map(
        (r) =>
          `${r.date},${r.pageViews},${r.uniqueSessions},${r.ctaClicks},${r.whatsappClicks},${r.quoteStarts}`
      )
      .join('\n');

    const csvContent = csvHeader + csvLines;

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="slaac-voyages-statistiques-${getDakarDate()}.csv"`,
      },
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('Erreur export statistiques:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
