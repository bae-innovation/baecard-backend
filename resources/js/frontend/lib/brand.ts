export const brand = {
  bg: '#080814',
  accent: '#66FCF1',
  muted: 'rgb(180 180 180)',
  card: 'rgb(255 255 255 / 0.1)',
} as const;

export const frontendAsset = (path: string) => `/frontend/${path.replace(/^\//, '')}`;
