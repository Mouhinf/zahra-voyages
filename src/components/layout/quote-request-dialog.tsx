'use client';

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
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Send } from 'lucide-react';
import React, { useState } from 'react';

const ServiceEnum = z.enum([
  'hebergement',
  'transport',
  'voyages-croisieres',
  'excursions',
  'tourisme-affaires',
  'reservation-express',
  // Services d'assistance commercialisés sur /assistance-voyage.
  'assistance-visa',
  'assurance-voyage',
  'preinscription-universitaire',
  'prise-de-rendez-vous',
]);

const SERVICE_OPTIONS: Array<{ value: z.infer<typeof ServiceEnum>; label: string }> = [
  { value: 'hebergement', label: 'Hébergement' },
  { value: 'transport', label: 'Transport' },
  { value: 'voyages-croisieres', label: 'Voyages & Croisières' },
  { value: 'excursions', label: 'Excursions' },
  { value: 'tourisme-affaires', label: 'Tourisme d\'affaires' },
  { value: 'reservation-express', label: 'Réservation Express' },
  { value: 'assistance-visa', label: 'Assistance visa' },
  { value: 'assurance-voyage', label: 'Assurance voyage' },
  { value: 'preinscription-universitaire', label: 'Préinscription universitaire' },
  { value: 'prise-de-rendez-vous', label: 'Prise de rendez-vous' },
];

const baseSchema = z.object({
  service: ServiceEnum.default('hebergement'),
  name: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères.' }),
  email: z.string().email({ message: 'Veuillez entrer une adresse email valide.' }).optional().or(z.literal('')),
  phone: z.string().min(1, { message: 'Veuillez entrer un numéro de téléphone.' }),
  destination: z.string().min(2, { message: 'Veuillez préciser une destination.'}).optional(),
  departureDate: z.string().optional(),
  travelers: z.coerce.number().min(1, { message: 'Il doit y avoir au moins 1 voyageur.'}).optional(),
  message: z.string().optional(),
});

// Extended conditional fields per service (all optional at root level, validated client-side before send)
const formSchema = baseSchema.extend({
  // hébergement
  nights: z.coerce.number().optional(),
  roomType: z.enum(['standard','deluxe','suite']).optional(),
  // transport
  transportClass: z.enum(['economy','business','first']).optional(),
  roundTrip: z.boolean().optional(),
  returnDate: z.string().optional(),
  // voyages-croisieres
  durationDays: z.coerce.number().optional(),
  cabinType: z.enum(['inside','oceanview','balcony','suite']).optional(),
  // excursions
  excursionDate: z.string().optional(),
  pickupLocation: z.string().optional(),
  // tourisme-affaires
  attendees: z.coerce.number().optional(),
  eventType: z.string().optional(),
});

export function QuoteRequestDialog({
  children,
  defaultService,
  defaultDestination,
  source,
}: {
  children: React.ReactNode;
  defaultService?: z.infer<typeof ServiceEnum>;
  defaultDestination?: string;
  source?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
      </Dialog>
      <QuoteRequestModal open={open} onOpenChange={setOpen} defaultService={defaultService} defaultDestination={defaultDestination} source={source} />
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
  defaultService?: z.infer<typeof ServiceEnum>;
  defaultDestination?: string;
  source?: string;
}) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      service: defaultService ?? 'hebergement',
      name: '',
      email: '',
      phone: '',
      destination: defaultDestination ?? '',
      travelers: 1,
      message: '',
      nights: undefined,
      roomType: undefined,
      transportClass: undefined,
      roundTrip: false,
      returnDate: undefined,
      durationDays: undefined,
      cabinType: undefined,
      excursionDate: undefined,
      pickupLocation: undefined,
      attendees: undefined,
      eventType: undefined,
    },
  });

  const service = form.watch('service');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, source }),
      });

      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.error || 'Erreur serveur');

      toast({
        title: 'Devis demandé !',
        description: body?.reference
          ? `Votre référence : ${body.reference}. Notre équipe vous recontacte rapidement.`
          : 'Merci ! Votre demande de devis a bien été envoyée. Nous reviendrons vers vous rapidement.',
      });
      form.reset();
      onOpenChange(false);
    } catch (err: unknown) {
      console.error('Quote submit error:', err);
      toast({
        title: 'Erreur',
        description: (err instanceof Error && err.message) || 'Impossible d’envoyer la demande, réessayez plus tard.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>Demander un devis</DialogTitle>
          <DialogDescription>
            Remplissez le formulaire ci-dessous et notre équipe vous contactera avec une offre personnalisée.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="service"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quel service souhaitez-vous ?</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir un service" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SERVICE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom complet</FormLabel>
                  <FormControl>
                    <Input placeholder="Votre nom et prénom" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Votre adresse email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className='mt-4'>
                  <FormLabel>Numéro de téléphone</FormLabel>
                  <FormControl>
                    <Input placeholder="Votre numéro de téléphone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Destination générique — masquée pour les services qui ont
                leur propre formulation (visa, assurance) ou pas de
                destination (rendez-vous, préinscription). */}
            {!['assistance-visa', 'assurance-voyage', 'prise-de-rendez-vous', 'preinscription-universitaire'].includes(service) && (
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Paris, Dubaï..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {service === 'preinscription-universitaire' && (
              <FormField control={form.control} name="destination" render={({ field }) => (
                <FormItem>
                  <FormLabel>Pays / ville d'études visé</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: France, Canada, Maroc..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            )}

            {/* Conditional fields based on selected service */}
            {service === 'hebergement' && (
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="nights" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de nuits</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ex: 3" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="roomType" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de chambre</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir" />
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
                )} />
              </div>
            )}

            {service === 'transport' && (
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="transportClass" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Classe</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="economy">Économique</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="first">First</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="roundTrip" render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={Boolean(field.value)}
                        onCheckedChange={(checked) => field.onChange(checked === true)}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Aller-retour</FormLabel>
                    </div>
                  </FormItem>
                )} />
                <FormField control={form.control} name="returnDate" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de retour (si aller-retour)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            )}

            {service === 'voyages-croisieres' && (
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="durationDays" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Durée (jours)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ex: 7" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="cabinType" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de cabine</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="inside">Intérieure</SelectItem>
                        <SelectItem value="oceanview">Vue mer</SelectItem>
                        <SelectItem value="balcony">Balcon</SelectItem>
                        <SelectItem value="suite">Suite</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            )}

            {service === 'excursions' && (
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="excursionDate" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de l'excursion</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="pickupLocation" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Point de départ</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Hôtel, Aéroport..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            )}

            {service === 'tourisme-affaires' && (
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="attendees" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de participants</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ex: 50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="eventType" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type d'événement</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Séminaire, Incentive..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            )}

            {service === 'assistance-visa' && (
              <FormField control={form.control} name="destination" render={({ field }) => (
                <FormItem>
                  <FormLabel>Pays de destination du visa</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: France, Canada, États-Unis..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            )}

            {service === 'assurance-voyage' && (
              <FormField control={form.control} name="destination" render={({ field }) => (
                <FormItem>
                  <FormLabel>Zone de couverture souhaitée</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Schengen, Monde..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            )}

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Votre message (Optionnel)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Dites-nous en plus sur vos attentes (type d'hébergement, activités souhaitées, etc.)"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary" disabled={isSubmitting}>
                        Annuler
                    </Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Envoi en cours…' : <>Envoyer ma demande <Send className="ml-2 h-4 w-4" /></>}
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
