'use client';

import { useState, useCallback, useEffect } from 'react';
import { useGallerySwipe } from '@/hooks/use-gallery-swipe';
import { useRouter } from 'next/navigation';
import type { VoyageCroisiere } from '@/types';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { QuoteRequestButton } from '@/components/layout/quote-request-button';
import { SimilarOffers } from '@/components/sections/similar-offers';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { ArrowLeft, MapPin, Clock, Calendar, ChevronLeft, ChevronRight, Check, X, MessageCircle } from 'lucide-react';

interface VoyageDetailClientProps {
  item: VoyageCroisiere | null;
  id: string;
}

export default function VoyageDetailClient({ item, id }: VoyageDetailClientProps) {
  const router = useRouter();
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const gallery = item?.images && item.images.length > 0 ? item.images : (item ? [item.image] : []);

  const nextImage = useCallback(() => {
    setCurrentImageIdx((prev) => (prev + 1) % Math.max(gallery.length, 1));
  }, [gallery.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIdx((prev) => (prev - 1 + Math.max(gallery.length, 1)) % Math.max(gallery.length, 1));
  }, [gallery.length]);

  const gallerySwipe = useGallerySwipe(gallery.length, nextImage, prevImage);

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowRight') nextImage();
      else if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [lightboxOpen, nextImage, prevImage, closeLightbox]);

  if (!item) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow flex items-center justify-center flex-col gap-4 py-16">
          <p className="text-xl text-muted-foreground">Voyage introuvable</p>
          <Button onClick={() => router.push('/voyages-croisieres')}>Retour aux voyages</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <section className="relative h-[50vh] min-h-[350px] bg-muted">
          <div
            className="relative w-full h-full cursor-pointer touch-pan-y select-none"
            onTouchStart={gallerySwipe.onTouchStart}
            onTouchEnd={gallerySwipe.onTouchEnd}
            onClick={() => setLightboxOpen(true)}
          >
            <Image src={gallery[currentImageIdx]} alt={item.titre} fill sizes="100vw" className="object-cover" priority />
            {gallery.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  aria-label="Photo précédente"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors z-10 cursor-pointer"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  aria-label="Photo suivante"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors z-10 cursor-pointer"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {gallery.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setCurrentImageIdx(idx); }}
                  aria-label={`Voir la photo ${idx + 1}`}
                  aria-current={idx === currentImageIdx}
                  className="p-2 -m-2 flex items-center justify-center"
                >
                  <span className={`block w-2.5 h-2.5 rounded-full transition-colors ${idx === currentImageIdx ? 'bg-white' : 'bg-white/50'}`} />
                </button>
              ))}
            </div>
          </div>
          <div className="absolute top-4 left-4 z-10">
            <Button variant="secondary" size="sm" onClick={() => router.push('/voyages-croisieres')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Retour
            </Button>
          </div>
          <Badge variant="default" className="absolute top-4 right-4 bg-accent text-accent-foreground z-10">{item.tag}</Badge>
        </section>

        <section className="py-12">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="mb-4">
                  <h1 className="text-3xl md:text-4xl font-bold text-primary font-headline">{item.titre}</h1>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {item.destination}</span>
                    <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {item.duree}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {item.dateDepart}</span>
                  </div>
                </div>

                <Badge variant="outline" className="mb-6">{item.type === 'croisiere' ? 'Croisière' : 'Voyage organisé'}</Badge>

                <div className="prose prose-lg max-w-none mb-8">
                  <p className="text-lg text-muted-foreground leading-relaxed">{item.description}</p>
                </div>

                {item.descriptionComplete && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-primary mb-3">À propos de ce voyage</h2>
                    <div className="text-muted-foreground leading-relaxed whitespace-pre-line">{item.descriptionComplete}</div>
                  </div>
                )}

                {item.inclus && item.inclus.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-primary mb-4">Prestations incluses</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {item.inclus.map((eq, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                            <Check className="h-3 w-3 text-green-600" />
                          </div>
                          <span className="text-sm">{eq}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {item.nonInclus && item.nonInclus.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-primary mb-4">Non inclus</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {item.nonInclus.map((eq, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                            <X className="h-3 w-3 text-red-500" />
                          </div>
                          <span className="text-sm text-muted-foreground">{eq}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {gallery.length > 1 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-primary mb-4">Galerie photos</h2>
                    <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory [scrollbar-width:thin]">
                      {gallery.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className={`relative h-24 min-w-[8.5rem] sm:min-w-0 sm:w-auto sm:flex-1 sm:h-32 rounded-lg overflow-hidden cursor-pointer snap-start border-2 transition-colors ${idx === currentImageIdx ? 'border-primary' : 'border-transparent'}`}
                          onClick={() => setCurrentImageIdx(idx)}
                          aria-label={`Afficher la photo ${idx + 1}`}
                          aria-pressed={idx === currentImageIdx}
                        >
                          <Image src={img} alt="" fill sizes="(max-width: 640px) 8.5rem, 33vw" className="object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-6 border rounded-xl p-6 shadow-lg bg-card">
                  <p className="text-3xl font-bold text-primary">{item.prix}</p>
                  <p className="text-sm text-muted-foreground mb-6">Tarif indicatif</p>

                  <div className="space-y-2 mb-6 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type</span>
                      <span className="font-medium">{item.type === 'croisiere' ? 'Croisière' : 'Voyage'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Destination</span>
                      <span className="font-medium">{item.destination}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Durée</span>
                      <span className="font-medium">{item.duree}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Départ</span>
                      <span className="font-medium">{item.dateDepart}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Disponibilité</span>
                      <span className={`font-medium ${item.disponible ? 'text-green-600' : 'text-red-500'}`}>
                        {item.disponible ? 'Disponible' : 'Sur demande'}
                      </span>
                    </div>
                  </div>

                  <QuoteRequestButton defaultService="voyages-croisieres" defaultDestination={item.titre} source="offre-voyage" variant={item.disponible ? 'gold' : 'default'} className="w-full" size="lg">
                    {item.disponible ? 'Demander un devis' : 'Sur demande — nous consulter'}
                  </QuoteRequestButton>
                  <a
                    href={`https://wa.me/221773129090?text=${encodeURIComponent(`Bonjour, je souhaite des informations sur le voyage ${item.titre}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-md border border-green-600 bg-green-600/10 px-4 text-sm font-medium text-green-700 transition-colors hover:bg-green-600 hover:text-white"
                  >
                    <MessageCircle className="h-4 w-4" /> Contacter sur WhatsApp
                  </a>
                  <p className="text-xs text-center text-muted-foreground mt-3">Réponse sous 24h · Devis gratuit et sans engagement</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {/* Offres similaires */}
      <SimilarOffers collectionName="voyagesCroisieres" basePath="/voyages-croisieres" excludeId={id} />

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label={`Photos de ${item.titre}`}
        >
          <button className="absolute top-4 right-4 text-white hover:text-white/70 transition-colors z-10 cursor-pointer" onClick={closeLightbox} aria-label="Fermer la visionneuse">
            <X className="h-8 w-8" />
          </button>
          {gallery.length > 1 && (
            <>
              <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-white/70 transition-colors p-2 z-10 cursor-pointer" onClick={(e) => { e.stopPropagation(); prevImage(); }} aria-label="Photo précédente">
                <ChevronLeft className="h-10 w-10" />
              </button>
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-white/70 transition-colors p-2 z-10 cursor-pointer" onClick={(e) => { e.stopPropagation(); nextImage(); }} aria-label="Photo suivante">
                <ChevronRight className="h-10 w-10" />
              </button>
            </>
          )}
          <div className="relative w-full h-full max-w-5xl max-h-[85vh] flex items-center justify-center touch-pan-y select-none" onTouchStart={gallerySwipe.onTouchStart} onTouchEnd={gallerySwipe.onTouchEnd} onClick={(e) => e.stopPropagation()}>
            <Image src={gallery[currentImageIdx]} alt={`${item.titre} - Photo ${currentImageIdx + 1}`} fill sizes="100vw" className="object-contain" />
          </div>
          {gallery.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10">
              <span className="text-white text-sm font-medium">{currentImageIdx + 1} / {gallery.length}</span>
              <div className="flex gap-2">
                {gallery.map((_, idx) => (
                  <button key={idx} type="button" className="p-2 -m-2 flex items-center justify-center cursor-pointer" onClick={(e) => { e.stopPropagation(); setCurrentImageIdx(idx); }} aria-label={`Voir la photo ${idx + 1}`} aria-current={idx === currentImageIdx}>
                    <span className={`block w-2.5 h-2.5 rounded-full transition-colors ${idx === currentImageIdx ? 'bg-white' : 'bg-white/40'}`} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
