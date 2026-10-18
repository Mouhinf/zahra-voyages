# Audit Technique & Marketing de l'Existant — SLAAC Voyages
## Phase 10/12 : Acquisition Digitale, Tracking & Optimisation des Conversions

> **Date de l'audit :** 18 octobre 2026  
> **Plateforme :** Next.js 15 App Router, Firebase/Firestore, Vercel Edge  
> **Périmètre :** Analytics client-side, API de journalisation, schémas de devis et contacts, CRM Firestore, tags publicitaires et conformité vie privée.

---

## 1. Synthèse Exécutive de l'Audit

L'infrastructure actuelle de SLAAC Voyages dispose d'un socle d'analytique interne privacy-first robuste (agrégation journalière atomique dans `analyticsDaily`, zéro stockage d'IP brute, extraction du pays via l'en-tête Vercel `x-vercel-ip-country`, détection de robots). 

Cependant, sur le plan de l'acquisition publicitaire et du pilotage commercial multi-canal, plusieurs lacunes critiques ont été identifiées :
1. **Perte d'attribution en cours de session :** Les paramètres UTM (`utm_source`, `utm_campaign`, etc.) ne sont lus que depuis l'URL de la page active au moment du montage du composant. Dès qu'un visiteur navigue d'une landing page vers une autre page avant de remplir le formulaire, l'attribution publicitaire est définitivement perdue.
2. **Absence d'identifiants de clics publicitaires :** Les paramètres indispensables au tracking des conversions hors ligne (`gclid`, `gbraid`, `wbraid` pour Google Ads, `fbclid` pour Meta, `ttclid` pour TikTok) ne sont ni capturés ni stockés dans le CRM.
3. **Absence de traceurs publicitaires et de Consent Mode :** Aucun tag tiers (GA4, GTM, Meta Pixel, TikTok Pixel) n'est actif sur le site, ce qui garantit la conformité actuelle mais interdit tout remarketing ou optimisation automatique des enchères sans un système de consentement explicite conforme à la loi sénégalaise 2008-12 et au standard Google Consent Mode v2.
4. **Déconnexion entre l'enregistrement du lead et les événements de conversion :** L'événement `lead_created` n'est pas émis vers un bus d'événements client standardisé lors de la réception de la réponse 200 OK du serveur.

---

## 2. Inventaire des Mécanismes Analytiques Existants

| Composant / Fichier | Responsabilité | Déclenchement | Stockage | Données Personnelles | Statut Réel |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `src/components/analytics-beacon.tsx` | Envoi d'événements légers via `navigator.sendBeacon` | Changement de route (`pathname`) et clics | Aucun côté client | Aucune (Device, source, referrer, page) | **Actif (1st party)** |
| `src/app/api/analytics/log/route.ts` | Route API ingestion événementielle | Requête HTTP POST (sendBeacon / fetch) | Mémoire puis Firestore | Aucune (IP utilisée uniquement pour rate-limit mémoire et hash de session journalier) | **Actif (1st party)** |
| `src/lib/analytics.ts` | Logique d'agrégation journalière atomique | Appelée par l'API log | Firestore `analyticsDaily/YYYY-MM-DD` | Sel journalier éphémère pour sessions uniques | **Actif (1st party)** |
| `src/lib/admin-db.ts` | Requêtes d'affichage pour le tableau de bord | Lecture admin protégée | Firestore `analyticsDaily` | Aucune | **Actif** |
| `src/lib/schemas/quote-schema.ts` | Schéma Zod de validation des devis | Soumission formulaire devis | Aucun (validation) | Données contact (nom, tél, email) | **Actif** |
| `src/app/api/quotes/route.ts` | Création et déduplication du devis | Soumission devis | Firestore collection `quotes` | Données de contact + UTMs immédiats | **Actif** |
| `src/app/api/contact/route.ts` | Ingestion des demandes de contact | Soumission formulaire contact | Firestore collection `contacts` | Données de contact + UTMs immédiats | **Actif** |
| `src/lib/crm.ts` | Gestion du cycle de vie des prospects | Actions back-office admin | Firestore collections d'origine | Statuts CRM, notes, historique | **Actif** |
| Google Tag Manager (GTM) | Gestionnaire de balises | Inexistant | Aucun | Aucun | **Absent** |
| Google Analytics 4 (GA4) | Mesure audience & e-commerce | Inexistant | Aucun | Aucun | **Absent** |
| Google Ads Tag / Conversion | Remontée des conversions Google | Inexistant | Aucun | Aucun | **Absent** |
| Meta Pixel | Mesure de trafic et conversions Meta | Inexistant | Aucun | Aucun | **Absent** |
| Meta Conversions API (CAPI) | Remontée serveur des événements Meta | Inexistant | Aucun | Aucun | **Absent** |
| TikTok Pixel / Events API | Mesure TikTok Ads | Inexistant | Aucun | Aucun | **Absent** |
| Bandeau de Consentement | Recueil choix traceurs (Loi 2008-12) | Inexistant | Aucun | Aucun | **Absent** |

---

## 3. Matrice d'Évaluation des Risques

### 3.1. Risque d'Attribution Erronée (Dernier Clic Aveugle)
- **Constat :** Lorsqu'un internaute arrive via une campagne Google Ads Search sur `/transport` puis visite `/guides/arrivee-aeroport-aibd-dakar-transfert` avant d'ouvrir la modale de devis, le formulaire soumettait `source: 'modal-quote'` et `utmSource: undefined`.
- **Conséquence :** Les rapports commerciaux attribuent le lead à une visite directe ou interne, masquant la rentabilité réelle de la campagne Google Ads payante.
- **Action requise :** Mettre en place un utilitaire d'attribution persistant en `sessionStorage` capturant la source d'entrée (first-touch) et la dernière source payante (last-touch).

### 3.2. Risque de Double Comptage des Conversions
- **Constat :** L'action `quote_start` est déclenchée à l'ouverture de la modale. Si un utilisateur ouvre, ferme et rouvre la modale, plusieurs événements `quote_start` sont émis.
- **Règle impérative :** Seul le statut `lead_created`, validé par la réception du code HTTP 200 et d'une référence unique (`DV-20261018-XXXX`), doit être comptabilisé comme une conversion de demande commerciale. Aucun clic de bouton ou ouverture de modale ne doit être assimilé à un lead.

### 3.3. Risque de Fuite de Données Personnelles (PII) vers les Réseaux Publicitaires
- **Constat :** Les plateformes publicitaires (Meta, Google, TikTok) interdisent formellement l'envoi de données en clair ou non hachées sans consentement exprès, notamment les données sensibles (passeports, visas, antécédents médicaux).
- **Règle impérative :** Seuls les identifiants d'événement (`event_id`), la valeur monétaire éventuelle (`currency: 'XOF'`), et les données de contact strictement hachées en SHA-256 (email normalisé en minuscules et téléphone E.164 sans espaces) pourront être transmises, sous réserve exclusive du consentement `ad_user_data` accordé par l'utilisateur.

---

## 4. Plan de Remédiation Technique

1. **Création d'un module d'Attribution & Persistance (`src/lib/tracking/attribution.ts`)** :
   - Stockage en `sessionStorage` de l'ensemble des paramètres de campagne à la première visite : `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `gclid`, `gbraid`, `wbraid`, `fbclid`, `ttclid`, `referrer`, `landing_page`.
   - Restitution transparente au moment de la soumission de tout formulaire (`quotes`, `contacts`, landing pages).
2. **Taxonomie Normalisée des Événements (`src/lib/tracking/events.ts`)** :
   - Définition stricte des 10 étapes du funnel de conversion.
3. **Module de Consentement & Google Consent Mode v2 (`src/lib/tracking/consent.ts` & composant React)** :
   - Initialisation par défaut à `denied` pour tous les signaux publicitaires.
   - Interface de recueil de consentement non intrusive conforme CDP Sénégal & RGPD.
4. **Dispatcher d'Événements Hybride (`src/lib/tracking/provider.ts`)** :
   - Déclenchement simultané de la balise 1st-party interne et des pixels tiers autorisés avec déduplication garantie via `eventId`.
