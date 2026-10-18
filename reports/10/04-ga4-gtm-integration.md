# 04. Intégration Google Analytics 4 (GA4) et Google Tag Manager (GTM)
**SLAAC Voyages | Architecture d'Écoute et de Collecte Client-Side & Serveur**

---

## 1. Vue d'Ensemble de l'Architecture de Mesure

L'architecture de mesure de SLAAC Voyages repose sur un modèle hybride :
1. **Google Consent Mode v2 Natif :** États initiaux par défaut définis sur `denied` pour `analytics_storage` et `ad_storage`.
2. **Collecte First-Party via Beacon Next.js :** `AnalyticsBeacon` ([src/components/analytics-beacon.tsx](file:///home/mouhammad/zahra-voyages/src/components/analytics-beacon.tsx)) initialise le dataLayer, capture l'attribution persistante (`slaac_attribution_v1`), et enregistre les sessions sans fuite de PII.
3. **Dispatch Centralisé Typé :** `trackConversionEvent` ([src/lib/tracking/provider.ts](file:///home/mouhammad/zahra-voyages/src/lib/tracking/provider.ts)) formate et pousse les événements normalisés vers `window.dataLayer`, consommé directement par GA4 (`gtag`) ou GTM.

---

## 2. Configuration du DataLayer et Événements GA4 Recommandés

### 2.1 Schéma Normalisé du DataLayer

Chaque événement poussé dans `window.dataLayer` respecte le schéma :

```javascript
window.dataLayer.push({
  event: 'lead_created', // Nom d'événement standardisé
  event_id: 'evt_1729278000000_a1b2c3d4e', // UUID déterministe pour déduplication Pixel/CAPI
  service: 'transfert-aeroport',
  lang: 'fr',
  currency: 'XOF',
  value: 35000,
  reference: 'DV-20261018-ABCD',
  traffic_source: 'google',
  traffic_medium: 'cpc',
  traffic_campaign: 'sn_dakar_search_transfert-aibd',
  consent_analytics: 'granted',
  consent_ad: 'granted'
});
```

### 2.2 Mapping des Événements SLAAC vers GA4 E-Commerce & Lead Generation

| Événement SLAAC | Événement GA4 Équivalent | Paramètres Clés GA4 | Déclencheur GTM |
| :--- | :--- | :--- | :--- |
| `page_view` | `page_view` | `page_location`, `page_title`, `lang` | Changement d'historique App Router |
| `cta_click` | `select_content` | `content_type: 'cta'`, `item_id`, `service` | Clic sur boutons d'action |
| `whatsapp_click` | `contact` | `method: 'whatsapp'`, `service`, `prefilled_text` | Clic CTA WhatsApp |
| `phone_call_click` | `contact` | `method: 'phone'`, `phone_number` | Clic lien tel: |
| `quote_start` | `begin_checkout` | `service`, `items: [{item_name: service}]` | Ouverture modal ou focus formulaire |
| `quote_step_complete` | `checkout_progress` | `checkout_step`, `step_name` | Validation étape intermédiaire |
| `quote_submit_attempt` | `generate_lead_attempt` | `service`, `form_type: 'quote'` | Clic bouton "Envoyer la demande" |
| `lead_created` | `generate_lead` | `transaction_id (reference)`, `value`, `currency`, `service` | HTTP 200 backend (`/api/devis`, `/api/contact`) |
| `quote_completed` | `purchase` | `transaction_id`, `value`, `currency`, `payment_type` | Validation devis / paiement direct |
| `scroll_depth_80` | `scroll` | `percent_scrolled: 80` | Défilement à 80% sur landing page |

---

## 3. Paramètres Personnalisés GA4 (Custom Definitions)

Pour exploiter les rapports d'exploration personnalisés dans l'interface Google Analytics 4, les dimensions et métriques suivantes doivent être configurées dans **Administration > Définitions personnalisées** :

### Dimensions Personnalisées (Custom Dimensions - Portée Événement)
1. **`service` :** Nom canonique du service (`transfert-aeroport`, `chine-canton`, `billetterie`, `omra`, `sejour`, `visa`, etc.).
2. **`lang` :** Langue de navigation de l'utilisateur (`fr` ou `en`).
3. **`reference` :** Référence unique du dossier générée par le backend (`DV-YYYYMMDD-XXXX`).
4. **`traffic_source` :** Source first-party persistante (ex: `google`, `facebook`, `direct`).
5. **`traffic_medium` :** Support first-party (ex: `cpc`, `paid_social`, `organic`).
6. **`traffic_campaign` :** Nom normalisé de la campagne publicitaire.
7. **`consent_status` :** Niveau de consentement consenti (`granted_all`, `analytics_only`, `denied`).

### Métriques Personnalisées (Custom Metrics)
1. **`quote_value` :** Montant estimatif du devis ou de la course en FCFA (Unité de mesure : Devise standard XOF).

---

## 4. Configuration Recommandée du Conteneur GTM (Web)

Lorsque GTM est activé via la variable d'environnement `NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX` :

1. **Variables DataLayer Définies :**
   - `dlv - service` : `service`
   - `dlv - event_id` : `event_id`
   - `dlv - value` : `value`
   - `dlv - reference` : `reference`
   - `dlv - lang` : `lang`
2. **Balises Déclenchées sur `lead_created` :**
   - **GA4 Event - Generate Lead :**
     - Nom de l'événement : `generate_lead`
     - Paramètres : `value`, `currency`, `transaction_id`, `service`
   - **Google Ads Conversion Tracking :**
     - Conversion ID : `AW-XXXXXXXXX`
     - Conversion Label : `LeadCreated_AIBD_General`
     - Conversion Value : `{{dlv - value}}`
     - Transaction ID : `{{dlv - reference}}`
   - **Meta Pixel - Lead Tag :**
     - Événement personnalisé ou standard : `Lead`
     - Event ID : `{{dlv - event_id}}`
   - **TikTok Pixel - CompleteRegistration / SubmitForm :**
     - Event ID : `{{dlv - event_id}}`

---

## 5. Prévention des Doublons et Robustesse Client-Side

1. **Aucun `generate_lead` au Clic :** Le simple clic sur le bouton de soumission déclenche uniquement `quote_submit_attempt`.
2. **Déduplication par `event_id` :** Chaque événement dispose d'un identifiant unique SHA/UUID (`evt_timestamp_random`).
3. **Persistance des Identifiants de Clic :** Les paramètres `gclid`, `gbraid`, et `wbraid` capturés à l'arrivée sont transmis dans le payload de conversion pour l'association déterministe dans Google Ads.
