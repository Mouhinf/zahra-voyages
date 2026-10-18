'use client';

import * as React from 'react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { trackAnalyticsEvent } from '@/components/analytics-beacon';

const LazyQuoteRequestModal = React.lazy(() =>
  import('./quote-request-dialog').then((module) => ({
    default: module.QuoteRequestModal,
  }))
);

import { usePathname } from 'next/navigation';

type QuoteRequestButtonProps = Omit<ButtonProps, 'onClick' | 'type'> & {
  /** Service préselectionné dans le formulaire (ex. depuis une page d'offre). */
  defaultService?:
    | 'hebergement'
    | 'transport'
    | 'voyages-croisieres'
    | 'excursions'
    | 'tourisme-affaires'
    | 'reservation-express'
    | 'assistance-visa'
    | 'assurance-voyage'
    | 'preinscription-universitaire'
    | 'prise-de-rendez-vous';
  defaultDestination?: string;
  /** Traçabilité commerciale : page / contexte à l'origine de la demande. */
  source?: string;
  /** Langue d'affichage du modal ('fr' ou 'en'). Si omis, auto-détecté depuis l'URL. */
  locale?: 'fr' | 'en';
};

export function QuoteRequestButton({
  defaultService,
  defaultDestination,
  source,
  locale,
  children,
  disabled,
  ...buttonProps
}: QuoteRequestButtonProps) {
  const pathname = usePathname();
  const currentLocale = locale || (pathname?.startsWith('/en') ? 'en' : 'fr');
  const [shouldLoadDialog, setShouldLoadDialog] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const openDialog = () => {
    trackAnalyticsEvent('quote_start', { source });
    setShouldLoadDialog(true);
    setOpen(true);
  };

  return (
    <>
      <Button type="button" disabled={disabled} onClick={openDialog} {...buttonProps}>
        {children}
      </Button>
      {shouldLoadDialog ? (
        <React.Suspense fallback={null}>
          <LazyQuoteRequestModal
            open={open}
            onOpenChange={setOpen}
            defaultService={defaultService}
            defaultDestination={defaultDestination}
            source={source}
            locale={currentLocale}
          />
        </React.Suspense>
      ) : null}
    </>
  );
}

