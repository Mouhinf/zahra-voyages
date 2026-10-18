'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { getAlternatePath } from '@/i18n/routes';

interface LanguageSwitcherProps {
  className?: string;
  size?: 'sm' | 'default';
}

export function LanguageSwitcher({ className, size = 'default' }: LanguageSwitcherProps) {
  const pathname = usePathname() || '/';
  const isEn = pathname === '/en' || pathname.startsWith('/en/');

  const frHref = getAlternatePath(pathname, 'fr');
  const enHref = getAlternatePath(pathname, 'en');

  const paddingClass = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <nav
      aria-label="Sélecteur de langue / Language selector"
      className={cn(
        'inline-flex items-center font-semibold rounded-lg border border-slate-200/90 p-0.5 bg-slate-50/90 shadow-2xs',
        className
      )}
    >
      <Link
        href={frHref}
        hrefLang="fr"
        lang="fr"
        aria-current={!isEn ? 'page' : undefined}
        className={cn(
          'rounded transition-all duration-150',
          paddingClass,
          !isEn
            ? 'bg-white text-slaac-navy-900 shadow-xs font-bold border border-slate-200/60'
            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
        )}
        title="Consulter le site en français"
        aria-label="Version française"
      >
        FR
      </Link>
      <span className="text-slate-300 px-0.5 select-none" aria-hidden="true">
        |
      </span>
      <Link
        href={enHref}
        hrefLang="en"
        lang="en"
        aria-current={isEn ? 'page' : undefined}
        className={cn(
          'rounded transition-all duration-150',
          paddingClass,
          isEn
            ? 'bg-white text-slaac-navy-900 shadow-xs font-bold border border-slate-200/60'
            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
        )}
        title="View website in English"
        aria-label="English version"
      >
        EN
      </Link>
    </nav>
  );
}

export default LanguageSwitcher;
