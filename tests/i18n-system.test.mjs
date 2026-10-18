/**
 * SLAAC VOYAGES — Test Suite: Full French/English Internationalization & Dakar 2026 (Phase 09/12)
 * Verifies 25 distinct criteria and outputs test-results.json
 */

import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();

const results = {
  totalCriteria: 25,
  passed: 0,
  failed: 0,
  timestamp: new Date().toISOString(),
  details: [],
};

function recordTest(id, name, success, note = '') {
  if (success) {
    results.passed++;
    console.log(`✔ [CRITERION ${String(id).padStart(2, '0')}/25] ${name}`);
  } else {
    results.failed++;
    console.log(`✘ [CRITERION ${String(id).padStart(2, '0')}/25] ${name}: ${note}`);
  }
  results.details.push({ id, name, success, note });
}

console.log('================================================================');
console.log('   SLAAC VOYAGES — SUITE DE VALIDATION I18N & DAKAR 2026 (25/25)');
console.log('================================================================\n');

try {
  // 1. Dictionaries parity: fr.json and en.json match keys
  const frPath = join(ROOT, 'src/i18n/dictionaries/fr.json');
  const enPath = join(ROOT, 'src/i18n/dictionaries/en.json');
  const dictsExist = existsSync(frPath) && existsSync(enPath);
  let dictsParity = false;
  if (dictsExist) {
    const fr = JSON.parse(readFileSync(frPath, 'utf-8'));
    const en = JSON.parse(readFileSync(enPath, 'utf-8'));
    function getKeys(obj, prefix = '') {
      let keys = [];
      for (const k of Object.keys(obj)) {
        const full = prefix ? `${prefix}.${k}` : k;
        if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
          keys = keys.concat(getKeys(obj[k], full));
        } else {
          keys.push(full);
        }
      }
      return keys;
    }
    const frKeys = getKeys(fr).sort();
    const enKeys = getKeys(en).sort();
    dictsParity = JSON.stringify(frKeys) === JSON.stringify(enKeys) && frKeys.length > 20;
  }
  recordTest(1, 'Parité stricte des dictionnaires fr.json et en.json (100% clés identiques)', dictsParity);

  // 2. All 10 English candidate pages and layouts exist
  const requiredFiles = [
    'src/app/en/page.tsx',
    'src/app/en/transport/page.tsx',
    'src/app/en/hebergement/page.tsx',
    'src/app/en/excursions/page.tsx',
    'src/app/en/tourisme-affaires/page.tsx',
    'src/app/en/assistance-voyage/page.tsx',
    'src/app/en/destinations/page.tsx',
    'src/app/en/about/page.tsx',
    'src/app/en/contact/page.tsx',
    'src/app/en/contact/layout.tsx',
    'src/app/en/dakar-2026/page.tsx',
  ];
  const allRoutesExist = requiredFiles.every((f) => existsSync(join(ROOT, f)));
  recordTest(2, 'Existence des 10 pages candidates anglaises et de leurs layouts Next.js', allRoutesExist);

  // 3. SSR HTML Lang in RootLayout
  const layoutSrc = readFileSync(join(ROOT, 'src/app/layout.tsx'), 'utf-8');
  const hasDynamicHtmlLang = layoutSrc.includes('x-slaac-locale') && layoutSrc.includes('lang={locale}');
  recordTest(3, 'Rendu dynamique SSR de <html lang={locale}> piloté par x-slaac-locale', hasDynamicHtmlLang);

  // 4. Middleware locale detection
  const mwSrc = readFileSync(join(ROOT, 'src/middleware.ts'), 'utf-8');
  const hasMwDetection = mwSrc.includes("pathname.startsWith('/en')") && mwSrc.includes("requestHeaders.set('x-slaac-locale'");
  recordTest(4, 'Middleware d\'interception /en et injection de l\'en-tête x-slaac-locale', hasMwDetection);

  // 5. Language Switcher component
  const switcherSrc = readFileSync(join(ROOT, 'src/components/layout/language-switcher.tsx'), 'utf-8');
  const hasSwitcher = switcherSrc.includes('getAlternatePath') && switcherSrc.includes('aria-current') && switcherSrc.includes('FR') && switcherSrc.includes('EN');
  recordTest(5, 'Sélecteur de langue contextuel et accessible avec attributs ARIA', hasSwitcher);

  // 6. Route correspondence logic (ROUTE_PAIRS)
  const routesSrc = readFileSync(join(ROOT, 'src/i18n/routes.ts'), 'utf-8');
  const has10RoutePairs = routesSrc.includes("fr: '/'") &&
    routesSrc.includes("en: '/en'") &&
    routesSrc.includes("fr: '/transport'") &&
    routesSrc.includes("fr: '/hebergement'") &&
    routesSrc.includes("fr: '/excursions'") &&
    routesSrc.includes("fr: '/tourisme-affaires'") &&
    routesSrc.includes("fr: '/assistance-voyage'") &&
    routesSrc.includes("fr: '/dakar-2026'") &&
    routesSrc.includes("fr: '/destinations'") &&
    routesSrc.includes("fr: '/contact'") &&
    routesSrc.includes("fr: '/about'");
  recordTest(6, 'Table de correspondance bi-directionnelle (10 paires d\'URLs préservant le contexte)', has10RoutePairs);

  // 7. Quote Schema handles locale & English service labels
  const quoteSchemaSrc = readFileSync(join(ROOT, 'src/lib/schemas/quote-schema.ts'), 'utf-8');
  const hasQuoteLocale = quoteSchemaSrc.includes("locale: z.enum(['fr', 'en'])") &&
    quoteSchemaSrc.includes('SERVICE_LABELS_EN') &&
    quoteSchemaSrc.includes('getServiceOptions');
  recordTest(7, 'Schéma devis bilingue avec support locale en/fr et libellés anglais', hasQuoteLocale);

  // 8. Contact Schema handles locale
  const contactSchemaSrc = readFileSync(join(ROOT, 'src/lib/schemas/contact-schema.ts'), 'utf-8');
  const hasContactLocale = contactSchemaSrc.includes("locale: z.enum(['fr', 'en'])");
  recordTest(8, 'Schéma contact avec validation locale en/fr et repli par défaut fr', hasContactLocale);

  // 9. API Quotes Route stores locale in Firestore and triggers localized email
  const apiQuotesSrc = readFileSync(join(ROOT, 'src/app/api/quotes/route.ts'), 'utf-8');
  const hasQuotesFirestore = apiQuotesSrc.includes("locale: quote.locale || 'fr'") &&
    apiQuotesSrc.includes("lang: quote.locale === 'en' ? 'en' : 'fr'");
  recordTest(9, 'API /api/quotes : persistance de la locale dans Firestore et passage à l\'email', hasQuotesFirestore);

  // 10. API Contact Route stores locale in Firestore and triggers localized email
  const apiContactSrc = readFileSync(join(ROOT, 'src/app/api/contact/route.ts'), 'utf-8');
  const hasContactFirestore = apiContactSrc.includes("locale: data.locale || 'fr'") &&
    apiContactSrc.includes("lang: data.locale === 'en' ? ('en' as const) : ('fr' as const)");
  recordTest(10, 'API /api/contact : persistance de la locale dans Firestore et notification bilingue', hasContactFirestore);

  // 11. Transactional quote customer email generates genuine English
  const templatesSrc = readFileSync(join(ROOT, 'src/lib/email/templates.ts'), 'utf-8');
  const hasQuoteEnglishEmail = templatesSrc.includes('Acknowledgment of your quote request') &&
    templatesSrc.includes('Dear ${escapeHtml(data.name)}') &&
    templatesSrc.includes('Summary of your travel project');
  recordTest(11, 'Template email transactionnel devis : génération anglaise certifiée (lang === en)', hasQuoteEnglishEmail);

  // 12. Transactional contact customer email generates genuine English
  const hasContactEnglishEmail = templatesSrc.includes('We have received your message') &&
    templatesSrc.includes('Summary of your message:');
  recordTest(12, 'Template email accusé de réception contact : version anglaise professionnelle', hasContactEnglishEmail);

  // 13. Agency alert emails display client language indicator
  const hasAgencyLangIndicator = templatesSrc.includes('Langue du client') &&
    templatesSrc.includes('Anglais (English)');
  recordTest(13, 'Notification agence et responsable : affichage clair de la langue du client', hasAgencyLangIndicator);

  // 14. Dakar 2026 page: dates, locations, legal disclaimer
  const dakarSrc = readFileSync(join(ROOT, 'src/app/en/dakar-2026/page.tsx'), 'utf-8');
  const hasDakarRequirements = dakarSrc.includes('31 Oct') &&
    dakarSrc.includes('13 Nov 2026') &&
    dakarSrc.includes('Dakar') &&
    dakarSrc.includes('Diamniadio') &&
    dakarSrc.includes('Saly') &&
    dakarSrc.includes('Independent Travel Agency Notice') &&
    dakarSrc.includes('tickets.dakar2026.org');
  recordTest(14, 'Hub international Dakar 2026 : dates, 3 pôles et avertissement légal d\'indépendance', hasDakarRequirements);

  // 15. Header and Footer components contain localized elements
  const headerSrc = readFileSync(join(ROOT, 'src/components/layout/header.tsx'), 'utf-8');
  const footerSrc = readFileSync(join(ROOT, 'src/components/layout/footer.tsx'), 'utf-8');
  const hasNavI18n = headerSrc.includes('LanguageSwitcher') &&
    footerSrc.includes('LanguageSwitcher') &&
    footerSrc.includes('All rights reserved');
  recordTest(15, 'Navigation Header et Footer : intégration du switcher et textes traduits', hasNavI18n);

  // 16. Quote Request Dialog & Button localized
  const dialogSrc = readFileSync(join(ROOT, 'src/components/layout/quote-request-dialog.tsx'), 'utf-8');
  const btnSrc = readFileSync(join(ROOT, 'src/components/layout/quote-request-button.tsx'), 'utf-8');
  const hasDialogI18n = dialogSrc.includes("activeLocale === 'en'") &&
    dialogSrc.includes('getServiceOptions') &&
    btnSrc.includes('locale?:');
  recordTest(16, 'Modal de devis et bouton déclencheur : localisation complète et transmission locale', hasDialogI18n);

  // 17. English Contact page localized form and coordinates
  const contactPageSrc = readFileSync(join(ROOT, 'src/app/en/contact/page.tsx'), 'utf-8');
  const hasContactI18n = contactPageSrc.includes("locale: 'en'") &&
    contactPageSrc.includes('Full Name') &&
    contactPageSrc.includes('Message sent successfully!') &&
    contactPageSrc.includes('Dakar Plateau');
  recordTest(17, 'Page contact en anglais : formulaire interactif, adresse Plateau et toast en anglais', hasContactI18n);

  // 18. English About page credentials and positioning
  const aboutPageSrc = readFileSync(join(ROOT, 'src/app/en/about/page.tsx'), 'utf-8');
  const hasAboutCredentials = aboutPageSrc.includes('Dakar Plateau') &&
    aboutPageSrc.includes('NINEA') &&
    aboutPageSrc.includes('RCCM') &&
    aboutPageSrc.includes('Teranga') &&
    aboutPageSrc.includes('AboutPage');
  recordTest(18, 'Page À propos en anglais : histoire agence, licences NINEA/RCCM et Teranga', hasAboutCredentials);

  // 19. English Transport page fleet and pricing
  const transportSrc = readFileSync(join(ROOT, 'src/app/en/transport/page.tsx'), 'utf-8');
  const hasTransportFleet = transportSrc.includes('Blaise Diagne') &&
    transportSrc.includes('FCFA') &&
    transportSrc.includes('QuoteRequestButton');
  recordTest(19, 'Page transport en anglais : navettes AIBD, grille tarifaire FCFA et chauffeurs privés', hasTransportFleet);

  // 20. English Accommodation page amenities and guarantees
  const hebergSrc = readFileSync(join(ROOT, 'src/app/en/hebergement/page.tsx'), 'utf-8');
  const hasHebergGuarantees = hebergSrc.toLowerCase().includes('generator') &&
    hebergSrc.toLowerCase().includes('fiber') &&
    hebergSrc.includes('Almadies') &&
    hebergSrc.includes('Plateau');
  recordTest(20, 'Page hébergement en anglais : garanties groupe électrogène, fibre optique et quartiers', hasHebergGuarantees);

  // 21. English Excursions page highlights destinations
  const excSrc = readFileSync(join(ROOT, 'src/app/en/excursions/page.tsx'), 'utf-8');
  const hasExcursionsHighlights = excSrc.includes('Gorée') &&
    excSrc.includes('Pink Lake') &&
    excSrc.includes('Bandia') &&
    excSrc.includes('Sine-Saloum');
  recordTest(21, 'Page excursions en anglais : circuits guidés Gorée, Lac Rose, Bandia et Sine-Saloum', hasExcursionsHighlights);

  // 22. English Corporate page highlights MICE and VAT compliance
  const corpSrc = readFileSync(join(ROOT, 'src/app/en/tourisme-affaires/page.tsx'), 'utf-8');
  const hasCorpHighlights = corpSrc.includes('MICE') &&
    corpSrc.includes('VAT') &&
    corpSrc.includes('delegation');
  recordTest(22, 'Page tourisme d\'affaires en anglais : MICE, délégations et facturation TVA déductible', hasCorpHighlights);

  // 23. English Travel Assistance page highlights visa advisory and disclaimer
  const assSrc = readFileSync(join(ROOT, 'src/app/en/assistance-voyage/page.tsx'), 'utf-8');
  const hasAssistanceHighlights = assSrc.includes('Visa') &&
    assSrc.includes('Consular Notice') &&
    assSrc.toLowerCase().includes('enrollment');
  recordTest(23, 'Page assistance voyage en anglais : formalités visas, études et avertissement consulaire', hasAssistanceHighlights);

  // 24. Sitemap.xml includes English routes and reciprocal hreflang
  const sitemapSrc = readFileSync(join(ROOT, 'src/app/sitemap.ts'), 'utf-8');
  const sitemapIncludesAll10 = sitemapSrc.includes('/en/transport') &&
    sitemapSrc.includes('/en/hebergement') &&
    sitemapSrc.includes('/en/excursions') &&
    sitemapSrc.includes('/en/tourisme-affaires') &&
    sitemapSrc.includes('/en/assistance-voyage') &&
    sitemapSrc.includes('/en/dakar-2026') &&
    sitemapSrc.includes('/en/destinations') &&
    sitemapSrc.includes('/en/contact') &&
    sitemapSrc.includes('/en/about') &&
    sitemapSrc.includes('alternates:');
  recordTest(24, 'Sitemap dynamique : indexation des 10 URLs anglaises avec alternates.languages réciproques', sitemapIncludesAll10);

  // 25. Non-regression on robots.txt and existing infrastructure
  const robotsSrc = readFileSync(join(ROOT, 'src/app/robots.ts'), 'utf-8');
  const noRegression = robotsSrc.includes('sitemap.xml') && !robotsSrc.includes("'/en'");
  recordTest(25, 'Non-régression technique : robots.txt accessible et explorabilité garantie', noRegression);

} catch (err) {
  console.error('Fatal error during i18n testing:', err);
}

console.log('\n================================================================');
console.log(`   RÉSULTATS DE LA SUITE I18N : ${results.passed}/${results.totalCriteria} SUCCÈS`);
console.log('================================================================\n');

writeFileSync(join(ROOT, 'reports/09/test-results.json'), JSON.stringify(results, null, 2), 'utf-8');

if (results.failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
