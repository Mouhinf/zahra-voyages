import { NextResponse } from "next/server";
import { chatFlow } from '@/ai/flows/chatFlow'; // Importe le flux Genkit
import '@/ai/genkit'; // Assure que Genkit est initialisé

export async function POST(req: Request) {
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
    console.error("Erreur interne :", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur : " + error.message },
      { status: 500 }
    );
  }
}