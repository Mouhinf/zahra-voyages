import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // 🔧 Étape 1 : Mets ta clé API ici directement
    const apiKey =
      process.env.GEMINI_API_KEY ||
      "AIzaSyA7YoSJKviUpzbgm9j2tiRUXprxjx0KoIg"; // REMPLACEZ CECI PAR VOTRE VRAIE CLÉ API

    // Vérification
    if (!apiKey || apiKey.includes("REMPLACE")) {
      console.error("❌ Clé API Gemini manquante ou non remplacée !");
      return NextResponse.json(
        { error: "Erreur interne du serveur : Clé API manquante ou non remplacée dans le code." },
        { status: 500 }
      );
    }

    // 🔧 Étape 2 : Appel à l’API Gemini
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }],
        }),
      }
    );

    // 🔧 Étape 3 : Lecture du résultat
    const data = await response.json();

    if (!response.ok) {
      console.error("Erreur API Gemini :", data);
      return NextResponse.json(
        { error: data.error?.message || "Erreur API inconnue" },
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