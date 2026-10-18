import type { Metadata } from 'next';
import { fetchExcursionItem } from '@/lib/detail-data';
import ExcursionDetailClient from '@/components/excursions/excursion-detail-client';

export const revalidate = 300;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const item = await fetchExcursionItem(id);

  if (!item) {
    return {
      title: 'Excursion | SLAAC Voyages Sénégal',
      description: 'Découvrez nos circuits et excursions d’exception au Sénégal.',
    };
  }

  return {
    title: `${item.titre} | SLAAC Voyages`,
    description: item.description?.slice(0, 160) || 'Circuit guidé au Sénégal sélectionné par SLAAC Voyages.',
    alternates: {
      canonical: `/excursions/${id}`,
    },
    openGraph: {
      title: `${item.titre} | SLAAC Voyages`,
      description: item.description,
      images: item.image ? [{ url: item.image }] : [],
    },
  };
}

export default async function ExcursionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const item = await fetchExcursionItem(id);

  return <ExcursionDetailClient item={item} id={id} />;
}
