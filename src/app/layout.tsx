import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Inter, Playfair_Display } from 'next/font/google';
import ChatbotLoader from '@/components/chatbot-loader';
import AnalyticsBeacon from '@/components/analytics-beacon';
import { FloatingConciergeBar } from '@/components/layout/floating-concierge-bar';
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
  openGraph: {
    type: 'website',
    locale: 'fr_SN',
    siteName: SITE_NAME,
    url: SITE_URL,
  },
  icons: {
    icon: [
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

// Données structurées : agence de voyages (adresse, contacts vérifiés).
const travelAgencyJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TravelAgency',
  name: SITE_NAME,
  url: SITE_URL,
  telephone: CONTACT.phoneIntl,
  email: CONTACT.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: CONTACT.address.street,
    addressLocality: CONTACT.address.city,
    addressCountry: CONTACT.address.country,
  },
  areaServed: ['SN', 'FR', 'IT', 'ES', 'BE', 'GB', 'CA', 'US'],
  availableLanguage: ['fr'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth" data-scroll-behavior="smooth">
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
      </body>
    </html>
  );
}
