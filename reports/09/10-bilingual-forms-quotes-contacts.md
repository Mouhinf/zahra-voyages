# Formulaires Bilingues : Devis & Contact
## SLAAC Voyages | Schémas Zod, Localisation Réactive et Traçabilité

### 1. Problématique Initiale
Auparavant, un utilisateur anglophone naviguant sur le site se retrouvait face à un modal de devis ou un formulaire de contact entièrement rédigé en français. Cette rupture linguistique générait un taux d'abandon élevé au moment le plus critique de l'entonnoir de conversion.

### 2. Le Modal de Devis Bilingue (`QuoteRequestModal`)
Le formulaire de devis (`src/components/layout/quote-request-dialog.tsx`) a été enrichi pour gérer de manière transparente la bilinguicité :
1. **Détection de la langue active** :
   ```typescript
   const pathname = usePathname();
   const activeLocale = locale || (pathname?.startsWith('/en') ? 'en' : 'fr');
   const isEn = activeLocale === 'en';
   ```
2. **Libellés des services dynamiques (`getServiceOptions`)** :
   - Les options de sélection de service affichent les intitulés traduits via `SERVICE_LABELS_EN` en mode anglais (ex : *"Airport transfer & VIP chauffeur"* au lieu de *"Transfert Aéroports & VTC"*).
3. **Champs et placeholders en anglais** :
   - *"Full Name"*, *"Email Address"*, *"Phone Number (with WhatsApp)"*, *"Trip Destination"*, *"Departure Date"*, *"Estimated Budget"*, *"Additional notes or special requests"*.
4. **Écran de confirmation et réassurance** :
   - Message de succès traduit avec numéro de référence du dossier : *"Your quote request has been received. Our Dakar team will get back to you within 24 business hours."*
   - Bouton WhatsApp direct avec message pré-rempli en anglais : *"Hello SLAAC Voyages, I have submitted quote request REF-XXXX..."*

### 3. La Page Contact Bilingue (`/en/contact`)
Le formulaire de la page contact a été implémenté avec :
- Validation Zod via `contactSchema` acceptant `locale: z.enum(['fr', 'en']).optional().default('fr')`.
- Transmission explicite de `locale: 'en'` dans le corps de la requête POST `/api/contact`.
- Toasts de notification natifs en anglais (*"Message sent successfully!"* / *"Submission failed"*).
- Champ pot de miel (`website: ''`) pour la protection contre les soumissions automatisées de robots.
