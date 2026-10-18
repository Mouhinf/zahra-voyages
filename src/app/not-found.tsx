import Link from 'next/link';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Compass, Home, Car, Hotel, MapPinned, MessageCircle, Phone } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page non trouvée (404) | SLAAC Voyages Dakar',
  description: "La page que vous recherchez n'existe pas ou a été déplacée. Retrouvez nos offres de voyages, hébergements et transferts à Dakar.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />
      <main className="flex-grow flex items-center justify-center px-4 py-16 sm:py-24">
        <div className="max-w-2xl w-full text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slaac-gold-100 text-slaac-gold-600 mb-6 shadow-sm">
            <Compass className="w-10 h-10 animate-pulse" />
          </div>

          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-slaac-gold-600 mb-2">
            Erreur 404
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold font-headline text-slaac-navy-900 mb-4">
            Destination introuvable
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-lg mx-auto mb-8 leading-relaxed">
            La page que vous recherchez a peut-être été déplacée, supprimée ou l’adresse saisie comporte une erreur. Laissez notre conciergerie vous réorienter.
          </p>

          {/* Raccourcis de navigation directe */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 max-w-lg mx-auto text-left">
            <Link
              href="/"
              className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-slate-200 hover:border-slaac-gold-400 hover:shadow-md transition-all group"
            >
              <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-slaac-gold-50 text-slate-700 group-hover:text-slaac-gold-600 transition-colors">
                <Home className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900">Accueil</div>
                <div className="text-xs text-slate-500">Page principale</div>
              </div>
            </Link>

            <Link
              href="/transport"
              className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-slate-200 hover:border-slaac-gold-400 hover:shadow-md transition-all group"
            >
              <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-slaac-gold-50 text-slate-700 group-hover:text-slaac-gold-600 transition-colors">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900">Transports</div>
                <div className="text-xs text-slate-500">Navettes AIBD</div>
              </div>
            </Link>

            <Link
              href="/hebergement"
              className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-slate-200 hover:border-slaac-gold-400 hover:shadow-md transition-all group"
            >
              <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-slaac-gold-50 text-slate-700 group-hover:text-slaac-gold-600 transition-colors">
                <Hotel className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900">Hébergements</div>
                <div className="text-xs text-slate-500">Résidences & hôtels</div>
              </div>
            </Link>
          </div>

          {/* Assistance humaine immédiate */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild variant="gold" size="lg" className="w-full sm:w-auto font-medium shadow-sm">
              <Link href="/">
                Retourner à l’accueil
              </Link>
            </Button>
            <Button asChild variant="whatsapp" size="lg" className="w-full sm:w-auto font-medium shadow-sm">
              <a href="https://wa.me/221773129090" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4 mr-2" />
                Conseiller WhatsApp 7j/7
              </a>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
