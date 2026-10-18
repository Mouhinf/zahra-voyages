# Rapport 09 : Réservations et Prestations Opérationnelles
## SLAAC Voyages | Prompt 11/12

### 1. Typologie des Prestations Gérées
L'activité d'une agence de voyages internationale comme SLAAC Voyages englobe des typologies de prestations hétérogènes, chacune ayant ses propres contraintes de validation et de documentation :
1. **Billetterie Aérienne** : PNR GDS, numéro de billet électronique (e-ticket à 13 chiffres), compagnie émettrice, classe de réservation, franchise bagages.
2. **Hébergement & Hôtellerie** : Numéro de réservation confirmation hôtel, type de chambre, plan de repas (petit-déjeuner, demi-pension), politiques d'annulation et de check-in.
3. **Transferts & Transports (ex: AIBD Shuttle)** : Détails des vols d'arrivée/départ, type de véhicule (berline, van, SUV), coordonnées du chauffeur et point de prise en charge.
4. **Assistance Visa & Formalités** : Type de visa (affaires, tourisme, Omra), statut du dépôt consulaire, délai de traitement prévisionnel.
5. **Circuits & Excursions au Sénégal** : Guide assigné, itinéraire, équipements inclus.

### 2. Contrôles Anti-Erreurs et Intégrité des Réservations
Pour éviter toute confirmation erronée ou fictive :
- Aucun dossier ne peut être marqué comme confirmé sans la saisie effective des références de confirmation fournisseurs ou du reçu comptable de l'agence.
- Tout avenant ou annulation de prestation impose une confirmation du motif par le superviseur (`dossiers.validate`).
- Traçabilité des délais de validité des options tarifaires aériennes (Time Limit GDS) pour déclencher des alertes avant expiration du tarif négocié.
