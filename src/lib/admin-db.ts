/**
 * Couche d'accès données côté serveur — SDK Admin Firebase.
 *
 * Utilisée exclusivement par les routes API protégées (verifyAdminToken) et
 * les écritures publiques légitimes (analytics). Le SDK Admin n'est pas soumis
 * aux règles Firestore : c'est pourquoi son usage est restreint à ce fichier
 * et aux routes authentifiées.
 */

import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { adminApp } from './firebase-admin';

function db(): Firestore {
  return getFirestore(adminApp);
}

// ---------------------------------------------------------------------------
// Lecture analytics / réservations (tableau de bord admin)
// ---------------------------------------------------------------------------

export async function totalVisits(): Promise<number> {
  const snapshot = await db().collection('analytics').count().get();
  return snapshot.data().count;
}

export async function totalBookings(): Promise<number> {
  const snapshot = await db().collection('bookings').count().get();
  return snapshot.data().count;
}

export async function totalRevenue(): Promise<number> {
  const snapshot = await db().collection('bookings').get();
  let total = 0;
  snapshot.forEach((doc) => {
    const amount = Number(doc.data().amount);
    if (!isNaN(amount)) total += amount;
  });
  return total;
}

export async function totalOffers(): Promise<number> {
  const collections = ['destinations', 'hebergements', 'transports', 'voyages', 'excursions', 'offresAffaires', 'partenaires'];
  let total = 0;
  for (const coll of collections) {
    const snapshot = await db().collection(coll).count().get();
    total += snapshot.data().count;
  }
  return total;
}

export async function conversionRate(visits?: number, bookings?: number): Promise<number> {
  const v = visits ?? await totalVisits();
  const b = bookings ?? await totalBookings();
  return v === 0 ? 0 : (b / v) * 100;
}

export async function totalUniqueVisitors(): Promise<number> {
  const snapshot = await db().collection('analytics').get();
  const distinct = new Set<string>();
  snapshot.forEach((doc) => {
    const uid = doc.data().userId;
    if (uid) distinct.add(String(uid));
  });
  return distinct.size;
}

export async function topPagesDetailed(): Promise<Array<{ page: string; count: number }>> {
  const snapshot = await db().collection('analytics').get();
  const pages: Record<string, number> = {};
  snapshot.forEach((doc) => {
    const page = String(doc.data().page || '/');
    pages[page] = (pages[page] ?? 0) + 1;
  });
  return Object.entries(pages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([page, count]) => ({ page, count }));
}

export async function topSourcesDetailed(): Promise<Array<{ source: string; count: number }>> {
  const snapshot = await db().collection('analytics').get();
  const sources: Record<string, number> = {};
  snapshot.forEach((doc) => {
    const source = String(doc.data().source || 'direct');
    sources[source] = (sources[source] ?? 0) + 1;
  });
  return Object.entries(sources)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([source, count]) => ({ source, count }));
}

export async function topTransportsDetailed(): Promise<Array<{ type: string; count: number }>> {
  const snapshot = await db().collection('bookings').get();
  const byType: Record<string, number> = {};
  snapshot.forEach((doc) => {
    const type = String(doc.data().type || 'autre');
    byType[type] = (byType[type] ?? 0) + 1;
  });
  return Object.entries(byType)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([type, count]) => ({ type, count }));
}

export async function topDestinations(): Promise<Array<{ destination: string; visits: number }>> {
  const snapshot = await db().collection('analytics').get();
  const destCounts: Record<string, number> = {};
  snapshot.forEach((doc) => {
    const page = String(doc.data().page || '');
    if (page.includes('/destinations')) destCounts[page] = (destCounts[page] ?? 0) + 1;
  });
  return Object.entries(destCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([page, count]) => ({ destination: page, visits: count }));
}

function since30d(): Date {
  const start = new Date();
  start.setDate(start.getDate() - 30);
  return start;
}

export async function analyticsPerDay(): Promise<Array<{ date: string; count: number }>> {
  const snapshot = await db()
    .collection('analytics')
    .where('timestamp', '>=', since30d())
    .get();
  const daily: Record<string, number> = {};
  snapshot.forEach((doc) => {
    const ts = doc.data().timestamp;
    if (!ts?.toDate) return;
    const date = ts.toDate().toISOString().split('T')[0];
    daily[date] = (daily[date] ?? 0) + 1;
  });
  return Object.entries(daily).map(([date, count]) => ({ date, count }));
}

export async function bookingsPerDay(): Promise<Array<{ date: string; count: number }>> {
  const snapshot = await db()
    .collection('bookings')
    .where('createdAt', '>=', since30d())
    .get();
  const daily: Record<string, number> = {};
  snapshot.forEach((doc) => {
    const ts = doc.data().createdAt;
    if (!ts?.toDate) return;
    const date = ts.toDate().toISOString().split('T')[0];
    daily[date] = (daily[date] ?? 0) + 1;
  });
  return Object.entries(daily).map(([date, count]) => ({ date, count }));
}

export async function revenuePerDay(): Promise<Array<{ date: string; revenue: number }>> {
  const snapshot = await db()
    .collection('bookings')
    .where('createdAt', '>=', since30d())
    .get();
  const dailyRevenue: Record<string, number> = {};
  snapshot.forEach((doc) => {
    const ts = doc.data().createdAt;
    if (!ts?.toDate) return;
    const date = ts.toDate().toISOString().split('T')[0];
    const amount = Number(doc.data().amount) || 0;
    dailyRevenue[date] = (dailyRevenue[date] ?? 0) + amount;
  });
  return Object.entries(dailyRevenue).map(([date, revenue]) => ({ date, revenue }));
}

export async function uniqueVisitorsPerDay(): Promise<Array<{ date: string; count: number }>> {
  const snapshot = await db()
    .collection('analytics')
    .where('timestamp', '>=', since30d())
    .get();
  const daily: Record<string, Set<string>> = {};
  snapshot.forEach((doc) => {
    const ts = doc.data().timestamp;
    if (!ts?.toDate) return;
    const date = ts.toDate().toISOString().split('T')[0];
    if (!daily[date]) daily[date] = new Set();
    const uid = doc.data().userId;
    if (uid) daily[date].add(String(uid));
  });
  return Object.entries(daily).map(([date, set]) => ({ date, count: set.size }));
}

export type AnalyticsSummary = {
  totalVisits: number;
  totalBookings: number;
  conversionRate: number;
  revenue: number;
  uniqueVisitors: number;
  pages: Array<{ page: string; count: number }>;
  sources: Array<{ source: string; count: number }>;
  topTransports: Array<{ type: string; count: number }>;
  topDestinations: Array<{ destination: string; visits: number }>;
  topOffers: number;
  topBookings: Array<{ date: string; count: number }>;
  topVisitsPerDay: Array<{ date: string; count: number }>;
  topRevenuePerDay: Array<{ date: string; revenue: number }>;
  topBookingsPerDay: Array<{ date: string; count: number }>;
  topUniqueVisitorsPerDay: Array<{ date: string; count: number }>;
  topTransportsByVisits: Array<{ transport: string; visits: number }>;
};

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const [
    totalVisitsVal,
    totalBookingsVal,
    revenueVal,
    uniqueVisitorsVal,
    pagesVal,
    sourcesVal,
    topTransportsVal,
    topDestinationsVal,
    topOffersVal,
    bookingsPerDayVal,
    analyticsPerDayVal,
    revenuePerDayVal,
    uniqueVisitorsPerDayVal,
  ] = await Promise.all([
    totalVisits(),
    totalBookings(),
    totalRevenue(),
    totalUniqueVisitors(),
    topPagesDetailed(),
    topSourcesDetailed(),
    topTransportsDetailed(),
    topDestinations(),
    totalOffers(),
    bookingsPerDay(),
    analyticsPerDay(),
    revenuePerDay(),
    uniqueVisitorsPerDay(),
  ]);

  const conversionRateVal = await conversionRate(totalVisitsVal, totalBookingsVal);

  // topTransportsByVisits n'est plus exposé dans la grille d'origine :
  // conservé vide pour compatibilité du type AnalyticsSummary.
  return {
    totalVisits: totalVisitsVal,
    totalBookings: totalBookingsVal,
    conversionRate: conversionRateVal,
    revenue: revenueVal,
    uniqueVisitors: uniqueVisitorsVal,
    pages: pagesVal,
    sources: sourcesVal,
    topTransports: topTransportsVal,
    topDestinations: topDestinationsVal,
    topOffers: topOffersVal,
    topBookings: bookingsPerDayVal,
    topVisitsPerDay: analyticsPerDayVal,
    topRevenuePerDay: revenuePerDayVal,
    topBookingsPerDay: bookingsPerDayVal,
    topUniqueVisitorsPerDay: uniqueVisitorsPerDayVal,
    topTransportsByVisits: [],
  };
}

// ---------------------------------------------------------------------------
// Devis (CRM minimal — lecture admin)
// ---------------------------------------------------------------------------

export async function listQuotes(limit = 200): Promise<Array<Record<string, unknown> & { id: string }>> {
  const snapshot = await db()
    .collection('quotes')
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .get();
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ---------------------------------------------------------------------------
// Seed / maintenance (usage explicite uniquement — voir route seed)
// ---------------------------------------------------------------------------

/**
 * ⚠️ Écrit des données de TEST dans les collections réelles.
 * La route appelante doit exiger une confirmation explicite de l'administrateur.
 */
export async function seedDashboard(): Promise<void> {
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const collections = ['destinations', 'hebergements', 'transports', 'voyages', 'excursions', 'offresAffaires', 'partenaires'];
  for (const coll of collections) {
    await db().collection(coll).add({
      titre: `${coll.charAt(0).toUpperCase() + coll.slice(1)} offre test`,
      description: 'Description de test',
      prix: '1000',
      image: `https://picsum.photos/seed/${coll}/600/400`,
      tag: coll,
      disponible: true,
      ordre: 1,
    });
  }

  for (let i = 1; i <= 100; i++) {
    const amount = Math.random() * 200000;
    await db().collection('bookings').add({
      userId: `test-${i}`,
      transportId: `seed-transport-${Math.floor(Math.random() * 5)}`,
      titre: `Réservation ${i}`,
      description: 'Réservation de test',
      prix: amount.toString(),
      amount,
      status: 'confirmed',
      createdAt: new Date(now.getTime() - Math.random() * 86400000),
    });
  }

  const logPages = ['/', '/destinations', '/hebergement', '/transport', '/voyages-croisieres', '/excursions', '/tourisme-affaires', '/contact'];
  for (let i = 0; i < 2000; i++) {
    const page = logPages[Math.floor(Math.random() * logPages.length)];
    const source = Math.random() < 0.2 ? 'facebook' : Math.random() < 0.1 ? 'google' : 'direct';
    const referrer = source === 'direct' ? null : `https://${source}.com`;
    await db().collection('analytics').add({
      page,
      timestamp: new Date(yesterday.getTime() + Math.random() * 86400000),
      source,
      referrer,
      userId: `test-${i}`,
      method: 'GET',
    });
  }
}

export async function logAnalyticsEvent(event: {
  page: string;
  source: string;
  referrer: string | null;
  userId: string | null;
  method: string;
}): Promise<void> {
  await db().collection('analytics').add({
    ...event,
    timestamp: new Date(),
  });
}
