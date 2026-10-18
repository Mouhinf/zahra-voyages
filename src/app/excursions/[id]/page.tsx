import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
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
      title: 'Excursion non trouvée | SLAAC Voyages',
      description: 'Le circuit ou l’excursion demandé est introuvable.',
      robots: { index: false, follow: false },
    };
  }

  const title = `${item.titre} | SLAAC Voyages Sénégal`;
  const description = item.description?.slice(0, 160) || 'Circuit guidé au Sénégal sélectionné par SLAAC Voyages.';

  return {
    title,
    description,
    alternates: {
      canonical: `/excursions/${encodeURIComponent(id)}`,
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

export default async function ExcursionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const item = await fetchExcursionItem(id);

  if (!item) {
    notFound();
  }

  return <ExcursionDetailClient item={item} id={id} />;
}
