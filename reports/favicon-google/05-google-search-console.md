# Phase I : Guide d'Action Google Search Console & Délais de Propagation
**Projet :** SLAAC Voyages (https://slaacvoyages.com)  
**Date d'audit :** 19 octobre 2026  

---

## 1. Objectif de l'Action Search Console

La mise en ligne des nouveaux favicons conformes (multiples de 48px) et du schéma `WebSite` est effective sur le serveur. Pour que Google remplace le logo LWS par le logo SLAAC dans les résultats de recherche (`site:slaacvoyages.com`), le robot `Google-Favicon` doit être notifié de la modification de la page d'accueil.

Conformément à la documentation officielle [Google Search Central - Favicons in Search](https://developers.google.com/search/docs/appearance/favicon-in-search) :
> *« Googlebot-Image explore votre favicon chaque fois qu'il explore votre page d'accueil. Si vous modifiez votre favicon et souhaitez informer Google de ces modifications, vous pouvez demander l'indexation de la page d'accueil de votre site. »*

---

## 2. Procédure Pas à Pas (À réaliser manuellement)

Connectez-vous à la console : **[Google Search Console](https://search.google.com/search-console)**

### Étape 1 : Sélectionner la propriété
Sélectionnez la propriété associée à **`slaacvoyages.com`** (Propriété Domaine ou Préfixe d'URL `https://slaacvoyages.com`).

### Étape 2 : Valider la propriété si nécessaire
La balise meta HTML de validation est d'ores et déjà injectée et active dans le `<head>` de votre site en production :
```html
<meta name="google-site-verification" content="6ElmrLDCGkGe-Qrf27HeUxzhemAtFSQh6oGKl4nBusM"/>
```
Si la validation DNS TXT a précédemment échoué sur LWS, choisissez la méthode alternative **« Balise HTML »** dans la Search Console : elle sera validée instantanément.

### Étape 3 : Inspecter la page d'accueil
1. Dans la grande barre de recherche située tout en haut de la Search Console (« Inspecter n'importe quelle URL... »), saisissez l'URL exacte :
   ```text
   https://slaacvoyages.com/
   ```
2. Appuyez sur **Entrée**.

### Étape 4 : Lancer le test en direct
1. Cliquez sur le bouton **« Tester l'URL en direct »** (en haut à droite).
2. Patientez 1 à 2 minutes pendant que Googlebot interroge la page d'accueil en direct.
3. Vérifiez que la page répond bien `200` et que les ressources d'icônes sont accessibles.

### Étape 5 : Demander une nouvelle indexation
1. Cliquez sur le lien **« Demander une indexation »**.
2. Un message de confirmation s'affiche : *« Indexation demandée »*.

---

## 3. Délais de Propagation Réels (Avertissement Déontologique)

> [!WARNING]
> **Aucune agence ni aucun outil ne peut forcer Google à modifier son affichage instantanément.**

* **Pourquoi le délai ?** Le robot standard de Google indexe le texte rapidement, mais le sous-système de distribution des vignettes graphiques (`Google-Favicon` & image cache SERP) est découplé pour des raisons d'optimisation de bande passante mondiale.
* **Délai moyen constaté :** Entre **24 heures et 72 heures**, pouvant aller jusqu'à quelques jours selon la fréquence de passage du robot sur le domaine.
* **Bonne pratique :** Ne pas soumettre de demandes répétées chaque heure ; une seule soumission suffit et évite d'être rétrogradé dans la file de traitement de Googlebot.

---

## 4. Vérification Locale Côté Utilisateur

Le cache du navigateur (Google Chrome, Safari) conserve agressivement les favicons :
1. Ouvrez une **fenêtre de navigation privée**.
2. Tapez `https://slaacvoyages.com` pour constater l'icône dans l'onglet du navigateur.
3. Pour la recherche Google `site:slaacvoyages.com`, utilisez également un onglet privé pour ne pas subir les fichiers temporaires locaux.

**Statut : EN ATTENTE DE NOUVELLE EXPLORATION GOOGLE**
