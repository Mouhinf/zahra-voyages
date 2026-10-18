# Rapport 16 : Rapports Métiers et Exportations Sécurisées
## SLAAC Voyages | Prompt 11/12

### 1. Enjeux de Sécurité et de Conformité
L'exportation brute de bases de données clients ou de registres comptables représente un risque majeur de fuite de données d'entreprise s'il n'est pas strictement encadré par des barrières de sécurité et d'audit.

### 2. Rapports Disponibles
Le système génère des rapports standardisés :
1. **Rapport Commercial Mensuel** : Volume de prospects reçus, taux de transformation, nombre de devis émis, volume de vente en FCFA par conseiller.
2. **Rapport Opérationnel des Départs** : Calendrier des départs imminents pour l'assistance aéroport et le suivi chauffeur AIBD.
3. **Rapport Financier & Facturation** : Récapitulatif des devis acceptés, acomptes perçus et soldes en attente pour la comptabilité.
4. **Rapport d'Efficacité Marketing** : Synthèse des performances par source et campagne.

### 3. Contrôle Strict des Exportations
- **Permission Dédiée (`reports.export`)** : Seuls les rôles `SUPER_ADMIN`, `ADMIN` et `RESPONSABLE_COMMERCIAL` sont autorisés à déclencher un export de données (fichiers CSV ou Excel).
- **Assainissement des Données (Data Masking)** : Les exports standards masquent les numéros de passeport complets et les données hautement sensibles.
- **Journalisation de l'Export** : Chaque action d'exportation enregistre immédiatement dans `admin_audit_logs` l'identité du demandeur, l'adresse IP, le volume d'enregistrements exportés et le filtre appliqué.
