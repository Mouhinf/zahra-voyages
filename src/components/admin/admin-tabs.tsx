'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React, { Suspense } from 'react';
const DestinationsManager = React.lazy(() => import('@/components/admin/destinations-manager'));
const HebergementsManager = React.lazy(() => import('@/components/admin/hebergements-manager'));
const TransportsManager = React.lazy(() => import('@/components/admin/transports-manager'));
const VoyagesCroisieresManager = React.lazy(() => import('@/components/admin/voyages-croisieres-manager'));
const ExcursionsCircuitsManager = React.lazy(() => import('@/components/admin/excursions-circuits-manager'));
const OffresAffairesManager = React.lazy(() => import('@/components/admin/offres-affaires-manager'));
const PartenairesManager = React.lazy(() => import('@/components/admin/partenaires-manager'));
const AdminDashboardPage = React.lazy(() => import('@/components/admin/dashboard-page'));


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
