import type { ReactNode } from 'react';

import { ProductsPage } from '@/features/products/components/products-page';
import type { Product } from '@/features/products/schemas/product.schema';
import DashboardLayout from '@/Layouts/DashboardLayout';
import type { LaravelPaginator } from '@/types/inertia';

export default function Index({ products }: { products: LaravelPaginator<Product> }) {
  return <ProductsPage products={products} />;
}

Index.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
