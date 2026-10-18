# Rapport 10 : Gestion des Collaborateurs, Tâches et Relances
## SLAAC Voyages | Prompt 11/12

### 1. Objectifs Opérationnels
Garantir qu'aucun prospect ne reste sans réponse et qu'aucune étape critique d'un dossier de voyage (émission de billet, validation de voucher, relance client) ne soit oubliée par l'équipe.

### 2. Modèle des Tâches Collaborateurs (`src/lib/tasks.ts`)
Chaque tâche enregistrée dans `team_tasks` comporte :
- `title` : Intitulé clair de l'action à mener.
- `description` : Contexte et instructions complémentaires.
- `assignedTo` : Email ou UID du collaborateur responsable.
- `assignedBy` : Email de l'assignateur (superviseur ou auto-assignation).
- `dueDate` : Date d'échéance ISO.
- `priority` : Niveau de criticité (`urgente`, `haute`, `normale`, `basse`).
- `status` : État opérationnel (`a_faire`, `en_cours`, `en_attente`, `terminee`, `annulee`).
- `linkedLeadId` / `linkedDossierId` : Liaison directe avec le prospect ou le dossier concerné.

### 3. Vues Adaptées par Rôle
- **Vue Conseiller Voyage (`/admin/tasks`)** : L'agent accède directement à sa to-do list priorisée par date d'échéance, avec filtre sur les tâches en retard ou à traiter le jour même.
- **Vue Superviseur / Responsable Commercial** : Vision consolidée de la charge de travail globale de l'équipe, identification des goulots d'étranglement et possibilité de réassigner une tâche en un clic.

### 4. Automatisation des Relances
- Notification automatique lors de l'attribution d'une tâche.
- Journalisation de tout changement de statut ou de délai dans `admin_audit_logs`.
