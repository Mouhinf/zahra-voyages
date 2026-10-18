import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const BASE_URL = process.argv[2] || 'http://localhost:3100';
const OUT_FILE = process.argv[3] || 'reports/05/metrics-before.json';

const ROUTES = [
  '/',
  '/hebergement',
  '/transport',
  '/voyages-croisieres',
  '/excursions',
  '/tourisme-affaires',
  '/assistance-voyage',
  '/destinations',
  '/dakar-2026',
  '/contact',
  '/en',
  '/hebergement/azalai-hotel-dakar',
  '/admin/login'
];

mkdirSync('/tmp/slaac-lh-suite', { recursive: true });
mkdirSync('reports/05', { recursive: true });

console.log(`Starting performance benchmark against ${BASE_URL}...`);
const results = [];

for (const route of ROUTES) {
  const url = `${BASE_URL}${route}`;
  const slug = route === '/' ? 'home' : route.replace(/[^a-zA-Z0-9]/g, '_');
  const outPath = `/tmp/slaac-lh-suite/${slug}.json`;

  console.log(`\nAuditing ${route} (${url})...`);

  try {
    execSync(
      `npx --yes lighthouse "${url}" ` +
      `--chrome-flags="--headless=new --no-sandbox --disable-dev-shm-usage" ` +
      `--form-factor=mobile --screenEmulation.mobile ` +
      `--no-enable-error-reporting ` +
      `--output=json --output-path="${outPath}" ` +
      `--only-categories=performance,accessibility,best-practices,seo ` +
      `--quiet`,
      { stdio: 'pipe', timeout: 180000 }
    );

    const data = JSON.parse(readFileSync(outPath, 'utf8'));
    const c = data.categories || {};
    const a = data.audits || {};

    // Calcul des tailles réseau par ressource
    const networkItems = a['network-requests']?.details?.items || [];
    let jsBytes = 0;
    let imgBytes = 0;
    let totalBytes = 0;
    let requestsCount = networkItems.length;

    for (const item of networkItems) {
      const bytes = item.transferSize || 0;
      totalBytes += bytes;
      if (item.resourceType === 'Script') jsBytes += bytes;
      if (item.resourceType === 'Image') imgBytes += bytes;
    }

    const row = {
      route,
      url,
      timestamp: new Date().toISOString(),
      scores: {
        performance: Math.round((c.performance?.score ?? 0) * 100),
        accessibility: Math.round((c.accessibility?.score ?? 0) * 100),
        bestPractices: Math.round((c['best-practices']?.score ?? 0) * 100),
        seo: Math.round((c.seo?.score ?? 0) * 100),
      },
      metrics: {
        fcp: a['first-contentful-paint']?.displayValue ?? 'N/A',
        fcpNumeric: Math.round(a['first-contentful-paint']?.numericValue ?? 0),
        lcp: a['largest-contentful-paint']?.displayValue ?? 'N/A',
        lcpNumeric: Math.round(a['largest-contentful-paint']?.numericValue ?? 0),
        tbt: a['total-blocking-time']?.displayValue ?? 'N/A',
        tbtNumeric: Math.round(a['total-blocking-time']?.numericValue ?? 0),
        cls: a['cumulative-layout-shift']?.displayValue ?? 'N/A',
        clsNumeric: Number((a['cumulative-layout-shift']?.numericValue ?? 0).toFixed(3)),
        speedIndex: a['speed-index']?.displayValue ?? 'N/A',
        ttfb: a['server-response-time']?.displayValue ?? 'N/A',
        ttfbNumeric: Math.round(a['server-response-time']?.numericValue ?? 0),
      },
      network: {
        requestsCount,
        totalBytes,
        totalKiB: Math.round(totalBytes / 1024),
        jsBytes,
        jsKiB: Math.round(jsBytes / 1024),
        imgBytes,
        imgKiB: Math.round(imgBytes / 1024),
      }
    };

    results.push(row);
    console.log(`  ✓ ${route} -> Score: ${row.scores.performance} | LCP: ${row.metrics.lcp} | TBT: ${row.metrics.tbt} | CLS: ${row.metrics.cls} | JS: ${row.network.jsKiB} KiB`);
  } catch (err) {
    console.error(`  ✗ Error on ${route}:`, err.message);
    results.push({
      route,
      url,
      error: err.message,
    });
  }
}

writeFileSync(OUT_FILE, JSON.stringify(results, null, 2));
console.log(`\nBenchmark completed. Results written to ${OUT_FILE}`);
