export type HebergementEnrichment = {
  image: string;
  images: string[];
  descriptionComplete: string;
};

export const hebergementEnrichments: Record<string, HebergementEnrichment> = {
  '3MfjAUGDd88nGb1j1DyR': {
    image: 'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784753240/slaac-voyages/hebergements/yr5ntb5dtilkglueehpk.webp',
    images: [
      'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784753240/slaac-voyages/hebergements/yr5ntb5dtilkglueehpk.webp',
      'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784753244/slaac-voyages/hebergements/ewvlutzipfxsk35jgkx3.jpg',
      'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784753247/slaac-voyages/hebergements/d5jd0aeqomed3noyrch6.webp',
      'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784753250/slaac-voyages/hebergements/e3xxfssnz2rjlqfihmdc.webp',
      'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784753252/slaac-voyages/hebergements/cpht4wrkbayumstk0puf.webp',
    ],
    descriptionComplete: 'La Résidence des Almadies offre une adresse calme et élégante au cœur de Dakar. Ses chambres lumineuses, son jardin tropical et sa piscine créent une atmosphère résidentielle idéale pour un séjour de loisirs comme pour un déplacement professionnel. À quelques minutes de la Pointe des Almadies et de l’océan, vous profitez d’un quartier vivant tout en retrouvant le calme d’une maison intimiste. Notre équipe peut également organiser vos transferts, excursions et repas selon votre programme.',
  },
  o8ZJhxudRiDB5qbIFvak: {
    image: 'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784753253/slaac-voyages/hebergements/lgfqc0qnmk7bfwolax7h.jpg',
    images: [
      'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784753253/slaac-voyages/hebergements/lgfqc0qnmk7bfwolax7h.jpg',
      'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784753255/slaac-voyages/hebergements/lmvnyn79iphlqekgjxdi.jpg',
      'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784753256/slaac-voyages/hebergements/wfhvwqpkgx7s3qcfjyxp.jpg',
      'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784753276/slaac-voyages/hebergements/gs0dfkjgwputlmwavhsb.jpg',
      'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784753282/slaac-voyages/hebergements/iog07fjjsvz4vn31miyh.jpg',
    ],
    descriptionComplete: 'Le Saly est une adresse balnéaire de la Petite-Côte, pensée pour les séjours où l’on alterne repos, activités et découverte du Sénégal. Les jardins bordés de palmiers, les espaces de détente et la proximité de l’océan offrent un cadre agréable pour les familles, les couples et les groupes. Depuis l’hôtel, nous pouvons organiser des sorties vers la réserve de Bandia, l’île de Gorée, le delta du Sine-Saloum ou encore des activités nautiques et culturelles à Saly.',
  },
};

export function getHebergementEnrichment(id: string) {
  return hebergementEnrichments[id];
}
