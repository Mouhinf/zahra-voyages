# Rapport 05.12 — Analyse Prévisionnelle des Coûts Cloud
> **Projet :** SLAAC Voyages (`https://slaacvoyages.com`)  
> **Branche de travail :** `feat/slaac-perf-core-web-vitals`  
> **Date :** 18 octobre 2026

---

## 1. Postes de Coûts & Quotas Fournisseurs

L'infrastructure de SLAAC Voyages s'appuie sur trois piliers cloud :
1. **Google Cloud / Firebase Firestore :**
   - Quotas gratuits (Plan Spark) : 50 000 lectures / jour, 20 000 écritures / jour, 1 Gio de stockage.
   - Tarification au-delà : ~0.06 $ par 100 000 lectures, ~0.18 $ par 100 000 écritures.
2. **Cloudinary :**
   - Quotas gratuits : 25 crédits / mois (~25 000 transformations ou 25 Gio de bande passante).
   - Coût au-delà : Plan Plus (~89 $/mois) ou add-ons de crédits.
3. **Vercel (Hébergement Serverless & Edge) :**
   - Quotas Hobby : 100 Gio de bande passante, 100 heures d'exécution Serverless, 1 000 images optimisées.
   - Plan Pro (recommandé en production commerciale active) : 20 $/siège/mois, 1 To bande passante, 1 000 heures de calcul, 5 000 images optimisées.

---

## 2. Modélisation Prévisionnelle selon 3 Scénarios de Trafic

Les projections ci-dessous reposent sur les consommations unitaires mesurées post-optimisation :
- **Page vue :** 0 lecture Firestore publique (cache ISR 300 s), 1 incrément atomique dans `analyticsDaily`.
- **Demande de devis soumise :** 2 écritures Firestore (devis + outbox).
- **Consultation de fiche produit :** 1 lecture Firestore (mise en cache 300 s).

### Scénario A : Trafic de Démarrage / Basse Saison (500 visites / jour · 15 000 / mois)
- **Lectures Firestore :** ~500 / jour (1% du quota gratuit).
- **Écritures Firestore :** ~600 / jour (3% du quota gratuit).
- **Bande passante Cloudinary :** ~3.5 Gio / mois (14% du quota gratuit).
- **Bande passante Vercel :** ~8 Gio / mois.
- **Coût Cloud Estimé :** **0,00 $ / mois** (100% couvert par les tiers gratuits).

### Scénario B : Trafic Croisière & Campagnes Marketing (3 000 visites / jour · 90 000 / mois)
- **Lectures Firestore :** ~2 500 / jour (5% du quota gratuit).
- **Écritures Firestore :** ~3 800 / jour (19% du quota gratuit).
- **Bande passante Cloudinary :** ~18 Gio / mois (72% du quota gratuit).
- **Vercel :** Plan Pro conseillé (20 $/mois) pour la garantie de SLA et la suppression des limites Hobby.
- **Coût Cloud Estimé :** **20,00 $ / mois** (uniquement la licence Vercel Pro).

### Scénario C : Pic Événementiel JOJ Dakar 2026 (25 000 visites / jour · 750 000 / mois)
- **Lectures Firestore :** ~18 000 / jour (36% du quota gratuit).
- **Écritures Firestore :** ~28 000 / jour (+8 000 au-delà du gratuit = 0.014 $/jour = ~0.43 $/mois).
- **Transformations & CDN Cloudinary :** Dépassement prévisible vers le plan Plus ou crédit d'appoint (~89 $/mois).
- **Vercel Pro :** Consommation de ~150 Gio de bande passante (inclus dans le forfait 1 To).
- **Coût Cloud Estimé :** **~110 $ / mois**.

---

## 3. Mesures Préventives & Seuils d'Alerte

1. **Alerte Quota Firestore (Console GCP) :** Seuil de notification budgétaire fixé à 10 $/mois.
2. **Alerte Cloudinary :** Seuil d'alerte email à 80% des crédits mensuels.
3. **Mise en cache ISR :** En cas d'afflux soudain de trafic (buzz, campagne télévisée, JO 2026), le cache ISR protège le serveur : 100 000 requêtes sur `/transport` ne génèrent que 1 lecture Firestore toutes les 5 minutes !
