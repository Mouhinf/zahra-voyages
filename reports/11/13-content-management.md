# Rapport 13 : Gestion Complète des Contenus du Site (CMS)
## SLAAC Voyages | Prompt 11/12

### 1. Objectifs Éditoriaux
Permettre à l'équipe de communication et aux rédacteurs d'enrichir le site web de SLAAC Voyages sans intervention technique, tout en garantissant la qualité de présentation, la rigueur de validation et la cohérence multilingue (Français / Anglais).

### 2. Modules Éditoriaux Administrables
Le CMS intégré couvre :
- **Offres et Packages Touristiques (`/admin/packages`)** : Titre, description, itinéraire étape par étape, prestations incluses/exclues, tarifs en FCFA, dates de départ et photographies d'illustration.
- **Destinations Phares (`/admin/destinations`)** : Fiches complètes pour la Chine, la Thaïlande, Dubaï, le Qatar, l'Arabie Saoudite (Omra), la France, etc., avec conseils pratiques et formalités.
- **Articles de Blog et Guides Pratiques (`/admin/posts`)** : Guides de voyage, recommandations visa, préparation du départ depuis Dakar AIBD.

### 3. Workflow de Publication Sécurisé
Pour prévenir la publication accidentelle de tarifs non vérifiés ou de contenus inachevés :
- Un rédacteur disposant du rôle `EDITEUR_CONTENU` peut rédiger, sauvegarder et mettre en forme des brouillons (`content.manage`).
- Seuls les profils dotés de la permission `content.publish` (`SUPER_ADMIN`, `ADMIN`) peuvent basculer un contenu de l'état `Brouillon` à l'état `Publié`.
- Le passage en publication déclenche l'invalidation automatique du cache ISR de Next.js (`revalidatePath`).
