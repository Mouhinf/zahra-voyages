'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import {
  AlertTriangle, ArrowLeft, History, Loader2, Mail, MessageCircle, Phone, RefreshCw, StickyNote, UserPlus, Calendar,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { serviceLabel } from '@/lib/lead-labels';
import {
  adminFetch, formatCreatedAt, isUnhandled, NotifyBadge, Row, STATUS, STATUS_LABEL, StatusBadge, str,
  PRIORITIES, PRIORITY_CONFIG, type Priority, PriorityBadge, FollowUpBadge,
  type Note, type HistoryEvent,
} from '@/components/admin/lead-ui';

// ---------------------------------------------------------------------------
// Fiche complète d'une demande (route dédiée). Toutes les modifications passent
// par PATCH /api/admin/leads ; l'historique et les notes sont tenus côté serveur.
// ---------------------------------------------------------------------------

interface LeadDetailProps {
  kind: 'quotes' | 'contacts';
  id: string;
}

export default function LeadDetail({ kind, id }: LeadDetailProps) {
  const { toast } = useToast();
  const [lead, setLead] = useState<Row | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [assignee, setAssignee] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [retrying, setRetrying] = useState(false);

  const backHref = kind === 'quotes' ? '/admin/demandes/devis' : '/admin/demandes/contacts';
  const backLabel = kind === 'quotes' ? 'Devis' : 'Messages de contact';

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const body = await adminFetch(`/api/admin/leads/${kind}/${encodeURIComponent(id)}`);
      const item = body.item as Row;
      setLead(item);
      setAssignee(str(item.assignee));
      setFollowUpDate(str(item.nextFollowUpAt) || '');
      setNotFound(false);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Erreur';
      if (message === 'Demande introuvable') setNotFound(true);
      else setError(message);
    } finally {
      setLoading(false);
    }
  }, [kind, id]);

  useEffect(() => {
    load();
  }, [load]);

  async function patch(payload: Record<string, unknown>, successMsg: string) {
    setBusy(true);
    try {
      await adminFetch('/api/admin/leads', {
        method: 'PATCH',
        body: JSON.stringify({ collection: kind, id, ...payload }),
      });
      toast({ title: successMsg });
      await load();
    } catch (e) {
      toast({
        title: 'Erreur',
        description: e instanceof Error ? e.message : 'Modification impossible',
        variant: 'destructive',
      });
    } finally {
      setBusy(false);
    }
  }

  async function handleRetryEmails() {
    setRetrying(true);
    try {
      const res = await adminFetch('/api/admin/leads/retry-email', {
        method: 'POST',
        body: JSON.stringify({ collection: kind, id }),
      });
      const successes = Number(res.successes ?? 0);
      const total = Number(res.total ?? 0);
      toast({
        title: 'Rejeu des notifications',
        description: `${successes}/${total} message(s) réexpédié(s) avec succès.`,
      });
      await load();
    } catch (e) {
      toast({
        title: 'Erreur de réexpédition',
        description: e instanceof Error ? e.message : 'Échec lors du rejeu',
        variant: 'destructive',
      });
    } finally {
      setRetrying(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound || !lead) {
    return (
      <div className="space-y-4">
        <BackLink href={backHref} label={backLabel} />
        <Card>
          <CardContent className="pt-6 text-muted-foreground">
            {notFound ? 'Cette demande n’existe plus ou a été supprimée.' : 'Impossible de charger la demande.'}
          </CardContent>
        </Card>
        {error && (
          <Button onClick={load} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" /> Réessayer
          </Button>
        )}
      </div>
    );
  }

  const currentStatus = str(lead.crmStatus) || 'nouveau';
  const notes = (Array.isArray(lead.notes) ? lead.notes : []) as Note[];
  const history = (Array.isArray(lead.history) ? lead.history : []) as HistoryEvent[];
  const phone = str(lead.phone);
  const email = str(lead.email);
  const name = str(lead.name);
  const reference = str(lead.reference);

  const waNumber = phone.replace(/[^0-9]/g, '').replace(/^0+/, '');
  const waLink = waNumber
    ? `https://wa.me/${waNumber.startsWith('221') ? waNumber : `221${waNumber}`}?text=${encodeURIComponent(
        `Bonjour ${name}, ici l'équipe SLAAC Voyages au sujet de votre demande${reference ? ` ${reference}` : ''}.`,
      )}`
    : null;
  const mailLink = email
    ? `mailto:${email}?subject=${encodeURIComponent(`Votre demande — SLAAC Voyages${reference ? ` (${reference})` : ''}`)}`
    : null;

  const details = (kind === 'quotes'
    ? [
        ['Référence', reference || '—'],
        ['Service', serviceLabel(str(lead.service)) || '—'],
        ['Destination', str(lead.destination) || '—'],
        ['Voyageurs', str(lead.travelers) || '—'],
        ['Départ', str(lead.departureDate) || '—'],
        ['Retour', str(lead.returnDate) || '—'],
        ['Source', str(lead.source) || '—'],
        ['Email', email || '—'],
        ['Téléphone', phone || '—'],
        ['Reçu le', formatCreatedAt(lead.createdAt) || '—'],
      ]
    : [
        ['Email', email || '—'],
        ['Téléphone', phone || '—'],
        ['Reçu le', formatCreatedAt(lead.createdAt) || '—'],
      ]) as string[][];

  return (
    <div className="space-y-6">
      <BackLink href={backHref} label={backLabel} />

      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-2xl font-semibold text-primary">{name || 'Demande'}</h2>
          <StatusBadge value={currentStatus} />
          <PriorityBadge value={lead.priorite} />
          <FollowUpBadge value={lead.nextFollowUpAt} />
          {isUnhandled(lead) && (
            <Badge variant="destructive" className="gap-1"><AlertTriangle className="h-3 w-3" /> non traité (&gt; 48 h)</Badge>
          )}
          <NotifyBadge value={lead.notifyStatus} emailStatus={lead.emailStatus} />
        </div>
        <p className="text-sm text-muted-foreground">
          {reference ? `${reference} · ` : ''}{formatCreatedAt(lead.createdAt)}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Colonne principale : informations, message, notes, historique */}
        <div className="space-y-6 min-w-0">
          <Card>
            <CardContent className="pt-6">
              <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                {details.map(([k, v]) => (
                  <div key={k} className="min-w-0">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="break-words font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>

          {/* Attribution Marketing / Campagnes UTM */}
          {(str(lead.utmSource) || str(lead.utmMedium) || str(lead.utmCampaign) || str(lead.referrer) || str(lead.landingPage)) && (
            <Card className="border-primary/20 bg-muted/10">
              <CardContent className="pt-6 space-y-2">
                <h3 className="text-sm font-semibold text-primary">Traçabilité & Attribution Marketing</h3>
                <dl className="grid gap-x-6 gap-y-2 text-xs sm:grid-cols-2">
                  {str(lead.utmSource) && (
                    <div>
                      <dt className="text-muted-foreground">Source de trafic (utm_source)</dt>
                      <dd className="font-mono font-medium">{str(lead.utmSource)}</dd>
                    </div>
                  )}
                  {str(lead.utmMedium) && (
                    <div>
                      <dt className="text-muted-foreground">Canal (utm_medium)</dt>
                      <dd className="font-mono font-medium">{str(lead.utmMedium)}</dd>
                    </div>
                  )}
                  {str(lead.utmCampaign) && (
                    <div>
                      <dt className="text-muted-foreground">Campagne (utm_campaign)</dt>
                      <dd className="font-mono font-medium">{str(lead.utmCampaign)}</dd>
                    </div>
                  )}
                  {str(lead.referrer) && (
                    <div>
                      <dt className="text-muted-foreground">Site référent</dt>
                      <dd className="font-mono font-medium truncate" title={str(lead.referrer)}>{str(lead.referrer)}</dd>
                    </div>
                  )}
                  {str(lead.landingPage) && (
                    <div>
                      <dt className="text-muted-foreground">Page d'atterrissage</dt>
                      <dd className="font-mono font-medium">{str(lead.landingPage)}</dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>
          )}

          {str(lead.message) && (
            <section className="space-y-2">
              <h3 className="text-sm font-semibold text-primary">Message du client</h3>
              <div className="rounded-lg bg-muted/50 p-4 text-sm whitespace-pre-wrap break-words">{str(lead.message)}</div>
            </section>
          )}

          <section className="space-y-3">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-primary">
              <StickyNote className="h-4 w-4" aria-hidden /> Notes internes
            </h3>
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
              <Label htmlFor="lead-note" className="sr-only">Nouvelle note</Label>
              <Textarea
                id="lead-note"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Compte rendu d'appel, relance prévue…"
                maxLength={2000}
              />
              <div className="flex justify-end">
                <Button type="submit" size="sm" disabled={busy || !noteText.trim()}>Ajouter la note</Button>
              </div>
            </form>
            {[...notes].reverse().map((n, i) => (
              <div key={i} className="rounded-lg border-l-4 border-primary/40 bg-muted/30 p-3 text-sm">
                <div className="mb-1 text-xs text-muted-foreground">{n.by} · {formatCreatedAt(n.at)}</div>
                <div className="whitespace-pre-wrap break-words">{n.texte}</div>
              </div>
            ))}
            {notes.length === 0 && <p className="text-sm text-muted-foreground">Aucune note pour le moment.</p>}
          </section>

          <section className="space-y-3">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-primary">
              <History className="h-4 w-4" aria-hidden /> Historique
            </h3>
            {history.length === 0 && <p className="text-sm text-muted-foreground">Aucun évènement enregistré.</p>}
            {history.length > 0 && (
              <ol className="relative ml-2 space-y-3 border-l">
                {[...history].reverse().map((h, i) => (
                  <li key={i} className="ml-4 text-sm">
                    <span className="absolute -left-1.5 mt-1 h-3 w-3 rounded-full border-2 border-background bg-primary" aria-hidden />
                    <div>{h.event}</div>
                    <div className="text-xs text-muted-foreground">{h.by} · {formatCreatedAt(h.at)}</div>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>

        {/* Colonne d'actions */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardContent className="space-y-4 pt-6">
              <h3 className="text-sm font-semibold text-primary">Contacter</h3>
              <div className="flex flex-col gap-2">
                {waLink && (
                  <Button asChild variant="outline" className="justify-start">
                    <a href={waLink} target="_blank" rel="noopener noreferrer"><MessageCircle className="mr-2 h-4 w-4" /> WhatsApp</a>
                  </Button>
                )}
                {mailLink && (
                  <Button asChild variant="outline" className="justify-start">
                    <a href={mailLink}><Mail className="mr-2 h-4 w-4" /> Répondre par email</a>
                  </Button>
                )}
                {phone && (
                  <Button asChild variant="outline" className="justify-start">
                    <a href={`tel:${phone}`}><Phone className="mr-2 h-4 w-4" /> Appeler</a>
                  </Button>
                )}
                {!waLink && !mailLink && !phone && (
                  <p className="text-sm text-muted-foreground">Aucun moyen de contact enregistré.</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-5 pt-6">
              <div className="space-y-2">
                <Label htmlFor="lead-status" className="text-primary">Statut</Label>
                <Select
                  value={currentStatus}
                  onValueChange={(v) => patch({ crmStatus: v }, `Statut : ${STATUS_LABEL[v]}`)}
                  disabled={busy}
                >
                  <SelectTrigger id="lead-status"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lead-priority" className="text-primary">Priorité commerciale</Label>
                <Select
                  value={str(lead.priorite) || 'normale'}
                  onValueChange={(v) => patch({ priorite: v }, `Priorité : ${PRIORITY_CONFIG[v as Priority]?.label || v}`)}
                  disabled={busy}
                >
                  <SelectTrigger id="lead-priority"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map((p) => (
                      <SelectItem key={p} value={p}>{PRIORITY_CONFIG[p].label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <form
                className="space-y-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  patch(
                    { nextFollowUpAt: followUpDate },
                    followUpDate ? `Relance programmée au ${followUpDate}` : 'Relance programmée retirée'
                  );
                }}
              >
                <Label htmlFor="lead-followup" className="flex items-center gap-2 text-primary">
                  <Calendar className="h-4 w-4" aria-hidden /> Relance prévue
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="lead-followup"
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                  />
                  <Button type="submit" size="sm" disabled={busy}>OK</Button>
                </div>
              </form>

              <form
                className="space-y-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  patch({ assignee }, assignee ? `Assignée à ${assignee}` : 'Assignation retirée');
                }}
              >
                <Label htmlFor="lead-assignee" className="flex items-center gap-2 text-primary">
                  <UserPlus className="h-4 w-4" aria-hidden /> Responsable attribué
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="lead-assignee"
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    placeholder="Email du responsable"
                    maxLength={120}
                  />
                  <Button type="submit" size="sm" disabled={busy}>OK</Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Bloc Notifications & Délivrabilité */}
          <Card>
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-1.5 text-sm font-semibold text-primary">
                  <Mail className="h-4 w-4" aria-hidden /> Délivrabilité Emails
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={retrying || busy}
                  onClick={handleRetryEmails}
                  className="h-7 text-xs px-2"
                >
                  <RefreshCw className={`mr-1 h-3 w-3 ${retrying ? 'animate-spin' : ''}`} />
                  Rejouer
                </Button>
              </div>

              <div className="space-y-2 text-xs">
                <RecipientStatusRow
                  label="Client"
                  recipient={email || 'Non renseigné'}
                  summary={(lead.emailStatus as Record<string, unknown> | undefined)?.customer as Record<string, unknown> | undefined}
                  legacyStatus={!lead.emailStatus ? lead.notifyStatus : undefined}
                />
                <RecipientStatusRow
                  label="Agence"
                  recipient="contact@slaacvoyages.com"
                  summary={(lead.emailStatus as Record<string, unknown> | undefined)?.agency as Record<string, unknown> | undefined}
                  legacyStatus={!lead.emailStatus ? lead.notifyStatus : undefined}
                />
                <RecipientStatusRow
                  label="Direction"
                  recipient="mdslaacvoyages@gmail.com"
                  summary={(lead.emailStatus as Record<string, unknown> | undefined)?.manager as Record<string, unknown> | undefined}
                />
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function RecipientStatusRow({
  label,
  recipient,
  summary,
  legacyStatus,
}: {
  label: string;
  recipient: string;
  summary?: Record<string, unknown>;
  legacyStatus?: unknown;
}) {
  let statusBadge = <Badge variant="outline" className="text-[10px] text-muted-foreground">En attente</Badge>;

  if (summary && typeof summary === 'object') {
    const status = String(summary.status || '');
    if (status === 'sent') {
      statusBadge = <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">Envoyé</Badge>;
    } else if (status === 'failed' || status === 'permanently_failed') {
      statusBadge = <Badge variant="destructive" className="text-[10px]">Échec</Badge>;
    } else if (status === 'processing') {
      statusBadge = <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-700 border-amber-200">En cours</Badge>;
    }
  } else if (legacyStatus) {
    const v = String(legacyStatus);
    if (v === 'sent') {
      statusBadge = <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">Envoyé</Badge>;
    } else if (v.startsWith('failed:')) {
      statusBadge = <Badge variant="destructive" className="text-[10px]">Échec</Badge>;
    }
  }

  const lastError = summary && typeof summary.lastError === 'string' ? summary.lastError : null;

  return (
    <div className="rounded border bg-muted/20 p-2">
      <div className="flex items-center justify-between gap-1">
        <span className="font-semibold text-primary">{label}</span>
        {statusBadge}
      </div>
      <div className="truncate text-muted-foreground mt-0.5" title={recipient}>{recipient}</div>
      {lastError && (
        <div className="mt-1 text-[11px] text-destructive truncate" title={lastError}>
          Erreur : {lastError}
        </div>
      )}
    </div>
  );
}

function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
      <ArrowLeft className="h-4 w-4" aria-hidden /> Retour : {label}
    </Link>
  );
}
