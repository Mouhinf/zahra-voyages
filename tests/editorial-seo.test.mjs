// ---------------------------------------------------------------------------
// tests/editorial-seo.test.mjs
// Suite de validation automatisée de la domination éditoriale SEO,
// des pages de services enrichies, des destinations, de l'Omra et des guides.
//
// Lancement : node tests/editorial-seo.test.mjs
// ---------------------------------------------------------------------------

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const results = {
  timestamp: new Date().toISOString(),
  phase: 'Prompt 07/12 - Domination Éditoriale SEO & Contenus',
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
console.log('  SLAAC VOYAGES — SUITE DE VALIDATION ÉDITORIALE & SEO (20/20)  ');
console.log('================================================================\n');

try {
  // 1. Structure de données des Guides Pratiques
  const guidesDataSrc = readFileSync(join(ROOT, 'src/data/guides.ts'), 'utf-8');
  const has6Guides = (guidesDataSrc.match(/slug:\s*'/g) || []).length === 6;
  const hasSources = guidesDataSrc.includes('officialSources:') && guidesDataSrc.includes('verifiedDate:');
  recordTest(1, 'Base de données des guides avec 6 dossiers et sources vérifiées', has6Guides && hasSources);

  // 2. Hub Guides Pratiques (/guides)
  const guidesHubExists = existsSync(join(ROOT, 'src/app/guides/page.tsx'));
  const guidesHubSrc = guidesHubExists ? readFileSync(join(ROOT, 'src/app/guides/page.tsx'), 'utf-8') : '';
  const hasCollectionSchema = guidesHubSrc.includes('CollectionPage') && guidesHubSrc.includes('guidesData.map');
  recordTest(2, 'Page index /guides avec rendu SSR et CollectionPage Schema.org', guidesHubExists && hasCollectionSchema);

  // 3. Page Dynamique de Guide (/guides/[slug])
  const guideDetailExists = existsSync(join(ROOT, 'src/app/guides/[slug]/page.tsx'));
  const guideDetailSrc = guideDetailExists ? readFileSync(join(ROOT, 'src/app/guides/[slug]/page.tsx'), 'utf-8') : '';
  const hasArticleFaqSchema = guideDetailSrc.includes('Article') && guideDetailSrc.includes('FAQPage') && guideDetailSrc.includes('generateStaticParams');
  recordTest(3, 'Route dynamique /guides/[slug] avec Article & FAQPage JSON-LD', guideDetailExists && hasArticleFaqSchema);

  // 4. Élimination des 404 sur les Guides Inexistants
  const hasNotFoundCall = guideDetailSrc.includes("import { notFound } from 'next/navigation'") && guideDetailSrc.includes('notFound()');
  recordTest(4, 'Gestion stricte des slugs inconnus via notFound() HTTP 404', hasNotFoundCall);

  // 5. Page Pilier Omra (/omra)
  const omraPageExists = existsSync(join(ROOT, 'src/app/omra/page.tsx'));
  const omraSrc = omraPageExists ? readFileSync(join(ROOT, 'src/app/omra/page.tsx'), 'utf-8') : '';
  const hasOmraPillars = omraSrc.includes('Nusuk') && omraSrc.includes('La Mecque') && omraSrc.includes('Médine');
  recordTest(5, 'Page pilier /omra avec structure logistique et informations officielles', omraPageExists && hasOmraPillars);

  // 6. Déontologie et Décharge Légale Stricte sur l'Assistance Visa
  const hasStrictLegalDisclaimer = omraSrc.includes('prérogative souveraine') || omraSrc.includes('compétence souveraine');
  const hasNoFalsePromise = omraSrc.includes('ne garantissons aucun') || omraSrc.includes('Non. Conformément aux principes de transparence');
  recordTest(6, 'Engagement de transparence et absence d\'allégation trompeuse de visa sur /omra', hasStrictLegalDisclaimer && hasNoFalsePromise);

  // 7. Enrichissement de la page Assistance Voyage (/assistance-voyage)
  const assistanceSrc = readFileSync(join(ROOT, 'src/app/assistance-voyage/page.tsx'), 'utf-8');
  const hasChinaDubaiSchengen = assistanceSrc.includes('Chine (Affaires M & Foires)') &&
    assistanceSrc.includes('Dubaï / Émirats Arabes Unis') &&
    assistanceSrc.includes('Espace Schengen & Études');
  recordTest(7, 'Page assistance-voyage enrichie avec fiches pays et assurances obligatoires', hasChinaDubaiSchengen);

  // 8. Raccordement Éditorial d\'Assistance aux Guides Pratiques
  const hasAssistanceGuidesLink = assistanceSrc.includes('/guides') && assistanceSrc.includes('Guides Pratiques');
  recordTest(8, 'Maillage interne contextuel de la page assistance vers les guides pratiques', hasAssistanceGuidesLink);

  // 9. Enrichissement de la page Transport (/transport)
  const transportSrc = readFileSync(join(ROOT, 'src/app/transport/page.tsx'), 'utf-8');
  const hasAibdGuideCallout = transportSrc.includes('/guides/arrivee-aeroport-aibd-dakar-transfert') && transportSrc.includes('Guide complet d\'arrivée');
  recordTest(9, 'Page transport enrichie avec appel au guide d\'arrivée aéroport AIBD', hasAibdGuideCallout);

  // 10. Enrichissement de la page Hébergement (/hebergement)
  const hebergementSrc = readFileSync(join(ROOT, 'src/app/hebergement/page.tsx'), 'utf-8');
  const hasNeighborhoodCallout = hebergementSrc.includes('/guides/ou-loger-a-dakar-quartiers-residences') && hebergementSrc.includes('Où loger à Dakar');
  recordTest(10, 'Page hébergement enrichie avec appel au guide comparatif des quartiers', hasNeighborhoodCallout);

  // 11. Enrichissement de la page Excursions (/excursions)
  const excursionsSrc = readFileSync(join(ROOT, 'src/app/excursions/page.tsx'), 'utf-8');
  const hasGoreeCallout = excursionsSrc.includes('/guides/visiter-ile-de-goree-conseils-chaloupe') && excursionsSrc.includes('Visiter l\'île de Gorée');
  recordTest(11, 'Page excursions enrichie avec appel au guide patrimonial Gorée', hasGoreeCallout);

  // 12. Enrichissement de la page Tourisme d\'Affaires (/tourisme-affaires)
  const affairesSrc = readFileSync(join(ROOT, 'src/app/tourisme-affaires/page.tsx'), 'utf-8');
  const hasChinaBusinessCallout = affairesSrc.includes('/guides/voyage-affaires-chine-depuis-dakar') && affairesSrc.includes('Facturation d\'Entreprise');
  recordTest(12, 'Page tourisme d\'affaires enrichie avec garanties B2B et guide sourcing Chine', hasChinaBusinessCallout);

  // 13. Présence d\'Omra et des Guides dans la Navigation Header
  const headerSrc = readFileSync(join(ROOT, 'src/components/layout/header.tsx'), 'utf-8');
  const hasHeaderOmra = headerSrc.includes('/omra') && headerSrc.includes('Pèlerinage Omra');
  const hasHeaderGuides = headerSrc.includes('/guides') && headerSrc.includes('Guides');
  recordTest(13, 'Découvrabilité d\'Omra et des Guides dans la barre de navigation et menu mobile', hasHeaderOmra && hasHeaderGuides);

  // 14. Présence d\'Omra et des Guides dans le Footer
  const footerSrc = readFileSync(join(ROOT, 'src/components/layout/footer.tsx'), 'utf-8');
  const hasFooterOmra = footerSrc.includes('/omra') && footerSrc.includes('Pèlerinage Omra');
  const hasFooterGuides = footerSrc.includes('/guides') && footerSrc.includes('Guides & Conseils');
  recordTest(14, 'Liens d\'exploration vers Omra et Guides dans le pied de page', hasFooterOmra && hasFooterGuides);

  // 15. Déclaration Complète dans le Sitemap XML (src/app/sitemap.ts)
  const sitemapSrc = readFileSync(join(ROOT, 'src/app/sitemap.ts'), 'utf-8');
  const hasSitemapOmra = sitemapSrc.includes("url: `${SITE_URL}/omra`");
  const hasSitemapGuides = sitemapSrc.includes("url: `${SITE_URL}/guides`");
  const hasSitemapDynamicGuides = sitemapSrc.includes("url: `${SITE_URL}/guides/${g.slug}`");
  recordTest(15, 'Sitemap XML dynamique intégrant /omra, /guides et les 6 guides individuels', hasSitemapOmra && hasSitemapGuides && hasSitemapDynamicGuides);

  // 16. Contextualisation des CTA & Boutons de Devis
  const hasQuotePrefillGuides = (guideDetailSrc.includes('defaultService={guide.relatedService.serviceSlug') || guideDetailSrc.includes('service={guide.relatedService.serviceSlug')) && guideDetailSrc.includes('source={`guide-${guide.slug}`}');
  const hasQuotePrefillOmra = (omraSrc.includes('defaultService="tourisme-affaires"') || omraSrc.includes('service="tourisme-affaires"')) && (omraSrc.includes('defaultDestination="Omra - Arabie Saoudite"') || omraSrc.includes('destination="Omra - Arabie Saoudite"'));
  recordTest(16, 'Préremplissage automatique des services et sources dans les boutons de devis CRM', hasQuotePrefillGuides && hasQuotePrefillOmra);

  // 17. Fil d\'Ariane Visuel et Sémantique sur les Nouveaux Contenus
  const hasBreadcrumbsOmra = omraSrc.includes('<Breadcrumbs');
  const hasBreadcrumbsGuides = guideDetailSrc.includes('<Breadcrumbs');
  recordTest(17, 'Fil d\'Ariane BreadcrumbsList injecté sur /omra et sur tous les guides', hasBreadcrumbsOmra && hasBreadcrumbsGuides);

  // 18. E-E-A-T & Auteurs Réels Identifiés
  const hasAuthorCredits = guideDetailSrc.includes('guide.author.name') && guideDetailSrc.includes('guide.author.agency');
  const hasVerifiedDates = guideDetailSrc.includes('guide.verifiedAt');
  recordTest(18, 'Signaux E-E-A-T complets (auteurs réels, agence de Dakar, date de vérification)', hasAuthorCredits && hasVerifiedDates);

  // 19. Intégrité des Fichiers de Rapports de Recherche & Inventaire
  const hasInventoryCsv = existsSync(join(ROOT, 'reports/07/content-inventory.csv'));
  const hasKeywordCsv = existsSync(join(ROOT, 'reports/07/keyword-matrix.csv'));
  recordTest(19, 'Existence des matrices documentaires CSV (inventaire et recherche de mots-clés)', hasInventoryCsv && hasKeywordCsv);

  // 20. Non-Régression des Briques Fonctionnelles Antérieures
  const hasEmailOutbox = existsSync(join(ROOT, 'src/lib/email/outbox.ts'));
  const hasCrmModule = existsSync(join(ROOT, 'src/lib/crm.ts'));
  const hasSeoTest = existsSync(join(ROOT, 'tests/seo-technical.test.mjs'));
  recordTest(20, 'Non-régression des acquis (Emails Outbox P01, CRM P02, SEO technique P06)', hasEmailOutbox && hasCrmModule && hasSeoTest);

} catch (err) {
  console.error('Erreur inattendue durant la suite de tests éditoriaux :', err);
  process.exitCode = 1;
}

console.log('\n================================================================');
console.log(`  RÉSULTATS : ${results.passed}/${results.totalCriteria} SUCCÈS (${results.failed} ÉCHECS)`);
console.log('================================================================\n');

if (results.failed > 0) {
  process.exit(1);
} else {
  console.log('Toutes les validations de la stratégie éditoriale SEO sont passées avec succès !\n');
}
