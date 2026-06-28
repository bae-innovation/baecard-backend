import { FrontendLayout } from '@frontend/layouts/FrontendLayout';
import { ProductGrid } from '@frontend/components/blocks/product-grid';
import { StepTimeline } from '@frontend/components/blocks/step-timeline';
import { TrustLogosBlock } from '@frontend/components/blocks/trust-logos';
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
      <StepTimeline />
      <HowItWorksSection />
      <FeatureGrid />
      <ProductGrid products={products} limit={4} showViewAll id="products" />
      <ReviewsSection reviews={reviews} />
      <TrustLogosBlock />
    </FrontendLayout>
  );
}
