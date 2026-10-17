# Checklist de Mise en Production — Système Email SLAAC Voyages (Phase 01/12)

> **Date :** 17 octobre 2026  
> **Branche Git :** `feat/slaac-transactional-emails`  
> **Domaine visé :** `https://slaacvoyages.com`  
> **Plateforme :** Vercel & Cloud Firestore  

---

## 1. Variables d'Environnement à Configurer sur Vercel

Pour activer l'envoi réel en production sur Vercel, exécuter les commandes CLI suivantes ou renseigner les clés dans le dashboard Vercel (`Project Settings > Environment Variables`).

### 1.1. Option Recommandée : SMTP Professionnel LWS (`contact@slaacvoyages.com`)

```bash
# Activation du provider SMTP LWS
vercel env add EMAIL_PROVIDER production
# Entrer: smtp

vercel env add SMTP_HOST production
# Entrer: mail.slaacvoyages.com

vercel env add SMTP_PORT production
# Entrer: 465

vercel env add SMTP_SECURE production
# Entrer: true

vercel env add SMTP_USER production
# Entrer: contact@slaacvoyages.com

vercel env add SMTP_PASS production
# Entrer: [Mot de passe de la boîte mail LWS]

vercel env add AGENCY_EMAIL production
# Entrer: contact@slaacvoyages.com

vercel env add MANAGER_EMAIL production
# Entrer: mdslaacvoyages@gmail.com

vercel env add FROM_EMAIL production
# Entrer: contact@slaacvoyages.com
```

### 1.2. Option Alternative : Relais HTTP SaaS (SendGrid ou Resend)

Si un relais HTTP est privilégié pour éviter les connexions TCP directes depuis Vercel :

```bash
# Alternative SendGrid
vercel env add EMAIL_PROVIDER production    # sendgrid
vercel env add SENDGRID_API_KEY production   # SG.xxxxxxxxxxxx

# OU Alternative Resend
vercel env add EMAIL_PROVIDER production    # resend
vercel env add RESEND_API_KEY production     # re_xxxxxxxxxxxx
```

---

## 2. Validation DNS & Délivrabilité chez LWS

Le registrar du domaine étant **LWS**, vérifier la conformité des enregistrements dans le panneau DNS :

| Type | Hôte | Valeur Actuelle / Requise | Statut |
| :--- | :--- | :--- | :---: |
| **MX** | `@` | `10 mail.slaacvoyages.com` | **Conforme** |
| **SPF** | `@` | `v=spf1 include:_spf.lws.fr ~all` *(si SMTP LWS pur)* | **Conforme** |
| **SPF enrichi** | `@` | `v=spf1 include:_spf.lws.fr include:sendgrid.net ~all` *(si SendGrid utilisé)* | À ajuster si option SendGrid |
| **DKIM** | `dkim._domainkey` | Géré automatiquement par la messagerie LWS | **Conforme** |
| **DMARC** | `_dmarc` | `v=DMARC1; p=none; sp=none; ...` | **Conforme** |

---

## 3. Règles de Sécurité Firestore (`firestore.rules`)

La collection `emailOutbox` stocke les clés d'idempotence, adresses de destination et statuts de rejeu.
- **Règle impérative :** Aucun client web ne doit avoir accès en lecture ni en écriture à `emailOutbox`.
- Toutes les opérations s'effectuent exclusivement via le SDK Firebase Admin côté serveur (qui outrepasse les règles clients).
- Vérification dans `firestore.rules` :
  ```javascript
  match /emailOutbox/{document=**} {
    allow read, write: if false;
  }
  ```

---

## 4. Protocole de Validation Post-Déploiement

Dès le déploiement sur Vercel validé, dérouler pas à pas le protocole de vérification suivant :

### Étape 1 : Demande de Devis de Test
1. Ouvrir `https://slaacvoyages.com/devis` dans un navigateur.
2. Soumettre un devis avec :
   - Nom : `Test Validation Production`
   - Email : Une adresse de test personnelle accessible
   - Téléphone : `+221 77 000 00 00`
   - Destination : `Dakar - Découverte`
3. Vérifier que l'écran de confirmation s'affiche immédiatement avec sa référence `DV-XXXXXXXX-XXXX`.

### Étape 2 : Réception des Emails
- [ ] **Accusé de réception client :** Arrive dans les 15 secondes en boîte principale (vérifier qu'il ne passe pas en spam). Vérifier la présence du disclaimer légal et des boutons WhatsApp/Téléphone.
- [ ] **Notification Agence :** Reçue sur `contact@slaacvoyages.com` avec les liens d'action directe.
- [ ] **Notification Direction :** Reçue sur `mdslaacvoyages@gmail.com` avec le tag `[DIRECTION]`.

### Étape 3 : Contrôle CRM & Rejeu
1. Se connecter à l'administration : `https://slaacvoyages.com/admin/login`.
2. Accéder à la demande dans `/admin/demandes/devis`.
3. Vérifier la carte **"Délivrabilité Emails"** dans la colonne latérale :
   - Client : Badge vert `Envoyé`.
   - Agence : Badge vert `Envoyé`.
   - Direction : Badge vert `Envoyé`.
4. Tester le bouton **"Rejouer"** : vérifier que le toast de confirmation apparaît et que l'historique reste cohérent.

---

## 5. Procédure de Rollback

En cas de problème en production :
1. Repasser immédiatement `EMAIL_PROVIDER=mock` sur Vercel. Le système continuera d'enregistrer 100% des leads dans Firestore sans bloquer aucun visiteur.
2. Les demandes resteront consultables dans le CRM Admin.
3. Une fois l'incident résolu, les notifications pourront être réémises via le bouton "Rejouer" ou le script de reprise.
