import { router } from '@inertiajs/react';
import * as React from 'react';

export function usePageBack(fallbackHref: string) {
  return React.useCallback(() => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
      return;
    }

    router.visit(fallbackHref);
  }, [fallbackHref]);
}
