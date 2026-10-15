import assert from 'node:assert';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(join(ROOT, 'package.json'));

function loadEnvLocal() {
  try {
    const envLocal = readFileSync(join(ROOT, '.env.local'), 'utf8');
    for (const line of envLocal.split('\n')) {
      const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (match && !process.env[match[1]]) {
        let val = match[2].trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        process.env[match[1]] = val;
      }
    }
  } catch (e) {
    console.warn('Impossible de lire .env.local:', e.message);
  }
}
loadEnvLocal();

// Compilation temporaire des modules TypeScript
const outDir = mkdtempSync(join(ROOT, '.next/cache/analytics-test-'));
execFileSync(
  join(ROOT, 'node_modules', '.bin', 'tsc'),
  [
    '--module', 'commonjs', '--target', 'es2022', '--moduleResolution', 'node',
    '--esModuleInterop', '--skipLibCheck', '--outDir', outDir,
    join(ROOT, 'src/lib/analytics.ts'),
    join(ROOT, 'src/lib/country-labels.ts'),
    join(ROOT, 'src/lib/firebase-admin.ts'),
  ],
  { stdio: 'inherit' }
);

const { isBot, normalizeSource, sanitizeUtm, getDakarDate, recordAnalyticsEvent, getAggregatedDailyStats } =
  require(join(outDir, 'analytics.js'));
const { getCountryInfo } = require(join(outDir, 'country-labels.js'));

async function run() {
  console.log('--- TEST INTEGRATION ANALYTICS ---');

  // Test 1: Filtrage des robots
  assert.strictEqual(isBot('Googlebot/2.1 (+http://www.google.com/bot.html)'), true);
  assert.strictEqual(isBot('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)'), false);
  console.log('✓ Filtrage des robots validé');

  // Test 2: Normalisation des sources
  assert.strictEqual(normalizeSource('google', '', 'cpc'), 'google_ads');
  assert.strictEqual(normalizeSource('', 'https://www.facebook.com/feed'), 'facebook');
  assert.strictEqual(normalizeSource('', 'https://instagram.com/p/123'), 'instagram');
  assert.strictEqual(normalizeSource('', 'https://wa.me/221'), 'whatsapp');
  assert.strictEqual(normalizeSource('', ''), 'direct');
  console.log('✓ Normalisation des canaux marketing validée');

  // Test 3: Normalisation des pays
  assert.strictEqual(getCountryInfo('SN').name, 'Sénégal');
  assert.strictEqual(getCountryInfo('FR').name, 'France');
  assert.strictEqual(getCountryInfo('US').flag, '🇺🇸');
  console.log('✓ Correspondance géographique validée');

  // Test 4: Enregistrement et agrégation Firestore
  const testDate = getDakarDate();
  console.log(`Test d'enregistrement atomique pour la date ${testDate}...`);
  await recordAnalyticsEvent({
    page: '/dakar-2026',
    eventType: 'page_view',
    source: 'google',
    medium: 'organic',
    campaign: 'test-2026',
    device: 'mobile',
    vercelCountry: 'SN',
  });

  const daily = await getAggregatedDailyStats(1);
  assert.ok(daily.length > 0);
  assert.ok(daily[0].pageViews > 0);
  console.log(`✓ Agrégation journalière vérifiée : ${daily[0].pageViews} vues enregistrées`);

  console.log('\nTOUS LES TESTS DU MOTEUR ANALYTICS ONT RÉUSSI !');
  process.exit(0);
}

run().catch((err) => {
  console.error('Erreur test analytics:', err);
  process.exit(1);
});
