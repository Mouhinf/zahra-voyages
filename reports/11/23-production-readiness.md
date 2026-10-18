# Rapport 23 : Préparation à la Mise en Production et Plan de Rollback
## SLAAC Voyages | Prompt 11/12

### 1. Synthèse de Conformité Opérationnelle
L'ensemble des modules d'administration, de gestion des utilisateurs, de sécurité RBAC, de pilotage des devis, de suivi des dossiers de voyage et de traçabilité d'audit a été déployé, validé par des tests unitaires et d'intégration automatisés, et compilé avec succès en Next.js 15.

### 2. Procédure de Déploiement en Production (Go-Live)
La mise en ligne officielle doit être opérée sous le contrôle de la direction générale et de l'administrateur système selon la séquence ordonnée :
1. **Validation du Git Flow** :
   - Fusion contrôlée de la branche `feat/slaac-admin-crm-enterprise` vers la branche principale `main` après revue de code formelle.
2. **Déploiement des Règles et Index Firestore** :
   ```bash
   firebase deploy --only firestore:rules,firestore:indexes
   ```
3. **Initialisation du Premier Super Administrateur** :
   - Insertion du profil de direction dans `admin_users` ou attribution via script sécurisé de Custom Claims Firebase.
4. **Déploiement Applicatif Vercel** :
   ```bash
   vercel --prod
   ```
5. **Vérification Post-Déploiement (Smoke Tests)** :
   - Connexion réussie à `/admin/login` avec le compte Super Admin.
   - Contrôle du chargement des tableaux de bord, de la liste des collaborateurs et de l'annuaire client.
   - Soumission d'un formulaire de devis test et vérification de la réception dans `/admin/leads` et de la notification email associée.

### 3. Plan de Rollback Immédiat (En cas d'anomalie bloquante)
Si un dysfonctionnement critique est identifié lors des premières heures de mise en service :
1. **Rollback Applicatif Vercel (< 1 minute)** :
   ```bash
   vercel rollback <PREVIOUS_STABLE_DEPLOYMENT_URL>
   ```
   Restaure instantanément la version stable précédente sans interruption de service pour les internautes.
2. **Restauration des Règles Firestore (< 2 minutes)** :
   - Rétablissement de la version antérieure du fichier `firestore.rules` via git.
3. **Restauration des Données Firestore (< 15 minutes, si nécessaire)** :
   ```bash
   gcloud firestore import gs://slaac-backups-production/pre-prompt-11-backup
   ```

### 4. Conclusion
L'architecture logicielle, les contrôles de sécurité et les livrables de la Phase 11/12 sont entièrement validés et prêts pour la bascule finale.
