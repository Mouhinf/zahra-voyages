# 14 — Mobile-First SEO & Ergonomie Mobile
**Projet :** SLAAC Voyages (`https://slaacvoyages.com`)  
**Phase :** Prompt 06/12 — SEO Technique Avancé & Indexation Google  
**Statut :** Conforme aux exigences Google Mobile-First Indexing

---

## 1. Principes du Mobile-First Indexing de Google

Google indexe et classe désormais les sites web en se basant quasi-exclusivement sur la version mobile explorée par **Googlebot Smartphone**.
Tout élément invisible, non cliquable ou absent de la version smartphone est considéré comme absent de l'index.

---

## 2. Garanties Techniques Implémentées

### 2.1. Équivalence Complète du Contenu (Desktop vs Mobile)
- **Métadonnées identiques :** Le viewport, les balises OpenGraph, Twitter Cards et descriptions sont uniformes quelle que soit la largeur d'écran.
- **Données Structurées intégrales :** Le script Schema.org (`TravelAgency`, `LocalBusiness`, `BreadcrumbList`) est rendu côté serveur (SSR) dans le DOM initial avant tout rendu CSS, garantissant une détection parfaite sur smartphone.
- **Navigation mobile exhaustive :** Le tiroir mobile (Sheet accessible par le bouton hamburger) contient l'ensemble des 7 services, la page événement Dakar 2026, l'accès À propos, le contact, ainsi que le commutateur de langue `FR | EN`.

### 2.2. Ergonomie & Cibles Tactiles (Touch Targets)
- Boutons d'action et liens de navigation dimensionnés à un minimum de **44x44 px** ou espacés adéquatement pour éviter les erreurs de clic tactile.
- Liens de contact direct (téléphone `tel:+221773129090` et WhatsApp `https://wa.me/221773129090`) facilement activables d'un seul pouce.
- Barre de conciergerie flottante optimisée pour ne pas masquer les contenus critiques ni bloquer le défilement.

### 2.3. Vitesse Mobile & Core Web Vitals
- Utilisation de polices Google optimisées (`next/font` avec swap automatique et `display: optional`).
- Aucun contenu ne déborde horizontalement (`overflow-x: hidden` / conteneurs fluides avec padding `px-4`).
- Poids de page mobile maintenu sous les 250 Ko de ressources critiques initiales.
