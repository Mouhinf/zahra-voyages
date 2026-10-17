// ---------------------------------------------------------------------------
// tests/email-system.test.mjs — Suite de tests automatisés pour le système
// d'emails transactionnels, templates premium, outbox et providers.
//
// Lancement : node tests/email-system.test.mjs
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

process.env.EMAIL_PROVIDER = 'mock';
process.env.NEXT_PUBLIC_BASE_URL = 'https://slaacvoyages.com';
process.env.NOTIFY_EMAIL = 'contact@slaacvoyages.com';
process.env.MANAGER_EMAIL = 'mdslaacvoyages@gmail.com';

console.log('--- Compilation des modules TypeScript Email ---');
const outDir = mkdtempSync(join(tmpdir(), 'email-test-'));
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

const templates = require(join(outDir, 'email/templates.js'));
const configModule = require(join(outDir, 'email/config.js'));
const providers = require(join(outDir, 'email/providers/index.js'));
const outbox = require(join(outDir, 'email/outbox.js'));

let testsPassed = 0;
let testsFailed = 0;

function it(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    testsPassed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(err);
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
    console.error(err);
    testsFailed++;
  }
}

async function main() {
  console.log('\n--- 1. Tests Templates Devis (FR / EN / Disclaimer Légal) ---');

  it('Génère un accusé de réception devis en français avec mentions légales obligatoires', () => {
    const result = templates.generateQuoteCustomerEmail({
      reference: 'DV-20261017-1001',
      name: 'Moussa Diop',
      email: 'moussa.diop@example.com',
      phone: '+221 77 123 45 67',
      service: 'voyages-croisieres',
      destination: 'Dubaï & Maldives',
      departureDate: '2026-12-20',
      returnDate: '2027-01-05',
      adults: 2,
      children: 1,
      budget: '5 000 000 FCFA',
      notes: 'Chambre avec vue sur mer souhaitée',
      lang: 'fr',
    });

    assert(result.subject.includes('DV-20261017-1001'), 'Objet contient la référence');
    assert(result.subject.includes('Accusé de réception'), 'Objet contient Accusé de réception');
    assert(result.html.includes('Moussa Diop'), 'HTML contient le nom du client');
    assert(result.html.includes('Dubaï &amp; Maldives'), 'HTML contient la destination échappée');
    assert(result.html.includes('2 adulte(s), 1 enfant(s)'), 'HTML contient les voyageurs');
    assert(result.html.includes('Le présent message constitue un accusé de réception'), 'HTML contient le disclaimer légal FR');
    assert(result.html.includes('ne constitue en aucun cas une confirmation ferme'), 'HTML stipule la non-confirmation ferme');
    assert(result.html.includes('https://wa.me/221773129090'), 'HTML contient le bouton WhatsApp direct');
    assert(result.text.includes('DV-20261017-1001'), 'Version texte contient la référence');
    assert(result.text.includes('MENTION LÉGALE'), 'Version texte contient la mention légale');
  });

  it('Génère un accusé de réception devis en anglais avec disclaimer traduit', () => {
    const result = templates.generateQuoteCustomerEmail({
      reference: 'DV-20261017-1002',
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+1 555 123 4567',
      service: 'hebergement',
      destination: 'Dakar Almadies',
      departureDate: '2026-11-10',
      returnDate: '2026-11-20',
      travelers: 1,
      budget: '$2,500',
      lang: 'en',
    });

    assert(result.subject.includes('Acknowledgment'), 'Objet EN contient Acknowledgment');
    assert(result.html.includes('Dear John Smith,'), 'Salutation EN correcte');
    assert(result.html.includes('Accommodation &amp; Luxury Stays'), 'Label service en anglais');
    assert(result.html.includes('Important Notice: This email serves as an acknowledgment'), 'HTML contient le disclaimer légal EN');
    assert(result.html.includes('does not constitute a confirmed booking'), 'Disclaimer EN mentionne le statut non-ferme');
  });

  it('Génère l’alerte agence avec boutons d’action directe et lien CRM', () => {
    const result = templates.generateQuoteAgencyEmail({
      reference: 'DV-20261017-1003',
      name: 'Fatou Ndiaye',
      email: 'fatou.ndiaye@example.com',
      phone: '+221 78 987 65 43',
      service: 'tourisme-affaires',
      destination: 'Abidjan',
      notes: 'Séminaire 15 collaborateurs',
    });

    assert(result.subject.includes('NOUVEAU DEVIS'), 'Objet contient NOUVEAU DEVIS');
    assert(result.subject.includes('Fatou Ndiaye'), 'Objet contient le nom du prospect');
    assert(result.html.includes('tel:+221789876543'), 'HTML contient le lien tel: direct');
    assert(result.html.includes('mailto:fatou.ndiaye@example.com'), 'HTML contient le lien mailto: direct');
    assert(result.html.includes('/admin/demandes/devis'), 'HTML contient le lien CRM');
  });

  it('Génère l’alerte responsable pour smartphone', () => {
    const result = templates.generateQuoteManagerEmail({
      reference: 'DV-20261017-1004',
      name: 'Ousmane Sarr',
      email: 'ousmane@example.com',
      phone: '+221 77 444 33 22',
      service: 'transport',
      destination: 'Paris CDG',
      budget: '1 200 000 FCFA',
    });

    assert(result.subject.includes('[DIRECTION]'), 'Objet contient le tag direction');
    assert(result.html.includes('Alerte Direction SLAAC Voyages'), 'HTML contient le bandeau direction');
    assert(result.html.includes('Ousmane Sarr'), 'HTML contient le nom');
  });

  console.log('\n--- 2. Tests Templates Contact & Newsletter ---');

  it('Génère l’accusé de réception contact pour le visiteur (FR & EN)', () => {
    const fr = templates.generateContactCustomerEmail({
      id: 'cnt_123',
      name: 'Mariama Diallo',
      email: 'mariama@example.com',
      message: 'Bonjour, proposez-vous des facilités de paiement en 3 fois ?',
      lang: 'fr',
    });
    assert(fr.subject.includes('Votre message a bien été reçu'), 'Objet FR correct');
    assert(fr.html.includes('Mariama Diallo'), 'Nom présent');
    assert(fr.html.includes('facilités de paiement'), 'Message du visiteur récapitulé');

    const en = templates.generateContactCustomerEmail({
      id: 'cnt_124',
      name: 'David Wilson',
      email: 'david@example.com',
      message: 'Can I rent a chauffeur car for 5 days in Dakar?',
      lang: 'en',
    });
    assert(en.subject.includes('We have received your message'), 'Objet EN correct');
    assert(en.html.includes('Hello David Wilson,'), 'Salutation EN correcte');
  });

  it('Génère l’email de bienvenue newsletter', () => {
    const welcome = templates.generateNewsletterWelcomeEmail('voyageur@example.com', 'fr');
    assert(welcome.subject.includes('Bienvenue'), 'Objet contient Bienvenue');
    assert(welcome.html.includes('SLAAC Voyages'), 'HTML contient le nom de la marque');
    assert(welcome.html.includes('Billetterie aérienne'), 'HTML liste les services');
  });

  console.log('\n--- 3. Tests Configuration & Provider Abstraction ---');

  it('Charge la configuration et sélectionne le mock provider', () => {
    const cfg = configModule.getEmailConfig();
    assert.strictEqual(cfg.provider, 'mock', 'Provider par défaut = mock');
    assert.strictEqual(cfg.agencyEmail, 'contact@slaacvoyages.com', 'Agency email correct');
    assert.strictEqual(cfg.managerEmail, 'mdslaacvoyages@gmail.com', 'Manager email correct');
    assert.strictEqual(cfg.phone, '+221 77 312 90 90', 'Téléphone agence correct');

    const provider = providers.getEmailProvider();
    assert.strictEqual(provider.name, 'mock', 'Provider instance est bien Mock');
  });

  await itAsync('Expédie via le Mock Provider et enregistre en mémoire', async () => {
    const mockClass = providers.MockEmailProvider;
    mockClass.clear();

    const provider = providers.getEmailProvider();
    const res = await provider.send({
      to: 'test@example.com',
      subject: 'Test subject',
      html: '<p>Test html</p>',
      text: 'Test text',
    });

    assert.strictEqual(res.success, true, 'Envoi mock réussi');
    assert(res.messageId.startsWith('mock_'), 'MessageId généré');

    const sent = mockClass.getSentMessages();
    assert.strictEqual(sent.length, 1, '1 message capturé en mémoire');
    assert.strictEqual(sent[0].to, 'test@example.com', 'Destinataire conforme');
    assert.strictEqual(sent[0].subject, 'Test subject', 'Objet conforme');
  });

  await itAsync('Simule un échec du Mock Provider et propage l’erreur proprement', async () => {
    const mockClass = providers.MockEmailProvider;
    mockClass.clear();
    mockClass.setSimulatedFailure(true, 'Simulation panne SMTP');

    const provider = providers.getEmailProvider();
    const res = await provider.send({
      to: 'fail@example.com',
      subject: 'Will fail',
      html: '<p>Will fail</p>',
      text: 'Will fail',
    });

    assert.strictEqual(res.success, false, 'Succès est false');
    assert.strictEqual(res.error, 'Simulation panne SMTP', 'Message d’erreur propagé');

    mockClass.clear(); // Reset
  });

  console.log('\n--- 4. Tests Logique Outbox & Backoff Exponentiel ---');

  it('Calcule la clé d’idempotence unique et déterministe', () => {
    const id1 = outbox.buildOutboxId('quotes', 'DV-20261017-0001', 'customer');
    const id2 = outbox.buildOutboxId('quotes', 'DV-20261017-0001', 'agency');
    const id3 = outbox.buildOutboxId('quotes', 'DV-20261017-0001', 'customer');

    assert.strictEqual(id1, 'quotes_DV-20261017-0001_customer', 'Format ID client conforme');
    assert.strictEqual(id2, 'quotes_DV-20261017-0001_agency', 'Format ID agence conforme');
    assert.strictEqual(id1, id3, 'Idempotence : même ID pour même lead + destinataire');
    assert.notStrictEqual(id1, id2, 'ID distinct par type de destinataire');
  });

  it('Calcule le backoff exponentiel avec jitter raisonnable', () => {
    const b1 = outbox.calculateBackoffMs(1, 30);
    assert(b1 >= 30000 && b1 <= 45000, `Backoff 1 attendu entre 30s et 45s, reçu: ${b1}ms`);

    const b2 = outbox.calculateBackoffMs(2, 30);
    assert(b2 >= 60000 && b2 <= 75000, `Backoff 2 attendu entre 60s et 75s, reçu: ${b2}ms`);

    const b3 = outbox.calculateBackoffMs(3, 30);
    assert(b3 >= 120000 && b3 <= 135000, `Backoff 3 attendu entre 120s et 135s, reçu: ${b3}ms`);

    const b10 = outbox.calculateBackoffMs(10, 30);
    assert(b10 <= 3615000, `Plafond 1h respecté, reçu: ${b10}ms`);
  });

  console.log('\n============================================================');
  console.log(`Résultats des tests : ${testsPassed} réussis, ${testsFailed} échoués`);
  console.log('============================================================');

  if (testsFailed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
