# 22. Préparation au Déploiement et Décision de Mise en Production
**SLAAC Voyages | Liste de Contrôle Finale, Plan de Rollback et Décision de Recette**

---

## 1. Liste de Contrôle Pré-Déploiement (Checklist Opérationnelle)

Avant toute mise en ligne et avant tout engagement financier publicitaire, les 10 vérifications suivantes ont été menées :

- [x] **1. Consentement Réglementaire :** Google Consent Mode v2 actif par défaut (`denied`) avec mise à jour immédiate sur consentement utilisateur (conforme Loi CDP 2008-12 Sénégal).
- [x] **2. Rétention d'Attribution :** Rétention multi-pages éprouvée des paramètres UTMs et Click IDs (`gclid`, `fbclid`, `ttclid`) dans `sessionStorage`.
- [x] **3. Intégrité des Conversions :** Événement commercial `lead_created` dissocié du simple clic, émis exclusivement après confirmation serveur HTTP 200 OK avec référence unique (`DV-YYYYMMDD-XXXX`).
- [x] **4. Zéro Fuite de Données Personnelles :** Assainissement automatique (`sanitizeEventPayload`) éliminant toute PII en clair des dataLayers publics.
- [x] **5. Landing Pages Déployées :** Pages `/lp/transfert-aibd` et `/en/lp/transfert-aibd` opérationnelles, réactives sur mobile, balisées Schema.org et intégrées au Sitemap XML.
- [x] **6. Intégration WhatsApp Business :** Liens contextuels avec messages préformatés et dispatch de l'événement `whatsapp_click`.
- [x] **7. Pipelines de Déduplication Prêts :** Générateur d'identifiants déterministes `buildEventId` actif pour réconcilier Pixel navigateur et APIs serveur (CAPI / Events API).
- [x] **8. Tableaux de Bord CRM Opérationnels :** Endpoint `/api/admin/statistiques/overview` enrichi pour agréger les performances par campagne et canal d'acquisition.
- [x] **9. Garde-Fou Financier Absolu :** Zéro campagne active, zéro dépense publicitaire engagée. Toutes les configurations publicitaires sont livrées en mode maquette / brouillon.
- [x] **10. Suite de Tests Validée :** Banc d'essai automatisé couvrant les 25 critères avec un taux de réussite de 100%.

---

## 2. Procédure d'Activation des Campagnes (Phase Live)

Une fois l'accord formel obtenu de la direction :
1. Définir les variables d'environnement dans Vercel :
   - `NEXT_PUBLIC_GA_ID`
   - `NEXT_PUBLIC_GTM_ID`
   - `NEXT_PUBLIC_META_PIXEL_ID`
   - `NEXT_PUBLIC_TIKTOK_PIXEL_ID`
2. Créer la campagne Google Ads Search `SN_DAK_SEARCH_TRANSFERT-AIBD` en important les annonces RSA et les mots-clés de `reports/10/06-google-ads-search-strategy.md`.
3. Activer le scénario d'investissement validé (**Scénario A recommandé pour les 14 premiers jours**).
4. Suivre quotidiennement les conversions dans `/admin/leads` et dans le rapport hebdomadaire.

---

## 3. Plan de Secours et Procédure de Retour Arrière (Rollback)

Si un dysfonctionnement venait à survenir après activation :

### 3.1 Dysfonctionnement des Balises Tiers
- Si un script tiers ralentit le site ou génère des erreurs console : désactiver la variable d'environnement correspondante sur Vercel. Le provider interne ([src/lib/tracking/provider.ts](file:///home/mouhammad/zahra-voyages/src/lib/tracking/provider.ts)) gère gracieusement l'absence des objets `window.dataLayer`, `window.fbq`, ou `window.ttq` sans perturber le formulaire.

### 3.2 Dérive de Coût Publicitaire
- Si une campagne dépasse son CPC plafond ou son CPL cible de `4 500 FCFA` : mise en pause immédiate depuis Google Ads ou Meta Ads Manager.

### 3.3 Retour Arrière du Code
- La branche dédiée `feat/slaac-growth-conversion-tracking` est isolée et peut être revertée via Git sans aucun impact sur la branche principale `main` :
  ```bash
  git checkout main
  ```

---

## 4. Statut Officiel de Livraison

> ### **STATUT OFFICIEL : PRÊT POUR VALIDATION DES CAMPAGNES ET DU DÉPLOIEMENT**
>
> L'architecture technique de tracking, de consentement, de capture d'attribution, de landing pages et de qualification CRM est intégralement construite, testée et documentée.
> Aucune dépense financière n'a été engagée. Le système est en attente de la validation formelle de l'utilisateur pour le déploiement en production et l'activation des campagnes.
