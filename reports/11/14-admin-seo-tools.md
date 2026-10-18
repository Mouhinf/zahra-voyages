# Rapport 14 : Outils SEO dans l'Administration
## SLAAC Voyages | Prompt 11/12

### 1. Objectifs de Domination Organique
Conserver l'autorité thématique acquise lors des Prompts 07 et 08 en permettant à l'équipe marketing de piloter les critères techniques et sémantiques essentiels directement depuis le back-office.

### 2. Outils de Pilotage Déployés
- **Éditeur de Métadonnées SEO** : Saisie et contrôle en temps réel de la balise `Title` (limite recommandée : 50-60 caractères) et de la `Meta Description` (limite : 150-160 caractères) avec prévisualisation immédiate du rendu dans les résultats Google (SERP Preview desktop et mobile).
- **Gestion des Slugs et URLs Canoniques** : Contrôle de l'URL propre avec détection automatique des caractères accentués ou spéciaux, et vérification de la cohérence de l'URL canonique (`canonicalUrl`).
- **Prévisualisation Open Graph / Twitter Cards** : Vérification visuelle du rendu lors du partage sur WhatsApp, Facebook et LinkedIn.
- **Indexation et Directives Robots** : Bascule facile des balises `robots` (`index, follow` vs `noindex, nofollow` pour les pages temporaires ou les formulaires internes).

### 3. Protection RBAC
La modification des paramètres SEO du site est soumise à la permission `seo.manage`. Les modifications non contrôlées de slugs (pouvant entraîner des erreurs 404 destructrices pour le trafic) sont encadrées par des avertissements explicites et imposent la mise en place d'une redirection 301 automatique.
