import type { LocalizedString } from '@frontend/types/marketing-content';

export type OfferTickerTheme = 'coral' | 'emerald' | 'violet' | 'amber' | 'sky';

export type OfferBanner = {
  id: string;
  message: LocalizedString;
  badge?: LocalizedString;
  href?: string;
  enabled?: boolean;
  theme?: OfferTickerTheme;
};

export function getActiveOfferBanners(banners: OfferBanner[]): OfferBanner[] {
  return banners.filter((banner) => banner.enabled !== false);
}

export const OFFER_TICKER_THEME_GRADIENTS: Record<OfferTickerTheme, string> = {
  coral: 'linear-gradient(90deg, #e53e3e 0%, #dc2626 45%, #f97316 100%)',
  emerald: 'linear-gradient(90deg, #059669 0%, #10b981 45%, #14b8a6 100%)',
  violet: 'linear-gradient(90deg, #7c3aed 0%, #8b5cf6 45%, #a855f7 100%)',
  amber: 'linear-gradient(90deg, #d97706 0%, #f59e0b 45%, #eab308 100%)',
  sky: 'linear-gradient(90deg, #0284c7 0%, #0ea5e9 45%, #38bdf8 100%)',
};

export function resolveOfferTheme(theme?: OfferTickerTheme): OfferTickerTheme {
  if (theme && theme in OFFER_TICKER_THEME_GRADIENTS) {
    return theme;
  }

  return 'coral';
}
