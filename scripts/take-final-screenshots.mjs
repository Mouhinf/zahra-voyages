import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE = 'http://localhost:3100';
const OUT_DIR = path.resolve('reports/04/screenshots');

fs.mkdirSync(OUT_DIR, { recursive: true });

async function run() {
  console.log('Launching browser for final screenshots...');
  const browser = await chromium.launch({ channel: 'chrome', args: ['--no-sandbox'] });
  
  // 1. Desktop Home (1280x800)
  {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(OUT_DIR, 'final-desktop-home.png'), fullPage: false });
    console.log('✓ Captured final-desktop-home.png');
    
    // Open Quote Dialog on desktop
    const quoteBtn = page.locator('button[aria-label="Demander un devis"]').first();
    if (await quoteBtn.isVisible()) {
      await quoteBtn.click();
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(OUT_DIR, 'final-quote-dialog.png') });
      console.log('✓ Captured final-quote-dialog.png');
    }
    await page.close();
  }

  // 2. Mobile Home & Menu (390x844)
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(OUT_DIR, 'final-mobile-home.png'), fullPage: false });
    console.log('✓ Captured final-mobile-home.png');

    // Click Hamburger
    const menuBtn = page.locator('button:has(svg.lucide-menu), button[aria-label*="menu" i]').first();
    if (await menuBtn.isVisible()) {
      await menuBtn.click();
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(OUT_DIR, 'final-mobile-menu.png') });
      console.log('✓ Captured final-mobile-menu.png');
    }
    await page.close();
  }

  // 3. Service pages
  const pages = [
    { url: '/hebergement', name: 'final-hebergement.png' },
    { url: '/transport', name: 'final-transport.png' },
    { url: '/excursions', name: 'final-excursions.png' },
    { url: '/assistance-voyage', name: 'final-assistance.png' },
    { url: '/dakar-2026', name: 'final-dakar-2026.png' },
    { url: '/en', name: 'final-en.png' },
    { url: '/admin', name: 'final-admin-mobile.png', mobile: true },
  ];

  for (const p of pages) {
    const page = await browser.newPage({
      viewport: p.mobile ? { width: 390, height: 844 } : { width: 1280, height: 800 },
      isMobile: Boolean(p.mobile),
      hasTouch: Boolean(p.mobile),
    });
    try {
      await page.goto(`${BASE}${p.url}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(1500);
      await page.screenshot({ path: path.join(OUT_DIR, p.name), fullPage: false });
      console.log(`✓ Captured ${p.name}`);
    } catch (e) {
      console.error(`✗ Error capturing ${p.name}:`, e.message);
    }
    await page.close();
  }

  await browser.close();
  console.log('All final screenshots captured successfully!');
}

run().catch((err) => {
  console.error('Final screenshot script failed:', err);
  process.exit(1);
});
