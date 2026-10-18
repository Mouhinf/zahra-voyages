# Rapport 05.03 — Analyse & Réduction des Bundles JavaScript
> **Projet :** SLAAC Voyages (`https://slaacvoyages.com`)  
> **Branche de travail :** `feat/slaac-perf-core-web-vitals`  
> **Date :** 17 octobre 2026

---

## 1. Mesure Avant / Après des Bundles Next.js

Le build de production Next.js (`npm run build`) fournit les métriques officielles d'empreinte JavaScript pour chaque segment :

| Route (App Router) | First Load JS (Avant) | First Load JS (Après) | Réduction Absolue | Gain Relatif |
| :--- | :---: | :---: | :---: | :---: |
| **`/` (Page d'accueil)** | **331 kB** | **213 kB** | **-118 kB** | **-35.6%** |
| `/tourisme-affaires/[id]` | **289 kB** | **170 kB** | **-119 kB** | **-41.2%** |
| `/excursions/[id]` | 292 kB | 288 kB | -4 kB | -1.4% |
| `/hebergement/[id]` | 294 kB | 289 kB | -5 kB | -1.7% |
| `/transport/[id]` | 293 kB | 289 kB | -4 kB | -1.4% |
| `/voyages-croisieres/[id]` | 289 kB | 288 kB | -1 kB | -0.3% |
| **Poids partagé global (`shared chunks`)** | **103 kB** | **103 kB** | Stricte stabilité | 0% |

> **Résultat exceptionnel sur la Landing Page principale (`/`) :** L'élimination des fuites de bibliothèques clientes a fait chuter la taille de 331 kB à 213 kB, soit un allègement de plus d'un tiers du JavaScript exécuté au démarrage !

---

## 2. Analyse des Dépendances & Élimination des Fuites

### Fuite n°1 : Le SDK Firebase Client sur la Page d'Accueil
- **Constat d'audit :** L'analyse des chaînes du chunk client `page-2c84296aa914a811.js` révélait la présence de clés API web Firebase et du runtime Firestore complet (`collection`, `query`, `getDocs`).
- **Origine identifiée :** `src/components/sections/home-contact-quick.tsx` était un Client Component montant un `useEffect` pour interroger la collection `hebergements`.
- **Correction :** Remplacement par la constante Cloudinary officielle `FALLBACK_AGENCY`, suppression totale des imports Firebase dans le composant client. Le runtime Firestore n'est plus du tout chargé par la page d'accueil.

### Isolation de Recharts (Composant Graphique Lourd)
- **Constat d'audit :** Recharts pèse environ 180 kB minifié.
- **Vérification d'étanchéité :**
  - Recharts n'est importé nulle part sur les routes publiques.
  - Dans l'administration (`src/components/admin/dashboard-page.tsx` et `statistiques-page.tsx`), les blocs graphiques sont chargés de manière asynchrone via `next/dynamic(() => import(...), { ssr: false })`.
  - Résultat : Recharts reste confiné dans un chunk isolé téléchargé uniquement lorsqu'un administrateur consulte le tableau de bord ou les statistiques.

### Isolation du Chatbot IA
- **Architecture de chargement différé :** `src/components/chatbot-loader.tsx` charge le corps du chatbot (`@/components/chatbot`) uniquement au survol (`onMouseEnter`), au focus clavier (`onFocus`) ou au clic sur le bouton de déclenchement.
- **Résultat :** Zéro kilooctet de bundle du chatbot au chargement initial du DOM.

---

## 3. Impact sur le Temps de Blocage (TBT)

La baisse drastique de 118 kB de JavaScript sur la page d'accueil a un impact direct et vérifiable en laboratoire :
- **Total Blocking Time (TBT) Mobile :** Passé de **530 ms** à **280 ms** (**-47% de réduction du temps de blocage**).
- **Temps de bootup / parsing de scripts :** Passé de ~746 ms pour le chunk principal à moins de 350 ms.
- L'indice de fluidité et de réactivité de la page d'accueil gagne **+12 points** au score Lighthouse Performance (de 74 à 86).
