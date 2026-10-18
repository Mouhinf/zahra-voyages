# Rapport d'Audit 12/17 : Audit Analytics, Événements Publicitaires & CAPI
**Projet :** SLAAC Voyages  
**Branche :** release/v1.0.0-candidate  
**Date d'audit :** 18 Octobre 2026

---

## 1. Architecture de Mesure et Télémétrie

SLAAC Voyages met en œuvre un tracking complet combinant événements côté client (GA4, Pixel Meta, TikTok Pixel) et transmission d'événements serveur (Meta Conversions API).

---

## 2. Plan de Marquage et Événements Déclenchés

| Nom de l'Événement | Contexte de Déclenchement | Canal Client | Canal Serveur (CAPI) |
| :--- | :--- | :---: | :---: |
| `page_view` | Chargement de n'importe quelle page | OUI | NON |
| `cta_click` | Clic sur les boutons d'action majeurs | OUI | NON |
| `whatsapp_click` | Clic sur le bouton de discussion WhatsApp | OUI | OUI |
| `quote_start` | Début de saisie d'un formulaire de devis | OUI | NON |
| `lead_created` | Soumission réussie d'une demande commerciale | OUI | OUI (Dédupliqué) |
| `quote_sent` | Devis officiel émis par le conseiller (CRM) | NON | OUI (Offline Event) |
| `booking_confirmed` | Réservation payée et confirmée | NON | OUI (Offline Event) |

---

## 3. Déduplication et Respect de la Confidentialité

- **Déduplication `event_id` :** Pour chaque soumission de devis, un identifiant unique `eventId` est partagé entre le Pixel client et l'appel serveur Meta CAPI pour éviter tout double comptage dans Ads Manager.
- **Consentement RGPD & Législation Sénégalaise (CDP) :**
  - Bandeau de consentement explicite aux cookies de mesure.
  - En l'absence de consentement, les scripts de tracking tiers ne sont pas exécutés et aucun cookie n'est déposé.

---

## 4. Synthèse Analytics
Le dispositif de mesure offre une visibilité totale sur le retour sur investissement publicitaire (ROAS) dans le respect strict des réglementations sur les données personnelles.
