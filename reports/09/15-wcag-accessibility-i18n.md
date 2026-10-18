# Accessibilité Web WCAG 2.2 et Internationalisation
## SLAAC Voyages | Standardisation de l'Expérience Inclusive

### 1. Directives WCAG 2.2 Appliquées à l'Internationalisation
L'accessibilité d'un site multilingue impose des exigences particulières au-delà des critères visuels classiques :
1. **Critère 3.1.1 (Langue de la page - Niveau A)** :
   - Présence obligatoire de `<html lang="fr">` ou `<html lang="en">` généré côté serveur.
2. **Critère 3.1.2 (Langue d'un passage - Niveau AA)** :
   - Tout mot étranger inséré dans une page (ex : *Teranga*, *Meet & Greet*, *DMC*, *VTC*) est contextualisé et balisé si nécessaire pour éviter les contresens de prononciation vocale.
3. **Critère 2.4.4 (Fonction du lien - Niveau A)** :
   - Les boutons et liens du sélecteur de langue comportent des intitulés explicites (`title="Consulter le site en français"` / `aria-label="Version anglaise"`).
4. **Critère 4.1.2 (Nom, rôle et valeur - Niveau A)** :
   - L'élément actif du sélecteur porte l'attribut `aria-current="page"`.

### 2. Formulaires et Technologies d'Assistance
Sur les formulaires en anglais (`/en/contact` et `QuoteRequestModal`) :
- Chaque champ de saisie (`<input>`, `<textarea>`, `<select>`) possède un `<FormLabel>` associé via `id` et `for`.
- Les messages d'erreur de validation s'affichent sous le champ et sont annoncés par les lecteurs d'écran via `aria-describedby` et `aria-invalid`.
- Les icônes décoratives (téléphone, calendrier, flèches) comportent l'attribut `aria-hidden="true"`.

### 3. Contrastes de Couleurs et Lisibilité
- Conforme au niveau AAA pour les textes standards : contraste supérieur à 7:1 entre le texte Slate-900 et le fond blanc.
- Boutons dorés (`bg-slaac-gold-500` / `variant="gold"`) avec texte sombre à haut contraste pour une lisibilité parfaite en plein soleil sur smartphone.
