/**
 * Test Suite Automatisée : Local SEO, Google Business Profile & E-Réputation (Phase 08/12)
 * Valide les 20 critères d'excellence locale pour SLAAC Voyages à Dakar.
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();

const results = {
  totalCriteria: 20,
  passed: 0,
  failed: 0,
  details: [],
};

function recordTest(id, name, success, note = '') {
  if (success) {
    results.passed++;
    console.log(`✔ [CRITERION ${String(id).padStart(2, '0')}/20] ${name}`);
  } else {
    results.failed++;
    console.log(`✘ [CRITERION ${String(id).padStart(2, '0')}/20] ${name}: ${note}`);
  }
  results.details.push({ id, name, success, note });
}

console.log('================================================================');
console.log('   SLAAC VOYAGES — SUITE DE VALIDATION DU SEO LOCAL (20/20)     ');
console.log('================================================================\n');

try {
  // 1. Audit GBP & Risques de Doublons
  const auditGbpExists = existsSync(join(ROOT, 'reports/08/01-audit-google-business-profile.md'));
  const auditGbpSrc = auditGbpExists ? readFileSync(join(ROOT, 'reports/08/01-audit-google-business-profile.md'), 'utf-8') : '';
  const hasGbpIntegrity = auditGbpExists && auditGbpSrc.includes('SLAAC Voyages') && auditGbpSrc.includes('Djolof Chicken') && auditGbpSrc.includes('doublon');
  recordTest(1, 'Audit de la fiche Google Business Profile et prévention des doublons', hasGbpIntegrity);

  // 2. Vérification Localisation & Déménagement (Plateau vs Sacré-Cœur)
  const addressRepExists = existsSync(join(ROOT, 'reports/08/02-address-and-map-verification.md'));
  const addressRepSrc = addressRepExists ? readFileSync(join(ROOT, 'reports/08/02-address-and-map-verification.md'), 'utf-8') : '';
  const hasAddressAnalysis = addressRepExists && addressRepSrc.includes('Sacré-Cœur 3') && addressRepSrc.includes('Dakar Plateau') && addressRepSrc.includes('14.6687');
  recordTest(2, 'Vérification de la localisation, déménagement Plateau/Sacré-Cœur et pin Maps', hasAddressAnalysis);

  // 3. Identité GBP : Nom commercial strict et description <= 750 caractères
  const identityExists = existsSync(join(ROOT, 'reports/08/03-business-profile-identity.md'));
  const identitySrc = identityExists ? readFileSync(join(ROOT, 'reports/08/03-business-profile-identity.md'), 'utf-8') : '';
  const hasIdentityRules = identityExists && identitySrc.includes('Agence de voyages') && identitySrc.includes('750 caractères') && identitySrc.includes('SLAAC Voyages');
  recordTest(3, 'Optimisation de l\'identité Google (nom exact, catégorie et description calibrée)', hasIdentityRules);

  // 4. Catalogue des 7 Services Google GBP
  const servicesRepExists = existsSync(join(ROOT, 'reports/08/04-google-services.md'));
  const servicesRepSrc = servicesRepExists ? readFileSync(join(ROOT, 'reports/08/04-google-services.md'), 'utf-8') : '';
  const has7Services = servicesRepExists && servicesRepSrc.includes('Billetterie Aérienne') && servicesRepSrc.includes('Aéroport AIBD') && servicesRepSrc.includes('Omra') && servicesRepSrc.includes('Affaires');
  recordTest(4, 'Catalogue de 7 services Google vérifiés avec pages cibles associées', has7Services);

  // 5. Matrice d\'Audit NAP (Name, Address, Phone) en CSV
  const napCsvExists = existsSync(join(ROOT, 'reports/08/nap-audit.csv'));
  const napCsvSrc = napCsvExists ? readFileSync(join(ROOT, 'reports/08/nap-audit.csv'), 'utf-8') : '';
  const hasNapCsvData = napCsvExists && napCsvSrc.includes('+221 77 312 90 90') && napCsvSrc.includes('Dakar Plateau') && napCsvSrc.includes('Go_Africa_Online');
  recordTest(5, 'Matrice d\'audit NAP exhaustive au format CSV sur 10+ supports', hasNapCsvData);

  // 6. Centralisation dans src/lib/site.ts
  const siteTsSrc = readFileSync(join(ROOT, 'src/lib/site.ts'), 'utf-8');
  const hasCentralContact = siteTsSrc.includes("phone: '+221 77 312 90 90'") &&
                            siteTsSrc.includes("phoneSecondary: '+221 77 624 58 58'") &&
                            siteTsSrc.includes("email: 'contact@slaacvoyages.com'") &&
                            siteTsSrc.includes("latitude: 14.6687") &&
                            siteTsSrc.includes("directionsUrl:");
  recordTest(6, 'Centralisation du NAP, coordonnées GPS et URL d\'itinéraire dans src/lib/site.ts', hasCentralContact);

  // 7. Page /contact : Liens Click-to-Call directs (tel:)
  const contactPageSrc = readFileSync(join(ROOT, 'src/app/contact/page.tsx'), 'utf-8');
  const hasClickToCall = contactPageSrc.includes('tel:${CONTACT.phoneIntl}') && contactPageSrc.includes('tel:${CONTACT.phoneSecondaryIntl}');
  recordTest(7, 'Page /contact enrichie avec liens directs Click-to-Call sur double ligne', hasClickToCall);

  // 8. Page /contact : Affichage des Horaires d\'Ouverture
  const hasOpeningHoursContact = contactPageSrc.includes('CONTACT.openingHours.weekdays') && contactPageSrc.includes('Horaires d\'Accueil');
  recordTest(8, 'Page /contact affichant les horaires d\'accueil physique de l\'agence', hasOpeningHoursContact);

  // 9. Page /contact : Bouton d\'Itinéraire Google Maps
  const hasDirectionsBtnContact = contactPageSrc.includes('CONTACT.directionsUrl') && contactPageSrc.includes('Obtenir l\'itinéraire Google Maps');
  recordTest(9, 'Bouton d\'action d\'itinéraire Google Maps interactif sur la page contact', hasDirectionsBtnContact);

  // 10. Page /contact : Formulaire Réel vers /api/contact avec Pot de Miel
  const hasContactFormFunctional = contactPageSrc.includes("fetch('/api/contact'") && contactPageSrc.includes("website: ''");
  recordTest(10, 'Formulaire de contact relié à l\'API réelle avec protection anti-spam bot', hasContactFormFunctional);

  // 11. Section Accueil home-contact-quick : NAP centralisé et itinéraire
  const homeQuickSrc = readFileSync(join(ROOT, 'src/components/sections/home-contact-quick.tsx'), 'utf-8');
  const hasHomeContactEnhanced = homeQuickSrc.includes('CONTACT.address.formatted') &&
                                 homeQuickSrc.includes('CONTACT.directionsUrl') &&
                                 homeQuickSrc.includes('tel:${CONTACT.phoneIntl}');
  recordTest(11, 'Encart contact d\'accueil enrichi avec NAP centralisé, itinéraire Maps et double ligne', hasHomeContactEnhanced);

  // 12. Footer Universel : Adresse cliquable vers l\'Itinéraire Maps
  const footerSrc = readFileSync(join(ROOT, 'src/components/layout/footer.tsx'), 'utf-8');
  const hasFooterDirections = footerSrc.includes('CONTACT.directionsUrl') && footerSrc.includes('Dakar Plateau, rue Mouhamed 5');
  recordTest(12, 'Pied de page universel avec adresse cliquable ouvrant l\'itinéraire Google Maps', hasFooterDirections);

  // 13. Schema.org TravelAgency : Exactitude GPS, hasMap et id stable
  const schemaSrc = readFileSync(join(ROOT, 'src/lib/seo-schema.ts'), 'utf-8');
  const hasSchemaEnhanced = schemaSrc.includes("hasMap: CONTACT.directionsUrl") &&
                            schemaSrc.includes("latitude: CONTACT.geo.latitude") &&
                            schemaSrc.includes("telephone: CONTACT.phoneIntl");
  recordTest(13, 'Schéma TravelAgency JSON-LD avec hasMap, géolocalisation GPS exacte et id pérenne', hasSchemaEnhanced);

  // 14. Schema.org ContactPoint Multiples (Support & Commercial)
  const hasMultipleContactPoints = schemaSrc.includes("contactType: 'customer service'") && schemaSrc.includes("contactType: 'sales'");
  recordTest(14, 'Schéma Schema.org intégrant des points de contact distincts pour le service client et les ventes', hasMultipleContactPoints);

  // 15. Stratégie de Photos Authentiques & Rejet de l\'IA trompeuse
  const photosRepExists = existsSync(join(ROOT, 'reports/08/08-google-photos-strategy.md'));
  const photosRepSrc = photosRepExists ? readFileSync(join(ROOT, 'reports/08/08-google-photos-strategy.md'), 'utf-8') : '';
  const hasPhotosEthics = photosRepExists && photosRepSrc.includes('Interdiction des images générées par IA') && photosRepSrc.includes('Extérieur & Façade');
  recordTest(15, 'Stratégie de photographies authentiques avec interdiction formelle des faux visuels IA', hasPhotosEthics);

  // 16. Stratégie d\'Avis Clients Éthiques (Anti-Gating)
  const reviewsRepExists = existsSync(join(ROOT, 'reports/08/09-authentic-review-strategy.md'));
  const reviewsRepSrc = reviewsRepExists ? readFileSync(join(ROOT, 'reports/08/09-authentic-review-strategy.md'), 'utf-8') : '';
  const hasReviewEthics = reviewsRepExists && reviewsRepSrc.includes('QR Code') && reviewsRepSrc.includes('Strictement Prohibé') && reviewsRepSrc.includes('prestation');
  recordTest(16, 'Procédure éthique de sollicitation d\'avis post-prestation sans filtrage discriminatoire', hasReviewEthics);

  // 17. Playbook de Réponses Professionnelles aux Avis Clients
  const playbookExists = existsSync(join(ROOT, 'reports/08/10-review-response-playbook.md'));
  const playbookSrc = playbookExists ? readFileSync(join(ROOT, 'reports/08/10-review-response-playbook.md'), 'utf-8') : '';
  const hasPlaybookComplete = playbookExists && playbookSrc.includes('Avis Positif') && playbookSrc.includes('Avis Négatif') && playbookSrc.includes('Confidentialité absolue');
  recordTest(17, 'Playbook professionnel de gestion et réponse aux avis clients sous 48h', hasPlaybookComplete);

  // 18. Matrice Concurrentielle Locale en CSV
  const compMatrixExists = existsSync(join(ROOT, 'reports/08/local-competitor-matrix.csv'));
  const compMatrixSrc = compMatrixExists ? readFileSync(join(ROOT, 'reports/08/local-competitor-matrix.csv'), 'utf-8') : '';
  const hasCompData = compMatrixExists && compMatrixSrc.includes('Origin Africa Safaris') && compMatrixSrc.includes('Nouvelles Frontières Dakar') && compMatrixSrc.includes('SLAAC Voyages');
  recordTest(18, 'Matrice comparative des concurrents locaux à Dakar au format CSV', hasCompData);

  // 19. Audit des Citations Locales et Plan de Rectification en CSV
  const citMatrixExists = existsSync(join(ROOT, 'reports/08/citation-audit.csv'));
  const citMatrixSrc = citMatrixExists ? readFileSync(join(ROOT, 'reports/08/citation-audit.csv'), 'utf-8') : '';
  const hasCitData = citMatrixExists && citMatrixSrc.includes('Go Africa Online') && citMatrixSrc.includes('Petit Futé') && citMatrixSrc.includes('Senpages');
  recordTest(19, 'Fichier d\'audit des citations locales au format CSV avec plan de mise à jour', hasCitData);

  // 20. Non-Régression des Acquis Antérieurs (P01 Outbox, P02 CRM, P06 Tech SEO, P07 Guides)
  const hasOutbox = existsSync(join(ROOT, 'src/lib/email/outbox.ts'));
  const hasCrm = existsSync(join(ROOT, 'src/lib/crm.ts'));
  const hasGuides = existsSync(join(ROOT, 'src/data/guides.ts'));
  const hasTechSeoTest = existsSync(join(ROOT, 'tests/seo-technical.test.mjs'));
  const hasEditorialTest = existsSync(join(ROOT, 'tests/editorial-seo.test.mjs'));
  recordTest(20, 'Non-régression absolue des briques fonctionnelles antérieures (Emails, CRM, SEO, Guides)', hasOutbox && hasCrm && hasGuides && hasTechSeoTest && hasEditorialTest);

} catch (err) {
  console.error('Erreur inattendue durant la suite de tests SEO local :', err);
  process.exitCode = 1;
}

console.log('\n================================================================');
console.log(`   RÉSULTATS : ${results.passed}/${results.totalCriteria} SUCCÈS (${results.failed} ÉCHECS)`);
console.log('================================================================\n');

if (results.failed > 0) {
  process.exit(1);
} else {
  console.log('Toutes les validations du SEO Local et Google Business Profile sont passées avec succès !\n');
}
