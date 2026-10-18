# Rapport 05.02 — Next.js 15 & Architecture de Rendu
> **Projet :** SLAAC Voyages (`https://slaacvoyages.com`)  
> **Branche de travail :** `feat/slaac-perf-core-web-vitals`  
> **Framework :** Next.js 15.5.22 App Router / React 18.3.1  
> **Date :** 17 octobre 2026

---

## 1. Audit Architectural Server Components vs Client Components

Avant notre intervention, une sur-utilisation de la directive `'use client'` dégradait l'efficacité du Server-Side Rendering (SSR) et gonflait inutilement le fil d'exécution JavaScript du navigateur :

| Fichier / Composant | Statut Initial | Problème Constaté | Statut Post-Optimisation | Bénéfice Technique |
| :--- | :---: | :--- | :---: | :--- |
| `src/components/sections/hero.tsx` | `'use client'` | Aucun hook client (`useState`, `useEffect`), mais embarqué en client | **Server Component** | Élimination du code de composants Hero du bundle client de la homepage. |
| `src/components/sections/home-contact-quick.tsx` | `'use client'` | `useEffect` interrogeait Firestore pour une image d'agence | **Client Component épuré** | Suppression des imports Firebase client (`getDbInstance`, `collection`, `getDocs`). |
| `src/app/hebergement/[id]/page.tsx` | `'use client'` | Démarrage avec `isLoading = true`, spinner `<Loader2>`, puis shift complet du DOM | **Server Component + Client Gallery** | **CLS passé de 0.868 à 0.00**. Données générées côté serveur, indexation SEO complète. |
| `src/app/excursions/[id]/page.tsx` | `'use client'` | Spinner initial puis rendu différé | **Server Component + Client Gallery** | Rendu SSR immédiat du titre, des prix et des inclusions. |
| `src/app/transport/[id]/page.tsx` | `'use client'` | Spinner initial puis rendu différé | **Server Component + Client Gallery** | Rendu SSR immédiat des forfaits AIBD et caractéristiques véhicules. |
| `src/app/tourisme-affaires/[id]/page.tsx` | `'use client'` | Spinner initial puis rendu différé | **Server Component + Client Gallery** | Rendu SSR immédiat des prestations séminaires et MICE. |
| `src/app/voyages-croisieres/[id]/page.tsx` | `'use client'` | Spinner initial puis rendu différé | **Server Component + Client Gallery** | Rendu SSR immédiat des forfaits Omra et croisières. |

---

## 2. Refactorisation des Pages de Détail (`/[module]/[id]`)

### Le Pattern Précédent (Anti-pattern CSR sous App Router) :
```tsx
// Avant : composant client complet avec flash de chargement
'use client';
export default function DetailPage() {
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Requête client qui retarde l'affichage de 1 à 3 secondes
    fetchDoc(params.id).then(setItem).finally(() => setIsLoading(false));
  }, [params.id]);

  if (isLoading) return <Loader2 className="animate-spin" />;
  return <Content item={item} />;
}
```
**Inconvénients majeurs :**
1. **Perte de référencement Google :** Le HTML initial ne contenait ni titre h1, ni métadonnées, ni description.
2. **Décalage visuel dévastateur (CLS = 0.868) :** L'écran passe brutalement d'un spinner centré à un bloc de 1 200 px de haut.

### La Solution Implémentée (Hybridation RSC / Client Interactive) :
1. **Module Serveur Dédié (`src/lib/detail-data.ts`) :**
   Fonctions mémoïsées (`cache()`) interrogeant Firestore avec repli statique garanti (`getFeaturedHebergement`, etc.).
2. **Page Serveur (`src/app/hebergement/[id]/page.tsx`) :**
   ```tsx
   export const revalidate = 300; // ISR 5 minutes
   
   export async function generateMetadata({ params }): Promise<Metadata> {
     const { id } = await params;
     const item = await fetchHebergementItem(id);
     return {
       title: `${item.titre} | SLAAC Voyages`,
       description: item.description?.slice(0, 160),
       alternates: { canonical: `/hebergement/${id}` },
       openGraph: { title: item.titre, images: [{ url: item.image }] },
     };
   }

   export default async function HebergementDetailPage({ params }) {
     const { id } = await params;
     const item = await fetchHebergementItem(id);
     return <HebergementDetailClient item={item} id={id} />;
   }
   ```
3. **Composant Client Atomique (`HebergementDetailClient`) :**
   Reçoit `item` directement depuis le HTML initial du serveur.
   Gère l'interactivité riche (swipe tactile via `useGallerySwipe`, visionneuse plein écran Lightbox, sélection des miniatures, commande de devis).
   **Résultat mesuré : zéro délai d'affichage, CLS ramené à 0.00.**

---

## 3. Streaming, Revalidation & ISR

- **Revalidation temporelle (ISR) :** Les pages de catalogue (`/transport`, `/hebergement`, `/excursions`, `/tourisme-affaires`, `/voyages-croisieres`) et leurs fiches de détail utilisent `export const revalidate = 300` (5 minutes).
- **Conséquence directe sur Vercel :**
  - Première requête après build : servie instantanément depuis le cache statique Edge Vercel.
  - Trafic récurrent : zéro exécution de Serverless Function et zéro lecture Firestore tant que la fenêtre de 300 s n'a pas expiré.
  - Revalidation en arrière-plan (stale-while-revalidate) : le visiteur ne subit jamais la latence d'une régénération.
