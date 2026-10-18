// ---------------------------------------------------------------------------
// tests/forms-crm-system.test.mjs — Suite de tests automatisés pour la
// refonte des formulaires, contrats d'API, idempotence et enrichissements CRM.
//
// Lancement : node tests/forms-crm-system.test.mjs
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

console.log('--- Compilation des modules TypeScript Formulaires & CRM ---');
const outDir = mkdtempSync(join(tmpdir(), 'forms-crm-test-'));
execFileSync(
  join(ROOT, 'node_modules', '.bin', 'tsc'),
  [
    '--module', 'commonjs', '--target', 'es2022', '--moduleResolution', 'node',
    '--esModuleInterop', '--skipLibCheck', '--outDir', outDir,
    join(ROOT, 'src/lib/schemas/quote-schema.ts'),
    join(ROOT, 'src/lib/schemas/contact-schema.ts'),
    join(ROOT, 'src/lib/crm.ts'),
    join(ROOT, 'src/lib/firebase-admin.ts'),
  ],
  { stdio: 'inherit' }
);

process.env.NODE_PATH = join(ROOT, 'node_modules');
require('module').Module._initPaths();

const quoteSchemas = require(join(outDir, 'schemas/quote-schema.js'));
const contactSchemas = require(join(outDir, 'schemas/contact-schema.js'));
const crmModule = require(join(outDir, 'crm.js'));

const { quoteSchema, cleanFirestoreData, SERVICE_VALUES } = quoteSchemas;
const { contactSchema } = contactSchemas;
const { patchSchema, PRIORITIES, PRIORITY_LABELS, LEAD_STATUSES } = crmModule;

let testsPassed = 0;
let testsFailed = 0;

function it(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    testsPassed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`      ${err.message || err}`);
    testsFailed++;
  }
}

async function itAsync(name, fn) {
  try {
    await fn();
    console.log(`  ✓ ${name}`);
    testsPassed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`      ${err.message || err}`);
    testsFailed++;
  }
}

console.log('\n=== SUITE 1 : Validation Devis Standard & Données Minimales ===');

it('Devis complet standard avec tous les champs valides', () => {
  const payload = {
    service: 'voyages-croisieres',
    name: 'Fatou Ndiaye',
    phone: '+221 77 312 90 90',
    email: 'fatou.ndiaye@example.com',
    destination: 'Méditerranée Occidentale',
    durationDays: 7,
    cabinType: 'balcony',
    travelers: '2 adultes, 1 enfant',
    message: 'Souhaite une cabine avec vue mer au pont supérieur.',
  };
  const res = quoteSchema.safeParse(payload);
  assert.strictEqual(res.success, true, 'Le devis standard doit être valide');
  assert.strictEqual(res.data.name, 'Fatou Ndiaye');
  assert.strictEqual(res.data.durationDays, 7);
  assert.strictEqual(res.data.cabinType, 'balcony');
});

it('Devis sans email (contact par téléphone uniquement) est accepté', () => {
  const payload = {
    service: 'transport',
    name: 'Mamadou Diallo',
    phone: '+221 78 123 45 67',
    destination: 'AIBD ➔ Dakar Plateau',
  };
  const res = quoteSchema.safeParse(payload);
  assert.strictEqual(res.success, true, 'Le devis sans email doit être accepté');
  assert.strictEqual(res.data.email, undefined);
  assert.strictEqual(res.data.phone, '+221 78 123 45 67');
});

console.log('\n=== SUITE 2 : Validation des Téléphones Internationaux & Noms Unicode ===');

it('Téléphones internationaux valides (+221, +33, avec espaces et tirets)', () => {
  const validPhones = [
    '+221 77 312 90 90',
    '+221773129090',
    '773129090',
    '+33 6 12 34 56 78',
    '+1 (555) 123-4567',
    '+212 661-123456',
  ];
  for (const phone of validPhones) {
    const res = quoteSchema.safeParse({
      name: 'Client Test',
      phone,
    });
    assert.strictEqual(res.success, true, `Téléphone "${phone}" doit être valide`);
  }
});

it('Numéro de téléphone manifestement trop court ou invalide est rejeté', () => {
  const invalidPhones = ['123', 'abc', '+', 'call-me'];
  for (const phone of invalidPhones) {
    const res = quoteSchema.safeParse({
      name: 'Client Test',
      phone,
    });
    assert.strictEqual(res.success, false, `Téléphone "${phone}" doit être rejeté`);
  }
});

it('Noms avec accents et caractères Unicode variés acceptés', () => {
  const unicodeNames = [
    'Éléonore d\'Aigrefeuille',
    'Cheikh Abdou-Rahmane Sène',
    'Jean-François Noël',
    'Aïssatou Ba',
  ];
  for (const name of unicodeNames) {
    const res = quoteSchema.safeParse({
      name,
      phone: '+221 77 000 00 00',
    });
    assert.strictEqual(res.success, true, `Le nom "${name}" doit être accepté`);
  }
});

console.log('\n=== SUITE 3 : Cohérence des Dates & Champs Conditionnels ===');

it('Cohérence des dates : date de retour égale ou postérieure à la date de départ', () => {
  const resOk = quoteSchema.safeParse({
    name: 'Moussa Sall',
    phone: '+221 77 111 22 33',
    service: 'transport',
    roundTrip: true,
    departureDate: '2026-11-01',
    returnDate: '2026-11-10',
  });
  assert.strictEqual(resOk.success, true, 'Dates cohérentes doivent être acceptées');

  const resError = quoteSchema.safeParse({
    name: 'Moussa Sall',
    phone: '+221 77 111 22 33',
    service: 'transport',
    roundTrip: true,
    departureDate: '2026-11-10',
    returnDate: '2026-11-01', // Antérieure au départ !
  });
  assert.strictEqual(resError.success, false, 'Date de retour antérieure doit être rejetée');
  const errs = resError.error.flatten().fieldErrors;
  assert.ok(errs.returnDate, 'L\'erreur doit pointer sur returnDate');
});

it('Champs conditionnels par métier (Hébergement, Tourisme d\'affaires, Excursions)', () => {
  // Hébergement
  const resHeb = quoteSchema.safeParse({
    name: 'Awa Diop',
    phone: '+221 77 222 33 44',
    service: 'hebergement',
    destination: 'Saly Portudal',
    nights: 4,
    roomType: 'deluxe',
  });
  assert.strictEqual(resHeb.success, true);
  assert.strictEqual(resHeb.data.nights, 4);
  assert.strictEqual(resHeb.data.roomType, 'deluxe');

  // Tourisme d'affaires
  const resAffaires = quoteSchema.safeParse({
    name: 'Directeur Général',
    phone: '+221 33 800 00 00',
    service: 'tourisme-affaires',
    companyName: 'Orange Sénégal',
    eventType: 'Séminaire Annuel',
    attendees: 120,
  });
  assert.strictEqual(resAffaires.success, true);
  assert.strictEqual(resAffaires.data.companyName, 'Orange Sénégal');
  assert.strictEqual(resAffaires.data.attendees, 120);

  // Excursion
  const resExc = quoteSchema.safeParse({
    name: 'Pierre Dupont',
    phone: '+33 6 12 34 56 78',
    service: 'excursions',
    destination: 'Île de Gorée',
    excursionDate: '2026-12-05',
    pickupLocation: 'Hôtel Terrou-Bi',
  });
  assert.strictEqual(resExc.success, true);
  assert.strictEqual(resExc.data.pickupLocation, 'Hôtel Terrou-Bi');
});

console.log('\n=== SUITE 4 : Sécurité Anti-Spam & Traçabilité Marketing ===');

it('Pot de miel anti-spam (website) est modélisé et accepté dans le schéma', () => {
  const botPayload = {
    name: 'Bot Spammer',
    phone: '+221 77 000 00 00',
    message: 'Buy cheap watches online',
    website: 'https://spam-bot.xyz',
  };
  const res = quoteSchema.safeParse(botPayload);
  assert.strictEqual(res.success, true, 'Le champ website doit être accepté par le parseur');
  assert.strictEqual(res.data.website, 'https://spam-bot.xyz', 'L\'API pourra détecter le bot et ignorer la requête');
});

it('Paramètres UTM et traçabilité marketing bien préservés', () => {
  const utmPayload = {
    name: 'Prospect Campagne',
    phone: '+221 77 555 44 33',
    utmSource: 'facebook',
    utmMedium: 'cpc',
    utmCampaign: 'promo-ete-2026',
    utmContent: 'carrousel-plage',
    utmTerm: 'voyage senegal',
    referrer: 'https://m.facebook.com/',
    landingPage: '/voyages-croisieres',
  };
  const res = quoteSchema.safeParse(utmPayload);
  assert.strictEqual(res.success, true);
  assert.strictEqual(res.data.utmSource, 'facebook');
  assert.strictEqual(res.data.utmMedium, 'cpc');
  assert.strictEqual(res.data.utmCampaign, 'promo-ete-2026');
  assert.strictEqual(res.data.referrer, 'https://m.facebook.com/');
});

console.log('\n=== SUITE 5 : Nettoyage des Données Firestore (cleanFirestoreData) ===');

it('cleanFirestoreData supprime récursivement toute clé undefined', () => {
  const dirtyData = {
    name: 'Test Clean',
    phone: '+221 77 000 00 00',
    email: undefined,
    roomType: undefined,
    nights: 3,
    roundTrip: false,
    notes: null, // null est valide dans Firestore
    nested: {
      a: 1,
      b: undefined,
      c: {
        d: 'valeur',
        e: undefined,
      },
    },
  };
  const cleaned = cleanFirestoreData(dirtyData);

  assert.strictEqual('email' in cleaned, false, 'email undefined doit être supprimé');
  assert.strictEqual('roomType' in cleaned, false, 'roomType undefined doit être supprimé');
  assert.strictEqual(cleaned.nights, 3);
  assert.strictEqual(cleaned.notes, null);
  assert.strictEqual('b' in cleaned.nested, false, 'nested.b undefined doit être supprimé');
  assert.strictEqual('e' in cleaned.nested.c, false, 'nested.c.e undefined doit être supprimé');
  assert.strictEqual(cleaned.nested.c.d, 'valeur');
});

console.log('\n=== SUITE 6 : Formulaire de Contact Partagé (contactSchema) ===');

it('Formulaire de contact valide avec email, message et téléphone optionnel', () => {
  const res = contactSchema.safeParse({
    name: 'Khadija Kane',
    email: 'khadija.kane@example.com',
    phone: '+221 77 888 99 00',
    message: 'Bonjour, je souhaite des informations sur les vols pour la Turquie.',
  });
  assert.strictEqual(res.success, true);
  assert.strictEqual(res.data.name, 'Khadija Kane');
});

it('Formulaire de contact avec message trop court (< 10 caractères) est rejeté', () => {
  const res = contactSchema.safeParse({
    name: 'Khadija Kane',
    email: 'khadija.kane@example.com',
    message: 'Salut', // 5 caractères
  });
  assert.strictEqual(res.success, false);
});

console.log('\n=== SUITE 7 : Évolutions CRM (Priorités & Relances) ===');

it('patchSchema valide la mise à jour de priorité commerciale', () => {
  for (const prio of PRIORITIES) {
    const res = patchSchema.safeParse({
      collection: 'quotes',
      id: 'doc-12345',
      priorite: prio,
    });
    assert.strictEqual(res.success, true, `Priorité "${prio}" doit être acceptée`);
    assert.strictEqual(res.data.priorite, prio);
  }
});

it('patchSchema valide la programmation d\'une date de relance (nextFollowUpAt)', () => {
  const res = patchSchema.safeParse({
    collection: 'quotes',
    id: 'doc-12345',
    nextFollowUpAt: '2026-10-25',
  });
  assert.strictEqual(res.success, true);
  assert.strictEqual(res.data.nextFollowUpAt, '2026-10-25');
});

it('patchSchema accepte la réinitialisation de date de relance à vide', () => {
  const res = patchSchema.safeParse({
    collection: 'quotes',
    id: 'doc-12345',
    nextFollowUpAt: '',
  });
  assert.strictEqual(res.success, true);
  assert.strictEqual(res.data.nextFollowUpAt, undefined);
});

it('patchSchema refuse une priorité inconnue', () => {
  const res = patchSchema.safeParse({
    collection: 'quotes',
    id: 'doc-12345',
    priorite: 'hyper-urgente',
  });
  assert.strictEqual(res.success, false);
});

console.log('\n=============================================================');
console.log(`RÉSULTATS : ${testsPassed} passés, ${testsFailed} échoués`);
console.log('=============================================================');

if (testsFailed > 0) {
  process.exit(1);
} else {
  console.log('✓ Tous les tests unitaires et d\'intégration Formulaires & CRM ont réussi.');
}
