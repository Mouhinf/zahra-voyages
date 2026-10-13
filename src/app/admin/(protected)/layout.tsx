'use client';

import { Loader2, ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import AdminShell from '@/components/admin/admin-shell';
import { useAdminSession } from '@/lib/guard';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const { status, email } = useAdminSession();
  const redirected = useRef(false);

  // Utilisateur absent ou rôle admin non confirmé par le serveur :
  // déconnexion + retour à la page de connexion. La vérification n'est
  // plus un simple "est connecté ?" (avant : n'importe quel compte
  // Firebase pouvait ouvrir /admin).
  useEffect(() => {
    if (status === 'denied' && !redirected.current) {
      redirected.current = true;
      (async () => {
        try {
          const { getAuthInstance } = await import('@/lib/firebase');
          const { signOut } = await import('firebase/auth');
          await signOut(getAuthInstance());
        } catch {
          // la déconnexion peut échouer si la session a déjà expiré
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

  const handleLogout = async () => {
    const { getAuthInstance } = await import('@/lib/firebase');
    const { signOut } = await import('firebase/auth');
    await signOut(getAuthInstance());
    router.push('/admin/login');
  };

  return (
    <AdminShell email={email} onLogout={handleLogout}>
      {children}
    </AdminShell>
  );
}
