/**
 * Modèle de Sécurité et Contrôle d'Accès Basé sur les Rôles (RBAC) — SLAAC Voyages.
 *
 * Définit :
 * 1. Les 7 rôles métier de l'agence.
 * 2. Les 28 permissions granulaires couvrant toutes les fonctionnalités administratives.
 * 3. La matrice de permissions par défaut.
 * 4. Les fonctions de vérification d'autorisation et de hiérarchie des rôles.
 */

export const ADMIN_ROLES = [
  'SUPER_ADMIN',
  'ADMIN',
  'RESPONSABLE_COMMERCIAL',
  'COMMERCIAL',
  'EDITEUR_CONTENU',
  'MARKETING',
  'LECTURE_SEULE',
] as const;

export type AdminRole = (typeof ADMIN_ROLES)[number];

export const ROLE_LABELS: Record<AdminRole, string> = {
  SUPER_ADMIN: 'Super Administrateur',
  ADMIN: 'Administrateur',
  RESPONSABLE_COMMERCIAL: 'Responsable Commercial',
  COMMERCIAL: 'Conseiller Commercial',
  EDITEUR_CONTENU: 'Éditeur de Contenu',
  MARKETING: 'Chargé Marketing & Acquisition',
  LECTURE_SEULE: 'Consultation Seule',
};

export const PERMISSIONS = [
  // Administration Utilisateurs & Rôles
  'users.manage',
  'users.view',
  'roles.assign',

  // CRM & Prospects
  'crm.view',
  'crm.manage',
  'crm.assign',
  'crm.delete',

  // Dossiers de Voyage
  'dossiers.view',
  'dossiers.manage',
  'dossiers.validate',

  // Devis & Facturation
  'quotes.view',
  'quotes.manage',
  'quotes.validate',

  // Tâches & Organisation
  'tasks.view',
  'tasks.manage',

  // Communications & Notifications
  'notifications.view',
  'notifications.retry',

  // Gestion Documentaire
  'documents.view',
  'documents.manage',
  'documents.view_private',

  // Contenus du Site & Catalogue
  'content.view',
  'content.manage',
  'content.publish',

  // Outils SEO & Métadonnées
  'seo.view',
  'seo.manage',

  // Marketing & Campagnes
  'marketing.view',
  'marketing.manage',

  // Audit & Rapports
  'audit.view',
  'reports.view',
  'reports.export',
] as const;

export type Permission = (typeof PERMISSIONS)[number];

/**
 * Matrice des permissions par défaut associées à chaque rôle.
 */
export const DEFAULT_ROLE_PERMISSIONS: Record<AdminRole, readonly Permission[]> = {
  SUPER_ADMIN: PERMISSIONS, // Toutes les permissions sans exception

  ADMIN: [
    'users.view',
    'crm.view',
    'crm.manage',
    'crm.assign',
    'crm.delete',
    'dossiers.view',
    'dossiers.manage',
    'dossiers.validate',
    'quotes.view',
    'quotes.manage',
    'quotes.validate',
    'tasks.view',
    'tasks.manage',
    'notifications.view',
    'notifications.retry',
    'documents.view',
    'documents.manage',
    'documents.view_private',
    'content.view',
    'content.manage',
    'content.publish',
    'seo.view',
    'seo.manage',
    'marketing.view',
    'marketing.manage',
    'audit.view',
    'reports.view',
    'reports.export',
  ],

  RESPONSABLE_COMMERCIAL: [
    'crm.view',
    'crm.manage',
    'crm.assign',
    'dossiers.view',
    'dossiers.manage',
    'dossiers.validate',
    'quotes.view',
    'quotes.manage',
    'quotes.validate',
    'tasks.view',
    'tasks.manage',
    'notifications.view',
    'documents.view',
    'documents.manage',
    'documents.view_private',
    'marketing.view',
    'reports.view',
    'reports.export',
  ],

  COMMERCIAL: [
    'crm.view',
    'crm.manage',
    'dossiers.view',
    'dossiers.manage',
    'quotes.view',
    'quotes.manage',
    'tasks.view',
    'tasks.manage',
    'documents.view',
    'documents.manage',
  ],

  EDITEUR_CONTENU: [
    'tasks.view',
    'content.view',
    'content.manage',
    'seo.view',
  ],

  MARKETING: [
    'crm.view',
    'tasks.view',
    'seo.view',
    'seo.manage',
    'marketing.view',
    'marketing.manage',
    'reports.view',
  ],

  LECTURE_SEULE: [
    'crm.view',
    'dossiers.view',
    'quotes.view',
    'tasks.view',
    'content.view',
    'seo.view',
    'marketing.view',
    'reports.view',
  ],
};

/**
 * Profil d'un collaborateur dans Firestore (`admin_users/{uid}`).
 */
export interface AdminUserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: AdminRole;
  customPermissions?: Permission[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  avatarUrl?: string;
  phoneNumber?: string;
}

/**
 * Vérifie si un rôle (avec d'éventuelles permissions personnalisées) détient une permission.
 */
export function hasPermission(
  role: AdminRole,
  permission: Permission,
  customPermissions?: Permission[]
): boolean {
  if (role === 'SUPER_ADMIN') return true;

  // Permissions surchargées au niveau utilisateur
  if (customPermissions && customPermissions.includes(permission)) {
    return true;
  }

  const rolePerms = DEFAULT_ROLE_PERMISSIONS[role] || [];
  return rolePerms.includes(permission);
}

/**
 * Hiérarchie des rôles pour prévenir l'escalade de privilèges.
 * Un utilisateur ne peut créer ou modifier que des rôles strictement inférieurs ou égaux à son habilitation.
 */
export function canManageTargetRole(actorRole: AdminRole, targetRole: AdminRole): boolean {
  if (actorRole === 'SUPER_ADMIN') return true;
  if (actorRole === 'ADMIN') {
    // Un ADMIN ne peut pas gérer ou promouvoir un SUPER_ADMIN
    return targetRole !== 'SUPER_ADMIN';
  }
  return false;
}
