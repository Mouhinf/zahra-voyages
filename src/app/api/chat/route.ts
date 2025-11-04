import { askGemini } from "@/ai/gemini";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    if (!question) {
      return NextResponse.json({ error: "La question est requise." }, { status: 400 });
    }

    const answer = await askGemini(question);

    return NextResponse.json({ answer });
  } catch (error: any) {
    console.error("Erreur serveur :", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur : " + error.message },
      { status: 500 }
    );
  }
}