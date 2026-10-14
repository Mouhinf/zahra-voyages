#!/usr/bin/env node
/**
 * scripts/set-admin-claim.mjs
 *
 * Attribue le custom claim Firebase { admin: true } à un utilisateur.
 *
 * Pourquoi : les règles Firestore (`firestore.rules`) et les routes API
 * protégées (`verifyAdminToken`) accordent les droits administrateur si
 * le token contient `admin: true` OU si l'email figure dans ADMIN_EMAILS
 * (vérifié). Le custom claim est le mécanisme recommandé : il est signé,
 * vérifiable côté serveur et révocable.
 *
 * Prérequis :
 *   - FIREBASE_SERVICE_ACCOUNT_KEY défini dans l'environnement (ou fichier
 *     .env.local) : JSON complet du compte de service (contient client_email
 *     et private_key).
 *   - L'UID ou l'email de l'utilisateur à promouvoir.
 *
 * Usage :
 *   node scripts/set-admin-claim.mjs --email mouhopap@gmail.com
 *   node scripts/set-admin-claim.mjs --uid <uid>
 *
 * L'utilisateur devra se déconnecter/reconnecter (ou attendre le
 * rafraîchissement du token, max 1 h) pour que le claim soit visible.
 *
 * Ce script ne lit, ne modifie et ne supprime AUCUNE donnée client :
 * il met uniquement à jour les claims du compte désigné.
 */

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// Chargement de la clé de compte de service : variable d'environnement
// prioritaire, sinon .env.local à la racine du projet.
// ---------------------------------------------------------------------------
function loadServiceAccount() {
  let raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!raw) {
    try {
      const envLocal = readFileSync(resolve(__dirname, '../.env.local'), 'utf8');
      const match = envLocal.match(/^FIREBASE_SERVICE_ACCOUNT_KEY=(.+)$/m);
      if (match) raw = match[1].trim().replace(/^["']|["']$/g, '');
    } catch {
      // pas de .env.local — on continue
    }
  }

  if (!raw) {
    console.error(
      [
        'Erreur : FIREBASE_SERVICE_ACCOUNT_KEY introuvable.',
        '',
        'Étapes :',
        '  1. Firebase Console → Paramètres du projet → Comptes de service',
        '  2. "Générer une nouvelle clé privée" (JSON)',
        '  3. Ajoutez le JSON complet dans .env.local :',
        '     FIREBASE_SERVICE_ACCOUNT_KEY={ ... }',
        '     (sur une seule ligne, en échappant les retours à la ligne',
        '      ou via l\'UI Vercel pour la production)',
      ].join('\n')
    );
    process.exit(1);
  }

  try {
    return JSON.parse(raw);
  } catch {
    console.error('Erreur : FIREBASE_SERVICE_ACCOUNT_KEY n\'est pas un JSON valide.');
    process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// Arguments
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const emailArg = args.includes('--email') ? args[args.indexOf('--email') + 1] : null;
const uidArg = args.includes('--uid') ? args[args.indexOf('--uid') + 1] : null;
const revoke = args.includes('--revoke');

if (!emailArg && !uidArg) {
  console.error('Usage : node scripts/set-admin-claim.mjs --email <email> | --uid <uid> [--revoke]');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Exécution
// ---------------------------------------------------------------------------
async function main() {
  const serviceAccount = loadServiceAccount();

  // firebase-admin est une dépendance du projet ; import dynamique pour
  // que ce script reste utilisable sans build préalable.
  const { initializeApp, getApps, cert } = await import('firebase-admin/app');
  const { getAuth } = await import('firebase-admin/auth');

  const app = getApps().length ? getApps()[0] : initializeApp({ credential: cert(serviceAccount) });
  const auth = getAuth(app);

  const target = emailArg ? { email: emailArg } : { uid: uidArg };

  const user = emailArg ? await auth.getUserByEmail(emailArg) : await auth.getUser(uidArg);

  if (revoke) {
    await auth.setCustomUserClaims(user.uid, { admin: false });
    console.log(`✓ Claim admin RÉVOQUÉ pour ${user.email || user.uid} (${user.uid})`);
  } else {
    await auth.setCustomUserClaims(user.uid, { admin: true });
    console.log(`✓ Claim { admin: true } attribué à ${user.email || user.uid} (${user.uid})`);
    console.log('');
    console.log('Important : l\'utilisateur doit se déconnecter puis se reconnecter');
    console.log('pour que le claim apparaisse dans son ID token.');
  }

  process.exit(0);
}

main().catch((err) => {
  console.error('Erreur :', err?.message || err);
  process.exit(1);
});
