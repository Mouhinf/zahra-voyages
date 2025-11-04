import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("❌ GEMINI_API_KEY non définie !");
      return NextResponse.json(
        { error: "Erreur interne du serveur : Clé API manquante" },
        { status: 500 }
      );
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Erreur API Gemini :", data);
      return NextResponse.json(
        { error: `Erreur API Gemini: ${data.error?.message || "inconnue"}` },
        { status: response.status }
      );
    }

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Aucune réponse générée.";

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Erreur interne :", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur : " + error.message },
      { status: 500 }
    );
  }
}