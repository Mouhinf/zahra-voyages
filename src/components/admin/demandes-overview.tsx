'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, ChevronRight, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { serviceLabel } from '@/lib/lead-labels';
import {
  adminFetch, formatCreatedAt, isUnhandled, Row, STATUS, StatusBadge, str,
} from '@/components/admin/lead-ui';

// ---------------------------------------------------------------------------
// Vue d'ensemble CRM : compteurs réels (agrégations serveur), répartition par
// statut, évolution sur 30 jours et dernières demandes. Aucune donnée fictive.
// ---------------------------------------------------------------------------

interface CrmOverview {
  total: number;
  contactsTotal: number;
  statusCounts: Record<string, number>;
  unhandled: number;
  topServices: Array<{ service: string; count: number }>;
  perDay: Record<string, number>;
}

interface OverviewResponse {
  crm: CrmOverview;
  recent: Array<Row & { kind: 'quotes' | 'contacts' }>;
}

function lastDays(n: number): string[] {
  const days: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

function Kpi({ label, value, hint, alert }: { label: string; value: number; hint?: string; alert?: boolean }) {
  return (
    <Card className={alert && value > 0 ? 'border-destructive/50' : undefined}>
      <CardContent className="pt-6">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className={`mt-2 text-3xl font-semibold ${alert && value > 0 ? 'text-destructive' : 'text-primary'}`}>{value}</p>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  );
}

export default function DemandesOverview() {
  const [data, setData] = useState<OverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData((await adminFetch('/api/admin/leads/overview')) as unknown as OverviewResponse);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading && !data) {
    return <div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (error && !data) {
    return (
      <Card className="border-destructive">
        <CardContent className="flex items-center justify-between gap-4 pt-6">
          <span className="text-destructive">{error}</span>
          <Button onClick={load} variant="outline" size="sm"><RefreshCw className="mr-2 h-4 w-4" /> Réessayer</Button>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;
  const { crm, recent } = data;
  const sc = crm.statusCounts;
  const inProgress = (sc.contacte ?? 0) + (sc.en_discussion ?? 0) + (sc.devis_envoye ?? 0);
  const totalLeads = crm.total + crm.contactsTotal;
  const days = lastDays(30);
  const perDay = days.map((d) => ({ date: d, count: crm.perDay[d] ?? 0 }));
  const maxDay = Math.max(1, ...perDay.map((d) => d.count));
  const maxStatus = Math.max(1, ...STATUS.map((s) => sc[s.value] ?? 0));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {totalLeads} demande{totalLeads > 1 ? 's' : ''} enregistrée{totalLeads > 1 ? 's' : ''} : {crm.total} devis et {crm.contactsTotal} message{crm.contactsTotal > 1 ? 's' : ''} de contact.
        </p>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm"><Link href="/admin/demandes/devis">Devis</Link></Button>
          <Button asChild variant="outline" size="sm"><Link href="/admin/demandes/contacts">Messages</Link></Button>
          <Button asChild variant="outline" size="sm"><Link href="/admin/demandes/newsletter">Newsletter</Link></Button>
          <Button onClick={load} variant="ghost" size="sm" disabled={loading} aria-label="Rafraîchir">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi label="Nouvelles" value={sc.nouveau ?? 0} hint="statut « nouveau »" />
        <Kpi label="En cours" value={inProgress} hint="contactées, en discussion ou devis envoyé" />
        <Kpi label="Confirmées" value={sc.confirme ?? 0} />
        <Kpi label="Sans réponse" value={crm.unhandled} hint="nouvelles depuis plus de 48 h (90 derniers jours)" alert />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Répartition par statut</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {STATUS.map((s) => {
              const n = sc[s.value] ?? 0;
              return (
                <div key={s.value} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{s.label}</span>
                    <span className="font-medium">{n}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted" aria-hidden>
                    <div className="h-2 rounded-full bg-primary" style={{ width: `${(n / maxStatus) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Services demandés (30 derniers jours)</CardTitle></CardHeader>
          <CardContent>
            {crm.topServices.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune demande de devis sur les 30 derniers jours.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {crm.topServices.map((s) => (
                  <li key={s.service} className="flex justify-between gap-4">
                    <span className="truncate">{serviceLabel(s.service)}</span>
                    <span className="font-medium">{s.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Demandes reçues par jour (30 derniers jours)</CardTitle></CardHeader>
        <CardContent>
          <div className="flex h-40 items-end gap-1" role="img" aria-label="Demandes par jour sur 30 jours">
            {perDay.map((d) => (
              <div
                key={d.date}
                className="flex-1 rounded-t bg-primary/80"
                style={{ height: `${Math.max(d.count > 0 ? 6 : 1, (d.count / maxDay) * 100)}%`, opacity: d.count > 0 ? 1 : 0.2 }}
                title={`${d.date} : ${d.count}`}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>{perDay[0].date}</span>
            <span>{perDay[perDay.length - 1].date}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Dernières demandes</CardTitle>
          {crm.unhandled > 0 && (
            <span className="inline-flex items-center gap-1 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4" aria-hidden /> {crm.unhandled} à traiter en priorité
            </span>
          )}
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune demande reçue pour le moment.</p>
          ) : (
            <ul className="divide-y rounded-md border">
              {recent.map((r) => {
                const row = r as Row & { kind: 'quotes' | 'contacts' };
                const href = `/admin/demandes/${row.kind === 'quotes' ? 'devis' : 'contacts'}/${row.id}`;
                return (
                  <li key={`${row.kind}-${row.id}`}>
                    <Link href={href} className="flex flex-wrap items-center gap-2 px-4 py-3 text-sm hover:bg-muted/40">
                      <StatusBadge value={str(row.crmStatus) || 'nouveau'} />
                      <span className="font-medium">{str(row.name) || '—'}</span>
                      <span className="text-muted-foreground">
                        {row.kind === 'quotes' ? serviceLabel(str(row.service)) : 'Message de contact'}
                      </span>
                      {isUnhandled(row) && <AlertTriangle className="h-4 w-4 text-destructive" aria-label="non traité" />}
                      <span className="ml-auto text-xs text-muted-foreground">{formatCreatedAt(row.createdAt)}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
