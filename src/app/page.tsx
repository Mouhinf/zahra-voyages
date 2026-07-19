import Header from '@/components/layout/header';
import Hero from '@/components/sections/hero';
import HomePartenaires from '@/components/sections/home-partenaires';
import HomeAbout from '@/components/sections/home-about';
import HomeServicesGrid from '@/components/sections/home-services-grid';
import HomeFeatured from '@/components/sections/home-featured';
import HomeWhyUs from '@/components/sections/home-why-us';
import HomeTestimonials from '@/components/sections/home-testimonials';
import HomeStats from '@/components/sections/home-stats';
import HomeContactQuick from '@/components/sections/home-contact-quick';
import Footer from '@/components/layout/footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <Hero />
        <HomePartenaires />
        <HomeAbout />
        <HomeServicesGrid />
        <HomeFeatured />
        <HomeWhyUs />
        <HomeTestimonials />
        <HomeStats />
        <HomeContactQuick />
      </main>
      <Footer />
    </div>
  );
}
