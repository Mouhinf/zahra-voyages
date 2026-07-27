'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { Loader2, RefreshCw, Download, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PieChart, Pie, Cell } from 'recharts';
import { AreaChart, BarChart, LineChart, PieChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Pie } from 'recharts';
import { toast } from 'sonner';

// Types from firebase helpers (we'll define them here for client use)
interface AnalyticsSummary {
  totalVisits: number;
  totalBookings: number;
  conversionRate: number;
  revenue: number;
  uniqueVisitors: number;
  pages: Array<{ page: string; count: number }>;
  sources: Array<{ source: string; count: number }>;
  topTransports: Array<{ type: string; count: number }>;
  topDestinations: Array<{ destination: string; visits: number }>;
  topOffers: number;
  topVisitsPerDay: Array<{ date: string; count: number }>;
  topRevenuePerDay: Array<{ date: string; revenue: number }>;
  topUniqueVisitorsPerDay: Array<{ date: string; count: number }>;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [alerts, setAlerts] = useState({ revenue: false, visits: false });
  const { data: summary, mutate, isLoading } = useSWR<AnalyticsSummary>('/api/dashboard/stats', fetcher, {
    refreshInterval: 300000, // 5 minutes
    revalidateOnFocus: true,
    onSuccess: (data) => {
      // Check alerts
      if (data?.revenue && data.revenue > 5000) setAlerts(prev => ({ ...prev, revenue: true }));
      if (data?.topVisitsPerDay && data.topVisitsPerDay[0]?.count && data.topVisitsPerDay[0].count > 1000) {
        setAlerts(prev => ({ ...prev, visits: true }));
      }
    },
  });

  const fetcher = async (url: string): Promise<AnalyticsSummary> => {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch data');
      }
      return await res.json();
    } catch (err) {
      console.error('SWR fetch error:', err);
      throw err;
    }
  };

  const handleSeed = async () => {
    try {
      const res = await fetch('/admin/dashboard/api/seed', { method: 'POST' });
      if (res.ok) {
        toast.success('Données de test générées avec succès');
        mutate(); // Refresh data
      } else {
        toast.error('Erreur lors de la génération des données');
      }
    } catch (e) {
      toast.error('Erreur réseau');
    }
  };

  const handleExport = async () => {
    try {
      const res = await fetch('/admin/dashboard/api/export', { method: 'POST' });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dashboard-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success('Export CSV réussi');
      } else {
        toast.error('Erreur lors de l\'export');
      }
    } catch (e) {
      toast.error('Erreur réseau');
    }
  };

  if (isLoading || !summary) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alert Badges */}
      {alerts.revenue && (
        <Badge variant="destructive" className="mb-4">
          <AlertCircle className="mr-2 h-4 w-4" />
          Revenu supérieur à 5 000 FCFA
        </Badge>
      )}
      {alerts.visits && (
        <Badge variant="destructive" className="mb-4">
          <AlertCircle className="mr-2 h-4 w-4" />
          Plus de 1 000 visites aujourd\'hui
        </Badge>
      )}

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visites Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalVisits.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Réservations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalBookings.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chiffre d'Affaires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.revenue.toLocaleString()} FCFA</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold">Taux de Conversion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.conversionRate.toFixed(2)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="visits" className="w-full">
        <TabsList>
          <TabsTrigger value="visits">Visites par Jour</TabsTrigger>
          <TabsTrigger value="revenue">Chiffre d'Affaires par Jour</TabsTrigger>
          <TabsTrigger value="sources">Sources de Trafic</TabsTrigger>
          <TabsTrigger value="pages">Pages Populaires</TabsTrigger>
          <TabsTrigger value="destinations">Destinations</TabsTrigger>
        </TabsList>

        <TabsContent value="visits" className="mt-4">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={summary.topVisitsPerDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="count" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="revenue" className="mt-4">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={summary.topRevenuePerDay}>
              <CartesianGrid strokeDasharray="3 3" />
      
    </div>
  );
}
