# Rapport d'Audit 12/06 : Sécurité des Secrets et Variables d'Environnement
**Projet :** SLAAC Voyages  
**Branche :** release/v1.0.0-candidate  
**Date d'audit :** 18 Octobre 2026

---

## 1. Inventaire et Ségrégation des Variables d'Environnement

L'architecture du projet distingue rigoureusement les variables publiques (exposées au client via le préfixe ) des secrets de production (strictement confinés à l'exécution serveur).

### 1.1. Secrets Serveur Critiques
| Nom de la Variable | Usage | Présence Client | Statut Sécurité |
| :--- | :--- | :---: | :---: |
|  | Authentification SDK Admin | NON | Strictement privé |
| | Service Account GCP | NON | Strictement privé |
|  / | Authentification SMTP LWS | NON | Strictement privé |
|  | Envoi d'emails transactionnels | NON | Strictement privé |
|  | Signature d'upload de documents | NON | Strictement privé |
|  | Événements serveur Meta CAPI | NON | Strictement privé |
|  | Chiffrement des cookies de session | NON | Strictement privé |

### 1.2. Variables Publiques Client
- ,  : Clés publiques client requises pour Firebase Web SDK, sécurisées par les règles .
- ,  : Identifiants de mesure marketing sans privilège administratif.

---

## 2. Audit Git & Historique des Fuites Potentielles

- **Fichier  :** Vérifié. Les motifs , , , ,  sont présents et actifs.
- **Examen de l'incident historique LWS :** L'historique Git et les fichiers de configuration ont été scannés. Aucune clé API LWS ou mot de passe SMTP n'est présent en clair dans les commits de la branche candidate.
- **Correction SEC-01 appliquée :** La chaîne de secours contenant un email personnel dans  a été éliminée au profit de la variable .

---

## 3. Plan de Déploiement et Rotation des Secrets

1. **Variables Vercel :** Configurer séparément les environnements  et .
2. **Rotation programmée :** Prévoir une rotation trimestrielle des clés SMTP et tokens d'API.
3. **Conformité :** Conforme aux directives de sécurité DevOps.
