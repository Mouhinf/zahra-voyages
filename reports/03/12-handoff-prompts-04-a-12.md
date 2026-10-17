# Cahier de Transmission Technique (Handoff Prompts 04 à 12) — SLAAC Voyages
> **Objectif :** Traduire les conclusions du benchmark concurrentiel et du positionnement stratégique en spécifications opérationnelles et architecturales précises pour les phases de développement 04/12 à 12/12.  
> **Date :** 17 Octobre 2026  
> **Auteur :** Architecte Logiciel Senior & Lead DevOps  

---

## 1. Vue d'Ensemble de l'Enchaînement Méthodologique

Le benchmark et l'intelligence de marché réalisés en Phase 03 constituent le socle de décision pour les 9 phases suivantes. Chaque prompt subséquent hérite d'objectifs quantifiables, d'exigences techniques et de livrables précis.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 ALIGNEMENT DE LA FEUILLE DE ROUTE TECHNIQUE                 │
├───────────────┬─────────────────────────────┬───────────────────────────────┤
│ PROMPT        │ INTITULÉ TECHNIQUE          │ INPUT MAJEUR TRANSMIS PAR 03  │
├───────────────┼─────────────────────────────┼───────────────────────────────┤
│ Prompt 04/12  │ Refonte UX/UI & Design Sys  │ Brief créatif, Palette & Gaps │
│ Prompt 05/12  │ Billetterie Vols & Devis    │ Grille personas B2C / Diaspora│
│ Prompt 06/12  │ Plateforme Dakar 2026 (JOJ) │ 4 Packages & carte des pôles  │
│ Prompt 07/12  │ CMS Hébergements & Résidences│ Critères Fibre/Générateur     │
│ Prompt 08/12  │ SEO Technique & Schema.org  │ Matrice 7 clusters & JSON-LD  │
│ Prompt 09/12  │ WhatsApp Business API       │ Protocole conversationnel     │
│ Prompt 10/12  │ Portail B2B & MICE          │ Cahier des charges corporate  │
│ Prompt 11/12  │ Passerelles de Paiement     │ Paiements Wave/OM/CB & devises│
│ Prompt 12/12  │ Observabilité & PRA         │ Métriques KPI & monitoring    │
└───────────────┴─────────────────────────────┴───────────────────────────────┘
```

---

## 2. Spécifications Détaillées par Prompt

---

### Prompt 04/12 : Refonte UX/UI, Design System & Conversion des Interfaces

#### Intrants Reçus du Prompt 03
- Brief de direction créative (`reports/03/06-creative-direction-brief.md`).
- Audit des lacunes de contenu page par page (`reports/03/04-content-gap-analysis.md`).
- Palette officielle Tailwind (`slaac-navy-900`, `slaac-gold-500`, `slaac-green-500`).

#### Exigences Techniques & Architecturales
1. **Composants d'Ergonomie Mobile :**
   - Implémenter le composant `<FloatingConciergeBar />` (WhatsApp + Devis) fixé en bas d'écran sur mobile.
   - Refactorer les cartes de services avec badges réassurants et prix d'appel indicatifs.
2. **Refonte des Pages Piliers :**
   - `/transport` : Intégration de la grille forfaitaire claire (AIBD 30 000 FCFA, Saly 35 000 FCFA).
   - `/hebergement` : Ajout des badges `Groupe Électrogène 24/7` et `Fibre Optique Vérifiée`.
   - `/about` : Redirection permanente propre vers `/a-propos` et intégration de la galerie d'équipe au bureau du Plateau.
3. **Optimisation des Images (Cloudinary) :**
   - Remplacer les photos génériques déconnectées par des visuels authentiques de Dakar au format WebP/AVIF avec `sizes` et `srcset` adaptés.

---

### Prompt 05/12 : Module Billetterie Aérienne & Moteur de Cotation Express

#### Intrants Reçus du Prompt 03
- Segments Commerçants Outgoing (Dubaï/Chine) et Diaspora (Europe/Amériques) issus de `reports/03/02-personas-et-segments.md`.

#### Exigences Techniques & Architecturales
1. **Formulaire de Cotation Aérienne Multidestination :**
   - Champs : Ville de départ (Dakar DSS par défaut), Ville d'arrivée, Dates flexibles (±3 jours), Classe (Économique / Affaires), Nombre de bagages souhaité.
2. **Gestion des Billets & PNR dans le CRM :**
   - Champ Firestore `pnrReference` et `ticketIssuedAt` dans la collection `quotes`.
   - Modèle d'alerte SMS/WhatsApp en cas de modification d'horaire de vol par la compagnie aérienne.

---

### Prompt 06/12 : Expérience Dakar 2026 & Réservations Événementielles (JOJ)

#### Intrants Reçus du Prompt 03
- Stratégie opérationnelle et commerciale Dakar 2026 (`reports/03/08-opportunite-dakar-2026.md`).

#### Exigences Techniques & Architecturales
1. **Page Bilingue Interactive (`/dakar-2026` et `/en/dakar-2026`) :**
   - Composant interactif affichant les trois pôles de compétition (Dakar, Diamniadio, Saly) avec estimation des temps de parcours via l'autoroute et le TER.
   - Présentation des 4 packages d'hospitalité (Délégations, Médias, VIP, Familles).
2. **Formulaire Dédié aux Comités Olympiques & Fédérations :**
   - Capture de la taille de délégation, volume de bagages, flotte souhaitée (minibus, SUV) et besoins d'hébergement groupé.
   - Priorisation automatique dans le CRM avec statut `urgent`.

---

### Prompt 07/12 : CMS Hébergements, Résidences Meublées & Disponibilités

#### Intrants Reçus du Prompt 03
- Attentes prioritaires des voyageurs d'affaires et de la diaspora (sécurité, autonomie énergétique et connexion haut débit).

#### Exigences Techniques & Architecturales
1. **Modèle de Données Firestore `properties` :**
   - Schéma Zod pour valider les caractéristiques : `title`, `neighborhood`, `pricePerNight`, `pricePerMonth`, `hasGenerator`, `hasWaterTank`, `wifiSpeedMbps`, `images`, `isVerified`.
2. **Interface d'Administration CMS :**
   - Création, édition et suspension d'annonces de logements dans `/admin/properties` avec upload sécurisé sur Cloudinary.
3. **Bouton d'Action Immédiate :**
   - Intégration sur chaque fiche du bouton "Demander une visite vidéo WhatsApp" pré-remplissant la référence du logement.

---

### Prompt 08/12 : SEO Technique International, Schema.org & Performance Web Vitals

#### Intrants Reçus du Prompt 03
- Matrice des 7 clusters de mots-clés (`reports/03/03-opportunites-seo.md`).
- Spécifications du référencement local Google Maps (`reports/03/07-strategie-seo-local.md`).

#### Exigences Techniques & Architecturales
1. **Composant Universel JSON-LD :**
   - Injection dynamique des schémas `TravelAgency`, `TouristTrip`, `LodgingBusiness`, `FAQPage` et `BreadcrumbList`.
2. **Gestion Multilingue `hreflang` :**
   - Configuration stricte des balises d'alternance linguistique FR / EN.
3. **Audit Core Web Vitals :**
   - Garantie d'un score Performance Google PageSpeed Mobile > 90 sur toutes les pages phares.

---

### Prompt 09/12 : Automatisation WhatsApp Business API & Chatbot Hybride

#### Intrants Reçus du Prompt 03
- Stratégie conversationnelle et réactivité commerciale (< 1h) définies dans les rapports 09 et 11.

#### Exigences Techniques & Architecturales
1. **Connecteur API WhatsApp :**
   - Intégration via Meta WhatsApp Cloud API ou fournisseur agréé (Twilio / MessageBird).
2. **Accusé de Réception Instantané :**
   - Envoi automatique d'un message WhatsApp de confirmation au client dès soumission d'un devis sur le site avec son numéro de référence `DV-XXXX`.
3. **Passerelle Hybride Bot / Humain :**
   - Qualification des demandes standard par un arbre de décision interactif, avec bascule immédiate vers un concierge humain dès qu'une personnalisation est requise.

---

### Prompt 10/12 : Espace Partenaires B2B, Facturation & Tourisme d'Affaires (MICE)

#### Intrants Reçus du Prompt 03
- Exigences corporate des multinationales et PME (facturation certifiée, TVA, BRS, convention-cadre).

#### Exigences Techniques & Architecturales
1. **Authentification & Gestion des Rôles B2B :**
   - Rôles `corporate_client` et `partner_driver` dans Firebase Auth & Firestore.
2. **Génération de Devis et Factures PDF Conformes :**
   - Module Node.js de génération de PDF téléchargeables respectant la législation fiscale sénégalaise (NINEA, RCCM, TVA 18%, mention BRS le cas échéant).
3. **Tableau de Bord Dépenses Entreprise :**
   - Historique des trajets commandés par les collaborateurs de l'entreprise cliente.

---

### Prompt 11/12 : Système de Paiements Sécurisés (Passerelles Locales & Internationales)

#### Intrants Reçus du Prompt 03
- Nécessité de combiner paiements mobiles ouest-africains (Wave, Orange Money) et cartes bancaires internationales (Stripe).

#### Exigences Techniques & Architecturales
1. **Agrégateur de Paiement Multi-Moyens :**
   - Intégration de passerelles conformes (ex: PayTech, InTouch, TouchPay ou Stripe pour les devises étrangères).
2. **Génération de Liens de Paiement (Payment Links) :**
   - Possibilité pour le commercial SLAAC de générer depuis le CRM un lien de paiement sécurisé pour le versement d'un acompte de 30% ou du solde d'un devis.
3. **Idempotence & Webhooks Sécurisés :**
   - Traitement robuste des notifications de paiement réussies avec mise à jour immédiate du statut de la commande en `payee` et déclenchement du bon de réservation (voucher).

---

### Prompt 12/12 : Surveillance Continue, Observabilité, Sécurité & Plan de Reprise d'Activité (PRA)

#### Intrants Reçus du Prompt 03
- Seuils d'alerte, SLA commerciaux et indicateurs d'observabilité de `reports/03/11-kpi-et-mesure.md`.

#### Exigences Techniques & Architecturales
1. **Surveillance en Temps Réel (Monitoring & Alerts) :**
   - Mise en place d'un monitoring d'uptime (BetterStack ou UptimeRobot) vérifiant l'accessibilité de `https://slaacvoyages.com` toutes les 60 secondes.
   - Intégration de Sentry pour la capture des exceptions côté client et serveur Next.js.
2. **Sauvegardes Automatisées Firestore & Audit de Sécurité :**
   - Export quotidien programmé des collections Firestore vers un bucket sécurisé Google Cloud Storage.
   - Validation finale des règles de sécurité Firestore et vérification de la stricte conformité RGPD / CDP sénégalaise sur les données personnelles.
