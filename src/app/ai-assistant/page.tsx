"use client";
import { useState } from "react";
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export default function AIAssistantPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!question.trim()) return;
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question }), // Envoie 'message' au lieu de 'question'
      });

      if (!response.ok) {
        const errorData = await response.json(); // Tente de parser l'erreur comme JSON
        const errorDetail = errorData.error || `Erreur HTTP ${response.status}`;
        throw new Error(`Erreur API : ${errorDetail}`);
      }

      const data = await response.json();
      if (data.text) setAnswer(data.text); // Reçoit 'text' au lieu de 'answer'
      else setAnswer("Aucune réponse reçue du serveur.");
    } catch (error: any) {
      console.error(error);
      setAnswer(`❌ Une erreur s'est produite : ${error.message || "Vérifie la console."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow p-8 bg-gray-50 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Assistant IA ✨</h1>

        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Pose ta question ici..."
          className="w-full max-w-lg p-3 border border-gray-300 rounded-lg"
          rows={5}
        />

        <button
          onClick={handleSendMessage}
          disabled={loading}
          className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {loading ? "Envoi..." : "Envoyer"}
        </button>

        {answer && (
          <div className="mt-6 p-4 bg-white shadow-md rounded-lg w-full max-w-lg">
            <h2 className="font-semibold text-gray-700 mb-2">Réponse :</h2>
            <p className="text-gray-800 whitespace-pre-wrap">{answer}</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}