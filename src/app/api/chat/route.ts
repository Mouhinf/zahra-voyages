import { NextResponse } from "next/server";
import { chatFlow } from '@/ai/flows/chatFlow'; // Importe le flux Genkit
import '@/ai/genkit'; // Assure que Genkit est initialisé

export async function POST(req: Request) {
  // Vérification explicite de la clé API au début de la requête.
  if (!process.env.GEMINI_API_KEY) {
    const errorMessage = "Configuration manquante sur le serveur : La variable d'environnement GEMINI_API_KEY n'est pas définie. Assurez-vous d'avoir un fichier .env.local correct et d'avoir redémarré le serveur.";
    console.error(errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }

  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Le message est vide." },
        { status: 400 }
      );
    }

    // Appelle directement le flux Genkit
    const result = await chatFlow.run({ input: message });

    return NextResponse.json({ text: result });
  } catch (error: any) {
    console.error("Erreur interne lors de l'appel à l'API de chat :", error);
    
    let detailedError = "Erreur interne du serveur.";
    if (error.message) {
      if (error.message.includes('API key not valid')) {
        detailedError = "La clé API Gemini fournie n'est pas valide. Veuillez vérifier la clé dans Google AI Studio et dans votre fichier .env.local.";
      } else if (error.message.includes('flow is not defined') || error.message.includes('is not configured')) {
        detailedError = "Le flux AI (chatFlow) n'a pas pu être initialisé, probablement à cause d'un problème de configuration de Genkit (clé API manquante ?).";
      } else {
        detailedError = error.message;
      }
    }

    return NextResponse.json(
      { error: `Erreur interne du serveur : ${detailedError}` },
      { status: 500 }
    );
  }
}