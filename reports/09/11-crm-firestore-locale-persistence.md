# Persistance de la Langue Client dans le CRM et Firestore
## SLAAC Voyages | Collections `quotes` et `contacts` & Modélisation des Données

### 1. Enjeu CRM et Segmentation Commerciale
Pour qu'une agence de voyages traite efficacement les leads entrants, il est indispensable que le conseiller commercial sache immédiatement dans quelle langue s'adresser au prospect lors du premier contact téléphonique, WhatsApp ou par email.

### 2. Évolution des Schémas de Données Zod
Les schémas de validation ont été mis à jour pour formaliser l'attribut `locale` :
- `src/lib/schemas/quote-schema.ts` :
  ```typescript
  export const quoteSchema = z.object({
    // ... autres champs
    locale: z.enum(['fr', 'en']).optional().default('fr'),
  });
  ```
- `src/lib/schemas/contact-schema.ts` :
  ```typescript
  export const contactSchema = z.object({
    // ... autres champs
    locale: z.enum(['fr', 'en']).optional().default('fr'),
  });
  ```

### 3. Persistance dans Firestore
Les routes d'ingestion API enregistrent systématiquement l'attribut dans les collections respectives de la base de données :
- **Dans `/api/quotes/route.ts`** :
  ```typescript
  const rawRecord = {
    // ...
    locale: quote.locale || 'fr',
    createdAt: new Date().toISOString(),
  };
  const cleanRecord = cleanFirestoreData(rawRecord);
  const docRef = await db.collection('quotes').add(cleanRecord);
  ```
- **Dans `/api/contact/route.ts`** :
  ```typescript
  const rawRecord = {
    // ...
    locale: data.locale || 'fr',
    createdAt: new Date().toISOString(),
  };
  const cleanRecord = cleanFirestoreData(rawRecord);
  const docRef = await db.collection('contacts').add(cleanRecord);
  ```

### 4. Bénéfices pour les Conseillers SLAAC Voyages
1. **Zéro friction linguistique** : Le tableau de bord CRM affiche clairement un badge `EN` ou `FR` sur la fiche prospect.
2. **Assignation automatique** : Possibilité d'assigner automatiquement les dossiers anglophones aux conseillers parlant couramment anglais au bureau de Dakar Plateau.
3. **Campagnes ciblées** : Segmentation ultérieure pour les campagnes marketing en amont de Dakar 2026.
