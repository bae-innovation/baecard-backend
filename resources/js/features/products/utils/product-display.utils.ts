import type { Product } from '@/features/products/schemas/product.schema';
import { formatPrice } from '@/utils/number-formatter';

export function formatProductMoney(value: number | null | undefined) {
  if (value == null) return '—';
  return formatPrice(Number(value));
}

export function formatProductDiscount(product: Product) {
  if (!product.discount_type || product.discount_value == null) return null;
  if (product.discount_type === 'percentage') {
    return `${Number(product.discount_value)}% off`;
  }
  return `${formatProductMoney(product.discount_value)} off`;
}

export function getProductSalePrice(product: Product): number | null {
  const price = product.price != null ? Number(product.price) : null;
  if (price == null) return null;
  if (!product.discount_type || product.discount_value == null) return price;
  const discount = Number(product.discount_value);
  if (product.discount_type === 'percentage') {
    return Math.max(0, price - (price * discount) / 100);
  }
  return Math.max(0, price - discount);
}

export function formatProductDate(value: string | undefined) {
  if (!value) return '—';
  return new Date(value).toLocaleString();
}

export function stockStatusLabel(stock: number | null | undefined) {
  if (stock == null) return { label: 'Unknown', variant: 'secondary' as const };
  if (stock === 0) return { label: 'Out of stock', variant: 'destructive' as const };
  if (stock <= 10) return { label: 'Low stock', variant: 'outline' as const };
  return { label: 'In stock', variant: 'default' as const };
}
