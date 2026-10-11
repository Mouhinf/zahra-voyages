'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { Loader2, RefreshCw, Download, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import { getAuthInstance } from '@/lib/firebase';

// Palette des graphiques (sources de trafic notamment).
const CHART_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

// Types from firebase helpers
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

const fetcher = async (url: string): Promise<AnalyticsSummary> => {
  const auth = getAuthInstance();
  const token = auth?.currentUser ? await auth.currentUser.getIdToken() : undefined;
  const res = await fetch(url, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Failed to fetch data');
  }
  return res.json();
};

export default function AdminDashboardPage() {
  const [alerts, setAlerts] = useState({ revenue: false, visits: false });
  const { data: summary, mutate, isLoading } = useSWR<AnalyticsSummary>('/api/dashboard/stats', fetcher, {
    refreshInterval: 300000,
    revalidateOnFocus: true,
    onSuccess: (data) => {
      if (data?.revenue && data.revenue > 5000) setAlerts(prev => ({ ...prev, revenue: true }));
      if (data?.topVisitsPerDay && data.topVisitsPerDay[0]?.count && data.topVisitsPerDay[0].count > 1000) {
        setAlerts(prev => ({ ...prev, visits: true }));
      }
    },
  });

  const handleSeed = async () => {
    try {
      const auth = getAuthInstance();
      const token = auth?.currentUser ? await auth.currentUser.getIdToken() : undefined;
      const res = await fetch('/api/admin/dashboard/seed', {
        method: 'POST',
        ...(token && { headers: { Authorization: `Bearer ${token}` } }),
      });
      if (res.ok) {
        toast.success('Données de test générées');
        mutate();
      } else {
        toast.error('Erreur lors du seed');
      }
    } catch {
      toast.error('Erreur réseau');
    }
  };

  const handleExport = async () => {
    try {
      const auth = getAuthInstance();
      const token = auth?.currentUser ? await auth.currentUser.getIdToken() : undefined;
      const res = await fetch('/api/admin/dashboard/export', {
        method: 'POST',
        ...(token && { headers: { Authorization: `Bearer ${token}` } }),
      });
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
    } catch {
      toast.error('Erreur réseau');
    }
  };

  if (isLoading || !summary) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={handleSeed}>
          <RefreshCw className="mr-2 h-4 w-4" /> Données de test
        </Button>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" /> Exporter CSV
        </Button>
      </div>
      {alerts.revenue && (
        <Badge variant="destructive" className="mb-4">
          <AlertCircle className="mr-2 h-4 w-4" />
          Revenu supérieur à 5 000 FCFA
        </Badge>
      )}
      {alerts.visits && (
        <Badge variant="destructive" className="mb-4">
          <AlertCircle className="mr-2 h-4 w-4" />
          Plus de 1 000 visites aujourd&apos;hui
        </Badge>
      )}

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
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" name="Chiffre d'affaires (FCFA)" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="sources" className="mt-4">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={summary.sources} dataKey="count" nameKey="source" cx="50%" cy="50%" outerRadius={100} label>
                {summary.sources.map((entry, index) => (
                  <Cell key={entry.source} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="pages" className="mt-4">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={summary.pages}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="page" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="Visites" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="destinations" className="mt-4">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={summary.topDestinations}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="destination" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="visits" name="Visites" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </TabsContent>
      </Tabs>
    </div>
  );
}
