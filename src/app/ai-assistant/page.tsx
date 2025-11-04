"use client";
import { useState } from "react";
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AIAssistantPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer(""); // Efface la réponse précédente

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question }),
      });

      if (!response.ok) {
        // Clone la réponse pour pouvoir la lire plusieurs fois si nécessaire
        const errorResponse = response.clone(); 
        try {
          const errorData = await response.json(); // Tente de lire l'original comme JSON
          const errorDetail = errorData.error || `Erreur HTTP ${response.status}`;
          throw new Error(`Erreur API : ${errorDetail}`);
        } catch (jsonParseError) {
          // Si le parsing JSON échoue, lit le clone comme texte brut
          const errorText = await errorResponse.text(); 
          throw new Error(`Erreur API (non-JSON) : ${response.status} - ${errorText.substring(0, 500)}...`); // Affiche les 500 premiers caractères
        }
      }

      const data = await response.json();
      if (data.text) setAnswer(data.text);
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
      <main className="flex-grow p-8 bg-secondary flex flex-col items-center">
        <Card className="w-full max-w-lg p-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary text-center">Assistant IA ✨</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Pose ta question ici..."
              className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={5}
            />

            <Button
              onClick={handleSendMessage}
              disabled={loading || !question.trim()}
              className="w-full py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              {loading ? "Envoi..." : "Envoyer"}
            </Button>

            {answer && (
              <div className="mt-6 p-4 bg-background shadow-md rounded-lg w-full">
                <h2 className="font-semibold text-primary mb-2">Réponse :</h2>
                <p className="text-foreground whitespace-pre-wrap">{answer}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}