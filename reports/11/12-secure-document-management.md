# Rapport 12 : Gestion Documentaire Sécurisée et Protection des Données Voyageurs
## SLAAC Voyages | Prompt 11/12

### 1. Typologie des Documents et Sensibilité
Une agence de voyages manipule des documents hautement confidentiels relevant de la vie privée des clients :
- Copies de passeports et cartes nationales d'identité (CNI).
- Photos d'identité pour visas.
- Justificatifs de ressources financières pour dépôts consulaires.
- Billets d'avion électroniques et vouchers de transfert/hôtel.
- Reçus et factures acquittées.

### 2. Architecture de Stockage et Isolation
- **Séparation stricte** : Les médias publics (images de destinations, bannières d'offres) sont stockés sur Cloudinary en distribution CDN publique. En revanche, les documents privés des voyageurs sont isolés dans un bucket Cloud Storage sécurisé à accès privé strict.
- **URLs Signées Temporaires** : Aucun document confidentiel n'est accessible via une URL statique publique. La visualisation ou le téléchargement d'une pièce d'identité génère une URL signée à validité éphémère (durée maximale : 15 minutes), délivrée uniquement après authentification de l'agent.

### 3. Contrôle d'Accès Granulaire (RBAC)
- Permission `documents.view` : Consultation des billets électroniques, programmes de voyage et vouchers généraux.
- Permission `documents.view_private` : Réservée aux administrateurs et au responsable visa pour consulter les passeports et justificatifs consulaires sensibles.
- Traçabilité : Chaque consultation d'une pièce d'identité génère une entrée d'audit spécifiant l'identité de l'agent et l'heure d'accès.
