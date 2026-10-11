// src/app/admin/dashboard/layout.tsx
'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ShieldAlert } from 'lucide-react';
import { useAdminSession } from '@/lib/guard';

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
}

export default function AdminDashboardLayout({ children }: AdminDashboardLayoutProps) {
  const router = useRouter();
  const { status } = useAdminSession();
  const redirected = useRef(false);

  // Rôle vérifié côté serveur : un simple utilisateur connecté ne peut
  // plus afficher le tableau de bord.
  useEffect(() => {
    if (status === 'denied' && !redirected.current) {
      redirected.current = true;
      (async () => {
        try {
          const { getAuthInstance } = await import('@/lib/firebase');
          const { signOut } = await import('firebase/auth');
          await signOut(getAuthInstance());
        } catch {
          // session déjà expirée
        }
        router.push('/admin/login');
      })();
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-secondary/50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (status !== 'ok') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-secondary/50 gap-4">
        <ShieldAlert className="h-10 w-10 text-destructive" />
        <p className="text-muted-foreground">Accès refusé. Redirection…</p>
      </div>
    );
  }

  return children;
}
