# Rapport d'Audit 12/16 : Référencement Local, Google Business Profile & E-Réputation
**Projet :** SLAAC Voyages  
**Branche :** release/v1.0.0-candidate  
**Date d'audit :** 18 Octobre 2026

---

## 1. Exactitude et Cohérence des Données NAP (Nom, Adresse, Téléphone)

Toutes les mentions de l'agence sur le site, les métadonnées et les annuaires ont été harmonisées :
- **Nom officiel :** SLAAC Voyages
- **Adresse physique :** Voie de Dégagement Nord (VDN), Dakar, Sénégal
- **Téléphone / WhatsApp :** +221 77 729 09 09
- **Email officiel :** contact@slaacvoyages.com
- **Horaires d'ouverture :** Lundi au Vendredi : 08h30 - 18h30 | Samedi : 09h00 - 14h00

---

## 2. Intégration Google Maps et Balisage Géolocalisé

- **Composant Google Maps :** Intégration iframe réactive et légère sur `/contact` et dans le footer.
- **Lien Itinéraire direct :** Lien vers l'itinéraire Google Maps permettant aux clients mobiles de lancer directement Google Maps / Waze.
- **Balisage Schema.org LocalBusiness :**
  - Latitude & Longitude précises déclarées dans les balises `geo`.
  - Zone desservie : `Dakar`, `Sénégal`, `Afrique de l'Ouest`.

---

## 3. Stratégie d'E-Réputation et Collecte des Avis Clients

- **Composant Avis Certifiés :** Affichage des retours d'expérience clients sur la page d'accueil avec note moyenne (4.9/5).
- **Lien de Collecte Post-Voyage :** Intégration automatique dans le template d'email de clôture de dossier CRM d'un lien direct pour déposer un avis Google.
- **Procédure de Déménagement :** Documentation préparée pour la mise à jour sans perte d'historique de la fiche Google Business Profile lors de transferts d'agence.
