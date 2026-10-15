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
import dynamic from 'next/dynamic';
import { serviceLabel } from '@/lib/lead-labels';
import { getAuthInstance } from '@/lib/firebase';

const DashboardCharts = dynamic(() => import('@/components/admin/dashboard-charts'), {
  ssr: false,
  loading: () => (
    <div className="h-72 flex items-center justify-center text-muted-foreground border rounded-lg bg-card/50">
      <Loader2 className="h-6 w-6 animate-spin mr-2" /> Chargement des graphiques...
    </div>
  ),
});

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

      <DashboardCharts
        leadsPerDay={data.leadsPerDay}
        topServices={topServices}
        analyticsPerDay={analytics.perDay}
        sources={analytics.sources}
        pages={analytics.pages}
      />
    </div>
  );
}
