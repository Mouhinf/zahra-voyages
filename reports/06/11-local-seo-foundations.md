# 11 — Fondations SEO Local & Visibilité Géographique Dakar
**Projet :** SLAAC Voyages (`https://slaacvoyages.com`)  
**Phase :** Prompt 06/12 — SEO Technique Avancé & Indexation Google  
**Statut :** Cohérence NAP (Nom, Adresse, Téléphone) & Schéma LocalBusiness validés

---

## 1. Contexte & Importance du SEO Local

Pour une agence de voyages réceptive et conciergerie à Dakar, le SEO local est un déterminant fondamental pour capter les requêtes d'intention forte (« agence de voyage dakar », « navette aéroport aibd dakar », « billetterie plateau dakar »).

La cohérence absolue du **NAP** (*Name, Address, Phone*) entre le code du site, Google Business Profile (ex-Google My Business) et les annuaires professionnels est la condition sine qua non pour ranker dans le *Local Pack* (Top 3 Google Maps).

---

## 2. Données Locales Certifiées SLAAC Voyages

Les coordonnées officielles suivantes sont désormais strictement alignées sur l'ensemble du site :

| Attribut | Valeur Officielle Certifiée | Emplacement Code |
| :--- | :--- | :--- |
| **Nom Commercial** | SLAAC Voyages | `SITE_NAME`, `metadata.title` |
| **Raison Sociale** | SLAAC Voyages SARL | `legalName` dans JSON-LD |
| **Adresse Physique** | Rue Mouhamed 5, Immeuble Djolof Chicken, 3e étage | Footer, Contact, JSON-LD |
| **Ville & Code Postal**| Dakar, 10200, Sénégal | PostalAddress |
| **Téléphone International** | `+221 77 312 90 90` (`+221773129090`) | Header, Footer, JSON-LD, WhatsApp |
| **Coordonnées GPS** | `14.6713` N, `-17.4334` W | GeoCoordinates dans `seo-schema.ts` |
| **Horaires d'Ouverture** | Lun-Ven : 08h30-18h30 / Sam : 09h00-15h00 | OpeningHoursSpecification |

---

## 3. Déclinaisons Opérationnelles

1. **Page `/contact` :** Affiche la carte physique, l'adresse détaillée avec repères urbains à Dakar Plateau, les numéros directs et le formulaire de prise de rendez-vous.
2. **Schéma LocalBusiness :** Embarque la zone géographique d'intervention (`areaServed`), les devises acceptées (`XOF, EUR, USD`) et les modes de règlement locaux (`Wave, Orange Money, Carte Bancaire, Espèces`).
3. **Pied de page permanent :** Présent sur 100% des pages pour ancrer le signal géographique auprès du moteur de recherche.
