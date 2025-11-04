import Header from '@/components/layout/header';
import Hero from '@/components/sections/hero';
import HomeAbout from '@/components/sections/home-about';
import HomeServices from '@/components/sections/home-services';
import HomeDestinations from '@/components/sections/home-destinations';
import Contact from '@/components/sections/contact';
import Footer from '@/components/layout/footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <Hero />
        <HomeAbout />
        <HomeServices />
        <HomeDestinations />
        {/* Removed Vehicle Brochure Section */}
        <Contact />
      </main>
      <Footer />
    </div>
  );
}