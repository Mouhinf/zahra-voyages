# Synthèse de Préparation à la Production (Production Readiness)
## SLAAC Voyages | Délimitation des Périmètres Exécutés et à Valider

---

### 1. Distinction Cruciale des Périmètres d'Intervention

Conformément aux instructions et aux règles de sécurité de SLAAC Voyages, les actions sont rigoureusement distinguées entre :
1. **Les actions exécutées dans le code (Branche `feat/slaac-local-seo`) :** Validées, testées et prêtes à être fusionnées.
2. **Les actions externes préparées nécessitant l'autorisation et l'action du dirigeant :** Fiche Google Business Profile, comptes tiers et annuaires externes.

---

### 2. État d'Avancement par Composant

| Domaine | Action Réalisée | Statut Technique | Action Requise par le Dirigeant |
|---|---|---|---|
| **Code Source** | Centralisation du NAP dans `src/lib/site.ts` | **TERMINÉ** | Aucune (Code prêt) |
| **Page Contact** | Ajout click-to-call, horaires, bouton itinéraire | **TERMINÉ** | Aucune (Code prêt) |
| **Section Accueil** | Encart contact enrichi avec itinéraire Maps | **TERMINÉ** | Aucune (Code prêt) |
| **Pied de Page** | Adresse rendue interactive vers Google Maps | **TERMINÉ** | Aucune (Code prêt) |
| **Données Structurées** | `TravelAgency` avec GPS exact, `hasMap`, `contactPoint` | **TERMINÉ** | Aucune (Code prêt) |
| **Fiche Google Business** | Audit, description, catégories et services rédigés | **PRÉPARÉ** | Se connecter à Google Business Profile et appliquer les textes |
| **Localisation Maps** | Coordonnées GPS calculées et itinéraire testé | **PRÉPARÉ** | Repositionner le pin de la fiche sur l'immeuble Djolof Chicken |
| **Photographies Réelles** | Cahier des charges et spécifications établis | **PRÉPARÉ** | Réaliser le shooting photo de l'agence (façade, accueil) |
| **Avis Clients** | Stratégie éthique et modèles de messages rédigés | **PRÉPARÉ** | Imprimer le chevalet QR code et former les conseillers |
| **Annuaires Externes** | Audit des anciennes adresses (Go Africa, Petit Futé) | **PRÉPARÉ** | Transmettre les demandes de mise à jour aux plateformes |

---

### 3. Matrice de Risques & Procédures de Contrôle

| Risque Potentiel | Probabilité | Impact | Mesure Préventive Prise |
|---|---|---|---|
| **Création d'un doublon de fiche Google** | Faible | Élevé | Consigne formelle de modifier la fiche existante plutôt que d'en créer une nouvelle |
| **Suspension pour keyword stuffing** | Nulle | Critique | Nom d'établissement strictement limité à `SLAAC Voyages` |
| **Échec de soumission formulaire contact** | Nulle | Critique | Formulaire testé avec succès via API réelle `/api/contact` |
| **Confusion des visiteurs sur l'immeuble** | Faible | Modéré | Mention explicite du repère « 3e étage au-dessus du Djolof Chicken » et bouton itinéraire |

---

### 4. Conclusion & Recommandation Finale

La plateforme web SLAAC Voyages dispose désormais d'un socle technique local irréprochable. Dès validation par le dirigeant, l'application des paramétrages préparés permettra d'aligner l'ensemble de l'écosystème digital sur la véritable adresse de Dakar Plateau.
