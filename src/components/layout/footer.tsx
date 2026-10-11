'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import { useState } from 'react';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.204-1.634a11.86 11.86 0 005.79 1.499h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" fill="currentColor"/>
    </svg>
);

const WHATSAPP_URL = 'https://wa.me/221773129090';

const navigation = [
  { href: '/', label: 'Accueil' },
  { href: '/about', label: 'À propos' },
  { href: '/contact', label: 'Contact' },
  { href: '/assistance-voyage', label: 'Assistance voyage' },
];

const services = [
  { href: '/hebergement', label: 'Hébergement' },
  { href: '/transport', label: 'Transport & Billetterie' },
  { href: '/voyages-croisieres', label: 'Voyages & Croisières' },
  { href: '/excursions', label: 'Circuits et Excursions' },
  { href: '/tourisme-affaires', label: "Tourisme d'Affaires" },
];

export default function Footer() {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleNewsletterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const email = event.currentTarget.email.value;
        if (!email) return;
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const body = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(body?.error || 'Erreur serveur');

            toast({
                title: body?.already ? 'Déjà inscrit !' : 'Merci pour votre inscription !',
                description: 'Vous recevrez bientôt nos meilleures offres.',
            });
            event.currentTarget.reset();
        } catch (err: unknown) {
            toast({
                title: 'Inscription impossible',
                description: (err instanceof Error && err.message) || 'Réessayez dans un instant.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h3 className="text-lg font-semibold text-accent">SLAAC Voyages</h3>
            <p className="mt-2 text-sm text-primary-foreground/80">
              Votre passeport pour des aventures inoubliables. Agence de voyage à Dakar : hébergement, transport, circuits et assistance.
            </p>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block">
              <Button variant="gold" size="sm">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </Button>
            </a>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-accent">Navigation</h3>
            <ul className="mt-2 space-y-1 text-sm">
              {navigation.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-block py-1.5 text-primary-foreground/80 hover:text-accent transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-accent">Nos services</h3>
            <ul className="mt-2 space-y-1 text-sm">
              {services.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-block py-1.5 text-primary-foreground/80 hover:text-accent transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-accent">Contact & Newsletter</h3>
            <ul className="mt-2 space-y-2 text-sm text-primary-foreground/80">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                <span>Dakar Plateau, rue Mouhamed 5, Immeuble Djolof Chicken, 3<sup>e</sup> étage</span>
              </li>
              <li>
                <a href="tel:+221773129090" className="flex items-center gap-2 hover:text-accent transition-colors">
                  <Phone className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" /> +221 77 312 90 90
                </a>
              </li>
              <li>
                <a href="mailto:mdslaacvoyages@gmail.com" className="flex items-center gap-2 hover:text-accent transition-colors">
                  <Mail className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" /> mdslaacvoyages@gmail.com
                </a>
              </li>
            </ul>
            <form onSubmit={handleNewsletterSubmit} className="mt-4 flex gap-2">
              <Input
                type="email"
                name="email"
                aria-label="Votre adresse email pour la newsletter"
                placeholder="Votre email"
                className="bg-background/10 border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/50"
                required
              />
              <Button type="submit" variant="gold" disabled={isSubmitting}>
                {isSubmitting ? '…' : 'S\'inscrire'}
              </Button>
            </form>
          </div>
        </div>
        <div className="mt-10 border-t border-primary-foreground/20 pt-6 text-center text-sm text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} SLAAC Voyages. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
