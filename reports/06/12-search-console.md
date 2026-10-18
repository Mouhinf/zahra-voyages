# 12 — Protocole Google Search Console & Surveillance d'Indexation
**Projet :** SLAAC Voyages (`https://slaacvoyages.com`)  
**Phase :** Prompt 06/12 — SEO Technique Avancé & Indexation Google  
**Statut :** Procédure opérationnelle pour l'administrateur

---

## 1. Propriété de Domaine dans Search Console

Pour assurer une visibilité complète sur l'ensemble des sous-domaines et protocoles, il est impératif de déclarer la propriété sous forme de **Propriété Domaine** plutôt que par préfixe d'URL :
- **Propriété cible :** `slaacvoyages.com` (englobe `https://`, `http://`, `www.` et d'éventuels sous-domaines).
- **Méthode de validation recommandée :** Enregistrement DNS TXT chez LWS (ex: `google-site-verification=...`).
- *Alternative sans toucher au DNS :* Balise meta HTML de validation dans `src/app/layout.tsx` (option `verification: { google: '...' }`).

---

## 2. Soumission du Sitemap XML

Dès la mise en production du domaine canonique `https://slaacvoyages.com` :
1. Se rendre dans l'onglet **Indexation > Sitemaps** de Google Search Console.
2. Saisir l'URL relative : `sitemap.xml`.
3. Cliquer sur **Envoyer**.
4. Constater le statut : **Succès**, avec décompte des URLs découvertes (environ 20 URLs statiques + URLs dynamiques des offres Firestore actives).

---

## 3. Plan de Surveillance Hebdomadaire (Checklist DevOps / SEO)

1. **Rapport Couverture (Indexation des pages) :**
   - Vérifier que 0 page valide n'est marquée en « Détectée, actuellement non indexée » ou « Explorée, actuellement non indexée ».
   - S'assurer que le nombre de pages 404 correspond uniquement à des ressources supprimées légitimement et qu'aucun *soft 404* n'apparaît.
2. **Rapport Signaux Web Essentiels (Core Web Vitals) :**
   - Valider que 100% des URLs mobiles sont dans la zone verte (« Bonnes ») pour LCP, INP et CLS.
3. **Données Structurées :**
   - Surveiller les alertes sur `BreadcrumbList`, `TravelAgency`, `LocalBusiness`.
4. **Erreurs de Sécurité & Actions Manuelles :**
   - Confirmer qu'aucune action manuelle n'est enregistrée.
