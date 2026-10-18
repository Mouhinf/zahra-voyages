# Rapport 01 : État des Lieux et Audit Exhaustif de l'Administration Existante
## SLAAC Voyages | Prompt 11/12

### 1. Contexte et Objectifs de l'Audit
Avant d'engager la refonte enterprise de l'administration de SLAAC Voyages, un audit rigoureux de l'existant a été réalisé sur l'ensemble de l'architecture logicielle, des mécanismes d'authentification, des autorisations, et des parcours utilisateurs du back-office.

### 2. Périmètre Analysé
Les composants et modules suivants ont fait l'objet d'un examen approfondi :
- `src/app/admin/(protected)/layout.tsx` et `src/lib/guard.ts` (contrôle d'accès frontend).
- `src/lib/firebase-admin.ts` et `src/app/api/admin/*` (sécurité backend et vérification des jetons).
- `src/components/admin/admin-shell.tsx` et `src/components/admin/admin-nav.ts` (navigation et structure ergonomique).
- Les collections Firestore préexistantes : `admin_users`, `quotes`, `contacts`, `email_outbox`, `notifications`, `analytics`.

### 3. Principaux Constats & Vulnérabilités Identifiées dans l'Existant
1. **Binarité des Rôles (Admin vs Non-Admin)** : L'ancien système considérait tout utilisateur connecté comme administrateur complet s'il disposait d'un claim ou appartenait à une liste statique. Aucune séparation de privilèges n'existait entre la direction, les commerciaux de billetterie, les rédacteurs de contenu ou l'équipe marketing.
2. **Faiblesses d'Autorisation Côté Serveur (IDOR potentiels)** : Certaines routes API validaient l'identité du compte sans contrôler si l'utilisateur avait le droit précis d'éditer, de supprimer ou d'exporter la ressource ciblée.
3. **Absence de Traçabilité Immuable (Audit Trail)** : Les modifications d'état sur les demandes clients ou les modifications de paramètres n'étaient pas historisées dans une table d'audit inviolable.
4. **Fragmentation des Données Clients** : Les demandes de devis (`quotes`) et les messages de contact (`contacts`) existaient sous forme de silos sans référence unifiée à un dossier de voyage ou à une fiche client consolidée.
5. **Gestion Manuelle des Devis** : Les devis ne disposaient pas d'une machine à états formelle avec calculs de taxes, remises et génération d'un bon de commande imprimable aux normes professionnelles.

### 4. Forces Préexistantes Réutilisées
- L'infrastructure d'envoi d'emails transactionnels avec gestion de boîte d'envoi (`email_outbox`) et suivi des notifications.
- L'authentification Firebase Auth robuste (gestion des sessions et tokens JWT).
- Le design system Tailwind CSS / shadcn/ui cohérent et performant.

### 5. Recommandations Appliquées en Phase 11
- Mise en place d'un RBAC granulaire (7 rôles et 28 permissions).
- Remplacement des contrôles implicites par `requirePermission()` et `requireRole()` sur toutes les API.
- Création des modules Dossiers de Voyage, Devis & PDF, Tâches d'Équipe, et Journal d'Audit immuable.
