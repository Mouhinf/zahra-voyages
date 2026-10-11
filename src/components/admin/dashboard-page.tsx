'use client';

// ---------------------------------------------------------------------------
// Tableau de bord admin — uniquement des données RÉELLES :
//   - prospects / demandes (CRM) : total, en attente, non traités > 48 h,
//     confirmés, services les plus demandés, évolution sur 30 jours
//   - offres publiées par module
//   - visites réelles (balise analytics), pages et sources
// Aucune « réservation » ni revenu fictif : ces indicateurs provenaient d'un
// seed de données de test et ont été retirés.
// ---------------------------------------------------------------------------

import useSWR from 'swr';
import { Loader2, RefreshCw, AlertCircle, Inbox, Plane, Eye, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { serviceLabel } from '@/lib/lead-labels';
import { getAuthInstance } from '@/lib/firebase';

const CHART_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6'];

type Overview = {
  crm: {
    totalLeads: number;
    quotes: number;
    contacts: number;
    statusCounts: Record<string, number>;
    unhandled: number;
    topServices: Array<{ service: string; count: number }>;
  };
  offers: Array<{ key: string; label: string; published: number }>;
  analytics: {
    totalVisits: number;
    pages: Array<{ page: string; count: number }>;
    sources: Array<{ source: string; count: number }>;
    perDay: Array<{ date: string; count: number }>;
  };
  leadsPerDay: Array<{ date: string; count: number }>;
};

const fetcher = async (url: string): Promise<Overview> => {
  const auth = getAuthInstance();
  const user = auth?.currentUser;
  if (!user) throw new Error('Non connecté');
  const token = await user.getIdToken();
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((body as { error?: string })?.error || `Erreur ${res.status}`);
  return body as Overview;
};

// Complète une série journalière sur 30 jours (zéro pour les jours sans donnée).
function zeroFill30(series: Array<{ date: string; count: number }>): Array<{ date: string; count: number }> {
  const map = new Map(series.map((p) => [p.date, p.count]));
  const out: Array<{ date: string; count: number }> = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    out.push({ date: key.slice(5), count: map.get(key) ?? 0 });
  }
  return out;
}

function KpiTile({
  title, value, icon: Icon, sub, alert = false,
}: {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  sub?: string;
  alert?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${alert ? 'text-destructive' : 'text-muted-foreground'}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${alert ? 'text-destructive' : ''}`}>{value.toLocaleString('fr-FR')}</div>
        {sub && <p className={`text-xs ${alert ? 'text-destructive' : 'text-muted-foreground'}`}>{sub}</p>}
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const { data, error, mutate, isLoading } = useSWR<Overview>('/api/admin/dashboard/overview', fetcher, {
    refreshInterval: 300000,
    revalidateOnFocus: true,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6 flex items-center justify-between gap-4">
          <span className="text-destructive">{error instanceof Error ? error.message : 'Chargement impossible'}</span>
          <Button onClick={() => mutate()} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" /> Réessayer
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { crm, offers, analytics } = data;
  const pending = crm.statusCounts?.nouveau ?? 0;
  const confirmed = crm.statusCounts?.confirme ?? 0;
  const topServices = crm.topServices.map((s) => ({ name: serviceLabel(s.service), count: s.count }));

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => mutate()} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" /> Rafraîchir
        </Button>
      </div>

      {/* Indicateurs réels */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiTile title="Prospects (demandes)" value={crm.totalLeads} icon={Inbox} sub={`${crm.quotes} devis · ${crm.contacts} messages`} />
        <KpiTile title="Nouvelles demandes" value={pending} icon={Plane} sub="En attente de premier contact" />
        <KpiTile
          title="Non traitées > 48 h"
          value={crm.unhandled}
          icon={AlertCircle}
          alert={crm.unhandled > 0}
          sub={crm.unhandled > 0 ? 'À relancer en priorité' : 'Rien à signaler'}
        />
        <KpiTile title="Devis confirmés" value={confirmed} icon={CheckCircle2} sub={`${confirmed}/${crm.totalLeads} demandes`} />
        <KpiTile title="Visites (site)" value={analytics.totalVisits} icon={Eye} sub="Mesures anonymisées" />
      </div>

      {/* Offres publiées par module */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Offres publiées par module</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {offers.map((o) => (
            <Badge key={o.key} variant="outline" className="text-sm px-3 py-1">
              {o.label} : {o.published}
            </Badge>
          ))}
        </CardContent>
      </Card>

      <Tabs defaultValue="demandes" className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="demandes">Demandes (30 j)</TabsTrigger>
          <TabsTrigger value="services">Services demandés</TabsTrigger>
          <TabsTrigger value="visites">Visites (30 j)</TabsTrigger>
          <TabsTrigger value="sources">Sources de trafic</TabsTrigger>
          <TabsTrigger value="pages">Pages populaires</TabsTrigger>
        </TabsList>

        <TabsContent value="demandes" className="mt-4">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={zeroFill30(data.leadsPerDay)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis allowDecimals={false} fontSize={12} />
              <Tooltip />
              <Area type="monotone" dataKey="count" name="Demandes" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="services" className="mt-4">
          {topServices.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Aucune demande enregistrée pour le moment.</p>
          ) : (
            <ResponsiveContainer width="100%" height={Math.max(220, topServices.length * 48)}>
              <BarChart data={topServices} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" allowDecimals={false} fontSize={12} />
                <YAxis type="category" dataKey="name" width={180} fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" name="Demandes" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </TabsContent>

        <TabsContent value="visites" className="mt-4">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={zeroFill30(analytics.perDay)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis allowDecimals={false} fontSize={12} />
              <Tooltip />
              <Area type="monotone" dataKey="count" name="Visites" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="sources" className="mt-4">
          {analytics.sources.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Aucune visite enregistrée pour le moment.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={analytics.sources} dataKey="count" nameKey="source" cx="50%" cy="50%" outerRadius={100} label>
                  {analytics.sources.map((entry, index) => (
                    <Cell key={entry.source} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </TabsContent>

        <TabsContent value="pages" className="mt-4">
          {analytics.pages.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Aucune visite enregistrée pour le moment.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.pages}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="page" fontSize={12} />
                <YAxis allowDecimals={false} fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" name="Visites" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
