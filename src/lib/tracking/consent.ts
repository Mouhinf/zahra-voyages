/**
 * Gestionnaire de consentement et Google Consent Mode v2 — SLAAC Voyages.
 *
 * Conformité :
 * - Loi sénégalaise n° 2008-12 relative à la protection des données à caractère personnel (CDP).
 * - Standard Google Consent Mode v2 (analytics_storage, ad_storage, ad_user_data, ad_personalization).
 * - Par défaut : Zéro balise publicitaire activée sans consentement positif explicite.
 * - Choix réversible à tout moment par l'internaute.
 */

export interface ConsentPreferences {
  analytics_storage: 'granted' | 'denied';
  ad_storage: 'granted' | 'denied';
  ad_user_data: 'granted' | 'denied';
  ad_personalization: 'granted' | 'denied';
  hasInteracted: boolean;
  updatedAt?: number;
}

const CONSENT_STORAGE_KEY = 'slaac_consent_v2';

export const DEFAULT_CONSENT: ConsentPreferences = {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  hasInteracted: false,
};

/**
 * Initialise le Google Consent Mode v2 par défaut sur 'denied'.
 */
export function initConsentMode(): void {
  if (typeof window === 'undefined') return;
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag === 'function') {
    gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      wait_for_update: 500,
    });
  }
}

/**
 * Récupère l'état de consentement enregistré dans le navigateur.
 */
export function getConsentPreferences(): ConsentPreferences {
  if (typeof window === 'undefined') return DEFAULT_CONSENT;

  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return DEFAULT_CONSENT;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_CONSENT;
  }
}

/**
 * Met à jour Google Consent Mode v2 si gtag est présent sur la page.
 */
export function syncGtagConsent(prefs: ConsentPreferences): void {
  if (typeof window === 'undefined') return;

  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag === 'function') {
    gtag('consent', 'update', {
      analytics_storage: prefs.analytics_storage,
      ad_storage: prefs.ad_storage,
      ad_user_data: prefs.ad_user_data,
      ad_personalization: prefs.ad_personalization,
    });
  }

  // Événement personnalisé pour avertir les composants abonnés
  window.dispatchEvent(new CustomEvent('slaac_consent_updated', { detail: prefs }));
}

/**
 * Enregistre les préférences de consentement de l'utilisateur.
 */
export function saveConsentPreferences(
  prefs: Partial<ConsentPreferences>
): ConsentPreferences {
  const updated: ConsentPreferences = {
    ...getConsentPreferences(),
    ...prefs,
    hasInteracted: true,
    updatedAt: Date.now(),
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn('[Consent] Erreur sauvegarde localStorage:', err);
    }
    syncGtagConsent(updated);
  }

  return updated;
}

/**
 * Accepte l'ensemble des traceurs de mesure et publicitaires.
 */
export function acceptAllConsent(): ConsentPreferences {
  return saveConsentPreferences({
    analytics_storage: 'granted',
    ad_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
  });
}

/**
 * Refuse tous les traceurs facultatifs (seul le 1st party anonymisé strict fonctionne).
 */
export function refuseAllConsent(): ConsentPreferences {
  return saveConsentPreferences({
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
}
