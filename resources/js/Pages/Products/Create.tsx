import type { ReactNode } from 'react';

import { ProductCreatePage } from '@/features/products/components/product-create-page';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function Create() {
  return <ProductCreatePage />;
}

Create.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
