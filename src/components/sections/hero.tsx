import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { Download } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative w-full h-[80vh] min-h-[500px] flex items-center justify-center text-white">
      <Image
        src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1920&h=1080&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Paysage de voyage idyllique"
        fill
        className="object-cover z-0"
        data-ai-hint="travel landscape"
        priority
      />
      <div className="absolute inset-0 bg-black/60 z-10" />
      <div className="relative z-20 text-center p-4">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight drop-shadow-md font-headline">
          Votre Passeport pour le Monde
        </h1>
        <p className="mt-4 text-xl md:text-2xl max-w-3xl mx-auto drop-shadow-md">
          Découvrez des destinations incroyables et vivez des expériences uniques avec SLAAC Voyages.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/destinations">
            <Button size="lg" variant="default" className="w-full sm:w-auto">
              Explorer les Destinations
            </Button>
          </Link>
           <a href="/brochure-slaac-voyages.pdf" download>
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                <Download className="mr-2 h-5 w-5" />
                Notre Brochure
              </Button>
            </a>
        </div>
      </div>
    </section>
  );
}
