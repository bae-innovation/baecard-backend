import { FrontendLayout } from '@frontend/layouts/FrontendLayout';
import { ProductCatalog } from '@frontend/components/catalog/product-catalog';
import { StepTimeline } from '@frontend/components/blocks/step-timeline';
import { TrustLogosBlock } from '@frontend/components/blocks/trust-logos';
import { CorporateForm } from '@frontend/components/corporate/corporate-form';
import { FeatureGrid } from '@frontend/components/features/feature-grid';
import { HeroSection } from '@frontend/components/hero/hero-section';
import { HowItWorksSection } from '@frontend/components/how-it-works/how-it-works-section';
import { ReviewsSection } from '@frontend/components/reviews/reviews-section';
import type { MarketingContent } from '@frontend/types/marketing-content';
import type { MarketingProduct, MarketingReview } from '@frontend/types/marketing';

type HomeProps = {
  products: MarketingProduct[];
  reviews: MarketingReview[];
  marketing?: MarketingContent | null;
};

export default function Home({ products, reviews, marketing }: HomeProps) {
  return (
    <FrontendLayout
      title="BAE Card — Smart NFC Business Cards"
      products={products}
      marketing={marketing}
      contactVariant="home"
    >
      <HeroSection />
      <ProductCatalog products={products} limit={4} showViewAll />
      <StepTimeline />
      <HowItWorksSection />
      <FeatureGrid />
      <ReviewsSection reviews={reviews} />
      <CorporateForm variant="section" />
      <TrustLogosBlock />
    </FrontendLayout>
  );
}
