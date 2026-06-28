import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import { useActionHub } from '@frontend/hooks/use-action-hub';
import { MarketingButton } from '@frontend/components/ui/marketing-button';
import { MarketingCard } from '@frontend/components/ui/marketing-card';
import { MotionSection, StaggerContainer, StaggerItem } from '@frontend/components/ui/motion-section';
import { SectionHeading } from '@frontend/components/ui/section-heading';
import type { MarketingProduct } from '@frontend/types/marketing';
import { formatPrice, getDiscountedPrice } from '@frontend/utils/format-price';
import { useAppSettings } from '@/hooks/useAppSettings';

type ProductCatalogProps = {
  products: MarketingProduct[];
};

export function ProductCatalog({ products }: ProductCatalogProps) {
  const { openHub } = useActionHub();
  const { currency_symbol } = useAppSettings();

  if (products.length === 0) {
    return (
      <MotionSection id="products" className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionHeading title="CATALOG" subtitle="Match your style & Need" />
          <p className="text-center text-white/60">Products coming soon.</p>
        </div>
      </MotionSection>
    );
  }

  return (
    <MotionSection id="products" className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading title="CATALOG" subtitle="Match your style & Need" />
        <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => {
            const discounted = getDiscountedPrice(product);
            const hasDiscount = discounted != null && product.price != null && discounted < Number(product.price);

            return (
              <StaggerItem key={product.id}>
                <MarketingCard glow className="flex h-full flex-col">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="mb-4 aspect-square w-full rounded-xl object-cover"
                    />
                  ) : (
                    <div className="mb-4 aspect-square w-full rounded-xl bg-white/5" />
                  )}
                  <div className="mb-2 text-center">
                    {hasDiscount ? (
                      <>
                        <p className="text-sm text-red-400 line-through">
                          {formatPrice(Number(product.price), currency_symbol)}
                        </p>
                        <p className="text-lg font-semibold">
                          {formatPrice(discounted, currency_symbol)}
                        </p>
                      </>
                    ) : (
                      <p className="text-lg font-semibold">
                        {formatPrice(Number(product.price), currency_symbol)}
                      </p>
                    )}
                  </div>
                  <Accordion type="single" collapsible className="mb-4">
                    <AccordionItem value="details" className="border-white/10">
                      <AccordionTrigger className="text-white hover:text-[#66FCF1]">
                        {product.name}
                      </AccordionTrigger>
                      <AccordionContent className="text-center text-sm text-white/60">
                        {product.description ?? 'No description.'}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  <MarketingButton
                    className="mt-auto w-full"
                    onClick={() => openHub('order', product)}
                  >
                    Order Now
                  </MarketingButton>
                </MarketingCard>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </MotionSection>
  );
}
