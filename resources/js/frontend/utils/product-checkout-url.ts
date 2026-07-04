import type { MarketingProduct } from '@frontend/types/marketing';

export function productCheckoutUrl(product: MarketingProduct): string {
  const slug = product.slug?.trim();

  if (!slug) {
    throw new Error(`Product "${product.name}" is missing a slug for checkout.`);
  }

  return `/products/${slug}/order`;
}
