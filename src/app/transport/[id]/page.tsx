import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchTransportItem } from '@/lib/detail-data';
import TransportDetailClient from '@/components/transport/transport-detail-client';

export const revalidate = 300;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const item = await fetchTransportItem(id);

  if (!item) {
    return {
      title: 'Transport non trouvé | SLAAC Voyages',
      description: 'L’offre de transport ou transfert aéroport demandée est introuvable.',
      robots: { index: false, follow: false },
    };
  }

  const title = `${item.titre} | SLAAC Voyages Dakar`;
  const description = item.description?.slice(0, 160) || 'Service de transport privé et navette au Sénégal par SLAAC Voyages.';

  return {
    title,
    description,
    alternates: {
      canonical: `/transport/${encodeURIComponent(id)}`,
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

export default async function TransportDetailPage({ params }: PageProps) {
  const { id } = await params;
  const item = await fetchTransportItem(id);

  if (!item) {
    notFound();
  }

  return <TransportDetailClient item={item} id={id} />;
}
