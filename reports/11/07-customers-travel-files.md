# Rapport 07 : Base Clients et Dossiers de Voyage
## SLAAC Voyages | Prompt 11/12

### 1. Modèle Métier de l'Agence
Le système articule deux entités centrales au cœur de l'activité touristique de SLAAC Voyages :
1. **La Fiche Client (`clients`)** : Identité pérenne du voyageur ou de l'entreprise cliente, regroupant son profil, ses préférences, ses personnes à contacter en cas d'urgence et l'ensemble de son historique de voyages.
2. **Le Dossier de Voyage (`travel_files`)** : Conteneur opérationnel unique pour chaque projet de voyage concrétisé, regroupant les réservations de vols, hôtels, transferts, visas, assurances, et paiements associés.

### 2. Référencement Unique et Traçabilité
Chaque dossier dispose d'un identifiant lisible et unique généré selon la nomenclature :
$$\text{DV-DOS-YYYYMMDD-XXXX}$$
*(ex: `DV-DOS-20261018-8F2A`)* garantissant un repérage immédiat lors des échanges avec les compagnies aériennes, les prestataires hôteliers et le client.

### 3. Cycle de Vie Opérationnel en 7 Étapes
Le cycle de vie du dossier de voyage est orchestré par l'automate suivant :
1. `devis_en_cours` : Étude tarifaire, élaboration du devis et recherche de disponibilités.
2. `attente_paiement` : Devis accepté, attente du règlement de l'acompte ou du solde.
3. `confirme` : Paiement validé en caisse ou par virement, confirmation officielle auprès du client.
4. `en_cours_traitement` : Émission effective des billets d'avion (GDS/Amadeus), confirmation hôtelière et dépôts de dossiers de visa.
5. `pret_au_depart` : Pochette de voyage complète prête, vouchers édités, briefing départ transmis au client.
6. `en_voyage` : Le voyageur est en déplacement ou sur place (suivi conciergerie 24/7).
7. `termine` : Retour du client, débriefing qualité et archivage comptable du dossier.
*(État terminal alternatif : `annule` avec justification obligatoire).*

### 4. Attribution et Sécurité
- Chaque dossier est sous la responsabilité d'un agent assigné (`assignedTo`), supervisé par le responsable commercial (`dossiers.manage`, `dossiers.validate`).
- Aucun changement d'état vers `confirme` ne peut être opéré sans traçabilité du justificatif de paiement, empêchant toute émission fictive de prestations.
