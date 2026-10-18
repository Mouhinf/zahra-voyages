# Parcours de Conversion Local & Optimisation Mobile (Maps to Lead)
## SLAAC Voyages | Tunnel CRO Mobile-First & Traçabilité des Visiteurs Locaux

---

### 1. La Réalité du Comportement Utilisateur à Dakar

Au Sénégal, plus de 85 % des recherches locales sur Google Maps s'effectuent sur **smartphone** (Android principalement) via des connexions mobiles 3G/4G :
- Le voyageur ou l'homme d'affaires local cherche une réponse immédiate.
- Les trois actions clés recherchées sont : **Appeler immédiatement**, **Envoyer un message WhatsApp**, ou **Obtenir l'itinéraire vers l'agence**.
- Si la page d'atterrissage est lente, confuse ou si le numéro ne déclenche pas le composeur téléphonique, le prospect se tourne instantanément vers un concurrent.

---

### 2. Le Tunnel de Conversion Optimisé en 5 Étapes

```text
1. RECHERCHE GOOGLE / MAPS
   Requête : « agence de voyage dakar plateau »
   Affichage de la fiche Google Business Profile SLAAC Voyages
      ↓
2. POINT D'ENTRÉE DU VISITEUR
   Option A : Clic sur le bouton d'appel direct (Composeur : +221 77 312 90 90)
   Option B : Clic sur « Itinéraire » (Guidage GPS vers Rue Mohamed V)
   Option C : Clic sur « Site Web » avec balisage UTM
      ↓
3. EXPÉRIENCE D'ATTERRISSAGE SUR LE SITE
   Temps de chargement < 1,5s (Next.js 15 SSG / CDN Vercel)
   Affichage immédiat du bandeau de conciergerie mobile flottant
   Visibilité instantanée des boutons WhatsApp et Devis en 1 clic
      ↓
4. QUALIFICATION DE LA DEMANDE
   Remplissage du formulaire de devis pré-segmenté OU échange WhatsApp direct
   Enregistrement immédiat dans la collection Firestore `quotes` ou `contacts`
      ↓
5. TRAITEMENT COMMERCIAL (OUTBOX & CRM)
   Accusé de réception automatique au voyageur avec mentions légales
   Alerte email instantanée sur smartphone du responsable commercial
   Prise en charge téléphonique ou WhatsApp sous 2 à 4 heures ouvrées
```

---

### 3. Plan de Marquage UTM pour les Liens Google Business Profile

Pour mesurer avec exactitude la contribution de la fiche Google Maps aux opportunités commerciales, les URLs déclarées sur Google Business Profile intègrent des paramètres UTM standardisés :

- **Lien vers la page d'accueil :**
  `https://slaacvoyages.com/?utm_source=google&utm_medium=organic&utm_campaign=google_business_profile`
- **Lien de prise de rendez-vous / Devis :**
  `https://slaacvoyages.com/contact?utm_source=google&utm_medium=organic&utm_campaign=gbp_contact`
- **Lien du service Omra :**
  `https://slaacvoyages.com/omra?utm_source=google&utm_medium=organic&utm_campaign=gbp_omra`
- **Lien du service Transferts AIBD :**
  `https://slaacvoyages.com/transport?utm_source=google&utm_medium=organic&utm_campaign=gbp_transport`

*Important :* La balise `canonical` de chaque page pointe toujours vers l'URL propre sans UTM (`https://slaacvoyages.com/` ou `/contact`), évitant tout risque de duplicate content pour les moteurs.
