'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  FileText,
  Plus,
  RefreshCw,
  Loader2,
  Printer,
  Calendar,
  DollarSign,
  CheckCircle,
  MoreVertical,
  Trash2,
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
  PROPOSAL_STATUSES,
  PROPOSAL_STATUS_LABELS,
  type ProposalStatus,
  type CommercialProposal,
} from '@/lib/quotes-types';

interface LineItemInput {
  description: string;
  quantity: number;
  unitPriceFcfa: number;
}

export default function AdminProposalsPage() {
  const { toast } = useToast();
  const [proposals, setProposals] = useState<CommercialProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  // Formulaire proposition
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [service, setService] = useState('Transfert AIBD VIP & Chauffeur');
  const [items, setItems] = useState<LineItemInput[]>([
    { description: 'Prise en charge AIBD vers Dakar Plateau (Berline VIP)', quantity: 1, unitPriceFcfa: 35000 },
  ]);
  const [discountFcfa, setDiscountFcfa] = useState(0);

  const fetchProposals = useCallback(async () => {
    setLoading(true);
    try {
      const auth = getAuthInstance();
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch('/api/admin/proposals', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProposals(data.items || []);
      }
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de charger les devis', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchProposals();
  }, [fetchProposals]);

  const handleAddItem = () => {
    setItems([...items, { description: '', quantity: 1, unitPriceFcfa: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (index: number, field: keyof LineItemInput, val: unknown) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: val };
    setItems(updated);
  };

  const handleCreateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const auth = getAuthInstance();
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch('/api/admin/proposals', {
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
          items,
          discountFcfa,
        }),
      });

      if (res.ok) {
        toast({ title: 'Devis créé', description: 'La proposition commerciale a été générée' });
        setCreateOpen(false);
        setCustomerName('');
        setCustomerEmail('');
        setCustomerPhone('');
        fetchProposals();
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

  const handleUpdateStatus = async (id: string, status: ProposalStatus) => {
    try {
      const auth = getAuthInstance();
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`/api/admin/proposals/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        toast({ title: 'Statut mis à jour', description: `Devis passé à : ${PROPOSAL_STATUS_LABELS[status]}` });
        fetchProposals();
      } else {
        const err = await res.json();
        toast({ title: 'Erreur', description: err.error || 'Action impossible', variant: 'destructive' });
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
            <FileText className="w-6 h-6 text-primary" />
            Devis & Propositions Commerciales Officielles
          </h2>
          <p className="text-muted-foreground text-sm">
            Émission, calcul exact en FCFA, workflow de validation et impression PDF des devis SLAAC Voyages.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchProposals} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>

          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Nouveau devis
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
              <form onSubmit={handleCreateProposal}>
                <DialogHeader>
                  <DialogTitle>Émettre un Devis Officiel</DialogTitle>
                  <DialogDescription>
                    Créez une proposition chiffrée conforme à la charte SLAAC Voyages.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4 text-sm">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Nom du client ou entreprise</label>
                    <Input
                      required
                      placeholder="ex: Société Immobilière Dakaroise"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold">Email</label>
                      <Input
                        type="email"
                        placeholder="contact@entreprise.sn"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold">Téléphone WhatsApp</label>
                      <Input
                        placeholder="+221 77 XXX XX XX"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Intitulé de la prestation</label>
                    <Input
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                    />
                  </div>

                  <div className="border rounded-md p-3 space-y-3 bg-muted/20">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase text-muted-foreground">Lignes de Prestations</span>
                      <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
                        <Plus className="w-3 h-3 mr-1" /> Ajouter une ligne
                      </Button>
                    </div>

                    {items.map((it, idx) => (
                      <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-6">
                          <Input
                            placeholder="Désignation"
                            value={it.description}
                            onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                            className="h-8 text-xs"
                            required
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            min="1"
                            value={it.quantity}
                            onChange={(e) => handleItemChange(idx, 'quantity', Number(e.target.value))}
                            className="h-8 text-xs text-center"
                            required
                          />
                        </div>
                        <div className="col-span-3">
                          <Input
                            type="number"
                            min="0"
                            step="1000"
                            value={it.unitPriceFcfa}
                            onChange={(e) => handleItemChange(idx, 'unitPriceFcfa', Number(e.target.value))}
                            className="h-8 text-xs text-right"
                            required
                          />
                        </div>
                        <div className="col-span-1 text-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={() => handleRemoveItem(idx)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Remise commerciale éventuelle (FCFA)</label>
                    <Input
                      type="number"
                      min="0"
                      value={discountFcfa}
                      onChange={(e) => setDiscountFcfa(Number(e.target.value))}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" disabled={creating}>
                    {creating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Générer le devis
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">Historique des Devis Commerciaux</CardTitle>
          <CardDescription>
            {proposals.length} devis émis et suivis.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center text-muted-foreground flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span>Chargement des devis...</span>
            </div>
          ) : proposals.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              Aucun devis commercial officiel n&apos;a encore été créé.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-xs uppercase text-muted-foreground border-b">
                  <tr>
                    <th className="px-4 py-3">N° Proposition</th>
                    <th className="px-4 py-3">Client</th>
                    <th className="px-4 py-3">Service</th>
                    <th className="px-4 py-3">Montant Net</th>
                    <th className="px-4 py-3">Échéance</th>
                    <th className="px-4 py-3">Statut</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {proposals.map((p) => (
                    <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-xs text-primary">
                        {p.proposalNumber}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        <div>{p.customerName}</div>
                        <div className="text-xs text-muted-foreground">{p.customerEmail || p.customerPhone || '—'}</div>
                      </td>
                      <td className="px-4 py-3 text-xs">{p.service}</td>
                      <td className="px-4 py-3 font-bold text-xs text-foreground">
                        {p.totalTtcFcfa.toLocaleString('fr-FR')} FCFA
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {p.validUntil}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="text-xs">
                          {PROPOSAL_STATUS_LABELS[p.status] || p.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1 text-xs"
                            onClick={() => window.open(`/api/admin/proposals/${p.id}?format=html`, '_blank')}
                          >
                            <Printer className="w-3.5 h-3.5" /> PDF
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Validation & Envoi</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              {PROPOSAL_STATUSES.map((st) => (
                                <DropdownMenuItem
                                  key={st}
                                  disabled={p.status === st}
                                  onClick={() => handleUpdateStatus(p.id, st)}
                                >
                                  {PROPOSAL_STATUS_LABELS[st]}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
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
