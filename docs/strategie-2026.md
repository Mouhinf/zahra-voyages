# Stratégie 2026 — SLAAC Voyages

**Date : 12 octobre 2026 · Branche : `fix/security-main`**
Document de référence regroupant les livrables A à I demandés. Chaque affirmation factuelle est sourcée ; chaque hypothèse est signalée comme telle.

---

## Livrable A — Étude concurrentielle

Méthode : recherche web publique (DuckDuckGo) le 12/10/2026, lecture des pages d'accueil et métadonnées des sites accessibles. Pas d'accès aux chiffres internes des concurrents : les constats portent sur leur vitrine publique uniquement.

| Acteur | Site | Positionnement visible | Forces observées | Faiblesses exploitables |
|---|---|---|---|---|
| Tourel Travel | toureltravel.com | Hajj/Oumra, billetterie, excursions, visa | Marque installée, niche pèlerinage solide | Site orienté pèlerinage ; positionnement touristique international peu visible |
| Bello Travel Tours | bellotraveltours.com | Particuliers, pros, groupes | Parcours de réservation en ligne affiché | Identité de marque floue (mention « azurvoyage » en homonymie) |
| TAWOBA Services | tawoba.com | « Super app » : vols, hôtels, colis GP, e-visa | Le plus digitalisé du panel, self-service | Multi-services = peu de conseil humain ; création de contenu touristique faible |
| EVA Voyages | evavoyages.com | Dakar + Touba, Hajj/Oumra | Réseau deux villes | Contenu principalement pèlerinage ; UX datée d'après les snippets |
| Satguru Travel | satgurutravel.com/senegal | Réseau international B2B/B2C | Notoriété groupe, site anglais | Moins d'ancrage local apparent (contenu générique de groupe) |
| Tamoona | tamoonatravel.com | Billetterie, hôtel, assurances, réceptif, team building | Offre B2B explicite | Visibilité SEO locale à confirmer |
| Platinium Voyages | platiniumvoyages.net | Voyages tout compris, visas | Argument chiffré (« 10 ans, 95 % de réussite ») | Affirmation non auditable = risque de crédibilité |
| DBG Travel Tours | dbgtraveltours.com | Billetterie, visa, immobilier, excursions, location | Panier de services large | Dispersion (immobilier + voyage) diluant l'expertise voyage |
| Références UX internationales | booking.com, expedia.com | OTA mondiales | Standards : recherche claire, prix transparents, avis vérifiés, réassurance | — (bonnes pratiques à adapter, pas à copier) |

**Constats structurants**
1. Personne ne produit de **contenu de destination de qualité** (guides Gorée, Lac Rose, Saly…) : c'est le plus grand espace libre SEO.
2. Personne ne cible sérieusement la **diaspora en français** avec des parcours dédiés (retour au pays, transferts AIBD).
3. La **transparence** (pas de promesse de visa, prix sur devis expliqués) est un différenciateur crédible face aux « taux de réussite » invérifiables.
4. L'**anglais** est quasi absent du marché local sauf Satguru : ouverture internationale peu coûteuse.
5. SLAAC dispose déjà (phase UI) d'une base design supérieure à la majorité du panel : l'écart se joue désormais sur contenu + SEO + conversion.

---

## Livrable B — Positionnement international

| Segment | Besoins clés | Réponse actuelle | À construire |
|---|---|---|---|
| Sénégalais | Billets, visas, hôtels, location, excursions | ✅ Complet (catalogue + assistance) | Contenu SEO « billet d'avion Dakar », suivi Google Business Profile |
| Diaspora (FR/BE/IT/ES/UK/CA/US) | Retour au pays, transfert AIBD, séjour familial, voyages pour proches restés au Sénégal | Partielle (transferts + hébergement existent) | Page « Retour au Sénégal » + guides pratiques + formulaires avec pays de résidence/départ |
| Voyageurs africains (CI, ML, GN, GM, MR, MA, CM, GH, NG) | Séjours, connexions via Dakar, formalités | Non adressée explicitement | Extension du contenu destinations ; priorité CEDEAO (formalités simples) |
| Touristes internationaux | Séjours authentiques, excursions, accompagnement | `/en` livré (landing) ; éditorial à venir | Guides EN, témoignages internationaux réels, tarifs indicatifs multi-devises datés |
| Entreprises & groupes | Séminaires, délégations, transferts collectifs | ✅ `/tourisme-affaires` + service groupes devis | Étude de cas réelle, plaquette B2B, prospection ciblée |

**Règle de fidélité** : les prix contractuels restent en FCFA ; toute conversion EUR/USD serait indicative, datée et sans garantie de taux (à n'afficher qu'après définition d'une source de taux).

---

## Livrable C — Stratégie événementielle Dakar 2026

**Faits vérifiés (12/10/2026)** : JOJ Dakar 2026 du **31 octobre au 13 novembre 2026**, zones **Dakar, Diamniadio, Saly**, ~2 700 athlètes de 14-17 ans, ~25 sports, premier événement olympique en Afrique. Sources : olympics.com/cio/dakar-2026, RFI (21/09/2026), au-senegal.com (07/10/2026).

**Cadre juridique appliqué**
- Aucune marque olympique utilisée (anneaux, mascotte, logos, visuels officiels) sur le site.
- Positionnement : mention informative factuelle + bandeau visible **« SLAAC Voyages n'est ni partenaire, ni sponsor, ni revendeur officiel »**.
- Lien vers la billetterie officielle uniquement (tickets.dakar2026.org), jamais de contournement.
- Toute formulation promotionnelle plus associée (ex. « package officiel des Jeux ») est **interdite sans accord contractuel** et soumise à validation juridique avant publication.

**Implémenté (voir Livrable F)** : page `/dakar-2026` (info sourcée / offres séparées / FAQ), bandeau d'annonce à disparition automatique après le 16/11/2026, entrée header/footer, section EN sur la home anglaise.

**Stratégie temporelle**
- **Avant (jusqu'au 30/10)** : SEO sur requêtes de préparation (« où dormir Dakar novembre 2026 », « transfert AIBD »), poussée Google/Meta Ads locale si budget.
- **Pendant (31/10 → 13/11)** : disponibilités réelles mises à jour par l'agence, réponse WhatsApp renforcée, horaires élargis affichés.
- **Après (dès le 16/11)** : bandeau disparaît, page réorientée vers « Voyager au Sénégal toute l'année » (les sections zones/excursions/transferts restent pertinentes), conservation historique.

---

## Livrable D — Plan SEO

**Fondations techniques — livré le 12/10/2026**
- `robots.txt` (admin + API désindexés) et `sitemap.xml` dynamique (14 routes statiques + offres Firestore publiées).
- `metadataBase` + canonicals sur toutes les pages, template de titre, Open Graph de base.
- JSON-LD `TravelAgency` (FR + EN) et `FAQPage` (accueil + Dakar 2026) — socle GEO : réponses directes, datées, sourcées.
- hreflang fr/en + x-default sur `/` et `/en`.

**Clusters prioritaires (par intention commerciale)**
1. Billetterie : « billet d'avion Dakar », « réservation vol Sénégal » → page transport enrichie.
2. Visas : « assistance visa Dakar », « dossier visa France depuis Sénégal » → `/assistance-voyage` + guides par pays **uniquement avec informations vérifiées**.
3. Tourisme Sénégal : « excursion Dakar », « visiter Gorée », « Lac Rose », « Saly », « Casamance », « Sine-Saloum » → guides éditoriaux (Vague 2), maillage vers les excursions réelles.
4. Transferts/hébergement : « transfert aéroport Dakar AIBD », « location voiture avec chauffeur Dakar » → pages transport + EN.
5. Diaspora : « retour au Sénégal », « vacances au Sénégal depuis la France » → page dédiée (Vague 2).
6. EN : « senegal travel agency », « dakar airport transfer », « senegal private tours » → extension de `/en`.
7. Événementiel : requêtes de préparation 2026 → `/dakar-2026` (sans exploitation de marque).

**Règles** : zéro page programmatique vide, zéro duplication, contenu mis à jour avec date visible, domaine canonique à verrouiller uniquement après confirmation du domaine définitif (redirections 301 Vercel → domaine).

**GEO (assistants IA)** : FAQ structurées, réponses directes en première section, sources officielles citées, responsabilité éditoriale (agence identifiée + adresse + date) — déjà appliqué sur les nouvelles pages, à étendre.

---

## Livrable E — Plan de conversion

**Parcours** : Visiteur → CTA contextuel → devis prérempli (service + offre + source tracée) → enregistrement Firestore validé → notification email → CRM (statuts, notes, responsable, historique, export) → réponse conseiller.

**Correctifs/ajouts décisifs déjà réalisés**
- 12/10 : **bug critique corrigé** — `travelers` sérialisé en chaîne ; toute demande de devis échouait en 400. Test de régression permanent.
- Sources de traçabilité normalisées sur tous les CTA (`accueil-hero`, `offre-hebergement`, `dakar2026-*`, `en-*`…).

**Indicateurs à suivre (base = aujourd'hui, sans chiffre inventé)**
- Demandes de devis/semaine (Firestore), taux de qualification, délai moyen de première réponse (CRM), répartition par service/source/langue/pays, clients confirmés.
- Trafic : Search Console (impressions/clics/positions sur les clusters), non mesurable aujourd'hui — à activer dès le déploiement.

**Anti-patterns interdits et respectés** : pas de faux compteurs, pas de fausse disponibilité, pas de témoignage inventé, « Devis » jamais présenté comme « Réservation ».

---

## Livrable F — Modifications techniques livrées (12/10/2026)

Commit `feat(seo,i18n,trust)…` sur `fix/security-main` :

| Fichier | Contenu |
|---|---|
| `src/lib/site.ts` | Config centralisée (URL canonique, contacts) |
| `src/app/robots.ts`, `src/app/sitemap.ts` | Indexation contrôlée + sitemap dynamique |
| `src/app/layout.tsx` | metadataBase, OG, JSON-LD TravelAgency |
| `src/app/page.tsx` | canonical + hreflang + JSON-LD FAQ |
| `src/app/*/page.tsx` (about, destinations, excursions, hebergement, transport, voyages-croisieres, tourisme-affaires, assistance-voyage) | Canonicals + titres absolus |
| `src/app/contact/layout.tsx`, `src/app/services/layout.tsx` | Métadonnées (pages client) |
| `src/app/dakar-2026/page.tsx` | Page événementielle conforme (source + offres séparées + disclaimer + FAQ JSON-LD) |
| `src/app/en/page.tsx` | Landing anglaise (services, audiences, event mention, contacts) |
| `src/app/confidentialite/page.tsx` | Politique de confidentialité fidèle aux traitements réels |
| `src/components/layout/event-banner.tsx` | Bandeau à disparition automatique (16/11/2026) |
| `header.tsx` / `footer.tsx` | Entrées Dakar 2026 + confidentialité, nav resserrée anti-débordement |

**Tests exécutés** : build TS 0 erreur (36 pages), 19/19 tests API (dont régression travelers), 16 routes en 200, robots/sitemap/hreflang/JSON-LD vérifiés dans le HTML servi. **Non encore déployé** (aucune mise en production sans approbation).

---

## Livrable G — Performance & fiabilité (état des lieux honnête)

- **Mesuré** : First Load JS ~103-270 ko selon pages (build) ; 36 pages statiques ou à revalidation courte ; images Cloudinary en `f_auto,q_auto` ; police `next/font` ; rate-limiting + validation stricte sur toutes les API ; sitemap résilient (fallback statique si Firestore indisponible).
- **Non mesuré ici** : Core Web Vitals terrain et scores Lighthouse (aucun navigateur disponible dans cet environnement). À exécuter en production après déploiement : PageSpeed Insights (mobile) sur `/`, `/hebergement`, `/dakar-2026`. Cibles : LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1, A11y ≥ 95.
- **Risques connus** : le bandeau disparaît au prochain déploiement post-événement (vérif serveur au build) ; les pages d'accueil chargent Firestore côté client (RES fine, mais à surveiller en réseau mobile).

---

## Livrable H — Roadmap commerciale

**J+30 (→ mi-novembre 2026)** — urgence événement
| Action | Effort | Impact | Responsable suggéré |
|---|---|---|---|
| Déployer cette branche + Search Console + Google Business Profile vérifié | 0,5 j | Très fort | Dev + Gérant |
| Mettre à jour disponibilités réelles (hébergements/transports) pour la période | 0,5 j/sem | Fort | Ops agence |
| Standard WhatsApp de réponse (< 2 h en journée) | — | Fort | Conseillers |
| 3 guides FR courts : transferts AIBD, où dormir, formalités (infos vérifiées) | 2 j | Fort | Marketing |

**J+60 (→ mi-décembre)**
| Action | Effort | Impact |
|---|---|---|
| Page « Retour au Sénégal » diaspora (FR) + formulaire pays de résidence/départ | 3 j | Fort |
| Extension `/en` (transfers, tours pages) | 3 j | Moyen+ |
| Collecte de 5-10 témoignages réels documentés (remplace les actuels) | continu | Fort |
| Campagne Google Ads test sur « billet d'avion Dakar » + « transfert AIBD » (budget test) | 1 j + budget | À mesurer |

**J+90 (→ mi-janvier 2027)**
| Action | Effort | Impact |
|---|---|---|
| Réorientation `/dakar-2026` → « Voyager au Sénégal » | 1 j | Moyen |
| Guides destinations (Gorée, Lac Rose, Saly, Casamance, Sine-Saloum) FR+EN | 8 j | Très fort (SEO durable) |
| CRM : relances contrôlées + mesure délai de réponse | 3 j | Fort |
| B2B : liste 20 entreprises/organisateurs + plaquette + 10 contacts | continu | Moyen+ |

---

## Livrable I — Score de compétitivité (méthode stable, 10 critères × 10)

Notation : 0 (absent) → 10 (excellent, vérifiable). Réévaluable à l'identique chaque mois.

| Critère | Score | Justification |
|---|---|---|
| Performance | 7 | Bonnes pratiques en place (images, fonts, statique) ; CWV terrain non mesurés |
| SEO | 6 | Fondations techniques complètes (12/10) ; contenu éditorial et historique Search Console à construire |
| UX/UI | 8 | Design system marine/or, mobile-first, galeries, formulaire progressif |
| Sécurité | 8 | Validation stricte, rate limiting, règles Firestore, gardes admin, tests 19/19 ; audit dépendances périodique à planifier |
| Fonctionnalités | 8 | Catalogue complet 5 modules + assistance + CRM + admin |
| Internationalisation | 5 | Landing EN + hreflang livrés ; formulaires internationaux et guides EN à venir |
| Conversion | 7 | Devis préremplis partout, WhatsApp contextuel, bug parcours corrigé ; A/B et mesure à instaurer |
| Confiance | 6 | Adresse, contacts, politique de confidentialité livrés ; témoignages réels et avis Google à collecter |
| Administration | 8 | CRM complet (statuts, notes, responsable, export), dashboard données réelles |
| Différenciation | 6 | Page événementielle conforme unique sur le marché local ; contenu destination encore mince |
| **TOTAL** | **69/100** | |

**Objectif 90 jours : 69 → 80** (leviers : contenu éditorial +7, témoignages réels +2, i18n formulaires +2, mesure CWV/actions SEO −).

---

## Limites déclarées

- Benchmark fondé sur les vitrines publiques accessibles le 12/10/2026 ; aucun audit interne des concurrents.
- Aucun score Lighthouse/CWV mesuré dans cet environnement (à exécuter en production).
- Aucune promesse de résultat SEO/IA — seules les actions et leur traçabilité sont garanties.
