import type { Metadata } from 'next';
import { fetchHebergementItem } from '@/lib/detail-data';
import HebergementDetailClient from '@/components/hebergement/hebergement-detail-client';

export const revalidate = 300;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const item = await fetchHebergementItem(id);

  if (!item) {
    return {
      title: 'Hébergement | SLAAC Voyages Dakar',
      description: 'Découvrez nos résidences meublées et hébergements haut de gamme au Sénégal.',
    };
  }

  return {
    title: `${item.titre} | SLAAC Voyages`,
    description: item.description?.slice(0, 160) || 'Résidence de prestige au Sénégal sélectionnée par SLAAC Voyages.',
    alternates: {
      canonical: `/hebergement/${id}`,
    },
    openGraph: {
      title: `${item.titre} | SLAAC Voyages`,
      description: item.description,
      images: item.image ? [{ url: item.image }] : [],
    },
  };
}

export default async function HebergementDetailPage({ params }: PageProps) {
  const { id } = await params;
  const item = await fetchHebergementItem(id);

  return <HebergementDetailClient item={item} id={id} />;
}
