import type { Metadata } from 'next';
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
      title: "Tourisme d'Affaires & MICE | SLAAC Voyages",
      description: 'Séminaires d’entreprises, délégations officielles et événements corporate au Sénégal.',
    };
  }

  return {
    title: `${item.titre} | SLAAC Voyages`,
    description: item.description?.slice(0, 160) || "Prestation de tourisme d'affaires et MICE au Sénégal par SLAAC Voyages.",
    alternates: {
      canonical: `/tourisme-affaires/${id}`,
    },
    openGraph: {
      title: `${item.titre} | SLAAC Voyages`,
      description: item.description,
      images: item.image ? [{ url: item.image }] : [],
    },
  };
}

export default async function OffreAffairesDetailPage({ params }: PageProps) {
  const { id } = await params;
  const item = await fetchOffreAffairesItem(id);

  return <TourismeDetailClient item={item} id={id} />;
}
