export type HebergementEnrichment = {
  image: string;
  images: string[];
  descriptionComplete: string;
};

export const hebergementEnrichments: Record<string, HebergementEnrichment> = {
  '3MfjAUGDd88nGb1j1DyR': {
    image: 'https://www.laresidencedakar.com/images/hotel/garden-pool.webp',
    images: [
      'https://www.laresidencedakar.com/images/hotel/garden-pool.webp',
      'https://www.laresidencedakar.com/images/hotel/hero-suite-deluxe.jpg',
      'https://www.laresidencedakar.com/images/hotel/courtyard.webp',
      'https://www.laresidencedakar.com/images/hotel/standard-room-1.webp',
      'https://www.laresidencedakar.com/images/hotel/breakfast.webp',
    ],
    descriptionComplete: 'La Résidence des Almadies offre une adresse calme et élégante au cœur de Dakar. Ses chambres lumineuses, son jardin tropical et sa piscine créent une atmosphère résidentielle idéale pour un séjour de loisirs comme pour un déplacement professionnel. À quelques minutes de la Pointe des Almadies et de l’océan, vous profitez d’un quartier vivant tout en retrouvant le calme d’une maison intimiste. Notre équipe peut également organiser vos transferts, excursions et repas selon votre programme.',
  },
  o8ZJhxudRiDB5qbIFvak: {
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=85',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=85',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1600&q=85',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1600&q=85',
      'https://upload.wikimedia.org/wikipedia/commons/4/46/Beach_impression_Saly.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/1/18/Nature_mer_climat_a_saly_au_senegal.jpg',
    ],
    descriptionComplete: 'Le Saly est une adresse balnéaire de la Petite-Côte, pensée pour les séjours où l’on alterne repos, activités et découverte du Sénégal. Les jardins bordés de palmiers, les espaces de détente et la proximité de l’océan offrent un cadre agréable pour les familles, les couples et les groupes. Depuis l’hôtel, nous pouvons organiser des sorties vers la réserve de Bandia, l’île de Gorée, le delta du Sine-Saloum ou encore des activités nautiques et culturelles à Saly.',
  },
};

export function getHebergementEnrichment(id: string) {
  return hebergementEnrichments[id];
}
