# Rapport 04 : Gestion des Utilisateurs et Collaborateurs
## SLAAC Voyages | Prompt 11/12

### 1. Objectifs du Module
Fournir à la direction de SLAAC Voyages un contrôle total et sécurisé sur le cycle de vie des comptes collaborateurs accédant à l'espace de gestion.

### 2. Fonctionnalités Déployées
- **Liste Centralisée des Collaborateurs** (`/admin/users`) : Affichage des membres de l'équipe avec leur rôle, statut de compte (Actif / Inactif), date de création et date de dernière connexion.
- **Création et Invitation Sécurisée** (`POST /api/admin/users`) : Création du compte dans Firebase Authentication avec génération d'un mot de passe temporaire robuste ou envoi d'un email de réinitialisation de mot de passe, couplé à la création de la fiche d'autorisation dans `admin_users`.
- **Modification de Profil et Droits** (`PATCH /api/admin/users/[id]`) : Mise à jour du rôle, des permissions spécifiques et de l'état d'activité par un administrateur disposant des privilèges adéquats.
- **Désactivation Instantanée** : Suspension immédiate d'un compte avec révocation des sessions actives.

### 3. Règles de Sécurité et Prévention de l'Élévation de Privilèges
Pour garantir une étanchéité absolue entre les niveaux hiérarchiques :
1. **Interdiction d'Auto-Élévation** : Un utilisateur connecté ne peut pas modifier son propre rôle ou altérer son propre état d'activité (`targetUid === actor.uid`).
2. **Principe de Hiérarchie Stricte (`canManageTargetRole`)** :
   - Seul un `SUPER_ADMIN` peut attribuer ou modifier le rôle `SUPER_ADMIN` ou `ADMIN`.
   - Un `ADMIN` peut attribuer ou gérer uniquement les rôles subordonnés (`RESPONSABLE_COMMERCIAL`, `COMMERCIAL`, `EDITEUR_CONTENU`, `MARKETING`, `LECTURE_SEULE`).
   - Les autres rôles n'ont aucun accès à la gestion des utilisateurs.
3. **Journalisation Systématique** : Tout changement de rôle ou désactivation d'un compte émet un événement d'audit irréversible dans `admin_audit_logs`.
