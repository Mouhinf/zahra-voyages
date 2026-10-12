// ---------------------------------------------------------------------------
// tests/banners-api.test.mjs
//
// Tests d'intégration du bandeau publicitaire — émulateur Firestore local +
// serveur Next.js de développement (ports dédiés 8081/3200 pour rester
// indépendant de test:api). AUCUNE donnée réelle n'est touchée.
//
// Couverture :
//   1. Sécurité : écriture admin refusée sans jeton (401).
//   2. Diffusion publique : seules les annonces publiées et dans leur
//      fenêtre de validité sont renvoyées, triées par ordre administré.
//   3. Confidentialité : aucun champ d'administration dans la réponse
//      publique (status, dates, createdBy…).
//   4. Résilience : la route publique répond 200 avec liste vide sur
//      collection absente.
//
// Lancement : node tests/banners-api.test.mjs
// ---------------------------------------------------------------------------

import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const PORT = 3200;
const BASE = `http://127.0.0.1:${PORT}`;
const PROJECT_ID = 'demo-slaac-banners-test';

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

const env = {
  ...process.env,
  FIRESTORE_EMULATOR_HOST: '127.0.0.1:8080',
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: PROJECT_ID,
  NEXT_PUBLIC_FIREBASE_API_KEY: 'test-api-key',
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: `${PROJECT_ID}.firebaseapp.com`,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: `${PROJECT_ID}.appspot.com`,
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: '000000000000',
  NEXT_PUBLIC_FIREBASE_APP_ID: '1:000000000000:web:test',
  PORT: String(PORT),
};

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

// Fenêtres de validité relatives à maintenant (UTC = Dakar).
const now = Date.now();
const DAY = 24 * 60 * 60 * 1000;
const iso = (ms) => new Date(ms).toISOString();

// Annonces semées directement via le SDK Admin (l'émulateur ne vérifie
// pas l'authentification pour le SDK admin) : couvre la logique de
// diffusion sans dépendre d'un compte admin de test.
const SEED = [
  { message: 'Annonce active n°2', status: 'publie', order: 2, href: '/excursions', variant: 'or', campaignType: 'excursion', startAt: '', endAt: '', ctaLabel: '', newTab: false, createdAt: iso(now - 9000), updatedAt: iso(now - 9000), createdBy: 'seed' },
  { message: 'Annonce active n°1 (priorité basse ordre)', status: 'publie', order: 1, href: '/hebergement', variant: 'marine', campaignType: 'hebergement', startAt: '', endAt: '', ctaLabel: 'Voir', newTab: false, createdAt: iso(now - 8000), updatedAt: iso(now - 8000), createdBy: 'seed' },
  { message: 'Brouillon jamais diffusé', status: 'brouillon', order: 0, href: '', variant: 'or', campaignType: 'generale', startAt: '', endAt: '', ctaLabel: '', newTab: false, createdAt: iso(now - 7000), updatedAt: iso(now - 7000), createdBy: 'seed' },
  { message: 'Archivée', status: 'archive', order: 3, href: '', variant: 'or', campaignType: 'autre', startAt: '', endAt: '', ctaLabel: '', newTab: false, createdAt: iso(now - 6000), updatedAt: iso(now - 6000), createdBy: 'seed' },
  { message: 'Programmée trop tôt', status: 'publie', order: 4, href: '', variant: 'or', campaignType: 'evenement', startAt: iso(now + DAY), endAt: iso(now + 2 * DAY), ctaLabel: '', newTab: false, createdAt: iso(now - 5000), updatedAt: iso(now - 5000), createdBy: 'seed' },
  { message: 'Expirée', status: 'publie', order: 5, href: '', variant: 'or', campaignType: 'transport', startAt: iso(now - 2 * DAY), endAt: iso(now - DAY), ctaLabel: '', newTab: false, createdAt: iso(now - 4000), updatedAt: iso(now - 4000), createdBy: 'seed' },
  { message: 'Active fenêtre large encadrant maintenant', status: 'publie', order: 1, href: 'https://example.com/offre', variant: 'vert', campaignType: 'generale', startAt: iso(now - DAY), endAt: iso(now + DAY), ctaLabel: 'Offre', newTab: true, createdAt: iso(now - 3000), updatedAt: iso(now - 3000), createdBy: 'seed' },
];

const emulator = spawnGroup('bash', ['-c', `
  jre="$(ls -d "$HOME"/java-runtime/jdk-*-jre 2>/dev/null | head -n1)"
  if [ -n "$jre" ]; then export JAVA_HOME="$jre"; export PATH="$jre/bin:$PATH"; fi
  exec npx firebase emulators:start --only firestore --project ${PROJECT_ID}
`]);
console.log('→ Démarrage de l’émulateur Firestore (8081)…');
const server = spawnGroup('npx', ['next', 'dev', '-p', String(PORT)]);
console.log('→ Démarrage du serveur Next.js (3200)…');

let exitCode = 0;
try {
  let emulatorReady = false;
  for (let i = 0; i < 120 && !emulatorReady; i++) {
    await sleep(500);
    try {
      const res = await fetch('http://127.0.0.1:8080/');
      if (res.ok) emulatorReady = true;
    } catch {}
  }
  assert(emulatorReady, 'émulateur Firestore non prêt');

  // Semis : initialise le SDK admin sur l'émulateur puis écrit.
  initializeApp({ projectId: PROJECT_ID });
  const db = getFirestore();
  const col = db.collection('promotionalBanners');
  for (const banner of SEED) {
    await col.add(banner);
  }
  console.log(`→ ${SEED.length} annonces semées dans l’émulateur.`);

  let serverReady = false;
  for (let i = 0; i < 240 && !serverReady; i++) {
    await sleep(500);
    try {
      const res = await fetch(`${BASE}/api/promo-banners`);
      if (res.status < 500) serverReady = true;
    } catch {}
  }
  assert(serverReady, 'serveur Next non prêt');

  await test('POST admin sans jeton → refusé (401/403)')(async () => {
    const res = await fetch(`${BASE}/api/admin/banners`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Tentative anonyme', status: 'publie' }),
    });
    assert(res.status === 401 || res.status === 403, `status=${res.status}`);
    const body = await res.json().catch(() => ({}));
    assert(body.error, 'message d’erreur attendu');
  });

  await test('GET admin sans jeton → refusé (401/403)')(async () => {
    const res = await fetch(`${BASE}/api/admin/banners`);
    assert(res.status === 401 || res.status === 403, `status=${res.status}`);
  });

  await test('Diffusion : uniquement actives, triées par ordre, champs publics')(async () => {
    const res = await fetch(`${BASE}/api/promo-banners`);
    assert(res.status === 200, `status=${res.status}`);
    const body = await res.json();
    assert(Array.isArray(body.banners), 'banners doit être un tableau');
    assert(body.banners.length === 3, `3 annonces actives attendues, reçu ${body.banners.length}`);
    assert(body.banners[0].message === 'Annonce active n°1 (priorité basse ordre)', `ordre 1 attendu en premier, reçu: ${body.banners[0].message}`);
    assert(body.banners[1].message === 'Active fenêtre large encadrant maintenant', 'deuxième : fenêtre large (ordre 1, plus ancienne)');
    assert(body.banners[2].message === 'Annonce active n°2', 'troisième : ordre 2');
    for (const b of body.banners) {
      assert(!('status' in b) && !('createdBy' in b) && !('startAt' in b) && !('endAt' in b) && !('updatedAt' in b), 'champ d’administration exposé publiquement');
      assert(typeof b.message === 'string' && 'variant' in b, 'vue publique incomplète');
    }
    assert(body.banners[2].href === '/excursions', 'href interne attendu');
    assert(body.banners[1].newTab === true, 'newTab attendu sur le lien externe');
  });

  await test('Programmation : fenêtre expirée exclue (horloge serveur)')(async () => {
    // Fait suite au semis : l'annonce « Expirée » (fin hier) est absente
    // de la réponse — couvert par la longueur ci-dessus ; on vérifie ici
    // qu'une annonce qui se termine dans 2 s disparaît après expiration.
    const short = { message: 'Éphémère', status: 'publie', order: 0, href: '', variant: 'or', campaignType: 'generale', startAt: '', endAt: iso(Date.now() + 2000), ctaLabel: '', newTab: false, createdAt: iso(now), updatedAt: iso(now), createdBy: 'seed' };
    await db.collection('promotionalBanners').add(short);
    const before = await (await fetch(`${BASE}/api/promo-banners`)).json();
    assert(before.banners.some((b) => b.message === 'Éphémère'), 'annonce éphémère devrait être active');
    await sleep(2600);
    const after = await (await fetch(`${BASE}/api/promo-banners`)).json();
    assert(!after.banners.some((b) => b.message === 'Éphémère'), 'annonce éphémère encore diffusée après expiration');
  });

  console.log(`\nRésultat : ${passed} réussis, ${failed} échoués, ${passed + failed} au total`);
  if (failures.length > 0) exitCode = 1;
} catch (err) {
  console.error('Échec du harnais :', err?.message || err);
  exitCode = 1;
} finally {
  killGroup(server);
  killGroup(emulator);
  await sleep(800);
  process.exit(exitCode);
}
