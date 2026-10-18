'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import { useState } from 'react';

const WHATSAPP_URL = 'https://wa.me/221773129090';

const navigation = [
  { href: '/', label: 'Accueil' },
  { href: '/guides', label: 'Guides & Conseils' },
  { href: '/about', label: 'À propos' },
  { href: '/contact', label: 'Contact' },
  { href: '/assistance-voyage', label: 'Assistance voyage' },
  { href: '/dakar-2026', label: 'Séjour Dakar 2026' },
  { href: '/confidentialite', label: 'Politique de confidentialité' },
];

const services = [
  { href: '/hebergement', label: 'Hébergement' },
  { href: '/transport', label: 'Transport & Billetterie' },
  { href: '/omra', label: 'Pèlerinage Omra' },
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
            <p className="mt-2 text-sm text-primary-foreground/80 leading-relaxed">
              Votre conciergerie de voyage au Sénégal et dans le monde. Transferts VIP AIBD, résidences vérifiées avec groupe électrogène & fibre, circuits d'exception et assistance visas au cœur de Dakar Plateau.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                <Button variant="whatsapp" size="sm" className="font-medium">
                  <MessageCircle className="h-4 w-4 mr-1" /> WhatsApp 7j/7
                </Button>
              </a>
            </div>
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
            <h3 className="text-lg font-semibold text-accent">Nos Prestations</h3>
            <ul className="mt-2 space-y-1 text-sm">
              {services.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-block py-1.5 text-primary-foreground/80 hover:text-accent transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-accent">Agence Plateau & Contact</h3>
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
                <a href="mailto:contact@slaacvoyages.com" className="flex items-center gap-2 hover:text-accent transition-colors">
                  <Mail className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" /> contact@slaacvoyages.com
                </a>
              </li>
            </ul>
            <form onSubmit={handleNewsletterSubmit} className="mt-4 flex gap-2">
              <Input
                type="email"
                name="email"
                aria-label="Votre adresse email pour la newsletter"
                placeholder="Votre email"
                className="bg-background/10 border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/50 h-10"
                required
              />
              <Button type="submit" variant="gold" disabled={isSubmitting} className="h-10 px-4 font-semibold">
                {isSubmitting ? '…' : 'S\'inscrire'}
              </Button>
            </form>
          </div>
        </div>
        <div className="mt-10 border-t border-primary-foreground/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} SLAAC Voyages. Tous droits réservés. Agence immatriculée à Dakar (Sénégal).</p>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/" hrefLang="fr" lang="fr" className="hover:text-accent transition-colors">Français</Link>
            <span className="text-primary-foreground/30">•</span>
            <Link href="/en" hrefLang="en" lang="en" className="hover:text-accent transition-colors">English</Link>
            <span className="text-primary-foreground/30">•</span>
            <Link href="/confidentialite" className="hover:underline">Confidentialité</Link>
            <span className="text-primary-foreground/30">•</span>
            <Link href="/about" className="hover:underline">Mentions Légales</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
