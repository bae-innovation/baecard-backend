import { Link } from '@inertiajs/react';
import * as React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import { useActionHub } from '@frontend/hooks/use-action-hub';
import { OrderForm } from '@frontend/components/actions/order-form';
import { MarketingButton } from '@frontend/components/ui/marketing-button';
import { MarketingCard } from '@frontend/components/ui/marketing-card';
import { StaggerContainer, StaggerItem } from '@frontend/components/ui/motion-section';
import { SectionHeading } from '@frontend/components/ui/section-heading';
import { useMarketingContent } from '@frontend/providers/marketing-content-provider';
import type { MarketingProduct } from '@frontend/types/marketing';
import { formatPrice, getDiscountedPrice } from '@frontend/utils/format-price';
import { useAppSettings } from '@/hooks/useAppSettings';

import { SectionShell } from './section-shell';

type ProductGridProps = {
  products: MarketingProduct[];
  limit?: number;
  showViewAll?: boolean;
  id?: string;
  orderMode?: 'hub' | 'inline';
};

function ProductCard({
  product,
  currency_symbol,
  onOrder,
  translate,
  orderMode,
  isOrderOpen,
}: {
  product: MarketingProduct;
  currency_symbol: string;
  onOrder: () => void;
  translate: (v: { en: string; bn: string }) => string;
  orderMode: 'hub' | 'inline';
  isOrderOpen: boolean;
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
      <MarketingButton className="mt-auto w-full" onClick={onOrder}>
        {translate({
          en: isOrderOpen ? 'Close' : 'Order Now',
          bn: isOrderOpen ? 'বন্ধ করুন' : 'অর্ডার করুন',
        })}
      </MarketingButton>
      {orderMode === 'inline' && isOrderOpen ? (
        <div className="mt-4 rounded-xl border border-fe-border bg-fe-surface/80 p-4">
          <OrderForm
            variant="inline"
            products={[product]}
            preselected={product}
            onComplete={onOrder}
          />
        </div>
      ) : null}
    </MarketingCard>
  );
}

export function ProductGrid({
  products,
  limit,
  showViewAll,
  id = 'products',
  orderMode = 'hub',
}: ProductGridProps) {
  const { openHub } = useActionHub();
  const { currency_symbol } = useAppSettings();
  const { content, translate } = useMarketingContent();
  const [activeOrderId, setActiveOrderId] = React.useState<number | null>(null);

  const visible = limit ? products.slice(0, limit) : products;

  function handleOrder(product: MarketingProduct) {
    if (orderMode === 'inline') {
      setActiveOrderId((current) => (current === product.id ? null : product.id));
      return;
    }
    openHub('order', product);
  }

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

      {/* Mobile: horizontal snap carousel */}
      <div className="fe-snap-x-mandatory fe-scrollbar-hide -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:hidden">
        {visible.map((product) => (
          <div key={product.id} className="fe-snap-center w-[85vw] max-w-sm shrink-0">
            <ProductCard
              product={product}
              currency_symbol={currency_symbol}
              translate={translate}
              orderMode={orderMode}
              isOrderOpen={activeOrderId === product.id}
              onOrder={() => handleOrder(product)}
            />
          </div>
        ))}
      </div>

      {/* Tablet/desktop: grid */}
      <StaggerContainer className="hidden gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-4">
        {visible.map((product) => (
          <StaggerItem key={product.id}>
            <ProductCard
              product={product}
              currency_symbol={currency_symbol}
              translate={translate}
              orderMode={orderMode}
              isOrderOpen={activeOrderId === product.id}
              onOrder={() => handleOrder(product)}
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
