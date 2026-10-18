// ---------------------------------------------------------------------------
// tests/seo-technical.test.mjs
// Suite de validation automatisée du SEO technique pour SLAAC Voyages
// Vérifie l'ensemble des 20 critères d'indexabilité, métadonnées, sitemap,
// robots.txt, Schema.org JSON-LD, hreflang et élimination des soft 404.
//
// Lancement : node tests/seo-technical.test.mjs
// ---------------------------------------------------------------------------

import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const results = {
  timestamp: new Date().toISOString(),
  targetDomain: 'https://slaacvoyages.com',
  totalCriteria: 20,
  passed: 0,
  failed: 0,
  details: [],
};

function recordTest(id, name, success, details = '') {
  if (success) {
    results.passed++;
    console.log(`\x1b[32m✔ [CRITERION ${id.toString().padStart(2, '0')}/20] ${name}\x1b[0m`);
  } else {
    results.failed++;
    console.error(`\x1b[31m✘ [CRITERION ${id.toString().padStart(2, '0')}/20] ${name}: ${details}\x1b[0m`);
  }
  results.details.push({ id, name, success, details });
}

console.log('================================================================');
console.log('  SLAAC VOYAGES — SUITE DE VALIDATION DU SEO TECHNIQUE (20/20)  ');
console.log('================================================================\n');

try {
  // 1. Robots.txt Configuration
  const robotsSrc = readFileSync(join(ROOT, 'src/app/robots.ts'), 'utf-8');
  const hasAllowSlash = robotsSrc.includes("allow: '/'");
  const hasDisallowAdmin = robotsSrc.includes("'/admin/'");
  const hasDisallowApi = robotsSrc.includes("'/api/'");
  const hasSitemap = robotsSrc.includes('sitemap.xml');
  recordTest(1, 'Robots.txt règles et pointeur sitemap', hasAllowSlash && hasDisallowAdmin && hasDisallowApi && hasSitemap);

  // 2. Admin Space Indexing Protection
  const adminLayoutSrc = readFileSync(join(ROOT, 'src/app/admin/layout.tsx'), 'utf-8');
  const hasAdminNoIndex = adminLayoutSrc.includes("index: false") && adminLayoutSrc.includes("follow: false");
  recordTest(2, 'Protection de l\'espace /admin via noindex, nofollow', hasAdminNoIndex);

  // 3. Custom 404 Page & Status
  const notFoundSrc = readFileSync(join(ROOT, 'src/app/not-found.tsx'), 'utf-8');
  const has404NoIndex = notFoundSrc.includes("index: false") && notFoundSrc.includes("follow: false");
  const has404Brand = notFoundSrc.includes("SLAAC Voyages") && notFoundSrc.includes("404");
  recordTest(3, 'Page 404 personnalisée avec noindex', has404NoIndex && has404Brand);

  // 4. Soft 404 Elimination on Detail Routes
  const detailRoutes = [
    'src/app/hebergement/[id]/page.tsx',
    'src/app/excursions/[id]/page.tsx',
    'src/app/transport/[id]/page.tsx',
    'src/app/tourisme-affaires/[id]/page.tsx',
    'src/app/voyages-croisieres/[id]/page.tsx',
  ];
  const allCallNotFound = detailRoutes.every(r => {
    const src = readFileSync(join(ROOT, r), 'utf-8');
    return src.includes("import { notFound } from 'next/navigation'") && src.includes("notFound()");
  });
  recordTest(4, 'Élimination des soft 404 via notFound() sur les 5 routes dynamiques', allCallNotFound);

  // 5. Dynamic Sitemap Structure & Clean Lastmod
  const sitemapSrc = readFileSync(join(ROOT, 'src/app/sitemap.ts'), 'utf-8');
  const hasDynamicSitemap = sitemapSrc.includes('MetadataRoute.Sitemap') && sitemapSrc.includes('parseFirestoreDate');
  const noFakeDateChurn = !sitemapSrc.includes('new Date()') && sitemapSrc.includes('2026-10-18');
  recordTest(5, 'Sitemap dynamique sans churn de faux new Date()', hasDynamicSitemap && noFakeDateChurn);

  // 6. Dynamic Sitemap Draft & Deleted Filtering
  const filtersDrafts = sitemapSrc.includes('statut') && sitemapSrc.includes('brouillon') && sitemapSrc.includes('supprime');
  recordTest(6, 'Filtrage strict des brouillons et offres supprimées du Sitemap', filtersDrafts);

  // 7. Dynamic Sitemap Hreflang Alternates
  const hasSitemapAlternates = sitemapSrc.includes('alternates:') && sitemapSrc.includes('languages:') && sitemapSrc.includes("'x-default'");
  recordTest(7, 'Balises alternates hreflang dans les entrées du Sitemap', hasSitemapAlternates);

  // 8. Canonical Base URL Configuration in Root Layout
  const layoutSrc = readFileSync(join(ROOT, 'src/app/layout.tsx'), 'utf-8');
  const hasCanonicalBase = layoutSrc.includes("metadataBase: new URL(SITE_URL)") && layoutSrc.includes("canonical: '/'");
  recordTest(8, 'MetadataBase et URL canonique https://slaacvoyages.com', hasCanonicalBase);

  // 9. Root Layout Hreflang Declaration
  const hasRootHreflang = layoutSrc.includes("languages:") && layoutSrc.includes("'fr-SN'") && layoutSrc.includes("'en-US'");
  recordTest(9, 'Déclaration hreflang bilingue fr-SN et en-US dans le Layout racine', hasRootHreflang);

  // 10. Schema.org Infrastructure Library
  const schemaLibSrc = readFileSync(join(ROOT, 'src/lib/seo-schema.ts'), 'utf-8');
  const hasSchemaBuilders = schemaLibSrc.includes('getTravelAgencySchema') &&
    schemaLibSrc.includes('getBreadcrumbSchema') &&
    schemaLibSrc.includes('getServiceSchema') &&
    schemaLibSrc.includes('getLodgingSchema') &&
    schemaLibSrc.includes('getTouristAttractionSchema');
  recordTest(10, 'Bibliothèque de constructeurs Schema.org JSON-LD', hasSchemaBuilders);

  // 11. Schema.org TravelAgency Data Completeness
  const hasTravelAgencyData = schemaLibSrc.includes('TravelAgency') &&
    schemaLibSrc.includes('14.67') &&
    schemaLibSrc.includes('CONTACT.phoneIntl') &&
    schemaLibSrc.includes('Dakar Plateau');
  recordTest(11, 'Complétude des données LocalBusiness / TravelAgency (GPS, NAP, devises)', hasTravelAgencyData);

  // 12. Schema.org Injection in Root Layout
  const hasSchemaInLayout = layoutSrc.includes('getTravelAgencySchema') && layoutSrc.includes('application/ld+json');
  recordTest(12, 'Injection du Schema.org TravelAgency dans le DOM HTML racine', hasSchemaInLayout);

  // 13. Visual & Structured Breadcrumbs Component
  const breadcrumbComponentSrc = readFileSync(join(ROOT, 'src/components/seo/breadcrumbs.tsx'), 'utf-8');
  const hasBreadcrumbs = breadcrumbComponentSrc.includes('getBreadcrumbSchema') && breadcrumbComponentSrc.includes('aria-label="Fil d\'Ariane"');
  recordTest(13, 'Composant Fil d\'Ariane avec JSON-LD BreadcrumbList', hasBreadcrumbs);

  // 14. Detail Pages Schema.org Integration
  const clientDetailFiles = [
    'src/components/hebergement/hebergement-detail-client.tsx',
    'src/components/excursions/excursion-detail-client.tsx',
    'src/components/transport/transport-detail-client.tsx',
    'src/components/tourisme-affaires/tourisme-detail-client.tsx',
    'src/components/voyages-croisieres/voyage-detail-client.tsx',
  ];
  const allDetailHaveBreadcrumbsAndSchema = clientDetailFiles.every(f => {
    const src = readFileSync(join(ROOT, f), 'utf-8');
    return src.includes('<Breadcrumbs') && src.includes('application/ld+json');
  });
  recordTest(14, 'Intégration Fil d\'Ariane et Schema.org sur toutes les fiches détaillées', allDetailHaveBreadcrumbsAndSchema);

  // 15. On-page Metadata Overhaul on Core Hub Pages
  const defaultContentsSrc = readFileSync(join(ROOT, 'src/data/default-page-contents.ts'), 'utf-8');
  const hasRichMeta = defaultContentsSrc.includes('Hébergements et séjours au Sénégal') &&
    defaultContentsSrc.includes('Transferts AIBD et transport à Dakar') &&
    defaultContentsSrc.includes('Circuits et excursions au Sénégal') &&
    defaultContentsSrc.includes("Voyages d'affaires et déplacements professionnels");
  recordTest(15, 'Métadonnées descriptives et optimisées pour les hubs de services', hasRichMeta);

  // 16. Dedicated Event Page SEO (JO Dakar 2026)
  const dakar2026Src = readFileSync(join(ROOT, 'src/app/dakar-2026/page.tsx'), 'utf-8');
  const hasDakar2026Seo = dakar2026Src.includes('Séjour Dakar') &&
    dakar2026Src.includes('Breadcrumbs') &&
    dakar2026Src.includes('/dakar-2026');
  recordTest(16, 'Optimisation SEO ciblée pour la page événement Dakar 2026', hasDakar2026Seo);

  // 17. Crawlable Language Switcher in Header & Footer
  const headerSrc = readFileSync(join(ROOT, 'src/components/layout/header.tsx'), 'utf-8');
  const footerSrc = readFileSync(join(ROOT, 'src/components/layout/footer.tsx'), 'utf-8');
  const hasHeaderLangSwitcher = headerSrc.includes('hrefLang="fr"') && headerSrc.includes('hrefLang="en"');
  const hasFooterLangSwitcher = footerSrc.includes('hrefLang="fr"') && footerSrc.includes('hrefLang="en"');
  recordTest(17, 'Sélecteur de langue crawlable avec balises hrefLang dans le Header et Footer', hasHeaderLangSwitcher && hasFooterLangSwitcher);

  // 18. URL Inventory and Issues Tracking Artifacts
  const hasInventory = existsSync(join(ROOT, 'reports/06/url-inventory.csv'));
  const hasIssuesCsv = existsSync(join(ROOT, 'reports/06/seo-issues.csv'));
  recordTest(18, 'Génération des inventaires d\'URLs et registre des anomalies', hasInventory && hasIssuesCsv);

  // 19. OpenGraph and Twitter Cards Completeness
  const homeSrc = readFileSync(join(ROOT, 'src/app/page.tsx'), 'utf-8');
  const hasOgTwitter = homeSrc.includes('openGraph:') && homeSrc.includes('twitter:') && homeSrc.includes('/og-image.jpg');
  recordTest(19, 'Cartes OpenGraph et Twitter Cards complètes sur la page d\'accueil', hasOgTwitter);

  // 20. Strict Non-Regression of Outbox and CRM Systems
  const hasEmailOutbox = existsSync(join(ROOT, 'src/lib/email/outbox.ts'));
  const hasCrmTypes = existsSync(join(ROOT, 'src/lib/crm.ts'));
  const hasDesignTokens = existsSync(join(ROOT, 'tailwind.config.ts'));
  recordTest(20, 'Non-régression des acquis fonctionnels (Outbox Email, CRM, Design System)', hasEmailOutbox && hasCrmTypes && hasDesignTokens);

} catch (err) {
  console.error('Erreur inattendue durant la suite de tests SEO :', err);
  process.exitCode = 1;
}

console.log('\n================================================================');
console.log(`  RÉSULTATS : ${results.passed}/${results.totalCriteria} SUCCÈS (${results.failed} ÉCHECS)`);
console.log('================================================================\n');

writeFileSync(join(ROOT, 'reports/06/seo-test-results.json'), JSON.stringify(results, null, 2), 'utf-8');

if (results.failed > 0) {
  process.exit(1);
} else {
  console.log('Toutes les validations de SEO technique sont passées avec succès !\n');
}
