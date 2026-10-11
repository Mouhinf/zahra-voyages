'use client';

/**
 * Suivi des pages vues — balise côté client (sendBeacon).
 *
 * Pourquoi ce remplacement : l'ancien middleware déclenchait un appel API
 * à chaque navigation côté serveur (coût + erreurs possibles + la navigation
 * pouvait en dépendre). Ici :
 * - Le visiteur envoie la page vue depuis son navigateur via
 *   navigator.sendBeacon (non bloquant, survit aux fermetures d'onglet).
 * - La navigation ne dépend JAMAIS de l'analytics : tout échec est
 *   silencieux, aucun rechargement ni blocage.
 * - Respect de la vie privée : aucune donnée personnelle (userId null),
 *   pas de cookie ; les pages /admin ne sont pas mesurées.
 */

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function AnalyticsBeacon() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;
    // Anti-doublon : StrictMode monte les effets deux fois en dev.
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;

    // Le back-office n'est pas du trafic public.
    if (pathname === '/admin' || pathname.startsWith('/admin/')) return;

    const referrer = typeof document !== 'undefined' ? document.referrer || '' : '';
    let source = 'direct';
    if (referrer) {
      if (referrer.includes('facebook.com')) source = 'facebook';
      else if (referrer.includes('google.com')) source = 'google';
      else if (referrer.includes('twitter.com') || referrer.includes('x.com')) source = 'twitter';
      else source = 'referral';
    }

    const payload = JSON.stringify({
      page: pathname.slice(0, 200),
      source,
      referrer: referrer ? referrer.slice(0, 500) : null,
      userId: null,
      method: 'GET',
    });

    try {
      const blob = new Blob([payload], { type: 'application/json' });
      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        const queued = navigator.sendBeacon('/api/analytics/log', blob);
        if (queued) return; // envoyé
      }
      // Repli non bloquant pour les navigateurs sans sendBeacon.
      void fetch('/api/analytics/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    } catch {
      // L'analytics ne doit jamais casser l'expérience.
    }
  }, [pathname]);

  return null;
}
