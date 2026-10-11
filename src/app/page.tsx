import Header from '@/components/layout/header';
import Hero from '@/components/sections/hero';
import ServiceQuickSelect from '@/components/sections/service-quick-select';
import HomePartenaires from '@/components/sections/home-partenaires';
import HomeAbout from '@/components/sections/home-about';
import HomeServicesGrid from '@/components/sections/home-services-grid';
import HomeFeatured from '@/components/sections/home-featured';
import HomeDestinations from '@/components/sections/home-destinations';
import HomeWhyUs from '@/components/sections/home-why-us';
import HomeExcursions from '@/components/sections/home-excursions';
import HomeTourisme from '@/components/sections/home-tourisme';
import HomeTestimonials from '@/components/sections/home-testimonials';
import HomeStats from '@/components/sections/home-stats';
import FaqSection from '@/components/sections/faq-section';
import { homeFaqItems } from '@/data/home-faq';
import HomeContactQuick from '@/components/sections/home-contact-quick';
import Footer from '@/components/layout/footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        {/* 1. Hero immersif */}
        <Hero />
        {/* 2. Sélection simple des services */}
        <ServiceQuickSelect />
        <HomePartenaires />
        <HomeAbout />
        {/* 3. Principaux services */}
        <HomeServicesGrid />
        {/* 4. Offres mises en avant + destinations */}
        <HomeFeatured />
        <HomeDestinations />
        {/* 5. Pourquoi choisir SLAAC Voyages */}
        <HomeWhyUs />
        {/* 6. Circuits et excursions recommandés */}
        <HomeExcursions />
        {/* 7. Tourisme d'affaires */}
        <HomeTourisme />
        {/* 8. Témoignages */}
        <HomeTestimonials />
        <HomeStats />
        {/* 9. FAQ */}
        <FaqSection
          title="Questions fréquentes"
          subtitle="Tout ce qu'il faut savoir avant de préparer votre voyage avec nous."
          items={homeFaqItems}
        />
        {/* 10. Contact et demande de devis */}
        <HomeContactQuick />
      </main>
      <Footer />
    </div>
  );
}
