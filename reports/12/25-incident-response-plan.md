# Rapport d'Audit 12/25 : Plan de Gestion des Incidents Opérationnels
**Projet :** SLAAC Voyages  
**Branche :** release/v1.0.0-candidate  
**Date :** 18 Octobre 2026

---

## 1. Niveaux de Sévérité des Incidents

- **INCIDENT CRITIQUE (SEV-1) :** Site public inaccessible, impossibilité de soumettre des devis, faille de sécurité active. (Délai d'intervention < 15 min).
- **INCIDENT MAJEUR (SEV-2) :** Ralentissement sensible, défaillance temporaire de l'envoi d'emails, back-office indisponible. (Délai d'intervention < 1 heure).
- **INCIDENT MINEUR (SEV-3) :** Erreur cosmétique, anomalie d'affichage sur un navigateur spécifique. (Délai d'intervention < 24 heures).

---

## 2. Procédures Opérationnelles par Scénario

### Scénario 1 : Le site web ne répond plus (Erreur 500 / 503)
1. Consulter les statuts de service Vercel (`https://www.vercel-status.com`) et GCP (`https://status.cloud.google.com`).
2. Examiner les Runtime Logs sur la console Vercel du projet.
3. Si le problème est consécutif à une mise en production : **exécuter le rollback Vercel instantané** vers la version précédente stable.

### Scénario 2 : Les devis ne s'enregistrent plus
1. Vérifier la connectivité Firestore et l'état des quotas journaliers.
2. Vérifier la validité des clés Firebase Admin (`FIREBASE_ADMIN_PRIVATE_KEY`).
3. Les demandes non envoyées par email restent stockées dans la base si l'échec est lié au SMTP.

### Scénario 3 : Les emails transactionnels ne sont pas délivrés
1. Vérifier la console LWS SMTP (quota horaire d'envoi ou blocage d'IP).
2. Basculer sur le transport SendGrid via la variable d'environnement ou le déclenchement automatique du fallback.
3. Vérifier les rapports de réputation DMARC et l'absence de signalement en blacklist.

### Scénario 4 : Perte d'accès Super Admin
1. Utiliser le script de récupération `src/scripts/create-super-admin.ts` exécuté en local avec les droits du Service Account Firebase.
2. Réinitialiser le mot de passe de l'administrateur légitime et révoquer les sessions actives.
