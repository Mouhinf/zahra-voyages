// ---------------------------------------------------------------------------
// tests/header-banners.test.mjs — Playwright/Chrome sur le serveur de
// production local. Header compact + bandeau publicitaire dynamique.
// L'API /api/promo-banners est mockée pour piloter les scénarios.
// Lancement : node tests/header-banners.test.mjs [baseUrl]
// ---------------------------------------------------------------------------

import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://localhost:3100';
const results = [];
let page;

function check(name, cond, detail = '') {
  results.push({ name, ok: Boolean(cond), detail });
  console.log(`${cond ? '✓' : '✗'} ${name}${detail ? ` — ${detail}` : ''}`);
}

const TWO_BANNERS = {
  banners: [
    { id: 'a1', message: 'Promo hébergement Saly', href: '/hebergement', ctaLabel: 'Voir les offres', variant: 'or', newTab: false },
    { id: 'a2', message: 'Transferts AIBD avec chauffeur', href: '/transport', ctaLabel: '', variant: 'marine', newTab: false },
  ],
};

async function mockBanners(body) {
  await page.route('**/api/promo-banners', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body ?? { banners: [] }) })
  );
}

async function goHome(width = 1280, height = 800) {
  await page.setViewportSize({ width, height });
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  // Le bandeau monte après hydratation + fetch : attendre son rendu.
  await page.locator('section[aria-label="Annonces promotionnelles"]').waitFor({ state: 'visible', timeout: 10000 });
  await page.waitForTimeout(300);
}

function headerScope() {
  return page.locator('header');
}

async function main() {
  const browser = await chromium.launch({ channel: 'chrome', args: ['--no-sandbox'] });
  page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));

  // --- Boutons icône + navigation -----------------------------------------
  await mockBanners({ banners: [] }); // repli statique Dakar 2026
  await goHome();

  const header = headerScope();
  const wa = header.locator('a[aria-label="Contacter SLAAC Voyages sur WhatsApp"]').first();
  check('WhatsApp : bouton icône présent avec aria-label', (await wa.count()) > 0);
  check('WhatsApp : lien correct', (await wa.getAttribute('href') || '').includes('wa.me/221773129090'));
  const waText = (await wa.textContent() || '').trim();
  check('WhatsApp : plus de texte visible', waText === '');

  const devis = header.locator('[aria-label="Demander un devis"]').first();
  check('Devis : bouton icône présent avec aria-label', (await devis.count()) > 0);
  const devisText = (await devis.textContent() || '').replace(/\s+/g, ' ').trim();
  check('Devis : plus de texte visible dans le header', !devisText.includes('Demander un devis'));
  await devis.click();
  await page.locator('[role="dialog"]').waitFor({ state: 'visible', timeout: 8000 });
  check('Devis : ouvre bien la fenêtre de devis', true);
  // Le formulaire défile toujours (non-régression mission précédente)
  const scrollable = await page.locator('[role="dialog"] div.overflow-y-auto').first().evaluate((el) => el.scrollHeight >= el.clientHeight);
  check('Devis : corps du formulaire scrollable', scrollable);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);

  const jo = header.locator('nav a', { hasText: 'JO Dakar 2026' }).first();
  check('Navigation : libellé exact « JO Dakar 2026 »', (await jo.count()) > 0);
  check('Navigation : lien /dakar-2026 conservé', (await jo.getAttribute('href')) === '/dakar-2026');

  // --- Bandeau : repli statique sans emoji --------------------------------
  const banner = page.locator('section[aria-label="Annonces promotionnelles"]');
  check('Bandeau : présent même sans annonce admin (repli Dakar 2026)', await banner.isVisible());
  const bannerText = await banner.textContent();
  check('Bandeau : aucun emoji décoratif', !/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(bannerText || ''));
  check('Bandeau : repli Dakar 2026 affiché', (bannerText || '').includes('Dakar 2026'));

  // --- Rotation avec deux annonces mockées --------------------------------
  await page.unroute('**/api/promo-banners');
  await mockBanners(TWO_BANNERS);
  await goHome();
  const text1 = await banner.textContent();
  check('Rotation : première annonce affichée', (text1 || '').includes('Promo hébergement Saly'));

  // Contrôle suivant → deuxième annonce immédiatement
  await banner.locator('button[aria-label="Annonce suivante"]').click();
  await page.waitForTimeout(600);
  const text2 = await banner.textContent();
  check('Rotation : contrôle « suivant » fonctionne', (text2 || '').includes('Transferts AIBD'));

  // Lien de la première annonce (retour + vérif href)
  await banner.locator('button[aria-label="Annonce précédente"]').click();
  await page.waitForTimeout(600);
  const link = banner.locator('a[href="/hebergement"]').first();
  check('Rotation : annonce cliquable vers /hebergement', (await link.count()) > 0);

  // Auto-rotation après ~5 s
  await page.waitForTimeout(5400);
  const text3 = await banner.textContent();
  check('Rotation : passage automatique (~5 s)', (text3 || '').includes('Transferts AIBD'), text3?.slice(0, 40));

  // Une seule annonce → pas de contrôles, pas de rotation
  await page.unroute('**/api/promo-banners');
  await mockBanners({ banners: [TWO_BANNERS.banners[0]] });
  await goHome();
  check('Annonce unique : contrôles masqués', (await banner.locator('button[aria-label="Annonce suivante"]').count()) === 0);
  const stable1 = await banner.textContent();
  await page.waitForTimeout(5500);
  const stable2 = await banner.textContent();
  check('Annonce unique : aucune rotation', stable1 === stable2);

  // --- Débordements sur toutes les largeurs --------------------------------
  const mock = async () => { await page.unroute('**/api/promo-banners'); await mockBanners(TWO_BANNERS); };
  for (const w of [320, 360, 375, 390, 430, 768, 1024, 1280, 1440, 1920]) {
    await mock();
    await goHome(w, 800);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    check(`Largeur ${w}px : aucun débordement horizontal`, overflow <= 0, `+${overflow}px`);
    const h = await page.evaluate(() => {
      const s = document.querySelector('section[aria-label="Annonces promotionnelles"]');
      return s ? s.getBoundingClientRect().height : 0;
    });
    check(`Largeur ${w}px : hauteur du bandeau maîtrisée`, h > 0 && h <= 60, `${Math.round(h)}px`);
  }

  // --- Erreurs JS -----------------------------------------------------------
  check('Aucune erreur JavaScript nouvelle', errors.length === 0, errors[0]?.slice(0, 120));

  await browser.close();
  const failed = results.filter((r) => !r.ok);
  console.log(`\nRésultat : ${results.length - failed.length} réussis, ${failed.length} échoués`);
  process.exit(failed.length > 0 ? 1 : 0);
}

main();
