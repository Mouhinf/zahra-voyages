'use client';

import { useState, useRef, useEffect, FormEvent, ReactNode } from 'react';
import { MessageCircle, X, Send, Loader2, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Message = { role: 'user' | 'assistant'; content: string };

function renderMarkdown(text: string): ReactNode[] {
  const lines = text.split('\n');
  const nodes: ReactNode[] = [];
  let listItems: { type: 'ul' | 'ol'; items: ReactNode[] } | null = null;

  function flushList() {
    if (listItems && listItems.items.length > 0) {
      const Tag = listItems.type === 'ol' ? 'ol' : 'ul';
      nodes.push(
        <Tag key={`list-${nodes.length}`} className={cn('space-y-1 my-1', listItems.type === 'ol' ? 'list-decimal list-inside' : 'list-disc list-inside ml-1')}>
          {listItems.items}
        </Tag>
      );
    }
    listItems = null;
  }

  function parseInline(text: string): ReactNode[] {
    const parts: ReactNode[] = [];
    let remaining = text;
    let key = 0;
    const boldRegex = /\*\*(.+?)\*\*/;
    while (remaining.length > 0) {
      const match = remaining.match(boldRegex);
      if (match && match.index !== undefined) {
        if (match.index > 0) parts.push(remaining.slice(0, match.index));
        parts.push(<strong key={key++} className="font-semibold text-primary">{match[1]}</strong>);
        remaining = remaining.slice(match.index + match[0].length);
      } else {
        parts.push(remaining);
        break;
      }
    }
    return parts;
  }

  lines.forEach((line, idx) => {
    const orderedMatch = line.match(/^(\d+)\.\s+(.*)/);
    const unorderedMatch = line.match(/^[-•]\s+(.*)/);

    if (orderedMatch) {
      if (!listItems || listItems.type !== 'ol') {
        flushList();
        listItems = { type: 'ol', items: [] };
      }
      listItems!.items.push(<li key={`li-${idx}`}>{parseInline(orderedMatch[2])}</li>);
    } else if (unorderedMatch) {
      if (!listItems || listItems.type !== 'ul') {
        flushList();
        listItems = { type: 'ul', items: [] };
      }
      listItems!.items.push(<li key={`li-${idx}`}>{parseInline(unorderedMatch[1])}</li>);
    } else if (line.trim() === '') {
      flushList();
    } else {
      flushList();
      nodes.push(<p key={`p-${idx}`} className="leading-relaxed">{parseInline(line)}</p>);
    }
  });
  flushList();

  return nodes;
}

const SUGGESTIONS = [
  'Quels services proposez-vous ?',
  'Comment réserver une excursion ?',
  'Organisez-vous des séminaires ?',
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: "Bonjour 👋 Je suis l'assistant virtuel de SLAAC Voyages. Comment puis-je vous aider aujourd'hui ?",
        },
      ]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = { role: 'user', content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      const reply = data.reply || data.error || "Désolé, une erreur est survenue.";

      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: "Désolé, je ne peux pas répondre pour le moment. Contactez-nous au +221 77 539 63 25." },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSuggestion(text: string) {
    setInput(text);
    if (scrollAreaRef.current) {
      const textarea = scrollAreaRef.current.querySelector('textarea');
      textarea?.focus();
    }
  }

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center"
        aria-label={isOpen ? "Fermer l'assistant" : "Ouvrir l'assistant"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Fenêtre de chat */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] sm:w-96 max-h-[70vh] bg-card rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* En-tête */}
          <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">Assistant SLAAC Voyages</p>
              <p className="text-xs text-primary-foreground/80">En ligne · Répond en quelques secondes</p>
            </div>
          </div>

          {/* Zone messages */}
          <div ref={scrollAreaRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/30">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={cn(
                  'flex gap-2 max-w-[85%]',
                  msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
                )}
              >
                <div
                  className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center shrink-0',
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-primary/15 text-primary'
                  )}
                >
                  {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div
                  className={cn(
                    'rounded-2xl px-3 py-2 text-sm space-y-1',
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-sm'
                      : 'bg-card border rounded-tl-sm'
                  )}
                >
                  {msg.role === 'assistant' ? renderMarkdown(msg.content) : msg.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-card border rounded-2xl rounded-tl-sm px-3 py-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions rapides (visible si peu de messages) */}
          {messages.length <= 1 && !isLoading && (
            <div className="px-3 pb-2 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSuggestion(s)}
                  className="text-xs px-3 py-1.5 rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="p-3 border-t bg-card flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Posez votre question..."
              disabled={isLoading}
              className="flex-1 rounded-full bg-background border border-input px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !input.trim()}
              className="rounded-full shrink-0"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
