import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchOffreAffairesItem } from '@/lib/detail-data';
import TourismeDetailClient from '@/components/tourisme-affaires/tourisme-detail-client';

export const revalidate = 300;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const item = await fetchOffreAffairesItem(id);

  if (!item) {
    return {
      title: 'Offre non trouvée | SLAAC Voyages',
      description: 'La prestation de tourisme d’affaires demandée est introuvable.',
      robots: { index: false, follow: false },
    };
  }

  const title = `${item.titre} | SLAAC Voyages Affaires`;
  const description = item.description?.slice(0, 160) || "Prestation de tourisme d'affaires et MICE au Sénégal par SLAAC Voyages.";

  return {
    title,
    description,
    alternates: {
      canonical: `/tourisme-affaires/${encodeURIComponent(id)}`,
    },
    openGraph: {
      title,
      description,
      images: item.image ? [{ url: item.image, width: 1200, height: 630, alt: item.titre }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function OffreAffairesDetailPage({ params }: PageProps) {
  const { id } = await params;
  const item = await fetchOffreAffairesItem(id);

  if (!item) {
    notFound();
  }

  return <TourismeDetailClient item={item} id={id} />;
}
