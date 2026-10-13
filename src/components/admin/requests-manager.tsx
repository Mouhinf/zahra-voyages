'use client';

// ---------------------------------------------------------------------------
// CRM (admin) : demandes clients — devis et messages de contact, plus les
// inscriptions newsletter. Recherche, filtres, fiche détaillée, statuts,
// notes internes, responsable attribué, historique horodaté, contact
// WhatsApp / email préparé, export CSV autorisé.
//
// Toutes les modifications passent par PATCH /api/admin/leads (token admin
// vérifié côté serveur) ; l'historique est tenu côté serveur.
// ---------------------------------------------------------------------------

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, RefreshCw, Search, Download, AlertTriangle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { getAuthInstance } from '@/lib/firebase';
import { serviceLabel } from '@/lib/lead-labels';
import {
  adminFetch, formatCreatedAt, isUnhandled, NotifyBadge, Row, STATUS, StatusBadge, str,
} from '@/components/admin/lead-ui';

// ---------------------------------------------------------------------------
// Liste CRM générique avec recherche / filtres
// ---------------------------------------------------------------------------

function useCrmList(url: string) {
  const [items, setItems] = useState<Row[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const body = await adminFetch(url);
      setItems((body.items as Row[]) ?? []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    load();
  }, [load]);

  return { items, loading, error, load };
}

function LeadTable({
  items, kind, onOpen,
}: {
  items: Row[];
  kind: 'quotes' | 'contacts';
  onOpen: (it: Row) => void;
}) {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [onlyUnhandled, setOnlyUnhandled] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((it) => {
      if (statusFilter !== 'all' && (str(it.crmStatus) || 'nouveau') !== statusFilter) return false;
      if (onlyUnhandled && !isUnhandled(it)) return false;
      if (!q) return true;
      const haystack = [str(it.reference), str(it.name), str(it.phone), str(it.email), str(it.destination), str(it.message), str(it.service)]
        .join(' ').toLowerCase();
      return haystack.includes(q);
    });
  }, [items, query, statusFilter, onlyUnhandled]);

  const unhandledCount = items.filter(isUnhandled).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher (nom, téléphone, référence…)" className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            {STATUS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button
          variant={onlyUnhandled ? 'default' : 'outline'}
          size="sm"
          onClick={() => setOnlyUnhandled((v) => !v)}
          className={onlyUnhandled ? '' : unhandledCount > 0 ? 'text-destructive border-destructive/40' : ''}
        >
          <AlertTriangle className="mr-2 h-4 w-4" /> Non traités ({unhandledCount})
        </Button>
      </div>

      {filtered.length === 0 ? (
        <Card><CardContent className="pt-6 text-muted-foreground">
          {items.length === 0 ? 'Aucune demande reçue pour le moment.' : 'Aucune demande ne correspond aux filtres.'}
        </CardContent></Card>
      ) : (
        <div className="rounded-lg border divide-y">
          {filtered.map((it) => {
            const status = str(it.crmStatus) || 'nouveau';
            return (
              <button
                key={it.id}
                type="button"
                onClick={() => onOpen(it)}
                className="w-full text-left px-4 py-3 hover:bg-muted/40 transition-colors"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge value={status} />
                  <span className="font-semibold">{str(it.name)}</span>
                  {kind === 'quotes' && <Badge variant="outline">{serviceLabel(str(it.service))}</Badge>}
                  {kind === 'quotes' && <span className="text-xs text-muted-foreground">{str(it.reference)}</span>}
                  {isUnhandled(it) && <Badge variant="destructive" className="gap-1"><AlertTriangle className="h-3 w-3" /> &gt; 48 h</Badge>}
                  <NotifyBadge value={it.notifyStatus} />
                  <span className="ml-auto text-sm text-muted-foreground">{formatCreatedAt(it.createdAt)}</span>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="text-sm text-muted-foreground mt-0.5">
                  {str(it.phone)}{str(it.email) ? ` · ${str(it.email)}` : ''}
                  {str(it.destination) ? ` · ${str(it.destination)}` : ''}
                  {str(it.assignee) ? ` · responsable : ${str(it.assignee)}` : ''}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const PAGE_SIZE = 50;

/** Liste paginée des demandes : première page, puis « Charger plus » (curseur serveur). */
function useLeadPages(kind: 'quotes' | 'contacts') {
  const [items, setItems] = useState<Row[] | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(
    (cursor?: string) => {
      const qs = new URLSearchParams({ limit: String(PAGE_SIZE) });
      if (cursor) qs.set('cursor', cursor);
      return adminFetch(`/api/admin/${kind}?${qs.toString()}`);
    },
    [kind],
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const body = await fetchPage();
      setItems((body.items as Row[]) ?? []);
      setNextCursor((body.nextCursor as string | null) ?? null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  }, [fetchPage]);

  const loadMore = useCallback(async () => {
    if (!nextCursor) return;
    setLoadingMore(true);
    try {
      const body = await fetchPage(nextCursor);
      setItems((prev) => [...(prev ?? []), ...((body.items as Row[]) ?? [])]);
      setNextCursor((body.nextCursor as string | null) ?? null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setLoadingMore(false);
    }
  }, [fetchPage, nextCursor]);

  useEffect(() => {
    load();
  }, [load]);

  return { items, nextCursor, loading, loadingMore, error, load, loadMore };
}

const DETAIL_PATH = { quotes: 'devis', contacts: 'contacts' } as const;

function LeadSection({ kind, emptyLabel }: { kind: 'quotes' | 'contacts'; emptyLabel?: string }) {
  const router = useRouter();
  const { items, nextCursor, loading, loadingMore, error, load, loadMore } = useLeadPages(kind);
  const [exporting, setExporting] = useState(false);

  async function exportCsv() {
    setExporting(true);
    try {
      const auth = getAuthInstance();
      const user = auth?.currentUser;
      if (!user) throw new Error('Non connecté');
      const token = await user.getIdToken();
      const res = await fetch('/api/admin/leads/export', { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error(`Export refusé (${res.status})`);
      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `demandes-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(a.href);
    } catch (e) {
      console.error(e);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between gap-2">
        <Button onClick={load} variant="outline" size="sm" disabled={loading}>
          <RefreshCw className="mr-2 h-4 w-4" /> Rafraîchir
        </Button>
        <Button onClick={exportCsv} variant="outline" size="sm" disabled={exporting}>
          {exporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
          Exporter CSV
        </Button>
      </div>

      {loading && (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      )}
      {!loading && error && (
        <Card className="border-destructive">
          <CardContent className="pt-6 flex items-center justify-between gap-4">
            <span className="text-destructive">{error}</span>
            <Button onClick={load} variant="outline" size="sm"><RefreshCw className="mr-2 h-4 w-4" /> Réessayer</Button>
          </CardContent>
        </Card>
      )}
      {!loading && items && (
        <LeadTable
          items={items}
          kind={kind}
          onOpen={(it) => router.push(`/admin/demandes/${DETAIL_PATH[kind]}/${it.id}`)}
        />
      )}
      {!loading && nextCursor && (
        <div className="flex justify-center">
          <Button onClick={loadMore} variant="outline" disabled={loadingMore}>
            {loadingMore && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Charger plus de demandes
          </Button>
        </div>
      )}
      {emptyLabel && !loading && !error && items?.length === 0 && (
        <p className="text-sm text-muted-foreground">{emptyLabel}</p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Newsletter (consultation simple)
// ---------------------------------------------------------------------------

function NewsletterList() {
  const { items, loading, error, load } = useCrmList('/api/admin/newsletter');

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={load} variant="outline" size="sm" disabled={loading}>
          <RefreshCw className="mr-2 h-4 w-4" /> Rafraîchir
        </Button>
      </div>
      {loading && <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
      {!loading && error && (
        <Card className="border-destructive">
          <CardContent className="pt-6 flex items-center justify-between gap-4">
            <span className="text-destructive">{error}</span>
            <Button onClick={load} variant="outline" size="sm"><RefreshCw className="mr-2 h-4 w-4" /> Réessayer</Button>
          </CardContent>
        </Card>
      )}
      {!loading && !error && items?.length === 0 && (
        <Card><CardContent className="pt-6 text-muted-foreground">Aucun inscrit pour le moment.</CardContent></Card>
      )}
      {!loading && !error && items && items.length > 0 && (
        <div className="rounded-lg border divide-y">
          {items.map((it) => (
            <div key={it.id} className="px-4 py-3 flex items-center gap-3">
              <span className="font-medium">{str(it.email)}</span>
              <Badge variant="secondary">{str(it.status) || 'subscribed'}</Badge>
              <span className="ml-auto text-sm text-muted-foreground">{formatCreatedAt(it.createdAt)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export type RequestsTab = 'devis' | 'messages' | 'newsletter';

const TAB_PATHS: Record<RequestsTab, string> = {
  devis: '/admin/demandes/devis',
  messages: '/admin/demandes/contacts',
  newsletter: '/admin/demandes/newsletter',
};

/**
 * Onglets CRM. `activeTab` vient de la route (chaque onglet est une URL) :
 * changer d'onglet navigue vers la route correspondante.
 */
export default function RequestsManager({ activeTab = 'devis' }: { activeTab?: RequestsTab }) {
  const router = useRouter();
  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => router.push(TAB_PATHS[value as RequestsTab])}
      className="w-full"
    >
      <TabsList className="flex flex-wrap h-auto gap-1 mb-6 bg-background border">
        <TabsTrigger value="devis">Devis</TabsTrigger>
        <TabsTrigger value="messages">Messages de contact</TabsTrigger>
        <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
      </TabsList>
      <TabsContent value="devis">
        <LeadSection kind="quotes" />
      </TabsContent>
      <TabsContent value="messages">
        <LeadSection kind="contacts" />
      </TabsContent>
      <TabsContent value="newsletter"><NewsletterList /></TabsContent>
    </Tabs>
  );
}
