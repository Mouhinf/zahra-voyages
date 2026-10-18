# Intégration CRM, E-Réputation & Notifications Service Client
## SLAAC Voyages | Passerelle entre Gestion Commerciale et Avis Clients

---

### 1. Objectif de l'Intégration CRM

Garantir que la gestion de l'e-réputation ne soit pas une tâche isolée, mais qu'elle s'articule naturellement avec le cycle de vie du client géré dans Firestore et le CRM de l'agence.

---

### 2. Le Cycle Commercial à 4 Temps

```text
TEMPS 1 : ACQUISITION
Le client découvre SLAAC Voyages via Google Maps ou le site web.
Il soumet un devis (enregistré dans la collection Firestore `quotes`).
Le système Outbox envoie immédiatement les notifications agence + accusé client.

TEMPS 2 : NÉGOCIATION & VENTE
Le commercial contacte le client par téléphone ou WhatsApp.
Le statut CRM passe de `NOUVEAU` à `EN_COURS`, puis `TRAITÉ / CONFIRMÉ`.
Le voyage ou le billet est émis.

TEMPS 3 : RÉALISATION DU SÉJOUR
Le client effectue son déplacement, son pèlerinage Omra ou son excursion.
Assistance disponible via le numéro d'urgence de l'agence.

TEMPS 4 : CLÔTURE & INVITATION ÉTHIQUE À DONNER UN AVIS
Le commercial passe le statut du dossier à `TERMINÉ` dans le tableau de bord CRM.
Une action recommandée s'affiche sur la fiche contact : « Proposer un dépôt d'avis Google ».
Le commercial envoie le message de remerciement neutre intégrant le lien GBP officiel.
```

---

### 3. Garde-Fous Techniques et Déontologiques

1. **Aucun envoi automatisé sans revue humaine :**
   - Si un voyage a subi un retard de vol majeur indépendant de l'agence ou une annulation de compagnie, le commercial doit d'abord s'assurer que le service après-vente a pleinement traité l'incident avant toute démarche de satisfaction.
2. **Protection des Données Personnelles :**
   - Aucune donnée client n'est transmise à une plateforme d'avis tierce sans son consentement explicite.
   - Les avis publiés sur Google sont rattachés au profil Google personnel du voyageur, sous son entière responsabilité.
3. **Non-régression des notifications du Prompt 01 :**
   - Les alertes emails vers `contact@slaacvoyages.com` et `mdslaacvoyages@gmail.com` continuent d'être traitées par le moteur Outbox avec idempotence et backoff exponentiel.
