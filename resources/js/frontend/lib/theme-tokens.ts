/** Marketing site design tokens — use via CSS variables on `.frontend-site` */
export const FE_THEME = {
  accent: '#66FCF1',
  accentRgb: '102 252 241',
  promo: '#e53e3e',
  dark: {
    bg: '#080814',
    surface: '#0f0f1a',
    text: '#ffffff',
    muted: 'rgba(255,255,255,0.6)',
    border: 'rgba(255,255,255,0.1)',
  },
  light: {
    bg: '#f8fafc',
    surface: '#ffffff',
    text: '#0f172a',
    muted: 'rgba(15,23,42,0.65)',
    border: 'rgba(15,23,42,0.1)',
  },
} as const;
