import Link from 'next/link';
import { Sparkles } from 'lucide-react';

// Bandeau événementiel temporaire : disparaît automatiquement après le
// 16 novembre 2026 (retour à la paix des caches incluse — composant serveur,
// pas de JS client). La page /dakar-2026, elle, reste en ligne et sera
// réorientée vers le tourisme au Sénégal toute l'année.

const EVENT_END = new Date('2026-11-16T00:00:00Z');

export default function EventBanner() {
  if (Date.now() >= EVENT_END.getTime()) return null;
  return (
    <div className="bg-accent text-accent-foreground">
      <div className="container mx-auto max-w-7xl px-4 py-2 text-center text-sm font-medium">
        <Link href="/dakar-2026" className="inline-flex items-center gap-2 hover:underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          Dakar 2026 : préparez transferts AIBD, hébergements et excursions
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
