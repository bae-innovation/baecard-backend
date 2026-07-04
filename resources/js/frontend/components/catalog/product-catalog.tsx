import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import * as React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import { MarketingButton } from '@frontend/components/ui/marketing-button';
import { MarketingCard } from '@frontend/components/ui/marketing-card';
import { MotionSection, StaggerContainer, StaggerItem } from '@frontend/components/ui/motion-section';
import { PremiumSectionHeading } from '@frontend/components/ui/premium-section-heading';
import { useReducedMotion } from '@frontend/hooks/use-reduced-motion';
import { useMarketingContent } from '@frontend/providers/marketing-content-provider';
import type { MarketingProduct } from '@frontend/types/marketing';
import { productCheckoutUrl } from '@frontend/utils/product-checkout-url';
import { formatPrice, getDiscountedPrice } from '@frontend/utils/format-price';
import { useAppSettings } from '@/hooks/useAppSettings';
import { cn } from '@/lib/utils';

type ProductCatalogProps = {
  products: MarketingProduct[];
  limit?: number | null;
  showViewAll?: boolean;
  showHeading?: boolean;
};

function CatalogHeading() {
  const { content, translate } = useMarketingContent();

  return (
    <PremiumSectionHeading
      badge={translate(content.sectionHeadings.catalog.title)}
      title={translate(content.sectionHeadings.catalog.title)}
      subtitle={translate(content.sectionHeadings.catalog.subtitle)}
    />
  );
}

function CatalogProductCard({
  product,
  currency_symbol,
  translate,
}: {
  product: MarketingProduct;
  currency_symbol: string;
  translate: (v: { en: string; bn: string }) => string;
}) {
  const reducedMotion = useReducedMotion();
  const discounted = getDiscountedPrice(product);
  const hasDiscount =
    discounted != null && product.price != null && discounted < Number(product.price);

  return (
    <motion.div
      whileHover={reducedMotion ? undefined : { y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      className="h-full"
    >
      <MarketingCard glow className="group relative flex h-full flex-col overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 ring-2 ring-fe-accent/50 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden
        />
        {hasDiscount ? (
          <span className="relative z-10 mb-2 w-fit rounded-full bg-fe-promo px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
            {translate({ en: 'Sale', bn: 'ছাড়' })}
          </span>
        ) : null}
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="relative z-10 mb-4 aspect-square w-full rounded-xl object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="relative z-10 mb-4 aspect-square w-full rounded-xl bg-fe-border/30" />
        )}
        <div className="relative z-10 mb-2 text-center">
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
        <Accordion type="single" collapsible className="relative z-10 mb-4">
          <AccordionItem value="details" className="border-fe-border">
            <AccordionTrigger className="fe-touch py-3 text-fe-text hover:text-fe-accent">
              {product.name}
            </AccordionTrigger>
            <AccordionContent className="text-center text-sm leading-relaxed text-fe-muted">
              {product.description ?? translate({ en: 'No description.', bn: 'বিবরণ নেই।' })}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Link href={productCheckoutUrl(product)} className="relative z-10 mt-auto">
          <MarketingButton className="w-full">
            {translate({ en: 'Order Now', bn: 'অর্ডার করুন' })}
          </MarketingButton>
        </Link>
      </MarketingCard>
    </motion.div>
  );
}

export function ProductCatalog({
  products,
  limit = 4,
  showViewAll = true,
  showHeading = true,
}: ProductCatalogProps) {
  const { currency_symbol } = useAppSettings();
  const { translate } = useMarketingContent();

  const visible = React.useMemo(
    () => (limit != null ? products.slice(0, limit) : products),
    [products, limit],
  );

  return (
    <MotionSection id="products" className="fe-catalog-section relative overflow-hidden py-14 sm:py-16 md:py-24">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fe-accent/20 to-transparent"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-5 md:px-6">
        {showHeading ? <CatalogHeading /> : null}

        {visible.length === 0 ? (
          <p className="text-center text-fe-muted">
            {translate({ en: 'Products coming soon.', bn: 'শীঘ্রই পণ্য আসছে।' })}
          </p>
        ) : (
          <>
            <div className="fe-snap-x-mandatory fe-scrollbar-hide -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:hidden">
              {visible.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.45 }}
                  className="fe-snap-center w-[85vw] max-w-sm shrink-0"
                >
                  <CatalogProductCard
                    product={product}
                    currency_symbol={currency_symbol}
                    translate={translate}
                  />
                </motion.div>
              ))}
            </div>

            <StaggerContainer className="hidden gap-5 sm:grid sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
              {visible.map((product) => (
                <StaggerItem key={product.id}>
                  <CatalogProductCard
                    product={product}
                    currency_symbol={currency_symbol}
                    translate={translate}
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </>
        )}

        {showViewAll && visible.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-8 text-center sm:mt-10"
          >
            <Link href="/products">
              <MarketingButton variant="outline" className="w-full max-w-xs sm:w-auto">
                {translate({ en: 'View all products', bn: 'সব পণ্য দেখুন' })}
              </MarketingButton>
            </Link>
          </motion.div>
        ) : null}
      </div>
    </MotionSection>
  );
}
