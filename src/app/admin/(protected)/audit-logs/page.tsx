'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  ShieldAlert,
  RefreshCw,
  Loader2,
  Clock,
  User,
  Activity,
  Filter,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { getAuthInstance } from '@/lib/firebase';
import type { AuditLogEntry } from '@/lib/audit';

export default function AdminAuditLogsPage() {
  const { toast } = useToast();
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const auth = getAuthInstance();
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch('/api/admin/audit-logs', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setLogs(data.items || []);
      }
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de charger le journal d\'audit', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight font-headline flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-primary" />
            Journal d&apos;Audit & Traçabilité des Opérations
          </h2>
          <p className="text-muted-foreground text-sm">
            Historique immuable des connexions, changements de permissions, affectations de prospects et validations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchLogs} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">Événements Journalisés</CardTitle>
          <CardDescription>
            {logs.length} entrée(s) récentes côté serveur (SDK Admin).
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center text-muted-foreground flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span>Chargement du journal d&apos;audit...</span>
            </div>
          ) : logs.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              Aucun événement d&apos;audit n&apos;a encore été enregistré.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-xs uppercase text-muted-foreground border-b">
                  <tr>
                    <th className="px-4 py-3">Horodatage</th>
                    <th className="px-4 py-3">Action</th>
                    <th className="px-4 py-3">Auteur</th>
                    <th className="px-4 py-3">Ressource</th>
                    <th className="px-4 py-3">Détails</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {log.timestamp ? new Date(log.timestamp).toLocaleString('fr-FR') : '—'}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className="font-mono text-[10px]">
                          {log.action}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <div className="font-medium text-foreground">{log.actorEmail}</div>
                        <div className="text-[10px] text-muted-foreground">{log.actorRole}</div>
                      </td>
                      <td className="px-4 py-3 text-xs font-mono">
                        {log.resource}:{log.resourceId?.slice(0, 8)}...
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground max-w-xs truncate">
                        {log.details ? JSON.stringify(log.details) : '—'}
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
