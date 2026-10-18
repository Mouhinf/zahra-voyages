# Attribution des Campagnes Publicitaires & Gestion des Paramètres UTM
## SLAAC Voyages | Phase 10/12 : Traçabilité Multi-Canal, Capture des Identifiants & Persistance

> **Date :** 18 octobre 2026  
> **Composant clé implémenté :** [`src/lib/tracking/attribution.ts`](file:///home/mouhammad/zahra-voyages/src/lib/tracking/attribution.ts)  
> **Nomenclature associée :** [`reports/10/utm-naming-convention.csv`](file:///home/mouhammad/zahra-voyages/reports/10/utm-naming-convention.csv)

---

## 1. Problématique Résolue : La Perte d'Attribution en Cours de Session

Dans le comportement standard des applications monopages (SPA) ou avec Next.js App Router, un visiteur arrivant depuis une publicité payante :
`https://slaacvoyages.com/lp/transfert-aibd?utm_source=google_ads&utm_medium=cpc&utm_campaign=aibd_transfer_dakar&gclid=CjwKCAjw...`
qui clique ensuite sur « À propos » ou sur un guide pratique naviguait vers une URL exempte de paramètres d'URL (`/about`).

Sans système de persistance, l'ouverture ultérieure de la modale de devis ou du formulaire de contact envoyait des valeurs vides pour `utmSource`, faussant totalement le calcul du retour sur investissement publicitaire (ROAS) et du coût par lead (CPL).

---

## 2. Architecture Technique Implémentée

### 2.1. Stockage Local en `sessionStorage` (`slaac_attribution_v1`)
Le module [`captureAttribution`](file:///home/mouhammad/zahra-voyages/src/lib/tracking/attribution.ts) s'exécute à chaque navigation (intégré dans [`AnalyticsBeacon`](file:///home/mouhammad/zahra-voyages/src/components/analytics-beacon.tsx)) :
1. Il extrait tous les paramètres de campagne présents dans l'URL.
2. Si une nouvelle campagne est détectée, il met à jour la session en conservant la page d'atterrissage d'origine (`landingPage`) et le référent initial (`referrer`).
3. Si le visiteur navigue sur d'autres pages, les paramètres initiaux restent gravés dans `sessionStorage`.
4. Lors de la soumission d'un formulaire de devis (`QuoteRequestModal`) ou de contact (`ContactPage`), la fonction [`getStoredAttribution`](file:///home/mouhammad/zahra-voyages/src/lib/tracking/attribution.ts) réinjecte automatiquement l'ensemble des données d'attribution dans le payload Firestore.

### 2.2. Paramètres Capturés & Stockés

| Paramètre | Description | Exemple | Usage CRM & Publicitaire |
| :--- | :--- | :--- | :--- |
| `utm_source` | Origine du trafic | `google_ads`, `meta_ads`, `tiktok_ads`, `newsletter` | Identification du canal payant |
| `utm_medium` | Canal marketing | `cpc`, `social_paid`, `email`, `referral` | Typologie d'acquisition |
| `utm_campaign` | Nom unique de la campagne | `aibd_transfer_dakar_q4`, `dakar2026_early_bird` | Rapprochement budgétaire |
| `utm_content` | Variante créative ou ad group | `video_arrival_terminal`, `banner_fixed_rate` | Test A/B créatif |
| `utm_term` | Mot-clé acheté ou audience ciblée | `chauffeur+prive+aibd`, `expats_dakar` | Audit d'intention de recherche |
| `gclid` | Google Click Identifier | `CjwKCAjw...` | Rapprochement des conversions Google Ads |
| `gbraid` / `wbraid` | Google App/Web Click IDs (iOS 14.5+) | `GBRAID_SAMPLE_123` | Conversions modélisées respectueuses d'ATT |
| `fbclid` | Meta Click Identifier | `IwAR3...` | Réconciliation Meta Conversions API |
| `ttclid` | TikTok Click Identifier | `TT_CLICK_ID_XYZ` | Réconciliation TikTok Events API |
| `referrer` | Domaine d'origine | `https://l.instagram.com/` | Source organique ou sociale |
| `landingPage` | Page d'entrée de session | `/lp/transfert-aibd` | Analyse d'efficacité des pages de renvoi |

---

## 3. Règle d'Attribution & Non-Surestimation

SLAAC Voyages applique une règle d'attribution hybride et transparente :
1. **Dans le CRM :** Conservation de la source payante d'entrée (`first-touch`) pour identifier le canal d'initiation du besoin client, et enregistrement de la dernière campagne active (`last-touch`) si une ré-activation publicitaire a eu lieu.
2. **Absence de source identifiée :** La mention `direct` ou `inconnu` est explicitement assignée. Il est strictement interdit d'attribuer artificiellement un prospect organique à une campagne payante en cours.
3. **Plafond de rétention :** La durée de vie de la session d'attribution est bornée à 30 jours calendaires (`ATTRIBUTION_MAX_AGE_MS`), évitant d'attribuer une demande spontanée intervenue 6 mois plus tard à un ancien clic publicitaire.
