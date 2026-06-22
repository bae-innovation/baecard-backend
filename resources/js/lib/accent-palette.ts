export type AccentPaletteId =
  | 'blue'
  | 'purple'
  | 'emerald'
  | 'rose'
  | 'amber'
  | 'orange';

export type AccentPalette = {
  id: AccentPaletteId;
  name: string;
  swatch: string;
  light: {
    primary: string;
    primaryForeground: string;
    ring: string;
    sidebarPrimary: string;
    sidebarRing: string;
    selection: string;
  };
  dark: {
    primary: string;
    primaryForeground: string;
    ring: string;
    sidebarPrimary: string;
    sidebarRing: string;
    selection: string;
  };
};

export const ACCENT_PALETTE_STORAGE_KEY = 'baecard-accent-palette';

export const ACCENT_PALETTES: AccentPalette[] = [
  {
    id: 'blue',
    name: 'Ocean Blue',
    swatch: '#2563eb',
    light: {
      primary: '221 83% 53%',
      primaryForeground: '0 0% 100%',
      ring: '221 83% 53%',
      sidebarPrimary: '221 83% 53%',
      sidebarRing: '221 83% 53%',
      selection: '221 83% 53%',
    },
    dark: {
      primary: '217 91% 60%',
      primaryForeground: '0 0% 100%',
      ring: '217 91% 60%',
      sidebarPrimary: '217 91% 60%',
      sidebarRing: '217 91% 60%',
      selection: '217 91% 65%',
    },
  },
  {
    id: 'purple',
    name: 'Royal Purple',
    swatch: '#7c3aed',
    light: {
      primary: '262 83% 58%',
      primaryForeground: '0 0% 100%',
      ring: '262 83% 58%',
      sidebarPrimary: '262 83% 58%',
      sidebarRing: '262 83% 58%',
      selection: '262 83% 58%',
    },
    dark: {
      primary: '263 70% 65%',
      primaryForeground: '0 0% 100%',
      ring: '263 70% 65%',
      sidebarPrimary: '263 70% 65%',
      sidebarRing: '263 70% 65%',
      selection: '263 70% 65%',
    },
  },
  {
    id: 'emerald',
    name: 'Emerald',
    swatch: '#059669',
    light: {
      primary: '160 84% 39%',
      primaryForeground: '0 0% 100%',
      ring: '160 84% 39%',
      sidebarPrimary: '160 84% 39%',
      sidebarRing: '160 84% 39%',
      selection: '160 84% 39%',
    },
    dark: {
      primary: '158 64% 52%',
      primaryForeground: '0 0% 100%',
      ring: '158 64% 52%',
      sidebarPrimary: '158 64% 52%',
      sidebarRing: '158 64% 52%',
      selection: '158 64% 52%',
    },
  },
  {
    id: 'rose',
    name: 'Rose',
    swatch: '#e11d48',
    light: {
      primary: '346 77% 50%',
      primaryForeground: '0 0% 100%',
      ring: '346 77% 50%',
      sidebarPrimary: '346 77% 50%',
      sidebarRing: '346 77% 50%',
      selection: '346 77% 50%',
    },
    dark: {
      primary: '350 89% 60%',
      primaryForeground: '0 0% 100%',
      ring: '350 89% 60%',
      sidebarPrimary: '350 89% 60%',
      sidebarRing: '350 89% 60%',
      selection: '350 89% 60%',
    },
  },
  {
    id: 'amber',
    name: 'Amber',
    swatch: '#d97706',
    light: {
      primary: '32 95% 44%',
      primaryForeground: '0 0% 100%',
      ring: '32 95% 44%',
      sidebarPrimary: '32 95% 44%',
      sidebarRing: '32 95% 44%',
      selection: '32 95% 44%',
    },
    dark: {
      primary: '38 92% 50%',
      primaryForeground: '0 0% 9%',
      ring: '38 92% 50%',
      sidebarPrimary: '38 92% 50%',
      sidebarRing: '38 92% 50%',
      selection: '38 92% 50%',
    },
  },
  {
    id: 'orange',
    name: 'Sunset Orange',
    swatch: '#ea580c',
    light: {
      primary: '21 90% 48%',
      primaryForeground: '0 0% 100%',
      ring: '21 90% 48%',
      sidebarPrimary: '21 90% 48%',
      sidebarRing: '21 90% 48%',
      selection: '21 90% 48%',
    },
    dark: {
      primary: '24 95% 53%',
      primaryForeground: '0 0% 100%',
      ring: '24 95% 53%',
      sidebarPrimary: '24 95% 53%',
      sidebarRing: '24 95% 53%',
      selection: '24 95% 53%',
    },
  },
];

export const DEFAULT_ACCENT_PALETTE_ID: AccentPaletteId = 'blue';

export function getAccentPalette(id: AccentPaletteId): AccentPalette {
  return ACCENT_PALETTES.find((palette) => palette.id === id) ?? ACCENT_PALETTES[0];
}

export function readStoredAccentPalette(): AccentPaletteId {
  if (typeof window === 'undefined') {
    return DEFAULT_ACCENT_PALETTE_ID;
  }

  const stored = window.localStorage.getItem(ACCENT_PALETTE_STORAGE_KEY);

  if (stored && ACCENT_PALETTES.some((palette) => palette.id === stored)) {
    return stored as AccentPaletteId;
  }

  return DEFAULT_ACCENT_PALETTE_ID;
}

export function storeAccentPalette(id: AccentPaletteId): void {
  window.localStorage.setItem(ACCENT_PALETTE_STORAGE_KEY, id);
}

function deriveAccentTokens(primary: string, isDark: boolean) {
  const [hue, saturation, lightness] = primary.split(' ');
  const hueValue = hue ?? '221';
  const satValue = saturation ?? '83%';
  const lightValue = parseFloat(lightness ?? '53');

  if (isDark) {
    return {
      accent: `${hueValue} ${satValue} 18%`,
      accentForeground: `${hueValue} ${satValue} 92%`,
      sidebarAccent: `${hueValue} ${satValue} 16%`,
    };
  }

  return {
    accent: `${hueValue} ${satValue} 94%`,
    accentForeground: `${hueValue} ${satValue} ${Math.max(lightValue - 10, 30)}%`,
    sidebarAccent: `${hueValue} ${satValue} 96%`,
  };
}

export function applyAccentPalette(id: AccentPaletteId, isDark: boolean): void {
  const palette = getAccentPalette(id);
  const tokens = isDark ? palette.dark : palette.light;
  const accentTokens = deriveAccentTokens(tokens.primary, isDark);
  const root = document.documentElement;

  root.style.setProperty('--primary', tokens.primary);
  root.style.setProperty('--primary-foreground', tokens.primaryForeground);
  root.style.setProperty('--ring', tokens.ring);
  root.style.setProperty('--sidebar-primary', tokens.sidebarPrimary);
  root.style.setProperty('--sidebar-ring', tokens.sidebarRing);
  root.style.setProperty('--selection', tokens.selection);
  root.style.setProperty('--accent', accentTokens.accent);
  root.style.setProperty('--accent-foreground', accentTokens.accentForeground);
  root.style.setProperty('--sidebar-accent', accentTokens.sidebarAccent);
}
