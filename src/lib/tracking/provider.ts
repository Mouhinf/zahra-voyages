/**
 * Dispatcher central d'événements de tracking multi-canal — SLAAC Voyages.
 *
 * Responsabilités :
 * 1. Synchronisation 1st-party : Remontée vers `/api/analytics/log` (analyticsDaily atomique Firestore).
 * 2. Vérification stricte du consentement : Aucun pixel tiers (GA4, Meta, TikTok) n'est sollicité
 *    si le consentement correspondant (`analytics_storage` ou `ad_storage`) n'est pas accordé.
 * 3. Déduplication déterministe : Transmission de l'`eventId` unique pour réconciliation Pixel / CAPI.
 * 4. Résilience totale : Une indisponibilité réseau ou un bloqueur n'interrompt jamais l'expérience utilisateur.
 */

import {
  type ConversionEventName,
  type EventPayloadMap,
  buildEventId,
} from './events';
import { getConsentPreferences } from './consent';
import { getStoredAttribution } from './attribution';

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    ttq?: {
      track: (eventName: string, params?: Record<string, unknown>, options?: { event_id?: string }) => void;
      page?: () => void;
    };
  }
}

/**
 * Assainit la charge utile d'événement pour garantir l'absence de toute PII en clair.
 */
export function sanitizeEventPayload<T extends Record<string, unknown>>(payload: T): T {
  const sanitized = { ...payload };
  delete sanitized.email;
  delete sanitized.phone;
  delete sanitized.nom;
  delete sanitized.prenom;
  delete sanitized.nomComplet;
  delete sanitized.password;
  delete sanitized.notes;
  delete sanitized.adresse;
  return sanitized;
}

/**
 * Dispatche un événement de conversion sur tous les canaux autorisés.
 */

export function dispatchConversionEvent<T extends ConversionEventName>(
  eventName: T,
  payload: EventPayloadMap[T]
): string {
  if (typeof window === 'undefined') return '';

  const consent = getConsentPreferences();
  const attribution = getStoredAttribution();
  const currentPath = window.location.pathname;
  const eventId = payload.eventId || buildEventId(eventName);

  const enrichedPayload = {
    ...payload,
    eventId,
    page: payload.page || currentPath,
    timestamp: payload.timestamp || Date.now(),
    attribution: {
      utmSource: attribution.utmSource,
      utmCampaign: attribution.utmCampaign,
      utmMedium: attribution.utmMedium,
      landingPage: attribution.landingPage,
    },
  };

  // ---------------------------------------------------------------------------
  // 1. Canal 1st-Party Interne (SLAAC Analytics — Privacy-Safe)
  // ---------------------------------------------------------------------------
  try {
    const internalEventTypeMap: Record<string, string> = {
      page_view: 'page_view',
      cta_click: 'cta_click',
      whatsapp_click: 'whatsapp_click',
      quote_start: 'quote_start',
      lead_created: 'cta_click',
    };

    const beaconType = internalEventTypeMap[eventName];
    if (beaconType) {
      const body = JSON.stringify({
        page: currentPath,
        eventType: beaconType,
        source: attribution.utmSource || 'direct',
        medium: attribution.utmMedium,
        campaign: attribution.utmCampaign,
        referrer: attribution.referrer || document.referrer || null,
        method: 'POST',
      });

      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/analytics/log', new Blob([body], { type: 'application/json' }));
      } else {
        void fetch('/api/analytics/log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
          keepalive: true,
        }).catch(() => {});
      }
    }
  } catch (err) {
    console.debug('[Tracking] 1st-party dispatch failed:', err);
  }

  const sanitizedPayload = sanitizeEventPayload(enrichedPayload as unknown as Record<string, unknown>);

  // ---------------------------------------------------------------------------
  // 2. Google Analytics 4 / Google Tag Manager (si consenti analytics_storage)
  // ---------------------------------------------------------------------------
  if (consent.analytics_storage === 'granted') {
    try {
      if (window.dataLayer && Array.isArray(window.dataLayer)) {
        window.dataLayer.push({
          event: eventName,
          event_id: eventId,
          ...sanitizedPayload,
        });
      }
      if (typeof window.gtag === 'function') {
        const gaEventName = eventName === 'lead_created' ? 'generate_lead' : eventName;
        window.gtag('event', gaEventName, {
          event_id: eventId,
          ...sanitizedPayload,
        });
      }
    } catch (err) {
      console.debug('[Tracking] GA4 dispatch failed:', err);
    }
  }

  // ---------------------------------------------------------------------------
  // 3. Meta Pixel (Facebook & Instagram — si consenti ad_storage)
  // ---------------------------------------------------------------------------
  if (consent.ad_storage === 'granted' && typeof window.fbq === 'function') {
    try {
      if (eventName === 'lead_created') {
        window.fbq(
          'track',
          'Lead',
          {
            content_name: (payload as unknown as { service?: string }).service || 'travel_inquiry',
            currency: 'XOF',
            status: 'submitted',
          },
          { eventID: eventId }
        );
      } else {
        window.fbq('trackCustom', eventName, sanitizedPayload, { eventID: eventId });
      }
    } catch (err) {
      console.debug('[Tracking] Meta Pixel dispatch failed:', err);
    }
  }

  // ---------------------------------------------------------------------------
  // 4. TikTok Pixel (si consenti ad_storage)
  // ---------------------------------------------------------------------------
  if (consent.ad_storage === 'granted' && window.ttq && typeof window.ttq.track === 'function') {
    try {
      if (eventName === 'lead_created') {
        window.ttq.track(
          'SubmitForm',
          {
            contents: [{ content_name: (payload as unknown as { service?: string }).service || 'travel_inquiry' }],
          },
          { event_id: eventId }
        );
      } else {
        window.ttq.track(eventName, sanitizedPayload, { event_id: eventId });
      }
    } catch (err) {
      console.debug('[Tracking] TikTok Pixel dispatch failed:', err);
    }
  }


  return eventId;
}
