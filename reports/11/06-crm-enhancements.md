# Rapport 06 : CRM Avancé, Gestion des Prospects et Déduplication
## SLAAC Voyages | Prompt 11/12

### 1. Objectifs Métier
Transformer la gestion brute des formulaires de contact en un pipeline de prospection commerciale hautement qualifiant et structuré, permettant de maximiser les taux de transformation des demandes de voyage.

### 2. Architecture du Pipeline CRM
Le module CRM intègre :
- **Vue Unifiée des Prospects (`/admin/leads`)** : Centralisation des demandes issues des formulaires de devis, des formulaires de contact général, des réservations de transfert AIBD et des pages de destination.
- **Enrichissement Automatique des Métadonnées** : Chaque fiche prospect capture automatiquement les balises d'attribution marketing (UTM Source, Campaign, GCLID, FBCLID), la langue de soumission (FR/EN) et l'adresse IP d'origine.
- **Attribution Commerciale Nominative** : Possibilité d'assigner chaque prospect à un collaborateur spécifique (`assignedTo`), avec notification email automatique et historique d'attribution.

### 3. Gestion Intelligente et Non-Destructive des Doublons
L'une des exigences majeures du Prompt 11 est d'éviter toute perte de données historiques lorsqu'un prospect soumet plusieurs demandes successives :
- **Algorithme de Normalisation (`src/lib/customers.ts`)** :
  - Normalisation des numéros de téléphone au format E.164 (ex: suppression des espaces, tirets et préfixes locaux pour standardiser `+221...`).
  - Standardisation de l'adresse email en minuscules et suppression des espaces superflus.
- **Liaison Non-Destructive (`findOrCreateCustomer`)** :
  - Recherche préalable dans la collection `clients` par téléphone normalisé ou email.
  - Si un profil client existe déjà, la nouvelle demande est rattachée à son historique sans écraser ses coordonnées initiales ni supprimer ses anciens dossiers.
  - Si aucun profil n'existe, une nouvelle fiche client est créée avec un compteur de réservations initialisé à 0.

### 4. Statuts et Cycle de Qualification
- `NOUVEAU` : Demande fraîchement reçue, non traitée.
- `QUALIFIE` : Besoins du voyageur validés (budget, dates, prestations).
- `DEVIS_ENVOYE` : Proposition commerciale transmise au voyageur.
- `GAGNE` : Devis accepté et dossier de voyage ouvert.
- `PERDU` : Projet annulé ou parti à la concurrence (motif obligatoire consigné).
- `INJOIGNABLE` : Tentatives de relance infructueuses après au moins 3 prises de contact.
