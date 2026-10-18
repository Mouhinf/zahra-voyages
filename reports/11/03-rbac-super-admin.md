# Rapport 03 : Super Admin, Contrôle d'Accès Basé sur les Rôles (RBAC) et Permissions
## SLAAC Voyages | Prompt 11/12

### 1. Modèle de Rôles RBAC
Le modèle RBAC déployé dans `src/lib/rbac.ts` définit 7 rôles distincts répondant aux exigences organisationnelles de SLAAC Voyages :

1. **`SUPER_ADMIN`** : Direction générale et administration système. Accès absolu à l'ensemble des modules, création/modification d'utilisateurs privilégiés, gestion des rôles, journal d'audit et exports complets.
2. **`ADMIN`** : Directeur d'exploitation ou administrateur opérationnel. Accès à tous les modules métiers et au journal d'audit, gestion des collaborateurs sous son niveau hiérarchique (incapable d'élever un compte à `SUPER_ADMIN`).
3. **`RESPONSABLE_COMMERCIAL`** : Superviseur des ventes. Gestion des prospects, validation des devis, attribution des dossiers et supervision des tâches d'équipe.
4. **`COMMERCIAL`** : Conseiller voyage / billettiste. Consultation et traitement des leads, création de devis, suivi de ses dossiers et de ses tâches assignées.
5. **`EDITEUR_CONTENU`** : Gestionnaire éditorial. Rédaction et mise à jour des articles de blog, fiches de destinations et offres touristiques.
6. **`MARKETING`** : Responsable acquisition et croissance. Consultation des leads, supervision des campagnes publicitaires, tracking UTMs et métriques de conversion.
7. **`LECTURE_SEULE`** : Auditeur ou stagiaire. Consultation sans droit de création, d'édition ou de suppression.

### 2. Matrice des 28 Permissions Granulaires
Le tableau de permissions est strictement partitionné par domaine :
- **Utilisateurs** : `users.manage`, `users.view`, `roles.assign`
- **CRM & Prospects** : `crm.view`, `crm.manage`, `crm.assign`, `crm.delete`
- **Dossiers de Voyage** : `dossiers.view`, `dossiers.manage`, `dossiers.validate`
- **Devis & Chiffrage** : `quotes.view`, `quotes.manage`, `quotes.validate`
- **Tâches d'Équipe** : `tasks.view`, `tasks.manage`
- **Communications** : `notifications.view`, `notifications.retry`
- **Gestion Documentaire** : `documents.view`, `documents.manage`, `documents.view_private`
- **Contenus & Catalogue** : `content.view`, `content.manage`, `content.publish`
- **SEO & Référencement** : `seo.view`, `seo.manage`
- **Marketing & Tracking** : `marketing.view`, `marketing.manage`
- **Sécurité & Rapports** : `audit.view`, `reports.view`, `reports.export`

### 3. Autorisation et Vérification Côté Serveur
Les fonctions `verifyAdminToken()`, `requirePermission()`, et `requireRole()` (`src/lib/firebase-admin.ts`) interceptent chaque requête backend :
- Extraction et vérification du Bearer Token Firebase Auth.
- Résolution en temps réel du profil dans `admin_users/{uid}` pour vérifier l'état d'activité (`isActive === true`).
- En cas de suspension de compte, la session est invalidée immédiatement avec un code `HTTP 403 Forbidden`.
- Évaluation de la permission requise via la fonction pure `hasPermission()`, prenant en compte le rôle par défaut et les surcharges spécifiques accordées à l'utilisateur.

### 4. Mécanisme de Bootstrap et Protection Anti-Verrouillage
- **Transition Transparente** : Durant la phase de migration initiale, si aucun document n'existe encore dans `admin_users`, le système se base sur les emails administrateurs historiques sécurisés (`ADMIN_EMAILS`) pour conférer le rôle `SUPER_ADMIN`, évitant tout blocage du système.
- **Protection Anti-Lockout** : La fonction `updateAdminUserStatus()` vérifie systématiquement qu'au moins un compte `SUPER_ADMIN` actif demeure enregistré dans la base avant de permettre une désactivation.
