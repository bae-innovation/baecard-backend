import type { LocalizedString } from '@frontend/types/marketing-content';

export type OfferBanner = {
  id: string;
  message: LocalizedString;
  badge?: LocalizedString;
  href?: string;
  enabled?: boolean;
};

export function getActiveOfferBanners(banners: OfferBanner[]): OfferBanner[] {
  return banners.filter((banner) => banner.enabled !== false);
}
