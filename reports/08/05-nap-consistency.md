# Audit de Cohérence NAP (Name, Address, Phone) & Standardisation
## SLAAC Voyages | Harmonisation des Données d'Établissement

---

### 1. Pourquoi le NAP est-il Déterminant en SEO Local ?

L'algorithme de classement local de Google s'appuie lourdement sur la cohérence des signaux **NAP (Name, Address, Phone)** à travers le web. Si des adresses contradictoires ou des numéros divergents circulent sur différents répertoires, l'indice de confiance (*confidence score*) de l'établissement baisse, réduisant drastiquement ses chances d'apparaître dans le Local Pack.

---

### 2. État des Lieux Comparatif du NAP

| Source / Support | Nom Déclaré | Adresse Déclarée | Téléphone(s) | Email Déclaré |
|---|---|---|---|---|
| **Site Web (`src/lib/site.ts`)** | `SLAAC Voyages` | `Rue Mouhamed 5, Immeuble Djolof Chicken, 3e étage, Dakar Plateau` | `+221 77 312 90 90` / `+221 77 624 58 58` | `contact@slaacvoyages.com` / `mdslaacvoyages@gmail.com` |
| **Site Web (`/contact`)** | `SLAAC Voyages` | `Rue Mouhamed 5, Immeuble Djolof Chicken, 3e étage, Dakar Plateau` | `+221 77 312 90 90` / `+221 77 624 58 58` | `contact@slaacvoyages.com` / `infoslaac@slaacvoyages.com` |
| **Site Web (`/about`)** | `SLAAC Voyages` | `Dakar Plateau (Immeuble Djolof Chicken, 3e étage)` | `+221 77 312 90 90` | `contact@slaacvoyages.com` |
| **Pied de page universel** | `SLAAC Voyages` | `Dakar Plateau, rue Mouhamed 5, Immeuble Djolof Chicken, 3e étage` | `+221 77 312 90 90` | `contact@slaacvoyages.com` |
| **Schema.org JSON-LD** | `SLAAC Voyages` | `Rue Mouhamed 5, Immeuble Djolof Chicken, 3e étage, Dakar Plateau` | `+221 77 312 90 90` | `contact@slaacvoyages.com` |
| **Go Africa Online** | `SLAAC VOYAGES` | `Sacré-Cœur 3 / VDN, Immeuble Dieynaba, 3e étage` | `+221 77 624 58 58` / `+221 77 624 95 95` | `contact@slaacvoyages.com` |
| **Petit Futé Sénégal** | `SLAAC Voyages` | `Immeuble Dieynaba (3e étage), Sacré-Cœur 3 - VDN` | `+221 77 624 58 58` / `+221 77 312 90 90` | Non affiché |
| **Senpages** | `SLAAC Voyages` | `Sacré-Cœur 3 / VDN, Immeuble Dieynaba` | `+221 77 312 90 90` | Non affiché |

---

### 3. Plan de Standardisation Officiel

Pour éradiquer tout flou algorithmique, la norme officielle retenue est :

```text
NOM : SLAAC Voyages
RUE : Rue Mouhamed 5, Immeuble Djolof Chicken, 3e étage
QUARTIER : Dakar Plateau
VILLE : Dakar
CODE POSTAL : 10200
PAYS : Sénégal (SN)
TÉLÉPHONE PRINCIPAL : +221 77 312 90 90 (Mobile & WhatsApp)
TÉLÉPHONE SECONDAIRE : +221 77 624 58 58 (Ligne commerciale)
EMAIL COMMERCIAL : contact@slaacvoyages.com
EMAIL DIRECTION : mdslaacvoyages@gmail.com
SITE WEB : https://slaacvoyages.com
```

---

### 4. Actions Correctives à Mener (Sur Validation Propriétaire)

1. **Sur le site web :** Standardisation déjà déployée dans `src/lib/site.ts`, `src/lib/seo-schema.ts`, `/contact` et le footer.
2. **Sur les annuaires tiers :** Transmettre un formulaire de mise à jour des coordonnées à Go Africa Online, Petit Futé et Senpages pour enregistrer la nouvelle adresse de Dakar Plateau une fois confirmée par la direction.
