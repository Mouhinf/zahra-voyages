import { configureGenkit } from '@genkit-ai/core';
import { googleCloud } from '@genkit-ai/google-cloud';
import { chatFlow } from './flows/chatFlow'; // Importez le flux que nous venons de créer

export let isGenkitConfigured = false; // Export a status flag

const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
  console.error("❌ ERREUR: La variable d'environnement GEMINI_API_KEY est manquante.");
  console.error("Genkit ne sera pas configuré. L'API de chat échouera. Assurez-vous que votre fichier .env.local est correct et que vous avez redémarré le serveur.");
} else {
  console.log("✅ GEMINI_API_KEY est chargée.");
  configureGenkit({
    plugins: [
      googleCloud({
        apiKey: geminiApiKey, // Utilise la clé API depuis les variables d'environnement
        defaultRegion: 'us-central1', // Région par défaut, vous pouvez la changer si nécessaire
      }),
    ],
    flows: { chatFlow }, // Enregistre le flux de chat
    logLevel: 'debug', // Utile pour le débogage
  });
  isGenkitConfigured = true;
}