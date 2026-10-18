# 16 — Guide de Passation & Bonnes Pratiques Éditoriales SEO
**Projet :** SLAAC Voyages (`https://slaacvoyages.com`)  
**Phase :** Prompt 06/12 — SEO Technique Avancé & Indexation Google  
**Destinataires :** Équipe Marketing, Content Managers & Administrateurs SLAAC Voyages

---

## 1. Rédaction des Nouvelles Offres dans l'Espace Admin

Lors de la saisie d'un nouvel hébergement, circuit, excursion ou offre de transport dans le panneau d'administration, respecter la checklist suivante :

### 1.1. Titre de l'Offre (`titre`)
- **Longueur recommandée :** Entre 40 et 60 caractères.
- **Règle :** Inclure systématiquement le type de prestation et le lieu (ex: *« Appartement Vue Mer Les Almadies »*, *« Excursion Guidée Réserve de Bandia »*).
- **À éviter :** Les titres vagues comme *« Offre Spéciale »* ou *« Pack Confort »*.

### 1.2. Description Courte (`description`)
- **Longueur recommandée :** 140 à 155 caractères (servira de `meta description` par défaut).
- **Règle :** Formuler une promesse claire avec un appel à l'action implicite (ex: *« Réservez votre villa meublée avec piscine et groupe électrogène à Saly. Service conciergerie SLAAC Voyages inclus. Devis sous 24 h. »*).

### 1.3. Description Détaillée (`descriptionComplete`)
- **Structure :** 300 à 600 mots organisés en paragraphes clairs.
- **Mots-clés naturels :** Mentionner les commodités recherchées à Dakar (climatisation, gardiennage 24h, wifi fibre optique, parking sécurisé, groupe électrogène anti-coupure).

### 1.4. Images & Attributs Alt
- Téléverser des photographies réelles haute définition au ratio 16:9 ou 4:3.
- Le système Cloudinary s'occupe de la compression et de la conversion automatique en WebP.

---

## 2. Gestion des Statuts & Évitement des Pages Zéro

- **Brouillon (`brouillon` / `draft`) :** Tant qu'une offre n'a pas de photo ou de tarif, laissez-la en statut brouillon. Le sitemap dynamique l'exclura automatiquement pour ne pas faire indexer de contenu incomplet par Google.
- **Offres Épuisées ou Temporaires :** Plutôt que de supprimer définitivement une offre historique qui a des liens, désactivez la réservation tout en maintenant une offre de substitution ou un lien vers la catégorie parent.
