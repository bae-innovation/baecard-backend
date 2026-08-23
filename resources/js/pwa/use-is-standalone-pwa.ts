import * as React from 'react';

import { isStandaloneDisplayMode, markStandaloneDocument } from '@/pwa/is-standalone';

const DISPLAY_MODES = ['standalone', 'fullscreen', 'minimal-ui', 'window-controls-overlay'];

/**
 * Reactive standalone detection for layout switching after PWA install.
 */
export function useIsStandalonePwa(): boolean {
  const [standalone, setStandalone] = React.useState(() => isStandaloneDisplayMode());

  React.useEffect(() => {
    markStandaloneDocument();
    setStandalone(isStandaloneDisplayMode());

    const mediaQueries = DISPLAY_MODES.map((mode) => window.matchMedia(`(display-mode: ${mode})`));

    const onChange = () => {
      markStandaloneDocument();
      setStandalone(isStandaloneDisplayMode());
    };

    for (const query of mediaQueries) {
      query.addEventListener('change', onChange);
    }

    return () => {
      for (const query of mediaQueries) {
        query.removeEventListener('change', onChange);
      }
    };
  }, []);

  return standalone;
}
