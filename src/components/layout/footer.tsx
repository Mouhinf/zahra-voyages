'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Facebook, Instagram } from 'lucide-react';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.204-1.634a11.86 11.86 0 005.79 1.499h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" fill="currentColor"/>
    </svg>
);

export default function Footer() {
    const { toast } = useToast();

    const handleNewsletterSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const email = event.currentTarget.email.value;
        if (email) {
            toast({
                title: 'Merci pour votre inscription !',
                description: 'Vous recevrez bientôt nos meilleures offres.',
            });
            event.currentTarget.reset();
        }
    };

  return (
    <footer className="bg-secondary">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-secondary-foreground">
          <div>
            <h3 className="text-lg font-semibold text-primary">Zahra Voyages</h3>
            <p className="mt-2 text-sm">Votre passeport pour des aventures inoubliables.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary">Navigation</h3>
            <ul className="mt-2 space-y-1 text-sm">
              <li><Link href="/" className="hover:text-primary">Accueil</Link></li>
              <li><Link href="/services" className="hover:text-primary">Services</Link></li>
              <li><Link href="/destinations" className="hover:text-primary">Destinations</Link></li>
              <li><Link href="/ai-assistant" className="hover:text-primary">Assistant IA</Link></li> {/* Changed from /vehicles */}
              <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
              <li><Link href="/about" className="hover:text-primary">À propos</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary">Newsletter</h3>
            <p className="mt-2 text-sm">Restez informé de nos offres exclusives.</p>
            <form onSubmit={handleNewsletterSubmit} className="mt-4 flex gap-2">
              <Input
                type="email"
                name="email"
                placeholder="Votre email"
                className="bg-background border-border"
                required
              />
              <Button type="submit" variant="default">S'inscrire</Button>
            </form>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary">Suivez-nous</h3>
            <div className="flex gap-4 mt-4">
              <a href="#" className="hover:text-primary"><Facebook className="h-6 w-6" /></a>
              <a href="#" className="hover:text-primary"><Instagram className="h-6 w-6" /></a>
              <a href="https://wa.me/221775396325" target="_blank" rel="noopener noreferrer" className="hover:text-primary"><WhatsAppIcon className="h-6 w-6" /></a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Zahra Voyages. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}