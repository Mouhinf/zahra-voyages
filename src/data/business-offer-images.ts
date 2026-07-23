const businessImages = {
  tourisme_affaires: 'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784830795/slaac-voyages/tourisme-affaires/meeting-room.jpg',
  seminaire: 'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784830796/slaac-voyages/tourisme-affaires/seminaire.jpg',
  incentive: 'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784830797/slaac-voyages/tourisme-affaires/incentive.jpg',
  mice: 'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784830798/slaac-voyages/tourisme-affaires/mice.jpg',
  mission_sur_mesure: 'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784830800/slaac-voyages/tourisme-affaires/mission.jpg',
} as const;

export const optimizeBusinessImage = (url: string) =>
  url.replace('/image/upload/', '/image/upload/f_auto,q_auto:best,c_limit,w_1600,e_auto_contrast,e_sharpen/');

export const getBusinessOfferImage = (type: string) =>
  optimizeBusinessImage(businessImages[type as keyof typeof businessImages] || businessImages.tourisme_affaires);

export const withBusinessOfferImage = <T extends { type: string; image?: string; images?: string[] }>(offer: T): T => {
  // Les offres historiques contiennent parfois des URLs expirées ou non autorisées.
  // On utilise systématiquement le visuel Cloudinary associé au type pour garantir son affichage.
  const image = getBusinessOfferImage(offer.type);
  return {
    ...offer,
    image,
    images: [image],
  };
};
