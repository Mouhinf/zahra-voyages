# Rapport 15 : Marketing, Campagnes et Pilotage de l'Attribution
## SLAAC Voyages | Prompt 11/12

### 1. Objectifs de Croissance
Donner aux équipes de growth marketing et à la direction une visibilité chirurgicale sur l'origine des prospects et l'efficacité des canaux d'acquisition publicitaire (Google Ads, Meta Ads, TikTok Ads, Campagnes WhatsApp).

### 2. Données et Métadonnées Suivies
Le module marketing de l'administration exploite les données consolidées depuis l'infrastructure du Prompt 10 :
- **Paramètres UTM Standards** : `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`.
- **Identifiants de Clic Réseaux** : `gclid`, `gbraid`, `wbraid` (Google Ads), `fbclid` (Meta), `ttclid` (TikTok).
- **Page d'Entrée et Parcours** : Première landing page visitée, formulaire convertisseur, heure de conversion.

### 3. Fonctionnalités de Gestion des Campagnes
- **Tableau de Bord Campagnes (`/admin/campaigns`)** : Agrégation des volumes de conversion et des ratios de qualification par canal.
- **Analyse du Coût d'Acquisition (CAC)** : Comparaison entre investissement déclaré et valeur brute des devis acceptés générés par la campagne.
- **Générateur d'URLs Marquées** : Outil interne facilitant la création d'URLs propres avec UTMs standardisés pour les publications WhatsApp, réseaux sociaux et partenariats influenceurs au Sénégal.

### 4. Droits et Contrôles
L'accès aux données marketing requiert la permission `marketing.view`. La configuration des budgets ou le paramétrage des balises de tracking requiert la permission `marketing.manage`.
