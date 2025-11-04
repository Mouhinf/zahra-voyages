import {genkit, defineFlow} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import * as z from 'zod'; // Import Zod for schema definition

console.log('Initializing Genkit...');
export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY, // Utilisation de la clé API depuis les variables d'environnement
    }),
  ],
  logLevel: 'debug', // Activation du niveau de log debug
  enableTracingAndMetrics: true, // Activation du tracing et des métriques
  // flows: { chatFlow }, // This property is not valid here and has been removed.
});

// Define the chatFlow directly in genkit.ts
export const chatFlow = defineFlow(
  'chatFlow',
  {
    inputSchema: z.object({ message: z.string() }),
    outputSchema: z.string(), // Le flux retourne directement une chaîne de caractères
  },
  async ({ message }) => {
    const model = googleAI.model('gemini-2.0-flash'); 
    const prompt = `You are a helpful AI assistant for Zahra Voyages, a travel agency based in Dakar, Senegal. Your goal is to provide information and guidance regarding travel, destinations, visa procedures, and general inquiries about Zahra Voyages' services. Keep your answers concise and helpful.

User: ${message}
Assistant:`;

    try {
      const response = await model.generate({
        prompt,
        temperature: 0.7,
      });

      return response.text(); // Retourne directement le texte de la réponse
    } catch (err) {
      console.error('Erreur de l’IA:', err);
      return 'Une erreur est survenue côté IA. Réessaie plus tard.';
    }
  }
);

console.log('Genkit initialized successfully.');