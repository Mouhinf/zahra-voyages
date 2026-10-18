export interface GuidePracticalItem {
  question: string;
  answer: string;
}

export interface GuideOfficialSource {
  title: string;
  url?: string;
  verifiedDate: string;
  note: string;
}

export interface GuideArticle {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  category: 'Arrivée & Séjour' | 'Destinations Sénégal' | 'Mobilité Internationale' | 'Pèlerinage' | 'Affaires & Entreprise';
  readTime: string;
  publishedAt: string;
  updatedAt: string;
  verifiedAt: string;
  author: {
    name: string;
    role: string;
    agency: string;
  };
  heroImage: string;
  excerpt: string;
  sections: Array<{
    heading: string;
    content: string;
    subsections?: Array<{
      subheading: string;
      body: string;
    }>;
  }>;
  practicalFaq: GuidePracticalItem[];
  officialSources: GuideOfficialSource[];
  relatedService: {
    label: string;
    serviceSlug: 'transport' | 'hebergement' | 'excursions' | 'tourisme-affaires' | 'assistance-visa' | 'omra';
    destination?: string;
    href: string;
    ctaText: string;
  };
}

export const guidesData: GuideArticle[] = [
  {
    slug: 'arrivee-aeroport-aibd-dakar-transfert',
    title: "Guide pratique d'arrivée à l'aéroport AIBD : transferts, taxis et conseils pour rejoindre Dakar et Saly",
    metaTitle: "Arrivée Aéroport AIBD Dakar : Navettes, Taxis & Tarifs | SLAAC Voyages",
    metaDescription: "Comment rejoindre Dakar ou Saly depuis l'aéroport Blaise-Diagne (AIBD) ? Tarifs des transferts privés, durée de trajet, péage et conseils pratiques d'accueil.",
    category: 'Arrivée & Séjour',
    readTime: '6 min de lecture',
    publishedAt: '2026-09-15T08:00:00.000Z',
    updatedAt: '2026-10-18T00:00:00.000Z',
    verifiedAt: '2026-10-18',
    author: {
      name: 'Équipe Logistique & Conciergerie',
      role: 'Responsables des Opérations Terrestres',
      agency: 'SLAAC Voyages Dakar',
    },
    heroImage: 'https://res.cloudinary.com/dvnq5qwbd/image/upload/f_auto,q_auto/v1784504518/hero-section-transport.jpg',
    excerpt: "L'aéroport international Blaise-Diagne (AIBD) est situé à Diass, à environ 50 km de Dakar Plateau et 35 km de Saly Portudal. Retrouvez tous les repères pour organiser votre transfert sans stress dès votre sortie du terminal.",
    sections: [
      {
        heading: "Situation géographique de l'aéroport Blaise-Diagne (AIBD)",
        content: "Inauguré pour désengorger la presqu'île dakaroise, l'AIBD (code IATA : DSS) est implanté dans la région de Thiès, à Diass. Ce positionnement stratégique permet de rallier aussi bien la capitale que la station balnéaire de Saly ou la ville nouvelle de Diamniadio, à condition d'emprunter l'autoroute à péage (Autoroute de l'Avenir).",
      },
      {
        heading: "Temps de trajet réels vers Dakar et la Petite-Côte",
        content: "Les temps de déplacement varient considérablement selon l'heure d'atterrissage de votre vol et la densité du trafic aux échangeurs dakarois :",
        subsections: [
          {
            subheading: "AIBD vers Dakar (Plateau, Almadies, Fann)",
            body: "Comptez 45 à 55 minutes en heures creuses (la nuit ou en milieu de journée) via l'autoroute à péage et la Voie de Dégagement Nord (VDN). En heure de pointe matinale (07h30-09h30) ou en fin d'après-midi (17h00-19h30), le trajet peut atteindre 1h20 à 1h45.",
          },
          {
            subheading: "AIBD vers Saly Portudal / Somone / Mbour",
            body: "Le trajet est généralement plus fluide et rapide : prévoyez 35 à 45 minutes pour rejoindre les hôtels et villas de la Petite-Côte via le prolongement autoroutier vers Mbour.",
          },
        ],
      },
      {
        heading: "Pourquoi réserver un chauffeur privé à l'avance ?",
        content: "À la sortie de la zone de livraison des bagages, les sollicitations informelles peuvent être nombreuses et les tarifs fluctuent arbitrairement. La réservation d'une navette privée auprès d'une agence immatriculée comme SLAAC Voyages garantit :",
        subsections: [
          {
            subheading: "Accueil nominatif dans le hall des arrivées",
            body: "Votre chauffeur vous attend dès la sortie sous douane avec une pancarte à votre nom ou au nom de votre entreprise.",
          },
          {
            subheading: "Suivi des vols en temps réel",
            body: "En cas d'avance ou de retard de votre vol (Air France, Corsair, Brussels Airlines, Turkish Airlines, etc.), l'horaire de prise en charge est réajusté sans pénalité.",
          },
          {
            subheading: "Tarif forfaitaire fixe tout inclus",
            body: "Aucune surprise : les frais d'autoroute à péage, le carburant et la prise en charge des bagages sont intégralement inclus dans le forfait annoncé (30 000 à 35 000 FCFA selon le quartier de destination à Dakar).",
          },
        ],
      },
    ],
    practicalFaq: [
      {
        question: "Où se trouve le point de rencontre avec le chauffeur à l'AIBD ?",
        answer: "Le chauffeur se positionne directement à la sortie de la zone sécurisée de retrait des bagages (hall public des arrivées), muni d'un panneau d'accueil bien visible.",
      },
      {
        question: "Que se passe-t-il si mon vol a plusieurs heures de retard ?",
        answer: "Notre équipe suit en direct le statut de votre vol via le système radar de l'aéroport. Votre véhicule sera présent à votre atterrissage effectif sans aucun supplément.",
      },
      {
        question: "Puis-je demander un siège bébé ou un van pour une délégation ?",
        answer: "Oui, sur simple indication lors de la demande de devis, nous équipons les berlines de sièges enfants homologués ou mettons à disposition un van VIP (jusqu'à 7 places) ou un minibus.",
      },
    ],
    officialSources: [
      {
        title: "Gestionnaire aéroportuaire AIBD (LAS Sénégal)",
        verifiedDate: '2026-10-18',
        note: "Infrastructures terminales et consignes aux passagers arrivants.",
      },
      {
        title: "Société de gestion de l'Autoroute de l'Avenir (SECAA)",
        verifiedDate: '2026-10-18',
        note: "Tarification et conditions de circulation du péage Diass - Dakar.",
      },
    ],
    relatedService: {
      label: 'Navette & Chauffeur AIBD',
      serviceSlug: 'transport',
      destination: 'Aéroport AIBD Diass',
      href: '/transport',
      ctaText: 'Réserver mon transfert AIBD privé',
    },
  },
  {
    slug: 'visiter-ile-de-goree-conseils-chaloupe',
    title: "Visiter l'île de Gorée depuis Dakar : horaires de la chaloupe, tarifs et conseils pour une journée inoubliable",
    metaTitle: "Visiter l'Île de Gorée depuis Dakar : Chaloupe, Tarifs & Guide | SLAAC Voyages",
    metaDescription: "Préparez votre excursion à l'île de Gorée au départ de Dakar : horaires des chaloupes, droits d'embarquement, Maison des Esclaves et accompagnement guidé.",
    category: 'Destinations Sénégal',
    readTime: '7 min de lecture',
    publishedAt: '2026-09-20T10:00:00.000Z',
    updatedAt: '2026-10-18T00:00:00.000Z',
    verifiedAt: '2026-10-18',
    author: {
      name: 'Guide Référent Patrimoine',
      role: 'Conseiller Excursions & Mémoire',
      agency: 'SLAAC Voyages Dakar',
    },
    heroImage: 'https://res.cloudinary.com/dvnq5qwbd/image/upload/f_auto,q_auto/v1784504521/hero-section-excursions.jpg',
    excerpt: "Classée au patrimoine mondial de l'UNESCO, l'île de Gorée est une étape incontournable de tout séjour à Dakar. Située à 3 km au large de la presqu'île, elle se rejoint en 20 minutes de traversée maritime depuis l'embarcadère central.",
    sections: [
      {
        heading: "L'accès à l'embarcadère de Dakar (Gare maritime)",
        content: "L'embarcadère de la chaloupe de Gorée est situé au centre-ville de Dakar, à proximité du Port Autonome et de la gare ferroviaire rénovée (TER). Pour une visite sereine, prévoyez d'arriver à la gare maritime au moins 30 à 45 minutes avant l'horaire de départ de la chaloupe afin de passer les contrôles de sécurité et acheter vos titres de transport.",
      },
      {
        heading: "Rythme des traversées et tarifs de la chaloupe",
        content: "Les rotations de la chaloupe sont régulières tout au long de la journée, généralement cadencées toutes les 1h30 à 2 heures du matin au soir. Les tarifs officiels de la traversée aller-retour sont réglementés par le Port de Dakar :",
        subsections: [
          {
            subheading: "Tarifs officiels de passage",
            body: "Les tickets coûtent environ 5 200 FCFA pour les adultes non-résidents (tarif international), avec un tarif préférentiel pour les résidents et ressortissants de la CEDEAO (sur présentation de justificatif d'identité).",
          },
          {
            subheading: "Taxe communale d'entrée sur l'île",
            body: "À votre débarquement sur l'île, une taxe municipale d'entrée de 1 000 FCFA par personne (pour les visiteurs non-résidents) est perçue pour contribuer à la préservation du patrimoine de l'île.",
          },
        ],
      },
      {
        heading: "Les lieux emblématiques à découvrir avec un guide certifié",
        content: "Bien que l'île soit paisible et sans voiture, faire appel à un guide certifié par le Ministère du Tourisme transforme l'expérience en un voyage mémoriel poignant :",
        subsections: [
          {
            subheading: "La Maison des Esclaves et la Porte du Voyage Sans Retour",
            body: "Demeure historique restaurée où étaient retenus les captifs avant leur déportation transatlantique. La visite commentée est empreinte d'une profonde gravité historique.",
          },
          {
            subheading: "Le Musée Historique et le Castel",
            body: "Perché sur les hauteurs sud de l'île, le Castel offre un panorama à 360° sur la baie de Dakar, les falaises basaltiques et d'anciens blockhaus de la Seconde Guerre mondiale.",
          },
          {
            subheading: "Les ruelles aux façades ocres et bougainvilliers",
            body: "Flânerie architecturale le long des maisons coloniales préservées, ateliers d'artistes peintres, sculpteurs sur sable et restaurants de poissons grillés en bord de plage.",
          },
        ],
      },
    ],
    practicalFaq: [
      {
        question: "Quelle est la meilleure période de la journée pour visiter Gorée ?",
        answer: "Le matin en première rotation (départ vers 10h00) est idéal pour visiter la Maison des Esclaves dans le calme avant l'arrivée des groupes scolaires ou des grandes délégations.",
      },
      {
        question: "Peut-on se restaurer sur l'île de Gorée ?",
        answer: "Oui, de nombreux restaurants ombragés près de la plage et sur les quais proposent des spécialités locales (Thieboudienne, Yassa au poisson frais, crevettes et lotte grillée).",
      },
      {
        question: "SLAAC Voyages organise-t-il la prise en charge depuis mon hôtel ?",
        answer: "Absolument. Notre forfait excursion Gorée inclut le véhicule climatisé avec chauffeur depuis votre hébergement jusqu'à la gare maritime, les billets de chaloupe, le guide officiel privatif et le retour à votre hôtel.",
      },
    ],
    officialSources: [
      {
        title: "Centre du patrimoine mondial de l'UNESCO",
        verifiedDate: '2026-10-18',
        note: "Fiche d'inscription officielle de l'Île de Gorée (référence 26).",
      },
      {
        title: "Port Autonome de Dakar — Service de la Liaison Maritime Dakar-Gorée",
        verifiedDate: '2026-10-18',
        note: "Grille officielle des départs et consignes de traversée.",
      },
    ],
    relatedService: {
      label: 'Excursion Île de Gorée',
      serviceSlug: 'excursions',
      destination: 'Île de Gorée, Dakar',
      href: '/excursions',
      ctaText: 'Organiser mon excursion guidée à Gorée',
    },
  },
  {
    slug: 'ou-loger-a-dakar-quartiers-residences',
    title: "Où loger à Dakar : Comparatif des quartiers et critères indispensables (groupe électrogène & fibre)",
    metaTitle: "Où Loger à Dakar : Meilleurs Quartiers & Résidences | SLAAC Voyages",
    metaDescription: "Plateau, Almadies, Ngor, Mermoz ou Fann ? Découvrez les meilleurs quartiers où loger à Dakar selon votre séjour et nos critères de sécurité (groupe & fibre).",
    category: 'Arrivée & Séjour',
    readTime: '8 min de lecture',
    publishedAt: '2026-09-25T14:00:00.000Z',
    updatedAt: '2026-10-18T00:00:00.000Z',
    verifiedAt: '2026-10-18',
    author: {
      name: 'Pôle Hébergements & Résidences',
      role: 'Auditeur Qualité Logements',
      agency: 'SLAAC Voyages Dakar',
    },
    heroImage: 'https://res.cloudinary.com/dvnq5qwbd/image/upload/f_auto,q_auto/v1784504517/hero-section-hebergement.jpg',
    excerpt: "Choisir son hébergement à Dakar dépend étroitement de l'objet de votre séjour (affaires, tourisme, séjour prolongé) et des infrastructures techniques indispensables pour éviter les imprévus.",
    sections: [
      {
        heading: "Les trois quartiers phares pour séjourner à Dakar",
        content: "Dakar est une presqu'île étirée où les distances peuvent vite devenir contraignantes aux heures de pointe. Voici notre guide comparatif des zones les plus adaptées aux voyageurs exigeants :",
        subsections: [
          {
            subheading: "Dakar Plateau : Le cœur institutionnel et des affaires",
            body: "Idéal pour les missions professionnelles, rendez-vous d'affaires, réunions avec les ministères, ambassades et sièges bancaires. Ambiance urbaine et historique, proximité immédiate de la place de l'Indépendance, du Port et de l'embarcadère de Gorée.",
          },
          {
            subheading: "Les Almadies & Ngor : Le quartier diplomatique et balnéaire",
            body: "Situé à la pointe la plus occidentale du continent africain, ce secteur réunit de nombreuses représentations diplomatiques, des résidences de grand standing, des restaurants branchés en bord d'océan et une vie nocturne feutrée.",
          },
          {
            subheading: "Fann Résidence, Point E & Mermoz : Le compromis résidentiel paisible",
            body: "Quartiers calmes, arborés et centraux, parfaits pour les consultants, familles d'expatriés ou délégations souhaitant être à mi-chemin entre le Plateau et les Almadies sans subir les nuisances sonores.",
          },
        ],
      },
      {
        heading: "Les deux critères techniques incontournables à vérifier avant de louer",
        content: "À Dakar, la beauté des photos d'un appartement meublé ne suffit pas. Pour travailler ou se reposer sereinement, deux équipements techniques sont décisifs :",
        subsections: [
          {
            subheading: "1. Le groupe électrogène automatique (anti-coupure 24/7)",
            body: "Des délestages ou incidents de réseau électrique peuvent survenir. Toutes les résidences sélectionnées par SLAAC Voyages disposent d'un groupe électrogène de secours à relais automatique capable d'alimenter climatisation, éclairage et réfrigération.",
          },
          {
            subheading: "2. La connexion internet par fibre optique vérifiée",
            body: "Pour les réunions en visioconférence et le travail à distance, un simple modem 4G partagé est insuffisant. Nous certifions le débit réel par fibre optique dédiée dans nos appartements partenaires.",
          },
        ],
      },
      {
        heading: "Hôtel ou appartement meublé avec conciergerie ?",
        content: "Si l'hôtel offre une réception permanente, l'appartement meublé en résidence privée présente des atouts indéniables : espace deux à trois fois supérieur, cuisine équipée pour les séjours de plus de 4 jours, et intimité préservée. SLAAC Voyages combine les deux approches en adossant à ses résidences un service de conciergerie réactif disponible 7j/7.",
      },
    ],
    practicalFaq: [
      {
        question: "Les résidences proposées par SLAAC Voyages sont-elles gardées ?",
        answer: "Oui, 100% de nos résidences disposent d'un gardiennage permanent 24h/24, de caméras de contrôle dans les parties communes et d'un accès sécurisé.",
      },
      {
        question: "Proposez-vous un service de ménage pendant le séjour ?",
        answer: "Nos formules incluent un passage de ménage régulier (fréquence modulable selon vos souhaits : quotidien ou deux à trois fois par semaine) avec renouvellement des draps et serviettes.",
      },
    ],
    officialSources: [
      {
        title: "Agence Sénégalaise de Promotion Touristique (ASPT)",
        verifiedDate: '2026-10-18',
        note: "Normes de classement des résidences meublées et établissements touristiques.",
      },
    ],
    relatedService: {
      label: 'Résidences & Hébergements Dakar',
      serviceSlug: 'hebergement',
      destination: 'Dakar (Plateau, Almadies, Mermoz)',
      href: '/hebergement',
      ctaText: 'Consulter nos hébergements vérifiés à Dakar',
    },
  },
  {
    slug: 'preparer-omra-depuis-le-senegal',
    title: "Préparer son pèlerinage Omra depuis le Sénégal : formalités Nusuk, vols réguliers et choix des hébergements",
    metaTitle: "Préparer son Omra depuis le Sénégal : Guide & Formalités | SLAAC Voyages",
    metaDescription: "Guide complet pour accomplir sa Omra au départ de Dakar : formalités officielles sur la plateforme Nusuk, vols vers Médine et Djeddah, hôtels proches du Haram.",
    category: 'Pèlerinage',
    readTime: '9 min de lecture',
    publishedAt: '2026-09-28T09:00:00.000Z',
    updatedAt: '2026-10-18T00:00:00.000Z',
    verifiedAt: '2026-10-18',
    author: {
      name: 'Pôle Pèlerinages & Tourisme Religieux',
      role: 'Coordinateur des Séjours Saints',
      agency: 'SLAAC Voyages Dakar',
    },
    heroImage: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=1200&fit=crop',
    excerpt: "L'accomplissement de la Omra est un moment spirituel d'une rare intensité. Une préparation administrative et logistique minutieuse permet d'aborder ce voyage sacré avec sérénité et dévotion.",
    sections: [
      {
        heading: "Les évolutions administratives : la plateforme officielle Nusuk",
        content: "Le Ministère saoudien du Hajj et de la Omra a modernisé l'accès aux Lieux Saints à travers l'écosystème numérique officiel Nusuk. Les pèlerins peuvent désormais obtenir des visas dédiés ou des visas touristiques selon leur statut et les forfaits réservés. SLAAC Voyages guide chaque pèlerin dans ces démarches numériques pour éviter toute irrégularité administrative.",
      },
      {
        heading: "Documents obligatoires et conditions sanitaires",
        content: "Avant tout engagement, le candidat à la Omra doit s'assurer de la validité de ses pièces :",
        subsections: [
          {
            subheading: "Passeport biométrique",
            body: "Le passeport doit obligatoirement avoir une validité résiduelle d'au moins 6 mois à compter de la date prévue d'entrée sur le territoire du Royaume d'Arabie Saoudite.",
          },
          {
            subheading: "Exigences vaccinales",
            body: "Le carnet de vaccination international à jour (notamment vaccin méningococcique ACWY135 datant de moins de 3 ou 5 ans selon le type de vaccin, et vaccins recommandés par les autorités sanitaires saoudiennes) est indispensable.",
          },
        ],
      },
      {
        heading: "La logistique du pèlerin : acheminement et hôtels proches des mosquées saintes",
        content: "Le confort physique est un facteur clé pour accomplir les rites dans de bonnes dispositions :",
        subsections: [
          {
            subheading: "Vols depuis Dakar AIBD",
            body: "Vols réguliers avec de grandes compagnies internationales (Emirates, Turkish Airlines, Ethiopian Airlines, Royal Air Maroc, Saudia lorsqu'elle opère des liaisons directes ou affrétées), avec arrivée soit à Médine (Prince Mohammad Bin Abdulaziz) soit à Djeddah (King Abdulaziz).",
          },
          {
            subheading: "Sélection d'hôtels à Médine et La Mecque",
            body: "À Médine, nous privilégions les hôtels situés sur la cour nord ou sud de la Mosquée du Prophète (Al-Masjid an-Nabawi). À La Mecque, la distance au Sanctuaire (Al-Masjid al-Haram) et la disponibilité du train à grande vitesse Haramain entre les deux villes saintes sont scrupuleusement étudiées.",
          },
        ],
      },
    ],
    practicalFaq: [
      {
        question: "SLAAC Voyages garantit-elle la délivrance du visa Omra ?",
        answer: "Non. Comme pour tout visa international, seule l'autorité saoudienne est habilitée à accorder l'entrée sur son territoire. SLAAC Voyages assure l'assistance complète au montage du dossier, la soumission conforme et l'ensemble des réservations certifiées de vol et d'hébergement.",
      },
      {
        question: "Proposez-vous des formules individuelles ou seulement des groupes ?",
        answer: "Nous élaborons aussi bien des programmes sur mesure pour les familles et personnes seules souhaitant voyager à leurs dates, que des départs coordonnés lors des périodes de haute affluence (notamment au cours du mois de Ramadan).",
      },
    ],
    officialSources: [
      {
        title: "Plateforme officielle Nusuk (Royaume d'Arabie Saoudite)",
        url: 'https://www.nusuk.sa/',
        verifiedDate: '2026-10-18',
        note: "Plateforme étatique officielle d'information et de planification de la Omra.",
      },
      {
        title: "Ministère saoudien du Hajj et de la Omra",
        verifiedDate: '2026-10-18',
        note: "Réglementations et instructions consulaires pour les pèlerins internationaux.",
      },
    ],
    relatedService: {
      label: 'Accompagnement Pèlerinage Omra',
      serviceSlug: 'omra',
      destination: 'La Mecque & Médine, Arabie Saoudite',
      href: '/omra',
      ctaText: "Demander des informations sur l'Omra",
    },
  },
  {
    slug: 'voyage-affaires-chine-depuis-dakar',
    title: "Voyager en Chine pour affaires depuis le Sénégal : démarches visas, foires commerciales et logistique",
    metaTitle: "Voyage d'Affaires en Chine depuis Dakar : Visas & Conseils | SLAAC Voyages",
    metaDescription: "Guide pour préparer son voyage d'affaires en Chine depuis le Sénégal : visa d'affaires M, foires de Canton et Yiwu, vols et formalités à Dakar.",
    category: 'Affaires & Entreprise',
    readTime: '8 min de lecture',
    publishedAt: '2026-10-02T11:00:00.000Z',
    updatedAt: '2026-10-18T00:00:00.000Z',
    verifiedAt: '2026-10-18',
    author: {
      name: 'Pôle Mobilité Internationale & Corporate',
      role: 'Conseiller Déplacements Asie & Moyen-Orient',
      agency: 'SLAAC Voyages Dakar',
    },
    heroImage: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=1200&fit=crop',
    excerpt: "Pour les commerçants, importateurs et entrepreneurs sénégalais, la Chine est une destination économique de premier plan. Voici les étapes clés pour préparer un voyage professionnel sans accroc.",
    sections: [
      {
        heading: "Les grands rendez-vous commerciaux (Canton, Yiwu, Shanghai)",
        content: "De nombreux professionnels basés à Dakar se rendent régulièrement en Chine pour sourcer des équipements, du textile, des matériaux de construction ou des produits électroniques. La Foire de Canton (Canton Fair à Guangzhou), le marché de gros international de Yiwu ou les salons industriels de Shanghai requièrent une planification logistique rigoureuse plusieurs mois à l'avance.",
      },
      {
        heading: "Le visa d'affaires chinois (Catégorie M) : les pièces maîtresses",
        content: "La demande de visa d'affaires nécessite des justificatifs clairs sur l'objet professionnel de votre déplacement :",
        subsections: [
          {
            subheading: "La lettre d'invitation officielle (Invitation Letter)",
            body: "Émise par un partenaire commercial légalement enregistré en Chine ou par l'organisateur officiel de la foire commerciale. Elle doit préciser l'identité du voyageur, le motif précis de la visite et la prise en charge financière.",
          },
          {
            subheading: "L'ordre de mission et le dossier d'entreprise à Dakar",
            body: "Registre de commerce sénégalais (RCCM), NINEA, relevés bancaires professionnels et lettre de mission de l'entreprise sénégalaise justifiant le déplacement du collaborateur.",
          },
        ],
      },
      {
        heading: "Acheminement aérien et gestion des devises",
        content: "Depuis Dakar AIBD, les liaisons vers Pékin, Shanghai ou Guangzhou s'opèrent avec escale via les grands hubs internationaux (Dubaï avec Emirates, Istanbul avec Turkish Airlines, Addis-Abeba avec Ethiopian Airlines). SLAAC Voyages optimise les temps d'escale pour minimiser la fatigue des voyageurs d'affaires et négocie les franchises bagages indispensables pour rapporter échantillons et catalogues.",
      },
    ],
    practicalFaq: [
      {
        question: "SLAAC Voyages fournit-elle l'invitation commerciale chinoise ?",
        answer: "Non. La lettre d'invitation doit impérativement provenir de votre partenaire d'affaires réel ou de l'entité chinoise officielle. Notre agence prend le relais pour vérifier la conformité du document aux exigences consulaires et monter votre dossier de demande.",
      },
      {
        question: "Quels sont les délais habituels de traitement consulaire à Dakar ?",
        answer: "Le délai moyen de traitement auprès des services consulaires chinois à Dakar varie de 5 à 10 jours ouvrés après le dépôt complet du dossier.",
      },
    ],
    officialSources: [
      {
        title: "Ambassade de la République Populaire de Chine en République du Sénégal",
        verifiedDate: '2026-10-18',
        note: "Consignes officielles relatives aux visas d'affaires M et formalités consulaires à Dakar.",
      },
      {
        title: "Foire de Canton (China Import and Export Fair)",
        url: 'https://www.cantonfair.org.cn/',
        verifiedDate: '2026-10-18',
        note: "Calendrier officiel des sessions de printemps et d'automne.",
      },
    ],
    relatedService: {
      label: 'Assistance Visas & Voyages Chine',
      serviceSlug: 'assistance-visa',
      destination: 'Chine (Guangzhou, Yiwu, Shanghai)',
      href: '/assistance-voyage',
      ctaText: 'Préparer mon voyage d affaires en Chine',
    },
  },
  {
    slug: 'demande-visa-voyage-international-dakar',
    title: "Demande de visa depuis Dakar : liste des pièces, assurance voyage et conseils pour réussir son dossier",
    metaTitle: "Demande de Visa à Dakar : Pièces, Assurance & Conseils | SLAAC Voyages",
    metaDescription: "Comment réussir sa demande de visa depuis Dakar ? Pièces à fournir, importance de l'assurance voyage homologuée 30 000 € et accompagnement de l'agence.",
    category: 'Mobilité Internationale',
    readTime: '7 min de lecture',
    publishedAt: '2026-10-05T15:00:00.000Z',
    updatedAt: '2026-10-18T00:00:00.000Z',
    verifiedAt: '2026-10-18',
    author: {
      name: 'Pôle Formalités Consulaires',
      role: 'Responsable Montage Dossiers',
      agency: 'SLAAC Voyages Dakar',
    },
    heroImage: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1200&fit=crop',
    excerpt: "Une demande de visa réussie repose sur la cohérence, l'exactitude des pièces fournies et le respect strict du calendrier consulaire. Retrouvez nos recommandations pratiques.",
    sections: [
      {
        heading: "Les causes fréquentes de rejet de dossier consulaire",
        content: "L'analyse des retours consulaires montre que la majorité des refus ne sont pas liés à un motif de fond, mais à des erreurs évitables : formulaire mal renseigné, incohérence entre dates de vol et réservations d'hôtel, attestation d'assurance non conforme aux normes internationales, ou absence de justificatifs d'attache professionnelle et financière dans le pays d'origine.",
      },
      {
        heading: "L'assurance voyage obligatoire : ce que vous devez exiger",
        content: "Pour l'espace Schengen et de nombreuses autres destinations, la souscription d'une assurance voyage est une obligation légale :",
        subsections: [
          {
            subheading: "Plafond minimum de 30 000 euros",
            body: "Le contrat doit couvrir les frais médicaux d'urgence et le rapatriement sanitaire à hauteur d'au moins 30 000 € (ou équivalent en devises) pour toute la durée du séjour prévu.",
          },
          {
            subheading: "Compagnies d'assurances agréées",
            body: "SLAAC Voyages émet directement en agence des attestations d'assurances émanant de compagnies partenaires officiellement reconnues par les consulats accrédités au Sénégal.",
          },
        ],
      },
      {
        heading: "Notre démarche d'accompagnement transparente à Dakar Plateau",
        content: "Dans nos bureaux situés au 3e étage de l'immeuble Djolof Chicken à Dakar Plateau, nos conseillers vous reçoivent pour une revue critique de chaque pièce de votre dossier avant votre rendez-vous biométrique : conformité des photos d'identité aux normes ICAO, validation des réservations d'hébergement et cohérence globale de votre parcours de voyage.",
      },
    ],
    practicalFaq: [
      {
        question: "L'assurance voyage est-elle remboursée en cas de refus de visa ?",
        answer: "Selon les conditions contractuelles de nos assureurs partenaires, une annulation de police d'assurance avec remboursement partiel ou total (hors frais de dossier minimes) est possible sur présentation du justificatif officiel de refus consulaire.",
      },
      {
        question: "Combien de temps avant le départ faut-il déposer sa demande ?",
        answer: "Pour l'espace Schengen, le dépôt est possible jusqu'à 6 mois avant la date prévue du voyage. Nous recommandons vivement de déposer votre demande entre 6 et 8 semaines avant votre départ.",
      },
    ],
    officialSources: [
      {
        title: "Code communautaire des visas de l'Union Européenne",
        verifiedDate: '2026-10-18',
        note: "Réglementation relative aux pièces justificatives et exigences d'assurance voyage.",
      },
    ],
    relatedService: {
      label: 'Assistance Visas & Formalités',
      serviceSlug: 'assistance-visa',
      href: '/assistance-voyage',
      ctaText: 'Faire vérifier mon dossier par un conseiller',
    },
  },
];

export function getGuideBySlug(slug: string): GuideArticle | undefined {
  return guidesData.find((g) => g.slug === slug);
}
