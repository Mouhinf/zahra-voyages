import type { Transport } from '@/types';

type FeaturedDestination = Transport;

const optimizeCloudinaryImage = (url: string) =>
  url.replace('/image/upload/', '/image/upload/f_auto,q_auto:best,c_limit,w_1600,e_auto_contrast,e_sharpen/');

const makeDestination = (
  id: string,
  titre: string,
  tag: string,
  description: string,
  descriptionComplete: string,
  image: string,
): FeaturedDestination => ({
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
  type: 'billet_avion',
  vehicule: 'Billet d’avion',
  capacitePassagers: 1,
  avecChauffeur: false,
  carburantInclus: false,
});

export const featuredDestinations: FeaturedDestination[] = [
  makeDestination('destination-paris', 'Paris, France', 'Europe', 'La Ville Lumière séduit par sa Tour Eiffel, ses musées, ses quartiers historiques et son art de vivre.', 'Partez à la découverte de Paris, capitale culturelle et romantique, entre promenades sur les quais de Seine, gastronomie, shopping et grands monuments. Nous organisons votre billet d’avion et pouvons vous accompagner pour construire un séjour adapté à vos envies.', 'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784823031/slaac-voyages/transport-destinations/paris.jpg'),
  makeDestination('destination-dubai', 'Dubaï, Émirats arabes unis', 'Moyen-Orient', 'Une destination spectaculaire où gratte-ciel, désert, plages et expériences de luxe se rencontrent.', 'Dubaï offre un contraste unique entre architecture futuriste, souks traditionnels, plages et escapades dans le désert. Réservez votre billet avec SLAAC Voyages et profitez de conseils personnalisés pour votre séjour, votre escale ou votre voyage d’affaires.', 'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784823032/slaac-voyages/transport-destinations/dubai.jpg'),
  makeDestination('destination-londres', 'Londres, Royaume-Uni', 'Europe', 'Une capitale cosmopolite connue pour ses palais, ses musées, ses parcs et son énergie créative.', 'Londres se découvre au fil de la Tamise, de Westminster, des quartiers de Notting Hill et de ses musées renommés. Nous vous aidons à trouver le vol adapté et à préparer un séjour culturel, familial ou professionnel.', 'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784823033/slaac-voyages/transport-destinations/londres.jpg'),
  makeDestination('destination-new-york', 'New York, États-Unis', 'Amérique du Nord', 'La ville qui ne dort jamais rassemble skyline mythique, culture, shopping et quartiers du monde entier.', 'De Manhattan à Brooklyn, New York propose une expérience intense entre Times Square, Central Park, les musées, les spectacles et les adresses culinaires. SLAAC Voyages vous accompagne pour votre billet long-courrier et votre itinéraire.', 'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784823057/slaac-voyages/transport-destinations/new-york.jpg'),
  makeDestination('destination-tokyo', 'Tokyo, Japon', 'Asie', 'Une métropole fascinante où traditions japonaises, technologie, gastronomie et quartiers animés se côtoient.', 'Tokyo invite à passer des temples de Asakusa aux lumières de Shibuya, tout en découvrant une gastronomie exceptionnelle et une culture profondément dépaysante. Nous vous proposons des solutions de vol adaptées à la durée et au budget de votre voyage.', 'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784823059/slaac-voyages/transport-destinations/tokyo.jpg'),
  makeDestination('destination-istanbul', 'Istanbul, Turquie', 'Méditerranée', 'Une ville unique entre Europe et Asie, portée par le Bosphore, les mosquées et une histoire millénaire.', 'Istanbul séduit par Sainte-Sophie, la Mosquée Bleue, le Grand Bazar et ses croisières sur le Bosphore. Réservez votre billet avec une agence qui vous conseille sur les horaires, les correspondances et les formalités de votre voyage.', 'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784823060/slaac-voyages/transport-destinations/istanbul.jpg'),
  makeDestination('destination-rome', 'Rome, Italie', 'Europe', 'La capitale italienne offre un voyage dans le temps entre Colisée, Vatican, fontaines et gastronomie.', 'Rome est idéale pour un séjour culturel, spirituel ou en famille. Des vestiges antiques aux places animées, chaque quartier raconte une histoire. Nous vous aidons à choisir votre vol et à organiser une escapade fluide depuis le Sénégal.', 'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784823061/slaac-voyages/transport-destinations/rome.jpg'),
  makeDestination('destination-barcelone', 'Barcelone, Espagne', 'Europe', 'Une ville méditerranéenne colorée, célèbre pour l’architecture de Gaudí, ses plages et sa vie culturelle.', 'Barcelone combine patrimoine, mer et ambiance chaleureuse. Explorez la Sagrada Família, le parc Güell, les Ramblas et les quartiers historiques lors d’un séjour conçu selon votre rythme. Votre billet d’avion peut être réservé sur mesure avec SLAAC Voyages.', 'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784823064/slaac-voyages/transport-destinations/barcelone.jpg'),
  makeDestination('destination-bangkok', 'Bangkok, Thaïlande', 'Asie', 'Une capitale vibrante entre temples dorés, marchés, cuisine de rue et excursions tropicales.', 'Bangkok est une porte d’entrée idéale vers la Thaïlande et l’Asie du Sud-Est. Découvrez ses temples, ses marchés flottants et son animation unique, puis prolongez votre voyage vers les îles. Nous trouvons l’itinéraire aérien adapté à votre projet.', 'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784823065/slaac-voyages/transport-destinations/bangkok.jpg'),
  makeDestination('destination-singapour', 'Singapour', 'Asie', 'Une cité-jardin moderne et élégante, réputée pour sa sécurité, sa gastronomie et son architecture futuriste.', 'Singapour réunit jardins spectaculaires, quartiers culturels, shopping et cuisine multiculturelle dans un environnement très organisé. Que ce soit pour une escale ou un séjour complet, SLAAC Voyages vous propose les meilleures options de billet selon vos dates.', 'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784823066/slaac-voyages/transport-destinations/singapour.jpg'),
];

export const allWorldDestinationsMessage = 'Nous délivrons des billets d’avion pour toutes les destinations du monde, avec des itinéraires personnalisés, des conseils sur les correspondances et un accompagnement avant le départ.';
