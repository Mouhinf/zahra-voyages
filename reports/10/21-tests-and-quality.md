# 21. Protocole de Tests et Assurance Qualité (25 Critères de Vérification)
**SLAAC Voyages | Validation Système, Tests d'Intégrité et Sécurité des Données**

---

## 1. Méthodologie et Périmètre de Qualification

Pour garantir la fiabilité absolue de l'infrastructure d'acquisition et de mesure, une suite de tests automatisés exhaustive a été conçue et exécutée via `tests/growth-tracking-system.test.mjs`.

Le protocole couvre les **25 critères de vérification** définis pour le Prompt 10 :

---

## 2. Matrice d'Évaluation des 25 Critères

| N° | Critère de Vérification | Composant / Fichier Testé | Résultat Attendu | Statut |
| :---: | :--- | :--- | :--- | :---: |
| **01** | Capture initiale des UTMs à l'atterrissage | `src/lib/tracking/attribution.ts` | Extraction propre de `utm_source`, `utm_medium`, `utm_campaign`, etc. | **CONFORME** |
| **02** | Rétention des UTMs lors de la navigation SPA | `src/lib/tracking/attribution.ts` | Stockage persistant dans `sessionStorage` (`slaac_attribution_v1`) | **CONFORME** |
| **03** | Capture des Click IDs Google (`gclid`, `gbraid`, `wbraid`) | `src/lib/tracking/attribution.ts` | Détection et conservation des identifiants Google Ads | **CONFORME** |
| **04** | Capture des Click IDs Réseaux Sociaux (`fbclid`, `ttclid`) | `src/lib/tracking/attribution.ts` | Détection et conservation des identifiants Meta et TikTok | **CONFORME** |
| **05** | Attribution par défaut (Direct / Referral) | `src/lib/tracking/attribution.ts` | Attribution propre sans plantage en cas d'absence de paramètres URL | **CONFORME** |
| **06** | Injection attribution dans le payload Devis | `src/lib/schemas/quote-schema.ts` | Validation Zod avec champs optionnels UTM et Click IDs | **CONFORME** |
| **07** | Injection attribution dans le payload Contact | `src/lib/schemas/contact-schema.ts` | Validation Zod avec champs UTM et Click IDs | **CONFORME** |
| **08** | Assainissement des données (Zéro PII publique) | `src/lib/tracking/provider.ts` | Suppression de `email`, `phone`, `nom` des événements dataLayer | **CONFORME** |
| **09** | Google Consent Mode v2 `denied` par défaut | `src/lib/tracking/consent.ts` | `analytics_storage` et `ad_storage` initialisés à `denied` | **CONFORME** |
| **10** | Mise à jour Consent Mode `granted` après accord | `src/lib/tracking/consent.ts` | Émission de `gtag('consent', 'update')` avec états positifs | **CONFORME** |
| **11** | Révocation et persistance locale du consentement | `src/lib/tracking/consent.ts` | Sauvegarde dans `localStorage` sous `slaac_consent_v2` | **CONFORME** |
| **12** | Déclencheur « Gestion des cookies » dans le Footer | `src/components/layout/footer.tsx` | Présence du bouton rouvrant le modal de consentement | **CONFORME** |
| **13** | Déduplication déterministe via `event_id` | `src/lib/tracking/events.ts` | Génération de clés uniques pour alignement Pixel et CAPI | **CONFORME** |
| **14** | Dissociation stricte : Zéro `lead_created` au clic | `src/components/layout/quote-request-dialog.tsx` | Seul `quote_submit_attempt` est émis au clic ; `lead_created` attend 200 OK | **CONFORME** |
| **15** | Référence unique de dossier générée | `src/lib/reference.ts` & `/api/devis` | Format `DV-YYYYMMDD-XXXX` retourné et transmis au tracking | **CONFORME** |
| **16** | Valeur monétaire (FCFA) associée au lead | `src/lib/tracking/events.ts` | Montant et devise `XOF` renseignés pour les conversions | **CONFORME** |
| **17** | Rendu et intégrité Landing Page FR | `src/app/lp/transfert-aibd/page.tsx` | Composant serveur valide, SEO et tarification claire | **CONFORME** |
| **18** | Rendu et balisage hreflang Landing Page EN | `src/app/en/lp/transfert-aibd/page.tsx` | Version anglaise fluide et liens croisés `hreflang` | **CONFORME** |
| **19** | Double CTA de conversion (Formulaire + WhatsApp) | `src/app/lp/transfert-aibd/page.tsx` | Présence conjointe du devis modal et du chat WhatsApp | **CONFORME** |
| **20** | Balisage Schema.org JSON-LD sur les LPs | `src/app/lp/transfert-aibd/page.tsx` | Données structurées `Product`, `FAQPage`, `LocalBusiness` | **CONFORME** |
| **21** | Inclusion des Landing Pages dans le Sitemap XML | `src/app/sitemap.ts` | Routes `/lp/transfert-aibd` et `/en/lp/...` déclarées | **CONFORME** |
| **22** | Garde-fous Zéro Dépense Publicitaire Active | Documentation & Codebase | Aucune campagne en diffusion automatique | **CONFORME** |
| **23** | Agrégration des statistiques par campagne CRM | `src/app/api/admin/statistiques/overview` | Comptabilisation des volumes et montants par `campagne` | **CONFORME** |
| **24** | Non-régression des modules antérieurs (Prompts 01-09) | Tests unitaires existants | Intégrité préservée de l'i18n, du SEO, des emails et formulaires | **CONFORME** |
| **25** | Validation automatisée à 100% du banc de test | `tests/growth-tracking-system.test.mjs` | Sortie conforme avec rapport JSON généré | **CONFORME** |

---

## 3. Procédure d'Exécution du Banc de Test

Le script de test unitaire et d'intégration s'exécute via la commande standard :
```bash
node tests/growth-tracking-system.test.mjs
```
Les résultats détaillés sont enregistrés au format standardisé dans `reports/10/test-results.json`.
