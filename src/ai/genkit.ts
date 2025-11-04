import { configure, defineFlow } from '@genkit-ai/core';
import { googleAI } from '@genkit-ai/googleai';
import * as z from 'zod';

// Configuration Genkit
configure({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

// Définition du flow
export const chatFlow = defineFlow(
  'chatFlow', // Le nom du flow
  {
    inputSchema: z.object({ question: z.string() }),
    outputSchema: z.string(),
  },
  async ({ question }) => {
    const prompt = `Tu es un assistant IA de l'agence Zahra Voyages.
Réponds toujours avec bienveillance et clarté à la question suivante :
"${question}"`;

    try {
      const model = googleAI(); // Instanciation du modèle comme suggéré
      const result = await model.generate({
        model: 'gemini', // Utilisation du modèle 'gemini'
        prompt,
        config: { temperature: 0.5 },
      });

      return result.text();
    } catch (error) {
      console.error('Erreur Gemini:', error);
      return "Je n’ai pas pu traiter ta demande pour le moment.";
    }
  }
);