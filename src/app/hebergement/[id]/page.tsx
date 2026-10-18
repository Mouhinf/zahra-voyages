import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
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
      title: 'Hébergement non trouvé | SLAAC Voyages',
      description: 'L’hébergement demandé est introuvable ou n’est plus disponible.',
      robots: { index: false, follow: false },
    };
  }

  const title = `${item.titre} | SLAAC Voyages Dakar`;
  const description = item.description?.slice(0, 160) || 'Résidence de prestige au Sénégal sélectionnée par SLAAC Voyages.';

  return {
    title,
    description,
    alternates: {
      canonical: `/hebergement/${encodeURIComponent(id)}`,
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

export default async function HebergementDetailPage({ params }: PageProps) {
  const { id } = await params;
  const item = await fetchHebergementItem(id);

  if (!item) {
    notFound();
  }

  return <HebergementDetailClient item={item} id={id} />;
}
