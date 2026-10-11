'use client';

// ---------------------------------------------------------------------------
// Demandes reçues (admin) : devis, messages de contact, inscriptions
// newsletter. Chaque onglet interroge son endpoint protégé avec le token
// de la session courante — l'agence retrouve ici toute demande envoyée
// depuis le site public.
// ---------------------------------------------------------------------------

import { useCallback, useEffect, useState } from 'react';
import { Loader2, RefreshCw, MailWarning } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAuthInstance } from '@/lib/firebase';

type Row = Record<string, unknown> & { id: string };

function str(v: unknown): string {
  return typeof v === 'string' ? v : v == null ? '' : String(v);
}

function formatCreatedAt(v: unknown): string {
  if (typeof v === 'string') {
    const d = new Date(v);
    return isNaN(d.getTime()) ? v : d.toLocaleString('fr-FR');
  }
  if (v && typeof v === 'object' && 'seconds' in v) {
    const seconds = Number((v as { seconds: unknown }).seconds);
    if (Number.isFinite(seconds)) return new Date(seconds * 1000).toLocaleString('fr-FR');
  }
  return '';
}

async function fetchList(url: string): Promise<Row[]> {
  const auth = getAuthInstance();
  const user = auth?.currentUser;
  if (!user) throw new Error('Non connecté');
  const token = await user.getIdToken();
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.error || 'Erreur serveur');
  return (body?.items as Row[]) ?? [];
}

function NotifyBadge({ value }: { value: unknown }) {
  const v = str(value);
  if (!v || v === 'pending') return null;
  if (v === 'sent') return <Badge variant="secondary">email envoyé</Badge>;
  if (v.startsWith('failed:')) {
    return (
      <Badge variant="destructive" className="gap-1">
        <MailWarning className="h-3 w-3" /> email non envoyé ({v.slice(7)})
      </Badge>
    );
  }
  return null;
}

function LoadingOrError({ loading, error, onRetry }: { loading: boolean; error: string | null; onRetry: () => void }) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6 flex items-center justify-between gap-4">
          <span className="text-destructive">{error}</span>
          <Button onClick={onRetry} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" /> Réessayer
          </Button>
        </CardContent>
      </Card>
    );
  }
  return null;
}

function QuotesList() {
  const [items, setItems] = useState<Row[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await fetchList('/api/admin/quotes'));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={load} variant="outline" size="sm" disabled={loading}>
          <RefreshCw className="mr-2 h-4 w-4" /> Rafraîchir
        </Button>
      </div>
      <LoadingOrError loading={loading} error={error} onRetry={load} />
      {items && items.length === 0 && (
        <Card><CardContent className="pt-6 text-muted-foreground">Aucun devis reçu pour le moment.</CardContent></Card>
      )}
      {items?.map((it) => (
        <Card key={it.id}>
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-semibold">{str(it.reference) || it.id}</span>
              <Badge variant="outline">{str(it.service) || '—'}</Badge>
              <Badge variant={str(it.status) === 'new' ? 'default' : 'secondary'}>{str(it.status) || 'new'}</Badge>
              <NotifyBadge value={it.notifyStatus} />
              <span className="ml-auto text-sm text-muted-foreground">{formatCreatedAt(it.createdAt)}</span>
            </div>
            <div className="font-medium">{str(it.name)} · {str(it.phone)}{str(it.email) ? ` · ${str(it.email)}` : ''}</div>
            <div className="text-sm text-muted-foreground">
              Destination : {str(it.destination) || '—'} · Voyageurs : {str(it.travelers) || '—'}
              {str(it.source) ? ` · Source : ${str(it.source)}` : ''}
            </div>
            {str(it.message) && <div className="mt-2 text-sm whitespace-pre-wrap">{str(it.message)}</div>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ContactsList() {
  const [items, setItems] = useState<Row[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await fetchList('/api/admin/contacts'));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={load} variant="outline" size="sm" disabled={loading}>
          <RefreshCw className="mr-2 h-4 w-4" /> Rafraîchir
        </Button>
      </div>
      <LoadingOrError loading={loading} error={error} onRetry={load} />
      {items && items.length === 0 && (
        <Card><CardContent className="pt-6 text-muted-foreground">Aucun message reçu pour le moment.</CardContent></Card>
      )}
      {items?.map((it) => (
        <Card key={it.id}>
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-semibold">{str(it.name)}</span>
              {str(it.notifyStatus)?.startsWith('failed:') && <NotifyBadge value={it.notifyStatus} />}
              <span className="ml-auto text-sm text-muted-foreground">{formatCreatedAt(it.createdAt)}</span>
            </div>
            <div className="text-sm text-muted-foreground">{str(it.email)}{str(it.phone) ? ` · ${str(it.phone)}` : ''}</div>
            <div className="mt-2 text-sm whitespace-pre-wrap">{str(it.message)}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function NewsletterList() {
  const [items, setItems] = useState<Row[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await fetchList('/api/admin/newsletter'));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={load} variant="outline" size="sm" disabled={loading}>
          <RefreshCw className="mr-2 h-4 w-4" /> Rafraîchir
        </Button>
      </div>
      <LoadingOrError loading={loading} error={error} onRetry={load} />
      {items && items.length === 0 && (
        <Card><CardContent className="pt-6 text-muted-foreground">Aucun inscrit pour le moment.</CardContent></Card>
      )}
      {items?.map((it) => (
        <Card key={it.id}>
          <CardContent className="pt-6 flex items-center gap-3">
            <span className="font-medium">{str(it.email)}</span>
            <Badge variant="secondary">{str(it.status) || 'subscribed'}</Badge>
            <span className="ml-auto text-sm text-muted-foreground">{formatCreatedAt(it.createdAt)}</span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function RequestsManager() {
  return (
    <Tabs defaultValue="devis" className="w-full">
      <TabsList className="flex flex-wrap h-auto gap-1 mb-6 bg-background border">
        <TabsTrigger value="devis">Devis</TabsTrigger>
        <TabsTrigger value="messages">Messages de contact</TabsTrigger>
        <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
      </TabsList>
      <TabsContent value="devis"><QuotesList /></TabsContent>
      <TabsContent value="messages"><ContactsList /></TabsContent>
      <TabsContent value="newsletter"><NewsletterList /></TabsContent>
    </Tabs>
  );
}
