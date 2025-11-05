import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Le message est vide." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "La clé API Gemini n'est pas configurée. Veuillez définir la variable d'environnement GEMINI_API_KEY." },
        { status: 500 }
      );
    }

    // Final attempt with the stable gemini-1.0-pro model
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Vous êtes un assistant de voyage pour Zahra Voyages, une agence de voyage basée à Dakar. Répondez de manière utile, amicale et professionnelle à cette question: ${message}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        }),
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage = responseData.error?.message || `Erreur de l'API Gemini (${response.status})`;
      throw new Error(errorMessage);
    }

    const text = responseData.candidates?.[0]?.content?.parts?.[0]?.text || "Aucune réponse reçue.";
    
    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Erreur API:", error);
    return NextResponse.json(
      { error: `Erreur de l'API Gemini: ${error.message || "Une erreur inconnue s'est produite."}` },
      { status: 500 }
    );
  }
}