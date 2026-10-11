// ---------------------------------------------------------------------------
// tests/firestore-rules.test.mjs
//
// Tests des règles Firestore (exécutés sur l'émulateur local — AUCUN accès
// au projet de production : projectId "demo-", données éphémères).
//
// Lancement : npm run test:rules  (ou scripts/test-rules.sh)
//
// Matrix testée :
//   [ ] Visiteur non authentifié : lecture catalogue public OK, tout le reste refusé
//   [ ] Utilisateur authentifié "lambda" : lecture catalogue OK, écriture refusée,
//       données privées invisibles
//   [ ] Admin par email autorisé + vérifié : écriture/suppression OK
//   [ ] Admin par custom claim { admin: true } : écriture OK
//   [ ] Email autorisé mais NON vérifié : refusé
//   [ ] Garde anti-abus : document > 40 champs refusé
//   [ ] Collections privées (quotes/analytics/contacts…) : refusées pour tous
//       côté client (le serveur utilise le SDK Admin, non soumis aux règles)
// ---------------------------------------------------------------------------

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
} from '@firebase/rules-unit-testing';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ID = 'demo-slaac-rules-test';

let passed = 0;
let failed = 0;
const failures = [];

async function test(name, fn) {
  try {
    await fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    failed++;
    failures.push({ name, err });
    console.error(`  ✗ ${name}`);
    console.error(`      ${err?.message || err}`);
  }
}

const env = await initializeTestEnvironment({
  projectId: PROJECT_ID,
  firestore: {
    rules: readFileSync(resolve(__dirname, '../firestore.rules'), 'utf8'),
  },
});

// Contextes simulés ----------------------------------------------------------
const anonymous = env.unauthenticatedContext();
// Utilisateur lambda, email vérifié — NE doit PAS avoir de droits admin.
const regularUser = env.authenticatedContext('user-lambda', {
  email: 'client@example.com',
  email_verified: true,
});
// Admin par email autorisé (ADMIN_EMAILS) et vérifié.
const adminByEmail = env.authenticatedContext('admin-email', {
  email: 'mouhopap@gmail.com',
  email_verified: true,
});
// Admin par custom claim (mécanisme recommandé).
const adminByClaim = env.authenticatedContext('admin-claim', {
  email: 'direction@slaac-voyages.com',
  email_verified: true,
  admin: true,
});
// Email autorisé MAIS non vérifié → doit être refusé.
const adminUnverified = env.authenticatedContext('admin-unverified', {
  email: 'mouhopap@gmail.com',
  email_verified: false,
});

const catalogDoc = { name: 'Saly', pays: 'Sénégal', prix: 250000, actif: true };

// Données de départ : un document public existe (créé via Admin SDK).
await env.withSecurityRulesDisabled(async (ctx) => {
  await ctx.firestore().collection('destinations').doc('seed-1').set(catalogDoc);
});

console.log('\n— Lecture du catalogue public —');

await test('visiteur anonyme : lecture d\'une destination autorisée', () =>
  assertSucceeds(anonymous.firestore().collection('destinations').doc('seed-1').get()));

await test('visiteur anonyme : listage des destinations autorisé', () =>
  assertSucceeds(anonymous.firestore().collection('destinations').limit(10).get()));

await test('utilisateur lambda : lecture des destinations autorisée', () =>
  assertSucceeds(regularUser.firestore().collection('destinations').doc('seed-1').get()));

await test('visiteur anonyme : lecture des offresAffaires autorisée (allowlist complète)', () =>
  assertSucceeds(anonymous.firestore().collection('offresAffaires').limit(5).get()));

await test('visiteur anonyme : lecture des pageContents autorisée', () =>
  assertSucceeds(anonymous.firestore().collection('pageContents').limit(5).get()));

console.log('\n— Écritures sur le catalogue —');

await test('visiteur anonyme : création refusée', () =>
  assertFails(anonymous.firestore().collection('destinations').doc('x1').set(catalogDoc)));

await test('utilisateur lambda : création refusée', () =>
  assertFails(regularUser.firestore().collection('destinations').doc('x2').set(catalogDoc)));

await test('utilisateur lambda : modification refusée', () =>
  assertFails(regularUser.firestore().collection('destinations').doc('seed-1').update({ prix: 1 })));

await test('utilisateur lambda : suppression refusée', () =>
  assertFails(regularUser.firestore().collection('destinations').doc('seed-1').delete()));

await test('admin par email vérifié : création autorisée', () =>
  assertSucceeds(adminByEmail.firestore().collection('destinations').doc('a1').set(catalogDoc)));

await test('admin par email vérifié : modification autorisée', () =>
  assertSucceeds(adminByEmail.firestore().collection('destinations').doc('seed-1').update({ prix: 300000 })));

await test('admin par email vérifié : suppression autorisée', () =>
  assertSucceeds(adminByEmail.firestore().collection('destinations').doc('a1').delete()));

await test('admin par custom claim : création autorisée', () =>
  assertSucceeds(adminByClaim.firestore().collection('voyages').doc('a2').set({ titre: 'Casamance' })));

await test('email autorisé mais NON vérifié : création refusée', () =>
  assertFails(adminUnverified.firestore().collection('destinations').doc('a3').set(catalogDoc)));

await test('garde anti-abus : document de 41 champs refusé', () => {
  const big = {};
  for (let i = 0; i < 41; i++) big[`f${i}`] = i;
  return assertFails(adminByEmail.firestore().collection('destinations').doc('a4').set(big));
});

await test('garde anti-abus : document de 40 champs accepté', () => {
  const ok = {};
  for (let i = 0; i < 40; i++) ok[`f${i}`] = i;
  return assertSucceeds(adminByEmail.firestore().collection('destinations').doc('a5').set(ok));
});

console.log('\n— Données privées (devis, contacts, analytics…) —');

for (const coll of ['quotes', 'contacts', 'leads', 'analytics', 'bookings', 'newsletter', 'users']) {
  await test(`visiteur anonyme : lecture ${coll} refusée`, () =>
    assertFails(anonymous.firestore().collection(coll).limit(1).get()));
  await test(`utilisateur lambda : lecture ${coll} refusée`, () =>
    assertFails(regularUser.firestore().collection(coll).limit(1).get()));
  await test(`visiteur anonyme : écriture ${coll} refusée`, () =>
    assertFails(anonymous.firestore().collection(coll).doc('hack').set({ x: 1 })));
}

await test('admin (email) : lecture quotes via CLIENT refusée — réservée au SDK Admin côté serveur', () =>
  assertFails(adminByEmail.firestore().collection('quotes').limit(1).get()));

console.log('\n— Refus par défaut —');

await test('collection inconnue (ex. "secrets") : lecture refusée', () =>
  assertFails(anonymous.firestore().collection('secrets').limit(1).get()));

await test('collection inconnue : écriture refusée', () =>
  assertFails(adminByClaim.firestore().collection('secrets').doc('x').set({ x: 1 })));

// ---------------------------------------------------------------------------
console.log(`\nRésultat : ${passed} réussis, ${failed} échoués, ${passed + failed} au total`);
await env.cleanup();
if (failed > 0) {
  console.error('\nÉCHEC : certaines règles n\'ont pas passé les tests.');
  process.exit(1);
}
console.log('Toutes les règles Firestore sont validées. ✓');
