# 05. Conformité et Gestion du Consentement (Google Consent Mode v2 & Loi CDP Sénégal)
**SLAAC Voyages | Privacy-First Tracking & Legal Compliance**

---

## 1. Cadre Réglementaire et Principes Directeurs

La collecte de données marketing et analytiques sur SLAAC Voyages est soumise à un double impératif réglementaire et technique :
1. **Loi sénégalaise n° 2008-12 du 25 janvier 2008** sur la protection des données à caractère personnel (régulée par la CDP - Commission de Protection des Données Personnelles).
2. **Exigences Google Consent Mode v2** (obligatoire depuis mars 2024 pour la diffusion et la modélisation des conversions dans Google Ads et GA4 dans l'Espace Économique Européen et pour le trafic international).

### Principes Clés Respectés
- **Consentement Libre, Spécifique et Éclairé :** Aucun cookie non essentiel ni traceur publicitaire n'est déposé avant l'action explicite de l'utilisateur.
- **Principe de Minimisation :** Aucune Donnée Personnelle Identifiable (PII : nom, email, téléphone brut) n'est jamais exposée dans les URLs, les paramètres de requêtes d'événements, ou les dataLayers publics.
- **Droit de Retrait Immédiat :** L'utilisateur peut à tout instant modifier ou révoquer son consentement via le lien dédié « Gestion des cookies » présent dans le footer.

---

## 2. Architecture Technique Google Consent Mode v2

L'implémentation est centralisée dans [src/lib/tracking/consent.ts](file:///home/mouhammad/zahra-voyages/src/lib/tracking/consent.ts).

### 2.1 États de Consentement par Défaut (Default Denied)

Dès le premier chargement de la page, avant tout script tiers, `gtag('consent', 'default')` est initialisé :

```javascript
gtag('consent', 'default', {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  wait_for_update: 500
});
```

### 2.2 Mise à Jour Dynamique (Consent Update)

Lorsque l'internaute interagit avec la bannière [src/components/tracking/consent-banner.tsx](file:///home/mouhammad/zahra-voyages/src/components/tracking/consent-banner.tsx) :

- **Clic sur "Tout accepter" :**
  ```javascript
  gtag('consent', 'update', {
    analytics_storage: 'granted',
    ad_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted'
  });
  ```
- **Clic sur "Continuer sans accepter" / "Refuser" :**
  Maintien de l'état `denied`. GA4 fonctionne en mode pings modélisés sans cookies. Meta et TikTok sont bloqués.
- **Personnalisation fine :** L'utilisateur peut autoriser la mesure d'audience (`analytics_storage`) tout en refusant le ciblage publicitaire (`ad_storage`, `ad_user_data`, `ad_personalization`).

### 2.3 Persistance Locale Sécurisée

Le consentement est sérialisé dans `localStorage` sous la clé `slaac_consent_v2` avec timestamp ISO :

```json
{
  "analytics": true,
  "marketing": false,
  "preferences": true,
  "updatedAt": "2026-10-18T18:45:00.000Z",
  "version": "2.0"
}
```

---

## 3. Garde-Fous de Confidentialité et Protection PII

Dans [src/lib/tracking/provider.ts](file:///home/mouhammad/zahra-voyages/src/lib/tracking/provider.ts) :

```typescript
export function sanitizeEventPayload<T extends Record<string, unknown>>(payload: T): T {
  const sanitized = { ...payload };
  // Suppression systématique de tout champ pouvant contenir de la PII en clair
  delete sanitized.email;
  delete sanitized.phone;
  delete sanitized.nom;
  delete sanitized.prenom;
  delete sanitized.nomComplet;
  delete sanitized.password;
  delete sanitized.notes;
  delete sanitized.adresse;
  return sanitized;
}
```

Pour les conversions offline et le matching avancé (Enhanced Conversions / CAPI), le hachage cryptographique **SHA-256 normalisé** (lowercase, sans espaces) est appliqué exclusivement côté serveur sécurisé.

---

## 4. Composant Utilisateur et Accessibilité

1. **Bannière Révélatrice Non Intrusive :** Visible en bas d'écran avec z-index élevé (`z-50`), supportant le focus trap et la navigation au clavier.
2. **Support Multilingue Intégral :** Textes adaptés en français et en anglais avec références explicites à la politique de confidentialité locale.
3. **Lien de Réouverture :** Intégré dans le Footer ([src/components/layout/footer.tsx](file:///home/mouhammad/zahra-voyages/src/components/layout/footer.tsx)) via l'événement personnalisé `slaac:open-consent-modal`.
