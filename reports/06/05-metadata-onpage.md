# Rapport 05/20 : Optimisation des Métadonnées On-Page & Open Graph

**Date :** 18 Octobre 2026  
**Périmètre :** Next.js 15 App Router, Metadata API, Open Graph 1200x630, Twitter Cards  

---

## 1. Principes Directeurs des Métadonnées SLAAC Voyages

Chaque page indexable du site dispose désormais d'un jeu de métadonnées sémantiques complet, distinctif et aligné sur les véritables intentions de recherche des clients à Dakar et à l'international :

1. **Titres uniques et explicites :**
   - Évitement de la répétition artificielle du nom de marque ou du bourrage de mots-clés.
   - Longueur calibrée pour éviter les troncatures intempestives dans les SERP (entre 50 et 65 caractères).
2. **Meta descriptions engageantes :**
   - Rédigées sur le ton de la conciergerie haut de gamme : clarté de l'offre, réassurance (devis gratuit en 24h, WhatsApp 7j/7, agence physique à Dakar Plateau).
   - Longueur optimisée (140 à 160 caractères).
3. **Cartes Open Graph et Twitter Cards complètes :**
   - Visuels au format 1200x630 pixels.
   - Attributs `og:title`, `og:description`, `og:url` et `og:locale` renseignés.

---

## 2. Inventaire Exhaustif des Titres et Descriptions On-Page

| Route | Balise `<title>` | Méta Description |
| :--- | :--- | :--- |
| **`/` (Accueil)** | SLAAC Voyages \| Agence de voyages à Dakar, Sénégal | SLAAC Voyages, votre agence de voyages et conciergerie à Dakar Plateau : billets d'avion, transferts AIBD, hébergements vérifiés, excursions au Sénégal et visas d'affaires. Devis gratuit sous 24 h. |
| **`/en` (International)** | Travel Agency in Dakar, Senegal — Flights, Visa Assistance, Tours \| SLAAC Voyages | SLAAC Voyages is a Dakar-based travel agency: international flight tickets, visa assistance, hotel booking, AIBD airport transfers, private tours and business travel. Free quote within 24 h. |
| **`/hebergement`** | Hébergements et séjours au Sénégal \| SLAAC Voyages | Hôtels de standing, résidences meublées et lodges à Dakar, Saly et en Casamance. Réservation sécurisée et service conciergerie par SLAAC Voyages. |
| **`/transport`** | Transferts AIBD et transport à Dakar \| SLAAC Voyages | Chauffeurs privés, transferts aéroport Blaise-Diagne (AIBD), berlines VIP et navettes interurbaines à Dakar et au Sénégal avec SLAAC Voyages. |
| **`/excursions`** | Circuits et excursions au Sénégal \| SLAAC Voyages | Excursions guidées à l'île de Gorée, au Lac Rose, à la réserve de Bandia et dans le Sine Saloum. Découvrez le Sénégal authentique avec SLAAC Voyages. |
| **`/tourisme-affaires`** | Voyages d'affaires et déplacements professionnels \| SLAAC Voyages | Organisation logistique pour délégations, séminaires d'entreprises, transports VIP et conciergerie corporate à Dakar Plateau avec SLAAC Voyages. |
| **`/voyages-croisieres`** | Voyages sur mesure et croisières d’exception \| SLAAC Voyages | Séjours organisés sur mesure, forfaits Omra et croisières maritimes au départ de Dakar avec SLAAC Voyages. Conseil personnalisé et devis sous 24 h. |
| **`/assistance-voyage`** | Assistance voyage et formalités à Dakar \| SLAAC Voyages | Assistance visas Chine, Dubaï, Schengen, assurance voyage et préinscriptions universitaires à Dakar Plateau. Démarches accompagnées par SLAAC Voyages. |
| **`/dakar-2026`** | Séjour Dakar fin 2026 : transferts AIBD & hébergements \| SLAAC Voyages | Logistique des séjours et délégations à Dakar, Diamniadio et Saly fin 2026 : flottes privées AIBD, résidences sécurisées et excursions avec SLAAC Voyages. |
| **`/destinations`** | Destinations de rêve au départ de Dakar \| SLAAC Voyages | Paris, Dubaï, New York, Casamance, Bali, Marrakech… Dites-nous où vous rêvez d’aller : SLAAC Voyages conçoit votre séjour sur mesure avec devis gratuit sous 24 h. |
| **`/services`** | Nos prestations de voyages et mobilité à Dakar \| SLAAC Voyages | Billetterie d’avion, transferts aéroport AIBD, hébergements vérifiés, excursions au Sénégal et assistance visas par SLAAC Voyages à Dakar Plateau. |
| **`/about`** | À propos de SLAAC Voyages \| Agence agréée à Dakar Plateau | SLAAC Voyages, agence de voyage et conciergerie locale à Dakar Plateau (NINEA, RCCM) : billetterie, assistance visas, hébergements vérifiés et accueil VIP au Sénégal. |
| **`/contact`** | Contact & Agence Dakar Plateau \| SLAAC Voyages | Contactez SLAAC Voyages à Dakar Plateau : devis gratuit sous 24 h, WhatsApp +221 77 312 90 90, email contact@slaacvoyages.com et accueil à l’agence. |
| **`/confidentialite`** | Politique de confidentialité et données personnelles \| SLAAC Voyages | Comment SLAAC Voyages collecte, utilise et protège vos données personnelles : demandes de devis, formulaires, newsletter et CRM à Dakar Plateau. |
| **Fiches détaillées `[id]`** | `[Titre Offre] \| SLAAC Voyages` | Extrait précis (160 car.) de la description de l'offre + visuel Open Graph dédié |
| **Pages d'Erreur (404)** | Page non trouvée (404) \| SLAAC Voyages Dakar | `noindex, nofollow, nocache` |
