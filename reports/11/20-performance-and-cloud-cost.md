# Rapport 20 : Performance Web et Optimisation des Coûts Cloud
## SLAAC Voyages | Prompt 11/12

### 1. Analyse des Coûts et Facturation Firestore
Dans Firebase Firestore, le coût d'exploitation est directement indexé sur le nombre d'opérations de lecture (`document reads`), d'écriture (`document writes`) et le volume de stockage. Une conception applicative naïve (requêtes sans filtre, polling continu côté client) peut rapidement entraîner une hausse injustifiée des coûts cloud.

### 2. Optimisations Appliquées
1. **Limitation Systématique des Requêtes (`limit`)** :
   - Toutes les listes de l'administration (`listTravelFiles`, `listTasks`, `listProposals`, `listAuditLogs`) imposent une taille de page stricte (par défaut 20 à 50 éléments).
   - Utilisation de la pagination par curseur (`startAfter`) pour éviter de scanner l'ensemble des documents historiques.
2. **Élimination des Scans Complets de Tables** :
   - Indexation composite sur les critères de filtrage fréquents (`status`, `assignedTo`, `dueDate`, `createdAt`).
   - Aucune requête client ne balaie une collection entière sans condition d'égalité sur des index sélectifs.
3. **Mise en Cache Côté Serveur** :
   - Exploitation du cache d'ISR Next.js pour les catalogues publics et les contenus éditoriaux (`packages`, `destinations`, `posts`).
   - Les modifications dans l'administration n'invalident que les routes concernées via `revalidatePath()`.
4. **Compression des Payloads** :
   - Projection des seuls champs nécessaires lors des requêtes d'affichage en liste.
   - Suppression des métadonnées volumineuses dans les réponses JSON de listing.

### 3. Métriques de Performance Cibles
- Temps de réponse moyen des API administratives : $< 250\text{ ms}$.
- Temps de chargement initial du tableau de bord exécutif : $< 1.2\text{ s}$ sur connexion 4G standard.
- Consommation mensuelle estimée Firestore : Moins de 5% du quota gratuit Firebase pour un volume de 2 000 dossiers annuels.
