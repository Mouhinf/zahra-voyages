# Rapport 05.13 — Instrumentation, Observabilité & Métriques Terrain
> **Projet :** SLAAC Voyages (`https://slaacvoyages.com`)  
> **Branche de travail :** `feat/slaac-perf-core-web-vitals`  
> **Date :** 18 octobre 2026

---

## 1. Suivi des Signaux Web Essentiels (Core Web Vitals Terrain)

Next.js 15 offre une intégration native pour la capture des indicateurs de performance réels (Real User Monitoring - RUM) :

- **Métriques Suivies :**
  - **LCP (Largest Contentful Paint) :** Temps d'affichage du composant visuel principal (image Hero ou fiche produit).
  - **CLS (Cumulative Layout Shift) :** Stabilité visuelle du rendu.
  - **INP (Interaction to Next Paint) :** Réactivité aux clics sur les formulaires, modales et menus déroulants.
  - **TTFB (Time to First Byte) :** Temps de réponse du réseau Edge Vercel.
  - **FCP (First Contentful Paint) :** Premier rendu de contenu utile.
- **Principe d'Observabilité Éco-Conçue :**
  Les métriques terrain ne doivent pas générer d'écritures individuelles en base de données à chaque navigation utilisateur (ce qui saturerait Firestore). Elles sont collectées via l'en-tête natif de monitoring Vercel Speed Insights ou transmises de façon groupée lors d'anomalies de seuil.

---

## 2. Métriques API & Surveillance des Erreurs

- **Journalisation Sécurisée sans PII :**
  Dans les Route Handlers (`/api/quotes`, `/api/contact`), toute erreur capture le type d'exception, le code de statut HTTP et le temps d'exécution.
  **Règle absolue :** Les noms, prénoms, numéros de téléphone et adresses emails des clients ne sont JAMAIS consignés dans les logs d'erreurs applicatifs.
- **Tableau de Bord Administratif Dédié :**
  La page `/admin/statistiques` fournit la synthèse quotidienne des sessions uniques, volumes de devis initiés et conversions WhatsApp, avec export CSV sécurisé pour le reporting de direction.
