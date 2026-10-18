/**
 * Gestion des Collaborateurs et Utilisateurs du Back-Office — SLAAC Voyages.
 *
 * Règles de sécurité métier :
 * 1. Seuls les Super Administrateurs et Administrateurs autorisés peuvent gérer les comptes.
 * 2. Interdiction absolue d'auto-élévation de privilèges ou de modification de son propre rôle.
 * 3. Protection du dernier Super Administrateur (impossible de le désactiver ou de rétrograder son rôle).
 * 4. Traçabilité systématique de chaque opération dans `admin_audit_logs`.
 */

import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { adminApp, adminAuth, type AdminSession } from './firebase-admin';
import { type AdminRole, type AdminUserProfile, type Permission, canManageTargetRole } from './rbac';
import { logAuditEvent } from './audit';

function db(): Firestore {
  return getFirestore(adminApp);
}

const COLLECTION = 'admin_users';

/**
 * Liste l'ensemble des utilisateurs enregistrés dans le back-office.
 */
export async function listAdminUsers(): Promise<AdminUserProfile[]> {
  try {
    const snapshot = await db().collection(COLLECTION).orderBy('createdAt', 'desc').get();
    return snapshot.docs.map((d) => ({
      uid: d.id,
      ...(d.data() as Omit<AdminUserProfile, 'uid'>),
    }));
  } catch (err) {
    console.error('[UserAdmin] Erreur lors de la lecture des utilisateurs:', err);
    return [];
  }
}

/**
 * Récupère un utilisateur par son identifiant unique Firebase UID.
 */
export async function getAdminUser(uid: string): Promise<AdminUserProfile | null> {
  try {
    const doc = await db().collection(COLLECTION).doc(uid).get();
    if (!doc.exists) return null;
    return {
      uid: doc.id,
      ...(doc.data() as Omit<AdminUserProfile, 'uid'>),
    };
  } catch (err) {
    console.error(`[UserAdmin] Erreur lors de la lecture de l'utilisateur ${uid}:`, err);
    return null;
  }
}

/**
 * Crée ou initialise un compte collaborateur dans Firestore.
 */
export async function createAdminUser(
  data: {
    uid?: string;
    email: string;
    displayName: string;
    role: AdminRole;
    customPermissions?: Permission[];
    phoneNumber?: string;
  },
  actor: AdminSession
): Promise<{ ok: boolean; user?: AdminUserProfile; error?: string }> {
  try {
    if (!canManageTargetRole(actor.role, data.role)) {
      return { ok: false, error: 'Vous ne possédez pas les droits nécessaires pour assigner ce rôle.' };
    }

    const email = data.email.trim().toLowerCase();

    // Détermine l'UID Firebase correspondant si l'utilisateur existe déjà dans Firebase Auth
    let uid = data.uid;
    if (!uid) {
      try {
        const authUser = await adminAuth.getUserByEmail(email);
        uid = authUser.uid;
      } catch {
        // L'utilisateur n'existe pas encore dans Firebase Auth : on génère un UID temporaire ou on le créera à l'invitation
        uid = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      }
    }

    const existingDoc = await db().collection(COLLECTION).doc(uid).get();
    if (existingDoc.exists) {
      return { ok: false, error: 'Un profil existe déjà pour cet utilisateur.' };
    }

    const now = new Date().toISOString();
    const newUser: AdminUserProfile = {
      uid,
      email,
      displayName: data.displayName.trim() || email.split('@')[0],
      role: data.role,
      customPermissions: data.customPermissions || [],
      isActive: true,
      phoneNumber: data.phoneNumber?.trim() || undefined,
      createdAt: now,
      updatedAt: now,
    };

    await db().collection(COLLECTION).doc(uid).set(newUser);

    // Synchronisation du custom claim Firebase si l'utilisateur existe dans Auth
    try {
      await adminAuth.setCustomUserClaims(uid, {
        admin: data.role === 'SUPER_ADMIN' || data.role === 'ADMIN',
        role: data.role,
      });
    } catch {
      // Utilisateur pas encore provisionné dans Auth, le claim sera synchronisé à sa première connexion
    }

    await logAuditEvent({
      actorId: actor.uid,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'USER_CREATED',
      resource: 'users',
      resourceId: uid,
      details: { email, role: data.role },
    });

    return { ok: true, user: newUser };
  } catch (err: unknown) {
    console.error('[UserAdmin] Erreur création utilisateur:', err);
    return { ok: false, error: err instanceof Error ? err.message : 'Erreur interne' };
  }
}

/**
 * Met à jour les informations, le rôle ou le statut d'un collaborateur.
 */
export async function updateAdminUser(
  targetUid: string,
  patch: {
    displayName?: string;
    role?: AdminRole;
    customPermissions?: Permission[];
    isActive?: boolean;
    phoneNumber?: string;
  },
  actor: AdminSession
): Promise<{ ok: boolean; user?: AdminUserProfile; error?: string }> {
  try {
    const userDoc = await db().collection(COLLECTION).doc(targetUid).get();
    if (!userDoc.exists) {
      return { ok: false, error: 'Collaborateur introuvable.' };
    }

    const currentData = userDoc.data() as AdminUserProfile;

    // Protection anti-auto-modification de privilège
    if (targetUid === actor.uid) {
      if (patch.role !== undefined && patch.role !== actor.role) {
        return { ok: false, error: 'Impossible de modifier votre propre compte ou privilège de rôle.' };
      }
      if (patch.isActive === false) {
        return { ok: false, error: 'Impossible de désactiver votre propre compte.' };
      }
    }

    // Protection de la hiérarchie des rôles
    if (patch.role !== undefined) {
      if (!canManageTargetRole(actor.role, patch.role)) {
        return { ok: false, error: 'Privilèges insuffisants pour attribuer ou modifier ce rôle.' };
      }
      if (!canManageTargetRole(actor.role, currentData.role)) {
        return { ok: false, error: 'Privilèges insuffisants pour modifier cet utilisateur.' };
      }
    }

    // Protection du dernier Super Administrateur
    if (currentData.role === 'SUPER_ADMIN' && (patch.role !== 'SUPER_ADMIN' || patch.isActive === false)) {
      const allUsers = await listAdminUsers();
      const activeSuperAdmins = allUsers.filter((u) => u.role === 'SUPER_ADMIN' && u.isActive);
      if (activeSuperAdmins.length <= 1 && activeSuperAdmins[0]?.uid === targetUid) {
        return { ok: false, error: 'Impossible de désactiver le dernier Super Administrateur ou de rétrograder son rôle.' };
      }
    }

    const updatedData: Partial<AdminUserProfile> = {
      ...patch,
      updatedAt: new Date().toISOString(),
    };

    await db().collection(COLLECTION).doc(targetUid).update(updatedData);

    // Mise à jour des claims Firebase Auth
    if (patch.role !== undefined) {
      try {
        await adminAuth.setCustomUserClaims(targetUid, {
          admin: patch.role === 'SUPER_ADMIN' || patch.role === 'ADMIN',
          role: patch.role,
        });
      } catch {
        // Ignorer si pas d'utilisateur auth correspondant
      }
    }

    await logAuditEvent({
      actorId: actor.uid,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: patch.role ? 'USER_ROLE_CHANGED' : 'USER_UPDATED',
      resource: 'users',
      resourceId: targetUid,
      details: { changes: patch },
    });

    return { ok: true, user: { ...currentData, ...updatedData } };
  } catch (err: unknown) {
    console.error('[UserAdmin] Erreur mise à jour utilisateur:', err);
    return { ok: false, error: err instanceof Error ? err.message : 'Erreur interne' };
  }
}

/**
 * Désactive l'accès d'un collaborateur (sans suppression destructive).
 */
export async function deactivateAdminUser(
  targetUid: string,
  actor: AdminSession
): Promise<{ ok: boolean; error?: string }> {
  return updateAdminUser(targetUid, { isActive: false }, actor);
}
