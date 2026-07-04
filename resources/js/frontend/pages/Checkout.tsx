import { Link } from '@inertiajs/react';
import { ShoppingBag } from 'lucide-react';

import { CheckoutForm } from '@frontend/components/actions/checkout-form';
import { FrontendLayout } from '@frontend/layouts/FrontendLayout';
import { useMarketingContent } from '@frontend/providers/marketing-content-provider';
import type { MarketingContent } from '@frontend/types/marketing-content';
import type { MarketingProduct } from '@frontend/types/marketing';
import { formatPrice, getDiscountedPrice } from '@frontend/utils/format-price';
import { useAppSettings } from '@/hooks/useAppSettings';

type CheckoutPageProps = {
  product: MarketingProduct;
  marketing?: MarketingContent | null;
};

function CheckoutPageContent({ product }: { product: MarketingProduct }) {
  const { translate } = useMarketingContent();
  const { currency_symbol } = useAppSettings();
  const discounted = getDiscountedPrice(product);
  const hasDiscount =
    discounted != null && product.price != null && discounted < Number(product.price);

  return (
    <>
      <section className="border-b border-fe-border bg-fe-surface/50 py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-6">
          <nav
            className="mb-3 flex flex-wrap items-center gap-1 text-xs text-fe-muted sm:text-sm"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-fe-accent">
              {translate({ en: 'Home', bn: 'হোম' })}
            </Link>
            <span aria-hidden>/</span>
            <Link href="/products" className="hover:text-fe-accent">
              {translate({ en: 'Products', bn: 'পণ্য' })}
            </Link>
            <span aria-hidden>/</span>
            <span className="text-fe-text">{product.name}</span>
          </nav>
          <div className="flex items-start gap-3">
            <ShoppingBag className="mt-1 size-8 shrink-0 text-fe-accent sm:size-10" aria-hidden />
            <div>
              <h1 className="text-balance text-2xl font-bold tracking-tight text-fe-text sm:text-3xl md:text-4xl">
                {translate({ en: 'Checkout', bn: 'চেকআউট' })}
              </h1>
              <p className="mt-2 max-w-2xl text-pretty text-base leading-relaxed text-fe-muted sm:text-lg">
                {translate({
                  en: 'Review your item and complete your order details below.',
                  bn: 'আপনার পণ্য দেখুন এবং নিচে অর্ডারের তথ্য দিন।',
                })}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-5 lg:grid-cols-2 lg:gap-12">
          <div className="rounded-2xl border border-fe-border bg-fe-surface p-6 sm:p-8">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="mb-6 aspect-square w-full rounded-xl object-cover"
              />
            ) : (
              <div className="mb-6 aspect-square w-full rounded-xl bg-fe-border/30" />
            )}
            <h2 className="text-xl font-bold text-fe-text sm:text-2xl">{product.name}</h2>
            {product.short_description ? (
              <p className="mt-2 text-sm text-fe-muted">{product.short_description}</p>
            ) : null}
            {product.description ? (
              <p className="mt-4 text-sm leading-relaxed text-fe-muted">{product.description}</p>
            ) : null}
            <div className="mt-6 border-t border-fe-border pt-4">
              {hasDiscount ? (
                <div className="flex items-baseline gap-3">
                  <p className="text-sm text-red-400 line-through">
                    {formatPrice(Number(product.price), currency_symbol)}
                  </p>
                  <p className="text-2xl font-bold text-fe-accent">
                    {formatPrice(discounted, currency_symbol)}
                  </p>
                </div>
              ) : (
                <p className="text-2xl font-bold text-fe-text">
                  {formatPrice(Number(product.price), currency_symbol)}
                </p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-fe-border bg-fe-surface p-6 sm:p-8">
            <h3 className="mb-6 text-lg font-semibold text-fe-text">
              {translate({ en: 'Your details', bn: 'আপনার তথ্য' })}
            </h3>
            <CheckoutForm product={product} />
          </div>
        </div>
      </section>
    </>
  );
}

export default function Checkout({ product, marketing }: CheckoutPageProps) {
  return (
    <FrontendLayout
      marketing={marketing}
      title={`Checkout — ${product.name}`}
      showContactBlock={false}
    >
      <CheckoutPageContent product={product} />
    </FrontendLayout>
  );
}
