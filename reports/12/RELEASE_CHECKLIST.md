# Checklist Officielle de Mise en Production (Release Candidate v1.0.0)
## SLAAC Voyages | Prompt 12/12

Cette checklist détaille chronologiquement toutes les étapes indispensables pour déployer la version candidate en production sous le contrôle du responsable de release.

---

### 1. Prérequis et Contrôles Pré-Déploiement
- [x] **Branche candidate identifiée** : `release/v1.0.0-candidate` (issue de `feat/slaac-admin-crm-enterprise`).
- [x] **Code propre et testé** : 0 erreur TypeScript (`npx tsc --noEmit`), 34/34 critères de certification validés.
- [x] **Build de production validé** : `npm run build` exécuté avec succès (95/95 routes compilées).
- [x] **Sauvegarde des règles Firestore existantes** : Sauvegardée sous `firestore.rules.bak` et tracée dans Git.
- [x] **Matrice des variables d'environnement Vercel** : Documentée dans `reports/12/06-secrets-environment-security.md`.

---

### 2. Actions Requérant une Autorisation Explicite (En attente d'accord)
- [ ] **Autorisation Direction Générale** : Accord formel de mise en ligne en production.
- [ ] **Déploiement des Règles Firestore** :
  ```bash
  firebase deploy --only firestore:rules,firestore:indexes
  ```
- [ ] **Déploiement Vercel Production** :
  ```bash
  vercel --prod
  ```
- [ ] **Attribution du rôle Super Admin de production** : Exécution du script sécurisé `scripts/set-admin-claim.mjs` pour le compte direction authentifié.

---

### 3. Contrôles Immédiats Post-Déploiement (T0 + 15 min)
- [ ] **Vérification de la page d'accueil** : Chargement fluide de `https://slaacvoyages.com` et `https://slaacvoyages.com/en`.
- [ ] **Test de soumission de formulaire de devis** : Vérifier la réception du lead dans le CRM et l'accusé de réception email.
- [ ] **Test de connexion au back-office** : Connexion réussie sur `https://slaacvoyages.com/admin/login`.
- [ ] **Contrôle du Sitemap & Robots.txt** :
  - `https://slaacvoyages.com/robots.txt` accessible et bloquant `/admin`.
  - `https://slaacvoyages.com/sitemap.xml` accessible et bien formé.
- [ ] **Contrôle des images Cloudinary** : Affichage correct des visuels sans erreur 404 ni dégradation de qualité.

---

### 4. Surveillance Étalée
- [ ] **T0 + 1h** : Vérification des logs d'erreurs serveur Vercel (taux d'erreur 5xx < 0.01%).
- [ ] **T0 + 24h** : Contrôle du volume de demandes traitées dans `/admin/leads` et vérification de la délivrabilité Resend/LWS.
- [ ] **T0 + 72h** : Examen des métriques Search Console et Google Analytics 4.
