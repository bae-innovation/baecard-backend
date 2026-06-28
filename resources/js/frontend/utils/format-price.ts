export type ProductPricing = {
  price: string | number | null;
  discount_type?: string | null;
  discount_value?: string | number | null;
};

export function getDiscountedPrice(product: ProductPricing): number | null {
  const base = product.price != null ? Number(product.price) : null;
  if (base == null) return null;

  const value = product.discount_value != null ? Number(product.discount_value) : 0;
  if (!value) return base;

  if (product.discount_type === 'percentage') {
    return Math.max(0, base - base * (value / 100));
  }

  return Math.max(0, base - value);
}

export function formatPrice(amount: number | null, symbol = '৳'): string {
  if (amount == null) return '—';
  return `${amount.toLocaleString()} ${symbol}`;
}
