'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DestinationsManager from '@/components/admin/destinations-manager';
import HebergementsManager from '@/components/admin/hebergements-manager';
import TransportsManager from '@/components/admin/transports-manager';
import VoyagesCroisieresManager from '@/components/admin/voyages-croisieres-manager';
import ExcursionsCircuitsManager from '@/components/admin/excursions-circuits-manager';
import OffresAffairesManager from '@/components/admin/offres-affaires-manager';
import PartenairesManager from '@/components/admin/partenaires-manager';
import AdminDashboardPage from '@/components/admin/dashboard-page';

export default function AdminTabs() {
  return (
    <Tabs defaultValue="hebergements" className="w-full">
      <TabsList className="flex flex-wrap h-auto gap-1 mb-6 bg-background border">
        <TabsTrigger value="destinations">Destinations</TabsTrigger>
        <TabsTrigger value="hebergements">Hébergements</TabsTrigger>
        <TabsTrigger value="transports">Transports</TabsTrigger>
        <TabsTrigger value="voyages">Voyages & Croisières</TabsTrigger>
        <TabsTrigger value="excursions">Excursions et circuits</TabsTrigger>
        <TabsTrigger value="affaires">Tourisme d&apos;Affaires</TabsTrigger>
        <TabsTrigger value="partenaires">Partenaires</TabsTrigger>
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
      </TabsList>
      <TabsContent value="destinations"><DestinationsManager /></TabsContent>
      <TabsContent value="hebergements"><HebergementsManager /></TabsContent>
      <TabsContent value="transports"><TransportsManager /></TabsContent>
      <TabsContent value="voyages"><VoyagesCroisieresManager /></TabsContent>
      <TabsContent value="excursions"><ExcursionsCircuitsManager /></TabsContent>
      <TabsContent value="affaires"><OffresAffairesManager /></TabsContent>
      <TabsContent value="partenaires"><PartenairesManager /></TabsContent>
      <TabsContent value="dashboard">
        <div className="min-h-[600px]">
          <AdminDashboardPage />
        </div>
      </TabsContent>
    </Tabs>
  );
}
