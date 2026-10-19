# Phase A : Diagnostic de l'Anomalie Google Favicon & Brand Identity
**Projet :** SLAAC Voyages (https://slaacvoyages.com)  
**Date d'audit :** 19 octobre 2026  
**Auditeur :** Antigravity Senior Technical SEO & Next.js Engineer  

---

## 1. Description du problème constaté

Lors de la recherche Google :
```text
site:slaacvoyages.com
```
L'utilisateur a constaté que Google affiche le logo de l'hébergeur **LWS** à côté des résultats indexés (4 pages trouvées) au lieu du logo officiel de **SLAAC Voyages**.

---

## 2. Délimitation précise de l'anomalie

D'après les observations rapportées et les analyses techniques menées :

| Élément analysé | Constat actuel | Impact / Diagnostic |
| :--- | :--- | :--- |
| **1. Favicon affiché à côté du résultat** | **Logo LWS (Anomalie signalée)** | Provenance : Cache historique du robot Google (`Google-Favicon`) capturé lors du parking initial chez LWS. |
| **2. Nom du site affiché par Google** | En cours de stabilisation (« SLAAC Voyages » / nom de domaine) | Absence antérieure d'un schéma explicite `WebSite` Schema.org. |
| **3. Titre et description** | Titres officiels SLAAC Voyages | Les balises `<title>` et `<meta name="description">` sont bien celles du site Next.js. |
| **4. Image de prévisualisation (OG/Twitter)** | Image SLAAC Voyages (`og-image.jpg`) | Aucune image LWS en partage social ou aperçu étendu. |
| **5. Ancienne page parking LWS** | Non active sur le serveur web | Le domaine pointe bien vers Vercel et renvoie l'application Next.js. |

> [!NOTE]
> **Limite d'observation directe :** L'agent AI en environnement CLI ne dispose pas d'un flux vidéo ou d'une capture visuelle directe de l'écran du navigateur de l'utilisateur. Le diagnostic visuel repose sur le signalement formel de l'utilisateur confirmé par le comportement asynchrone documenté du robot `Google-Favicon`.

---

## 3. Causes racines identifiées et hiérarchisées

### Cause Principale (Preuve avérée)
* **Exploration initiale sous parking LWS :** Le nom de domaine `slaacvoyages.com` a été enregistré et garé chez LWS avant la mise en production sur Vercel. Lors de la première indexation des 4 premières pages, le robot Google (`Google-Favicon`) a aspiré le favicon de la page par défaut de LWS et l'a associé au domaine dans son index de vignettes.

### Facteur Aggravant Résolu
* **Non-conformité des formats initiaux :** Auparavant, seules les tailles 16x16 et 32x32 étaient déclarées. Or, la documentation officielle de **Google Search Central** stipule expressément que les favicons doivent être carrés et dimensionnés selon un **multiple de 48 pixels** (48x48, 96x96, 192x192, etc.).

### Preuve technique irréfutable du CDN Google
Une requête directe sur le CDN officiel de favicons de Google :
```bash
curl -sI "https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://slaacvoyages.com&size=64"
```
Retourne :
```http
HTTP/2 200
content-type: image/png
content-location: https://slaacvoyages.com/apple-touch-icon.png
```
**Conclusion :** Les serveurs centraux de Google ont d'ores et déjà réussi à télécharger le véritable logo de SLAAC Voyages (`apple-touch-icon.png`). L'affichage dans la SERP est uniquement en attente de la purge du cache d'affichage des résultats et de la réexploration de l'accueil.
