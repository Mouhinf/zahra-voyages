# Machines à États et Workflows Opérationnels SLAAC Voyages
## Prompt 11/12 — Architecture des Transitions d'États

Ce document spécifie les automates à états finis (FSM) pour l'ensemble des entités métier gérées dans l'administration de SLAAC Voyages : **Dossiers de Voyage**, **Propositions Commerciales (Devis)**, et **Tâches Collaborateurs**.

---

### 1. Machine à États : Dossiers de Voyage (`travel_files`)

Le cycle de vie d'un dossier de voyage reflète rigoureusement le traitement opérationnel d'une commande client, depuis la demande initiale jusqu'au retour de voyage et à la clôture du dossier.

```mermaid
stateDiagram-v2
    [*] --> devis_en_cours : Création du dossier (Manuel ou Lead qualifié)
    devis_en_cours --> attente_paiement : Proposition envoyée & acceptée par le client
    devis_en_cours --> annule : Abandon ou refus client
    
    attente_paiement --> confirme : Acompte ou paiement intégral reçu
    attente_paiement --> annule : Délai de paiement expiré / Annulation
    
    confirme --> en_cours_traitement : Émission des billets / Réservations hôtels / Demandes de visa
    
    en_cours_traitement --> pret_au_depart : Documents complets émis & solde réglé à 100%
    
    pret_au_depart --> en_voyage : Date de départ atteinte (Client en transit ou à destination)
    
    en_voyage --> termine : Date de retour passée & enquête de satisfaction transmise
    
    en_cours_traitement --> annule : Force majeure ou annulation exceptionnelle
    pret_au_depart --> annule : Annulation client (avec retenue selon CGV)
```

#### Règles de Transition :
1. **`devis_en_cours` $\rightarrow$ `attente_paiement`** : Exige la présence d'au moins un devis lié avec un montant total validé.
2. **`attente_paiement` $\rightarrow$ `confirme`** : Nécessite l'enregistrement d'un justificatif financier (acompte minimum ou règlement total).
3. **`en_cours_traitement` $\rightarrow$ `pret_au_depart`** : Tous les vouchers indispensables (billetterie, réservation d'hébergement, visas) doivent être attachés au dossier.
4. **`en_voyage` $\rightarrow$ `termine`** : Clôture définitive du dossier avec archivage de l'historique et envoi du feedback client.

---

### 2. Machine à États : Devis & Propositions Commerciales (`proposals`)

```mermaid
stateDiagram-v2
    [*] --> BROUILLON : Saisie par le commercial
    BROUILLON --> EN_ATTENTE_VALIDATION : Soumission (si montant > seuil ou remise > 10%)
    BROUILLON --> ENVOYE : Validation directe (si commercial habilité)
    EN_ATTENTE_VALIDATION --> ENVOYE : Approbation Responsable Commercial / Admin
    EN_ATTENTE_VALIDATION --> REJETE : Rejet par le superviseur pour révision
    REJETE --> BROUILLON : Correction par le commercial
    
    ENVOYE --> ACCEPTE : Signature / Accord client formel
    ENVOYE --> REFUSE : Refus explicite client
    ENVOYE --> EXPIRE : Date de validité dépassée (par défaut 15 jours)
    
    ACCEPTE --> [*] : Génération automatique du dossier de voyage
    REFUSE --> [*]
    EXPIRE --> [*]
```

#### Invariants Financiers :
- **Calcul en FCFA** : Tout calcul financier repose sur des entiers stricts (pas d'arrondis centimes erronés).
- **Formule stricte** : $\text{Total TTC} = (\text{Total HT} - \text{Remise}) + \text{Total Taxes}$.
- **Immuabilité** : Dès qu'une proposition passe au statut `ENVOYE` ou `ACCEPTE`, son contenu chiffré devient strictement immuable (lecture seule). Toute modification impose la création d'un avenant ou d'une nouvelle version (V2).

---

### 3. Machine à États : Tâches d'Équipe & Relances (`team_tasks`)

```mermaid
stateDiagram-v2
    [*] --> a_faire : Création de la tâche assignée
    a_faire --> en_cours : Prise en charge par le collaborateur
    en_cours --> terminee : Objectif accompli
    a_faire --> terminee : Résolution directe rapide
    en_cours --> en_attente : Dépendance externe (retour compagnie, attente visa)
    en_attente --> en_cours : Déblocage de la dépendance
    
    a_faire --> annulee : Tâche devenue obsolète
    en_cours --> annulee : Annulation justifiée
    en_attente --> annulee : Abandon de la demande
    
    terminee --> [*]
    annulee --> [*]
```

#### Traçabilité & Alertes :
- **Échéance dépassée** : Si la date du jour est strictement supérieure à `dueDate` et que le statut est différent de `terminee` ou `annulee`, la tâche passe automatiquement en drapeau rouge visuel (**En retard**).
- **Audit des changements** : Tout changement de statut ou de collaborateur assigné déclenche un enregistrement dans le journal d'audit immuable (`admin_audit_logs`).
