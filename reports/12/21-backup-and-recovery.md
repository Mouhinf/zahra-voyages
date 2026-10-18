# Rapport d'Audit 12/21 : Stratégie de Sauvegarde, Restauration et Plan de Rollback
**Projet :** SLAAC Voyages  
**Branche :** release/v1.0.0-candidate  
**Date d'audit :** 18 Octobre 2026

---

## 1. Stratégie de Sauvegarde des Composants Critiques

| Composant | Mécanisme de Sauvegarde | Fréquence | Rétention | Emplacement de Sauvegarde |
| :--- | :--- | :---: | :---: | :--- |
| **Code Source & Configuration** | Git Tags immuables sur GitHub | À chaque release | Illimitée | Dépôt distant GitHub |
| **Base Firestore (Collections CRM)** | Export automatisé GCP Cloud Storage | Quotidienne | 30 jours | Bucket sécurisé `gs://slaac-firestore-backups/` |
| **Fichiers Clients & Vouchers** | Versioning Cloudinary + réplication | Continue | Illimitée | Stockage multi-zone Cloudinary |
| **Variables d'Environnement** | Export chiffré des secrets Vercel | À chaque changement | Historique Vercel | Coffre-fort numérique administrateur |

---

## 2. Objectifs de Reprise d'Activité

- **RPO (Recovery Point Objective) :** < 1 heure (perte de données maximale tolérée).
- **RTO (Recovery Time Objective) :** < 15 minutes (temps maximal pour rétablir le service en cas de panne majeure).

---

## 3. Procédure de Rollback Immédiat (Retour Arrière)

Si une anomalie critique (P0) survenait après un déploiement :
1. **Rollback Vercel Instantané :** Via l'interface Vercel ou la CLI (`vercel rollback`), restaurer le déploiement de production précédent en **1 clic (< 30 secondes)** sans recompilation.
2. **Intégrité Base de Données :** Aucune modification de schéma destructrice n'ayant été appliquée, la version antérieure reste 100% compatible avec les collections Firestore actuelles.
3. **Notification de l'Équipe :** Alerte immédiate des équipes techniques et commerciales.
