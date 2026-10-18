# Stratégie Éditoriale du Centre de Ressources & Guides Pratiques
## SLAAC Voyages | Hub de Conseils et d'Autorité Thématique (`/guides`)

---

### 1. Objectifs Stratégiques du Centre de Guides

Le centre de ressources éditoriales (`/guides`) répond à un triple objectif d'acquisition et de réputation :
1. **Capter le trafic informationnel « Top-of-Funnel » :** Attirer les voyageurs en phase de recherche préliminaire (formalités aéroportuaires, choix de quartier à Dakar, préparation de pèlerinage ou visa).
2. **Établir les signaux E-E-A-T (Expérience, Expertise, Autorité, Fiabilité) :** Démontrer une connaissance intime et vérifiée du terrain sénégalais et des réglementations internationales.
3. **Alimenter le maillage interne contextuel (Topic Clusters) :** Rediriger organiquement l'internaute vers nos offres commerciales payantes (transferts, hébergements, devis Omra, assistance visa) grâce à des encarts de conversion natifs.

---

### 2. Les 6 Dossiers Inauguraux Déployés

| Slug | Titre & Thématique | Catégorie | Service Lié |
|---|---|---|---|
| `arrivee-aeroport-aibd-dakar-transfert` | Guide complet pour réussir son arrivée à l'Aéroport International Blaise Diagne (AIBD) | Logistique AIBD | `transport` |
| `visiter-ile-de-goree-conseils-chaloupe` | Visiter l'île de Gorée : Chaloupe, Maison des Esclaves et conseils pratiques | Patrimoine & Culture | `excursions` |
| `ou-loger-a-dakar-quartiers-residences` | Où loger à Dakar ? Comparatif des quartiers : Plateau, Almadies, Ngor et Mermoz | Hébergement | `hebergement` |
| `preparation-omra-depuis-le-senegal` | Préparer sa Omra depuis le Sénégal : Formalités, santé et organisation logistique | Pèlerinages | `tourisme-affaires` |
| `voyage-affaires-chine-depuis-dakar` | Déplacements professionnels et sourcing commercial en Chine depuis Dakar | Affaires B2B | `tourisme-affaires` |
| `assurance-voyage-internationale-dakar` | Pourquoi souscrire une assurance voyage internationale avant votre départ de Dakar ? | Formalités & Visas | `assistance-visa` |

---

### 3. Anatomie Technique et Sémantique d'une Page Guide

Chaque guide pratique suit un template standardisé d'excellence :
- **En-tête Hero éditorialisé :** Fil d'Ariane sémantique (`BreadcrumbsList`), badge thématique, temps de lecture, date de publication et date de dernière vérification.
- **Cartouche Auteur & Autorité E-E-A-T :** Nom du rédacteur expert, fonction au sein de l'agence (ex. Conseiller Mobilité, Responsable Réceptif), localisation physique (Dakar Plateau) et badge de conformité déontologique.
- **Corps structuré en H2/H3 :** Informations factuelles, conseils pratiques, points de vigilance et listes de contrôle.
- **FAQ Pratique intégrée :** Questions fréquentes encodées en microdonnées JSON-LD Schema.org `FAQPage`.
- **Sources Officielles et Références :** Tableau des sources institutionnelles consultées (AIBD, Police de l'Air, Ministère saoudien du Hadj, CVASC Chine, CIMA).
- **Sidebar de Conversion Contextuelle :** Encart mettant en valeur le service SLAAC Voyages correspondant avec bouton `QuoteRequestButton` pré-segmenté (`defaultService` et `defaultDestination`).
