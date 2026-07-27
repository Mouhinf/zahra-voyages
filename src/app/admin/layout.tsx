'use client';

export const dynamic = 'force-dynamic';

import { Loader2, LogOut } from 'lucide-react';
import { getAuthInstance } from '@/lib/firebase';
import { adminGuard } from '@/lib/guard';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { Button } from '@/components/ui/button';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = getAuthInstance().onAuthStateChanged((currentUser) => {
      setLoading(false);
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push('/admin/login');
      }
    });
    return () => unsubscribe();
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

  // Admin guard – doit être mouhopap@gmail.com
  if (!adminGuard()) {
    router.push('/admin/login');
    return null;
  }

  const handleLogout = async () => {
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

