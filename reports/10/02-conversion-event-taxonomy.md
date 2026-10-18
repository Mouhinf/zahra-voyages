# Taxonomie Normalisée des Événements & Modèle de Conversion
## SLAAC Voyages | Phase 10/12 : Modèle Événementiel, Idempotence & Funnel Commercial

> **Date de publication :** 18 octobre 2026  
> **Auteurs :** Lead Growth Architect & Senior Analytics Engineer  
> **Fichier source de référence :** [`src/lib/tracking/events.ts`](file:///home/mouhammad/zahra-voyages/src/lib/tracking/events.ts)

---

## 1. Définition des 10 Échelons du Funnel de Conversion

L'erreur majeure du tracking digital consiste à comptabiliser de simples clics ou ouvertures de modale comme des « conversions » ou des « ventes ». Le modèle de SLAAC Voyages sépare distinctement les micro-engagements de navigation, la création effective de prospects (lead), et les étapes de closing commercial gérées au CRM.

```mermaid
flowchart TD
    E1["1. page_view / service_view (Consultation)"] --> E2["2. cta_click (Intérêt d'action)"]
    E2 --> E3["3. quote_start (Ouverture modale)"]
    E3 --> E4["4. quote_submit_attempt (Envoi formulaire)"]
    E4 --> E5["5. lead_created (200 OK Firestore DV-XXXX)"]
    E5 --> E6["6. lead_qualified (Prise en charge CRM)"]
    E6 --> E7["7. quote_sent (Proposition tarifaire transmise)"]
    E7 --> E8["8. booking_confirmed (Acompte / Réservation fermée)"]
    E8 --> E9["9. customer_acquired (Prestation exécutée)"]
    
    style E5 fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff
    style E8 fill:#d97706,stroke:#b45309,stroke-width:2px,color:#fff
```

### Échelon 1 : `page_view` & `service_view`
- **Déclenchement :** Chargement d'une route publique (`/`, `/transport`, `/hebergement`, etc.).
- **Nature :** Mesure de volume d'audience et de découvrabilité.
- **Règle :** Ne constitue en aucun cas une conversion commerciale.

### Échelon 2 : `cta_click`
- **Déclenchement :** Clic sur un bouton d'action principal (« Demander un devis », « Explorer les offres », « Voir les tarifs »).
- **Nature :** Micro-conversion d'intérêt intentionnel.
- **Paramètres :** `ctaLabel`, `ctaTarget`, `ctaLocation`.

### Échelon 3 : `whatsapp_click`
- **Déclenchement :** Clic sortant vers l'URL `wa.me/221773129090`.
- **Nature :** Intention de messagerie instantanée.
- **Règle capitale :** Le simple clic n'établit ni la réception effective du message par l'agence, ni l'envoi d'une demande complète. Ne doit pas être remonté comme conversion finale sans confirmation humaine ou webhook officiel.

### Échelon 4 : `quote_start`
- **Déclenchement :** Ouverture de la modale de devis (`QuoteRequestModal`) ou première interaction avec un formulaire dédié.
- **Nature :** Début de parcours de qualification.

### Échelon 5 : `quote_submit_attempt`
- **Déclenchement :** Clic sur le bouton de soumission du formulaire avant validation réseau.
- **Nature :** Tentative technique d'enregistrement. Si la validation Zod échoue ou que le réseau coupe, l'événement est archivé à des fins de diagnostic CRO mais ne crée aucun lead.

### Échelon 6 : `lead_created` (Le Pivot Commercial)
- **Déclenchement :** Réception par le navigateur du code HTTP 200 OK émis par `/api/quotes` ou `/api/contact` contenant la référence officielle (`reference: 'DV-20261018-XXXX'`).
- **Nature :** **La conversion d'acquisition officielle.**
- **Canaux notifiés :** GA4 (`generate_lead`), Meta Pixel (`Lead`), TikTok Pixel (`SubmitForm`), Firestore.

### Échelons 7 à 10 : Événements CRM Hors-Ligne (Server-Side)
- **`lead_qualified` :** Le conseiller clientèle valide que la demande correspond à un besoin réel avec coordonnées valides.
- **`quote_sent` :** Une cotation personnalisée détaillée est transmise au voyageur.
- **`booking_confirmed` :** La réservation est actée (paiement d'acompte ou validation bon de commande corporate).
- **`customer_acquired` :** La prestation a été effectuée et facturée.

---

## 2. Déduplication & Génération Déterministe d'Event ID

Pour réconcilier les événements émis par le navigateur (client-side) avec les événements futurs transmis par serveur (Meta Conversions API, TikTok Events API, Google Enhanced Conversions), un identifiant déterministe est généré via la fonction [`buildEventId`](file:///home/mouhammad/zahra-voyages/src/lib/tracking/events.ts) :

```typescript
export function buildEventId(eventName: string, uniqueContext?: string): string {
  const prefix = eventName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const context = uniqueContext ? `_${uniqueContext}` : '';
  const rand = Math.random().toString(36).substring(2, 10);
  const time = Date.now().toString(36);
  return `slaac_${prefix}${context}_${time}_${rand}`;
}
```

Pour l'événement `lead_created`, le contexte unique transmis est directement la référence du devis (ex: `DV-20261018-4821`), assurant que toute réconciliation serveur déduplique rigoureusement le prospect sans gonfler artificiellement les résultats publicitaires.
