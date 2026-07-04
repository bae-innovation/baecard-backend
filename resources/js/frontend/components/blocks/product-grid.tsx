import { Link } from '@inertiajs/react';
import * as React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import { MarketingButton } from '@frontend/components/ui/marketing-button';
import { MarketingCard } from '@frontend/components/ui/marketing-card';
import { StaggerContainer, StaggerItem } from '@frontend/components/ui/motion-section';
import { SectionHeading } from '@frontend/components/ui/section-heading';
import { useMarketingContent } from '@frontend/providers/marketing-content-provider';
import type { MarketingProduct } from '@frontend/types/marketing';
import { productCheckoutUrl } from '@frontend/utils/product-checkout-url';
import { formatPrice, getDiscountedPrice } from '@frontend/utils/format-price';
import { useAppSettings } from '@/hooks/useAppSettings';

import { SectionShell } from './section-shell';

type ProductGridProps = {
  products: MarketingProduct[];
  limit?: number;
  showViewAll?: boolean;
  id?: string;
};

function ProductCard({
  product,
  currency_symbol,
  translate,
}: {
  product: MarketingProduct;
  currency_symbol: string;
  translate: (v: { en: string; bn: string }) => string;
}) {
  const discounted = getDiscountedPrice(product);
  const hasDiscount =
    discounted != null && product.price != null && discounted < Number(product.price);

  return (
    <MarketingCard glow className="flex h-full flex-col">
      {hasDiscount ? (
        <span className="mb-2 w-fit rounded-full bg-fe-promo px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
          Sale
        </span>
      ) : null}
      {product.image_url ? (
        <img
          src={product.image_url}
          alt={product.name}
          className="mb-4 aspect-square w-full rounded-xl object-cover"
          loading="lazy"
        />
      ) : (
        <div className="mb-4 aspect-square w-full rounded-xl bg-fe-border/30" />
      )}
      <div className="mb-2 text-center">
        {hasDiscount ? (
          <>
            <p className="text-sm text-red-400 line-through">
              {formatPrice(Number(product.price), currency_symbol)}
            </p>
            <p className="text-lg font-semibold text-fe-text">
              {formatPrice(discounted, currency_symbol)}
            </p>
          </>
        ) : (
          <p className="text-lg font-semibold text-fe-text">
            {formatPrice(Number(product.price), currency_symbol)}
          </p>
        )}
      </div>
      <Accordion type="single" collapsible className="mb-4">
        <AccordionItem value="details" className="border-fe-border">
          <AccordionTrigger className="fe-touch py-3 text-fe-text hover:text-fe-accent">
            {product.name}
          </AccordionTrigger>
          <AccordionContent className="text-center text-sm leading-relaxed text-fe-muted">
            {product.description ?? translate({ en: 'No description.', bn: 'বিবরণ নেই।' })}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Link href={productCheckoutUrl(product)} className="mt-auto">
        <MarketingButton className="w-full">
          {translate({ en: 'Order Now', bn: 'অর্ডার করুন' })}
        </MarketingButton>
      </Link>
    </MarketingCard>
  );
}

export function ProductGrid({
  products,
  limit,
  showViewAll,
  id = 'products',
}: ProductGridProps) {
  const { currency_symbol } = useAppSettings();
  const { content, translate } = useMarketingContent();

  const visible = limit ? products.slice(0, limit) : products;

  if (visible.length === 0) {
    return (
      <SectionShell id={id}>
        <SectionHeading
          title={translate(content.sectionHeadings.catalog.title)}
          subtitle={translate(content.sectionHeadings.catalog.subtitle)}
        />
        <p className="text-center text-fe-muted">
          {translate({ en: 'Products coming soon.', bn: 'শীঘ্রই পণ্য আসছে।' })}
        </p>
      </SectionShell>
    );
  }

  return (
    <SectionShell id={id}>
      <SectionHeading
        title={translate(content.sectionHeadings.catalog.title)}
        subtitle={translate(content.sectionHeadings.catalog.subtitle)}
      />

      <div className="fe-snap-x-mandatory fe-scrollbar-hide -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:hidden">
        {visible.map((product) => (
          <div key={product.id} className="fe-snap-center w-[85vw] max-w-sm shrink-0">
            <ProductCard
              product={product}
              currency_symbol={currency_symbol}
              translate={translate}
            />
          </div>
        ))}
      </div>

      <StaggerContainer className="hidden gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-4">
        {visible.map((product) => (
          <StaggerItem key={product.id}>
            <ProductCard
              product={product}
              currency_symbol={currency_symbol}
              translate={translate}
            />
          </StaggerItem>
        ))}
      </StaggerContainer>

      {showViewAll ? (
        <div className="mt-8 text-center sm:mt-10">
          <Link href="/products">
            <MarketingButton variant="outline" className="w-full max-w-xs sm:w-auto">
              {translate({ en: 'View all products', bn: 'সব পণ্য দেখুন' })}
            </MarketingButton>
          </Link>
        </div>
      ) : null}
    </SectionShell>
  );
}
