'use client';

import * as React from 'react';
import { Button, type ButtonProps } from '@/components/ui/button';

const LazyQuoteRequestModal = React.lazy(() =>
  import('./quote-request-dialog').then((module) => ({
    default: module.QuoteRequestModal,
  }))
);

type QuoteRequestButtonProps = Omit<ButtonProps, 'onClick' | 'type'> & {
  defaultDestination?: string;
  /** Traçabilité commerciale : page / contexte à l'origine de la demande. */
  source?: string;
};

export function QuoteRequestButton({
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
            defaultDestination={defaultDestination}
            source={source}
          />
        </React.Suspense>
      ) : null}
    </>
  );
}
