import type { ReactNode } from 'react';

import { ProductEditPage } from '@/features/products/components/product-edit-page';
import type { Product } from '@/features/products/schemas/product.schema';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function Edit({ product }: { product: Product }) {
  return <ProductEditPage product={product} />;
}

Edit.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
