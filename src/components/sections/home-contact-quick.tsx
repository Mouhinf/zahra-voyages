'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Mail, Send, MessageCircle, Phone, Navigation } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { CONTACT } from '@/lib/site';

const FALLBACK_AGENCY = 'https://res.cloudinary.com/dvnq5qwbd/image/upload/f_auto,q_auto/hero-section-voyages.png';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg role="img" aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.204-1.634a11.86 11.86 0 005.79 1.499h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" fill="currentColor" />
  </svg>
);

import { contactSchema, type ContactInput } from '@/lib/schemas/contact-schema';

export default function HomeContactQuick() {
  const { toast } = useToast();
  const agenceImg = FALLBACK_AGENCY;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', phone: '', message: '', website: '' },
  });

  async function onSubmit(values: ContactInput) {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          website: '', // pot de miel anti-robots (doit rester vide)
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.error || 'Erreur serveur');

      toast({
        title: 'Message envoyé !',
        description: 'Merci de nous avoir contactés. Notre équipe commerciale traite votre message dans les meilleurs délais.',
      });
      form.reset();
    } catch (err: unknown) {
      console.error('Contact submit error:', err);
      toast({
        title: 'Envoi impossible',
        description: (err instanceof Error && err.message) || 'Votre message n\'a pas pu être enregistré. Réessayez ou écrivez-nous sur WhatsApp.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="contact-quick" className="py-16 sm:py-24 bg-white overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">Contact</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-primary font-headline">Parlons de Votre Projet</h2>
          <div className="w-16 h-0.5 bg-accent mx-auto my-5" />
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Une question, un devis, une envie d'évasion ? Écrivez-nous ou contactez-nous directement sur WhatsApp.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start w-full">
          <div className="space-y-6 w-full min-w-0">
            <div className="relative h-56 rounded-lg overflow-hidden shadow-md">
              <Image src={agenceImg} alt="SLAAC Voyages — Dakar" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <p className="font-semibold text-lg drop-shadow-lg">SLAAC Voyages</p>
                <p className="text-sm drop-shadow flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> Dakar, Sénégal
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 sm:gap-4 min-w-0">
              <div className="p-3 bg-primary/10 rounded-full shrink-0"><MapPin className="h-6 w-6 text-primary" /></div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-primary font-headline">Notre Bureau</h3>
                <p className="text-muted-foreground text-sm break-words leading-relaxed">{CONTACT.address.formatted}</p>
                <p className="text-xs text-muted-foreground/75 mt-0.5">Repère : 3e étage Immeuble Djolof Chicken, Rue Mohamed V, Dakar Plateau.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4 min-w-0">
              <div className="p-3 bg-primary/10 rounded-full shrink-0"><Phone className="h-6 w-6 text-primary" /></div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-primary font-headline">Téléphone</h3>
                <div className="space-y-0.5 text-sm">
                  <a href={`tel:${CONTACT.phoneIntl}`} className="text-muted-foreground hover:text-primary flex items-center gap-2 font-medium">
                    {CONTACT.phone} <span className="text-xs text-primary/80 font-normal">(Accueil)</span>
                  </a>
                  <a href={`tel:${CONTACT.phoneSecondaryIntl}`} className="text-muted-foreground hover:text-primary flex items-center gap-2">
                    {CONTACT.phoneSecondary} <span className="text-xs text-muted-foreground/70">(Commercial)</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4 min-w-0">
              <div className="p-3 bg-primary/10 rounded-full shrink-0"><WhatsAppIcon className="h-6 w-6 text-primary" /></div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-primary font-headline">WhatsApp Pro</h3>
                <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary flex items-center gap-2 text-sm" aria-label="Contacter SLAAC Voyages sur WhatsApp">
                  <WhatsAppIcon className="h-4 w-4 fill-current" /> {CONTACT.phone} (Réponse rapide)
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4 min-w-0">
              <div className="p-3 bg-slaac-navy-50 rounded-xl text-slaac-navy-900 border border-slate-200/80 shrink-0"><Mail className="h-5 w-5" /></div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold text-slate-900 font-headline">Email Officiel</h3>
                <p className="text-sm text-slate-600 break-all">{CONTACT.email}</p>
                <p className="text-xs text-slate-400 break-all">Direction : {CONTACT.emailInternal}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="https://wa.me/221773129090?text=Bonjour%20SLAAC%20Voyages%2C%20je%20souhaite%20des%20informations%20sur%20vos%20prestations."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
                aria-label="Discuter avec SLAAC Voyages sur WhatsApp"
              >
                <Button size="lg" variant="whatsapp" className="w-full sm:w-auto font-medium">
                  <MessageCircle className="mr-2 h-5 w-5 fill-current" /> Discuter sur WhatsApp
                </Button>
              </a>
              <Button asChild size="lg" variant="outline" className="border-primary/40 text-primary hover:bg-primary hover:text-white">
                <a href={CONTACT.directionsUrl} target="_blank" rel="noopener noreferrer">
                  <Navigation className="mr-2 h-4 w-4" /> Itinéraire Maps
                </a>
              </Button>
            </div>

            <div className="pt-2">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d913.4299840693265!2d-17.4343981!3d14.668668499999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xec173b82ee767bd%3A0x95a2e5d20c75be4a!2sDjolof%20Chicken%20Dakar-Plateau!5e1!3m2!1sfr!2ssn!4v1784546169277!5m2!1sfr!2ssn"
                title="Localisation SLAAC Voyages à Dakar Plateau"
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full max-w-full rounded-lg shadow-sm border border-slate-200"
              />
            </div>

            <div className="pt-1 flex items-center justify-between text-xs">
              <Link href="/contact" className="text-primary hover:underline font-semibold">
                Voir toutes les coordonnées et horaires d'accueil &rarr;
              </Link>
              <a href={CONTACT.directionsUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                Google Maps &rarr;
              </a>
            </div>
          </div>
          <Card className="w-full min-w-0">
            <CardHeader>
              <CardTitle>Envoyez-nous un message</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Votre email" {...field} />
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
                          <FormLabel>Téléphone (optionnel)</FormLabel>
                          <FormControl>
                            <Input placeholder="Votre numéro" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Votre message</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Bonjour, je souhaiterais obtenir des informations sur..." rows={4} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" variant="gold" className="w-full text-base font-semibold shadow-md" size="xl" disabled={isSubmitting}>
                    {isSubmitting ? 'Envoi en cours…' : <>Envoyer mon message <Send className="ml-2 h-4 w-4" /></>}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
