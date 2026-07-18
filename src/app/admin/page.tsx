'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { getAuthInstance } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, LogOut } from 'lucide-react';
import DestinationsManager from '@/components/admin/destinations-manager';
import HebergementsManager from '@/components/admin/hebergements-manager';
import TransportsManager from '@/components/admin/transports-manager';
import VoyagesCroisieresManager from '@/components/admin/voyages-croisieres-manager';
import ExcursionsManager from '@/components/admin/excursions-manager';
import OffresAffairesManager from '@/components/admin/offres-affaires-manager';

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuthInstance(), (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push('/admin/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(getAuthInstance());
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

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
        <main>
            <Tabs defaultValue="destinations" className="w-full">
              <TabsList className="flex flex-wrap h-auto gap-1 mb-6 bg-background border">
                <TabsTrigger value="destinations">Destinations</TabsTrigger>
                <TabsTrigger value="hebergements">Hébergements</TabsTrigger>
                <TabsTrigger value="transports">Transports</TabsTrigger>
                <TabsTrigger value="voyages">Voyages & Croisières</TabsTrigger>
                <TabsTrigger value="excursions">Excursions</TabsTrigger>
                <TabsTrigger value="affaires">Tourisme d'Affaires</TabsTrigger>
              </TabsList>
              <TabsContent value="destinations"><DestinationsManager /></TabsContent>
              <TabsContent value="hebergements"><HebergementsManager /></TabsContent>
              <TabsContent value="transports"><TransportsManager /></TabsContent>
              <TabsContent value="voyages"><VoyagesCroisieresManager /></TabsContent>
              <TabsContent value="excursions"><ExcursionsManager /></TabsContent>
              <TabsContent value="affaires"><OffresAffairesManager /></TabsContent>
            </Tabs>
        </main>
      </div>
    </div>
  );
}
