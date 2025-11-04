import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message manquant" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Clé API manquante" }, { status: 500 });
    }

    // Appel direct à l’API Gemini (sans Genkit)
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" + apiKey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: message }],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json(
        { error: `Erreur API Gemini : ${errText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Récupérer la réponse textuelle
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Aucune réponse générée.";

    return NextResponse.json({ reply: text });
  } catch (error: any) {
    console.error("Erreur serveur:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}