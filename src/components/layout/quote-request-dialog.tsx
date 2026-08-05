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
import { useToast } from '@/hooks/use-toast';
import { Send, CalendarIcon, Users } from 'lucide-react';
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar } from '../ui/calendar';
import { fr } from 'date-fns/locale';

const ServiceEnum = z.enum(['hebergement','transport','voyages-croisieres','excursions','tourisme-affaires','reservation-express']);

const baseSchema = z.object({
  service: ServiceEnum.default('hebergement'),
  name: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères.' }),
  email: z.string().email({ message: 'Veuillez entrer une adresse email valide.' }).optional().or(z.literal('')),
  phone: z.string().min(1, { message: 'Veuillez entrer un numéro de téléphone.' }),
  destination: z.string().min(2, { message: 'Veuillez préciser une destination.'}),
  departureDate: z.date({ required_error: "Une date de départ est requise." }).optional(),
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
  returnDate: z.date().optional(),
  // voyages-croisieres
  durationDays: z.coerce.number().optional(),
  cabinType: z.enum(['inside','oceanview','balcony','suite']).optional(),
  // excursions
  excursionDate: z.date().optional(),
  pickupLocation: z.string().optional(),
  // tourisme-affaires
  attendees: z.coerce.number().optional(),
  eventType: z.string().optional(),
});

export function QuoteRequestDialog({
  children,
  defaultDestination,
}: {
  children: React.ReactNode;
  defaultDestination?: string;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
      </Dialog>
      <QuoteRequestModal open={open} onOpenChange={setOpen} defaultDestination={defaultDestination} />
    </>
  );
}

export function QuoteRequestModal({
  open,
  onOpenChange,
  defaultDestination,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDestination?: string;
}) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      service: 'hebergement',
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
    try {
      // Prepare payload (convert Dates to ISO)
      const payload: any = { ...values };
      ['departureDate','returnDate','excursionDate'].forEach((k) => {
        const v = (values as any)[k];
        if (v instanceof Date) payload[k] = v.toISOString();
      });

      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(()=>({}));
        throw new Error(body?.error || 'Erreur serveur');
      }

      toast({
        title: 'Devis demandé !',
        description: 'Merci ! Votre demande de devis a bien été envoyée. Nous reviendrons vers vous rapidement.',
      });
      form.reset();
      onOpenChange(false);
    } catch (err: any) {
      console.error('Quote submit error:', err);
      toast({
        title: 'Erreur',
        description: err?.message || 'Impossible d’envoyer la demande, réessayez plus tard.',
        variant: 'destructive',
      });
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
                  <FormControl>
                    <select {...field} className="w-full rounded-md border px-3 py-2">
                      <option value="hebergement">Hébergement</option>
                      <option value="transport">Transport</option>
                      <option value="voyages-croisieres">Voyages & Croisières</option>
                      <option value="excursions">Excursions</option>
                      <option value="tourisme-affaires">Tourisme d'affaires</option>
                      <option value="reservation-express">Réservation Express</option>
                    </select>
                  </FormControl>
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
                    <FormControl>
                      <select {...field} className="w-full rounded-md border px-3 py-2">
                        <option value="standard">Standard</option>
                        <option value="deluxe">Deluxe</option>
                        <option value="suite">Suite</option>
                      </select>
                    </FormControl>
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
                    <FormControl>
                      <select {...field} className="w-full rounded-md border px-3 py-2">
                        <option value="economy">Économique</option>
                        <option value="business">Business</option>
                        <option value="first">First</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="roundTrip" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aller-retour ?</FormLabel>
                    <FormControl>
                      <input type="checkbox" {...field} className="mr-2" />
                      <span>Oui</span>
                    </FormControl>
                    <FormMessage />
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
                    <FormControl>
                      <select {...field} className="w-full rounded-md border px-3 py-2">
                        <option value="inside">Inside</option>
                        <option value="oceanview">Ocean View</option>
                        <option value="balcony">Balcony</option>
                        <option value="suite">Suite</option>
                      </select>
                    </FormControl>
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
                    <Button type="button" variant="secondary">
                        Annuler
                    </Button>
                </DialogClose>
                <Button type="submit">
                    Envoyer ma demande <Send className="ml-2 h-4 w-4" />
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
