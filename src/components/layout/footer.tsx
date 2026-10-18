'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { CONTACT } from '@/lib/site';

import { usePathname } from 'next/navigation';
import { LanguageSwitcher } from './language-switcher';

const WHATSAPP_URL = CONTACT.whatsapp;

const navigationFr = [
  { href: '/', label: 'Accueil' },
  { href: '/guides', label: 'Guides & Conseils' },
  { href: '/about', label: 'À propos' },
  { href: '/contact', label: 'Contact' },
  { href: '/assistance-voyage', label: 'Assistance voyage' },
  { href: '/dakar-2026', label: 'Séjour Dakar 2026' },
  { href: '/confidentialite', label: 'Politique de confidentialité' },
];

const navigationEn = [
  { href: '/en', label: 'Home' },
  { href: '/en/guides', label: 'Travel Guides' },
  { href: '/en/about', label: 'About Us' },
  { href: '/en/contact', label: 'Contact Us' },
  { href: '/en/assistance-voyage', label: 'Visa Support' },
  { href: '/en/dakar-2026', label: 'Dakar 2026 Experience' },
  { href: '/confidentialite', label: 'Privacy Policy' },
];

const servicesFr = [
  { href: '/hebergement', label: 'Hébergement' },
  { href: '/transport', label: 'Transport & Billetterie' },
  { href: '/omra', label: 'Pèlerinage Omra' },
  { href: '/voyages-croisieres', label: 'Voyages & Croisières' },
  { href: '/excursions', label: 'Circuits et Excursions' },
  { href: '/tourisme-affaires', label: "Tourisme d'Affaires" },
];

const servicesEn = [
  { href: '/en/hebergement', label: 'Accommodations' },
  { href: '/en/transport', label: 'Transfers & Ticketing' },
  { href: '/omra', label: 'Umrah Pilgrimage' },
  { href: '/voyages-croisieres', label: 'Voyages & Cruises' },
  { href: '/en/excursions', label: 'Tours & Excursions' },
  { href: '/en/tourisme-affaires', label: 'Corporate & MICE' },
];

export default function Footer() {
    const pathname = usePathname() || '/';
    const isEn = pathname === '/en' || pathname.startsWith('/en/');
    const navigation = isEn ? navigationEn : navigationFr;
    const services = isEn ? servicesEn : servicesFr;

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
                body: JSON.stringify({ email, locale: isEn ? 'en' : 'fr' }),
            });
            const body = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(body?.error || (isEn ? 'Server error' : 'Erreur serveur'));

            toast({
                title: isEn
                  ? (body?.already ? 'Already subscribed!' : 'Thank you for subscribing!')
                  : (body?.already ? 'Déjà inscrit !' : 'Merci pour votre inscription !'),
                description: isEn
                  ? 'You will receive our latest travel offers and Senegal guides.'
                  : 'Vous recevrez bientôt nos meilleures offres.',
            });
            event.currentTarget.reset();
        } catch (err: unknown) {
            toast({
                title: isEn ? 'Subscription failed' : 'Inscription impossible',
                description: (err instanceof Error && err.message) || (isEn ? 'Please try again in a moment.' : 'Réessayez dans un instant.'),
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
            <p className="mt-2 text-sm text-primary-foreground/80 leading-relaxed">
              {isEn
                ? 'Your dedicated travel concierge in Senegal and worldwide. VIP AIBD airport transfers, verified serviced stays with power generator & fiber Wi-Fi, private excursions and visa support based in Dakar Plateau.'
                : 'Votre conciergerie de voyage au Sénégal et dans le monde. Transferts VIP AIBD, résidences vérifiées avec groupe électrogène & fibre, circuits d\'exception et assistance visas au cœur de Dakar Plateau.'}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                <Button variant="whatsapp" size="sm" className="font-medium">
                  <MessageCircle className="h-4 w-4 mr-1" /> {isEn ? 'WhatsApp 7/7' : 'WhatsApp 7j/7'}
                </Button>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-accent">{isEn ? 'Navigation' : 'Navigation'}</h3>
            <ul className="mt-2 space-y-1 text-sm">
              {navigation.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-block py-1.5 text-primary-foreground/80 hover:text-accent transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-accent">{isEn ? 'Our Services' : 'Nos Prestations'}</h3>
            <ul className="mt-2 space-y-1 text-sm">
              {services.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-block py-1.5 text-primary-foreground/80 hover:text-accent transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-accent">{isEn ? 'Dakar Office & Contact' : 'Agence Plateau & Contact'}</h3>
            <ul className="mt-2 space-y-2 text-sm text-primary-foreground/80">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                <a
                  href={CONTACT.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                  title={isEn ? "Open Google Maps directions to our Dakar branch" : "Ouvrir l'itinéraire Google Maps vers notre agence"}
                >
                  <span>Dakar Plateau, rue Mouhamed 5, Immeuble Djolof Chicken, 3<sup>e</sup> étage</span>
                  <span className="block text-[11px] text-accent/90 underline mt-0.5">
                    {isEn ? 'Open Maps directions →' : "Obtenir l'itinéraire Maps →"}
                  </span>
                </a>
              </li>
              <li>
                <a href={`tel:${CONTACT.phoneIntl}`} className="flex items-center gap-2 hover:text-accent transition-colors">
                  <Phone className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" /> {CONTACT.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-2 hover:text-accent transition-colors">
                  <Mail className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" /> {CONTACT.email}
                </a>
              </li>
            </ul>
            <form onSubmit={handleNewsletterSubmit} className="mt-4 flex gap-2">
              <Input
                type="email"
                name="email"
                aria-label={isEn ? "Your email for travel offers" : "Votre adresse email pour la newsletter"}
                placeholder={isEn ? "Your email" : "Votre email"}
                className="bg-background/10 border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/50 h-10"
                required
              />
              <Button type="submit" variant="gold" disabled={isSubmitting} className="h-10 px-4 font-semibold">
                {isSubmitting ? '…' : (isEn ? 'Subscribe' : 'S\'inscrire')}
              </Button>
            </form>
          </div>
        </div>
        <div className="mt-10 border-t border-primary-foreground/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-primary-foreground/60">
          <p>
            &copy; {new Date().getFullYear()} SLAAC Voyages. {isEn ? 'All rights reserved. Licensed travel agency in Dakar (Senegal).' : 'Tous droits réservés. Agence immatriculée à Dakar (Sénégal).'}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <LanguageSwitcher className="bg-primary/40 border-primary-foreground/30 text-primary-foreground" />
            <span className="inline-flex items-center gap-2 text-primary-foreground/75">
              <Link href="/" hrefLang="fr" lang="fr" className="hover:text-accent transition-colors">FR</Link>
              <span className="text-primary-foreground/30">/</span>
              <Link href="/en" hrefLang="en" lang="en" className="hover:text-accent transition-colors">EN</Link>
            </span>
            <span className="text-primary-foreground/30">•</span>
            <Link href="/confidentialite" className="hover:underline">{isEn ? 'Privacy' : 'Confidentialité'}</Link>
            <span className="text-primary-foreground/30">•</span>
            <Link href={isEn ? '/en/about' : '/about'} className="hover:underline">{isEn ? 'Legal Notice' : 'Mentions Légales'}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
