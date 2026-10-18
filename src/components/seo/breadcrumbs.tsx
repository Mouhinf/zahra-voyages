import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { getBreadcrumbSchema } from '@/lib/seo-schema';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  const allItems = [{ label: 'Accueil', href: '/' }, ...items];

  const schemaItems = allItems.map((item) => ({
    name: item.label,
    url: item.href || '',
  }));

  const jsonLd = getBreadcrumbSchema(schemaItems);

  return (
    <nav
      aria-label="Fil d'Ariane"
      className={`flex items-center text-xs sm:text-sm text-slate-500 py-3 ${className}`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ol className="flex items-center flex-wrap gap-1.5 sm:gap-2">
        {allItems.map((item, idx) => {
          const isLast = idx === allItems.length - 1;
          const isFirst = idx === 0;

          return (
            <li key={idx} className="flex items-center gap-1.5 sm:gap-2">
              {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />}
              {isLast || !item.href ? (
                <span className="font-medium text-slate-900 truncate max-w-[200px] sm:max-w-xs" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-slaac-gold-600 transition-colors inline-flex items-center gap-1"
                >
                  {isFirst && <Home className="w-3.5 h-3.5" aria-hidden="true" />}
                  <span>{item.label}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
