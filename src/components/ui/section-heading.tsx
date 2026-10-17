import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  surtitle?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeading({
  surtitle,
  title,
  description,
  align = 'center',
  className,
}: SectionHeadingProps) {
  const isCenter = align === 'center';

  return (
    <div className={cn(isCenter ? 'text-center' : 'text-left', 'mb-10 sm:mb-14', className)}>
      {surtitle && (
        <span className="inline-block text-xs sm:text-sm font-semibold uppercase tracking-widest text-slaac-gold-600 mb-2">
          {surtitle}
        </span>
      )}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 font-headline tracking-tight">
        {title}
      </h2>
      <div
        className={cn(
          'w-16 h-0.5 bg-slaac-gold-500 my-4',
          isCenter ? 'mx-auto' : 'mr-auto'
        )}
      />
      {description && (
        <p className={cn(
          'text-base sm:text-lg text-slate-600 leading-relaxed text-balance',
          isCenter ? 'max-w-2xl mx-auto' : 'max-w-2xl'
        )}>
          {description}
        </p>
      )}
    </div>
  );
}
