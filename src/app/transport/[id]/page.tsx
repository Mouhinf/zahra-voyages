import type { Metadata } from 'next';
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
      title: 'Transport & Navette AIBD | SLAAC Voyages',
      description: 'Chauffeurs privés, navettes aéroport AIBD et berlines VIP au Sénégal.',
    };
  }

  return {
    title: `${item.titre} | SLAAC Voyages`,
    description: item.description?.slice(0, 160) || 'Service de transport privé et navette au Sénégal par SLAAC Voyages.',
    alternates: {
      canonical: `/transport/${id}`,
    },
    openGraph: {
      title: `${item.titre} | SLAAC Voyages`,
      description: item.description,
      images: item.image ? [{ url: item.image }] : [],
    },
  };
}

export default async function TransportDetailPage({ params }: PageProps) {
  const { id } = await params;
  const item = await fetchTransportItem(id);

  return <TransportDetailClient item={item} id={id} />;
}
