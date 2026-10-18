# Vérification de la Localisation, du Déménagement et du Pin Google Maps
## SLAAC Voyages | Audit Géographique & Fiabilité de l'Itinéraire

---

### 1. La Problématique de Double Localisation (Dakar Plateau vs Sacré-Cœur 3 / VDN)

L'investigation technique et documentaire met en lumière deux adresses distinctes associées à SLAAC Voyages :

1. **Adresse A (Historique / Annuaires externes) :**
   - *Localisation :* Sacré-Cœur 3 – VDN / Mermoz, Immeuble Dieynaba (3e étage, face ou proche de l'agence Ecobank), Dakar.
   - *Sources :* Go Africa Online, Petit Futé Sénégal, Senpages, Afriqmarket.
   - *Téléphones associés :* `+221 77 624 58 58` / `+221 77 312 90 90` / `+221 77 624 95 95`.
   - *Agence secondaire répertoriée :* Ngallèle (route de l'UGB), Saint-Louis (`+221 77 606 48 57`).

2. **Adresse B (Actuelle / Codebase & Communications Récentes) :**
   - *Localisation :* Rue Mouhamed 5 (Mohamed V), Immeuble Djolof Chicken, 3e étage, Dakar Plateau.
   - *Sources :* Site officiel `https://slaacvoyages.com`, mentions légales, templates d'emails, page `/contact`, page `/about`.
   - *Téléphone associé :* `+221 77 312 90 90` (WhatsApp & mobile direct) et `+221 77 624 58 58`.
   - *Coordonnées GPS précises du bâtiment :* Latitude `14.6687`, Longitude `-17.4344`.

---

### 2. Analyse de l'Iframe Google Maps Actuelle

L'iframe présente dans le code source utilise le code d'intégration suivant :
```html
<iframe
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d913.4299840693265!2d-17.4343981!3d14.668668499999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xec173b82ee767bd%3A0x95a2e5d20c75be4a!2sDjolof%20Chicken%20Dakar-Plateau!5e1!3m2!1sfr!2ssn!4v1784546169277!5m2!1sfr!2ssn"
  ...
/>
```

#### Diagnostic :
- **Avantage :** Le marqueur physique correspond exactement à l'immeuble où se situent les bureaux de SLAAC Voyages au 3e étage (16 Rue Mohamed V, Dakar Plateau).
- **Inconvénient SEO & UX :** L'infobulle Google Maps affiche l'enseigne de restauration rapide « Djolof Chicken » au lieu de la marque « SLAAC Voyages ».
- **Amélioration immédiate déployée dans le code :**
  - Ajout d'une mention de repère claire : *« Repère : Immeuble Djolof Chicken au 3e étage, Rue Mohamed V, Dakar Plateau »*.
  - Ajout d'un bouton d'action explicite **« Obtenir l'itinéraire Google Maps »** pointant vers l'API de navigation Google Maps (`https://www.google.com/maps/dir/?api=1&destination=14.6686685,-17.4343981`).

---

### 3. Procédure Réglementaire en Cas de Déménagement Confirmé

Si l'agence a transféré son siège de Sacré-Cœur 3 vers Dakar Plateau :
1. **Ne pas marquer l'ancien établissement « Définitivement fermé » :** Cela détruirait l'ancienneté SEO et générerait des fiches fantômes.
2. **Modifier l'adresse dans le tableau de bord Google Business Profile :**
   - Remplacer l'adresse par : `16 Rue Mohamed V, Immeuble Djolof Chicken, 3e étage, Dakar Plateau, 10200, Sénégal`.
   - Ajuster manuellement le pin sur la toiture exacte de l'immeuble.
3. **Prévoir la re-validation :** Google peut déclencher une vérification par enregistrement vidéo des locaux (enseigne, couloir, bureau, bail ou facture d'électricité).
4. **Mettre à jour les annuaires tiers :** Envoyer des demandes de rectification aux annuaires (Go Africa Online, Petit Futé) pour harmoniser le NAP.

---

### 4. Éligibilité de l'Établissement (Consignes Google)

SLAAC Voyages remplit parfaitement les conditions d'éligibilité pour afficher une adresse physique sur Google Maps :
- Les bureaux disposent d'un espace d'accueil pour recevoir les clients souhaitant réserver des billets d'avion, déposer des dossiers de visa ou planifier un voyage.
- Les horaires d'accueil sont fixes et des employés qualifiés sont présents sur place durant ces plages.
