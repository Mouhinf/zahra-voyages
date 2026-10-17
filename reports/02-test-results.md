# RAPPORT 02/12 — PHASES K : RÉSULTATS DES TESTS AUTOMATISÉS

## 1. Synthèse de l'exécution

| Suite de tests | Commande exécutée | Tests passés | Échecs | Statut |
| :--- | :--- | :---: | :---: | :---: |
| **Formulaires, Schémas, CRM & Sécurité** | `node tests/forms-crm-system.test.mjs` | **16 / 16** | 0 | **VALIDE** |
| **CRM Serveur & Émulateur Firestore** | `npm run test:crm` | **13 / 13** | 0 | **VALIDE** |
| **Règles de Sécurité Firestore** | `npm run test:rules` | **45 / 45** | 0 | **VALIDE** |
| **Emails Transactionnels & Outbox** | `node tests/email-system.test.mjs` | **11 / 11** | 0 | **VALIDE** |
| **Contrôle Typage TypeScript** | `npx tsc --noEmit` | **Zero erreur** | 0 | **VALIDE** |

**Total des tests unitaires et d'intégration validés : 85 tests réussis, 0 échec.**

---

## 2. Détail des vérifications par scénario fonctionnel

### Scénario 1 : Devis complet standard
- Payload complet avec service croisières, cabine, durée, voyageurs et message.
- Validation Zod réussie.

### Scénario 2 : Devis sans adresse email (téléphone uniquement)
- Accepte un lead téléphonique pur sans forcer un email fictif.
- Préserve la capture de contact.

### Scénario 3 : Formats de téléphones internationaux
- Testé avec succès sur formats Sénégal (`+221 77 312 90 90`, `773129090`), France (`+33 6 12 34 56 78`), Maroc (`+212 661-123456`), USA (`+1 (555) 123-4567`).
- Rejet immédiat des numéros invalides ou trop courts (< 6 chiffres).

### Scénario 4 : Noms Unicode et caractères accentués
- Acceptation intégrale des prénoms et noms avec apostrophes, tirets et accents (« Éléonore d'Aigrefeuille », « Cheikh Abdou-Rahmane Sène », etc.).

### Scénario 5 : Règle de cohérence des dates
- Date de retour antérieure à la date de départ rejetée avec précision sur le champ `returnDate`.
- Date de retour égale ou postérieure acceptée.

### Scénario 6 : Déclinaisons contextuelles par service
- Hébergement (`nights`, `roomType`), Transport (`transportClass`, `roundTrip`), Affaires (`companyName`, `eventType`, `attendees`), Excursions (`pickupLocation`, `excursionDate`).

### Scénario 7 : Pot de miel anti-spam (`website`)
- Détection des soumissions robots et neutralisation silencieuse.

### Scénario 8 : Attribution marketing (UTM)
- Collecte et stockage sans dégradation des paramètres `utmSource`, `utmMedium`, `utmCampaign`, `utmContent`, `utmTerm`, `referrer`, `landingPage`.

### Scénario 9 : Élimination stricte des clés `undefined` (`cleanFirestoreData`)
- Nettoyage récursif validé sur structures imbriquées profondes : 0 crash Firestore.

### Scénario 10 : Formulaire de contact partagé
- Synchronisation parfaite entre `/contact`, `home-contact-quick` et `/api/contact`.

### Scénario 11 : Priorités commerciales & Relances CRM
- Validation des 4 priorités (`urgente`, `haute`, `normale`, `basse`).
- Programmation, modification et réinitialisation de `nextFollowUpAt`.
- Enregistrement horodaté dans le journal d'audit du lead.
