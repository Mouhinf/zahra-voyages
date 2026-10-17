'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetClose, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Menu,
  FilePenLine,
  Send,
  ChevronDown,
  Car,
  Hotel,
  MapPinned,
  Ship,
  Briefcase,
  FileCheck2,
  Phone,
  Flame,
} from 'lucide-react';
import { QuoteRequestButton } from './quote-request-button';
import AnnouncementBar from './announcement-bar';
import { cn } from '@/lib/utils';

const servicesList = [
  { href: '/transport', label: 'Transport & Navette AIBD', icon: Car, desc: 'Chauffeurs privés, transferts aéroport, berlines VIP' },
  { href: '/hebergement', label: 'Hébergements & Résidences', icon: Hotel, desc: 'Appartements meublés, groupe électrogène & fibre' },
  { href: '/excursions', label: 'Excursions & Découverte', icon: MapPinned, desc: 'Gorée, Lac Rose, Bandia, Sine Saloum' },
  { href: '/tourisme-affaires', label: "Tourisme d'Affaires & MICE", icon: Briefcase, desc: 'Séminaires, délégations, facturation entreprise' },
  { href: '/assistance-voyage', label: 'Assistance & Visas', icon: FileCheck2, desc: 'Visas Chine, Dubaï, Schengen, assurances' },
  { href: '/voyages-croisieres', label: 'Voyages & Croisières', icon: Ship, desc: 'Séjours organisés et croisières mondiales' },
  { href: '/destinations', label: 'Toutes les Destinations', icon: MapPinned, desc: 'Explorez nos catalogues au Sénégal et ailleurs' },
];

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg role="img" aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.204-1.634a11.86 11.86 0 005.79 1.499h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" fill="currentColor"/>
  </svg>
);

export default function Header() {
  const pathname = usePathname();
  const isEn = pathname?.startsWith('/en');

  const services = isEn ? [
    { href: '/transport', label: 'AIBD Airport Transfers & Shuttles', icon: Car, desc: 'Private drivers, AIBD meet & greet, VIP sedans' },
    { href: '/hebergement', label: 'Accommodations & Serviced Stays', icon: Hotel, desc: 'Furnished apartments, guaranteed fiber & generator' },
    { href: '/excursions', label: 'Private Tours & Discoveries', icon: MapPinned, desc: 'Gorée Island, Pink Lake, Bandia Safari' },
    { href: '/tourisme-affaires', label: 'Corporate Travel & MICE', icon: Briefcase, desc: 'Conferences, delegations, B2B invoicing' },
    { href: '/assistance-voyage', label: 'Visa Support & Insurance', icon: FileCheck2, desc: 'China, Dubai, Schengen visas and assistance' },
    { href: '/voyages-croisieres', label: 'Voyages & Cruises', icon: Ship, desc: 'Tailor-made itineraries and global cruises' },
    { href: '/destinations', label: 'All Destinations', icon: MapPinned, desc: 'Explore all catalogs in Senegal & abroad' },
  ] : servicesList;

  return (
    <>
      <AnnouncementBar />
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/85 transition-all">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between gap-1 sm:gap-4 px-2.5 sm:px-6">
          {/* Logo officiel de SLAAC Voyages */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md p-1 min-w-0">
            <Image
              src="/logo-slaac.png"
              alt="SLAAC Voyages"
              width={36}
              height={36}
              priority
              className="h-8 w-8 sm:h-9 sm:w-9 object-contain shrink-0 transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm sm:text-base md:text-lg leading-tight text-slaac-navy-900 tracking-tight truncate">
                SLAAC Voyages
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slaac-gold-600 font-semibold hidden md:inline">
                Conciergerie & DMC
              </span>
            </div>
          </Link>

          {/* Navigation Desktop aérée et hautement lisible */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-3" aria-label="Navigation principale">
            <Link
              href={isEn ? '/en' : '/'}
              className={cn(
                "text-sm font-medium transition-colors px-3 py-2 rounded-md hover:text-slaac-navy-900 hover:bg-slate-100/80",
                (isEn ? pathname === '/en' : pathname === '/') ? "text-slaac-gold-600 font-semibold" : "text-slate-600"
              )}
            >
              {isEn ? 'Home' : 'Accueil'}
            </Link>

            {/* Menu déroulant Prestations */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "inline-flex items-center gap-1 text-sm font-medium transition-colors px-3 py-2 rounded-md hover:text-slaac-navy-900 hover:bg-slate-100/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    pathname.startsWith('/transport') || pathname.startsWith('/hebergement') || pathname.startsWith('/excursions') || pathname.startsWith('/assistance')
                      ? "text-slaac-gold-600 font-semibold"
                      : "text-slate-600"
                  )}
                >
                  {isEn ? 'Our Services' : 'Nos Prestations'}
                  <ChevronDown className="h-4 w-4 opacity-70" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-72 p-2 bg-white shadow-xl border-slate-200 rounded-xl">
                {services.map((srv) => {
                  const Icon = srv.icon;
                  return (
                    <DropdownMenuItem key={srv.href} asChild className="p-2 cursor-pointer rounded-lg hover:bg-slate-50 focus:bg-slate-50">
                      <Link href={srv.href} className="flex items-start gap-3">
                        <div className="p-2 rounded-md bg-slaac-gold-50 text-slaac-gold-600 shrink-0 mt-0.5">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900">{srv.label}</div>
                          <div className="text-xs text-slate-500 line-clamp-1">{srv.desc}</div>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Lien direct JO Dakar 2026 avec badge */}
            <Link
              href="/dakar-2026"
              className={cn(
                "inline-flex items-center gap-1.5 text-sm font-medium transition-colors px-3 py-2 rounded-md hover:text-slaac-navy-900 hover:bg-slate-100/80",
                pathname.startsWith('/dakar-2026') ? "text-slaac-gold-600 font-semibold" : "text-slate-600"
              )}
            >
              <span>{isEn ? 'Dakar 2026 Games' : 'JO Dakar 2026'}</span>
              <Badge variant="gold" className="text-[10px] px-1.5 py-0 font-bold uppercase tracking-wider">
                JOJ
              </Badge>
            </Link>

            <Link
              href="/about"
              className={cn(
                "text-sm font-medium transition-colors px-3 py-2 rounded-md hover:text-slaac-navy-900 hover:bg-slate-100/80",
                pathname === '/about' ? "text-slaac-gold-600 font-semibold" : "text-slate-600"
              )}
            >
              {isEn ? 'About Us' : 'À propos'}
            </Link>

            <Link
              href="/contact"
              className={cn(
                "text-sm font-medium transition-colors px-3 py-2 rounded-md hover:text-slaac-navy-900 hover:bg-slate-100/80",
                pathname === '/contact' ? "text-slaac-gold-600 font-semibold" : "text-slate-600"
              )}
            >
              {isEn ? 'Contact' : 'Contact'}
            </Link>
          </nav>

          {/* Actions : WhatsApp direct + CTA Devis + Hamburger mobile */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Bouton WhatsApp avec icône verte et cible tactile 40px/44px */}
            <Button
              asChild
              variant="outline"
              size="icon"
              className="h-10 w-10 sm:h-11 sm:w-11 rounded-lg border-emerald-200/80 hover:border-emerald-500 hover:bg-emerald-50 text-emerald-600 transition-colors"
              title="WhatsApp — réponse rapide conciergerie"
            >
              <a
                href="https://wa.me/221773129090"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contacter SLAAC Voyages sur WhatsApp"
              >
                <WhatsAppIcon className="h-5 w-5 fill-current text-[#25D366]" />
              </a>
            </Button>

            {/* Bouton de Devis : icône dorée compacte satisfaisant les tests et l'ergonomie */}
            <QuoteRequestButton
              asChild
              variant="gold"
              size="icon"
              className="h-10 w-10 sm:h-11 sm:w-11 rounded-lg gold-glow"
              aria-label="Demander un devis"
              title="Demander un devis — réponse sous 24 h"
            >
              <button type="button" aria-label="Demander un devis">
                <FilePenLine className="h-5 w-5" />
              </button>
            </QuoteRequestButton>

            {/* Menu Hamburger Mobile / Tablette */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 sm:h-11 sm:w-11 rounded-lg lg:hidden border-slate-200 hover:bg-slate-100"
                  aria-label="Ouvrir le menu"
                >
                  <Menu className="h-5 w-5 text-slate-800" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[min(24rem,calc(100vw-1rem))] overflow-y-auto p-0 border-l border-slate-200 bg-white">
                <SheetHeader className="p-5 border-b border-slate-100 text-left">
                  <SheetTitle className="flex items-center gap-2.5">
                    <Image
                      src="/logo-slaac.png"
                      alt="SLAAC Voyages"
                      width={36}
                      height={36}
                      className="h-8 w-8 object-contain"
                    />
                    <div className="flex flex-col">
                      <span className="font-bold text-base text-slaac-navy-900 leading-tight">SLAAC Voyages</span>
                      <span className="text-[10px] uppercase tracking-wider text-slaac-gold-600 font-semibold">Conciergerie Dakar</span>
                    </div>
                  </SheetTitle>
                </SheetHeader>

                <div className="p-5 flex flex-col gap-6">
                  {/* Liens principaux */}
                  <nav className="flex flex-col gap-1" aria-label="Navigation mobile">
                    <SheetClose asChild>
                      <Link
                        href={isEn ? '/en' : '/'}
                        className={cn(
                          "flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-medium transition-colors",
                          (isEn ? pathname === '/en' : pathname === '/') ? "bg-slate-100 text-slaac-gold-600 font-semibold" : "text-slate-700 hover:bg-slate-50"
                        )}
                      >
                        {isEn ? 'Home' : 'Accueil'}
                      </Link>
                    </SheetClose>

                    <div className="my-2 border-t border-slate-100 pt-2">
                      <span className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        {isEn ? 'Services & Offers' : 'Prestations & Services'}
                      </span>
                      <div className="mt-1 flex flex-col gap-0.5">
                        {services.map((srv) => {
                          const Icon = srv.icon;
                          const isActive = pathname.startsWith(srv.href);
                          return (
                            <SheetClose asChild key={srv.href}>
                              <Link
                                href={srv.href}
                                className={cn(
                                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                                  isActive ? "bg-slaac-gold-50 text-slaac-gold-700 font-semibold" : "text-slate-600 hover:bg-slate-50"
                                )}
                              >
                                <Icon className="h-4 w-4 shrink-0 text-slaac-gold-600" />
                                <span>{srv.label}</span>
                              </Link>
                            </SheetClose>
                          );
                        })}
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-2 flex flex-col gap-0.5">
                      <SheetClose asChild>
                        <Link
                          href="/dakar-2026"
                          className={cn(
                            "flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-medium transition-colors",
                            pathname.startsWith('/dakar-2026') ? "bg-slate-100 text-slaac-gold-600 font-semibold" : "text-slate-700 hover:bg-slate-50"
                          )}
                        >
                          <span className="flex items-center gap-2">
                            <Flame className="h-4 w-4 text-slaac-gold-600" />
                            {isEn ? 'Dakar 2026 Games' : 'JO Dakar 2026'}
                          </span>
                          <Badge variant="gold" className="text-[10px]">JOJ</Badge>
                        </Link>
                      </SheetClose>

                      <SheetClose asChild>
                        <Link
                          href="/about"
                          className={cn(
                            "flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-medium transition-colors",
                            pathname === '/about' ? "bg-slate-100 text-slaac-gold-600 font-semibold" : "text-slate-700 hover:bg-slate-50"
                          )}
                        >
                          {isEn ? 'About Us' : 'À propos de nous'}
                        </Link>
                      </SheetClose>

                      <SheetClose asChild>
                        <Link
                          href="/contact"
                          className={cn(
                            "flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-medium transition-colors",
                            pathname === '/contact' ? "bg-slate-100 text-slaac-gold-600 font-semibold" : "text-slate-700 hover:bg-slate-50"
                          )}
                        >
                          {isEn ? 'Contact Us & Office' : 'Contact & Agence Plateau'}
                        </Link>
                      </SheetClose>
                    </div>
                  </nav>

                  {/* Boutons d'action mobile */}
                  <div className="flex flex-col gap-2.5 pt-4 border-t border-slate-100">
                    <QuoteRequestButton variant="gold" size="lg" className="w-full justify-center">
                      <Send className="mr-2 h-4 w-4" /> {isEn ? 'Request a quote' : 'Demander un devis'}
                    </QuoteRequestButton>

                    <a
                      href="https://wa.me/221773129090"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button variant="whatsapp" size="lg" className="w-full justify-center">
                        <WhatsAppIcon className="mr-2 h-5 w-5 fill-current" /> {isEn ? 'Chat on WhatsApp' : 'Discuter sur WhatsApp'}
                      </Button>
                    </a>

                    <a
                      href="tel:+221773129090"
                      className="inline-flex items-center justify-center gap-2 text-xs text-slate-500 hover:text-slate-800 py-1"
                    >
                      <Phone className="h-3.5 w-3.5 text-slaac-gold-600" />
                      Appel direct : +221 77 312 90 90
                    </a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}
