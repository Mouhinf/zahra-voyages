# Rapport 19 : Sécurité Applicative, Protection des Données Personnelles et Sauvegardes
## SLAAC Voyages | Prompt 11/12

### 1. Conformité Réglementaire (CDP Sénégal et RGPD)
En tant qu'opérateur de voyage traitant des données de citoyens sénégalais et de voyageurs internationaux, SLAAC Voyages est soumis aux exigences de la Commission de Protection des Données Personnelles (CDP) du Sénégal et aux standards du RGPD :
- **Consentement Éclairé** : Les formulaires publics recueillent l'acceptation expresse de traitement des données pour la gestion du voyage.
- **Droit à l'Oubli et Anonymisation** : Procédure d'anonymisation des fiches prospects obsolètes tout en conservant les agrégats statistiques anonymisés.
- **Minimisation de la Collecte** : Seules les données indispensables à l'émission des titres de transport et aux réservations d'hôtels sont requises.

### 2. Sécurité Applicative et Défense Contre les Cyberattaques
- **Protection Contre les Injections** : Validation systématique de tous les corps de requêtes entrants via des schémas stricts Zod.
- **Protection Anti-IDOR** : Vérification systématique que l'utilisateur possède la permission requise et que l'entité ciblée est accessible.
- **Headers de Sécurité HTTP** : Configuration de Content Security Policy (CSP), Strict-Transport-Security (HSTS), X-Frame-Options (DENY), et X-Content-Type-Options (nosniff).
- **Protection des Tokens** : Les tokens d'authentification Firebase sont transmis via des en-têtes HTTP `Authorization: Bearer` chiffrés en HTTPS / TLS 1.3.

### 3. Stratégie de Sauvegarde et Reprise d'Activité (PCA/PRA)
- **Sauvegarde Quotidienne Automatisée** : Export complet de Firestore vers un bucket Google Cloud Storage multi-régional avec politique de rétention de 30 jours glissants.
- **Sauvegardes Ponctuelles Avant Déploiement** : Snapshot manuel avant toute modification majeure de schéma.
- **RTO / RPO Cibles** : RPO (Recovery Point Objective) inférieur à 24 heures en cas de sinistre majeur, RTO (Recovery Time Objective) de restauration complète inférieur à 2 heures via les outils managés `gcloud firestore import`.
