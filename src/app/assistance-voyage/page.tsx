import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { QuoteRequestButton } from '@/components/layout/quote-request-button';
import FaqSection from '@/components/sections/faq-section';
import { Send, FileText, ShieldCheck, GraduationCap, CalendarCheck, Globe, HelpCircle } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const HERO_IMG = 'https://res.cloudinary.com/dvnq5qwbd/image/upload/f_auto,q_auto/v1784504518/hero-section-transport.jpg';

export const metadata = {
  title: 'Assistance Voyage - SLAAC Voyages',
  description: "Assistance visas, assurance voyage, préinscriptions universitaires et prise de rendez-vous. SLAAC Voyages vous accompagne dans toutes vos démarches à Dakar.",
};

const assistanceServices = [
  {
    icon: <FileText className="h-8 w-8 text-primary" />,
    title: 'Assistance Voyage',
    description: "Notre équipe d'experts vous accompagne pas à pas dans l'obtention de vos visas pour toutes les destinations. Nous vous aidons à constituer votre dossier, vérifier les pièces requises et suivre votre demande auprès des ambassades et consulats.",
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: 'Assurance Voyage',
    description: "Partez l'esprit tranquille avec nos formules d'assurance voyage complètes : couverture santé, annulation, bagages, rapatriement. Une protection sur mesure pour chaque type de séjour.",
  },
  {
    icon: <GraduationCap className="h-8 w-8 text-primary" />,
    title: 'Préinscriptions Universitaires',
    description: "Vous souhaitez étudier à l'étranger ? Nous vous aidons dans vos démarches de préinscription dans les universités et grandes écoles, de la constitution du dossier jusqu'à l'obtention de votre lettre d'admission.",
  },
  {
    icon: <CalendarCheck className="h-8 w-8 text-primary" />,
    title: 'Prise de Rendez-vous',
    description: "Nous prenons en charge la réservation de vos rendez-vous dans les ambassades, consulats et centres de visa. Fini les longues files d'attente et les démarches complexes.",
  },
  {
    icon: <Globe className="h-8 w-8 text-primary" />,
    title: 'Formalités Administratives',
    description: "Accompagnement dans toutes vos démarches administratives liées au voyage : passeport, légalisation de documents, certificats internationaux et autres formalités.",
  },
  {
    icon: <HelpCircle className="h-8 w-8 text-primary" />,
    title: 'Conseil Personnalisé',
    description: "Bénéficiez de conseils d'experts pour choisir la meilleure destination selon votre profil, votre budget et vos objectifs. Nous vous guidons vers les solutions les plus adaptées.",
  },
];

const assistanceFaq = [
  {
    question: 'Quels types de visas pouvez-vous m\'aider à obtenir ?',
    reponse: "Nous vous accompagnons pour tous les types de visas : visas touristiques, visas d'affaires, visas étudiants, visas de transit et visas de long séjour. Nous travaillons avec les ambassades et consulats des principales destinations : France, Canada, États-Unis, Royaume-Uni, Chine, pays Schengen, etc.",
  },
  {
    question: 'Quels sont les délais pour une demande de visa ?',
    reponse: "Les délais varient selon le pays et la période. En moyenne, comptez 2 à 4 semaines pour un visa Schengen, 3 à 6 semaines pour un visa États-Unis, et 2 à 8 semaines pour les autres destinations. Nous vous recommandons de commencer vos démarches au moins 2 mois avant votre départ prévu.",
  },
  {
    question: 'Proposez-vous une assurance pour les visas ?',
    reponse: "Oui, l'assurance voyage est obligatoire pour l'obtention de nombreux visas, notamment pour l'espace Schengen. Nous proposons des contrats d'assurance conformes aux exigences des ambassades, avec une couverture médicale d'au moins 30 000 €, valable dans tous les pays de la zone concernée.",
  },
  {
    question: 'Comment se passe la préinscription universitaire ?',
    reponse: "Nous vous accompagnons dans le choix de l'établissement, la constitution du dossier (relevés de notes, diplômes, lettres de motivation, CV), la traduction des documents si nécessaire, et le suivi de votre candidature jusqu'à l'obtention de la lettre d'admission. Nous pouvons également vous aider pour les démarches de logement étudiant et de visa étudiant.",
  },
  {
    question: 'Quels sont vos tarifs pour l\'assistance visa ?',
    reponse: "Nos tarifs varient selon la complexité du dossier et le type de visa. Nous proposons une consultation gratuite pour évaluer votre situation et vous fournir un devis personnalisé. Contactez-nous pour en savoir plus.",
  },
];

export default function AssistanceVoyagePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <section className="relative h-[45vh] min-h-[340px] flex items-center justify-center text-white overflow-hidden">
          <Image src={HERO_IMG} alt="Assistance Voyage" fill className="object-cover" priority sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/85 via-primary/65 to-primary/85 z-10" />
          <div className="relative z-20 text-center px-4 max-w-3xl">
            <span className="inline-block glass-dark px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-4">
              Visas · Assurances · Formalités
            </span>
            <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg font-headline">Assistance Voyage</h1>
            <div className="w-16 h-0.5 bg-accent mx-auto my-5" />
            <p className="text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md text-balance">
              De l'obtention de votre visa à la souscription de votre assurance, nous vous accompagnons dans toutes vos démarches.
            </p>
          </div>
        </section>

        <section className="py-20 sm:py-28 bg-background">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="text-center mb-14">
              <span className="text-sm font-semibold uppercase tracking-widest text-primary">Nos services</span>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold text-primary font-headline">Services d'Assistance</h2>
              <div className="w-16 h-0.5 bg-accent mx-auto my-5" />
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-balance">
                Simplifiez vos démarches administratives et partez serein. Notre équipe d'experts vous accompagne à chaque étape de votre préparation de voyage.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {assistanceServices.map((service) => (
                <Card key={service.title} className="text-center flex flex-col items-center p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-background rounded-2xl border-border/50">
                  <div className="bg-primary/10 rounded-full p-4 mb-5">
                    {service.icon}
                  </div>
                  <CardHeader className="p-0">
                    <CardTitle className="text-xl font-semibold text-primary font-headline">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 mt-2 flex-grow">
                    <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                  </CardContent>
                  <div className="mt-5">
                    <QuoteRequestButton variant="link">Demander un devis</QuoteRequestButton>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-secondary">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-sm font-semibold uppercase tracking-widest text-primary">Accompagnement</span>
                <h2 className="mt-2 text-3xl md:text-4xl font-bold text-primary font-headline">Pourquoi nous confier vos démarches ?</h2>
                <div className="w-12 h-0.5 bg-accent my-5" />
                <p className="text-lg text-muted-foreground">
                  Forts de plusieurs années d'expérience dans l'accompagnement des voyageurs, nous connaissons parfaitement les procédures des ambassades et consulats. Nous vous faisons gagner un temps précieux et maximisons vos chances d'obtenir vos documents dans les délais.
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    'Suivi personnalisé de votre dossier',
                    'Constituion et vérification des pièces',
                    'Mise à jour en temps réel de l\'avancement',
                    'Taux de succès élevé pour les demandes de visa',
                    'Accompagnement jusqu\'à l\'obtention du document',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-accent flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative h-80 lg:h-full min-h-[300px] w-full rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=600&h=700&fit=crop"
                  alt="Documents de voyage et passeport"
                  fill
                  className="object-cover"
                  data-ai-hint="travel documents passport visa"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-background text-center">
          <div className="container mx-auto max-w-3xl px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-primary font-headline">Prêt à préparer votre voyage ?</h2>
            <div className="w-12 h-0.5 bg-accent mx-auto my-5" />
            <p className="text-muted-foreground text-lg text-balance">
              Contactez-nous dès maintenant pour un accompagnement personnalisé dans toutes vos démarches.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <QuoteRequestButton size="lg"><Send className="mr-2 h-4 w-4" /> Demander un devis</QuoteRequestButton>
              <a href="https://wa.me/221773129090" target="_blank" rel="noopener noreferrer">
                <QuoteRequestButton size="lg" variant="outline">Nous écrire sur WhatsApp</QuoteRequestButton>
              </a>
            </div>
          </div>
        </section>

        <FaqSection
          title="FAQ — Assistance Voyage"
          subtitle="Tout ce qu'il faut savoir sur nos services d'assistance."
          items={assistanceFaq}
        />
      </main>
      <Footer />
    </div>
  );
}