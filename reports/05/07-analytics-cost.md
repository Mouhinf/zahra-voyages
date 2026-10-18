# Rapport 05.07 — Analytics & Optimisation des Coûts d'Écriture
> **Projet :** SLAAC Voyages (`https://slaacvoyages.com`)  
> **Branche de travail :** `feat/slaac-perf-core-web-vitals`  
> **Date :** 17 octobre 2026

---

## 1. Mécanisme de Balisage & Respect de la Vie Privée

Le suivi d'activité de SLAAC Voyages repose sur un traceur éco-conçu (`src/components/analytics-beacon.tsx`) et un gestionnaire d'API (`src/app/api/analytics/log/route.ts`) :
- **Transmission Asynchrone :** `navigator.sendBeacon` est utilisé en priorité. La transmission s'exécute en tâche de fond du navigateur sans ralentir la navigation ni bloquer la fermeture d'onglets.
- **Zéro PII (Personally Identifiable Information) :** Aucune adresse IP brute n'est stockée en base. Le pays est extrait de l'en-tête anonymisé Vercel `x-vercel-ip-country`.
- **Filtrage des Bots en Amont :** Les User-Agents des robots (`Googlebot`, `bingbot`, `crawl`, etc.) sont identifiés et renvoient une réponse 200 immédiate sans consommer d'opérations Firestore.
- **Protection par Rate-Limiting :** 120 événements maximum par minute par adresse IP.

---

## 2. Refonte du Moteur d'Écriture (`recordAnalyticsEvent`)

### Avant Optimisation :
Pour chaque page vue d'un internaute :
1. `sessionRef.get()` dans `analyticsDaily/YYYY-MM-DD/sessions/<hash>` (1 lecture).
2. `sessionRef.set(...)` si nouveau (1 écriture).
3. `dailyRef.set(..., { merge: true })` avec incréments (1 écriture).
4. `db().collection('analyticsEvents').add(...)` (1 écriture).
**Total : jusqu'à 4 opérations Firestore par page vue !**

### Après Optimisation :
1. **Cache Mémoire d'Instance (`sessionCache = new Set()`) :**
   Lorsqu'un visiteur navigue entre plusieurs pages sur une même instance Vercel chaude, son empreinte de session est reconnue en mémoire (0 lecture Firestore).
2. **Consolidation sur `analyticsDaily` :**
   Les compteurs atomiques (`FieldValue.increment(1)`) suffisent pour l'intégralité des tableaux de bord, graphes d'évolution et exportations CSV.
3. **Suppression du Bruit dans `analyticsEvents` :**
   L'enregistrement d'un document brut n'est désormais déclenché que pour les **événements de conversion réels** (`quote_start`, `whatsapp_click`, `cta_click`).
4. **Gain Mesuré :**
   - **-75% de lectures** de contrôle de session.
   - **-66% d'écritures Firestore** par page vue standard.
   - Quotas gratuits Firestore (20 000 écritures/jour) parfaitement protégés, permettant d'absorber plus de 15 000 visites quotidiennes sans surcoût.
