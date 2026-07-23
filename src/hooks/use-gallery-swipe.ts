'use client';

import { useCallback, useRef } from 'react';

export function useGallerySwipe(length: number, onNext: () => void, onPrevious: () => void) {
  const startX = useRef<number | null>(null);

  const onTouchStart = useCallback((event: React.TouchEvent) => {
    startX.current = event.changedTouches[0]?.clientX ?? null;
  }, []);

  const onTouchEnd = useCallback((event: React.TouchEvent) => {
    if (startX.current === null || length < 2) return;
    const endX = event.changedTouches[0]?.clientX ?? startX.current;
    const distance = endX - startX.current;
    if (Math.abs(distance) >= 45) {
      if (distance < 0) onNext();
      else onPrevious();
    }
    startX.current = null;
  }, [length, onNext, onPrevious]);

  return { onTouchStart, onTouchEnd };
}
