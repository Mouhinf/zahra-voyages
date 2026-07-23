import type { Transport } from '@/types';

const optimizeCloudinaryImage = (url: string) =>
  url.replace('/image/upload/', '/image/upload/f_auto,q_auto:best,c_limit,w_1600,e_auto_contrast,e_sharpen/');

const makeTransfer = (
  id: string,
  titre: string,
  tag: string,
  vehicule: string,
  capacitePassagers: number,
  description: string,
  descriptionComplete: string,
  image: string,
): Transport => ({
  id,
  titre,
  description,
  descriptionComplete,
  prix: 'Sur devis',
  image: optimizeCloudinaryImage(image),
  images: [optimizeCloudinaryImage(image)],
  public_id: '',
  tag,
  disponible: true,
  ordre: 0,
  type: 'transfert_aeroport',
  vehicule,
  capacitePassagers,
  avecChauffeur: true,
  carburantInclus: true,
});

export const featuredTransfertsAeroport: Transport[] = [
  makeTransfer(
    'transfert-aeroport-dakar',
    'Aéroport Blaise Diagne – Dakar',
    'Transfert privé',
    'Berline climatisée',
    3,
    'Un accueil ponctuel et confortable entre l’Aéroport International Blaise Diagne et Dakar, avec chauffeur professionnel.',
    'À votre arrivée, votre chauffeur vous attend avec un suivi de vol pour faciliter votre accueil, prendre en charge vos bagages et vous conduire directement à votre hôtel ou à l’adresse de votre choix. Le service est également disponible au départ de Dakar vers l’aéroport, de jour comme de nuit. Le tarif est établi sur devis selon l’adresse, l’horaire et le nombre de voyageurs.',
    'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784824727/slaac-voyages/transport-transferts-aeroport/transfert-dakar.jpg',
  ),
  makeTransfer(
    'transfert-aeroport-famille',
    'Transfert Aéroport en famille',
    'Famille & bagages',
    'Van avec chauffeur',
    7,
    'Un van spacieux pour transporter familles, groupes et bagages en toute sérénité entre l’aéroport et votre lieu de séjour.',
    'Ce transfert est pensé pour les familles et les petits groupes qui souhaitent voyager ensemble. Le van climatisé offre suffisamment d’espace pour les passagers et les bagages, avec une prise en charge personnalisée à l’aéroport ou à votre hébergement. Nous pouvons également prévoir un siège enfant sur demande et coordonner plusieurs véhicules pour les groupes plus importants.',
    'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784824728/slaac-voyages/transport-transferts-aeroport/transfert-famille.jpg',
  ),
  makeTransfer(
    'transfert-aeroport-vip',
    'Transfert Aéroport VIP',
    'Service premium',
    'SUV premium',
    4,
    'Une arrivée élégante et discrète avec un chauffeur dédié, un véhicule premium et une assistance personnalisée.',
    'Pour les voyageurs d’affaires, les séjours haut de gamme et les occasions spéciales, notre transfert VIP assure une expérience fluide dès la sortie de l’avion. Accueil personnalisé, véhicule premium, eau à bord et assistance avec les bagages : chaque détail est organisé selon votre programme. Le service peut être réservé pour un aller simple, un aller-retour ou plusieurs étapes.',
    'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784824736/slaac-voyages/transport-transferts-aeroport/transfert-vip.jpg',
  ),
];
