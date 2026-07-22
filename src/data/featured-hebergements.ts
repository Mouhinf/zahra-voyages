import type { Hebergement } from '@/types';

type NewHebergement = Hebergement;

const improveCloudinaryImage = (url: string) =>
  url.replace('/image/upload/', '/image/upload/f_auto,q_auto:best,c_limit,w_1600,e_auto_contrast,e_sharpen/');

const makeHebergement = (
  id: string,
  titre: string,
  type: Hebergement['type'],
  tag: string,
  localisation: string,
  image: string,
  description: string,
  descriptionComplete: string,
  images: string[] = [image],
): NewHebergement => {
  const mainImage = improveCloudinaryImage(image);

  return {
    id, titre, type, tag, localisation,
    image: mainImage,
    images: images.map(improveCloudinaryImage),
    description, descriptionComplete,
    prix: 'Sur devis', public_id: '', disponible: true, ordre: 300,
    nombreEtoiles: type === 'hotel' ? 4 : 0, capacite: 'Sur demande', equipements: ['Accueil SLAAC Voyages', 'Réservation sur mesure'],
  };
};

export const featuredHebergements: NewHebergement[] = [
  makeHebergement('azalai-hotel-dakar', 'Azalaï Hôtel Dakar', 'hotel', 'Hôtel 4 étoiles', 'Corniche Ouest, Dakar', 'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784757260/slaac-voyages/hebergements/fzgw1n92bq5nhvk1uib0.jpg', 'Une adresse élégante sur la Corniche Ouest, avec vue sur l’océan et des services adaptés aux séjours loisirs comme professionnels.', 'Azalaï Hôtel Dakar propose une expérience quatre étoiles au cœur de la Corniche Ouest. Ses chambres contemporaines, sa piscine, ses espaces de restauration et ses salles de réunion en font une adresse adaptée aussi bien aux vacances qu’aux séminaires. SLAAC Voyages peut organiser le transfert, les excursions et la réservation selon votre programme.', [
    'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784757260/slaac-voyages/hebergements/fzgw1n92bq5nhvk1uib0.jpg', 'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784757261/slaac-voyages/hebergements/ecrul00zuobapz2rqoem.jpg',
  ]),
  makeHebergement('hotel-poste-saint-louis', 'Hôtel de la Poste Saint-Louis', 'hotel', 'Hôtel historique', 'Île de Saint-Louis', 'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784757262/slaac-voyages/hebergements/dpzhrirnjdyv397hne8w.jpg', 'Une adresse historique au bord du fleuve Sénégal, face au pont Faidherbe et au cœur du patrimoine de Saint-Louis.', 'Ancienne adresse de l’Aéropostale, l’Hôtel de la Poste accueille ses visiteurs dans le centre historique de Saint-Louis. Ses chambres, ses espaces de réception et le complexe Flamingo — piscine, bar et restaurant au bord du fleuve — offrent un séjour riche en histoire, confort et découvertes culturelles.', [
    'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784757262/slaac-voyages/hebergements/dpzhrirnjdyv397hne8w.jpg', 'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784757264/slaac-voyages/hebergements/edrzjd0kifnmb9sdruic.jpg',
  ]),
  makeHebergement('hotel-la-residence-saint-louis', 'Hôtel La Résidence', 'hotel', 'Charme & patrimoine', 'Saint-Louis du Sénégal', 'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784757265/slaac-voyages/hebergements/kuivzxbtasmjbjvqmldt.jpg', 'Une maison de caractère au cœur de Saint-Louis, idéale pour découvrir l’architecture, le fleuve et l’atmosphère de l’ancienne capitale.', 'Installé dans un bâtiment chargé d’histoire, l’Hôtel La Résidence propose un cadre chaleureux au cœur de l’île de Saint-Louis. Ses chambres, son bar, son restaurant et ses espaces de réunion constituent une base confortable pour explorer le patrimoine, le parc de la Langue de Barbarie et les environs du fleuve Sénégal.', [
    'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784757265/slaac-voyages/hebergements/kuivzxbtasmjbjvqmldt.jpg', 'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784757267/slaac-voyages/hebergements/exsku2dcpvsy2jygat9o.jpg',
  ]),
  makeHebergement('casino-cap-vert-hotel', 'Casino du Cap-Vert Hôtel', 'hotel', 'Hôtel & loisirs', 'Route de Ngor, Dakar', 'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784757267/slaac-voyages/hebergements/iat8xu636c6kp97wa6bx.jpg', 'Un hôtel avec piscine, chambres rénovées et accès immédiat aux loisirs du Casino du Cap-Vert, à proximité de Ngor et de l’aéroport.', 'Le Casino du Cap-Vert Hôtel propose des chambres doubles, twins et suites autour d’une piscine extérieure. Son emplacement sur la route de Ngor permet de combiner repos, restauration, sorties et découverte de la presqu’île dakaroise dans un même séjour.', [
    'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784757267/slaac-voyages/hebergements/iat8xu636c6kp97wa6bx.jpg', 'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784757269/slaac-voyages/hebergements/nu2soeue7yq9l70z17aa.jpg',
  ]),
  makeHebergement('onomo-hotel-dakar', 'ONOMO Hotel Dakar', 'hotel', 'Hôtel contemporain', 'Dakar', 'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784757270/slaac-voyages/hebergements/evlewvtq5ibovtwsynd3.webp', 'Une adresse contemporaine et pratique pour les voyageurs qui recherchent confort, restauration et services essentiels à Dakar.', 'ONOMO Hotel Dakar associe chambres fonctionnelles, espaces de travail, restaurant et jardin avec piscine dans une ambiance contemporaine. L’établissement convient aux courts séjours, aux voyages d’affaires et aux escales, avec une équipe SLAAC Voyages disponible pour les transferts et les activités.', [
    'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784757270/slaac-voyages/hebergements/evlewvtq5ibovtwsynd3.webp', 'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784757271/slaac-voyages/hebergements/zdygxcncelnar1c6aall.jpg',
  ]),
  makeHebergement('yokan-lodge', 'Yokan Lodge', 'lodge', 'Lodge 5 étoiles', 'Palmarin, Sine-Saloum', 'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784757273/slaac-voyages/hebergements/bop4xjkvkybxx3muzc7t.webp', 'Un lodge d’exception au cœur du Sine-Saloum, entre lagune, brousse et expériences nature.', 'Yokan Lodge invite à vivre le Sine-Saloum dans un cadre privilégié : hébergements soignés, espaces ouverts sur la nature et activités entre lagune, villages et brousse. C’est une adresse idéale pour un séjour de déconnexion, un voyage de noces ou une étape haut de gamme.', [
    'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784757273/slaac-voyages/hebergements/bop4xjkvkybxx3muzc7t.webp', 'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784757274/slaac-voyages/hebergements/lssj7vyg5eodb47ayg1o.webp',
  ]),
  makeHebergement('niassam-lodges', 'Lodges des Collines de Niassam', 'lodge', 'Écolodge', 'Palmarin, Sine-Saloum', 'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784757276/slaac-voyages/hebergements/seyqumgi17jxgie9egib.jpg', 'Des lodges artistiques et écologiques ouverts sur la lagune, les baobabs et la nature du Sine-Saloum.', 'Les Lodges des Collines de Niassam proposent des hébergements singuliers construits avec des matériaux naturels : lodge lagune, lodge baobab, lodge savane et lodge signature. Les sorties en pirogue, l’observation des oiseaux et les rencontres locales prolongent l’expérience.', [
    'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784757276/slaac-voyages/hebergements/seyqumgi17jxgie9egib.jpg', 'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784757277/slaac-voyages/hebergements/eqdwpdmjbwflpttg6ujb.jpg',
  ]),
  makeHebergement('lodge-des-papillons', 'Lodge des Papillons', 'lodge', 'Glamping nature', 'Case Union, route de Yène', 'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784757280/slaac-voyages/hebergements/jerp3cuwhsfevahdrevu.jpg', 'Un écolodge insolite composé de tentes, cases et dômes dans un domaine naturel proche de Toubab Dialaw.', 'Le Lodge des Papillons propose une expérience de glamping au milieu d’un domaine végétalisé de six hectares. Les tentes et cases, alimentées à l’énergie solaire, disposent d’un confort soigné et d’espaces de baignade privés pour un séjour calme entre nature, détente et découverte de la Petite-Côte.', [
    'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784757280/slaac-voyages/hebergements/jerp3cuwhsfevahdrevu.jpg', 'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784757282/slaac-voyages/hebergements/ctcqgp1ycsnli1ivpq4x.jpg',
  ]),
  makeHebergement('dalaal-diam-lodge', 'Dalaal Diam Natural Lodge', 'lodge', 'Lodge écologique', 'La Somone', 'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784757284/slaac-voyages/hebergements/ih5ygmj3q8if8udctpmb.webp', 'Un lodge hors réseau au bord de la lagune de Somone, pensé autour de l’espace, de l’écologie et de la contemplation.', 'Dalaal Diam s’étend sur un domaine naturel de huit hectares entre savane, lagune et baobabs. Ses suites bioclimatiques, lofts et bungalows sont conçus pour offrir intimité, confort et immersion. La piscine, la cuisine familiale et les activités nature composent un séjour profondément dépaysant.', [
    'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784757284/slaac-voyages/hebergements/ih5ygmj3q8if8udctpmb.webp', 'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784757285/slaac-voyages/hebergements/vytdqcef6mqafwk2qoaq.webp',
  ]),
  makeHebergement('sui-manga-lodge', 'Sui Manga Lodge', 'lodge', 'Maison d’hôtes', 'Popenguine', 'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784757287/slaac-voyages/hebergements/d5thvqctkkloixnqms8a.jpg', 'Une maison d’hôtes chaleureuse à quelques mètres de la plage de Popenguine, idéale pour ralentir et vivre au rythme du village.', 'Sui Manga accueille ses hôtes dans cinq chambres autour d’un jardin et d’un patio. À proximité de la plage, de la réserve naturelle et des villages de la Petite-Côte, cette adresse convient aux séjours en famille, aux petites tribus et aux voyageurs qui recherchent une expérience locale et paisible.', [
    'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784757287/slaac-voyages/hebergements/d5thvqctkkloixnqms8a.jpg', 'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784757289/slaac-voyages/hebergements/wpqc8p05ulfwwu3iisml.jpg',
  ]),
  makeHebergement('ocean-savane-lodge', 'Lodge Océan & Savane', 'lodge', 'Lodge & base nautique', 'Saint-Louis, route de Gandiole', 'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784757291/slaac-voyages/hebergements/xkmo7uzz8zgqq6z2fyrh.jpg', 'Des bungalows sur pilotis face au fleuve Sénégal et à l’océan, avec piscine, restaurant et activités nautiques.', 'Océan & Savane est une adresse idéale pour déconnecter à proximité de Saint-Louis. Les bungalows et cabanes offrent des vues sur le fleuve et la Langue de Barbarie. La piscine à débordement, le restaurant panoramique, les kayaks et les activités nautiques permettent de composer un séjour aussi reposant qu’actif.', [
    'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784757291/slaac-voyages/hebergements/xkmo7uzz8zgqq6z2fyrh.jpg', 'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784757293/slaac-voyages/hebergements/bm7uawvc7jsedvsuhmug.jpg',
  ]),
  makeHebergement('campement-wassadou', 'Campement de Wassadou', 'campement', 'Nature & safari', 'Wassadou, Tambacounda', 'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784757294/slaac-voyages/hebergements/qo3k92zktjziwoiem5fs.jpg', 'Une étape nature au Sénégal oriental, aux portes du parc national du Niokolo-Koba et des paysages de la rivière Gambie.', 'Le Campement de Wassadou permet de découvrir la faune et les paysages du Sénégal oriental dans un cadre simple et authentique. Les excursions guidées, l’observation des oiseaux et les sorties autour du Niokolo-Koba en font une étape privilégiée pour les voyageurs en quête de nature.', [
    'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784757294/slaac-voyages/hebergements/qo3k92zktjziwoiem5fs.jpg', 'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784757384/slaac-voyages/hebergements/wymcubvcixtl1tvciarc.jpg', 'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784757385/slaac-voyages/hebergements/li7dfuhzotxrp2wfqljn.jpg',
  ]),
  makeHebergement('campement-essamaye', 'Campement Essamayé', 'campement', 'Sine-Saloum', 'Sine-Saloum', 'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784757297/slaac-voyages/hebergements/bii9f01aiiazyhsjfpag.jpg', 'Un campement convivial en bord de mer, avec cases à impluvium, cuisine locale et sorties en pirogue dans les bolongs.', 'Essamayé propose un séjour au plus près des habitants et des paysages du Sine-Saloum. Les randonnées, balades en pirogue, sorties en kayak et découvertes des villages permettent de vivre une expérience authentique, loin des grands complexes touristiques.', [
    'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784757297/slaac-voyages/hebergements/bii9f01aiiazyhsjfpag.jpg', 'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784757387/slaac-voyages/hebergements/pu7j6k3iqfpq5ee3oceg.jpg', 'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784757388/slaac-voyages/hebergements/zpiachimuw56wmemmwje.jpg',
  ]),
  makeHebergement('campement-cap-sine-saloum', 'Cap du Sine Saloum', 'campement', 'Lagune & détente', 'Ndangane, Fatick', 'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784757298/slaac-voyages/hebergements/jrbyhey4pgcecdy7abic.jpg', 'Un campement au bord de la lagune de Ndangane, avec piscine, ponton et accès privilégié aux îles et bolongs du delta.', 'Cap du Sine Saloum offre un point de départ agréable pour explorer le delta en pirogue, rejoindre Mar Lodj et découvrir les villages du Saloum. Les espaces extérieurs, la piscine et la cuisine locale invitent à prolonger les soirées dans un cadre paisible.', [
    'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784757298/slaac-voyages/hebergements/jrbyhey4pgcecdy7abic.jpg', 'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784757389/slaac-voyages/hebergements/jicniurkufgcgdi62lp1.jpg', 'https://res.cloudinary.com/dvnq5qwbd/image/upload/v1784757390/slaac-voyages/hebergements/zk2fmvfcitq8suod6tzz.jpg',
  ]),
];

export function getFeaturedHebergement(id: string) {
  return featuredHebergements.find((hebergement) => hebergement.id === id);
}
