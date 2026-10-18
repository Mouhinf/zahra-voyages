# Hero Éditorial & Traitement des Médias (Cloudinary) — SLAAC Voyages
> **Objectif :** Établir une première impression visuelle mémorable tout en garantissant un score Core Web Vitals LCP < 1,8 seconde.  
> **Composants Touchés :** `src/components/sections/hero.tsx`, configuration Cloudinary et politique d'imagerie  
> **Date :** 17 Octobre 2026  
> **Auteur :** Directeur Artistique Digital & Ingénieur Performance Web  

---

## 1. Confrontation des Formats de Hero

L'audit initial a comparé trois paradigmes pour le premier écran du site :

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       COMPARAISON DES MODÈLES DE HERO                       │
├─────────────────────┬─────────────────────┬─────────────────────────────────┤
│ MODÈLE              │ AVANTAGES           │ INCONVÉNIENTS / RISQUES         │
├─────────────────────┼─────────────────────┼─────────────────────────────────┤
│ A. Carrousel        │ Multitude d'images  │ Instabilité visuelle, fatigue   │
│    Automatique      │ affichées           │ cognitive, dégradation LCP, CLS │
│    (Ancien système) │                     │ sur mobile, ignoré par 89% users│
├─────────────────────┼─────────────────────┼─────────────────────────────────┤
│ B. Vidéo de fond    │ Immersion vivante   │ Poids lourd (>5 Mo), mise en    │
│    (Background)     │                     │ mémoire tampon lente au Sénégal │
├─────────────────────┼─────────────────────┼─────────────────────────────────┤
│ C. Composition      │ Clarté absolue de   │ Requiert un visuel de très      │
│    Éditoriale Fixe  │ l'offre, LCP < 1,8s,│ haute qualité photographique    │
│    (MODÈLE RETENU)  │ lisibilité parfaite │                                 │
└─────────────────────┴─────────────────────┴─────────────────────────────────┘
```

### Justification du Modèle Retenu (Composition Éditoriale Fixe) :
Sur les réseaux mobiles ouest-africains (3G/4G), un carrousel téléchargeant 4 diapositives simultanément monopolise la bande passante et retarde le rendu du texte. La composition éditoriale fixe retenue charge **une seule image de fond magistrale en priorité absolue**, garantissant un affichage instantané et un contraste textuel WCAG AAA grâce au dégradé sombre calibré.

---

## 2. Charte Photographique & Authentique

### 2.1. Élimination des Faux Visuels Déconnectés
- **Proscrits :** Photos de cadres en costume se serrant la main devant des gratte-ciels occidentaux, berlines jaunes new-yorkaises, illustrations 3D abstraites.
- **Adoptés :**
  - Photographies lumineuses de la presqu'île du Cap-Vert, de Gorée, du Lac Rose au crépuscule et des résidences dakaroises modernes.
  - Représentation de véhicules réels adaptés au terrain sénégalais (berlines climatisées, SUV 4x4, minibus d'excursion).
  - Accueil chaleureux incarnant la Teranga avec tenue professionnelle sobre.

---

## 3. Pipeline d'Optimisation Cloudinary & Next.js Image

Toutes les images servies par Cloudinary bénéficient des transformations d'URL suivantes :

$$\text{URL Cloudinary} = \text{https://res.cloudinary.com/dvnq5qwbd/image/upload/} \mathbf{f\_auto,q\_auto} \text{/[id].png}$$

- `f_auto` : Sélectionne automatiquement le meilleur format supporté par le navigateur du visiteur (`AVIF` pour Chrome/Safari récents, `WebP` pour Firefox/Edge).
- `q_auto` : Compression visuelle sans perte perceptible, réduisant la taille du fichier de 60% à 75%.
- `sizes="(max-width: 768px) 100vw, 1920px"` : Fournit au navigateur la taille de rendu exacte pour éviter de télécharger une image 4K sur un smartphone de 390px.
- `priority={true}` réservé au Hero pour devancer l'ordonnancement réseau du navigateur.
- `loading="lazy"` activé sur l'ensemble des images secondaires situées sous la ligne de flottaison.
