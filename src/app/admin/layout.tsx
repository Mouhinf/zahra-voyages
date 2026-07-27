'use client';

import { Loader2, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string | null } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { getAuthInstance } = await import('@/lib/firebase');
      const { onAuthStateChanged } = await import('firebase/auth');
      const auth = getAuthInstance();
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (cancelled) return;
        setLoading(false);
        if (currentUser) {
          setUser({ email: currentUser.email });
        } else {
          router.push('/admin/login');
        }
      });
      // Clean up
      return () => {
        cancelled = true;
        unsubscribe();
      };
    })();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-secondary/50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    const { getAuthInstance } = await import('@/lib/firebase');
    const { signOut } = await import('firebase/auth');
    await signOut(getAuthInstance());
    router.push('/admin/login');
  };

  return (
    <div className="p-4 sm:p-8 bg-secondary/50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8 pb-4 border-b">
          <div>
            <h1 className="text-3xl font-bold text-primary">Tableau de Bord</h1>
            <p className="text-muted-foreground">Bienvenue, {user.email}</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}

