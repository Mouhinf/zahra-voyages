'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Briefcase,
  Plus,
  RefreshCw,
  Loader2,
  Calendar,
  Users,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
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
import { DOSSIER_STATUSES, DOSSIER_STATUS_LABELS, type DossierStatus, type TravelFile } from '@/lib/dossiers-types';

export default function AdminDossiersPage() {
  const { toast } = useToast();
  const [dossiers, setDossiers] = useState<TravelFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  // Formulaire nouveau dossier
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [service, setService] = useState('transfert-aeroport');
  const [destination, setDestination] = useState('Dakar Centre / AIBD');
  const [startDate, setStartDate] = useState('');
  const [passengersCount, setPassengersCount] = useState(1);
  const [totalAmountFcfa, setTotalAmountFcfa] = useState(35000);

  const fetchDossiers = useCallback(async () => {
    setLoading(true);
    try {
      const auth = getAuthInstance();
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch('/api/admin/dossiers', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setDossiers(data.items || []);
      }
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de charger les dossiers', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchDossiers();
  }, [fetchDossiers]);

  const handleCreateDossier = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const auth = getAuthInstance();
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch('/api/admin/dossiers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerName,
          customerEmail: customerEmail || undefined,
          customerPhone: customerPhone || undefined,
          service,
          destination,
          startDate: startDate || undefined,
          passengersCount,
          totalAmountFcfa,
          status: 'devis_en_cours',
        }),
      });

      if (res.ok) {
        toast({ title: 'Dossier créé', description: 'Le dossier de voyage a été enregistré' });
        setCreateOpen(false);
        setCustomerName('');
        setCustomerEmail('');
        setCustomerPhone('');
        fetchDossiers();
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

  const handleUpdateStatus = async (id: string, status: DossierStatus) => {
    try {
      const auth = getAuthInstance();
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`/api/admin/dossiers/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        toast({ title: 'Statut mis à jour', description: `Dossier passé à : ${DOSSIER_STATUS_LABELS[status]}` });
        fetchDossiers();
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
            <Briefcase className="w-6 h-6 text-primary" />
            Dossiers de Voyage & Suivi Opérationnel
          </h2>
          <p className="text-muted-foreground text-sm">
            Suivi des réservations confirmées, préparation logistique et prestations de voyage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchDossiers} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>

          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Nouveau dossier
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
              <form onSubmit={handleCreateDossier}>
                <DialogHeader>
                  <DialogTitle>Ouvrir un Dossier de Voyage</DialogTitle>
                  <DialogDescription>
                    Enregistrez un nouveau dossier client pour le suivi des prestations.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-3 py-4 text-sm">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Nom du voyageur / Client</label>
                    <Input
                      required
                      placeholder="ex: Dr. Amadou Ba"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold">Téléphone WhatsApp</label>
                      <Input
                        placeholder="+221 77 XXX XX XX"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold">Email</label>
                      <Input
                        type="email"
                        placeholder="client@domaine.com"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold">Prestation / Service</label>
                      <Input
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        placeholder="transfert-aeroport"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold">Destination / Trajet</label>
                      <Input
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="AIBD -> Dakar"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold">Date de début</label>
                      <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold">Voyageurs (pers.)</label>
                      <Input
                        type="number"
                        min="1"
                        value={passengersCount}
                        onChange={(e) => setPassengersCount(Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Montant prévisionnel (FCFA)</label>
                    <Input
                      type="number"
                      min="0"
                      step="5000"
                      value={totalAmountFcfa}
                      onChange={(e) => setTotalAmountFcfa(Number(e.target.value))}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" disabled={creating}>
                    {creating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Créer le dossier
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">Registre des Dossiers</CardTitle>
          <CardDescription>
            {dossiers.length} dossier(s) en gestion commerciale et logistique.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center text-muted-foreground flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span>Chargement des dossiers...</span>
            </div>
          ) : dossiers.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              Aucun dossier de voyage enregistré pour le moment.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-xs uppercase text-muted-foreground border-b">
                  <tr>
                    <th className="px-4 py-3">Réf. Dossier</th>
                    <th className="px-4 py-3">Client</th>
                    <th className="px-4 py-3">Service & Trajet</th>
                    <th className="px-4 py-3">Date Prévue</th>
                    <th className="px-4 py-3">Montant</th>
                    <th className="px-4 py-3">Statut</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {dossiers.map((d) => (
                    <tr key={d.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-xs text-primary">
                        {d.reference}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        <div>{d.customerName}</div>
                        <div className="text-xs text-muted-foreground">{d.customerPhone || d.customerEmail || '—'}</div>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <span className="font-semibold block">{d.service}</span>
                        <span className="text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {d.destination}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {d.startDate ? d.startDate.slice(0, 10) : 'À définir'}
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold">
                        {d.totalAmountFcfa.toLocaleString('fr-FR')} FCFA
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="text-xs font-medium">
                          {DOSSIER_STATUS_LABELS[d.status] || d.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Changer d&apos;état</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {DOSSIER_STATUSES.map((st) => (
                              <DropdownMenuItem
                                key={st}
                                disabled={d.status === st}
                                onClick={() => handleUpdateStatus(d.id, st)}
                              >
                                {DOSSIER_STATUS_LABELS[st]}
                              </DropdownMenuItem>
                            ))}
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
