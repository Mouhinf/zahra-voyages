// ---------------------------------------------------------------------------
// tests/email-outbox-emulator.test.mjs — Test d'intégration de l'Outbox
// et du cycle de vie complet sur l'émulateur Firestore local.
// ---------------------------------------------------------------------------

import assert from 'node:assert';
import { execFileSync } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(join(ROOT, 'package.json'));

if (!process.env.FIRESTORE_EMULATOR_HOST) {
  console.error('FIRESTORE_EMULATOR_HOST absent : exécuter sous émulateur.');
  process.exit(1);
}

process.env.EMAIL_PROVIDER = 'mock';
process.env.NEXT_PUBLIC_BASE_URL = 'https://slaacvoyages.com';
process.env.NOTIFY_EMAIL = 'contact@slaacvoyages.com';
process.env.MANAGER_EMAIL = 'mdslaacvoyages@gmail.com';

const outDir = mkdtempSync(join(tmpdir(), 'email-emul-test-'));
execFileSync(
  join(ROOT, 'node_modules', '.bin', 'tsc'),
  [
    '--module', 'commonjs', '--target', 'es2022', '--moduleResolution', 'node',
    '--esModuleInterop', '--skipLibCheck', '--outDir', outDir,
    join(ROOT, 'src/lib/email/types.ts'),
    join(ROOT, 'src/lib/email/config.ts'),
    join(ROOT, 'src/lib/email/templates.ts'),
    join(ROOT, 'src/lib/email/providers/sendgrid.ts'),
    join(ROOT, 'src/lib/email/providers/resend.ts'),
    join(ROOT, 'src/lib/email/providers/smtp.ts'),
    join(ROOT, 'src/lib/email/providers/mock.ts'),
    join(ROOT, 'src/lib/email/providers/index.ts'),
    join(ROOT, 'src/lib/email/outbox.ts'),
    join(ROOT, 'src/lib/email/service.ts'),
    join(ROOT, 'src/lib/firebase-admin.ts'),
  ],
  { stdio: 'inherit' }
);

process.env.NODE_PATH = join(ROOT, 'node_modules');
require('module').Module._initPaths();

const { getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
require(join(outDir, 'firebase-admin.js'));
const db = getFirestore(getApps()[0]);

const { sendQuoteNotifications, sendContactNotifications, retryLeadNotifications } = require(join(outDir, 'email/service.js'));
const { MockEmailProvider } = require(join(outDir, 'email/providers/mock.js'));

async function run() {
  console.log('\n--- Test 1 : Enregistrement Quote + Triple Notification Outbox ---');
  MockEmailProvider.clear();

  // Création du devis dans Firestore
  const quoteRef = await db.collection('quotes').add({
    reference: 'DV-20261017-TEST',
    name: 'Awa Diop',
    email: 'awa.diop@example.com',
    phone: '+221 77 000 11 22',
    service: 'voyages-croisieres',
    destination: 'Zanzibar',
    status: 'new',
    notifyStatus: 'pending',
    createdAt: new Date().toISOString(),
  });

  const results = await sendQuoteNotifications(quoteRef.id, {
    reference: 'DV-20261017-TEST',
    name: 'Awa Diop',
    email: 'awa.diop@example.com',
    phone: '+221 77 000 11 22',
    service: 'voyages-croisieres',
    destination: 'Zanzibar',
  });

  assert(results.customer?.success, 'Notification client réussie');
  assert(results.agency?.success, 'Notification agence réussie');
  assert(results.manager?.success, 'Notification direction réussie');

  // Vérifier les 3 documents créés dans emailOutbox
  const outboxDocs = await db.collection('emailOutbox').where('leadId', '==', quoteRef.id).get();
  assert.strictEqual(outboxDocs.size, 3, 'Exactement 3 documents dans emailOutbox');

  // Vérifier la mise à jour de la fiche quote
  const quoteSnap = await quoteRef.get();
  const quoteData = quoteSnap.data();
  assert.strictEqual(quoteData.notifyStatus, 'sent', 'notifyStatus legacy mis à jour à sent');
  assert(quoteData.emailStatus, 'emailStatus objet présent');
  assert.strictEqual(quoteData.emailStatus.customer.status, 'sent', 'Client status = sent');
  assert.strictEqual(quoteData.emailStatus.agency.status, 'sent', 'Agency status = sent');
  assert.strictEqual(quoteData.emailStatus.manager.status, 'sent', 'Manager status = sent');
  console.log('  ✓ Triple dispatch et synchronisation Firestore validés');

  console.log('\n--- Test 2 : Idempotence stricte (aucun doublon) ---');
  const countBefore = MockEmailProvider.getSentMessages().length;
  // Deuxième appel avec les mêmes paramètres
  await sendQuoteNotifications(quoteRef.id, {
    reference: 'DV-20261017-TEST',
    name: 'Awa Diop',
    email: 'awa.diop@example.com',
    phone: '+221 77 000 11 22',
    service: 'voyages-croisieres',
    destination: 'Zanzibar',
  });
  const countAfter = MockEmailProvider.getSentMessages().length;
  assert.strictEqual(countAfter, countBefore, 'Aucun email en double expédié (idempotence)');
  console.log('  ✓ Idempotence validée : 0 renvoi inutile');

  console.log('\n--- Test 3 : Gestion de panne et Rejeu manuel (Retry) ---');
  const contactRef = await db.collection('contacts').add({
    name: 'Cheikh Fall',
    email: 'cheikh@example.com',
    phone: '+221 76 555 44 33',
    message: 'Demande de partenariat B2B',
    status: 'new',
    notifyStatus: 'pending',
    createdAt: new Date().toISOString(),
  });

  // Simuler une coupure réseau
  MockEmailProvider.setSimulatedFailure(true, 'Réseau temporairement indisponible');

  await sendContactNotifications(contactRef.id, {
    id: contactRef.id,
    name: 'Cheikh Fall',
    email: 'cheikh@example.com',
    phone: '+221 76 555 44 33',
    message: 'Demande de partenariat B2B',
  });

  // Vérifier le statut failed
  const failedContactSnap = await contactRef.get();
  const failedData = failedContactSnap.data();
  assert(failedData.notifyStatus.startsWith('failed:'), 'notifyStatus indique failed');
  assert.strictEqual(failedData.emailStatus.agency.status, 'failed', 'agency status = failed');
  assert(failedData.emailStatus.agency.attemptCount >= 1, 'attemptCount incrémenté');
  console.log('  ✓ Échec consigné proprement avec backoff');

  // Rétablir le réseau et lancer le rejeu
  MockEmailProvider.setSimulatedFailure(false);
  const retryOutcome = await retryLeadNotifications('contacts', contactRef.id);
  assert(retryOutcome.successes >= 2, 'Rejeu réussi pour les messages échoués');

  const recoveredSnap = await contactRef.get();
  assert.strictEqual(recoveredSnap.data().notifyStatus, 'sent', 'notifyStatus rétabli à sent après rejeu');
  assert.strictEqual(recoveredSnap.data().emailStatus.agency.status, 'sent', 'Statut agence rétabli à sent');
  console.log('  ✓ Rejeu forcé réussi : statut rétabli à sent');

  console.log('\n============================================================');
  console.log('Tous les tests d’intégration Outbox / Firestore sont validés !');
  console.log('============================================================');
}

run().catch((err) => {
  console.error('Erreur test émulateur:', err);
  process.exit(1);
});
