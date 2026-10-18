# Rapport d'Audit 12/24 : Plan de Déploiement en Production (Runbook)
**Projet :** SLAAC Voyages  
**Branche :** release/v1.0.0-candidate vers `main`  
**Date :** 18 Octobre 2026

---

## 1. Avertissement Préalable Obligatoire
Ce document décrit la procédure technique à exécuter **UNIQUEMENT APRÈS APPROBATION FORMELLE DU CLIENT**. Aucune commande de déploiement en production (`vercel --prod`) ne doit être exécutée sans ordre exprès.

---

## 2. Procédure Étape par Étape

### 2.1. Phase 1 : Pré-déploiement (Vérifications Finales)
1. Vérifier que la branche locale est bien sur `release/v1.0.0-candidate`.
2. S'assurer que le dépôt Git est propre (`git status` clean).
3. Exécuter une dernière passe de vérification :
   - `npx tsc --noEmit` (0 erreur requise)
   - `npm run test:rules` (45/45 requis)
   - `npm run test:api` (19/19 requis)
   - `npm run test:crm` (13/13 requis)
   - `npm run build` (succès requis)
4. Vérifier la présence de toutes les variables d'environnement de production sur le tableau de bord Vercel.

### 2.2. Phase 2 : Fusion et Déploiement de Production
1. Créer une Pull Request ou fusionner la branche candidate dans `main` :
   ```bash
   git checkout main
   git merge release/v1.0.0-candidate --no-ff -m "chore(release): v1.0.0 production deployment"
   git tag -a v1.0.0 -m "Release v1.0.0 SLAAC Voyages"
   git push origin main --tags
   ```
2. Déclencher le déploiement Vercel via GitHub webhook ou via commande autorisée :
   ```bash
   vercel --prod
   ```

### 2.3. Phase 3 : Recette Post-Déploiement (Sanity Checks)
1. Tester l'accès au domaine `https://slaacvoyages.com`.
2. Effectuer une soumission de devis test avec l'email `test@slaacvoyages.com`.
3. Vérifier la réception de la notification agence et l'enregistrement dans le CRM.
4. Supprimer immédiatement la demande test du CRM via le compte Super Admin.
