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

import type { AdminRole, Permission } from '@/lib/rbac';
import { hasPermission } from '@/lib/rbac';

export type AdminSessionStatus = 'loading' | 'ok' | 'denied';

export interface AdminSessionState {
  status: AdminSessionStatus;
  email: string | null;
  role: AdminRole | null;
  permissions: readonly Permission[];
  hasPermission: (perm: Permission) => boolean;
}

export function useAdminSession(): AdminSessionState {
  const [status, setStatus] = useState<AdminSessionStatus>('loading');
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<AdminRole | null>(null);
  const [permissions, setPermissions] = useState<readonly Permission[]>([]);
  const [customPermissions, setCustomPermissions] = useState<Permission[]>([]);

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
          setRole(null);
          setPermissions([]);
          return;
        }

        setEmail(user.email ?? null);

        try {
          const token = await user.getIdToken();
          const res = await fetch('/api/admin/session', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (cancelled) return;
          if (res.ok) {
            const data = await res.json();
            setStatus('ok');
            setRole(data.role ?? 'ADMIN');
            setPermissions(data.permissions ?? []);
            setCustomPermissions(data.customPermissions ?? []);
          } else {
            setStatus('denied');
            setRole(null);
            setPermissions([]);
          }
        } catch {
          if (!cancelled) {
            setStatus('denied');
            setRole(null);
            setPermissions([]);
          }
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

  const checkPerm = (perm: Permission): boolean => {
    if (!role) return false;
    return hasPermission(role, perm, customPermissions);
  };

  return { status, email, role, permissions, hasPermission: checkPerm };
}

/** Compatibilité : renvoie true uniquement si le serveur a confirmé le rôle admin. */
export function useGuard(): boolean {
  const { status } = useAdminSession();
  return status === 'ok';
}

