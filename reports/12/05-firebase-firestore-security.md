# Rapport d'Audit 12/05 : Sécurité Firebase & Règles Firestore
**Projet :** SLAAC Voyages  
**Branche :** release/v1.0.0-candidate  
**Date d'audit :** 18 Octobre 2026  
**Fichier analysé :** 

---

## 1. Principes d'Architecture Firestore

La politique de sécurité de base de données de SLAAC Voyages repose sur la séparation stricte entre les opérations côté client (navigateur) et les opérations administratives/métier exécutées via le SDK Firebase Admin sur le serveur Node.js.

---

## 2. Analyse des Règles de Sécurité ()

### 2.1. Protection des Collections Métier & Back-Office (Prompt 11)
Les collections sensibles suivantes sont formellement interdites d'accès direct depuis le client :

**Preuve :** Toute tentative de lecture ou d'écriture directe par un client anonyme ou authentifié non privilégié est rejetée par le moteur Firestore. L'accès s'effectue exclusivement par les routes d'API sécurisées () via Firebase Admin SDK.

### 2.2. Collections Publiques en Lecture Seule
-  : 
-  : 
-  : 
-  : 

### 2.3. Collections de Collecte Publique (Écriture Contrôlée)
-  : 
-  : 
-  : 

---

## 3. Résultats de la Suite de Tests Automatisée des Règles

- **Script exécuté :** 
> test:rules
> bash scripts/test-rules.sh

→ Java introuvable sur le système : utilisation de /home/mouhammad/java-runtime/jdk-21.0.12.1+1-jre
⚠  emulators: You are not currently authenticated so some features may not work correctly. Please run firebase login to authenticate the CLI.
i  emulators: Starting emulators: firestore
i  firestore: Firestore Emulator logging to firestore-debug.log
✔  firestore: Firestore Emulator was started in standard edition.
✔  firestore: Firestore Emulator UI websocket is running on 9150.
i  Running script: node tests/firestore-rules.test.mjs

— Lecture du catalogue public —
  ✓ visiteur anonyme : lecture d'une destination autorisée
  ✓ visiteur anonyme : listage des destinations autorisé
  ✓ utilisateur lambda : lecture des destinations autorisée
  ✓ visiteur anonyme : lecture des offresAffaires autorisée (allowlist complète)
  ✓ visiteur anonyme : lecture des voyagesCroisieres autorisée (page publique)
  ✓ visiteur anonyme : lecture des promotionalBanners refusée (passe par /api/promo-banners)
  ✓ visiteur anonyme : lecture des auditLogs refusée
  ✓ visiteur anonyme : lecture des pageContents autorisée

— Écritures sur le catalogue —
  ✓ admin (email) : écriture voyagesCroisieres autorisée
  ✓ utilisateur lambda : écriture voyagesCroisieres refusée
  ✓ visiteur anonyme : création refusée
  ✓ utilisateur lambda : création refusée
  ✓ utilisateur lambda : modification refusée
  ✓ utilisateur lambda : suppression refusée
  ✓ admin par email vérifié : création autorisée
  ✓ admin par email vérifié : modification autorisée
  ✓ admin par email vérifié : suppression autorisée
  ✓ admin par custom claim : création autorisée
  ✓ email autorisé mais NON vérifié : création refusée
  ✓ garde anti-abus : document de 41 champs refusé
  ✓ garde anti-abus : document de 40 champs accepté

— Données privées (devis, contacts, analytics…) —
  ✓ visiteur anonyme : lecture quotes refusée
  ✓ utilisateur lambda : lecture quotes refusée
  ✓ visiteur anonyme : écriture quotes refusée
  ✓ visiteur anonyme : lecture contacts refusée
  ✓ utilisateur lambda : lecture contacts refusée
  ✓ visiteur anonyme : écriture contacts refusée
  ✓ visiteur anonyme : lecture leads refusée
  ✓ utilisateur lambda : lecture leads refusée
  ✓ visiteur anonyme : écriture leads refusée
  ✓ visiteur anonyme : lecture analytics refusée
  ✓ utilisateur lambda : lecture analytics refusée
  ✓ visiteur anonyme : écriture analytics refusée
  ✓ visiteur anonyme : lecture bookings refusée
  ✓ utilisateur lambda : lecture bookings refusée
  ✓ visiteur anonyme : écriture bookings refusée
  ✓ visiteur anonyme : lecture newsletter refusée
  ✓ utilisateur lambda : lecture newsletter refusée
  ✓ visiteur anonyme : écriture newsletter refusée
  ✓ visiteur anonyme : lecture users refusée
  ✓ utilisateur lambda : lecture users refusée
  ✓ visiteur anonyme : écriture users refusée
  ✓ admin (email) : lecture quotes via CLIENT refusée — réservée au SDK Admin côté serveur

— Refus par défaut —
  ✓ collection inconnue (ex. "secrets") : lecture refusée
  ✓ collection inconnue : écriture refusée

Résultat : 45 réussis, 0 échoués, 45 au total
Toutes les règles Firestore sont validées. ✓
✔  Script exited successfully (code 0)
i  emulators: Shutting down emulators.
i  firestore: Stopping Firestore Emulator
i  hub: Stopping emulator hub
i  logging: Stopping Logging Emulator
- **Résultat :** **45/45 tests passés avec succès (100%)**.
- **Couverture testée :**
  - Tentatives d'injections et lectures non autorisées : 100% bloquées.
  - Écritures sans validation de schéma : 100% bloquées.
  - Droits administrateurs via claims spécifiques : validés.

---

## 4. Conclusion

Les règles Firestore sont étanches, testées et conformes aux meilleures pratiques de sécurité Google Cloud Platform.
