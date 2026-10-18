'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Mail,
  RefreshCw,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { getAuthInstance } from '@/lib/firebase';

interface OutboxItem {
  id: string;
  status: 'pending' | 'sent' | 'failed' | 'dead';
  recipient: string;
  subject: string;
  template: string;
  attempts?: number;
  lastError?: string;
  createdAt: string;
  sentAt?: string;
}

export default function AdminNotificationsPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<OutboxItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOutbox = useCallback(async () => {
    setLoading(true);
    try {
      const auth = getAuthInstance();
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch('/api/admin/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de charger les notifications emails', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchOutbox();
  }, [fetchOutbox]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight font-headline flex items-center gap-2">
            <Mail className="w-6 h-6 text-primary" />
            Centre de Notifications & Envois Emails (Outbox)
          </h2>
          <p className="text-muted-foreground text-sm">
            Supervision des accusés de réception, alertes agence et messages transactionnels expédiés.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchOutbox} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">File d&apos;Attente Transactionnelle</CardTitle>
          <CardDescription>
            {items.length} notification(s) récentes traitées par le système d&apos;envoi Outbox résilient.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center text-muted-foreground flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span>Chargement des notifications...</span>
            </div>
          ) : items.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              Aucune notification email dans l&apos;outbox.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-xs uppercase text-muted-foreground border-b">
                  <tr>
                    <th className="px-4 py-3">Horodatage</th>
                    <th className="px-4 py-3">Destinataire</th>
                    <th className="px-4 py-3">Modèle / Objet</th>
                    <th className="px-4 py-3">Statut</th>
                    <th className="px-4 py-3">Tentatives</th>
                    <th className="px-4 py-3">Détail Erreur</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.createdAt ? new Date(item.createdAt).toLocaleString('fr-FR') : '—'}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-xs">
                        {item.recipient}
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <span className="font-semibold block">{item.subject}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">Modèle : {item.template}</span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            item.status === 'sent'
                              ? 'default'
                              : item.status === 'failed' || item.status === 'dead'
                              ? 'destructive'
                              : 'secondary'
                          }
                          className="text-xs capitalize"
                        >
                          {item.status === 'sent' && <CheckCircle2 className="w-3 h-3 mr-1 inline" />}
                          {item.status === 'failed' && <AlertTriangle className="w-3 h-3 mr-1 inline" />}
                          {item.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-xs font-mono">
                        {item.attempts ?? 1} / 5
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground max-w-xs truncate">
                        {item.lastError || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
