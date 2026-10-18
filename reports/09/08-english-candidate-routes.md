# Pages Candidates Anglaises et Expérience Visiteur
## SLAAC Voyages | Présentation des 10 Routes Anglaises Candidates

### 1. Stratégie de Déploiement des Routes Anglaises
Plutôt qu'une traduction automatique à la volée, SLAAC Voyages a conçu 10 pages candidates complètes sous Next.js 15, rédigées en anglais professionnel naturel et adaptées aux attentes spécifiques des voyageurs internationaux :

| Route Anglaise | Page Correspondante FR | Thématique & Proposition de Valeur |
| :--- | :--- | :--- |
| `/en` | `/` | Accueil bilingue : présentation de l'agence à Dakar Plateau, services phares, réassurance Teranga et appel au devis. |
| `/en/transport` | `/transport` | Transferts aéroport AIBD, accueil en zone d'arrivée avec pancarte, flotte berlines/SUV climatisés, prix en FCFA/XOF et chauffeurs privés. |
| `/en/hebergement` | `/hebergement` | Appartements meublés et hôtels partenaires vérifiés avec garanties indispensables (groupe électrogène automatique et Wi-Fi fibre optique). |
| `/en/excursions` | `/excursions` | Circuits privés et excursions guidées : Île de Gorée (Maison des Esclaves), Lac Rose, Réserve de Bandia et Delta du Sine-Saloum. |
| `/en/tourisme-affaires` | `/tourisme-affaires` | Tourisme d'affaires, MICE, délégations officielles, logistique événementielle et facturation certifiée avec TVA sénégalaise (18%). |
| `/en/assistance-voyage` | `/assistance-voyage` | Formalités d'entrée au Sénégal, vérification des exemptions de visa, assistance visas internationaux et préinscriptions universitaires. |
| `/en/destinations` | `/destinations` | Guide des régions du Sénégal (Dakar, Petite Côte, Casamance, Saint-Louis) et vols internationaux au départ d'AIBD. |
| `/en/about` | `/about` | Présentation de l'agence SLAAC Voyages à Dakar Plateau, accréditations légales (NINEA, RCCM), vision, mission et équipe locale. |
| `/en/contact` | `/contact` | Coordonnées complètes du bureau de Dakar Plateau, horaires GMT, itinéraire Google Maps et formulaire interactif avec soumission `locale: 'en'`. |
| `/en/dakar-2026` | `/dakar-2026` | Hub international dédié aux Jeux Olympiques de la Jeunesse (Dakar, Diamniadio, Saly) avec logistique de séjour et avertissement légal d'indépendance. |

### 2. Qualité Éditoriale et Absence de "Fausses Traductions"
Toutes les pages anglaises ont été écrites dans un anglais fluide, précis et idiomatique :
- Remplacement du jargon administratif français par les termes reconnus de l'industrie touristique anglophone (DMC, MICE, Meet & Greet, Tollway fees, Vetted lodgings).
- Conversion indicative des tarifs FCFA en devises de référence (`FCFA / XOF (~45 EUR / $50 USD)`).
- Clarification des démarches consulaires et des temps de trajet effectifs (autoroute à péage vs trafic urbain).

### 3. Intégration CRO et Call-to-Actions Dédiés
Sur chaque page anglaise, les boutons d'appel à l'action (`QuoteRequestButton`) transmettent automatiquement `locale="en"` et pré-sélectionnent le service et la destination du contexte, garantissant une continuité fluide dans le parcours de conversion.
