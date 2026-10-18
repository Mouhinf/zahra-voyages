# Rapport 05 : Tableau de Bord Exécutif et Pilotage de Direction
## SLAAC Voyages | Prompt 11/12

### 1. Objectifs Stratégiques
Offrir à la direction générale une vision panoramique, temps réel et consolidée de la santé commerciale, opérationnelle et marketing de SLAAC Voyages sans extrapolation ni données fictives.

### 2. Indicateurs Clés de Performance (KPIs Réels)
Le tableau de bord (`/admin`) consolide les données issues directement des collections Firestore réelles :
- **KPIs Commerciaux** :
  - Volume de leads entrants (par canal, par période).
  - Taux de transformation des prospects en devis émis.
  - Taux de concrétisation devis $\rightarrow$ dossiers confirmés.
  - Chiffre d'affaires total engagé et facturé en FCFA.
- **KPIs Opérationnels** :
  - Nombre de dossiers de voyage actifs par étape du cycle de vie (`devis_en_cours`, `attente_paiement`, `confirme`, `en_cours_traitement`, `pret_au_depart`, `en_voyage`).
  - Nombre de départs prévus dans les 7 prochains jours.
  - Tâches collaborateurs en retard ou prioritaires.
- **KPIs Marketing & Attribution** :
  - Répartition des prospects par source d'acquisition (Google Ads, Meta Ads, TikTok, Organique SEO, Référencement Direct, WhatsApp).
  - Performance des landing pages dédiées (Omra, AIBD, Chine, Dubaï).
- **KPIs Système** :
  - Taux de succès des notifications emails (`email_outbox`).
  - Nombre d'erreurs d'envoi nécessitant un retry.

### 3. Filtres Dynamiques & Ergonomie
- Sélecteur de période temporelle : Aujourd'hui, 7 derniers jours, 30 derniers jours, Trimestre en cours, Année civile.
- Filtre par conseiller / commercial assigné pour évaluer la charge de travail et la réactivité commerciale.
- Cartes d'alerte visuelles (badges rouges pour relances urgentes, dossiers sans action depuis plus de 48h).

### 4. Performance et Optimisation Cloud
Pour éviter les lectures excessives dans Firestore :
- Utilisation de requêtes agrégées (Firestore `count()` et index optimisés).
- Caching intelligent des métriques volumineuses avec revalidation périodique côté serveur (Next.js `revalidate`).
