# Rapport 08 : Devis Professionnels, Calculs Financiers et Workflow PDF
## SLAAC Voyages | Prompt 11/12

### 1. Enjeux et Exigences Commerciales
Le devis commercial constitue la vitrine d'expertise et le contrat d'engagement de SLAAC Voyages auprès de ses clients particuliers et corporate. Il se doit d'être irréprochable sur le plan des calculs financiers, des mentions légales et de la présentation graphique.

### 2. Architecture de Calcul Financier en FCFA (`src/lib/quotes-workflow.ts`)
Pour éliminer les erreurs courantes de conversion ou de virgule flottante :
- **Intégrité Monétaire FCFA** : Tous les calculs s'opèrent sur des montants entiers stricts en Francs CFA (XOF).
- **Formule de Calcul Exacte** :
  $$\text{Total HT} = \sum (\text{Quantité}_i \times \text{Prix Unitaire HT}_i)$$
  $$\text{Remise} = \text{Remise Forfaitaire} \lor (\text{Total HT} \times \text{Pourcentage Remise})$$
  $$\text{Base Après Remise} = \max(0, \text{Total HT} - \text{Remise})$$
  $$\text{Total Taxes} = \sum (\text{Taux Taxe}_j \times \text{Base Après Remise})$$
  $$\text{Total TTC} = \text{Base Après Remise} + \text{Total Taxes}$$
- La fonction pure `calculateProposalTotals()` garantit la cohérence mathématique absolue des montants enregistrés dans Firestore.

### 3. Référencement Séquentiel et Versionnage
Chaque proposition commerciale génère une référence unique :
$$\text{DV-PROP-YYYYMMDD-XXXX}$$
Toute modification ultérieure après validation ou envoi client nécessite la création d'une version révisée (ex: `DV-PROP-20261018-4B1C-V2`), assurant une traçabilité intégrale en cas de contestation contractuelle.

### 4. Template PDF / Export HTML Imprimable (`generateProposalHtml`)
Le générateur de document produit un code HTML5 sémantique optimisé pour l'impression haute définition (`@media print`) et l'exportation PDF :
- **En-tête Officiel** : Logo SLAAC Voyages, NINEA, Registre du Commerce, adresse à Dakar (Sacré-Cœur 3 / VDN), téléphone direct et email de contact.
- **Détail du Client** : Nom, coordonnées, contact entreprise.
- **Tableau Détaillé des Prestations** : Description limpide des vols, nuits d'hôtel, transferts et prestations annexes avec ventilation HT, taxes et TTC.
- **Conditions Générales de Vente (CGV) Résumées** : Durée de validité de l'offre (15 jours), conditions d'annulation, modalités d'acompte et coordonnées bancaires pour virement.
- **Bloc de Signature** : Espaces formels pour bon pour accord, signature et cachet d'entreprise.
