"use client";
import { useState } from "react";
import Header from '@/components/layout/header'; // Garder l'import pour le layout global
import Footer from '@/components/layout/footer'; // Garder l'import pour le layout global

export default function AIAssistantPage() { // Renommé en AIAssistantPage pour correspondre au fichier
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        const text = await response.text();
        // Amélioration de la gestion d'erreur pour inclure le texte de la réponse si disponible
        const errorDetail = text.startsWith('<!DOCTYPE') ? 'La route API ne renvoie pas de JSON (page HTML reçue).' : text;
        throw new Error(`Erreur HTTP ${response.status} : ${errorDetail}`);
      }

      const data = await response.json();
      if (data.reply) setReply(data.reply);
      else setReply("Aucune réponse reçue du serveur.");
    } catch (error: any) {
      console.error(error);
      setReply(`❌ Une erreur s'est produite : ${error.message || "Vérifie la console."}`);
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
          value={message}
          onChange={(e) => setMessage(e.target.value)}
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

        {reply && (
          <div className="mt-6 p-4 bg-white shadow-md rounded-lg w-full max-w-lg">
            <h2 className="font-semibold text-gray-700 mb-2">Réponse :</h2>
            <p className="text-gray-800 whitespace-pre-wrap">{reply}</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}