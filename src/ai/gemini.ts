// src/ai/gemini.ts
export async function askGemini(question: string): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    console.error("❌ Clé API manquante dans .env.local");
    throw new Error("Clé API manquante");
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Tu es un assistant virtuel de Zahra Voyages. Réponds avec amabilité et clarté à cette question : "${question}"`,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur API Gemini : ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const result =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Désolé, je n'ai pas pu obtenir de réponse pour le moment.";

    return result;
  } catch (error: any) {
    console.error("Erreur Gemini :", error);
    return "Erreur lors de la communication avec l'IA.";
  }
}