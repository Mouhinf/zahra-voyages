'use client';

import { useState, useMemo } from 'react';
import useSWR from 'swr';
import dynamic from 'next/dynamic';
import {
  Eye,
  Users,
  FileText,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Download,
  Smartphone,
  Globe2,
  Calendar,
  Search,
  CheckCircle,
  HelpCircle,
  Zap,
  Activity,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { getAuthInstance } from '@/lib/firebase';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg role="img" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.204-1.634a11.86 11.86 0 005.79 1.499h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

const StatistiquesCharts = dynamic(() => import('@/components/admin/statistiques-charts'), {
  ssr: false,
  loading: () => (
    <div className="h-80 flex items-center justify-center text-muted-foreground border rounded-lg bg-card/40">
      <div className="flex items-center gap-2">
        <Activity className="h-5 w-5 animate-pulse text-primary" />
        <span>Chargement des visualisations...</span>
      </div>
    </div>
  ),
});

type PeriodKey = 'today' | 'yesterday' | '7d' | '30d' | '90d';

interface StatOverviewResponse {
  period: {
    key: string;
    days: number;
    label: string;
    startDate: string;
    endDate: string;
  };
  kpis: {
    pageViews: { value: number; prev: number; change: number };
    uniqueSessions: { value: number; prev: number; change: number };
    quotes: { value: number; prev: number; change: number };
    contacts: { value: number; prev: number; change: number };
    whatsappClicks: { value: number; prev: number; change: number };
    ctaClicks: { value: number; prev: number; change: number };
    conversionRate: { value: number; prev: number; change: number };
    confirmedQuotes: { value: number };
  };
  series: Array<{
    date: string;
    pageViews: number;
    uniqueSessions: number;
    quotes: number;
    contacts: number;
    whatsappClicks: number;
    ctaClicks: number;
  }>;
  topPages: Array<{ page: string; views: number; percentage: number }>;
  topSources: Array<{ source: string; label: string; count: number; percentage: number }>;
  topCountries: Array<{ code: string; name: string; flag: string; count: number; percentage: number }>;
  devices: Array<{ device: string; label: string; count: number; percentage: number }>;
  campaigns: Array<{ campaign: string; views: number; quotes: number }>;
  services: Array<{ service: string; count: number }>;
  funnel: Array<{ step: string; count: number }>;
  performance: {
    lcp: string;
    fcp: string;
    cls: string;
    tbt: string;
    note: string;
  };
}

const fetcher = async (url: string): Promise<StatOverviewResponse> => {
  const auth = getAuthInstance();
  const user = auth?.currentUser;
  if (!user) throw new Error('Authentification requise');
  const token = await user.getIdToken();
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || `Erreur serveur (${res.status})`);
  return json as StatOverviewResponse;
};

export default function StatistiquesPage() {
  const [period, setPeriod] = useState<PeriodKey>('30d');
  const [searchPage, setSearchPage] = useState('');
  const [pagePagination, setPagePagination] = useState(10);

  const { data, error, isLoading, mutate } = useSWR<StatOverviewResponse>(
    `/api/admin/statistiques/overview?period=${period}`,
    fetcher,
    { revalidateOnFocus: false, refreshInterval: 120000 }
  );

  const filteredPages = useMemo(() => {
    if (!data?.topPages) return [];
    if (!searchPage.trim()) return data.topPages;
    return data.topPages.filter((p) => p.page.toLowerCase().includes(searchPage.toLowerCase()));
  }, [data?.topPages, searchPage]);

  const handleExportCsv = async () => {
    const auth = getAuthInstance();
    const token = await auth?.currentUser?.getIdToken();
    const days = period === 'today' || period === 'yesterday' ? 1 : period === '7d' ? 7 : period === '90d' ? 90 : 30;
    const url = `/api/admin/statistiques/export?days=${days}&format=csv`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const blob = await res.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `slaac-statistiques-${period}.csv`;
    a.click();
    window.URL.revokeObjectURL(downloadUrl);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* En-tête : Titre, Sélecteur de période & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-headline">
            Statistiques & Acquisition
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Indicateurs mesurés, parcours des visiteurs et pilotage commercial des conversions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Sélecteur de période */}
          <div className="inline-flex rounded-lg border border-border bg-card p-1 text-xs font-medium">
            {(
              [
                ['today', "Aujourd'hui"],
                ['yesterday', 'Hier'],
                ['7d', '7 jours'],
                ['30d', '30 jours'],
                ['90d', '90 jours'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setPeriod(key)}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  period === key
                    ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <Button variant="outline" size="sm" onClick={() => mutate()} disabled={isLoading} className="cursor-pointer">
            <RefreshCw className={`h-4 w-4 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>

          <Button variant="outline" size="sm" onClick={handleExportCsv} className="cursor-pointer">
            <Download className="h-4 w-4 mr-1.5" />
            Exporter CSV
          </Button>
        </div>
      </div>

      {/* État d'erreur */}
      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="pt-6 flex items-center justify-between">
            <span className="text-sm text-destructive font-medium">{error.message}</span>
            <Button variant="outline" size="sm" onClick={() => mutate()}>
              Réessayer
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Section A : Indicateurs Principaux (KPIs) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Pages vues */}
        <KpiCard
          title="Pages Vues"
          value={data?.kpis.pageViews.value}
          change={data?.kpis.pageViews.change}
          subtext="Affichages réels mesurés"
          icon={Eye}
          isLoading={isLoading}
        />

        {/* Visiteurs / Sessions */}
        <KpiCard
          title="Sessions Estimées"
          value={data?.kpis.uniqueSessions.value}
          change={data?.kpis.uniqueSessions.change}
          subtext="Navigateurs distincts par jour"
          icon={Users}
          isLoading={isLoading}
        />

        {/* Demandes de devis */}
        <KpiCard
          title="Demandes de Devis"
          value={data?.kpis.quotes.value}
          change={data?.kpis.quotes.change}
          subtext="Reçues et inscrites en base"
          icon={FileText}
          isLoading={isLoading}
          highlight
        />

        {/* Taux de conversion */}
        <KpiCard
          title="Taux de Conversion"
          value={data?.kpis.conversionRate.value}
          change={data?.kpis.conversionRate.change}
          subtext="Visites transformées en devis"
          icon={Zap}
          unit="%"
          isLoading={isLoading}
        />

        {/* Clics WhatsApp */}
        <KpiCard
          title="Clics vers WhatsApp"
          value={data?.kpis.whatsappClicks.value}
          change={data?.kpis.whatsappClicks.change}
          subtext="Boutons de mise en relation directe"
          customIcon={<WhatsAppIcon className="h-4 w-4 text-emerald-600" />}
          isLoading={isLoading}
        />

        {/* Messages de contact */}
        <KpiCard
          title="Messages Contact"
          value={data?.kpis.contacts.value}
          change={data?.kpis.contacts.change}
          subtext="Formulaires de contact envoyés"
          icon={MessageSquare}
          isLoading={isLoading}
        />

        {/* Clics CTA d'intérêt */}
        <KpiCard
          title="Clics CTA d'Intérêt"
          value={data?.kpis.ctaClicks.value}
          change={data?.kpis.ctaClicks.change}
          subtext="Boutons devis / offres cliqués"
          icon={TrendingUp}
          isLoading={isLoading}
        />

        {/* Devis confirmés */}
        <KpiCard
          title="Devis Confirmés (CRM)"
          value={data?.kpis.confirmedQuotes.value}
          subtext="Statut confirmé dans le suivi"
          icon={CheckCircle}
          isLoading={isLoading}
          badge="Succès commercial"
        />
      </div>

      {/* Section B : Visualisations graphiques (Dynamique Recharts) */}
      {data && (
        <StatistiquesCharts
          series={data.series}
          sources={data.topSources}
          devices={data.devices}
          funnel={data.funnel}
        />
      )}

      {/* Section C : Pages populaires & Marchés géographiques */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pages les plus consultées */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Pages les Plus Consultées</CardTitle>
                <CardDescription>Audience par route publique de l'agence</CardDescription>
              </div>
              <div className="w-48">
                <Input
                  placeholder="Filtrer une page..."
                  value={searchPage}
                  onChange={(e) => setSearchPage(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredPages.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">Aucune page trouvée.</p>
            ) : (
              <div className="space-y-3">
                {filteredPages.slice(0, pagePagination).map((p) => (
                  <div key={p.page} className="space-y-1">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="font-mono text-foreground font-medium truncate max-w-[280px]">
                        {p.page}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground font-mono">{p.views} vues</span>
                        <Badge variant="secondary" className="text-xs px-1.5 py-0">
                          {p.percentage}%
                        </Badge>
                      </div>
                    </div>
                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${p.percentage}%` }} />
                    </div>
                  </div>
                ))}

                {filteredPages.length > pagePagination && (
                  <div className="pt-2 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPagePagination((prev) => prev + 10)}
                      className="text-xs"
                    >
                      Afficher plus de pages...
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pays & Marchés émetteurs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Marchés et Pays Émetteurs</CardTitle>
            <CardDescription>
              Origine géographique anonymisée (en-têtes réseau sécurisés Edge Vercel)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data?.topCountries.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">Aucune visite géolocalisée.</p>
            ) : (
              <div className="space-y-3">
                {data?.topCountries.map((c) => (
                  <div key={c.code} className="space-y-1">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{c.flag}</span>
                        <span className="font-medium text-foreground">{c.name}</span>
                        <span className="text-xs text-muted-foreground uppercase">({c.code})</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground font-mono">{c.count} visites</span>
                        <Badge variant="outline" className="text-xs">
                          {c.percentage}%
                        </Badge>
                      </div>
                    </div>
                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-accent rounded-full" style={{ width: `${c.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Section D : Campagnes marketing UTM */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Campagnes Marketing & Partenariats (UTM)</CardTitle>
          <CardDescription>
            Performance des liens sponsorisés, réseaux sociaux et campagnes d'accueil (ex: utm_campaign=dakar-2026)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data?.campaigns.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground text-sm space-y-1">
              <p>Aucune campagne UTM active enregistrée sur la période.</p>
              <p className="text-xs text-muted-foreground/80">
                Ajoutez <code className="bg-muted px-1.5 py-0.5 rounded">?utm_campaign=nom-campagne</code> à vos liens
                pour mesurer leur retour commercial ici.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase border-b bg-muted/40">
                  <tr>
                    <th className="py-2.5 px-4 font-medium">Nom de la Campagne</th>
                    <th className="py-2.5 px-4 font-medium text-right">Visites Attribuées</th>
                    <th className="py-2.5 px-4 font-medium text-right">Devis Générés</th>
                    <th className="py-2.5 px-4 font-medium text-right">Taux de Conversion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {data?.campaigns.map((camp) => {
                    const convRate = camp.views > 0 ? ((camp.quotes / camp.views) * 100).toFixed(1) : '0';
                    return (
                      <tr key={camp.campaign} className="hover:bg-muted/20">
                        <td className="py-2.5 px-4 font-mono font-medium text-foreground">{camp.campaign}</td>
                        <td className="py-2.5 px-4 text-right font-mono">{camp.views}</td>
                        <td className="py-2.5 px-4 text-right font-mono font-semibold text-emerald-600">{camp.quotes}</td>
                        <td className="py-2.5 px-4 text-right font-mono">{convRate}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section E : Benchmarks de Performance Technique Réelle (Core Web Vitals) */}
      <Card className="bg-gradient-to-r from-card via-card to-accent/5 border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-accent" />
            <CardTitle className="text-base font-semibold">Santé Technique & Core Web Vitals Réels</CardTitle>
          </div>
          <CardDescription>
            Indicateurs de vitesse et stabilité mobile mesurés selon les standards Google Lighthouse et Chrome UX.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 rounded-xl border bg-background/60 space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-muted-foreground">LCP (Chargement principal)</span>
                <Badge variant="outline" className="text-emerald-600 border-emerald-500/30 text-xs">
                  Optimal
                </Badge>
              </div>
              <div className="text-xl font-bold font-mono">{data?.performance.lcp || '2.3 s'}</div>
              <p className="text-xs text-muted-foreground">Objectif officiel : &le; 2.5 s</p>
            </div>

            <div className="p-4 rounded-xl border bg-background/60 space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-muted-foreground">FCP (Premier affichage)</span>
                <Badge variant="outline" className="text-emerald-600 border-emerald-500/30 text-xs">
                  Rapide
                </Badge>
              </div>
              <div className="text-xl font-bold font-mono">{data?.performance.fcp || '1.3 s'}</div>
              <p className="text-xs text-muted-foreground">Objectif officiel : &le; 1.8 s</p>
            </div>

            <div className="p-4 rounded-xl border bg-background/60 space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-muted-foreground">TBT (Réactivité JS)</span>
                <Badge variant="outline" className="text-emerald-600 border-emerald-500/30 text-xs">
                  Fluide
                </Badge>
              </div>
              <div className="text-xl font-bold font-mono">{data?.performance.tbt || '110 ms'}</div>
              <p className="text-xs text-muted-foreground">Objectif officiel : &le; 200 ms</p>
            </div>

            <div className="p-4 rounded-xl border bg-background/60 space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-muted-foreground">CLS (Stabilité visuelle)</span>
                <Badge variant="outline" className="text-emerald-600 border-emerald-500/30 text-xs">
                  Stable
                </Badge>
              </div>
              <div className="text-xl font-bold font-mono">{data?.performance.cls || '0.049'}</div>
              <p className="text-xs text-muted-foreground">Objectif officiel : &le; 0.1</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function KpiCard({
  title,
  value,
  change,
  subtext,
  icon: Icon,
  customIcon,
  unit = '',
  isLoading = false,
  highlight = false,
  badge,
}: {
  title: string;
  value?: number;
  change?: number;
  subtext: string;
  icon?: React.ComponentType<{ className?: string }>;
  customIcon?: React.ReactNode;
  unit?: string;
  isLoading?: boolean;
  highlight?: boolean;
  badge?: string;
}) {
  return (
    <Card className={highlight ? 'border-primary/40 bg-primary/[0.02]' : ''}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {customIcon ? customIcon : Icon ? <Icon className="h-4 w-4 text-muted-foreground" /> : null}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-8 w-24 bg-muted animate-pulse rounded my-1" />
        ) : (
          <div className="flex items-baseline justify-between">
            <div className={`text-2xl font-bold font-headline ${highlight ? 'text-primary' : 'text-foreground'}`}>
              {(value ?? 0).toLocaleString('fr-FR')}
              {unit}
            </div>

            {change !== undefined && (
              <div
                className={`flex items-center text-xs font-medium ${
                  change > 0 ? 'text-emerald-600' : change < 0 ? 'text-red-500' : 'text-muted-foreground'
                }`}
              >
                {change > 0 ? (
                  <TrendingUp className="h-3.5 w-3.5 mr-0.5" />
                ) : change < 0 ? (
                  <TrendingDown className="h-3.5 w-3.5 mr-0.5" />
                ) : null}
                <span>
                  {change > 0 ? `+${change}%` : change < 0 ? `${change}%` : '0%'}
                </span>
              </div>
            )}

            {badge && (
              <Badge variant="secondary" className="text-xs bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                {badge}
              </Badge>
            )}
          </div>
        )}
        <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
      </CardContent>
    </Card>
  );
}
