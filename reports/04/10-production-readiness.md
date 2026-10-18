# 10 — Production Readiness & Plan de Déploiement
## SLAAC Voyages | Synthèse d'Aptitude à la Production (Prompt 04/12)

---

### 1. Checklist des 20 Critères d'Acceptation

| N° | Critère d'Acceptation | Vérification Technique | Statut |
| :---: | :--- | :--- | :---: |
| **1** | Branche git dédiée isolée | Branche `feat/slaac-design-system` créée et active | **CONFORME** |
| **2** | Logo officiel SLAAC Voyages préservé | Fichier `/logo-slaac.png` utilisé sans altération | **CONFORME** |
| **3** | Palette de marque harmonisée | Tokens `slaac-navy`, `slaac-gold`, `slaac-green` dans Tailwind | **CONFORME** |
| **4** | Typographie hiérarchisée et contrastée | Inter (corps) + Playfair Display (titres), ratios WCAG AA | **CONFORME** |
| **5** | Header desktop aéré (5 entrées) | MenuPrestations dropdown, lien JO 2026, À propos, Contact | **CONFORME** |
| **6** | Tiroir mobile complet (Sheet) | Touch targets ≥ 48 px, fermeture auto au clic, WhatsApp + Devis | **CONFORME** |
| **7** | Hero section haute conversion | Titre fort, CTA Devis doré, WhatsApp direct, réassurance 4 points | **CONFORME** |
| **8** | Grille d'orientation express (3 parcours) | "Je viens au Sénégal", "Je voyage", "Affaires & Délégation" | **CONFORME** |
| **9** | Grille des 6 prestations officielles | Titre exact, prix d'appel indicatifs, badges de spécialité | **CONFORME** |
| **10** | Page Transport AIBD transparente | Tarifs forfaitaires fixes (30 000 à 35 000 FCFA), garantie retard vol | **CONFORME** |
| **11** | Page Hébergement sécurisée | Badges essentiels : Groupe électrogène 24/7, Fibre, Réserve d'eau | **CONFORME** |
| **12** | Page JO Dakar 2026 | Logistique délégations, pas d'affiliation trompeuse, liens officiels | **CONFORME** |
| **13** | Page Assistance Voyage | Disclaimer légal consulaire obligatoire, forfaits visas express | **CONFORME** |
| **14** | Page À Propos institutionnelle | Mentions d'enregistrement au Sénégal (NINEA, RCCM, Plateau) | **CONFORME** |
| **15** | Barre de conciergerie mobile flottante | Ancrée en bas d'écran (`safe-area-pb`), WhatsApp + Devis express | **CONFORME** |
| **16** | Zéro débordement horizontal | 10 viewports testés de 320 px à 1920 px validés à +0 px | **CONFORME** |
| **17** | Suppression des hacks CSS aveugles | Pas de `overflow-x: hidden` sur `html, body`, confinement géométrique | **CONFORME** |
| **18** | Préservation intégrale backend & emails | Schémas Zod, CRM et Outbox transactionnelle (Prompts 01 et 02) intacts | **CONFORME** |
| **19** | Validation automatisée 100 % | 148 assertions automatisées réussies (TypeScript, CRM, Email, UI) | **CONFORME** |
| **20** | Captures d'écran Avant / Après | 11 captures initiales + 11 captures finales dans `reports/04/screenshots/` | **CONFORME** |

---

### 2. Plan de Déploiement en Production (Sous réserve d'autorisation)

> [!IMPORTANT]
> Conformément aux directives strictes de la mission, **aucun déploiement automatique en production n'est effectué à ce stade**. Les modifications restent confinées sur la branche locale `feat/slaac-design-system`.

Lorsque l'autorisation de mise en production sera donnée par le responsable du projet, la procédure ordonnée suivante sera exécutée :

1. **Revue de code & Fusion Git** :
   ```bash
   git checkout main
   git merge --no-ff feat/slaac-design-system -m "feat(design-system): merge premium mobile-first UX/UI redesign (prompt 04/12)"
   git push origin main
   ```
2. **Build de Production Local (Sanity Check)** :
   ```bash
   npm run build
   ```
3. **Déploiement sur l'environnement de staging / preview Vercel** :
   ```bash
   vercel --preview
   ```
4. **Vérification en pré-production** :
   - Tester le chargement sur smartphone réel (iOS Safari et Android Chrome).
   - Effectuer un test de soumission de devis réel avec vérification de la notification email agence et de la création du lead dans Firestore.
5. **Promotion vers la production** :
   ```bash
   vercel --prod
   ```

---

### 3. Plan de Rollback (Retour Arrière Immédiat)

En cas d'anomalie imprévue constatée sur l'environnement de production après déploiement :

1. **Rollback instantané via Vercel CLI (Durée < 30 secondes)** :
   - Revenir immédiatement au déploiement de production précédent via le tableau de bord Vercel ou via la commande :
     ```bash
     vercel rollback
     ```
2. **Rollback Git au commit de référence `a3e3c7b`** :
   ```bash
   git checkout main
   git revert -m 1 HEAD
   git push origin main
   ```
3. **Intégrité des données** :
   - Les contrats de données Firestore n'ayant subi aucune rupture, aucune migration descendante ou manipulation de base de données n'est requise.

---

### 4. Recommandations de Suivi & Observabilité Post-Lancement

- **Surveillance du taux de conversion CRO** :
  - Observer l'évolution du ratio Visiteurs uniques / Demandes de devis dans le CRM SLAAC sur les 14 premiers jours.
- **Télémétrie des clics WhatsApp** :
  - Suivre la répartition des clics entre la barre flottante mobile (`mobile-floating-bar`), le hero (`hero-secondary`) et le header.
- **Core Web Vitals réels (CrUX / Vercel Speed Insights)** :
  - Vérifier que le LCP mobile en conditions réelles reste inférieur à 1.5 seconde sur le réseau 4G sénégalais (Orange, Sonatel, Free).
