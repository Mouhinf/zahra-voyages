# Navigation Bilingue Header et Footer
## SLAAC Voyages | Expérience Utilisateur et Maillage Bilingue

### 1. Header Bilingue (`src/components/layout/header.tsx`)
Le composant d'en-tête s'adapte dynamiquement selon la langue active (`isEn = pathname.startsWith('/en')`) :
- **Navigation Desktop** :
  - En français : Billetterie, Hébergement, Transport AIBD, Excursions, Affaires, Assistance, Guides, Contact.
  - En anglais : Flights, Stays, Airport Transfers, Tours, Corporate, Travel Assistance, Guides, Contact.
  - Les liens internes pointent automatiquement vers la version anglaise correspondante (`/en/transport`, `/en/hebergement`, etc.) lorsque l'utilisateur est dans l'arborescence anglaise.
- **Message WhatsApp Prérempli Contextuel** :
  - Sur les pages françaises : *"Bonjour SLAAC Voyages, je souhaite des informations sur vos services de voyage."*
  - Sur les pages anglaises : *"Hello SLAAC Voyages, I would like information about your travel services in Senegal."*
- **Sélecteur de Langue** :
  - Présent en mode desktop (`LanguageSwitcher hidden sm:inline-flex`).
  - Présent dans le menu mobile (`Sheet`) sous forme de liens explorables avec attributs `hrefLang="fr"` et `hrefLang="en"`.

### 2. Footer Bilingue (`src/components/layout/footer.tsx`)
Le pied de page a été complètement restructuré pour offrir une symétrie irréprochable :
1. **Colonne 1 (Identité & Réassurance)** :
   - En français : *"Votre partenaire de confiance pour des voyages d'exception au Sénégal et dans le monde."*
   - En anglais : *"Your trusted travel partner and destination management company in Dakar, Senegal."*
2. **Colonne 2 (Services & Pôles Métiers)** :
   - Liens contextualisés vers les 6 pôles de services majeurs.
3. **Colonne 3 (Informations & Légal)** :
   - En français : Guides & Conseils, À propos, Contact, Séjour Dakar 2026, Politique de confidentialité.
   - En anglais : Travel Guides, About Us, Contact Us, Dakar 2026 Stay, Privacy Policy.
4. **Colonne 4 (Newsletter & Teranga Club)** :
   - Formulaire d'abonnement avec placeholders et boutons traduits en temps réel.
5. **Barre de Copyright & Switcher Bas** :
   - Mentions légales d'immatriculation à Dakar.
   - Composant `LanguageSwitcher` intégré pour offrir une bascule immédiate en fin de lecture de page.
