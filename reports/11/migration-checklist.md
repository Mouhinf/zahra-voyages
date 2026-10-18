# Checklist de Migration et Déploiement Firestore
## Back-office Enterprise & CRM SLAAC Voyages (Phase 11/12)

Cette checklist détaille chronologiquement toutes les étapes indispensables pour appliquer les modifications de base de données, configurer les index Firestore, initialiser le premier Super Administrateur et valider le bon fonctionnement opérationnel avant bascule en production.

---

### Étape 1 : Sauvegarde Préalable de Firestore (Obligatoire)
- [ ] Lancer une sauvegarde gérée GCP/Firebase vers un bucket Cloud Storage sécurisé :
  ```bash
  gcloud firestore export gs://slaac-backups-production/pre-prompt-11-backup
  ```
- [ ] Confirmer que l'export est complet et que le statut est `SUCCESSFUL`.
- [ ] Noter le hash d'export dans le journal de déploiement.

---

### Étape 2 : Déploiement des Règles de Sécurité Firestore
- [ ] Vérifier la syntaxe du fichier `firestore.rules` :
  - Restrictions strictes de lecture/écriture sur `admin_users`, `admin_audit_logs`, `clients`, `travel_files`, `proposals`, `team_tasks`.
  - Immutabilité garantie de la collection `admin_audit_logs` (aucun droit d'update ou delete même pour le Super Admin).
- [ ] Déployer les règles :
  ```bash
  firebase deploy --only firestore:rules
  ```

---

### Étape 3 : Création des Index Composites Firestore
- [ ] Vérifier les index définis dans `firestore.indexes.json` :
  - `travel_files` : `status` (ASC) + `createdAt` (DESC)
  - `travel_files` : `assignedTo` (ASC) + `status` (ASC) + `updatedAt` (DESC)
  - `team_tasks` : `assignedTo` (ASC) + `status` (ASC) + `dueDate` (ASC)
  - `proposals` : `customerId` (ASC) + `createdAt` (DESC)
  - `admin_audit_logs` : `resource` (ASC) + `timestamp` (DESC)
  - `admin_audit_logs` : `actorId` (ASC) + `timestamp` (DESC)
- [ ] Déployer les index :
  ```bash
  firebase deploy --only firestore:indexes
  ```
- [ ] Vérifier sur la console Firebase que le statut des index est `Enabled` (vert).

---

### Étape 4 : Initialisation Sécurisée du Super Administrateur
- [ ] Créer le document du premier compte de direction dans `admin_users` (sans passer par une API publique) :
  ```json
  {
    "uid": "<FIREBASE_AUTH_UID_DIRECTION>",
    "email": "direction@slaacvoyages.com",
    "displayName": "Direction Générale",
    "role": "SUPER_ADMIN",
    "isActive": true,
    "createdAt": "2026-10-18T00:00:00.000Z",
    "updatedAt": "2026-10-18T00:00:00.000Z"
  }
  ```
- [ ] Optionnel : Attribuer les Custom Claims Firebase Auth pour accélérer la validation hors base de données :
  ```javascript
  admin.auth().setCustomUserClaims(uid, { role: 'SUPER_ADMIN', admin: true });
  ```

---

### Étape 5 : Migration & Synchronisation de l'Annuaire Client
- [ ] Exécuter le script de consolidation des contacts existants (`contacts` et `quotes`) vers la collection unifiée `clients` :
  - Dédoublonnage strict par numéro de téléphone normalisé (format E.164 : `+221...`) et adresse email.
  - Préservation intégrale des métadonnées et historique des réservations passées.
- [ ] Valider que le nombre de clients correspond aux identités uniques sans suppression ni écrasement destructif.

---

### Étape 6 : Validation Fonctionnelle en Pré-Production
- [ ] Connexion du Super Admin sur `/admin/login`.
- [ ] Vérification de l'accès complet à tous les modules : Utilisateurs, Direction, CRM, Dossiers, Devis, Tâches, Notifications, Logs.
- [ ] Test de création d'un utilisateur au rôle `COMMERCIAL` et vérification de la restriction des accès (incapacité à voir les logs d'audit ou les paramètres utilisateurs).
- [ ] Test de génération d'un devis et vérification de la prévisualisation PDF/HTML.
- [ ] Vérification que chaque opération crée bien une ligne dans `/admin/audit-logs`.

---

### Étape 7 : Procédure de Rollback (en cas d'anomalie critique)
- [ ] Revenir à la version précédente du code sur Vercel :
  ```bash
  vercel rollback <PREVIOUS_DEPLOYMENT_URL>
  ```
- [ ] Rétablir les règles Firestore antérieures via git checkout de `firestore.rules`.
- [ ] Si nécessaire, restaurer la sauvegarde Firestore via :
  ```bash
  gcloud firestore import gs://slaac-backups-production/pre-prompt-11-backup
  ```
