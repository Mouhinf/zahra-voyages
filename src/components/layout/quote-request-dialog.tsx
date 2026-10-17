'use client';

import React, { useState, useEffect, useId } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  Send,
  Loader2,
  CheckCircle2,
  Copy,
  Check,
  MessageCircle,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import {
  SERVICE_VALUES,
  SERVICE_OPTIONS,
  type ServiceType,
  quoteSchema,
  type QuoteInput,
} from '@/lib/schemas/quote-schema';

export function QuoteRequestDialog({
  children,
  defaultService,
  defaultDestination,
  source,
}: {
  children: React.ReactNode;
  defaultService?: ServiceType;
  defaultDestination?: string;
  source?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
      </Dialog>
      <QuoteRequestModal
        open={open}
        onOpenChange={setOpen}
        defaultService={defaultService}
        defaultDestination={defaultDestination}
        source={source}
      />
    </>
  );
}

export function QuoteRequestModal({
  open,
  onOpenChange,
  defaultService,
  defaultDestination,
  source,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultService?: ServiceType;
  defaultDestination?: string;
  source?: string;
}) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [successInfo, setSuccessInfo] = useState<{
    reference: string;
    service: string;
    phone: string;
  } | null>(null);

  // Identifiant unique de soumission pour l'idempotence client-serveur
  const instanceId = useId();
  const [submissionId, setSubmissionId] = useState('');

  useEffect(() => {
    if (open) {
      setSubmissionId(`${Date.now()}-${Math.random().toString(36).slice(2, 9)}`);
    } else {
      // Réinitialiser le mode succès après fermeture
      const timeout = setTimeout(() => {
        setSuccessInfo(null);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  // Récupération des paramètres UTM d'acquisition
  const [utmParams, setUtmParams] = useState<Record<string, string>>({});
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const search = new URLSearchParams(window.location.search);
      const params: Record<string, string> = {};
      const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
      for (const k of utmKeys) {
        const val = search.get(k);
        if (val) params[k] = val;
      }
      if (document.referrer) params.referrer = document.referrer;
      params.landingPage = window.location.pathname;
      setUtmParams(params);
    }
  }, []);

  const form = useForm<QuoteInput>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      service: defaultService ?? 'reservation-express',
      name: '',
      email: '',
      phone: '',
      destination: defaultDestination ?? '',
      travelers: '1',
      message: '',
      nights: undefined,
      roomType: undefined,
      transportClass: undefined,
      roundTrip: false,
      departureDate: '',
      returnDate: '',
      durationDays: undefined,
      cabinType: undefined,
      excursionDate: '',
      pickupLocation: '',
      attendees: undefined,
      eventType: '',
      companyName: '',
      studyCity: '',
      studyDegree: '',
      appointmentReason: '',
      website: '',
    },
  });

  // Mettre à jour le service si defaultService change à l'ouverture
  useEffect(() => {
    if (defaultService) {
      form.setValue('service', defaultService);
    }
    if (defaultDestination) {
      form.setValue('destination', defaultDestination);
    }
  }, [defaultService, defaultDestination, form]);

  const service = form.watch('service');
  const roundTrip = form.watch('roundTrip');

  async function onSubmit(values: QuoteInput) {
    setIsSubmitting(true);
    try {
      const payload = {
        ...values,
        source: source || 'modal-quote',
        clientSubmissionId: submissionId || `${instanceId}-${Date.now()}`,
        utmSource: utmParams.utm_source,
        utmMedium: utmParams.utm_medium,
        utmCampaign: utmParams.utm_campaign,
        utmContent: utmParams.utm_content,
        utmTerm: utmParams.utm_term,
        referrer: utmParams.referrer,
        landingPage: utmParams.landingPage,
      };

      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(body?.error || 'Erreur lors de l’enregistrement de votre demande.');
      }

      const ref = body?.reference || 'DV-EN-COURS';
      setSuccessInfo({
        reference: ref,
        service: values.service,
        phone: values.phone,
      });

      toast({
        title: 'Demande enregistrée !',
        description: `Référence : ${ref}. Nos conseillers préparent votre devis.`,
      });

      form.reset();
    } catch (err: unknown) {
      console.error('Quote submit error:', err);
      toast({
        title: 'Envoi impossible',
        description:
          (err instanceof Error && err.message) ||
          'Une erreur est survenue. Veuillez vérifier vos informations ou nous contacter sur WhatsApp.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const copyReference = () => {
    if (successInfo?.reference) {
      navigator.clipboard.writeText(successInfo.reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      toast({
        title: 'Copié !',
        description: 'La référence a été copiée dans votre presse-papier.',
      });
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Bonjour SLAAC Voyages, je viens d'enregistrer ma demande de devis sous la référence ${
      successInfo?.reference || ''
    }. Pouvez-vous m'apporter des précisions ?`
  );
  const whatsappUrl = `https://wa.me/221773129090?text=${whatsappMessage}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[100dvh] max-h-[100dvh] w-[calc(100%-2rem)] max-w-[640px] gap-0 overflow-hidden p-0 sm:h-auto sm:max-h-[92dvh] rounded-xl shadow-2xl">
        {/* ÉCRAN DE CONFIRMATION RASSURANT APRES SOUMISSION */}
        {successInfo ? (
          <div className="flex flex-col h-full w-full">
            <DialogHeader className="shrink-0 border-b bg-emerald-50/60 dark:bg-emerald-950/20 px-6 py-5 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-2 shadow-inner">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <DialogTitle className="text-xl sm:text-2xl font-bold text-emerald-950 dark:text-emerald-100 font-headline">
                Demande Enregistrée avec Succès !
              </DialogTitle>
              <DialogDescription className="text-emerald-800 dark:text-emerald-200 text-sm">
                Votre projet est entre les mains de nos conseillers spécialistes.
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {/* Carte Référence */}
              <div className="rounded-xl border border-primary/20 bg-secondary/30 p-4 text-center space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Votre référence de dossier
                </span>
                <div className="flex items-center justify-center gap-3">
                  <span className="font-mono text-xl sm:text-2xl font-bold text-primary tracking-wide">
                    {successInfo.reference}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={copyReference}
                    className="h-8 px-2.5 text-xs gap-1.5"
                    title="Copier la référence"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Copié</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copier</span>
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Conservez cette référence pour tout échange avec votre conseiller dédié.
                </p>
              </div>

              {/* Étapes suivantes (Transparence & CRO) */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-primary flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-primary" /> Prochaines étapes de votre prise en charge
                </h4>
                <ol className="space-y-2.5 text-xs sm:text-sm text-muted-foreground">
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      1
                    </span>
                    <span>
                      <strong>Analyse de vos besoins</strong> : Un conseiller examine vos critères et vos dates.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      2
                    </span>
                    <span>
                      <strong>Élaboration du devis sur mesure</strong> : Nous sélectionnons les options aux meilleurs tarifs.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      3
                    </span>
                    <span>
                      <strong>Contact personnalisé</strong> : Vous recevez votre devis détaillé par email ou directement sur WhatsApp.
                    </span>
                  </li>
                </ol>
              </div>

              {/* CTA WhatsApp Rapide */}
              <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-4 space-y-2.5">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200 font-medium text-sm">
                  <MessageCircle className="h-4 w-4 text-emerald-600" />
                  <span>Besoin d'une réponse urgente ?</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Accélérez le traitement de votre demande en échangeant directement avec un conseiller sur WhatsApp :
                </p>
                <Button
                  asChild
                  className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-medium shadow-sm"
                >
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-4 w-4 fill-current" />
                    Échanger sur WhatsApp avec ma référence
                  </a>
                </Button>
              </div>
            </div>

            <DialogFooter className="shrink-0 gap-2 border-t bg-background px-6 py-4 flex flex-row justify-between sm:justify-end">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSuccessInfo(null)}
                className="text-xs text-muted-foreground gap-1"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Nouvelle demande
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="default" size="sm">
                  Fermer
                </Button>
              </DialogClose>
            </DialogFooter>
          </div>
        ) : (
          /* FORMULAIRE DE SAISIE AVEC DÉCLINAISONS CONTEXTUELLES */
          <>
            <DialogHeader className="shrink-0 space-y-1.5 border-b px-6 py-4 pr-14 text-left bg-muted/20">
              <DialogTitle className="text-lg sm:text-xl font-bold font-headline text-primary">
                Demander un devis sur mesure
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
                Précisez votre projet en quelques instants. Demande gratuite et sans engagement.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col">
                <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-6 py-4">
                  {/* Pot de miel anti-spam pour robots */}
                  <div className="hidden" aria-hidden="true">
                    <input
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      {...form.register('website')}
                    />
                  </div>

                  {/* Sélection du service */}
                  <FormField
                    control={form.control}
                    name="service"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-primary">Prestation souhaitée</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="font-medium">
                              <SelectValue placeholder="Choisir un service" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {SERVICE_OPTIONS.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Coordonnées Client */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom complet *</FormLabel>
                          <FormControl>
                            <Input placeholder="Votre prénom et nom" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Téléphone / WhatsApp *</FormLabel>
                          <FormControl>
                            <Input placeholder="+221 77 000 00 00" type="tel" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adresse email (Recommandé pour recevoir le devis)</FormLabel>
                        <FormControl>
                          <Input placeholder="nom@exemple.com" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* ======================================================== */}
                  {/* CHAMPS CONTEXTUELS PAR SERVICE */}
                  {/* ======================================================== */}

                  {/* 1. Hébergement */}
                  {service === 'hebergement' && (
                    <div className="rounded-lg border bg-muted/20 p-3.5 space-y-3.5">
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                        Détails de l'hébergement
                      </span>
                      <FormField
                        control={form.control}
                        name="destination"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ville ou destination de l'hôtel</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Dakar, Saly, Dubaï, Paris..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <FormField
                          control={form.control}
                          name="nights"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nombre de nuits</FormLabel>
                              <FormControl>
                                <Input type="number" min={1} placeholder="Ex: 3" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="roomType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Type de chambre</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Standard / Suite..." />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="standard">Standard</SelectItem>
                                  <SelectItem value="deluxe">Deluxe</SelectItem>
                                  <SelectItem value="suite">Suite</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}

                  {/* 2. Transport & Transferts AIBD */}
                  {service === 'transport' && (
                    <div className="rounded-lg border bg-muted/20 p-3.5 space-y-3.5">
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                        Détails du transport / trajet
                      </span>
                      <FormField
                        control={form.control}
                        name="destination"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Trajet ou destination souhaitée</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: AIBD ➔ Dakar, ou Dakar ➔ Paris" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex items-center space-x-2 pt-1">
                        <FormField
                          control={form.control}
                          name="roundTrip"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={Boolean(field.value)}
                                  onCheckedChange={(checked) => field.onChange(checked === true)}
                                />
                              </FormControl>
                              <FormLabel className="text-sm cursor-pointer font-normal">
                                Trajet Aller-Retour
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FormField
                          control={form.control}
                          name="departureDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date de départ / prise en charge</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {roundTrip && (
                          <FormField
                            control={form.control}
                            name="returnDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Date de retour</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>
                      <FormField
                        control={form.control}
                        name="transportClass"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Classe de voyage</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Économique / Affaires..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="economy">Économique</SelectItem>
                                <SelectItem value="business">Affaires (Business)</SelectItem>
                                <SelectItem value="first">Première classe</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* 3. Voyages & Croisières */}
                  {service === 'voyages-croisieres' && (
                    <div className="rounded-lg border bg-muted/20 p-3.5 space-y-3.5">
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                        Détails de la croisière / circuit
                      </span>
                      <FormField
                        control={form.control}
                        name="destination"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Destination / Circuit de croisière</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Méditerranée, Caraïbes, Fjords..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <FormField
                          control={form.control}
                          name="durationDays"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Durée estimée (jours)</FormLabel>
                              <FormControl>
                                <Input type="number" min={1} placeholder="Ex: 7" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="cabinType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Type de cabine</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Balcon, Vue mer..." />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="inside">Intérieure</SelectItem>
                                  <SelectItem value="oceanview">Vue mer</SelectItem>
                                  <SelectItem value="balcony">Avec balcon</SelectItem>
                                  <SelectItem value="suite">Suite</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}

                  {/* 4. Excursions */}
                  {service === 'excursions' && (
                    <div className="rounded-lg border bg-muted/20 p-3.5 space-y-3.5">
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                        Détails de l'excursion
                      </span>
                      <FormField
                        control={form.control}
                        name="destination"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Circuit / Lieu de visite</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Île de Gorée, Lac Rose, Sine Saloum..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FormField
                          control={form.control}
                          name="excursionDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date souhaitée</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="pickupLocation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Point de départ</FormLabel>
                              <FormControl>
                                <Input placeholder="Ex: Hôtel à Dakar, Saly..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}

                  {/* 5. Tourisme d'affaires */}
                  {service === 'tourisme-affaires' && (
                    <div className="rounded-lg border bg-muted/20 p-3.5 space-y-3.5">
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                        Détails de l'événement d'entreprise
                      </span>
                      <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom de votre entreprise / organisation</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Cabinet Alpha, Société Générale..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <FormField
                          control={form.control}
                          name="eventType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Type d'événement</FormLabel>
                              <FormControl>
                                <Input placeholder="Séminaire, Gala, Incentive..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="attendees"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nombre de participants</FormLabel>
                              <FormControl>
                                <Input type="number" min={1} placeholder="Ex: 50" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}

                  {/* 6. Assistance Visa */}
                  {service === 'assistance-visa' && (
                    <div className="rounded-lg border bg-muted/20 p-3.5 space-y-3.5">
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                        Détails du visa
                      </span>
                      <FormField
                        control={form.control}
                        name="destination"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pays de destination du visa</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: France, Canada, Turquie, USA..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="departureDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date prévue de voyage</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* 7. Assurance voyage */}
                  {service === 'assurance-voyage' && (
                    <div className="rounded-lg border bg-muted/20 p-3.5 space-y-3.5">
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                        Couverture d'assurance
                      </span>
                      <FormField
                        control={form.control}
                        name="destination"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Zone géographique couverte</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Espace Schengen, Monde entier..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <FormField
                          control={form.control}
                          name="departureDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date de début</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="returnDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date de fin</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}

                  {/* 8. Préinscription Universitaire */}
                  {service === 'preinscription-universitaire' && (
                    <div className="rounded-lg border bg-muted/20 p-3.5 space-y-3.5">
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                        Projet d'études internationales
                      </span>
                      <FormField
                        control={form.control}
                        name="studyCity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pays / Ville d'études souhaité</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: France (Paris), Canada (Montréal)..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="studyDegree"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Niveau et filière d'études visés</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Licence Informatique, Master Finance..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* 9. Prise de rendez-vous */}
                  {service === 'prise-de-rendez-vous' && (
                    <div className="rounded-lg border bg-muted/20 p-3.5 space-y-3.5">
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                        Rendez-vous à l'agence
                      </span>
                      <FormField
                        control={form.control}
                        name="appointmentReason"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Motif du rendez-vous</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Conseil séjour Omra, Préparation dossier visa..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="departureDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date souhaitée pour l'entretien</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* 10. Réservation Express / Générique */}
                  {service === 'reservation-express' && (
                    <FormField
                      control={form.control}
                      name="destination"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Destination ou prestation souhaitée</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Billet d'avion Paris, Séjour Dubaï..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Nombre de voyageurs / personnes (pour les services concernés) */}
                  {!['prise-de-rendez-vous', 'tourisme-affaires'].includes(service) && (
                    <FormField
                      control={form.control}
                      name="travelers"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre de voyageurs / personnes</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: 2 adultes, 1 enfant" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Message libre / précisions */}
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Précisions / attentes particulières (Optionnel)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Préférences de dates, budget indicatif, compagnie aérienne préférée, hôtel souhaité..."
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter className="shrink-0 gap-2 border-t bg-background px-6 py-4 flex flex-row items-center justify-between sm:justify-end">
                  <DialogClose asChild>
                    <Button type="button" variant="outline" disabled={isSubmitting}>
                      Annuler
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={isSubmitting} className="min-w-[150px]">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enregistrement...
                      </>
                    ) : (
                      <>
                        Envoyer ma demande <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
