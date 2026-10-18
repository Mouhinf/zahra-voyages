# Rapport 17 : Journal d'Audit Immuable et Traçabilité des Actions
## SLAAC Voyages | Prompt 11/12

### 1. Objectifs de Sécurité et de Conformité
Assurer une transparence absolue et une responsabilité vérifiable pour toutes les opérations critiques effectuées sur la plateforme administrative de SLAAC Voyages.

### 2. Spécification Technique du Journal d'Audit (`src/lib/audit.ts`)
Toutes les entrées d'audit sont stockées dans la collection dédiée `admin_audit_logs` :
- `actorId` : UID Firebase de l'utilisateur ayant exécuté l'action.
- `actorEmail` : Adresse email du collaborateur.
- `actorRole` : Rôle RBAC détenu au moment exact de l'opération.
- `action` : Identifiant précis de l'action (`USER_CREATED`, `USER_ROLE_CHANGED`, `DOSSIER_STATUS_CHANGED`, `PROPOSAL_CREATED`, `PROPOSAL_VALIDATED`, `TASK_CREATED`, `DATA_EXPORTED`, etc.).
- `resource` : Type d'entité concernée (`users`, `dossiers`, `proposals`, `tasks`, `documents`, `system`).
- `resourceId` : Identifiant unique de l'objet manipulé.
- `ipAddress` & `userAgent` : Contexte technique de la requête HTTP.
- `timestamp` : Horodatage ISO 8601 généré côté serveur.
- `details` : Payload assaini des modifications apportées (avant/après).

### 3. Masquage des Secrets et Données Sensibles (`sanitizeDetails`)
La fonction `sanitizeDetails()` inspecte récursivement chaque charge utile avant écriture dans Firestore pour expurger les clés confidentielles :
- Mots de passe, tokens JWT, clés d'API.
- Numéros complets de cartes bancaires ou pièces d'identité sensibles.
Les valeurs détectées sont systématiquement remplacées par la mention `[REDACTED]`.

### 4. Immutabilité Garantie en Base
- **Règles Firestore (`firestore.rules`)** : La collection `admin_audit_logs` autorise uniquement l'opération `create`. Les opérations `update` et `delete` sont strictement bloquées sans aucune exception, y compris pour les administrateurs les plus élevés.
- **Consultation Sécurisée (`/admin/audit-logs`)** : Interface de recherche chronologique avec filtres par ressource, par acteur et par date, accessible exclusivement aux détenteurs de la permission `audit.view`.
