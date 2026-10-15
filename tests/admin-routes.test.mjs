// ---------------------------------------------------------------------------
// tests/admin-routes.test.mjs — Playwright/Chrome sur le serveur de production
// local. Vérifie que chaque rubrique du back-office est une route distincte
// protégée : sans session admin, toute route doit revenir à /admin/login, et
// les anciennes URLs doivent être redirigées vers leur nouvelle route.
//
// Ce test ne couvre PAS le contenu authentifié (il faudrait un compte admin
// réel ou un émulateur Auth) : voir le bilan de la refonte.
//
// Lancement : node tests/admin-routes.test.mjs [baseUrl]
// ---------------------------------------------------------------------------

import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://localhost:3100';
const results = [];

function check(name, cond, detail = '') {
  results.push({ name, ok: Boolean(cond), detail });
  console.log(`${cond ? '✓' : '✗'} ${name}${detail ? ` — ${detail}` : ''}`);
}

// Routes protégées implémentées (une par rubrique du menu + sous-pages CRM).
const PROTECTED_ROUTES = [
  '/admin/dashboard',
  '/admin/demandes',
  '/admin/demandes/devis',
  '/admin/demandes/contacts',
  '/admin/demandes/newsletter',
  '/admin/demandes/devis/exemple-id',
  '/admin/demandes/contacts/exemple-id',
  '/admin/statistiques',
  '/admin/destinations',
  '/admin/hebergements',
  '/admin/transports',
  '/admin/voyages-croisieres',
  '/admin/excursions',
  '/admin/tourisme-affaires',
  '/admin/partenaires',
  '/admin/marketing/bandeau',
];

const LEGACY_REDIRECTS = [
  ['/admin', '/admin/login'],
  ['/admin/marketing', '/admin/login'],
  ['/admin/quotes', '/admin/login'],
];

const browser = await chromium.launch({ channel: 'chrome', args: ['--no-sandbox'] });
try {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  for (const route of PROTECTED_ROUTES) {
    await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded' });
    try {
      await page.waitForURL(/\/admin\/login/, { timeout: 15000 });
      check(`${route} : sans session → redirigé vers /admin/login`, true);
    } catch {
      check(`${route} : sans session → redirigé vers /admin/login`, false, `URL finale : ${page.url()}`);
    }
  }

  for (const [from, expected] of LEGACY_REDIRECTS) {
    await page.goto(`${BASE}${from}`, { waitUntil: 'domcontentloaded' });
    try {
      await page.waitForURL((url) => url.pathname.startsWith(expected), { timeout: 15000 });
      check(`${from} : redirection héritée`, true);
    } catch {
      check(`${from} : redirection héritée`, false, `URL finale : ${page.url()}`);
    }
  }

  // Page de connexion : rendu et absence de débordement horizontal sur mobile.
  const mobile = await browser.newContext({ viewport: { width: 375, height: 740 } });
  const mobilePage = await mobile.newPage();
  const response = await mobilePage.goto(`${BASE}/admin/login`, { waitUntil: 'domcontentloaded' });
  check('/admin/login accessible sans session', response?.status() === 200, `HTTP ${response?.status()}`);
  const overflow = await mobilePage.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  check('/admin/login mobile 375px : pas de scroll horizontal', overflow <= 0, `débordement ${overflow}px`);
  await mobile.close();

  await context.close();
} finally {
  await browser.close();
}

const failed = results.filter((r) => !r.ok);
console.log(`\nRésultat : ${results.length - failed.length} réussis, ${failed.length} échoués`);
process.exit(failed.length ? 1 : 0);
