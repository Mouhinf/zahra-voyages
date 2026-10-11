/**
 * Couche d'accès données côté serveur — SDK Admin Firebase.
 *
 * Utilisée exclusivement par les routes API protégées (verifyAdminToken) et
 * les écritures publiques légitimes (analytics). Le SDK Admin n'est pas soumis
 * aux règles Firestore : c'est pourquoi son usage est restreint à ce fichier
 * et aux routes authentifiées.
 *
 * N'éxpose que des mesures RÉELLES (visites anonymisées, demandes reçues).
 * Les anciennes métriques « réservations / chiffre d'affaires » provenaient
 * d'un seed de données de test : elles ont été retirées (voir git history).
 */

import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { adminApp } from './firebase-admin';

function db(): Firestore {
  return getFirestore(adminApp);
}

// ---------------------------------------------------------------------------
// Lecture analytics (tableau de bord admin — visites réelles)
// ---------------------------------------------------------------------------

export async function totalVisits(): Promise<number> {
  const snapshot = await db().collection('analytics').count().get();
  return snapshot.data().count;
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
