import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE = 'http://localhost:3100';
const OUT_DIR = path.resolve('reports/04/screenshots');

fs.mkdirSync(OUT_DIR, { recursive: true });

async function run() {
  console.log('Launching browser for initial screenshots...');
  const browser = await chromium.launch({ channel: 'chrome', args: ['--no-sandbox'] });
  
  // 1. Desktop Home (1280x800)
  {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(OUT_DIR, 'initial-desktop-home.png'), fullPage: false });
    console.log('✓ Captured initial-desktop-home.png');
    
    // Open Quote Dialog on desktop
    const quoteBtn = page.locator('button[aria-label="Demander un devis"]').first();
    if (await quoteBtn.isVisible()) {
      await quoteBtn.click();
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(OUT_DIR, 'initial-quote-dialog.png') });
      console.log('✓ Captured initial-quote-dialog.png');
    }
    await page.close();
  }

  // 2. Mobile Home & Menu (390x844)
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(OUT_DIR, 'initial-mobile-home.png'), fullPage: false });
    console.log('✓ Captured initial-mobile-home.png');

    // Click Hamburger
    const menuBtn = page.locator('button:has(svg.lucide-menu), button[aria-label*="menu" i]').first();
    if (await menuBtn.isVisible()) {
      await menuBtn.click();
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(OUT_DIR, 'initial-mobile-menu.png') });
      console.log('✓ Captured initial-mobile-menu.png');
    }
    await page.close();
  }

  // 3. Service pages
  const pages = [
    { url: '/hebergement', name: 'initial-hebergement.png' },
    { url: '/transport', name: 'initial-transport.png' },
    { url: '/excursions', name: 'initial-excursions.png' },
    { url: '/assistance-voyage', name: 'initial-assistance.png' },
    { url: '/dakar-2026', name: 'initial-dakar-2026.png' },
    { url: '/en', name: 'initial-en.png' },
    { url: '/admin', name: 'initial-admin-mobile.png', mobile: true },
  ];

  for (const p of pages) {
    const page = await browser.newPage({
      viewport: p.mobile ? { width: 390, height: 844 } : { width: 1280, height: 800 },
      isMobile: !!p.mobile,
      hasTouch: !!p.mobile,
    });
    try {
      await page.goto(`${BASE}${p.url}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(OUT_DIR, p.name), fullPage: false });
      console.log(`✓ Captured ${p.name}`);
    } catch (err) {
      console.error(`Failed ${p.name}:`, err.message);
    }
    await page.close();
  }

  await browser.close();
  console.log('All initial screenshots captured!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
