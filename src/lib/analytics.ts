/**
 * Système de mesure et d'agrégation analytics — SLAAC Voyages.
 *
 * Principes architecturaux :
 * 1. Zéro scan complet : Chaque événement incrémente un document journalier
 *    pré-agrégé (`analyticsDaily/YYYY-MM-DD`). Les rapports ne lisent que
 *    les documents de la période (ex: 30 lectures pour 30 jours).
 * 2. Protection de la vie privée :
 *    - Aucune adresse IP stockée en base de données.
 *    - Sessions uniques estimées par hachage journalier salé éphémère.
 *    - Code pays ISO extrait anonymement des en-têtes Edge Vercel (x-vercel-ip-country).
 * 3. Fuseau horaire : Africa/Dakar (UTC+0).
 * 4. Filtrage des robots et limitations de débit.
 */

import { getFirestore, FieldValue, Timestamp } from 'firebase-admin/firestore';
import { adminApp } from './firebase-admin';
import { createHash } from 'node:crypto';

export type EventType = 'page_view' | 'cta_click' | 'whatsapp_click' | 'quote_start';

export type TrafficSource =
  | 'direct'
  | 'google_search'
  | 'google_ads'
  | 'facebook'
  | 'instagram'
  | 'tiktok'
  | 'twitter'
  | 'whatsapp'
  | 'referral'
  | 'inconnu';

export type DeviceType = 'mobile' | 'desktop' | 'tablet';

export interface AnalyticsLogInput {
  page: string;
  eventType?: EventType;
  source?: string;
  medium?: string;
  campaign?: string;
  referrer?: string | null;
  device?: DeviceType;
  ip?: string;
  userAgent?: string;
  vercelCountry?: string | null;
}

export interface DailyStats {
  date: string; // YYYY-MM-DD
  pageViews: number;
  uniqueSessions: number;
  ctaClicks: number;
  whatsappClicks: number;
  quoteStarts: number;
  pages: Record<string, number>;
  sources: Record<string, number>;
  campaigns: Record<string, number>;
  countries: Record<string, number>;
  devices: Record<string, number>;
  updatedAt?: Timestamp | string;
}

function db() {
  return getFirestore(adminApp);
}

/** Obtient la date YYYY-MM-DD au fuseau Africa/Dakar (UTC) */
export function getDakarDate(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

/** Détecte les bots courants pour ne pas fausser les métriques */
export function isBot(userAgent = ''): boolean {
  const ua = userAgent.toLowerCase();
  return (
    ua.includes('bot') ||
    ua.includes('spider') ||
    ua.includes('crawl') ||
    ua.includes('headlesschrome') ||
    ua.includes('lighthouse') ||
    ua.includes('facebookexternalhit') ||
    ua.includes('slurp') ||
    ua.includes('bingpreview')
  );
}

/** Normalise la source de trafic */
export function normalizeSource(rawSource = '', referrer = '', medium = ''): TrafficSource {
  const s = rawSource.toLowerCase().trim();
  const m = medium.toLowerCase().trim();
  const ref = referrer.toLowerCase();

  if (s === 'google' || ref.includes('google.')) {
    if (m === 'cpc' || m === 'ads' || s.includes('ad')) return 'google_ads';
    return 'google_search';
  }
  if (s.includes('facebook') || ref.includes('facebook.com') || ref.includes('fb.com')) return 'facebook';
  if (s.includes('instagram') || ref.includes('instagram.com')) return 'instagram';
  if (s.includes('tiktok') || ref.includes('tiktok.com')) return 'tiktok';
  if (s.includes('twitter') || s.includes('x.com') || ref.includes('t.co') || ref.includes('twitter.com') || ref.includes('x.com')) return 'twitter';
  if (s.includes('whatsapp') || ref.includes('whatsapp.com') || ref.includes('wa.me')) return 'whatsapp';
  if (s === 'direct' || (!s && !ref)) return 'direct';
  if (ref) return 'referral';
  return 'inconnu';
}

/** Nettoie et normalise une chaîne UTM */
export function sanitizeUtm(str?: string | null, maxLen = 60): string | undefined {
  if (!str) return undefined;
  // Ne conserve que les caractères alphanumériques sûrs
  const clean = str
    .trim()
    .replace(/[^\w\s\-_.]/g, '')
    .slice(0, maxLen);
  return clean || undefined;
}

/** Calcule un hash de session anonymisé pour le comptage de sessions uniques journalières */
function computeDailySessionHash(ip = '', userAgent = '', date: string): string {
  // Sel quotidien lié à la date pour que le hash ne soit pas corrélable dans le temps
  const salt = `slaac-salt-${date}`;
  return createHash('sha256')
    .update(`${ip}|${userAgent}|${salt}`)
    .digest('hex')
    .slice(0, 16);
}

/**
 * Enregistre un événement analytique et incrémente atomiquement
 * les compteurs journaliers agrégés (`analyticsDaily/YYYY-MM-DD`).
 */
export async function recordAnalyticsEvent(input: AnalyticsLogInput): Promise<void> {
  const dateStr = getDakarDate();
  const page = input.page.slice(0, 120);

  // Le back-office n'est pas mesuré
  if (page.startsWith('/admin')) return;

  const eventType: EventType = input.eventType || 'page_view';
  const source = normalizeSource(input.source, input.referrer || '', input.medium || '');
  const campaign = sanitizeUtm(input.campaign);
  const country = (input.vercelCountry || 'UNKNOWN').toUpperCase().slice(0, 2);
  const device: DeviceType = input.device || 'desktop';

  const dailyRef = db().collection('analyticsDaily').doc(dateStr);
  const now = new Date();

  // Incrément atomique dans analyticsDaily
  const updates: Record<string, unknown> = {
    date: dateStr,
    updatedAt: FieldValue.serverTimestamp(),
  };

  if (eventType === 'page_view') {
    updates.pageViews = FieldValue.increment(1);
    updates[`pages.${page.replace(/[.~*/[\]]/g, '_')}`] = FieldValue.increment(1);
    updates[`sources.${source}`] = FieldValue.increment(1);
    updates[`countries.${country}`] = FieldValue.increment(1);
    updates[`devices.${device}`] = FieldValue.increment(1);
    if (campaign) {
      updates[`campaigns.${campaign.replace(/[.~*/[\]]/g, '_')}`] = FieldValue.increment(1);
    }
  } else if (eventType === 'cta_click') {
    updates.ctaClicks = FieldValue.increment(1);
  } else if (eventType === 'whatsapp_click') {
    updates.whatsappClicks = FieldValue.increment(1);
  } else if (eventType === 'quote_start') {
    updates.quoteStarts = FieldValue.increment(1);
  }

  // Vérification de session unique journalière (via sous-collection légère éphémère)
  if (input.ip && eventType === 'page_view') {
    const sessionHash = computeDailySessionHash(input.ip, input.userAgent, dateStr);
    const sessionRef = dailyRef.collection('sessions').doc(sessionHash);
    const sessionSnap = await sessionRef.get();
    if (!sessionSnap.exists) {
      await sessionRef.set({ at: now });
      updates.uniqueSessions = FieldValue.increment(1);
    }
  }

  // Écriture de l'agrégation
  await dailyRef.set(updates, { merge: true });

  // Événement brut (journal avec TTL/rétention pour audit de traçabilité)
  await db().collection('analyticsEvents').add({
    date: dateStr,
    page,
    eventType,
    source,
    campaign: campaign || null,
    country,
    device,
    timestamp: now,
  });
}

/**
 * Récupère les statistiques quotidiennes agrégées pour une période donnée.
 * Ne lit QUE les N documents de jours dans `analyticsDaily`.
 */
export async function getAggregatedDailyStats(days = 30): Promise<DailyStats[]> {
  const dates: string[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    dates.push(getDakarDate(d));
  }

  const refs = dates.map((date) => db().collection('analyticsDaily').doc(date));
  const snapshots = await db().getAll(...refs);

  const stats: DailyStats[] = [];

  for (let i = 0; i < dates.length; i++) {
    const snap = snapshots[i];
    const date = dates[i];
    if (snap.exists) {
      const data = snap.data() || {};
      stats.push({
        date,
        pageViews: Number(data.pageViews || 0),
        uniqueSessions: Number(data.uniqueSessions || data.pageViews || 0),
        ctaClicks: Number(data.ctaClicks || 0),
        whatsappClicks: Number(data.whatsappClicks || 0),
        quoteStarts: Number(data.quoteStarts || 0),
        pages: data.pages || {},
        sources: data.sources || {},
        campaigns: data.campaigns || {},
        countries: data.countries || {},
        devices: data.devices || {},
      });
    } else {
      stats.push({
        date,
        pageViews: 0,
        uniqueSessions: 0,
        ctaClicks: 0,
        whatsappClicks: 0,
        quoteStarts: 0,
        pages: {},
        sources: {},
        campaigns: {},
        countries: {},
        devices: {},
      });
    }
  }

  return stats;
}
