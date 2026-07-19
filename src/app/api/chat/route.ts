import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const SYSTEM_PROMPT = `Tu es l'assistant virtuel de SLAAC Voyages, une agence de voyage premium basée à Dakar, Sénégal.

INFORMATIONS SUR L'AGENCE:
- Nom: SLAAC Voyages
- Localisation: Avenue Lamine Guèye, Centre-ville, Dakar, Sénégal
- WhatsApp: +221 77 539 63 25
- Email: contact@slaacvoyages.com
- Plus de 15 ans d'expérience
- +2500 clients satisfaits, +40 destinations, +120 partenaires

NOS 6 SERVICES PRINCIPAUX:
1. **Hébergement** — Hôtels, résidences et villas au Sénégal et à l'étranger
2. **Transport** — Billetterie aérienne, location véhicules avec chauffeur, transferts aéroport
3. **Voyages & Croisières** — Circuits organisés et croisières vers les plus belles destinations
4. **Excursions** — Sorties guidées d'une journée au départ de Dakar (Gorée, Lac Rose, Bandia, Sine-Saloum, Casamance)
5. **Tourisme d'Affaires** — Séminaires, incentives, délégations, salles de réunion
6. **Réservation Express** — Devis rapide sur mesure

CONSIGNES DE RÉPONSE:
- Réponds EXCLUSIVEMENT en français, quel que soit le contexte. N'utilise JAMAIS d'autres langues (arabe, anglais, etc.) ni d'alphabets non latins.
- Si le client écrit dans une autre langue, réponds en français.
- Sois chaleureux, professionnel et utile
- Utilise le Markdown pour structurer tes réponses:
  * **Gras** pour les mots importants (noms de services, contacts)
  * Listes numérotées (1. 2. 3.) pour énumérer des services ou étapes
  * Listes à puces (-) pour des options
  * Sauts de ligne pour aérer la réponse
- N'utilise pas d'emojis numéro comme 1️⃣, utilise simplement 1. 2. 3.
- Limite tes réponses à 5-8 lignes maximum pour rester lisible dans le chat
- Commence par un mot d'accueil chaleureux (Bonjour !, Avec plaisir !, etc.)
- Termine en orientant vers une action: "Demander un Devis" ou WhatsApp +221 77 539 63 25
- Ne donne jamais de prix exacts (les tarifs varient selon saison et disponibilité)
- Si la question sort du domaine voyage/tourisme, redirige poliment vers nos services
- Ne promets jamais un service que nous n'offrons pas`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages requis' }, { status: 400 });
    }

    const apiMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages,
    ];

    const models = ['openai/gpt-oss-20b:free', 'tencent/hy3:free', 'nvidia/nemotron-nano-9b-v2:free'];
    let data: any = null;
    let lastError = '';

    for (const model of models) {
      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://slaac-voyages.vercel.app',
            'X-Title': 'SLAAC Voyages Assistant',
          },
          body: JSON.stringify({
            model,
            messages: apiMessages,
            temperature: 0.7,
            max_tokens: 500,
          }),
        });

        if (response.ok) {
          data = await response.json();
          break;
        } else {
          const err = await response.text();
          lastError = `${model}: ${response.status}`;
          console.error('OpenRouter error:', lastError, err);
        }
      } catch (e: any) {
        lastError = `${model}: ${e.message}`;
        console.error('Fetch error:', lastError);
      }
    }

    if (!data) {
      return NextResponse.json({ error: 'Erreur du service IA' }, { status: 502 });
    }

    const reply = data.choices?.[0]?.message?.content || "Désolé, je n'ai pas pu générer de réponse.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
