# Ergonomie Mobile & Expérience Internationale
## SLAAC Voyages | Mobile-First & Roaming International

### 1. Profil des Voyageurs Internationaux sur Mobile
Plus de 78% des consultations internationales pour des voyages au Sénégal se font depuis des smartphones en situation de mobilité (aéroports, correspondances, déplacements) ou sous réseau roaming 3G/4G restreint.

### 2. Optimisations Spécifiques pour Voyageurs Mobiles
1. **Accès Immédiat aux Urgences & WhatsApp** :
   - Bouton WhatsApp vert haute visibilité pré-configuré avec un message en anglais adapté à la page visitée.
   - Bouton d'appel direct avec préfixe international formaté : `<a href="tel:+221773129090">`.
2. **Cibles Tactiles Élargies (Minimum 44px)** :
   - Tous les boutons d'action du Header (`Button size="icon" className="h-10 w-10 sm:h-11 sm:w-11"`) respectent les directives ergonomiques d'Apple et Google.
3. **Menu Mobile Tirant (`Sheet`) Fluide** :
   - Tiroir latéral avec défilement fluide, liste des services clés en anglais et sélecteur de langue bilingue proéminent en bas de menu.
4. **Intégration Google Maps Native** :
   - Bouton *"Open Google Maps →"* qui lance directement l'application Maps sur iOS ou Android avec itinéraire précalculé vers l'immeuble Djolof Chicken à Dakar Plateau.
5. **Formulaire de Devis Allégé** :
   - Chargement dynamique différé du modal (`React.lazy`) pour ne pas charger les 46 Ko de JavaScript du modal tant que l'utilisateur n'a pas cliqué sur le bouton de devis.
