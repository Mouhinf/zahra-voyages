# Rapport d'Audit 12/04 : Audit Approfondi de Cybersécurité
**Projet :** SLAAC Voyages  
**Branche :** release/v1.0.0-candidate  
**Date d'audit :** 18 Octobre 2026  
**Référence Cadre :** OWASP Top 10 (2021/2026) & ANSSI Recommandations Web

---

## 1. Périmètre de l'Audit de Sécurité

L'audit a ciblé l'ensemble de la surface d'exposition applicative :
1. Authentification et gestion des sessions (, Firebase Auth, Tokens JWT).
2. Contrôle d'accès basé sur les rôles (RBAC) sur les routes d'API et interfaces d'administration.
3. Protection contre les injections (Firestore injection, NoSQL, XSS, SSRF).
4. En-têtes HTTP de sécurité et politique de restriction des ressources (CSP, HSTS).
5. Mécanismes de limitation de débit (Rate Limiting).

---

## 2. Évaluation des Risques OWASP Top 10

### 2.1. A01:2021 - Broken Access Control
- **Contrôle :** Vérification des middlewares d'authentification et des endpoints .
- **Résultat :** **CONFORME**. Tous les endpoints administratifs vérifient la présence du token de session via  et valident les permissions requises (, , , etc.).
- **Dénégation par défaut :** Un utilisateur sans rôle ou non authentifié reçoit systématiquement un code HTTP  ou .

### 2.2. A02:2021 - Cryptographic Failures
- **Contrôle :** Transmission des données sensibles et stockage des identifiants.
- **Résultat :** **CONFORME**. Forçage HTTPS strict avec HSTS (). Aucun mot de passe en clair dans la base de données. Chiffrement en transit et au repos via GCP / Firebase.

### 2.3. A03:2021 - Injection
- **Contrôle :** Injection SQL / NoSQL et Cross-Site Scripting (XSS).
- **Résultat :** **CONFORME**. Les requêtes Firestore utilisent l'API SDK paramétrée avec typage Zod strict en amont (). Le rendu React désinfecte nativement les sorties HTML ; aucun usage de  non assaini n'a été détecté.

### 2.4. A04:2021 - Insecure Design & Rate Limiting
- **Contrôle :** Limitation de débit contre le brute-force et le déni de service applicatif.
- **Résultat :** **CONFORME**. Implémentation du limiteur de requêtes dans  sur les formulaires de devis (), de contact et d'authentification admin ().

### 2.5. A05:2021 - Security Misconfiguration
- **Contrôle :** En-têtes HTTP configurés dans .
- **Résultat :** **CONFORME**. Présence des en-têtes suivants :
  -  (anti-clickjacking)
  -  (anti-MIME sniffing)
  - 
  - : directives restrictives pour scripts, styles et connexions externes.

---

## 3. Synthèse de l'Audit Cybersécurité

Aucune faille exploitable à distance ni vulnérabilité critique n'a été identifiée. L'architecture respecte les principes de moindre privilège et de défense en profondeur.
