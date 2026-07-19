export type Destination = {
  id: string;
  name: string;
  price: string;
  image: string; // URL de l'image
  tag: string;
  public_id: string; // Cloudinary public_id for deletion
};

type OffreBase = {
  id: string;
  titre: string;
  description: string;
  prix: string;
  image: string;
  public_id: string;
  tag: string;
  disponible: boolean;
  ordre: number;
};

export type Hebergement = OffreBase & {
  type: 'hotel' | 'appartement' | 'villa' | 'auberge' | 'residence';
  localisation: string;
  nombreEtoiles: number;
  capacite: string;
  equipements: string[];
  descriptionComplete: string;
  images: string[];
};

export type Transport = OffreBase & {
  type: 'location_voiture' | 'vtc' | 'transfert_aeroport' | 'bus_prive';
  vehicule: string;
  capacitePassagers: number;
  avecChauffeur: boolean;
  carburantInclus: boolean;
  descriptionComplete: string;
  images: string[];
};

export type VoyageCroisiere = OffreBase & {
  type: 'voyage' | 'croisiere';
  destination: string;
  duree: string;
  dateDepart: string;
  inclus: string[];
  nonInclus: string[];
  descriptionComplete: string;
  images: string[];
};

export type Excursion = OffreBase & {
  lieu: string;
  duree: string;
  pointDepart: string;
  inclus: string[];
  difficulte: 'facile' | 'moyenne' | 'sportive';
  descriptionComplete: string;
  images: string[];
};

export type OffreAffaires = OffreBase & {
  type: 'seminaire' | 'incentive' | 'mice' | 'mission_sur_mesure';
  capacite: string;
  lieu: string;
  duree: string;
  services: string[];
  descriptionComplete: string;
  images: string[];
};

export type Temoignage = {
  id: string;
  nom: string;
  ville: string;
  note: number;
  texte: string;
  service: string;
  date: string;
  visible: boolean;
  ordre: number;
};

export type ChiffreCle = {
  id: string;
  valeur: number;
  suffixe: string;
  label: string;
  icone: string;
  ordre: number;
};
