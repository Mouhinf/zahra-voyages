'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Send } from 'lucide-react';
import { QuoteRequestDialog } from './quote-request-dialog';

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/hebergement', label: 'Hébergement' },
  { href: '/transport', label: 'Transport' },
  { href: '/voyages-croisieres', label: 'Voyages & Croisières' },
  { href: '/excursions', label: 'Excursions' },
  { href: '/tourisme-affaires', label: "Tourisme d'Affaires" },
  { href: '/contact', label: 'Contact' },
];

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.204-1.634a11.86 11.86 0 005.79 1.499h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" fill="currentColor"/>
    </svg>
);


export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo-slaac.png"
              alt="SLAAC Voyages"
              width={40}
              height={40}
              priority
              className="h-9 w-9 object-contain"
            />
            <span className="font-bold text-lg text-primary">SLAAC Voyages</span>
          </Link>

        <nav className="hidden md:flex gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
            <a href="https://wa.me/221775396325" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon" className="hidden sm:flex">
                    <WhatsAppIcon className="h-5 w-5 fill-current" />
                    <span className="sr-only">Contacter sur WhatsApp</span>
                </Button>
            </a>
            <QuoteRequestDialog>
              <Button className="hidden sm:flex" variant="default">
                  Demander un Devis
                  <Send className="ml-2 h-4 w-4" />
              </Button>
            </QuoteRequestDialog>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Ouvrir le menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="grid gap-6 p-6">
                <Link href="/" className="flex items-center gap-2">
                   <Image
                     src="/logo-slaac.png"
                     alt="SLAAC Voyages"
                     width={40}
                     height={40}
                     className="h-9 w-9 object-contain"
                   />
                  <span className="font-bold text-lg text-primary">SLAAC Voyages</span>
                </Link>
                <nav className="grid gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-lg font-medium"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <QuoteRequestDialog>
                  <Button className="w-full" variant="default">
                      Demander un Devis
                      <Send className="ml-2 h-4 w-4" />
                  </Button>
                </QuoteRequestDialog>
                <a href="https://wa.me/221775396325" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full">
                        <WhatsAppIcon className="mr-2 h-5 w-5 fill-current" /> Contacter sur WhatsApp
                    </Button>
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}