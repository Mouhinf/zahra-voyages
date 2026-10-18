'use client';

/**
 * Suivi analytics éco-conçu et respectueux de la vie privée — SLAAC Voyages.
 *
 * Caractéristiques :
 * - Pages vues : `navigator.sendBeacon` (non-bloquant, survit aux fermetures d'onglets).
 * - Clics CTA & WhatsApp : traçage léger sans impacter la navigation.
 * - Détection UTM : utm_source, utm_medium, utm_campaign normalisés.
 * - Détection d'appareil : mobile / tablette / desktop via largeur d'écran / user-agent.
 * - Zéro donnée personnelle collectée, aucune IP stockée.
 * - Pages /admin exclues de la mesure.
 */

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { captureAttribution, getStoredAttribution } from '@/lib/tracking/attribution';

export type ClientEventType = 'page_view' | 'cta_click' | 'whatsapp_click' | 'quote_start';

function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

function parseUtmParams(): { source?: string; medium?: string; campaign?: string } {
  if (typeof window === 'undefined') return {};
  try {
    const params = new URLSearchParams(window.location.search);
    const source = params.get('utm_source') || undefined;
    const medium = params.get('utm_medium') || undefined;
    const campaign = params.get('utm_campaign') || undefined;
    return { source, medium, campaign };
  } catch {
    return {};
  }
}

function detectSource(referrer: string, utmSource?: string): string {
  if (utmSource) return utmSource.toLowerCase().slice(0, 50);
  if (!referrer) return 'direct';
  const ref = referrer.toLowerCase();
  if (ref.includes('google.')) return 'google';
  if (ref.includes('facebook.com') || ref.includes('fb.com')) return 'facebook';
  if (ref.includes('instagram.com')) return 'instagram';
  if (ref.includes('tiktok.com')) return 'tiktok';
  if (ref.includes('twitter.com') || ref.includes('x.com') || ref.includes('t.co')) return 'twitter';
  if (ref.includes('whatsapp.com')) return 'whatsapp';
  return 'referral';
}

/** Envoie un événement analytics de façon totalement asynchrone et non-bloquante */
export function trackAnalyticsEvent(
  eventType: ClientEventType,
  details?: { page?: string; campaign?: string; source?: string }
): void {
  if (typeof window === 'undefined') return;
  const pathname = details?.page || window.location.pathname;

  // Pas de suivi sur l'administration
  if (pathname === '/admin' || pathname.startsWith('/admin/')) return;

  const storedAttr = getStoredAttribution();
  const utm = parseUtmParams();
  const referrer = document.referrer || '';
  const effectiveSource = details?.source || utm.source || storedAttr.utmSource;
  const source = detectSource(referrer, effectiveSource);
  const campaign = details?.campaign || utm.campaign || storedAttr.utmCampaign;
  const medium = utm.medium || storedAttr.utmMedium;

  const payload = JSON.stringify({
    page: pathname.slice(0, 200),
    eventType,
    source,
    medium,
    campaign,
    referrer: referrer ? referrer.slice(0, 500) : null,
    device: getDeviceType(),
    method: 'POST',
  });

  try {
    const blob = new Blob([payload], { type: 'application/json' });
    if (navigator.sendBeacon) {
      const queued = navigator.sendBeacon('/api/analytics/log', blob);
      if (queued) return;
    }
    void fetch('/api/analytics/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Silencieux : le suivi ne doit jamais impacter l'expérience
  }
}

export default function AnalyticsBeacon() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;
    // Capture et persistance automatique des paramètres UTM/clics à chaque navigation
    captureAttribution();

    // Anti-doublon StrictMode
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;

    trackAnalyticsEvent('page_view', { page: pathname });
  }, [pathname]);

  return null;
}
