# 11. Mesure TikTok : Pixel, Events API et Déduplication
**SLAAC Voyages | Suivi Hybride TikTok Events API & Intégrité des Conversions**

---

## 1. Architecture de Mesure TikTok

Pour évaluer la rentabilité des investissements publicitaires sur TikTok Ads, SLAAC Voyages déploie un système de mesure bi-directionnel :
1. **TikTok Pixel Client-Side (`ttq`) :** Injecté conditionnellement via `trackConversionEvent` ([src/lib/tracking/provider.ts](file:///home/mouhammad/zahra-voyages/src/lib/tracking/provider.ts)) uniquement si l'internaute a accordé son consentement publicitaire (`ad_storage: granted`).
2. **TikTok Events API (Serveur) :** Permet la transmission d'événements de conversion directement depuis l'environnement serveur vers l'endpoint TikTok Graph `/v1.3/event/track/`.

---

## 2. Correspondance des Événements SLAAC vers TikTok Standard Events

| Événement Interne SLAAC | TikTok Event Name | Paramètres Transmis | Mode de Déclenchement |
| :--- | :--- | :--- | :--- |
| `page_view` | `ViewContent` | `content_type: 'product'`, `content_id` | Chargement page |
| `cta_click` | `ClickButton` | `content_name: 'cta_action'` | Clic boutons d'action |
| `quote_start` | `InitiateCheckout` | `content_category: service` | Ouverture du formulaire de devis |
| `quote_submit_attempt` | `Contact` | `content_name: 'quote_attempt'` | Clic sur "Envoyer la demande" |
| `lead_created` | `CompleteRegistration` ou `SubmitForm` | `event_id`, `value`, `currency: 'XOF'`, `order_id` | Réception HTTP 200 OK du serveur |

---

## 3. Mécanisme de Déduplication Client-Serveur

À l'instar de Meta, TikTok exige un identifiant `event_id` rigoureusement identique entre le hit Pixel navigateur et le payload serveur Events API :

### 3.1 Côté Navigateur (Pixel)
```typescript
if (typeof window.ttq === 'function') {
  window.ttq.track('CompleteRegistration', {
    content_name: event.service || 'general',
    value: event.value || 0,
    currency: event.currency || 'XOF'
  }, {
    event_id: event.event_id // Déterministe
  });
}
```

### 3.2 Côté Serveur (Events API Payload)
```json
{
  "event_source": "web",
  "event_source_id": "TIKTOK_PIXEL_ID",
  "data": [
    {
      "event": "CompleteRegistration",
      "event_time": 1729278000,
      "event_id": "evt_1729278000000_lead_DV20261018001",
      "user": {
        "ttclid": "ttclid_captured_from_url",
        "email": "5d41402abc4b2a76b9719d911017c592",
        "phone_number": "221771234567_hashed_sha256",
        "ip": "196.207.240.1",
        "user_agent": "Mozilla/5.0..."
      },
      "properties": {
        "value": 35000,
        "currency": "XOF",
        "content_type": "product",
        "content_name": "transfert-aeroport"
      }
    }
  ]
}
```

---

## 4. Gestion du `ttclid` et Persistance

Lorsqu'un utilisateur clique sur une annonce TikTok, le paramètre d'URL `ttclid` est injecté :
- [src/lib/tracking/attribution.ts](file:///home/mouhammad/zahra-voyages/src/lib/tracking/attribution.ts) intercepte immédiatement `ttclid` et le stocke dans `sessionStorage` sous la clé `slaac_attribution_v1`.
- Le schéma Zod [src/lib/schemas/quote-schema.ts](file:///home/mouhammad/zahra-voyages/src/lib/schemas/quote-schema.ts) et la route d'enregistrement `/api/devis` garantissent sa transmission dans Firestore.

---

## 5. Recette et Validation TikTok Events Manager

- Utilisation de l'outil **Test Events** dans TikTok Ads Manager.
- Saisie du code de test temporaire pour vérifier en direct la bonne réception et la déduplication sous l'onglet "Event Quality Details".
- Validation de l'absence totale d'appels réseau TikTok lorsque le visiteur clique sur « Refuser » dans la bannière de consentement SLAAC.
