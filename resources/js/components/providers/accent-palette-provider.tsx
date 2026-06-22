import { useTheme } from 'next-themes';
import * as React from 'react';

import {
  applyAccentPalette,
  DEFAULT_ACCENT_PALETTE_ID,
  readStoredAccentPalette,
  storeAccentPalette,
  type AccentPaletteId,
} from '@/lib/accent-palette';

type AccentPaletteContextValue = {
  paletteId: AccentPaletteId;
  setPaletteId: (id: AccentPaletteId) => void;
  mounted: boolean;
};

const AccentPaletteContext = React.createContext<AccentPaletteContextValue | null>(null);

export function AccentPaletteProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [paletteId, setPaletteIdState] = React.useState<AccentPaletteId>(DEFAULT_ACCENT_PALETTE_ID);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setPaletteIdState(readStoredAccentPalette());
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted) {
      return;
    }

    const isDark =
      resolvedTheme === 'dark' ||
      (resolvedTheme === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);

    applyAccentPalette(paletteId, isDark);
  }, [paletteId, resolvedTheme, mounted]);

  const setPaletteId = React.useCallback((id: AccentPaletteId) => {
    storeAccentPalette(id);
    setPaletteIdState(id);
  }, []);

  return (
    <AccentPaletteContext.Provider value={{ paletteId, setPaletteId, mounted }}>
      {children}
    </AccentPaletteContext.Provider>
  );
}

export function useAccentPalette() {
  const context = React.useContext(AccentPaletteContext);

  if (!context) {
    throw new Error('useAccentPalette must be used within AccentPaletteProvider');
  }

  return context;
}
