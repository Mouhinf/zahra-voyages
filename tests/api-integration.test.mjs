// ---------------------------------------------------------------------------
// tests/api-integration.test.mjs
//
// Tests d'intégration des endpoints publics — environnement de
// préproduction local : émulateur Firestore + serveur Next.js de dev.
// AUCUNE donnée réelle n'est touchée (projectId demo-, émulateur local).
//
// Lancement : npm run test:api
// Prérequis : émulateur Firestore (port 8080) + serveur Next (port 3199)
// — le script les démarre et les arrête lui-même.
// ---------------------------------------------------------------------------

import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';

const PORT = 3199;
const BASE = `http://127.0.0.1:${PORT}`;
const PROJECT_ID = 'demo-slaac-api-test';

// Le processus de test interroge aussi l'émulateur (vérifications Firestore
// via le SDK Admin) — il doit donc pointer dessus lui-même, pas seulement
// ses enfants.
process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
process.env.GCLOUD_PROJECT = PROJECT_ID;

let passed = 0;
let failed = 0;
const failures = [];

function test(name) {
  return async function run(fn) {
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
  };
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion échouée');
}

function post(path, body, extraHeaders = {}) {
  return fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
    body: JSON.stringify(body),
  });
}

// ---------------------------------------------------------------------------
// Démarrage : émulateur Firestore + serveur Next.js
// ---------------------------------------------------------------------------

const jreDir = spawn('bash', ['-c', 'ls -d "$HOME"/java-runtime/jdk-*-jre 2>/dev/null | head -n1'], { stdio: 'pipe' });
let javaHome = '';
for await (const chunk of jreDir.stdout) javaHome += chunk.toString().trim();

const env = {
  ...process.env,
  ...(javaHome ? { JAVA_HOME: javaHome, PATH: `${javaHome}/bin:${process.env.PATH}` } : {}),
  FIRESTORE_EMULATOR_HOST: '127.0.0.1:8080',
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: PROJECT_ID,
  NEXT_PUBLIC_FIREBASE_API_KEY: 'test-api-key',
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: `${PROJECT_ID}.firebaseapp.com`,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: `${PROJECT_ID}.appspot.com`,
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: '000000000000',
  NEXT_PUBLIC_FIREBASE_APP_ID: '1:000000000000:web:test',
  PORT: String(PORT),
};

// Ces processus engendrent leurs propres enfants (JVM pour l'émulateur,
// next-server pour Next) : on les démarre en groupes de processus séparés
// et on tue tout le groupe à l'arrêt — sinon des orphelins gardent les
// ports occupés pour les exécutions suivantes.
function spawnGroup(cmd, args) {
  return spawn(cmd, args, { env, stdio: 'pipe', detached: true });
}
function killGroup(child) {
  if (!child || child.exitCode !== null) return;
  try {
    process.kill(-child.pid, 'SIGTERM');
  } catch {
    child.kill('SIGTERM');
  }
}

console.log('→ Démarrage de l\'émulateur Firestore…');
const emulator = spawnGroup('npx', ['firebase', 'emulators:start', '--only', 'firestore']);
emulator.stdout.on('data', (d) => process.env.DEBUG && process.stdout.write(`[emu] ${d}`));
emulator.stderr.on('data', (d) => process.env.DEBUG && process.stderr.write(`[emu!] ${d}`));

console.log('→ Démarrage du serveur Next.js…');
const server = spawnGroup('npx', ['next', 'dev', '-p', String(PORT)]);
server.stdout.on('data', (d) => process.env.DEBUG && process.stdout.write(`[srv] ${d}`));
server.stderr.on('data', (d) => process.env.DEBUG && process.stderr.write(`[srv!] ${d}`));

let exitCode = 0;
try {
  // Attente de l'émulateur Firestore (max 60 s) — son endpoint racine
  // répond "OK" une fois prêt.
  let emulatorReady = false;
  for (let i = 0; i < 120 && !emulatorReady; i++) {
    await sleep(500);
    emulatorReady = await fetch('http://127.0.0.1:8080/', { signal: AbortSignal.timeout(2000) }).then((r) => r.ok).catch(() => false);
  }
  assert(emulatorReady, "L'émulateur Firestore ne répond pas (port 8080 occupé par autre chose ?)");

  // Attente du serveur (max 90 s — le compile initial peut être long)
  let ready = false;
  for (let i = 0; i < 180 && !ready; i++) {
    await sleep(500);
    ready = await fetch(`${BASE}/`, { redirect: 'manual', signal: AbortSignal.timeout(4000) }).then((r) => r.status < 600).catch(() => false);
  }
  assert(ready, 'Le serveur Next.js ne répond pas');

  // Admin SDK (lecture de vérification) sur l'émulateur
  const { initializeApp, getApps } = await import('firebase-admin/app');
  const { getFirestore } = await import('firebase-admin/firestore');
  const app = getApps().length ? getApps()[0] : initializeApp({ projectId: PROJECT_ID });
  const db = getFirestore(app);

  async function docExists(collection, id) {
    const snap = await db.collection(collection).doc(id).get();
    return snap.exists;
  }
  async function countWhere(collection, field, value) {
    const snap = await db.collection(collection).where(field, '==', value).get();
    return snap.size;
  }

  console.log('\n— POST /api/contact —');

  await test('contact valide → 200 + document écrit')(async () => {
    const res = await post('/api/contact', {
      name: 'Client Test',
      email: 'client.test@example.com',
      phone: '+221 77 000 00 00',
      message: 'Bonjour, je souhaite des informations sur vos séjours à Dubaï.',
    });
    // Une seule lecture du corps (un second res.json() lèverait une erreur).
    const body = await res.json().catch(() => ({}));
    assert(res.status === 200, `status=${res.status} — ${JSON.stringify(body)}`);
    assert(body.ok === true, 'ok manquant');
    assert(await docExists('contacts', body.id), 'document contacts absent');
  });

  await test('contact : champs invalides → 400 sans écriture')(async () => {
    const res = await post('/api/contact', { name: 'A', email: 'pas-un-email', message: 'court' });
    assert(res.status === 400, `status=${res.status}`);
    const snap = await db.collection('contacts').where('email', '==', 'pas-un-email').get();
    assert(snap.empty, 'un document invalide a été écrit');
  });

  await test('contact : doublon immédiat → ok sans second document')(async () => {
    const payload = {
      name: 'Dup Test',
      email: 'dup@example.com',
      message: 'Message strictement identique pour la déduplication.',
    };
    const r1 = await post('/api/contact', payload);
    assert(r1.status === 200, `premier envoi status=${r1.status}`);
    const r2 = await post('/api/contact', payload);
    const b2 = await r2.json();
    assert(b2.deduped === true, 'flag deduped manquant');
  });

  await test('contact : pot de miel rempli → ignoré silencieusement')(async () => {
    const res = await post('/api/contact', {
      name: 'Bot Robot', email: 'bot@spam.com', message: 'Achat de backlinks pas cher garanti.',
      website: 'http://spam.example',
    });
    assert(res.status === 200, `status=${res.status}`);
    const snap = await db.collection('contacts').where('email', '==', 'bot@spam.com').get();
    assert(snap.empty, 'le spam a été enregistré');
  });

  // 6e requête contact depuis la même IP (limite : 5 / 5 min) — compte aussi
  // les requêtes invalides et le pot de miel, qui passent par le rate limiter.
  await test('contact : 6e message → 429 (rate limit anti-spam)')(async () => {
    const res = await post('/api/contact', {
      name: 'Flood Test', email: 'flood@example.com', message: 'Ce sixième message doit être rejeté.',
    });
    assert(res.status === 429, `status=${res.status} (429 attendu)`);
  });

  console.log('\n— POST /api/quotes —');

  await test('devis assistance-visa valide → 200 + référence + source')(async () => {
    const res = await post('/api/quotes', {
      name: 'Voyageur Test', phone: '+221770000001', email: 'visa@test.com',
      service: 'assistance-visa', destination: 'France', travelers: '1',
      message: 'Demande de visa Schengen.', source: 'test-automatise',
    });
    const body = await res.json().catch(() => ({}));
    assert(res.status === 200, `status=${res.status} — ${JSON.stringify(body)}`);
    assert(/^DV-\d{8}-\d{4}$/.test(body.reference || ''), `référence invalide: ${body.reference}`);
    const snap = await db.collection('quotes').where('reference', '==', body.reference).get();
    assert(snap.size === 1, 'document devis introuvable via la référence');
    const doc = snap.docs[0].data();
    assert(doc.service === 'assistance-visa', 'service non persisté');
    assert(doc.source === 'test-automatise', 'source non persistée');
    assert(doc.status === 'new', 'statut initial manquant');
  });

  await test('devis assurance-voyage → service accepté')(async () => {
    const res = await post('/api/quotes', {
      name: 'Assure Test', phone: '+221770000002', service: 'assurance-voyage', destination: 'Schengen',
    });
    assert(res.status === 200, `status=${res.status}`);
  });

  await test('devis : service inconnu → 400')(async () => {
    const res = await post('/api/quotes', { name: 'X Y', phone: '+221770000003', service: 'service-fantome' });
    assert(res.status === 400, `status=${res.status}`);
  });

  await test('devis : téléphone trop court → 400')(async () => {
    const res = await post('/api/quotes', { name: 'X Y', phone: '12' });
    assert(res.status === 400, `status=${res.status}`);
  });

  console.log('\n— POST /api/newsletter —');

  await test('newsletter valide → 200 + document')(async () => {
    const res = await post('/api/newsletter', { email: 'abonne@example.com' });
    assert(res.status === 200, `status=${res.status}`);
    assert(await docExists('newsletter', 'abonne@example.com'), 'document newsletter absent');
  });

  await test('newsletter : réinscription → already, pas de doublon')(async () => {
    const res = await post('/api/newsletter', { email: 'abonne@example.com' });
    const body = await res.json();
    assert(body.already === true, 'flag already manquant');
    assert((await countWhere('newsletter', 'email', 'abonne@example.com')) === 1, 'doublon créé');
  });

  await test('newsletter : email invalide → 400')(async () => {
    const res = await post('/api/newsletter', { email: 'nimporte-quoi' });
    assert(res.status === 400, `status=${res.status}`);
  });

  console.log('\n— Sécurité des endpoints —');

  await test('POST /api/analytics/log valide → 200')(async () => {
    const res = await post('/api/analytics/log', { page: '/test', source: 'direct', referrer: null, userId: null, method: 'GET' });
    assert(res.status === 200, `status=${res.status}`);
  });

  await test('POST /api/analytics/log invalide → 400')(async () => {
    const res = await post('/api/analytics/log', { page: '/x', source: 'source-piratee' });
    assert(res.status === 400, `status=${res.status}`);
  });

  await test('GET /api/admin/quotes sans token → 401')(async () => {
    const res = await fetch(`${BASE}/api/admin/quotes`);
    assert(res.status === 401, `status=${res.status}`);
  });

  await test('GET /api/admin/contacts sans token → 401')(async () => {
    const res = await fetch(`${BASE}/api/admin/contacts`);
    assert(res.status === 401, `status=${res.status}`);
  });

  await test('GET /api/admin/newsletter sans token → 401')(async () => {
    const res = await fetch(`${BASE}/api/admin/newsletter`);
    assert(res.status === 401, `status=${res.status}`);
  });

  await test('GET /api/admin/session sans token → 401')(async () => {
    const res = await fetch(`${BASE}/api/admin/session`);
    assert(res.status === 401, `status=${res.status}`);
  });

  console.log(`\nRésultat : ${passed} réussis, ${failed} échoués, ${passed + failed} au total`);
  if (failed > 0) {
    console.error('\nÉCHEC des tests d\'intégration API.');
    exitCode = 1;
  } else {
    console.log('Tous les endpoints publics et protégés répondent correctement. ✓');
  }
} catch (setupErr) {
  console.error('Erreur de préparation des tests:', setupErr);
  exitCode = 1;
} finally {
  killGroup(server);
  killGroup(emulator);
  await sleep(2000);
  try {
    process.kill(-server.pid, 'SIGKILL');
    process.kill(-emulator.pid, 'SIGKILL');
  } catch {
    // déjà terminés
  }
}

process.exit(exitCode);
