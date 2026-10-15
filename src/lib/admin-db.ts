/**
 * Couche d'accès données côté serveur — SDK Admin Firebase.
 *
 * Utilisée exclusivement par les routes API protégées (verifyAdminToken) et
 * les écritures publiques légitimes (analytics).
 *
 * Performance : Toutes les mesures analytics utilisent les agrégations
 * journalières pré-calculées (`analyticsDaily`) — zéro scan complet récurrent.
 */

import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { adminApp } from './firebase-admin';
import { getAggregatedDailyStats, recordAnalyticsEvent, type AnalyticsLogInput } from './analytics';

function db(): Firestore {
  return getFirestore(adminApp);
}

// ---------------------------------------------------------------------------
// Lecture analytics (tableau de bord admin — visites réelles pré-agrégées)
// ---------------------------------------------------------------------------

export async function totalVisits(): Promise<number> {
  const daily = await getAggregatedDailyStats(90);
  return daily.reduce((sum, d) => sum + d.pageViews, 0);
}

export async function topPagesDetailed(): Promise<Array<{ page: string; count: number }>> {
  const daily = await getAggregatedDailyStats(30);
  const pages: Record<string, number> = {};

  for (const day of daily) {
    for (const [page, count] of Object.entries(day.pages || {})) {
      // Nettoie l'éventuelle clé échappée
      const cleanPage = page.startsWith('/') ? page : `/${page}`;
      pages[cleanPage] = (pages[cleanPage] ?? 0) + count;
    }
  }

  return Object.entries(pages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([page, count]) => ({ page, count }));
}

export async function topSourcesDetailed(): Promise<Array<{ source: string; count: number }>> {
  const daily = await getAggregatedDailyStats(30);
  const sources: Record<string, number> = {};

  for (const day of daily) {
    for (const [source, count] of Object.entries(day.sources || {})) {
      sources[source] = (sources[source] ?? 0) + count;
    }
  }

  return Object.entries(sources)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([source, count]) => ({ source, count }));
}

export async function dashboardAnalyticsOverview(): Promise<{
  totalVisits: number;
  pages: Array<{ page: string; count: number }>;
  sources: Array<{ source: string; count: number }>;
  perDay: Array<{ date: string; count: number }>;
}> {
  const daily = await getAggregatedDailyStats(30);
  let total = 0;
  const pages: Record<string, number> = {};
  const sources: Record<string, number> = {};
  const perDay: Array<{ date: string; count: number }> = [];

  for (const day of daily) {
    total += day.pageViews;
    perDay.push({ date: day.date, count: day.pageViews });

    for (const [page, count] of Object.entries(day.pages || {})) {
      const cleanPage = page.startsWith('/') ? page : `/${page}`;
      pages[cleanPage] = (pages[cleanPage] ?? 0) + count;
    }

    for (const [source, count] of Object.entries(day.sources || {})) {
      sources[source] = (sources[source] ?? 0) + count;
    }
  }

  return {
    totalVisits: total,
    pages: Object.entries(pages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([page, count]) => ({ page, count })),
    sources: Object.entries(sources)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([source, count]) => ({ source, count })),
    perDay,
  };
}

// ---------------------------------------------------------------------------
// Devis (CRM — lecture admin)
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
// Écritures analytics publiques (balise côté navigateur)
// ---------------------------------------------------------------------------

export async function logAnalyticsEvent(event: AnalyticsLogInput): Promise<void> {
  await recordAnalyticsEvent(event);
}
