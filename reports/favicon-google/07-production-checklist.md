# Phase K : Checklist de Déploiement & Préparation Production
**Projet :** SLAAC Voyages (https://slaacvoyages.com)  
**Date d'audit :** 19 octobre 2026  

---

## 1. État des Composants en Production

| Composant | Statut actuel | Action requise |
| :--- | :--- | :--- |
| **Favicons conformes Google (48, 96, 192, ICO)** | **DÉPLOYÉ EN PRODUCTION** | Aucun (Déjà servi en direct avec code 200). |
| **DNS LWS (A, CNAME)** | **ACTIF SUR VERCEL** | Aucun (Pointe déjà sur l'Edge Vercel `216.198.79.1`). |
| **Messagerie LWS (MX, SPF)** | **INTACTE SUR LWS** | Aucun (Messagerie protégée). |
| **Balise de vérification Search Console** | **DÉPLOYÉE EN PRODUCTION** | Utiliser pour valider la propriété en 1 clic. |
| **Schéma Schema.org `WebSite` (Site Names)** | **CORRIGÉ DANS LE CODE LOCAL** | En attente de validation pour git push / prod. |
| **Suite de tests (15/15)** | **VALIDÉE LOCALEMENT** | Code prêt pour livraison. |

---

## 2. Checklist Pré-Déploiement

- [x] Vérification visuelle des images : Emblème officiel SLAAC Voyages exclusif.
- [x] Absence totale de mention ou logo LWS dans les fichiers graphiques.
- [x] Dimensions strictement conformes Google Search Central (48x48 px, multiples de 48 px).
- [x] Validation TypeScript (`npx tsc --noEmit`) : 0 erreur.
- [x] Validation SEO technique (`tests/seo-technical.test.mjs`) : 20/20 succès.
- [x] Validation Suite Favicon (`tests/favicon-google.test.mjs`) : 15/15 succès.
- [x] Non-régression CRM, Firebase et Outbox Email confirmée.
- [ ] Autorisation formelle de l'utilisateur pour le commit et le déploiement en production des ajouts de schéma `WebSite`.

---

## 3. Demande d'Autorisation pour Mise en Production du Schéma `WebSite`

Les fichiers suivants sont modifiés et prêts à être commités :
1. [`src/lib/seo-schema.ts`](file:///home/mouhammad/zahra-voyages/src/lib/seo-schema.ts) : Ajout du générateur Schema.org `WebSite`.
2. [`src/app/layout.tsx`](file:///home/mouhammad/zahra-voyages/src/app/layout.tsx) : Injection du script JSON-LD `WebSite` pour Google Site Names.
3. [`tests/favicon-google.test.mjs`](file:///home/mouhammad/zahra-voyages/tests/favicon-google.test.mjs) : Nouvelle suite de tests automatisés.

> [!IMPORTANT]
> Conformément à vos instructions strictes (*« Ne pas déclencher de déploiement en production sans mon autorisation »*), ces modifications restent cantonnées à l'espace de travail local tant que vous n'avez pas donné votre feu vert pour le commit et le déploiement sur Vercel.
