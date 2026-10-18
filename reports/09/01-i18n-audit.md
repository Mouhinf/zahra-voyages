# Audit Initial de l'Internationalisation et Opportunités Internationales
## SLAAC Voyages | Dakar, Sénégal — Prompt 09/12

### 1. Contexte et Diagnostic Préalable
Avant l'intervention du Prompt 09/12, SLAAC Voyages opérait comme une plateforme à dominante francophone avec une route anglaise expérimentale limitée (`/en`), sans correspondance contextuelle pour les pages internes :
- **Perte de contexte linguistique** : cliquer sur un lien en anglais ou changer de langue ramenait souvent l'utilisateur à la racine ou affichait des pages introuvables.
- **Rendu SSR HTML incomplet** : la balise `<html lang="fr">` était statique sur tout le site, pénalisant l'indexation de contenu anglais par Googlebot International.
- **Formulaires unilingues** : le modal de devis et la page contact présentaient des libellés et des messages en français uniquement, dissuadant les visiteurs non francophones.
- **Absence de traçabilité CRM** : les demandes de devis et de contact ne mémorisaient pas la langue du prospect (`locale`), entraînant l'envoi d'emails transactionnels en français même pour des demandes en anglais.
- **Potentiel Dakar 2026 sous-exploité** : les Jeux Olympiques de la Jeunesse Dakar 2026 draineront des milliers d'athlètes, délégations, familles et spectateurs anglophones nécessitant des services de transport AIBD, hébergement et excursions clairs et juridiquement sécurisés.

### 2. Marchés Cibles Internationaux
1. **Délégations sportives et spectateurs Dakar 2026** : USA, Canada, Royaume-Uni, Afrique anglophone (Nigeria, Ghana, Kenya, Afrique du Sud), Asie et Moyen-Orient.
2. **Tourisme réceptif anglophone** : Voyageurs découvrant le Sénégal (Gorée, Lac Rose, Bandia, Sine-Saloum) recherchant un DMC local agréé et sécurisé.
3. **Voyages d'affaires & MICE** : Entreprises multinationales, ONG et institutions organisant des séminaires à Dakar et Diamniadio avec exigences de facturation TVA sénégalaise.
4. **Diaspora anglophone et bilingue** : Familles et professionnels préparant leur retour ou séjour temporaire au pays.

### 3. Matrice des Écarts Identifiés et Plan d'Action
| Domaine | Situation Avant Prompt 09 | Objectif Prompt 09 | Statut |
| :--- | :--- | :--- | :--- |
| **SSR HTML lang** | `<html lang="fr">` invariable | Dynamic SSR `<html lang={locale}>` via header `x-slaac-locale` | Résolu |
| **Routes candidates EN** | Seule `/en` (homepage) | 10 URLs candidates anglaises complètes et professionnelles | Résolu |
| **Formulaires** | Français uniquement | Modal devis et contact 100% bilingues avec labels EN | Résolu |
| **Emails transactionnels** | Français systématique | Accusés de réception devis et contact traduits en anglais | Résolu |
| **CRM Firestore** | Pas de champ `locale` | Persistance stricte de `locale: 'en' \| 'fr'` dans Firestore | Résolu |
| **Alerte agence** | Neutre | Alerte agence et direction indiquant la langue du client | Résolu |
| **Dakar 2026 Hub** | Page française sans EN | Hub international dédié avec calendrier et disclaimer légal | Résolu |
| **Sitemap & Hreflang** | Seule la racine bilingue | 10 routes avec `alternates.languages` réciproques | Résolu |
