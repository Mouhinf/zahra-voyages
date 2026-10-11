'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// ---------------------------------------------------------------------------
// CRM devis (page admin).
// Avant correction : l'utilisateur devait coller manuellement un ID token
// Firebase dans un champ texte — token exposé, manipulable, et UX inadaptée.
// Désormais : le token est obtenu automatiquement via la session courante
// (getIdToken) et envoyé en Authorization: Bearer.
// ---------------------------------------------------------------------------

interface QuoteItem {
  id: string;
  name?: string;
  service?: string;
  destination?: string;
  email?: string;
  phone?: string;
  message?: string;
  createdAt?: unknown;
  [key: string]: unknown;
}

// createdAt peut être une chaîne ISO, un Date ou un Timestamp Firestore
// sérialisé ({ seconds, nanoseconds }) selon le chemin d'écriture.
function formatCreatedAt(value: unknown): string {
  if (typeof value === 'string') return value;
  if (value instanceof Date) return value.toISOString();
  if (value && typeof value === 'object' && 'seconds' in value) {
    const seconds = Number((value as { seconds: unknown }).seconds);
    if (Number.isFinite(seconds)) return new Date(seconds * 1000).toISOString();
  }
  return '';
}

export default function AdminQuotesPage() {
  const [items, setItems] = useState<QuoteItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const { getAuthInstance } = await import('@/lib/firebase');
      const { currentUser } = getAuthInstance();
      if (!currentUser) throw new Error('Non connecté');
      const token = await currentUser.getIdToken();
      const res = await fetch('/api/admin/quotes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Erreur');
      setItems(json.items || []);
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
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Admin — Devis reçus</h1>
        <Button onClick={load} variant="outline" disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          Rafraîchir
        </Button>
      </div>

      {error && (
        <Card className="mb-4 border-destructive">
          <CardContent className="pt-6 text-destructive">{error}</CardContent>
        </Card>
      )}

      {loading && items === null && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {items && items.length === 0 && !loading && (
        <Card>
          <CardContent className="pt-6 text-muted-foreground">Aucun devis reçu pour le moment.</CardContent>
        </Card>
      )}

      {items && (
        <div className="grid gap-4">
          {items.map((it) => (
            <Card key={it.id}>
              <CardContent>
                <div className="flex justify-between gap-4">
                  <div>
                    <div className="font-semibold">{it.name} — {it.service}</div>
                    <div className="text-sm text-muted-foreground">{it.email} • {it.phone}</div>
                    {typeof it.message === 'string' && it.message && (
                      <div className="mt-2 text-sm whitespace-pre-wrap">{it.message}</div>
                    )}
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm text-muted-foreground">Détails complets</summary>
                      <div className="mt-2 text-sm whitespace-pre-wrap">{JSON.stringify(it, null, 2)}</div>
                    </details>
                  </div>
                  <div className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatCreatedAt(it.createdAt)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
