import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const BASE_URL = 'http://localhost:3100';
const ROUTES = [
  '/',
  '/hebergement',
  '/transport',
  '/voyages-croisieres',
  '/excursions',
  '/tourisme-affaires',
  '/destinations',
  '/contact',
  '/dakar-2026',
  '/admin/login',
];

mkdirSync('/tmp/slaac-lh-post', { recursive: true });

const results = [];

for (const route of ROUTES) {
  const url = `${BASE_URL}${route}`;
  const outPath = `/tmp/slaac-lh-post/${route.replace(/\//g, '_') || 'home'}.json`;
  console.log(`Auditing ${route} (${url})...`);

  try {
    execSync(
      `npx --yes lighthouse "${url}" ` +
      `--chrome-flags="--headless=new --no-sandbox --disable-dev-shm-usage" ` +
      `--form-factor=mobile --screenEmulation.mobile ` +
      `--no-enable-error-reporting ` +
      `--output=json --output-path="${outPath}" ` +
      `--only-categories=performance,accessibility,best-practices,seo ` +
      `--quiet`,
      { stdio: 'pipe', timeout: 120000 }
    );

    const data = JSON.parse(readFileSync(outPath, 'utf8'));
    const c = data.categories;
    const a = data.audits;

    const row = {
      route,
      performance: Math.round((c.performance?.score ?? 0) * 100),
      accessibility: Math.round((c.accessibility?.score ?? 0) * 100),
      bestPractices: Math.round((c['best-practices']?.score ?? 0) * 100),
      seo: Math.round((c.seo?.score ?? 0) * 100),
      fcp: a['first-contentful-paint']?.displayValue ?? 'N/A',
      lcp: a['largest-contentful-paint']?.displayValue ?? 'N/A',
      tbt: a['total-blocking-time']?.displayValue ?? 'N/A',
      cls: a['cumulative-layout-shift']?.displayValue ?? 'N/A',
      speedIndex: a['speed-index']?.displayValue ?? 'N/A',
      ttfb: a['server-response-time']?.displayValue ?? 'N/A',
      totalByteWeight: a['total-byte-weight']?.displayValue ?? 'N/A',
    };
    results.push(row);
    console.log(`  ✓ ${route} -> Perf: ${row.performance}, LCP: ${row.lcp}, TBT: ${row.tbt}, CLS: ${row.cls}`);
  } catch (err) {
    console.error(`  ✗ Error on ${route}:`, err.message);
    results.push({
      route,
      error: err.message,
    });
  }
}

writeFileSync('reports/post-optimization-data.json', JSON.stringify(results, null, 2));
console.log('Finished measuring post-optimization. Results saved to reports/post-optimization-data.json');
