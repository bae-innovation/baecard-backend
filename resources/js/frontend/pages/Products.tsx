import { ProductCatalog } from '@frontend/components/catalog/product-catalog';
import { StructuredPageBody } from '@frontend/components/blocks/structured-page';
import { FrontendLayout } from '@frontend/layouts/FrontendLayout';
import { useMarketingContent } from '@frontend/providers/marketing-content-provider';
import type { MarketingContent } from '@frontend/types/marketing-content';
import type { MarketingProduct } from '@frontend/types/marketing';

type ProductsProps = {
  products: MarketingProduct[];
  marketing?: MarketingContent | null;
};

function ProductsContent({ products }: { products: MarketingProduct[] }) {
  const { content, translate } = useMarketingContent();

  return (
    <>
      <StructuredPageBody page={content.pages.products} translate={translate} />
      <ProductCatalog products={products} limit={null} showViewAll={false} showHeading={false} />
    </>
  );
}

export default function Products({ products, marketing }: ProductsProps) {
  return (
    <FrontendLayout
      products={products}
      marketing={marketing}
      pageSlug="products"
      contactVariant="products"
    >
      <ProductsContent products={products} />
    </FrontendLayout>
  );
}
