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

    // Using the stable gemini-pro model
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
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

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Erreur de l'API Gemini (${response.status}): ${response.statusText}`;
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.error && errorData.error.message) {
          errorMessage = `Erreur de l'API Gemini: ${errorData.error.message}`;
        }
      } catch (e) {
        // The error response was not JSON, use the raw text
        errorMessage = `Erreur de l'API Gemini (${response.status}): ${errorText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Aucune réponse reçue.";
    
    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Erreur API:", error);
    return NextResponse.json(
      { error: `${error.message || "Une erreur inconnue s'est produite."}` },
      { status: 500 }
    );
  }
}