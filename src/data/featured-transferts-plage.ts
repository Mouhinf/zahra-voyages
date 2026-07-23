import type { Transport } from '@/types';

const optimizeCloudinaryImage = (url: string) =>
  url.replace('/image/upload/', '/image/upload/f_auto,q_auto:best,c_limit,w_1600,e_auto_contrast,e_sharpen/');

const makeBeachTransfer = (
  id: string,
  titre: string,
  tag: string,
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
  type: 'transfert_plage',
  vehicule: 'Véhicule 4×4 avec chauffeur',
  capacitePassagers: 4,
  avecChauffeur: true,
  carburantInclus: true,
});

export const featuredTransfertsPlage: Transport[] = [
  makeBeachTransfer(
    'transfert-plage-lac-rose',
    'Dakar – Lac Rose en 4×4',
    'Pistes & plage',
    'Rejoignez le Lac Rose et les paysages côtiers à bord d’un véhicule 4×4 avec chauffeur expérimenté.',
    'Ce transfert en 4×4 est adapté aux pistes sablonneuses et aux accès difficiles autour du Lac Rose. Votre chauffeur vous accompagne depuis Dakar, assure une conduite confortable et peut prévoir des arrêts photos ou une continuation vers la plage et les dunes selon votre programme. Le véhicule accueille jusqu’à quatre passagers avec leurs bagages.',
    'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784825226/slaac-voyages/transport-transferts-plage/transfert-lac-rose.jpg',
  ),
  makeBeachTransfer(
    'transfert-plage-petite-cote',
    'Dakar – Petite-Côte en 4×4',
    'Escapade balnéaire',
    'Un transfert confortable en 4×4 vers Saly, Somone, Popenguine ou les plages plus sauvages de la Petite-Côte.',
    'Partez vers les stations balnéaires et les plages de la Petite-Côte avec un véhicule 4×4 climatisé et un chauffeur ponctuel. Cette formule convient aux familles, aux petits groupes et aux voyageurs qui souhaitent rejoindre leur hôtel, une villa ou un lieu de rendez-vous sans contrainte. Les trajets aller-retour et les étapes personnalisées sont disponibles sur devis.',
    'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784825228/slaac-voyages/transport-transferts-plage/transfert-petite-cote.jpg',
  ),
  makeBeachTransfer(
    'transfert-plage-sine-saloum',
    'Sine-Saloum – plages et bolongs en 4×4',
    'Nature & découverte',
    'Accédez aux plages, campements et points de départ des pirogues du Sine-Saloum avec un 4×4 robuste et confortable.',
    'Le véhicule 4×4 permet de rejoindre les hébergements et les sites naturels du Sine-Saloum par des pistes parfois sablonneuses. Votre chauffeur connaît les accès locaux et adapte l’itinéraire aux marées, aux horaires de traversée et à vos activités. Nous pouvons organiser un transfert simple, un retour ou un circuit avec plusieurs étapes.',
    'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784825229/slaac-voyages/transport-transferts-plage/transfert-sine-saloum.jpg',
  ),
];
