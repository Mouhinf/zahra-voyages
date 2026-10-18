# Stratégie Éditoriale Internationale Bilingue (Français & Anglais)
## SLAAC Voyages | Visibilité Mondiale, Diaspora et Voyageurs Internationaux

---

### 1. Pourquoi une Stratégie Bilingue à Dakar ?

Bien que le français soit la langue officielle et commerciale prédominante au Sénégal, le positionnement de Dakar comme métropole diplomatique, carrefour d'affaires ouest-africain et hôte d'événements mondiaux impose une présence éditoriale anglophone soignée :
1. **Délégations internationales et ONG :** De nombreux diplomates, consultants internationaux et cadres de banques de développement (BAD, ONU, Banque Mondiale) utilisent l'anglais comme langue de travail.
2. **Diaspora sénégalaise anglophone :** Importante communauté résidant aux États-Unis, au Royaume-Uni et au Canada, habituée aux interfaces en anglais.
3. **Touristes internationaux indépendants :** Voyageurs venant d'Europe du Nord, d'Amérique ou d'Asie recherchant des informations fiables sur le Sénégal en langue anglaise.

---

### 2. Implémentation Technique Bilingue

- **Balises hreflang :** Déclaration systématique dans le header HTML racine :
  - `fr-SN` / `fr` : `https://slaacvoyages.com` (langue par défaut).
  - `en-US` / `en` : `https://slaacvoyages.com/en`.
  - `x-default` : `https://slaacvoyages.com`.
- **Sélecteur de langue :** Intégré dans le Header et le Footer, crawlable sans JavaScript par les robots des moteurs de recherche.
- **Accusés de réception d'emails transactionnels :** Traduits intégralement en anglais lorsque la demande émane de la version anglophone du site (testé avec succès dans la suite de tests P01).

---

### 3. Feuille de Route de Traduction des Contenus Clés

1. **Priorité 1 : Hubs d'accueil et réceptif :**
   - Page d'atterrissage `/dakar-2026` (Jeux Olympiques de la Jeunesse).
   - Guide d'arrivée et transferts à l'aéroport AIBD (`AIBD Airport Transfer Guide`).
   - Visite de l'île de Gorée (`Gorée Island Practical Guide`).
2. **Priorité 2 : Services Corporate B2B :**
   - Guide de voyage d'affaires à Dakar pour entreprises étrangères.
   - Formalités de visa d'affaires et de séjour au Sénégal.
