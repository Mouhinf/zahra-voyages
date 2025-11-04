'use client';

import React, { useState, useRef, useEffect } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Bot, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() === '') return;

    const userMessage: Message = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Mise à jour de l'URL de l'API pour correspondre à la nouvelle structure de route Genkit
      const response = await fetch('/api/flows/chatFlow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        let errorMessageText = "Désolé, je n'ai pas pu traiter votre demande pour le moment. Veuillez réessayer.";
        try {
          const errorData = await response.json();
          if (errorData && errorData.error) {
            errorMessageText = `Erreur de l'IA : ${errorData.error}`;
          } else if (typeof errorData === 'string') { // Genkit might return a string error directly
            errorMessageText = `Erreur de l'IA : ${errorData}`;
          }
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
        }
        throw new Error(errorMessageText);
      }

      // Le flux Genkit retourne maintenant directement une chaîne de caractères
      const data: string = await response.json(); 
      const aiMessage: Message = { id: (Date.now() + 1).toString(), text: data, sender: 'ai' };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error: any) {
      console.error('Error sending message to AI:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: error.message || "Désolé, je n'ai pas pu traiter votre demande pour le moment. Veuillez réessayer.",
        sender: 'ai',
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto max-w-4xl px-4 py-8">
        <section className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Votre Assistant Voyage IA</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Posez vos questions sur les destinations, les services, les démarches de visa ou tout autre sujet lié à votre voyage.
          </p>
        </section>

        <Card className="flex flex-col h-[70vh] max-h-[800px] shadow-lg">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2 text-primary">
              <Bot className="h-6 w-6" /> Assistant Zahra Voyages
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow p-4 overflow-hidden">
            <ScrollArea className="h-full pr-4">
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="text-center text-muted-foreground py-10">
                    Bonjour ! Comment puis-je vous aider aujourd'hui ?
                  </div>
                )}
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 ${
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.sender === 'ai' && (
                      <div className="flex-shrink-0 p-2 bg-primary/10 rounded-full">
                        <Bot className="h-5 w-5 text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground'
                      }`}
                    >
                      {message.text}
                    </div>
                    {message.sender === 'user' && (
                      <div className="flex-shrink-0 p-2 bg-accent/10 rounded-full">
                        <User className="h-5 w-5 text-accent-foreground" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-start gap-3 justify-start">
                    <div className="flex-shrink-0 p-2 bg-primary/10 rounded-full">
                      <Bot className="h-5 w-5 text-primary" />
                    </div>
                    <div className="max-w-[70%] p-3 rounded-lg bg-secondary text-secondary-foreground animate-pulse">
                      Typing...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </CardContent>
          <div className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                placeholder="Posez votre question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="flex-grow"
              />
              <Button type="submit" disabled={isLoading}>
                <Send className="h-5 w-5" />
                <span className="sr-only">Envoyer</span>
              </Button>
            </form>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
}