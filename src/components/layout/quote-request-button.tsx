'use client';

import * as React from 'react';
import { Button, type ButtonProps } from '@/components/ui/button';

const LazyQuoteRequestModal = React.lazy(() =>
  import('./quote-request-dialog').then((module) => ({
    default: module.QuoteRequestModal,
  }))
);

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
};

export function QuoteRequestButton({
  defaultService,
  defaultDestination,
  source,
  children,
  disabled,
  ...buttonProps
}: QuoteRequestButtonProps) {
  const [shouldLoadDialog, setShouldLoadDialog] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const openDialog = () => {
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
          />
        </React.Suspense>
      ) : null}
    </>
  );
}
