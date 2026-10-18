# 01 — Inventaire Éditorial Exhaustif & Diagnostic des Contenus
**Projet :** SLAAC Voyages (`https://slaacvoyages.com`)  
**Phase :** Prompt 07/12 — Domination Éditoriale SEO, Pages de Services, Destinations & Stratégie de Contenus  
**Date d'audit :** 18 Octobre 2026  
**Auteur :** Équipe de Direction SEO & Stratégie de Contenus  

---

## 1. Contexte & Méthodologie d'Audit

Cet inventaire cartographie l'ensemble des contenus actuellement en ligne sur la plateforme SLAAC Voyages (Next.js 15 App Router).  
L'analyse évalue chaque URL selon 8 critères d'exigence :
1. **Intention de recherche réelle** (Informationnelle, Navigationnelle, Transactionnelle, Commerciale).
2. **Alignement sémantique** (Mot-clé principal candidat vs contenu réel délivré).
3. **Degré de confiance et E-E-A-T** (Preuves d'expertise locale à Dakar, absence d'affirmations trompeuses, sourçage officiel).
4. **Qualité de l'UX Writing & Lisibilité** (Format aéré, tableaux, FAQ, titrage hiérarchique).
5. **Complétude des informations pratiques** (Horaires, points de rencontre, démarches réelles).
6. **Efficacité des parcours de conversion** (Contextualisation du bouton de devis et du contact WhatsApp).
7. **Cohérence du maillage interne** (Présence de Breadcrumbs, absence de pages orphelines).
8. **Statut décisionnel** (`CONSERVER`, `AMÉLIORER`, `REPOSITIONNER`, `FUSIONNER`, `DÉPUBLIER`).

---

## 2. Tableau Synthétique de l'Inventaire

| URL | Type | Intention Dominante | Qualité Actuelle | Décision Stratégique |
| :--- | :---: | :---: | :---: | :---: |
| `/` | Hub Racine | Commerciale / Nav | Haute (Post-P04/P05/P06) | **AMÉLIORER** (Ajout réassurance Omra & destinations) |
| `/transport` | Hub Métier | Transactionnelle | Haute (Prix fixes AIBD clairs) | **AMÉLIORER** (Précisions logistiques & axes routiers) |
| `/hebergement` | Hub Métier | Commerciale / Découverte | Bonne (Labels sécurité intégrés) | **AMÉLIORER** (Guide quartiers Dakar & séjours pro) |
| `/excursions` | Hub Métier | Inspiration / Transac | Bonne (Gorée, Bandia, Lac Rose) | **AMÉLIORER** (Détails pratiques chaloupe, durées) |
| `/tourisme-affaires` | Hub B2B | Commerciale B2B | Bonne (MICE, séminaires) | **AMÉLIORER** (Études de cas & format accueil délégations) |
| `/assistance-voyage` | Hub Service | Info / Transactionnelle | Moyenne (Contenu générique) | **AMÉLIORER** (Fiches ciblées Chine, Dubaï, Schengen) |
| `/voyages-croisieres`| Hub Métier | Commerciale | Moyenne (Catalogue dynamique) | **AMÉLIORER** (Focus séjours organisés & pèlerinages) |
| `/destinations` | Hub Inspi | Inspirationnelle | Moyenne (Galerie photo sans fond) | **AMÉLIORER** (Conseils formalités par pays & devis lié) |
| `/dakar-2026` | Événement | Événementielle | Très Haute (Disclaimer CIO clair) | **CONSERVER** (Veille calendaire régulière) |
| `/about` | Institutionnel | E-E-A-T / Réassurance | Bonne (Adresse Plateau & licences) | **AMÉLIORER** (Présentation de l'équipe et agréments) |
| `/contact` | Transactionnel| Contact Direct / Local | Très Haute (Formulaire & coordonnées) | **CONSERVER** |
| `/en` | International | Commerciale en_US | Bonne (Landing bilingue dédiée) | **AMÉLIORER** (Enrichissement piliers AIBD & Gorée) |
| `/services` | Navigation | Navigationnelle | Moyenne (Page d'aiguillage) | **AMÉLIORER** (Contenus descriptifs approfondis) |
| `/confidentialite` | Légal | Conformité CDP | Très Haute (Mentions légales) | **CONSERVER** |

---

## 3. Principaux Enseignements & Axes d'Amélioration

### 3.1. Absence de Contenus Spécialisés sur les Destinations d'Affaires & Religieuses
L'agence est fortement sollicitée pour des déplacements professionnels vers l'Asie (Chine, Thaïlande, Inde) et le Golfe (Dubaï, Qatar), ainsi que pour l'Omra depuis le Sénégal. Or, ces requêtes à très forte valeur ajoutée ne disposaient d'aucun contenu dédié sur le site. Les visiteurs atterrissaient sur la page `/assistance-voyage` trop généraliste.

### 3.2. Risque Juridique & Administratif sur l'Assistance Visa
L'ancien contenu de la page assistance mentionnait des formulations ambiguës pouvant laisser croire à une délivrance automatique.  
**Règle absolue adoptée :** Rappeler systématiquement que seule l'autorité consulaire ou l'État de destination est souverain pour l'attribution des visas. SLAAC Voyages fournit une assistance rigoureuse à la constitution du dossier, la vérification des pièces, la prise de rendez-vous et la souscription d'assurances homologuées.

### 3.3. Opportunité Majeure d'un Centre de Guides Pratiques (`/guides`)
Le site manquait d'un format éditorial pérenne pour capturer les requêtes informationnelles de haut de tunnel (« comment aller de AIBD à Saly », « que prévoir pour Gorée », « formalités voyage d'affaires Chine Dakar »). La création d'un hub de guides pratiques relié aux formulaires de devis comble ce déficit.
