/**
 * Moteur d'attribution multi-touch et persistance des paramètres de campagne — SLAAC Voyages.
 *
 * Fonctionnalités :
 * 1. Capture à l'entrée : Extraction des UTMs et des identifiants de clics publicitaires (gclid, fbclid, ttclid).
 * 2. Persistance de session : Mémorisation en sessionStorage pour éviter la perte d'attribution
 *    lorsque le visiteur navigue entre plusieurs pages avant de soumettre un formulaire.
 * 3. Distinction First-Touch / Last-Touch : Conservation de la page d'atterrissage initiale
 *    et mise à jour de la dernière campagne active si une nouvelle source payante intervient.
 * 4. Confidentialité : Aucun identifiant publicitaire sensible n'est injecté dans des URLs publiques.
 */

export interface AttributionData {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  fbclid?: string;
  ttclid?: string;
  referrer?: string;
  landingPage?: string;
  capturedAt?: number;
}

const STORAGE_KEY = 'slaac_attribution_v1';
const ATTRIBUTION_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 jours

/**
 * Normalise la source publicitaire ou organique pour le CRM et les dashboards.
 */
export function normalizeCampaignSource(
  utmSource?: string,
  referrer = '',
  hasGclid = false,
  hasFbclid = false,
  hasTtclid = false
): string {
  if (hasGclid) return 'google_ads';
  if (hasFbclid) return 'meta_ads';
  if (hasTtclid) return 'tiktok_ads';

  const s = (utmSource || '').toLowerCase().trim();
  const ref = (referrer || '').toLowerCase().trim();

  if (s) {
    if (s.includes('google') && (s.includes('ad') || s.includes('cpc'))) return 'google_ads';
    if (s.includes('facebook') || s.includes('meta') || s.includes('fb')) return 'meta_ads';
    if (s.includes('instagram') || s.includes('ig')) return 'meta_ads';
    if (s.includes('tiktok') || s.includes('tt')) return 'tiktok_ads';
    return s.slice(0, 50);
  }

  if (ref.includes('google.')) return 'google_organic';
  if (ref.includes('facebook.com') || ref.includes('instagram.com')) return 'meta_organic';
  if (ref.includes('tiktok.com')) return 'tiktok_organic';
  if (ref.includes('whatsapp.com') || ref.includes('wa.me')) return 'whatsapp';
  if (!ref) return 'direct';

  return 'referral';
}

/**
 * Capture les paramètres de campagne présents dans l'URL courante et les fusionne
 * avec la session d'attribution existante.
 */
export function captureAttribution(): AttributionData {
  if (typeof window === 'undefined') return {};

  try {
    const searchParams = new URLSearchParams(window.location.search);
    const existingRaw = sessionStorage.getItem(STORAGE_KEY);
    const existing: AttributionData = existingRaw ? JSON.parse(existingRaw) : {};

    const utmSource = searchParams.get('utm_source') || undefined;
    const utmMedium = searchParams.get('utm_medium') || undefined;
    const utmCampaign = searchParams.get('utm_campaign') || undefined;
    const utmContent = searchParams.get('utm_content') || undefined;
    const utmTerm = searchParams.get('utm_term') || undefined;
    const gclid = searchParams.get('gclid') || undefined;
    const gbraid = searchParams.get('gbraid') || undefined;
    const wbraid = searchParams.get('wbraid') || undefined;
    const fbclid = searchParams.get('fbclid') || undefined;
    const ttclid = searchParams.get('ttclid') || undefined;

    const hasNewCampaign = Boolean(
      utmSource || utmCampaign || gclid || gbraid || wbraid || fbclid || ttclid
    );

    const now = Date.now();
    const currentPath = window.location.pathname;
    const referrer = document.referrer || undefined;

    let updated: AttributionData;

    if (hasNewCampaign) {
      // Nouvelle campagne détectée : mise à jour avec conservation de la landing page initiale si présente
      updated = {
        ...existing,
        utmSource: utmSource || existing.utmSource,
        utmMedium: utmMedium || existing.utmMedium,
        utmCampaign: utmCampaign || existing.utmCampaign,
        utmContent: utmContent || existing.utmContent,
        utmTerm: utmTerm || existing.utmTerm,
        gclid: gclid || existing.gclid,
        gbraid: gbraid || existing.gbraid,
        wbraid: wbraid || existing.wbraid,
        fbclid: fbclid || existing.fbclid,
        ttclid: ttclid || existing.ttclid,
        referrer: referrer || existing.referrer,
        landingPage: existing.landingPage || currentPath,
        capturedAt: now,
      };
    } else if (!existing.capturedAt) {
      // Première visite directe / organique sans UTM
      updated = {
        referrer,
        landingPage: currentPath,
        capturedAt: now,
      };
    } else {
      updated = existing;
    }

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn('[Attribution] Impossible de persister les données de campagne:', err);
    return {};
  }
}

/**
 * Récupère les données d'attribution mémorisées pour la soumission d'un formulaire de devis ou contact.
 */
export function getStoredAttribution(): AttributionData {
  if (typeof window === 'undefined') return {};

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return captureAttribution();

    const data: AttributionData = JSON.parse(raw);
    const age = Date.now() - (data.capturedAt || 0);

    if (age > ATTRIBUTION_MAX_AGE_MS) {
      sessionStorage.removeItem(STORAGE_KEY);
      return captureAttribution();
    }

    return data;
  } catch {
    return {};
  }
}
