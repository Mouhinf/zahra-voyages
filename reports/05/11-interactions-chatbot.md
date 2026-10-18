# Rapport 05.11 — Chatbot, Modales & Composants Interactifs
> **Projet :** SLAAC Voyages (`https://slaacvoyages.com`)  
> **Branche de travail :** `feat/slaac-perf-core-web-vitals`  
> **Date :** 18 octobre 2026

---

## 1. Chatbot Hybride & Stratégie de Chargement Différé

Le chatbot IA est un atout de conversion majeur pour orienter les visiteurs de SLAAC Voyages vers les forfaits adaptés. Il ne devait en aucun cas être sacrifié pour améliorer artificiellement les scores de performance :

- **Composant Découpleur (`src/components/chatbot-loader.tsx`) :**
  - Le bundle complet du chatbot (`@/components/chatbot`, ~45 kB) n'est **pas importé** lors du chargement initial de la page.
  - Le bouton déclencheur flottant (`MessageCircle`) est affiché immédiatement en SVG natif ultra-léger.
  - Au survol (`onMouseEnter`) ou à la prise de focus (`onFocus`), une pré-charge dynamique (`import('@/components/chatbot')`) s'exécute en tâche de fond.
  - Au clic, le chatbot s'ouvre instantanément sans latence perceptible pour l'utilisateur.
- **Canal WhatsApp Concierge :**
  - Le bouton WhatsApp officiel est couplé au traceur d'analytics (`trackAnalyticsEvent('whatsapp_click')`) via un import dynamique `import('@/components/analytics-beacon')` non-bloquant.

---

## 2. Modales de Devis Radix UI & Formulaires Haute Performance

- **`QuoteRequestButton` & `QuoteRequestModal` :**
  - Utilise `React.lazy` pour charger la modale Radix UI uniquement au clic d'ouverture.
  - Les champs pré-remplis (`defaultService`, `defaultDestination`, `source`) sont transmis dynamiquement.
  - La validation côté client repose sur Zod et React Hook Form, avec retour visuel immédiat en cas d'erreur de saisie.
  - Le cycle de soumission asynchrone sécurise la demande via `/api/quotes` et affiche l'écran de confirmation avec référence de dossier sous 200 ms.
