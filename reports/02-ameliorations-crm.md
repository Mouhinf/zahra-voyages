# RAPPORT 02/12 — PHASES G & H : AMÉLIORATIONS DU CRM ET GESTION DES PROSPECTS

## 1. Objectifs & Constats d'audit

- **Constats initiaux** :
  - Le CRM permettait de modifier le statut (`crmStatus`), d'assigner un responsable et d'ajouter des notes.
  - Cependant, il manquait :
    1. La priorisation commerciale des leads (`priorite`: basse, normale, haute, urgente), cruciale pour traiter immédiatement les demandes VIP, les groupes ou les départs urgents.
    2. La programmation d'une date de relance commerciale (`nextFollowUpAt`) avec alertes visuelles sur les relances échues ou à venir.
    3. L'affichage et le filtrage par priorité dans la liste des demandes (`requests-manager.tsx`).
    4. La visibilité de la traçabilité marketing (paramètres UTM et référents) pour mesurer le retour sur investissement des canaux d'acquisition.

## 2. Nouveaux champs et fonctionnalités CRM

### A. Priorisation Commerciale (`priorite`)
- **Valeurs normalisées** :
  - `urgente` : Badge rose contrasté gras (`bg-rose-100 text-rose-800 border-rose-300 font-bold`).
  - `haute` : Badge ambre vif (`bg-amber-100 text-amber-800 border-amber-300 font-semibold`).
  - `normale` : Badge ardoise neutre (`bg-slate-100 text-slate-700 border-slate-200`) (valeur par défaut).
  - `basse` : Badge discret (`bg-gray-100 text-gray-600 border-gray-200`).
- **Historisation automatique** :
  Toute modification de priorité consignée dans le sous-journal d'audit horodaté avec l'identité de l'agent (`actor`).
- **Filtrage en temps réel** :
  Ajout d'un filtre dédié dans la barre de recherche des devis et messages de contact.

### B. Gestion des relances commerciales (`nextFollowUpAt`)
- Champ date intégré dans la fiche détaillée (`lead-detail.tsx`).
- Badge d'alerte dynamique (`FollowUpBadge`) :
  - Bleu doux si la date de relance est dans le futur.
  - Rouge d'alerte (`Relance en retard : AAAA-MM-JJ`) si la date prévue est dépassée et que le dossier n'est ni confirmé ni perdu.
- Trace horodatée dans l'historique lors de chaque programmation ou suppression de relance.

### C. Visualisation de l'Attribution Marketing
- Si un prospect est issu d'une campagne sponsorisée ou d'un réseau social, un encart dédié s'affiche sur sa fiche :
  - Source (`utm_source` : ex. `facebook`, `google`, `instagram`)
  - Medium (`utm_medium` : ex. `cpc`, `stories`, `bio`)
  - Campagne (`utm_campaign` : ex. `omra-2026`, `ete-dakar`)
  - Référent web (`referrer`)
  - Page d'entrée (`landingPage`)

### D. Sécurité & Intégrité des données
- Les modifications de priorité et de relance transitent exclusivement par la route sécurisée `PATCH /api/admin/leads`, protégée par `verifyAdminToken`.
- Aucune donnée historique n'a été altérée ou migrée : les enregistrements plus anciens bénéficient de valeurs par défaut saines (`normale` et date vide).
