import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken, AuthError } from '@/lib/firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { adminApp } from '@/lib/firebase-admin';
import { crmOverview } from '@/lib/crm';
import { totalVisits, topPagesDetailed, topSourcesDetailed, analyticsPerDay } from '@/lib/admin-db';

export const runtime = 'nodejs';

// ---------------------------------------------------------------------------
// Tableau de bord admin — vue d'ensemble sur DONNÉES RÉELLES.
//
// Remplace les indicateurs fictifs (réservations / chiffre d'affaires issus
// du seed de test) :
//   - prospects et demandes par statut CRM (quotes + contacts)
//   - demandes non traitées (> 48 h en statut Nouveau)
//   - services les plus demandés (agrégation réelle du champ service)
//   - offres publiées par module (champ disponible !== false)
//   - visites réelles (collection analytics) + pages/sources + 30 jours
//   - évolution des demandes commerciales sur 30 jours
// ---------------------------------------------------------------------------

const CATALOG_COLLECTIONS = [
  { key: 'destinations', label: 'Destinations' },
  { key: 'hebergements', label: 'Hébergements' },
  { key: 'transports', label: 'Transports' },
  { key: 'voyagesCroisieres', label: 'Voyages & Croisières' },
  { key: 'excursions', label: 'Excursions & circuits' },
  { key: 'offresAffaires', label: 'Tourisme' },
  { key: 'partenaires', label: 'Partenaires' },
] as const;

export async function GET(req: NextRequest) {
  try {
    await verifyAdminToken(req);
    const db = getFirestore(adminApp);

    const [crm, visits, pages, sources, analyticsPerDayVal, ...catalogCounts] = await Promise.all([
      crmOverview(),
      totalVisits(),
      topPagesDetailed(),
      topSourcesDetailed(),
      analyticsPerDay(),
      ...CATALOG_COLLECTIONS.map(async (c) => {
        // Offres PUBLIÉES uniquement (disponible !== false).
        // Un `where('disponible', '!=', false)` exclurait les anciens documents
        // sans ce champ (Firestore ignore les champs absents dans un `!=`) :
        // on compte donc le total puis on retire les masqués explicites.
        const [total, hidden] = await Promise.all([
          db.collection(c.key).count().get(),
          db.collection(c.key).where('disponible', '==', false).count().get(),
        ]);
        return { key: c.key, label: c.label, published: total.data().count - hidden.data().count };
      }),
    ]);

    // Évolution sur 30 jours — demandes commerciales (devis + messages).
    const perDayMap = new Map(Object.entries(crm.perDay));
    const leadsPerDay: Array<{ date: string; count: number }> = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      leadsPerDay.push({ date: key, count: perDayMap.get(key) ?? 0 });
    }

    return NextResponse.json({
      crm: {
        totalLeads: crm.total + crm.contactsTotal,
        quotes: crm.total,
        contacts: crm.contactsTotal,
        statusCounts: crm.statusCounts,
        unhandled: crm.unhandled,
        topServices: crm.topServices,
      },
      offers: catalogCounts,
      analytics: {
        totalVisits: visits,
        pages,
        sources,
        perDay: analyticsPerDayVal,
      },
      leadsPerDay,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('Admin overview error:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
