import { configureGenkit } from '@genkit-ai/core';
import { googleCloud } from '@genkit-ai/google-cloud';
import { chatFlow } from './flows/chatFlow'; // Importez le flux que nous venons de créer

configureGenkit({
  plugins: [
    googleCloud({
      apiKey: process.env.GEMINI_API_KEY, // Utilise la clé API depuis les variables d'environnement
      defaultRegion: 'us-central1', // Région par défaut, vous pouvez la changer si nécessaire
    }),
  ],
  flows: { chatFlow }, // Enregistre le flux de chat
  logLevel: 'debug', // Utile pour le débogage
});