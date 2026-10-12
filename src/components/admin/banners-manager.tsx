'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Megaphone, Pencil, Plus, Archive, Trash2, Eye } from 'lucide-react';
import type { PromoBanner, PromoStatus } from '@/types/promo-banner';

// ---------------------------------------------------------------------------
// Administration du bandeau publicitaire (collection promotionalBanners).
// Toutes les opérations passent par /api/admin/banners (Bearer ID token,
// rôle vérifié côté serveur) — aucun accès Firestore direct ici.
// ---------------------------------------------------------------------------

const formSchema = z
  .object({
    message: z.string().trim().min(3, 'Au moins 3 caractères.').max(110, '110 caractères maximum.'),
    campaignType: z.enum(['generale', 'excursion', 'hebergement', 'transport', 'evenement', 'autre']),
    href: z.string().trim().max(300).optional().or(z.literal('')),
    ctaLabel: z.string().trim().max(30).optional().or(z.literal('')),
    variant: z.enum(['or', 'marine', 'vert']),
    order: z.coerce.number().int().min(0).max(9999),
    status: z.enum(['brouillon', 'publie', 'archive']),
    startAt: z.string().optional().or(z.literal('')),
    endAt: z.string().optional().or(z.literal('')),
    newTab: z.boolean(),
  })
  .refine((v) => !v.startAt || !v.endAt || v.startAt < v.endAt, {
    message: 'La date de fin doit suivre la date de début.',
    path: ['endAt'],
  });

type FormValues = z.infer<typeof formSchema>;

const STATUS_BADGE: Record<PromoStatus, string> = {
  publie: 'bg-green-100 text-green-800',
  brouillon: 'bg-yellow-100 text-yellow-800',
  archive: 'bg-gray-200 text-gray-600',
};

const CAMPAIGN_LABELS: Record<string, string> = {
  generale: 'Générale', excursion: 'Excursion', hebergement: 'Hébergement',
  transport: 'Transport', evenement: 'Événement', autre: 'Autre',
};

const VARIANT_PREVIEW: Record<string, string> = {
  or: 'bg-accent text-accent-foreground',
  marine: 'bg-primary text-primary-foreground',
  vert: 'bg-green-700 text-white',
};

type Filter = 'toutes' | 'publiees' | 'programmees' | 'expirees' | 'brouillons' | 'archivees';

function classer(b: PromoBanner): Filter {
  if (b.status === 'archive') return 'archivees';
  if (b.status === 'brouillon') return 'brouillons';
  const now = Date.now();
  if (b.startAt && Date.parse(b.startAt) > now) return 'programmees';
  if (b.endAt && Date.parse(b.endAt) < now) return 'expirees';
  return 'publiees';
}

/** datetime-local -> ISO : l'heure saisie est l'heure de Dakar (GMT = UTC). */
function isoToLocalInput(iso: string): string {
  return iso ? iso.slice(0, 16) : '';
}

async function authHeaders(): Promise<Record<string, string>> {
  const { getAuthInstance } = await import('@/lib/firebase');
  const token = (await getAuthInstance().currentUser?.getIdToken()) ?? '';
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

const EMPTY: FormValues = {
  message: '', campaignType: 'generale', href: '', ctaLabel: '',
  variant: 'or', order: 100, status: 'brouillon',
  startAt: '', endAt: '', newTab: false,
};

export default function BannersManager() {
  const { toast } = useToast();
  const [banners, setBanners] = useState<PromoBanner[] | null>(null);
  const [filter, setFilter] = useState<Filter>('toutes');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<PromoBanner | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PromoBanner | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<FormValues>({ resolver: zodResolver(formSchema), defaultValues: EMPTY });

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/banners', { headers: await authHeaders(), cache: 'no-store' });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.error || 'Chargement impossible');
      setBanners(body.banners ?? []);
    } catch (e) {
      setBanners([]);
      toast({
        title: 'Chargement impossible',
        description: e instanceof Error ? e.message : 'Réessayez dans un instant.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  function openAdd() {
    setEditing(null);
    form.reset({ ...EMPTY, order: (banners?.length ?? 0) + 1 > 100 ? 100 : (banners?.reduce((m, b) => Math.max(m, b.order), 0) ?? 0) + 1 });
    setDialogOpen(true);
  }

  function openEdit(b: PromoBanner) {
    setEditing(b);
    form.reset({
      message: b.message,
      campaignType: b.campaignType ?? 'generale',
      href: b.href ?? '',
      ctaLabel: b.ctaLabel ?? '',
      variant: b.variant ?? 'or',
      order: b.order ?? 100,
      status: b.status ?? 'brouillon',
      startAt: isoToLocalInput(b.startAt ?? ''),
      endAt: isoToLocalInput(b.endAt ?? ''),
      newTab: Boolean(b.newTab),
    });
    setDialogOpen(true);
  }

  async function onSubmit(values: FormValues) {
    setIsSaving(true);
    try {
      const res = await fetch(
        editing ? `/api/admin/banners/${editing.id}` : '/api/admin/banners',
        {
          method: editing ? 'PATCH' : 'POST',
          headers: await authHeaders(),
          body: JSON.stringify({
            ...values,
            startAt: values.startAt || '',
            endAt: values.endAt || '',
          }),
        }
      );
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.error || 'Enregistrement impossible');
      toast({ title: editing ? 'Annonce modifiée' : 'Annonce créée', description: 'La diffusion est mise à jour en moins d’une minute.' });
      setDialogOpen(false);
      await load();
    } catch (e) {
      toast({
        title: 'Échec de l’enregistrement',
        description: e instanceof Error ? e.message : 'Réessayez dans un instant.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function patchStatus(b: PromoBanner, status: PromoStatus) {
    try {
      const res = await fetch(`/api/admin/banners/${b.id}`, {
        method: 'PATCH',
        headers: await authHeaders(),
        body: JSON.stringify({ status }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.error || 'Modification impossible');
      toast({ title: status === 'archive' ? 'Annonce archivée' : 'Statut mis à jour' });
      await load();
    } catch (e) {
      toast({
        title: 'Échec',
        description: e instanceof Error ? e.message : 'Réessayez dans un instant.',
        variant: 'destructive',
      });
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);
    try {
      const res = await fetch(`/api/admin/banners/${target.id}`, {
        method: 'DELETE',
        headers: await authHeaders(),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.error || 'Suppression impossible');
      toast({ title: 'Annonce supprimée' });
      await load();
    } catch (e) {
      toast({
        title: 'Échec de la suppression',
        description: e instanceof Error ? e.message : 'Réessayez dans un instant.',
        variant: 'destructive',
      });
    }
  }

  const filtered = useMemo(() => {
    if (!banners) return null;
    return banners.filter((b) => filter === 'toutes' || classer(b) === filter);
  }, [banners, filter]);

  const watched = form.watch();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
            <Megaphone className="h-6 w-6" aria-hidden="true" /> Bandeau publicitaire
          </h2>
          <p className="text-sm text-muted-foreground">
            Annonces diffusées en rotation dans le bandeau supérieur du site. Horaires exprimés en heure de Dakar.
          </p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="mr-2 h-4 w-4" /> Nouvelle annonce
        </Button>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer les annonces">
        {([
          ['toutes', 'Toutes'], ['publiees', 'Publiées'], ['programmees', 'Programmées'],
          ['expirees', 'Expirées'], ['brouillons', 'Brouillons'], ['archivees', 'Archivées'],
        ] as Array<[Filter, string]>).map(([value, label]) => (
          <Button
            key={value}
            type="button"
            size="sm"
            variant={filter === value ? 'default' : 'outline'}
            onClick={() => setFilter(value)}
          >
            {label}
          </Button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          {filtered === null ? (
            <div className="p-4 space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-2/3" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="p-8 text-center text-muted-foreground">
              Aucune annonce dans cette catégorie. Le bandeau affiche alors l’annonce Dakar 2026 par défaut.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Message</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="hidden md:table-cell">Lien</TableHead>
                  <TableHead className="text-center">Ordre</TableHead>
                  <TableHead className="hidden lg:table-cell">Période</TableHead>
                  <TableHead className="hidden lg:table-cell">Modifiée</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="max-w-[16rem]">
                      <p className="truncate font-medium" title={b.message}>{b.message}</p>
                      <p className="text-xs text-muted-foreground">{CAMPAIGN_LABELS[b.campaignType] ?? b.campaignType}</p>
                    </TableCell>
                    <TableCell>
                      <Badge className={STATUS_BADGE[b.status] ?? ''}>{b.status}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell max-w-[10rem]">
                      <span className="truncate block text-xs text-muted-foreground" title={b.href}>{b.href || '—'}</span>
                    </TableCell>
                    <TableCell className="text-center">{b.order}</TableCell>
                    <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                      {b.startAt || b.endAt
                        ? `${b.startAt ? new Date(b.startAt).toLocaleDateString('fr-FR') : '…'} → ${b.endAt ? new Date(b.endAt).toLocaleDateString('fr-FR') : '…'}`
                        : 'Toujours'}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                      {b.updatedAt ? new Date(b.updatedAt).toLocaleDateString('fr-FR') : '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {b.status === 'publie' ? (
                          <Button size="sm" variant="outline" onClick={() => patchStatus(b, 'brouillon')} title="Dépublier">
                            <Eye className="h-4 w-4" aria-hidden="true" /><span className="sr-only">Dépublier</span>
                          </Button>
                        ) : b.status !== 'archive' ? (
                          <Button size="sm" variant="outline" onClick={() => patchStatus(b, 'publie')} title="Publier">
                            <Eye className="h-4 w-4" aria-hidden="true" /><span className="sr-only">Publier</span>
                          </Button>
                        ) : null}
                        {b.status !== 'archive' && (
                          <Button size="sm" variant="outline" onClick={() => patchStatus(b, 'archive')} title="Archiver">
                            <Archive className="h-4 w-4" aria-hidden="true" /><span className="sr-only">Archiver</span>
                          </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={() => openEdit(b)} title="Modifier">
                          <Pencil className="h-4 w-4" aria-hidden="true" /><span className="sr-only">Modifier</span>
                        </Button>
                        <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => setDeleteTarget(b)} title="Supprimer">
                          <Trash2 className="h-4 w-4" aria-hidden="true" /><span className="sr-only">Supprimer</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Formulaire création / modification */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="flex h-[100dvh] max-h-[100dvh] w-[calc(100%-2rem)] max-w-[640px] gap-0 overflow-hidden p-0 sm:h-auto sm:max-h-[92dvh]">
          <DialogHeader className="shrink-0 space-y-1.5 border-b px-6 py-4 pr-14 text-left">
            <DialogTitle>{editing ? 'Modifier l’annonce' : 'Nouvelle annonce'}</DialogTitle>
            <DialogDescription>
              Le message s’affiche en rotation dans le bandeau supérieur du site. Horaires en heure de Dakar (GMT).
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col">
              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-6 py-4">
                {/* Prévisualisation fidèle */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">Prévisualisation</p>
                  <div className={`h-9 rounded-md flex items-center justify-center px-3 ${VARIANT_PREVIEW[watched.variant] ?? VARIANT_PREVIEW.or}`}>
                    <span className="text-sm font-medium text-center line-clamp-1">
                      {watched.message || 'Votre message publicitaire…'}
                      {watched.ctaLabel && (
                        <span className="ml-2 font-semibold underline underline-offset-2">{watched.ctaLabel}</span>
                      )}
                    </span>
                  </div>
                </div>

                <FormField control={form.control} name="message" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message publicitaire</FormLabel>
                    <FormControl>
                      <Textarea rows={2} placeholder="Ex : JO Dakar 2026 : préparez votre séjour au Sénégal avec SLAAC Voyages" {...field} />
                    </FormControl>
                    <FormDescription>{(watched.message ?? '').length}/110 caractères</FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="campaignType" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type de campagne</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                          {Object.entries(CAMPAIGN_LABELS).map(([v, l]) => (
                            <SelectItem key={v} value={v}>{l}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="variant" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Variante graphique</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="or">Or (défaut)</SelectItem>
                          <SelectItem value="marine">Bleu marine</SelectItem>
                          <SelectItem value="vert">Vert</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="href" render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL de destination (facultatif)</FormLabel>
                    <FormControl>
                      <Input placeholder="/excursions ou https://…" {...field} />
                    </FormControl>
                    <FormDescription>Chemin interne ou https://. Sans lien, l’annonce est purement informative.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="ctaLabel" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Libellé d’action (facultatif)</FormLabel>
                      <FormControl><Input placeholder="Ex : Demander un devis" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="order" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ordre d’affichage</FormLabel>
                      <FormControl><Input type="number" min={0} max={9999} {...field} /></FormControl>
                      <FormDescription>1 = diffusé en premier.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="startAt" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Début (facultatif)</FormLabel>
                      <FormControl><Input type="datetime-local" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="endAt" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fin (facultatif)</FormLabel>
                      <FormControl><Input type="datetime-local" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="status" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="brouillon">Brouillon (non diffusée)</SelectItem>
                        <SelectItem value="publie">Publiée</SelectItem>
                        <SelectItem value="archive">Archivée</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="newTab" render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={(c) => field.onChange(c === true)} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Ouvrir dans un nouvel onglet</FormLabel>
                      <FormDescription>Réserver aux liens externes justifiés ; même onglet par défaut.</FormDescription>
                    </div>
                  </FormItem>
                )} />
              </div>
              <DialogFooter className="shrink-0 gap-2 border-t bg-background px-6 py-4">
                <Button type="button" variant="secondary" onClick={() => setDialogOpen(false)}>Annuler</Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? 'Enregistrement…' : editing ? 'Enregistrer les modifications' : 'Créer l’annonce'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Suppression — confirmation explicite */}
      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette annonce ?</AlertDialogTitle>
            <AlertDialogDescription>
              « {deleteTarget?.message} » sera définitivement supprimée. Pour la conserver sans la diffuser, préférez l’archivage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <Button variant="destructive" onClick={handleDelete}>Supprimer définitivement</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
