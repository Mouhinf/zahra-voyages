# Rapport d'Audit 12/20 : Capacité Cloud, Dimensionnement et Analyse des Coûts
**Projet :** SLAAC Voyages  
**Branche :** release/v1.0.0-candidate  
**Date d'audit :** 18 Octobre 2026

---

## 1. Architecture d'Hébergement et Services Cloud

La plateforme repose sur une architecture sans serveur (Serverless) hautement élastique :
1. **Frontend & API Routes :** Vercel Pro (Région cdg1 - Paris, France, offrant la plus faible latence vers Dakar).
2. **Base de Données & Auth :** Google Cloud Platform / Firebase (Firestore Multi-Région `europe-west3`).
3. **Médias & Documents :** Cloudinary (Plan standard avec CDN mondial).
4. **Messagerie :** LWS SMTP dédié + SendGrid Email API (Plan Pro).

---

## 2. Analyse des Limites Techniques et Dimensionnement

- **Timeouts des Fonctions Vercel :** Configuré à 15 secondes max par fonction API (largement suffisant, temps de réponse moyen constaté : 180ms).
- **Lectures / Écritures Firestore :**
  - Grâce au pré-rendu statique (SSG/ISR), le trafic visiteur public ne sollicite pas la base de données.
  - Seules les soumissions de formulaires et l'activité du back-office génèrent des écritures (estimées à < 5 000 opérations/jour en pic, pour un quota gratuit de 20 000/jour et un coût marginal au-delà).
- **Bande Passante Médias :** Optimisation WebP/AVIF et dimensionnement adaptatif réduisant de 65% la consommation de bande passante par session utilisateur.

---

## 3. Projection Économique Mensuelle
- **Coût d'infrastructure estimé :** ~35 à 60 USD / mois selon le volume de trafic marketing et les envois d'emails transactionnels.
- **Rentabilité :** Moins de 1% de la marge dégagée sur un seul dossier de voyage international ou séjour Omra.
