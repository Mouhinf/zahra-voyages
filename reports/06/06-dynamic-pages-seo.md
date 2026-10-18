# Rapport 06/20 : Référencement & Gestion des Pages Dynamiques Firestore

**Date :** 18 Octobre 2026  
**Routes Concernées :**  
- `/hebergement/[id]`  
- `/transport/[id]`  
- `/excursions/[id]`  
- `/tourisme-affaires/[id]`  
- `/voyages-croisieres/[id]`  

---

## 1. Problématique Initiale : Le Risque de Soft 404

Dans l'architecture Next.js initiale :
- Les fiches détaillées ne déclenchaient pas la fonction `notFound()` du serveur lorsqu'un identifiant n'existait pas dans la base Firestore.
- Le serveur renvoyait un code HTTP **200 OK** avec un contenu textuel d'erreur (« Hébergement introuvable »).
- **Conséquence SEO :** Googlebot classait ces requêtes en **Soft 404**. Les URLs orphelines ou obsolètes restaient indexées avec un statut d'erreur trompeur.

---

## 2. Solutions Techniques Appliquées

### A. Déclenchement Automatique de `notFound()` dans les Server Components
Sur chacune des 5 routes dynamiques :
```typescript
export default async function HebergementDetailPage({ params }: PageProps) {
  const { id } = await params;
  const item = await fetchHebergementItem(id);

  if (!item) {
    notFound(); // Renvoie immédiatement un code HTTP 404 officiel
  }

  return <HebergementDetailClient item={item} id={id} />;
}
```

### B. Balises Meta de Protection en cas de Document Inexistant
Si le moteur d'exploration tente de lire les métadonnées d'une offre inexistante :
```typescript
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const item = await fetchHebergementItem(id);

  if (!item) {
    return {
      title: 'Hébergement non trouvé | SLAAC Voyages',
      description: 'L’hébergement demandé est introuvable ou n’est plus disponible.',
      robots: { index: false, follow: false },
    };
  }

  // Métadonnées enrichies de l'offre réelle
}
```

### C. URLs Canoniques Absolues & Encodage Sécurisé
- Chaque fiche d'offre génère une balise canonique explicite :
  `canonical: /hebergement/${encodeURIComponent(id)}`
- Cela neutralise les éventuelles duplications de contenu causées par des paramètres de tracking (`?utm_...` ou `?ref=...`).

### D. Open Graph Dynamique
- Lorsqu'un utilisateur partage une fiche d'hébergement ou d'excursion sur WhatsApp, LinkedIn ou Facebook, l'image réelle de l'offre (optimisée via le CDN Cloudinary) est affichée avec son titre et sa description exacte.
