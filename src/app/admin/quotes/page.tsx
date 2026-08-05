'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminQuotesPage() {
  const [token, setToken] = useState('');
  const [items, setItems] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/admin/quotes', { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Erreur');
      setItems(json.items || []);
    } catch (e: any) {
      setError(e.message);
    } finally { setLoading(false); }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Admin — Devis reçus</h1>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Authentification</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2">Collez un token admin (Firebase ID token) puis cliquez sur Charger.</p>
          <div className="flex gap-2">
            <input className="flex-1 rounded border px-3 py-2" value={token} onChange={e=>setToken(e.target.value)} placeholder="Bearer token..." />
            <Button onClick={load} disabled={loading || !token}>Charger</Button>
          </div>
          {error && <p className="text-destructive mt-2">{error}</p>}
        </CardContent>
      </Card>

      {items && (
        <div className="grid gap-4">
          {items.map((it) => (
            <Card key={it.id}>
              <CardContent>
                <div className="flex justify-between">
                  <div>
                    <div className="font-semibold">{it.name} — {it.service}</div>
                    <div className="text-sm text-muted-foreground">{it.email} • {it.phone}</div>
                    <div className="mt-2 text-sm whitespace-pre-wrap">{JSON.stringify(it, null, 2)}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">{it.createdAt}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
