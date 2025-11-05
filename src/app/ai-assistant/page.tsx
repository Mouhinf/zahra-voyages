"use client";
import { useState } from "react";
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Bot, AlertCircle } from 'lucide-react';

export default function AIAssistantPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendMessage = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer("");
    setError("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Erreur serveur");
      }

      setAnswer(data.text);
    } catch (error: any) {
      console.error(error);
      setError(error.message || "Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow p-4 sm:p-8 bg-secondary flex flex-col items-center">
        <Card className="w-full max-w-2xl shadow-xl">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Bot className="h-8 w-8 text-primary" />
              <CardTitle className="text-3xl font-bold text-primary">Assistant IA Zahra Voyages</CardTitle>
            </div>
            <p className="text-muted-foreground">Posez-moi toutes vos questions sur les voyages !</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Exemples de questions :
- Quelles sont les meilleures destinations pour un voyage en famille ?
- Quels documents faut-il pour un visa vers la France ?
- Quel est le prix moyen d'un billet pour Paris en juillet ?"
                className="w-full p-4 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent min-h-[120px]"
                rows={4}
              />
              
              <Button
                onClick={handleSendMessage}
                disabled={loading || !question.trim()}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Analyse en cours...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Envoyer la question
                  </>
                )}
              </Button>
            </div>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-red-800 mb-2">Erreur :</h3>
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {answer && !error && (
              <div className="mt-6 p-4 bg-background border border-border rounded-lg">
                <div className="flex items-start gap-3">
                  <Bot className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-primary mb-2">Réponse de l'assistant :</h3>
                    <p className="text-foreground whitespace-pre-wrap leading-relaxed">{answer}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="text-center text-sm text-muted-foreground mt-4">
              <p>💡 Astuce : Appuyez sur Ctrl+Entrée pour envoyer votre question rapidement</p>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}