import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchVoyageCroisiereItem } from '@/lib/detail-data';
import VoyageDetailClient from '@/components/voyages-croisieres/voyage-detail-client';

export const revalidate = 300;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const item = await fetchVoyageCroisiereItem(id);

  if (!item) {
    return {
      title: 'Voyage non trouvé | SLAAC Voyages',
      description: 'L’offre de voyage ou croisière demandée est introuvable.',
      robots: { index: false, follow: false },
    };
  }

  const title = `${item.titre} | SLAAC Voyages`;
  const description = item.description?.slice(0, 160) || 'Séjour organisé et croisière d’exception par SLAAC Voyages.';

  return {
    title,
    description,
    alternates: {
      canonical: `/voyages-croisieres/${encodeURIComponent(id)}`,
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

export default async function VoyageDetailPage({ params }: PageProps) {
  const { id } = await params;
  const item = await fetchVoyageCroisiereItem(id);

  if (!item) {
    notFound();
  }

  return <VoyageDetailClient item={item} id={id} />;
}
