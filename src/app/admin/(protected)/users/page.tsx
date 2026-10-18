'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  Loader2,
  RefreshCw,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Mail,
  Phone,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
import { ADMIN_ROLES, ROLE_LABELS, type AdminRole, type AdminUserProfile } from '@/lib/rbac';

export default function AdminUsersPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<AdminUserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  // Formulaire de création
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<AdminRole>('COMMERCIAL');
  const [newPhone, setNewPhone] = useState('');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const auth = getAuthInstance();
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.items || []);
      } else {
        toast({ title: 'Erreur', description: 'Impossible de charger les utilisateurs', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Erreur', description: 'Erreur de communication serveur', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const auth = getAuthInstance();
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: newEmail,
          displayName: newName,
          role: newRole,
          phoneNumber: newPhone || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast({ title: 'Succès', description: 'Collaborateur ajouté avec succès' });
        setCreateOpen(false);
        setNewEmail('');
        setNewName('');
        setNewPhone('');
        fetchUsers();
      } else {
        toast({ title: 'Erreur', description: data.error || 'Erreur lors de la création', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Erreur', description: 'Erreur réseau', variant: 'destructive' });
    } finally {
      setCreating(false);
    }
  };

  const handleToggleActive = async (user: AdminUserProfile) => {
    try {
      const auth = getAuthInstance();
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`/api/admin/users/${user.uid}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !user.isActive }),
      });

      if (res.ok) {
        toast({
          title: 'Statut mis à jour',
          description: `Compte ${!user.isActive ? 'activé' : 'désactivé'}`,
        });
        fetchUsers();
      } else {
        const data = await res.json();
        toast({ title: 'Erreur', description: data.error || 'Action impossible', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Erreur', description: 'Erreur réseau', variant: 'destructive' });
    }
  };

  const handleChangeRole = async (user: AdminUserProfile, role: AdminRole) => {
    try {
      const auth = getAuthInstance();
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`/api/admin/users/${user.uid}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });

      if (res.ok) {
        toast({ title: 'Rôle modifié', description: `Nouveau rôle : ${ROLE_LABELS[role]}` });
        fetchUsers();
      } else {
        const data = await res.json();
        toast({ title: 'Erreur', description: data.error || 'Modification impossible', variant: 'destructive' });
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
            <Users className="w-6 h-6 text-primary" />
            Gestion des Collaborateurs & Permissions (RBAC)
          </h2>
          <p className="text-muted-foreground text-sm">
            Administrez les rôles, permissions et statuts d&apos;accès de l&apos;équipe SLAAC Voyages.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchUsers} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>

          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <UserPlus className="w-4 h-4" />
                Ajouter un collaborateur
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleCreateUser}>
                <DialogHeader>
                  <DialogTitle>Nouveau Collaborateur</DialogTitle>
                  <DialogDescription>
                    Créez un profil pour un conseiller ou membre de l&apos;agence SLAAC Voyages.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Nom complet</label>
                    <Input
                      required
                      placeholder="ex: Aminata Diallo"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Email professionnel</label>
                    <Input
                      type="email"
                      required
                      placeholder="nom@slaacvoyages.com"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Téléphone / WhatsApp</label>
                    <Input
                      placeholder="+221 77 XXX XX XX"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Rôle & Périmètre</label>
                    <Select value={newRole} onValueChange={(v) => setNewRole(v as AdminRole)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un rôle" />
                      </SelectTrigger>
                      <SelectContent>
                        {ADMIN_ROLES.map((r) => (
                          <SelectItem key={r} value={r}>
                            {ROLE_LABELS[r]}
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
                    Enregistrer
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">Membres du Back-Office</CardTitle>
          <CardDescription>
            {users.length} collaborateur(s) enregistré(s). Seuls les comptes actifs peuvent s&apos;authentifier.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center text-muted-foreground flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span>Chargement des collaborateurs...</span>
            </div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              Aucun profil collaborateur n&apos;est encore initialisé dans la base.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-xs uppercase text-muted-foreground border-b">
                  <tr>
                    <th className="px-4 py-3">Collaborateur</th>
                    <th className="px-4 py-3">Rôle & Accès</th>
                    <th className="px-4 py-3">Statut</th>
                    <th className="px-4 py-3">Coordonnées</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map((u) => (
                    <tr key={u.uid} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium">
                        <div className="font-semibold text-foreground">{u.displayName}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {u.email}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={u.role === 'SUPER_ADMIN' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          <Shield className="w-3 h-3 mr-1" />
                          {ROLE_LABELS[u.role] || u.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {u.isActive ? (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Actif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-destructive font-medium">
                            <XCircle className="w-3.5 h-3.5" /> Désactivé
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {u.phoneNumber ? (
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {u.phoneNumber}
                          </div>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Modifier les accès</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {ADMIN_ROLES.map((roleOpt) => (
                              <DropdownMenuItem
                                key={roleOpt}
                                disabled={u.role === roleOpt}
                                onClick={() => handleChangeRole(u, roleOpt)}
                              >
                                Passer {ROLE_LABELS[roleOpt]}
                              </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleToggleActive(u)}
                              className={u.isActive ? 'text-destructive' : 'text-emerald-600'}
                            >
                              {u.isActive ? 'Désactiver le compte' : 'Activer le compte'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
