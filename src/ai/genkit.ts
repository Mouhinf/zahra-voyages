import { configure, defineFlow, getPlugin } from '@genkit-ai/core';
import { googleAI } from '@genkit-ai/googleai';
import * as z from 'zod'; // Import Zod for schema definition

console.log('Initializing Genkit...');
// Configuration de Genkit
configure({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY, // Utilisation de la clé API depuis les variables d'environnement
    }),
  ],
  logLevel: 'debug', // Activation du niveau de log debug
  enableTracingAndMetrics: true, // Activation du tracing et des métriques
});

const googleAIPlugin = getPlugin('googleAI');

export const chatFlow = defineFlow(
  'chatFlow', // Le nom du flow
  {
    inputSchema: z.object({ question: z.string() }), // Utilisation de 'question' comme champ d'entrée
    outputSchema: z.string(), // Le flux retourne directement une chaîne de caractères
  },
  async ({ question }) => {
    const prompt = `You are a helpful AI assistant for Zahra Voyages, a travel agency based in Dakar, Senegal. Your goal is to provide information and guidance regarding travel, destinations, visa procedures, and general inquiries about Zahra Voyages' services. Keep your answers concise and helpful.

User: ${question}
Assistant:`;

    try {
      const response = await googleAIPlugin.generate({ // Utilisation de googleAIPlugin.generate
        model: 'gemini', // Utilisation du modèle 'gemini'
        prompt,
        config: { temperature: 0.7 },
      });

      return response.text(); // Retourne directement le texte de la réponse
    } catch (err) {
      console.error('Erreur de l’IA:', err);
      return 'Une erreur est survenue côté IA. Réessaie plus tard.';
    }
  }
);

console.log('Genkit initialized successfully.');