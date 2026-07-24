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
        { role: 'assistant', content: "Désolé, je ne peux pas répondre pour le moment. Contactez-nous au +221 77 312 90 90." },
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
      {/* Boutons flottants empilés */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">
        {/* WhatsApp (au-dessus) */}
        <a
          href="https://wa.me/221773129090"
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center"
          aria-label="Contacter sur WhatsApp"
        >
          <svg role="img" aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.204-1.634a11.86 11.86 0 005.79 1.499h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
        </a>

        {/* Chatbot (en dessous) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center"
          aria-label={isOpen ? "Fermer l'assistant" : "Ouvrir l'assistant"}
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </button>
      </div>

      {/* Fenêtre de chat */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] sm:w-96 max-h-[70vh] bg-card rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* En-tête */}
          <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Bot className="h-5 w-5" />
            </div>
            <div className="flex-1">
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
