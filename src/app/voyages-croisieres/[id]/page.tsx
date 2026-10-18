import type { Metadata } from 'next';
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
      title: 'Voyages & Croisières | SLAAC Voyages',
      description: 'Séjours sur mesure, croisières et pèlerinages organisés par SLAAC Voyages.',
    };
  }

  return {
    title: `${item.titre} | SLAAC Voyages`,
    description: item.description?.slice(0, 160) || 'Séjour organisé et croisière d’exception par SLAAC Voyages.',
    alternates: {
      canonical: `/voyages-croisieres/${id}`,
    },
    openGraph: {
      title: `${item.titre} | SLAAC Voyages`,
      description: item.description,
      images: item.image ? [{ url: item.image }] : [],
    },
  };
}

export default async function VoyageDetailPage({ params }: PageProps) {
  const { id } = await params;
  const item = await fetchVoyageCroisiereItem(id);

  return <VoyageDetailClient item={item} id={id} />;
}
