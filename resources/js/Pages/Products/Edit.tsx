import type { ReactNode } from 'react';

import { ProductEditPage } from '@/features/products/components/product-edit-page';
import type { Product } from '@/features/products/schemas/product.schema';
import PortalLayout from '@/Layouts/PortalLayout';

export default function Edit({ product }: { product: Product }) {
  return <ProductEditPage product={product} />;
}

Edit.layout = (page: ReactNode) => <PortalLayout>{page}</PortalLayout>;
