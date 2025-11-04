import { NextResponse } from "next/server";
import { chatFlow } from '@/ai/flows/chatFlow'; // Importe le flux Genkit
import '@/ai/genkit'; // Assure que Genkit est initialisé
import { isGenkitConfigured } from '@/ai/genkit'; // Importe le statut

export async function POST(req: Request) {
  // Vérification principale : Genkit a-t-il été configuré avec succès ?
  if (!isGenkitConfigured) {
    const errorMessage = "Le serveur AI n'est pas configuré. Cause probable : la variable d'environnement GEMINI_API_KEY est manquante ou incorrecte. Veuillez vérifier votre fichier .env.local et redémarrer le serveur.";
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