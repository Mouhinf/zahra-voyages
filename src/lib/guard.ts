'use client';

import { useEffect, useState } from 'react';

/**
 * Vérification du rôle administrateur — CÔTÉ SERVEUR.
 *
 * Avant correction : le rôle était déduit d'un email stocké dans
 * localStorage (`authUser`), falsifiable en une ligne de console.
 * Désormais : l'ID token Firebase de l'utilisateur courant est vérifié
 * par /api/admin/session (verifyAdminToken : signature, révocation,
 * custom claim `admin` ou email vérifié autorisé).
 *
 * useAdminSession() expose l'état complet (loading/denied/ok) pour les
 * layouts ; useGuard() conserve l'ancienne signature booléenne.
 */

export type AdminSessionStatus = 'loading' | 'ok' | 'denied';

export function useAdminSession(): { status: AdminSessionStatus; email: string | null } {
  const [status, setStatus] = useState<AdminSessionStatus>('loading');
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { getAuthInstance } = await import('@/lib/firebase');
      const { onAuthStateChanged } = await import('firebase/auth');

      const unsubscribe = onAuthStateChanged(getAuthInstance(), async (user) => {
        if (cancelled) return;

        if (!user) {
          setStatus('denied');
          setEmail(null);
          return;
        }

        setEmail(user.email ?? null);

        try {
          const token = await user.getIdToken();
          const res = await fetch('/api/admin/session', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (cancelled) return;
          setStatus(res.ok ? 'ok' : 'denied');
        } catch {
          if (!cancelled) setStatus('denied');
        }
      });

      return () => {
        cancelled = true;
        unsubscribe();
      };
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { status, email };
}

/** Compatibilité : renvoie true uniquement si le serveur a confirmé le rôle admin. */
export function useGuard(): boolean {
  const { status } = useAdminSession();
  return status === 'ok';
}
