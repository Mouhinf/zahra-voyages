// Tests responsive des formulaires (Playwright, Chromium local).
// Usage : node tests/forms-responsive.test.mjs [baseUrl]
// Prérequis : serveur de production démarré (ex. http://localhost:3100).

import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://localhost:3100';
const results = [];
let page;

function check(name, cond, detail = '') {
  results.push({ name, ok: Boolean(cond), detail });
  console.log(`${cond ? '✓' : '✗'} ${name}${detail ? ` — ${detail}` : ''}`);
}

const VIEWPORTS = [
  { name: 'mobile 320x568', w: 320, h: 568 },
  { name: 'mobile 360x640', w: 360, h: 640 },
  { name: 'mobile 390x844', w: 390, h: 844 },
  { name: 'tablette 768x1024', w: 768, h: 1024 },
  { name: 'desktop 1280x800', w: 1280, h: 800 },
  { name: 'faible hauteur 1024x568', w: 1024, h: 568 },
];

async function openQuoteDialog() {
  // Le CTA du hero est le plus haut de la page d'accueil.
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  const trigger = page.locator('button:has-text("Demander un devis"):visible').first();
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();
  await page.locator('[role="dialog"]').waitFor({ state: 'visible', timeout: 10000 });
  // Laisser l'arbre du formulaire se stabiliser après l'ouverture (le
  // dialog est chargé en React.lazy) — un utilisateur réel ne peut pas
  // taper dans les 100 ms ; sans ce délai le fill tombe sur l'ancien montage.
  await page.waitForTimeout(600);
  return page.locator('[role="dialog"]');
}

async function testQuoteDialog(vp) {
  const dialog = await openQuoteDialog();
  const box = await dialog.boundingBox();
  check(`[${vp.name}] modale visible`, Boolean(box));
  if (!box) return;

  check(
    `[${vp.name}] hauteur ≤ viewport`,
    box.height <= vp.h + 1,
    `modale ${Math.round(box.height)}px / écran ${vp.h}px`
  );
  check(
    `[${vp.name}] largeur ≤ viewport`,
    box.width <= vp.w + 1,
    `modale ${Math.round(box.width)}px`
  );

  // Pas de débordement horizontal de la page.
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  check(`[${vp.name}] pas de scroll horizontal`, overflow <= 0, `débordement ${overflow}px`);

  // Le bouton fermer est visible sans défilement.
  const close = dialog.locator('button:has(svg.lucide-x), button[aria-label], button:has-text("Fermer")').first();
  const closeVisible = await close.isVisible().catch(() => false);
  check(`[${vp.name}] bouton fermer visible`, closeVisible);

  // Le footer d'actions est visible (fixe) même après scroll du corps.
  const footer = dialog.locator('button:has-text("Envoyer ma demande")');
  await dialog.locator('div.overflow-y-auto').first().evaluate((el) => el.scrollTo(0, el.scrollHeight));
  await page.waitForTimeout(150);
  const footerVisible = await footer.waitFor({ state: 'visible', timeout: 3000 }).then(() => true).catch(() => false);
  const footerBox = footerVisible ? await footer.boundingBox() : null;
  check(
    `[${vp.name}] bouton Envoyer visible après scroll complet`,
    footerVisible && footerBox && footerBox.y + footerBox.height <= vp.h + 1,
    footerBox ? `y=${Math.round(footerBox.y)}` : 'introuvable'
  );

  // Le titre reste visible en haut (non recouvert) après scroll.
  const title = dialog.locator('h2, [role="heading"]').first();
  const titleVisible = await title.waitFor({ state: 'visible', timeout: 3000 }).then(() => true).catch(() => false);
  check(`[${vp.name}] titre visible après scroll`, titleVisible);

  // Le corps défile bien (hauteur interne > hauteur visible OU contenu court).
  const scrollable = await dialog
    .locator('div.overflow-y-auto')
    .first()
    .evaluate((el) => ({ sh: el.scrollHeight, ch: el.clientHeight, st: el.scrollTop }));
  check(
    `[${vp.name}] corps défile jusqu'en bas`,
    scrollable.st > 0 || scrollable.sh <= scrollable.ch + 2,
    `scrollTop=${scrollable.st}`
  );

  // Champ conditionnel : changer le service doit afficher des champs dédiés.
  await dialog.locator('button[role="combobox"]').first().click();
  await page.locator('[role="option"]:has-text("Excursions")').first().click();
  const dateField = await dialog
    .locator('input[type="date"]')
    .first()
    .waitFor({ state: 'visible', timeout: 3000 })
    .then(() => true)
    .catch(() => false);
  check(`[${vp.name}] champs conditionnels (excursion) affichés`, dateField);

  // Soumission : API mockée OK → succès + fermeture.
  await page.route('**/api/quotes', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, reference: 'DV-TEST-0001' }) })
  );
  await dialog.locator('input[name="name"], input[placeholder*="nom" i]').first().fill('Test Responsive');
  await dialog.locator('input[type="tel"], input[placeholder*="téléphone" i]').first().fill('+221770000009');
  const [resp] = await Promise.all([
    page.waitForResponse((r) => r.url().includes('/api/quotes'), { timeout: 8000 }).catch(() => null),
    footer.click(),
  ]);
  if (!resp) {
    const errs = await dialog.locator('[role="alert"]').allTextContents();
    console.log(`   [debug ${vp.name}] pas de requête — erreurs validation:`, JSON.stringify(errs));
  } else {
    console.log(`   [debug ${vp.name}] API ${resp.status()}`);
  }
  const success = page.locator('text=DV-TEST-0001').first();
  await success.waitFor({ state: 'visible', timeout: 8000 }).catch(() => {});
  check(`[${vp.name}] soumission → succès + référence affichée`, await success.isVisible().catch(() => false));
  await page.waitForTimeout(600);
  const closedAfterSuccess = await dialog
    .waitFor({ state: 'hidden', timeout: 3000 })
    .then(() => true)
    .catch(() => false);
  check(`[${vp.name}] modale fermée après succès`, closedAfterSuccess);

  // Escape ferme la modale et le scroll de la page est restauré.
  const dialog2 = await openQuoteDialog();
  await page.keyboard.press('Escape');
  const closed = await dialog2
    .waitFor({ state: 'hidden', timeout: 3000 })
    .then(() => true)
    .catch(() => false);
  check(`[${vp.name}] Escape ferme la modale`, closed);
  const scrollRestored = await page.evaluate(() => {
    window.scrollTo({ top: 300, behavior: 'instant' });
    return window.scrollY > 0;
  });
  check(`[${vp.name}] scroll de la page restauré après fermeture`, scrollRestored);
}

async function testErrorPath() {
  // API 400 → la modale reste ouverte, les données sont conservées.
  const dialog = await openQuoteDialog();
  await page.route('**/api/quotes', (route) =>
    route.fulfill({ status: 400, contentType: 'application/json', body: JSON.stringify({ error: 'Champs invalides' }) })
  );
  await dialog.locator('input[name="name"], input[placeholder*="nom" i]').first().fill('Erreur Test');
  await dialog.locator('input[type="tel"], input[placeholder*="téléphone" i]').first().fill('+221770000008');
  await dialog.locator('button:has-text("Envoyer ma demande")').click();
  await page.waitForTimeout(800);
  const stillOpen = await dialog.isVisible();
  const kept = await dialog.locator('input[name="name"], input[placeholder*="nom" i]').first().inputValue();
  check(`[erreur API] modale reste ouverte`, stillOpen);
  check(`[erreur API] données conservées`, kept === 'Erreur Test');
  await page.keyboard.press('Escape');
}

async function testContactPage() {
  await page.setViewportSize({ width: 360, height: 640 });
  await page.goto(`${BASE}/contact`, { waitUntil: 'domcontentloaded' });
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  check(`[contact 360px] pas de scroll horizontal`, overflow <= 0, `débordement ${overflow}px`);
  const btn = page.locator('button[type="submit"]').first();
  await btn.scrollIntoViewIfNeeded();
  check(`[contact 360px] bouton Envoyer accessible`, await btn.isVisible());
}

async function main() {
  // Chrome système (canal stable) : le cache Playwright local correspond à
  // une autre version de la lib. System Chrome est plus fiable ici.
  const browser = await chromium.launch({ channel: 'chrome', args: ['--no-sandbox'] });
  page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  for (const vp of VIEWPORTS) {
    await page.setViewportSize({ width: vp.w, height: vp.h });
    try {
      await testQuoteDialog(vp);
    } catch (e) {
      check(`[${vp.name}] scénario complet`, false, e.message.split('\n')[0]);
    }
  }

  await page.setViewportSize({ width: 360, height: 640 });
  try {
    await testErrorPath();
    await testContactPage();
  } catch (e) {
    check('scénarios erreurs/contact', false, e.message.split('\n')[0]);
  }

  await browser.close();
  const failed = results.filter((r) => !r.ok);
  console.log(`\nRésultat : ${results.length - failed.length} réussis, ${failed.length} échoués`);
  process.exit(failed.length > 0 ? 1 : 0);
}

main();
