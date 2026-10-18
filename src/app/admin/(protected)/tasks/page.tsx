'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Calendar,
  Plus,
  RefreshCw,
  Loader2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  MoreVertical,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { getAuthInstance } from '@/lib/firebase';
import {
  TASK_STATUSES,
  TASK_STATUS_LABELS,
  TASK_PRIORITIES,
  type TaskStatus,
  type TaskPriority,
  type TeamTask,
} from '@/lib/tasks-types';

export default function AdminTasksPage() {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<TeamTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  // Formulaire nouvelle tâche
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('normale');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const auth = getAuthInstance();
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch('/api/admin/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setTasks(data.items || []);
      }
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de charger les tâches', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const auth = getAuthInstance();
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch('/api/admin/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description: description || undefined,
          assignedTo: assignedTo || auth.currentUser?.email || 'commercial@slaacvoyages.com',
          dueDate: dueDate || new Date().toISOString().slice(0, 10),
          priority,
          status: 'todo',
        }),
      });

      if (res.ok) {
        toast({ title: 'Tâche créée', description: 'La tâche a été assignée avec succès' });
        setCreateOpen(false);
        setTitle('');
        setDescription('');
        setAssignedTo('');
        fetchTasks();
      } else {
        const err = await res.json();
        toast({ title: 'Erreur', description: err.error || 'Création impossible', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Erreur', description: 'Erreur de communication', variant: 'destructive' });
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: TaskStatus) => {
    try {
      const auth = getAuthInstance();
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`/api/admin/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        toast({ title: 'Statut mis à jour', description: `Tâche passée à : ${TASK_STATUS_LABELS[status]}` });
        fetchTasks();
      } else {
        const err = await res.json();
        toast({ title: 'Erreur', description: err.error || 'Mise à jour impossible', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Erreur', description: 'Erreur réseau', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight font-headline flex items-center gap-2">
            <Calendar className="w-6 h-6 text-primary" />
            Tâches & Relances Opérationnelles
          </h2>
          <p className="text-muted-foreground text-sm">
            Organisation des rappels clients, émissions de devis et missions de l&apos;équipe.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchTasks} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>

          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Nouvelle tâche
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px]">
              <form onSubmit={handleCreateTask}>
                <DialogHeader>
                  <DialogTitle>Créer une Tâche / Relance</DialogTitle>
                  <DialogDescription>
                    Attribuez une action prioritaire à un collaborateur de SLAAC Voyages.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-3 py-4 text-sm">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Titre de la tâche</label>
                    <Input
                      required
                      placeholder="ex: Rappeler M. Diop pour confirmation billet vol"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Description / Contexte</label>
                    <Textarea
                      placeholder="Détails, horaires de vol ou questions du client..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold">Assigné à (email)</label>
                      <Input
                        placeholder="collaborateur@slaacvoyages.com"
                        value={assignedTo}
                        onChange={(e) => setAssignedTo(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold">Échéance</label>
                      <Input
                        type="date"
                        required
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Priorité</label>
                    <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TASK_PRIORITIES.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p.toUpperCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" disabled={creating}>
                    {creating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Assigner la tâche
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">Toutes les Tâches</CardTitle>
          <CardDescription>
            {tasks.length} tâche(s) enregistrée(s).
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center text-muted-foreground flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span>Chargement des tâches...</span>
            </div>
          ) : tasks.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              Aucune tâche en attente. Votre tableau de suivi est à jour.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {tasks.map((t) => (
                <div key={t.id} className="p-4 flex items-center justify-between gap-4 hover:bg-muted/30 transition-colors">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          t.priority === 'urgente'
                            ? 'destructive'
                            : t.priority === 'haute'
                            ? 'default'
                            : 'secondary'
                        }
                        className="text-[10px] uppercase font-bold"
                      >
                        {t.priority}
                      </Badge>
                      <span className="font-semibold text-sm text-foreground truncate">{t.title}</span>
                    </div>
                    {t.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1">{t.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" /> {t.assignedTo}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Échéance : {t.dueDate}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={t.status === 'done' ? 'default' : 'outline'} className="text-xs">
                      {TASK_STATUS_LABELS[t.status] || t.status}
                    </Badge>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Mettre à jour</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {TASK_STATUSES.map((st) => (
                          <DropdownMenuItem
                            key={st}
                            disabled={t.status === st}
                            onClick={() => handleUpdateStatus(t.id, st)}
                          >
                            Passer à « {TASK_STATUS_LABELS[st]} »
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
