# Analyse des Lacunes de Contenu (Content Gap Analysis) — SLAAC Voyages
> **Périmètre :** Audit page par page de l'expérience utilisateur, du contenu commercial et des signaux de confiance  
> **Classification :** [OBSERVÉ] Éléments constatés dans le code source et le rendu de l'application | [INFÉRÉ] Attentes des voyageurs déduites de l'analyse sectorielle  
> **Date :** 17 Octobre 2026  
> **Auteur :** Lead UX/CRO & Architecte de Contenu Digital  

---

## 1. Vue d'Ensemble Méthodologique

Pour transformer le site web de SLAAC Voyages en un puissant moteur de conversion commerciale, chaque page doit remplir quatre critères fondamentaux :
1. **Clarté de la proposition de valeur :** Compréhension immédiate de la prestation en moins de 5 secondes.
2. **Réponse aux interrogations critiques du voyageur :** Détails des prestations incluses/exclues, conditions, sécurité, tarification ou mode d'estimation.
3. **Réassurance et crédibilité :** Preuves concrètes (avis vérifiés, licences, transparence de l'agence physique).
4. **Fluidité du parcours d'action :** Présence d'un appel à l'action contextuel clair (devis sur mesure ou contact WhatsApp immédiat).

---

## 2. Audit Page par Page

---

### 2.1. Page d'Accueil (`/`)

#### État Actuel [OBSERVÉ]
- Hero banner dynamique avec carrousel visuel de qualité.
- Grille des 10 services proposant des liens vers les sections ou la modale de devis.
- Section de mise en avant "Dakar 2026" et présentation synthétique de l'agence.
- CTA global "Demander un devis" ouvrant la modale universelle.

#### Attentes Clients & Standards de Marché [INFÉRÉ]
- Identification immédiate du positionnement : Agence basée au Sénégal, spécialiste du voyage d'affaires, de la mobilité internationale et du séjour sur mesure.
- Affichage immédiat des éléments de réassurance institutionnelle (Licence d'exploitation touristique, IATA ou affiliation, bureau physique au Plateau, note d'avis clients).
- Présentation synthétique des forfaits phares du moment (ex: Transfert AIBD, Séjours Saly, Omra).

#### Lacunes Constatées (Gaps) [OBSERVÉ]
- **Absence de tarifs d'appel :** Aucun prix d'accroche n'est visible sur la page d'accueil (ex: *"Navette AIBD dès 30 000 FCFA"*, *"Excursion Gorée dès 35 000 FCFA"*), ce qui crée une incertitude chez les visiteurs sensibles au budget.
- **Témoignages clients statiques :** La section témoignages utilise des profils génériques sans date ni précision sur le voyage réalisé.
- **Faiblesse de la preuve sociale en temps réel :** Aucun compteur d'expérience chiffré (ex: *"+15 000 voyageurs accompagnés"*, *"98% de satisfaction client"*).

#### Recommandations Concrètes (Prompt 04)
1. Ajouter un bandeau de réassurance sous le Hero : `Bureau physique au Plateau (Dakar)` | `Assistance 7j/7` | `Chauffeurs professionnels` | `Facturation certifiée B2B`.
2. Introduire 3 "Cartes Offres Phares" avec prix d'appel indicatif et bouton de réservation direct.
3. Remplacer les avis génériques par de vrais avis clients Google Maps avec lien de vérification externe.

---

### 2.2. Page Transport & Navette AIBD (`/transport`)

#### État Actuel [OBSERVÉ]
- Présentation de la flotte (Berlines, SUV, Minibus).
- Formulaire de demande de devis adapté avec sélection d'adresses de prise en charge et de dépose.

#### Attentes Clients & Standards de Marché [INFÉRÉ]
- Réassurance absolue sur la ponctualité : Prise en charge avec pancarte nominative à l'arrivée AIBD, suivi en direct du statut du vol en cas de retard.
- Tarification transparente et forfaitaire incluant le péage autoroutier Dakar-AIBD.
- Modalités de bagages (nombre de valises par véhicule) et options de confort (bouteille d'eau, climatisation, chargeur téléphone, siège enfant).

#### Lacunes Constatées (Gaps) [OBSERVÉ]
- **Absence de grille forfaitaire claire :** Le client doit obligatoirement remplir un formulaire sans connaître la fourchette de prix, alors que les concurrents VTC affichent directement 25 000 à 35 000 FCFA.
- **Manque de détails opérationnels :** Absence d'indication sur le point de rendez-vous exact à l'AIBD (Sortie terminal arrivées passagers).
- **Pas de mention explicite du suivi des vols :** Le voyageur craint d'être facturé en supplément si son vol AF ou Corsair a 2 heures de retard.

#### Recommandations Concrètes (Prompt 04)
1. Afficher un tableau clair des forfaits types :
   - *AIBD ⇄ Dakar Plateau / Centre : 30 000 FCFA (~46 €)*
   - *AIBD ⇄ Almadies / Ngor : 35 000 FCFA (~53 €)*
   - *AIBD ⇄ Saly / Somone : 35 000 FCFA (~53 €)*
   - *Mise à disposition berline journée (Dakar intra-muros) : 60 000 FCFA (~90 €)*
2. Ajouter le badge "Garantie Vol Retardé : Zéro supplément d'attente jusqu'à 3h".
3. Intégrer un sélecteur interactif rapide : Type de véhicule + Nb de valises.

---

### 2.3. Page Hébergements & Résidences (`/hebergement`)

#### État Actuel [OBSERVÉ]
- Galerie de biens (appartements meublés, résidences, villas) avec filtrage sommaire.
- Fiches descriptives avec galerie d'images et équipements de base.

#### Attentes Clients & Standards de Marché [INFÉRÉ]
- Les voyageurs d'affaires et la diaspora recherchent 3 garanties indispensables à Dakar : **Groupe électrogène automatique** (coupures d'électricité), **Réserve d'eau / Surpresseur** (coupures d'eau SDE), et **Connexion Internet Fibre optique haut débit vérifiée**.
- Transparence sur la localisation exacte (quartier, proximité commerces, calme sonore).
- Système de calendrier de disponibilité ou statut en temps réel ("Disponible" / "Sur demande").

#### Lacunes Constatées (Gaps) [OBSERVÉ]
- **Équipements critiques non mis en avant :** Les fiches ne précisent pas clairement la présence d'un groupe électrogène ou du débit Wi-Fi réel en Mbps (critère décisif pour les nomades et le corporate).
- **Indisponibilité du tarif à la nuitée / semaine :** Tarifs non structurés de façon dynamique selon la durée du séjour (dégressivité semaine/mois).
- **Absence de vidéo / visite virtuelle :** Les photos seules ne permettent pas de lever le doute sur l'état réel du logement.

#### Recommandations Concrètes (Prompt 04)
1. Ajouter 3 badges obligatoires sur chaque fiche bien : `Fibre Optique Débit Garanti` | `Groupe Électrogène 24/7` | `Gardiennage & Sécurité`.
2. Proposer un simulateur de coût dégressif (Nuit / Semaine / Mois).
3. Ajouter un bouton "Visite vidéo sur WhatsApp" permettant à l'agence d'envoyer un tour vidéo du logement au prospect.

---

### 2.4. Page Excursions & Découverte (`/excursions`)

#### État Actuel [OBSERVÉ]
- Catalogue des circuits majeurs : Île de Gorée, Lac Rose, Réserve de Bandia, Îles du Saloum, Saint-Louis.
- Présentation succincte des étapes du circuit.

#### Attentes Clients & Standards de Marché [INFÉRÉ]
- Transparence sur le programme heure par heure (ex: Prise en charge hôtel 8h30, chaloupe 10h00, déjeuner 13h00, retour 17h00).
- Liste explicite des éléments inclus (billet chaloupe, entrée musée, guide officiel assermenté, déjeuner boissons comprises, véhicule climatisé avec carburant) et exclus (dépenses personnelles, pourboires).
- Mention du niveau d'accessibilité (marche, poussettes, personnes à mobilité réduite).

#### Lacunes Constatées (Gaps) [OBSERVÉ]
- **Descriptifs trop courts :** Les pages ne fournissent pas assez de détails culturels ou pratiques pour susciter l'achat spontané.
- **Absence de balisage Schema.org `TouristTrip` :** Opportunité manquée d'apparaître dans les résultats enrichis Google.
- **Pas de tarif dégressif selon la taille du groupe :** Le visiteur ignore si le prix est individuel ou s'il bénéficie d'un tarif préférentiel pour une famille de 4 personnes.

#### Recommandations Concrètes (Prompt 04)
1. Structurer chaque excursion en 4 onglets interactifs : *Programme détaillé* | *Ce qui est inclus / Non inclus* | *Informations pratiques* | *Avis voyageurs*.
2. Afficher la mention : "Guide local certifié d'État & véhicule climatisé privé".
3. Ajouter un sélecteur "Privatisé" vs "Petit groupe".

---

### 2.5. Page Tourisme d'Affaires & MICE (`/tourisme-affaires`)

#### État Actuel [OBSERVÉ]
- Présentation institutionnelle orientée corporate, événements et séminaires d'entreprises.

#### Attentes Clients & Standards de Marché [INFÉRÉ]
- Les directeurs d'achats, RH et organisateurs de conférences recherchent un interlocuteur unique capable de fournir une convention-cadre, des factures conformes à la législation fiscale sénégalaise (TVA, BRS), et une réactivité sous 24h.
- Présentation d'études de cas ou de logos de clients entreprises de référence (ONG, multinationales, institutions régionales comme la CEDEAO ou l'UEMOA).

#### Lacunes Constatées (Gaps) [OBSERVÉ]
- **Manque de documentation téléchargeable :** Pas de plaquette corporate au format PDF disponible en téléchargement immédiat.
- **Absence de descriptif sur la conciergerie VIP :** Pas de mention claire sur l'accueil au salon VIP de l'AIBD ou l'escorte protocolaire.
- **Formulaire générique :** Le formulaire de devis ne capture pas le nombre précis de participants ni les besoins spécifiques (salle plénière, traduction simultanée, régie audiovisuelle).

#### Recommandations Concrètes (Prompt 04)
1. Intégrer un bouton de téléchargement : "Télécharger la brochure Corporate & MICE SLAAC Voyages (PDF)".
2. Ajouter une section "Services Exécutifs" : Accueil salon d'honneur AIBD, Sécurité rapprochée, Flotte blindée sur demande, Facturation entreprise mensuelle.
3. Afficher les engagements SLA (Service Level Agreement) B2B : Devis formel sous 24h ouvrées.

---

### 2.6. Page Assistance Voyage, Visas & Mobilité (`/assistance-voyage`)

#### État Actuel [OBSERVÉ]
- Listing des services d'assistance : Visas (Chine, Dubaï, etc.), Assurance voyage, Prise de rendez-vous ambassades, Mobilité étudiante.

#### Attentes Clients & Standards de Marché [INFÉRÉ]
- Le client local a besoin d'être rassuré sur les risques de refus consulaire et sur le professionnalisme de l'accompagnement (vérification scrupuleuse des pièces justificatives, simulation d'entretien).
- Tarifs de service clairs séparés des frais consulaires officiels.

#### Lacunes Constatées (Gaps) [OBSERVÉ]
- **Manque de foire aux questions (FAQ) :** Pas de section répondant aux questions fréquentes sur les délais de traitement des visas.
- **Avertissement légal manquant :** Absence de mention de décharge précisant que l'octroi d'un visa reste la prérogative souveraine des consulats (élément juridique protecteur pour l'agence).

#### Recommandations Concrètes (Prompt 04)
1. Intégrer une grille comparative des destinations les plus demandées (Dubaï, Chine, Schengen, Turquie, Canada) avec pièces requises et délais indicatifs.
2. Ajouter une FAQ interactive avec balisage `FAQPage` JSON-LD.
3. Insérer la mention légale de conformité consulaire.

---

### 2.7. Page Dakar 2026 (`/dakar-2026` et `/en/dakar-2026`)

#### État Actuel [OBSERVÉ]
- Page thématique dédiée aux Jeux Olympiques de la Jeunesse Dakar 2026 (première édition sur le continent africain).
- Version française et version anglaise présentes.

#### Attentes Clients & Standards de Marché [INFÉRÉ]
- Les délégations sportives, journalistes, sponsors et familles d'athlètes ont besoin de sécuriser dès aujourd'hui leurs hébergements et leur logistique de déplacement entre les trois pôles de compétition : Dakar, Diamniadio et Saly.
- Contrat d'affrètement de minibus avec chauffeurs dédiés anglophones/francophones.

#### Lacunes Constatées (Gaps) [OBSERVÉ]
- **Contenu trop conceptuel :** La page ne détaille pas la répartition géographique des épreuves (Stade Iba Mar Diop à Dakar, Dakar Arena et Stade Abdoulaye Wade à Diamniadio, sports nautiques à Saly).
- **Absence de formulaire de pré-réservation pour délégations :** Le formulaire existant est le formulaire de devis standard au lieu d'un formulaire dédié "Délégation / Presse / VIP".

#### Recommandations Concrètes (Prompt 04)
1. Ajouter une carte interactive ou infographie des 3 pôles olympiques (Dakar - Diamniadio - Saly) avec temps de trajet estimés via le TER et l'autoroute à péage.
2. Créer 3 packages dédiés : *Package Média & Presse*, *Package Famille Athlète*, *Package Partenaire B2B*.
3. Intégrer un compte à rebours dynamique vers le 31 octobre 2026.

---

### 2.8. Pages Institutionnelles : À Propos (`/about`), Contact (`/contact`) et Mentions Légales

#### État Actuel [OBSERVÉ]
- Page `/about` avec mission, vision, valeurs et équipe fondatrice.
- Page `/contact` avec coordonnées, formulaire de message et intégration WhatsApp.
- Page `/confidentialite` présente.

#### Lacunes Constatées (Gaps) [OBSERVÉ]
- **URL `/about` non francisée :** L'URL anglaise `/about` est utilisée alors que le reste du site est en français (risque de cannibalisation et incohérence d'arborescence, une redirection `/a-propos` vers `/about` ou vice-versa doit être clarifiée).
- **Absence de photo réelle des locaux :** Pas de photo de la façade ou de l'accueil de l'agence physique au Plateau, ce qui freine la confiance des clients institutionnels.
- **Numéro de licence touristique manquant :** Obligation légale et puissant réassurant pour une agence agréée par le Ministère du Tourisme sénégalais.

#### Recommandations Concrètes (Prompt 04)
1. Intégrer les photos professionnelles de l'équipe et de l'agence physique.
2. Inscrire en pied de page et sur la page Contact : Numéro NINEA, Registre de Commerce (RCCM), et Licence touristique d'exploitation.
3. Afficher la carte Google Maps interactive centrée sur l'agence.

---

## 3. Matrice de Priorisation des Refontes de Contenu

| Page | Effort Estimé | Impact Conversion | Priorité Prompt 04 |
| :--- | :---: | :---: | :---: |
| **Page d'Accueil (`/`)** | Moyen | **Majeur** | **P1** |
| **Transport AIBD (`/transport`)** | Faible | **Majeur** | **P1** |
| **Dakar 2026 (`/dakar-2026`)** | Moyen | Élevé | **P1** |
| **Hébergements (`/hebergement`)** | Élevé | Élevé | **P2** |
| **Excursions (`/excursions`)** | Moyen | Moyen | **P2** |
| **Assistance Voyage (`/assistance-voyage`)** | Faible | Moyen | **P2** |
| **Tourisme d'Affaires (`/tourisme-affaires`)** | Moyen | Élevé | **P2** |
| **À Propos & Contact (`/about`, `/contact`)** | Faible | Moyen | **P3** |
