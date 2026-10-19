# Phase D, E, G & H : Audit Domaine, DNS LWS, Hébergement Vercel & Cache
**Projet :** SLAAC Voyages (https://slaacvoyages.com)  
**Date d'audit :** 19 octobre 2026  

---

## 1. Audit DNS LWS (Relevé en direct via dig)

| Type | Nom d'hôte | Valeur actuelle | Destination / Cible | Sécurité & Impact |
| :--- | :--- | :--- | :--- | :--- |
| **A** | `slaacvoyages.com` | `216.198.79.1` | **Vercel Edge Anycast** | Correct (Le trafic web pointe vers Next.js 15). |
| **AAAA** | `slaacvoyages.com` | *(aucun)* | — | Normal (Vercel IPv4). |
| **CNAME** | `www.slaacvoyages.com` | `3a041033f83871cc.vercel-dns-017.com.` | **Vercel DNS Router** | Correct (Redirection 308 propre vers l'apex). |
| **MX** | `slaacvoyages.com` | `10 mail.slaacvoyages.com.` | **Serveur Mail LWS** | **INTACT & PROTÉGÉ** (Messagerie pro 100 % opérationnelle). |
| **TXT** | `slaacvoyages.com` | `"v=spf1 mx:slaacvoyages.com a:mail.slaacvoyages.com a:mailphp.lws-hosting.com -all"` | **SPF LWS** | **INTACT & PROTÉGÉ** (Délivrabilité des emails). |

> [!IMPORTANT]
> **Aucune modification DNS n'a été effectuée ni requise.** Les enregistrements MX et SPF de LWS restent intacts et fonctionnels. La messagerie de l'agence n'est aucunement perturbée.

---

## 2. Réponses HTTP Publiques en Direct (CURL Réel)

### Racine Apex (`https://slaacvoyages.com/`)
```http
HTTP/2 200 
server: Vercel
content-type: text/html; charset=utf-8
strict-transport-security: max-age=63072000
x-matched-path: /
```

### Sous-domaine (`https://www.slaacvoyages.com/`)
```http
HTTP/2 308 
location: https://slaacvoyages.com/
server: Vercel
```
*Redirection permanente 308 immédiate vers le domaine canonique apex, sans passer par LWS.*

---

## 3. Vérification des Assets Favicon Servis en Production

Chaque ressource servie par Vercel a été téléchargée et son en-tête `ETag` a été comparé à l'empreinte MD5 du fichier local officiel SLAAC :

| URL | Code HTTP | Content-Type | Taille servie | ETag Vercel | MD5 Fichier Local | Statut |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/favicon.ico` | **200** | `image/vnd.microsoft.icon` | 5 832 o | `"1699241fa0703d379e91408fe1bb38a7"` | `1699241fa0703d379e91408fe1bb38a7` | **CONFORME 100%** |
| `/favicon-48.png` | **200** | `image/png` | 3 179 o | `"b2863df408178b511ba88f5c1497efe9"` | `b2863df408178b511ba88f5c1497efe9` | **CONFORME 100%** |
| `/favicon-96.png` | **200** | `image/png` | 8 259 o | `"891b5f7973434b0bfd3f4692e75567ec"` | `891b5f7973434b0bfd3f4692e75567ec` | **CONFORME 100%** |
| `/favicon-192.png` | **200** | `image/png` | 24 926 o | `"405f251f882eae54c9c88c4448c9f199"` | `405f251f882eae54c9c88c4448c9f199` | **CONFORME 100%** |
| `/apple-touch-icon.png`| **200** | `image/png` | 18 016 o | `"f9024d3b5193067e087ee14b4387620a"` | `f9024d3b5193067e087ee14b4387620a` | **CONFORME 100%** |
| `/favicon-16.png` | **200** | `image/png` | 552 o | `"84d39192441eef57cc2cf173cd59aff2"` | `84d39192441eef57cc2cf173cd59aff2` | **CONFORME 100%** |
| `/favicon-32.png` | **200** | `image/png` | 1 556 o | `"bed52bfac8879476655f68a74555103c"` | `bed52bfac8879476655f68a74555103c` | **CONFORME 100%** |

*Constat : Aucun fichier ne provient d'un cache LWS ou d'une ancienne page. Les ETags servis en production sont rigoureusement identiques aux fichiers SLAAC Voyages locaux.*

---

## 4. Exploration Robots.txt & Accessibilité Googlebot

Test direct en production sur `https://slaacvoyages.com/robots.txt` :
```text
User-Agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /_next/

User-Agent: Googlebot-Image
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://slaacvoyages.com/sitemap.xml
```

* **Accès global :** `Allow: /` autorise expressément l'exploration de la page d'accueil et des favicons.
* **Googlebot-Image :** Aucune restriction sur les images (`Allow: /`).
* **Absence d'anti-bot abusif :** Aucun pare-feu Cloudflare/WAF ne bloque les requêtes Googlebot (code HTTP 200 systématique).

---

## 5. Synthèse des Niveaux de Cache

1. **Cache Vercel Edge :** Déjà purgé et synchronisé (commit `f42f95f`). Sert la version officielle SLAAC.
2. **Cache DNS :** Résolution immédiate de l'apex vers l'IP Vercel `216.198.79.1`.
3. **Cache CDN Google Favicon (`t1.gstatic.com`) :** A déjà mis à jour sa vignette vers `apple-touch-icon.png` (SLAAC).
4. **Cache SERP Google (résultats de recherche) :** Retient encore temporairement la vignette LWS historique. Seule une réexploration de la page d'accueil déclenche son renouvellement.

**Statut : DÉPLOYÉ EN PRODUCTION & ACCESSIBLE À GOOGLEBOT**
