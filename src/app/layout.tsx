import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Inter, Playfair_Display } from 'next/font/google';
import ChatbotLoader from '@/components/chatbot-loader';
import AnalyticsBeacon from '@/components/analytics-beacon';
import { FloatingConciergeBar } from '@/components/layout/floating-concierge-bar';
import { ConsentBanner } from '@/components/tracking/consent-banner';
import type {ReactNode} from 'react';
import { SITE_URL, SITE_NAME, CONTACT } from '@/lib/site';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'SLAAC Voyages - Votre Passeport pour le Monde',
    template: '%s | SLAAC Voyages',
  },
  description: "Découvrez le monde avec SLAAC Voyages, votre agence de confiance à Dakar. Billets d'avion, séjours sur mesure, et assistance visa. L'aventure vous attend.",
  keywords: "agence de voyage Dakar, conciergerie voyage Sénégal, billets d’avion Sénégal, SLAAC Voyages Dakar, transfert aéroport AIBD, séjour Dakar 2026, voyage sur mesure, visas d'affaires Dakar",
  alternates: {
    canonical: '/',
    languages: {
      'fr-SN': '/',
      'fr': '/',
      'en-US': '/en',
      'en': '/en',
      'x-default': '/',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_SN',
    siteName: SITE_NAME,
    url: SITE_URL,
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon-96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  verification: {
    google: '6ElmrLDCGkGe-Qrf27HeUxzhemAtFSQh6oGKl4nBusM',
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || undefined,
    other: {
      ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
        ? { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
        : {}),
    },
  },
};

import { getTravelAgencySchema } from '@/lib/seo-schema';
import { headers } from 'next/headers';

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const headersList = await headers();
  const locale = headersList.get('x-slaac-locale') === 'en' ? 'en' : 'fr';
  const travelAgencyJsonLd = getTravelAgencySchema();

  return (
    <html lang={locale} className="scroll-smooth" data-scroll-behavior="smooth">
      <body className={`${inter.variable} ${playfair.variable} font-body antialiased`}>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(travelAgencyJsonLd) }}
        />
        <FloatingConciergeBar />
        <Toaster />
        <ChatbotLoader />
        <AnalyticsBeacon />
        <ConsentBanner />
      </body>
    </html>
  );
}
