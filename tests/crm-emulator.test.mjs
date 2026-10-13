// ---------------------------------------------------------------------------
// tests/crm-emulator.test.mjs — logique CRM serveur (src/lib/crm.ts) exécutée
// sur l'émulateur Firestore local. Données éphémères, aucun accès à la production.
//
// Vérifie : agrégations du tableau de bord (crmOverview), pagination par curseur
// (listLeads), lecture d'une fiche (getLead), historique des modifications
// (patchLead) et demandes récentes (recentLeads).
//
// Lancement : npm run test:crm   (exécute l'émulateur Firestore via firebase-tools)
// ---------------------------------------------------------------------------

import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(join(ROOT, 'package.json'));

if (!process.env.FIRESTORE_EMULATOR_HOST) {
  console.error('FIRESTORE_EMULATOR_HOST absent : lancer via `npm run test:crm`.');
  process.exit(1);
}

// Compilation des modules TypeScript réels (pas de copie des requêtes).
const outDir = mkdtempSync(join(tmpdir(), 'crm-test-'));
execFileSync(
  join(ROOT, 'node_modules', '.bin', 'tsc'),
  [
    '--module', 'commonjs', '--target', 'es2022', '--moduleResolution', 'node',
    '--esModuleInterop', '--skipLibCheck', '--outDir', outDir,
    join(ROOT, 'src/lib/crm.ts'), join(ROOT, 'src/lib/firebase-admin.ts'),
  ],
  { stdio: 'inherit' },
);
process.env.NODE_PATH = join(ROOT, 'node_modules');
require('module').Module._initPaths();

const crm = require(join(outDir, 'crm.js'));
const { getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
require(join(outDir, 'firebase-admin.js')); // initialise l'app Admin partagée
const db = getFirestore(getApps()[0]);

let passed = 0;
let failed = 0;
async function test(name, fn) {
  try {
    await fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    failed++;
    console.error(`  ✗ ${name}\n      ${err?.message || err}`);
  }
}
function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

// ---------------------------------------------------------------------------
// Jeu de données : 120 devis et 30 messages, répartis sur 60 jours.
// ---------------------------------------------------------------------------
const STATUSES = ['nouveau', 'contacte', 'en_discussion', 'devis_envoye', 'confirme', 'perdu'];
const SERVICES = ['hebergement', 'transport', 'excursions'];
const now = Date.now();
const HOUR = 3600 * 1000;
const DAY = 24 * HOUR;

const quotes = [];
for (let i = 0; i < 120; i++) {
  const createdAt = new Date(now - (i % 60) * DAY - (i % 7) * HOUR).toISOString();
  quotes.push({
    id: `q${String(i).padStart(3, '0')}`,
    createdAt,
    service: SERVICES[i % SERVICES.length],
    name: `Client ${i}`,
    // Un document sur cinq n'a pas de crmStatus (anciennes demandes).
    ...(i % 5 === 0 ? {} : { crmStatus: STATUSES[i % STATUSES.length] }),
  });
}
const contacts = [];
for (let i = 0; i < 30; i++) {
  contacts.push({
    id: `c${String(i).padStart(3, '0')}`,
    createdAt: new Date(now - (i % 20) * DAY - 5 * HOUR).toISOString(),
    name: `Contact ${i}`,
    ...(i % 3 === 0 ? {} : { crmStatus: STATUSES[(i + 2) % STATUSES.length] }),
  });
}

async function wipe(col) {
  const snap = await db.collection(col).get();
  await Promise.all(snap.docs.map((d) => d.ref.delete()));
}

async function seed() {
  await wipe('quotes');
  await wipe('contacts');
  const batch = db.batch();
  for (const q of quotes) batch.set(db.collection('quotes').doc(q.id), q);
  for (const c of contacts) batch.set(db.collection('contacts').doc(c.id), c);
  await batch.commit();
}

// Valeurs attendues, calculées directement depuis le jeu de données.
function expected() {
  const cutoff48 = now - 48 * HOUR;
  const since90 = now - 90 * DAY;
  const since30 = now - 30 * DAY;
  const status = (d) => d.crmStatus ?? 'nouveau';

  const statusCounts = Object.fromEntries(STATUSES.map((s) => [s, 0]));
  for (const d of [...quotes, ...contacts]) statusCounts[status(d)]++;

  const unhandled = [...quotes, ...contacts].filter((d) => {
    const t = new Date(d.createdAt).getTime();
    return t >= since90 && t < cutoff48 && status(d) === 'nouveau';
  }).length;

  const perDay = {};
  for (const d of [...quotes, ...contacts]) {
    if (new Date(d.createdAt).getTime() < since30) continue;
    const day = d.createdAt.slice(0, 10);
    perDay[day] = (perDay[day] ?? 0) + 1;
  }
  const services = {};
  for (const q of quotes) {
    if (new Date(q.createdAt).getTime() < since30) continue;
    services[q.service] = (services[q.service] ?? 0) + 1;
  }
  return { statusCounts, unhandled, perDay, services };
}

console.log('\n— Tableau de bord (agrégations) —');
await seed();
const exp = expected();
const overview = await crm.crmOverview();

await test('totaux devis et messages', () => {
  assert(overview.total === 120, `devis : ${overview.total}`);
  assert(overview.contactsTotal === 30, `contacts : ${overview.contactsTotal}`);
});

await test('répartition par statut (documents sans crmStatus comptés en « nouveau »)', () => {
  for (const s of STATUSES) {
    assert(overview.statusCounts[s] === exp.statusCounts[s], `${s} : ${overview.statusCounts[s]} ≠ ${exp.statusCounts[s]}`);
  }
});

await test('demandes non traitées (> 48 h, 90 derniers jours)', () => {
  assert(overview.unhandled === exp.unhandled, `${overview.unhandled} ≠ ${exp.unhandled}`);
});

await test('évolution sur 30 jours', () => {
  for (const [day, n] of Object.entries(exp.perDay)) {
    assert(overview.perDay[day] === n, `${day} : ${overview.perDay[day]} ≠ ${n}`);
  }
  const sum = Object.values(overview.perDay).reduce((a, b) => a + b, 0);
  const expSum = Object.values(exp.perDay).reduce((a, b) => a + b, 0);
  assert(sum === expSum, `somme ${sum} ≠ ${expSum}`);
});

await test('services demandés sur 30 jours', () => {
  for (const s of overview.topServices) {
    assert(exp.services[s.service] === s.count, `${s.service} : ${s.count} ≠ ${exp.services[s.service]}`);
  }
});

console.log('\n— Pagination —');

await test('première page : 50 éléments et curseur suivant', async () => {
  const page = await crm.listLeads('quotes', 50);
  assert(!page.error, page.error);
  assert(page.items.length === 50, `taille ${page.items.length}`);
  assert(typeof page.nextCursor === 'string', 'curseur absent');
});

await test('parcours complet : 120 devis sans doublon ni trou', async () => {
  const seen = [];
  let cursor;
  do {
    const page = await crm.listLeads('quotes', 50, cursor);
    assert(!page.error, page.error);
    seen.push(...page.items.map((i) => i.id));
    cursor = page.nextCursor ?? undefined;
  } while (cursor);
  assert(seen.length === 120, `total parcouru ${seen.length}`);
  assert(new Set(seen).size === 120, 'doublons détectés');
});

await test('ordre : du plus récent au plus ancien', async () => {
  const page = await crm.listLeads('quotes', 20);
  const times = page.items.map((i) => new Date(i.createdAt).getTime());
  for (let i = 1; i < times.length; i++) {
    assert(times[i - 1] >= times[i], 'ordre non décroissant');
  }
});

await test('curseur inconnu refusé', async () => {
  const page = await crm.listLeads('quotes', 10, 'inexistant');
  assert(page.error, 'aucune erreur renvoyée');
});

console.log('\n— Fiche et modifications —');

await test('getLead renvoie la demande ou null', async () => {
  const lead = await crm.getLead('quotes', 'q001');
  assert(lead && lead.id === 'q001', 'demande non trouvée');
  assert((await crm.getLead('quotes', 'absent')) === null, 'attendu null');
});

await test('patchLead : statut et note sont consignés dans l\'historique', async () => {
  await crm.patchLead({ collection: 'quotes', id: 'q001', crmStatus: 'confirme' }, 'test@example.com');
  await crm.patchLead({ collection: 'quotes', id: 'q001', note: { texte: 'Rappeler jeudi' } }, 'test@example.com');
  const lead = await crm.getLead('quotes', 'q001');
  assert(lead.crmStatus === 'confirme', `statut ${lead.crmStatus}`);
  assert(Array.isArray(lead.notes) && lead.notes.at(-1).texte === 'Rappeler jeudi', 'note absente');
  const events = lead.history.map((h) => h.event);
  assert(events.some((e) => e.includes('Confirmé')), `historique statut : ${events}`);
  assert(events.includes('Note ajoutée'), `historique note : ${events}`);
});

await test('patchLead sur une demande absente : non modifiée', async () => {
  const res = await crm.patchLead({ collection: 'quotes', id: 'absent', crmStatus: 'perdu' }, 'x');
  assert(res.updated === false, 'mise à jour inattendue');
});

console.log('\n— Récentes —');

await test('recentLeads : 6 demandes, devis et messages confondus, les plus récentes', async () => {
  const rows = await crm.recentLeads(6);
  assert(rows.length === 6, `taille ${rows.length}`);
  const times = rows.map((r) => new Date(r.createdAt).getTime());
  for (let i = 1; i < times.length; i++) assert(times[i - 1] >= times[i], 'ordre incorrect');
});

await wipe('quotes');
await wipe('contacts');

console.log(`\nRésultat : ${passed} réussis, ${failed} échoués`);
process.exit(failed ? 1 : 0);
