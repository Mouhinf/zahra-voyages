# Rapport 22 : Migrations Firestore et Évolution des Schémas de Données
## SLAAC Voyages | Prompt 11/12

### 1. Vue d'Ensemble des Évolutions de Schémas
La refonte Enterprise introduit de nouvelles collections spécialisées tout en maintenant une rétrocompatibilité absolue avec les collections existantes issues des phases antérieures.

### 2. Nouvelles Collections et Schémas de Documents

#### A. Collection `admin_users`
- `uid` : (string) Identifiant Firebase Auth unique.
- `email` : (string) Adresse email professionnelle.
- `displayName` : (string) Nom et prénom du collaborateur.
- `role` : (string) L'un des 7 rôles RBAC.
- `customPermissions` : (array de strings) Surcharges de permissions spécifiques accordées au profil.
- `isActive` : (boolean) État d'activation du compte.
- `createdAt` : (ISO string) Date de création.
- `updatedAt` : (ISO string) Date de dernière mise à jour.
- `lastLoginAt` : (ISO string, optionnel) Date de dernière session active.

#### B. Collection `clients`
- `id` : (string) Identifiant généré.
- `fullName` : (string) Nom complet du client.
- `email` : (string) Email principal en minuscules.
- `phone` : (string) Téléphone normalisé au format E.164.
- `address` / `city` / `country` : (string, optionnel) Coordonnées postales.
- `passportNumber` / `passportExpiry` : (string, optionnel) Données documentaires protégées.
- `notes` : (string, optionnel) Préférences de voyage, contraintes alimentaires, etc.
- `totalBookings` : (number) Nombre cumulé de voyages réservés.
- `totalSpent` : (number) Montant cumulé facturé en FCFA.

#### C. Collection `travel_files`
- `id` : (string) Identifiant Firestore.
- `reference` : (string) Référence normalisée `DV-DOS-YYYYMMDD-XXXX`.
- `customerId` : (string) Référence vers le document client dans `clients`.
- `clientName` / `clientEmail` / `clientPhone` : (strings) Coordonnées snapshot du client.
- `title` : (string) Intitulé de la commande (ex: Vol Dakar-Dubaï + Hôtel 4*).
- `destination` : (string) Ville/Pays de destination.
- `departureDate` / `returnDate` : (string, optionnel) Dates du voyage.
- `passengerCount` : (number) Nombre de voyageurs.
- `status` : (string) Étape active parmi les 7 statuts du cycle de vie.
- `assignedTo` : (string) Collaborateur responsable du dossier.
- `totalAmount` / `paidAmount` : (number) Données financières en FCFA.
- `createdAt` / `updatedAt` : (ISO strings).

#### D. Collection `proposals`
- `id` : (string) Identifiant Firestore.
- `reference` : (string) Référence normalisée `DV-PROP-YYYYMMDD-XXXX`.
- `customerId` / `dossierId` : (strings, optionnels) Liaisons métier.
- `service` : (string) Type de prestation globale.
- `items` : (array d'objets) Lignes de prestations avec description, quantité, prix unitaire HT, total ligne.
- `totalHT` / `totalTaxes` / `discountAmount` / `totalTTC` : (numbers) Totaux calculés en FCFA.
- `validityDays` : (number) Durée de validité de l'offre (ex: 15 jours).
- `status` : (string) `BROUILLON`, `EN_ATTENTE_VALIDATION`, `ENVOYE`, `ACCEPTE`, `REFUSE`, `EXPIRE`.
- `createdAt` / `updatedAt` : (ISO strings).

#### E. Collection `team_tasks`
- `id` : (string) Identifiant Firestore.
- `title` / `description` : (strings) Définition de la tâche.
- `assignedTo` : (string) Email du collaborateur assigné.
- `assignedBy` : (string) Email de l'assignateur.
- `dueDate` : (string) Date d'échéance.
- `priority` : (string) `urgente`, `haute`, `normale`, `basse`.
- `status` : (string) `a_faire`, `en_cours`, `en_attente`, `terminee`, `annulee`.
- `linkedLeadId` / `linkedDossierId` : (strings, optionnels).
- `createdAt` / `updatedAt` / `completedAt` : (ISO strings).

#### F. Collection `admin_audit_logs`
- Collection immuable consignant chaque événement administratif sensible avec horodatage serveur et données assainies.

### 3. Stratégie de Déploiement sans Interruption (Zero Downtime)
Le code applicatif gère automatiquement les cas d'absence de données dans les nouvelles collections par des fallbacks sécurisés, permettant un déploiement continu sans jamais interrompre le fonctionnement des formulaires publics ou des sessions existantes.
