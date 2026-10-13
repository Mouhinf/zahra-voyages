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
import {
  Loader2, RefreshCw, MailWarning, Search, Phone, Mail, MessageCircle,
  Download, StickyNote, UserPlus, History, X, ExternalLink, AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import { getAuthInstance } from '@/lib/firebase';
import { serviceLabel } from '@/lib/lead-labels';

type Row = Record<string, unknown> & { id: string };

type CrmStatus = 'nouveau' | 'contacte' | 'en_discussion' | 'devis_envoye' | 'confirme' | 'perdu';

const STATUS: Array<{ value: CrmStatus; label: string; badgeClass: string }> = [
  { value: 'nouveau', label: 'Nouveau', badgeClass: 'bg-blue-100 text-blue-800 border-blue-200' },
  { value: 'contacte', label: 'Contacté', badgeClass: 'bg-amber-100 text-amber-800 border-amber-200' },
  { value: 'en_discussion', label: 'En discussion', badgeClass: 'bg-purple-100 text-purple-800 border-purple-200' },
  { value: 'devis_envoye', label: 'Devis envoyé', badgeClass: 'bg-cyan-100 text-cyan-800 border-cyan-200' },
  { value: 'confirme', label: 'Confirmé', badgeClass: 'bg-green-100 text-green-800 border-green-200' },
  { value: 'perdu', label: 'Perdu', badgeClass: 'bg-gray-100 text-gray-600 border-gray-200' },
];

const STATUS_LABEL: Record<string, string> = Object.fromEntries(STATUS.map((s) => [s.value, s.label]));

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

function createdMs(v: unknown): number {
  if (typeof v === 'string') {
    const t = new Date(v).getTime();
    if (Number.isFinite(t)) return t;
  }
  if (v && typeof v === 'object' && 'seconds' in v) {
    const s = Number((v as { seconds: unknown }).seconds);
    if (Number.isFinite(s)) return s * 1000;
  }
  return NaN;
}

function isUnhandled(it: Row): boolean {
  const status = str(it.crmStatus) || 'nouveau';
  if (status !== 'nouveau') return false;
  const t = createdMs(it.createdAt);
  return Number.isFinite(t) && Date.now() - t > 48 * 60 * 60 * 1000;
}

async function adminFetch(url: string, init?: RequestInit): Promise<Record<string, unknown>> {
  const auth = getAuthInstance();
  const user = auth?.currentUser;
  if (!user) throw new Error('Non connecté');
  const token = await user.getIdToken();
  const res = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...init?.headers },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((body as { error?: string })?.error || `Erreur ${res.status}`);
  return body as Record<string, unknown>;
}

function StatusBadge({ value }: { value: string }) {
  const s = STATUS.find((x) => x.value === value) ?? STATUS[0];
  return <Badge variant="outline" className={s.badgeClass}>{s.label}</Badge>;
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

// ---------------------------------------------------------------------------
// Fiche détaillée d'une demande
// ---------------------------------------------------------------------------

type Note = { at: string; by: string; texte: string };
type HistoryEvent = { at: string; by: string; event: string };

function LeadSheet({
  lead, kind, onClose, onUpdated,
}: {
  lead: Row | null;
  kind: 'quotes' | 'contacts';
  onClose: () => void;
  onUpdated: () => void;
}) {
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [assignee, setAssignee] = useState('');

  useEffect(() => {
    setAssignee(str(lead?.assignee));
    setNoteText('');
  }, [lead?.id]);

  if (!lead) return null;

  const currentStatus = str(lead.crmStatus) || 'nouveau';
  const notes = (Array.isArray(lead.notes) ? lead.notes : []) as Note[];
  const history = (Array.isArray(lead.history) ? lead.history : []) as HistoryEvent[];
  const phone = str(lead.phone);
  const email = str(lead.email);
  const name = str(lead.name);

  const waNumber = phone.replace(/[^0-9]/g, '').replace(/^0+/, '');
  const waLink = waNumber
    ? `https://wa.me/${waNumber.startsWith('221') ? waNumber : `221${waNumber}`}?text=${encodeURIComponent(
        `Bonjour ${name}, ici l'équipe SLAAC Voyages au sujet de votre demande${str(lead.reference) ? ` ${str(lead.reference)}` : ''}.`,
      )}`
    : null;
  const mailLink = email
    ? `mailto:${email}?subject=${encodeURIComponent(`Votre demande — SLAAC Voyages${str(lead.reference) ? ` (${str(lead.reference)})` : ''}`)}`
    : null;

  async function patch(payload: Record<string, unknown>, successMsg: string) {
    setBusy(true);
    try {
      await adminFetch('/api/admin/leads', { method: 'PATCH', body: JSON.stringify({ collection: kind, id: lead!.id, ...payload }) });
      toast({ title: successMsg });
      onUpdated();
    } catch (e) {
      toast({ title: 'Erreur', description: e instanceof Error ? e.message : 'Modification impossible', variant: 'destructive' });
    } finally {
      setBusy(false);
    }
  }

  const detailRows = (kind === 'quotes'
    ? [
        ['Service', serviceLabel(str(lead.service))],
        ['Destination', str(lead.destination) || '—'],
        ['Voyageurs', str(lead.travelers) || '—'],
        ['Départ', str(lead.departureDate) || '—'],
        ['Retour', str(lead.returnDate) || '—'],
        ['Source', str(lead.source) || '—'],
        ['Reçu le', formatCreatedAt(lead.createdAt)],
      ]
    : [
        ['Email', email || '—'],
        ['Téléphone', phone || '—'],
        ['Reçu le', formatCreatedAt(lead.createdAt)],
      ] as string[][]).filter((row) => row[1] !== '' && row[1] !== '—');

  return (
    <Sheet open onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex flex-wrap items-center gap-2">
            {kind === 'quotes' ? str(lead.reference) || 'Devis' : name}
            <StatusBadge value={currentStatus} />
            {isUnhandled(lead) && <Badge variant="destructive" className="gap-1"><AlertTriangle className="h-3 w-3" /> non traité</Badge>}
            <NotifyBadge value={lead.notifyStatus} />
          </SheetTitle>
          <SheetDescription>
            {name}{phone ? ` · ${phone}` : ''}{email ? ` · ${email}` : ''}
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 pb-8 space-y-6">
          {/* Actions de contact */}
          <div className="flex flex-wrap gap-2">
            {waLink && (
              <Button asChild size="sm" variant="outline">
                <a href={waLink} target="_blank" rel="noopener noreferrer"><MessageCircle className="mr-2 h-4 w-4" /> WhatsApp</a>
              </Button>
            )}
            {mailLink && (
              <Button asChild size="sm" variant="outline">
                <a href={mailLink}><Mail className="mr-2 h-4 w-4" /> Répondre par email</a>
              </Button>
            )}
            {phone && (
              <Button asChild size="sm" variant="outline">
                <a href={`tel:${phone}`}><Phone className="mr-2 h-4 w-4" /> Appeler</a>
              </Button>
            )}
          </div>

          {/* Détails */}
          <div className="rounded-lg border p-4 space-y-1.5 text-sm">
            {detailRows.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4">
                <span className="text-muted-foreground">{k}</span><span className="text-right">{v}</span>
              </div>
            ))}
          </div>

          {str(lead.message) && (
            <div>
              <Label className="text-primary">Message du client</Label>
              <div className="mt-1 rounded-lg bg-muted/50 p-3 text-sm whitespace-pre-wrap">{str(lead.message)}</div>
            </div>
          )}

          {/* Statut */}
          <div className="space-y-2">
            <Label className="text-primary">Statut</Label>
            <Select
              value={currentStatus}
              onValueChange={(v) => patch({ crmStatus: v }, `Statut : ${STATUS_LABEL[v]}`)}
              disabled={busy}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Responsable */}
          <form
            className="space-y-2"
            onSubmit={(e) => {
              e.preventDefault();
              patch({ assignee }, assignee ? `Assignée à ${assignee}` : 'Assignation retirée');
            }}
          >
            <Label className="text-primary flex items-center gap-2"><UserPlus className="h-4 w-4" /> Responsable attribué</Label>
            <div className="flex gap-2">
              <Input value={assignee} onChange={(e) => setAssignee(e.target.value)} placeholder="Email du responsable" />
              <Button type="submit" size="sm" disabled={busy}>OK</Button>
            </div>
          </form>

          {/* Notes internes */}
          <form
            className="space-y-2"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!noteText.trim()) return;
              const texte = noteText;
              setNoteText('');
              await patch({ note: { texte } }, 'Note enregistrée');
            }}
          >
            <Label className="text-primary flex items-center gap-2"><StickyNote className="h-4 w-4" /> Notes internes</Label>
            <Textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Compte rendu d'appel, relance prévue…" maxLength={2000} />
            <div className="flex justify-end">
              <Button type="submit" size="sm" disabled={busy || !noteText.trim()}>Ajouter la note</Button>
            </div>
            {[...notes].reverse().map((n, i) => (
              <div key={i} className="rounded-lg border-l-4 border-primary/40 bg-muted/30 p-3 text-sm">
                <div className="text-xs text-muted-foreground mb-1">{n.by} · {formatCreatedAt(n.at)}</div>
                {n.texte}
              </div>
            ))}
          </form>

          {/* Historique */}
          <div className="space-y-2">
            <Label className="text-primary flex items-center gap-2"><History className="h-4 w-4" /> Historique</Label>
            {history.length === 0 && <p className="text-sm text-muted-foreground">Aucun évènement enregistré.</p>}
            {history.length > 0 && (
              <ol className="relative border-l ml-2 space-y-3">
                {[...history].reverse().map((h, i) => (
                  <li key={i} className="ml-4 text-sm">
                    <span className="absolute -left-1.5 mt-1 h-3 w-3 rounded-full border-2 border-background bg-primary" />
                    <div>{h.event}</div>
                    <div className="text-xs text-muted-foreground">{h.by} · {formatCreatedAt(h.at)}</div>
                  </li>
                ))}
              </ol>
            )}
          </div>

          <Button variant="ghost" size="sm" onClick={onClose} className="w-full">
            <X className="mr-2 h-4 w-4" /> Fermer
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

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

function LeadSection({ kind, url, emptyLabel }: { kind: 'quotes' | 'contacts'; url: string; emptyLabel?: string }) {
  const { items, loading, error, load } = useCrmList(url);
  const [selected, setSelected] = useState<Row | null>(null);
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
      {!loading && !error && items && (
        <LeadTable items={items} kind={kind} onOpen={setSelected} />
      )}
      {emptyLabel && !loading && !error && items?.length === 0 && (
        <p className="text-sm text-muted-foreground">{emptyLabel}</p>
      )}

      <LeadSheet lead={selected} kind={kind} onClose={() => setSelected(null)} onUpdated={load} />
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
        <LeadSection kind="quotes" url="/api/admin/quotes" />
      </TabsContent>
      <TabsContent value="messages">
        <LeadSection kind="contacts" url="/api/admin/contacts" />
      </TabsContent>
      <TabsContent value="newsletter"><NewsletterList /></TabsContent>
    </Tabs>
  );
}
