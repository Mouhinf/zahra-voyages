import type { PageContent, PageSlug } from '@/types';

const HERO_HEBERGEMENT =
  'https://res.cloudinary.com/dvnq5qwbd/image/upload/f_auto,q_auto/v1784504517/hero-section-hebergement.jpg';
const HERO_TRANSPORT =
  'https://res.cloudinary.com/dvnq5qwbd/image/upload/f_auto,q_auto/v1784504518/hero-section-transport.jpg';
const HERO_EXCURSIONS =
  'https://res.cloudinary.com/dvnq5qwbd/image/upload/f_auto,q_auto/v1784504521/hero-section-excursions.jpg';
const HERO_AFFAIRES =
  'https://res.cloudinary.com/dvnq5qwbd/image/upload/f_auto,q_auto/v1784504523/hero-section-affaires.jpg';

export const defaultPageContents: Record<PageSlug, PageContent> = {
  hebergement: {
    id: 'hebergement',
    metaTitle: 'Hébergement - SLAAC Voyages',
    metaDescription:
      "Hôtels, résidences et appartements à Dakar, Saly, Casamance et à l'international. Trouvez l'hébergement idéal pour votre séjour avec SLAAC Voyages.",
    hero: {
      badge: 'Hôtels · Lodges · Campements',
      title: 'Hébergement',
      subtitle:
        "Hôtels de standing, lodges nature et campements authentiques au Sénégal et à l'international.",
      image: HERO_HEBERGEMENT,
    },
    gridSection: {
      badge: 'Notre sélection',
      title: 'Nos Hébergements',
      description:
        "Découvrez nos trois catégories d'hébergements soigneusement sélectionnés. Que vous cherchiez le confort d'un hôtel, l'immersion d'un lodge ou l'authenticité d'un campement, nous avons l'offre parfaite pour votre séjour.",
    },
    ctaSection: {
      title: "Besoin d'un hébergement sur mesure ?",
      description:
        "Notre équipe trouve l'hébergement parfait selon vos critères et votre budget. Et parce que chaque séjour mérite d'être sans souci, nous restons à votre disposition du check-in au check-out.",
    },
    faq: {
      title: 'FAQ — Hébergement',
      subtitle: "Tout ce qu'il faut savoir avant de réserver votre hébergement.",
      items: [
        {
          question: 'Le petit-déjeuner est-il inclus dans le tarif ?',
          reponse:
            "L'inclusion du petit-déjeuner dépend de l'hébergement et de la formule réservée. La plupart de nos hôtels partenaires proposent une formule avec petit-déjeuner buffet, clairement indiquée au moment de la réservation. Si vous souhaitez l'ajouter ou le retirer, il suffit de nous le signaler et nous ajustons votre devis en conséquence.",
        },
        {
          question: "Quelle est la politique d'annulation ?",
          reponse:
            "Les conditions d'annulation varient selon l'établissement et la période de séjour. En règle générale, une annulation plus de 7 jours avant l'arrivée est sans frais, tandis qu'une annulation à dernière minute peut engager la première nuit. Nous vous communiquons la politique exacte de chaque hébergement avant confirmation, afin que vous réserviez en toute transparence.",
        },
        {
          question: 'Pouvez-vous réserver pour un groupe ou une délégation ?',
          reponse:
            "Oui, c'est l'une de nos spécialités. Pour les groupes à partir de 10 personnes, nous négocions des tarifs préférentiels et des conditions sur mesure auprès de nos partenaires hôteliers. Que ce soit pour un séminaire, un pèlerinage, un voyage scolaire ou un événement familial, nous coordonnons les chambres, les repas et les transferts selon vos besoins.",
        },
        {
          question: 'Quels moyens de paiement acceptez-vous ?',
          reponse:
            "Nous acceptons le virement bancaire, les espèces et les paiements mobile money (Orange Money, Wave, Free Money) pour les réservations effectuées au Sénégal. Pour les clients à l'international, nous proposons également le paiement par carte bancaire via un lien sécurisé. Un acompte de 30% confirme généralement la réservation, le solde étant réglé avant le départ.",
        },
      ],
    },
  },
  transport: {
    id: 'transport',
    metaTitle: 'Transport - SLAAC Voyages',
    metaDescription:
      'Location de voiture, VTC, transferts aéroport et bus privé à Dakar et au Sénégal. Voyagez en toute liberté avec SLAAC Voyages.',
    hero: {
      badge: 'Billets · Transferts · Location',
      title: 'Transport',
      subtitle:
        "Billets d'avion, transferts aéroport, transferts par la plage et location de voiture avec chauffeur. Déplacez-vous en toute liberté.",
      image: HERO_TRANSPORT,
    },
    gridSection: {
      badge: 'Nos prestations',
      title: 'Nos Offres de Transport',
      description:
        "Trois solutions de transport adaptées à vos besoins : billets d'avion vers toutes destinations, transferts aéroport confortables et transferts par la plage pour vos escapades balnéaires.",
    },
    ctaSection: {
      title: 'Un besoin de transport spécifique ?',
      description: 'Contactez-nous pour une solution de transport sur mesure.',
    },
  },
  excursions: {
    id: 'excursions',
    metaTitle: 'Circuits et Excursions - SLAAC Voyages',
    metaDescription:
      'Circuits et excursions au Sénégal : Île de Gorée, Lac Rose, Casamance. Découvrez les trésors du Sénégal avec SLAAC Voyages.',
    hero: {
      badge: 'Circuits · Excursions',
      title: 'Circuits et Excursions',
      subtitle:
        'Découvrez nos circuits organisés et excursions guidées au cœur du Sénégal et au-delà.',
      image: HERO_EXCURSIONS,
    },
    gridSection: {
      badge: 'Au départ de Dakar',
      title: 'Nos Offres',
      description:
        'Choisissez entre nos excursions à la journée et nos circuits de plusieurs jours pour explorer les merveilles du Sénégal.',
    },
    ctaSection: {
      title: "Envie d'explorer ?",
      description: 'Réservez votre excursion ou circuit, ou demandez un programme sur mesure.',
    },
  },
  'tourisme-affaires': {
    id: 'tourisme-affaires',
    metaTitle: 'Tourisme - SLAAC Voyages',
    metaDescription:
      'Tourisme religieux, local, linguistique et d’affaires au Sénégal et à l’international avec SLAAC Voyages.',
    hero: {
      badge: 'Découvertes & expériences',
      title: 'Tourisme',
      subtitle:
        'Voyages spirituels, découvertes locales, séjours linguistiques et expériences professionnelles sur mesure.',
      image: HERO_AFFAIRES,
    },
    gridSection: {
      badge: 'Nos expériences',
      title: 'Nos offres de tourisme',
      description:
        'Explorez nos offres adaptées à vos envies : pèlerinages, découvertes du Sénégal, séjours d’apprentissage et organisation de vos déplacements professionnels.',
    },
    ctaSection: {
      title: 'Organisez votre séjour',
      description: 'Parlez-nous de votre projet, nous créons une expérience adaptée à vos attentes.',
    },
  },
};
