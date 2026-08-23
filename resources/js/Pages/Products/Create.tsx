import type { ReactNode } from 'react';

import { ProductCreatePage } from '@/features/products/components/product-create-page';
import PortalLayout from '@/Layouts/PortalLayout';

export default function Create() {
  return <ProductCreatePage />;
}

Create.layout = (page: ReactNode) => <PortalLayout>{page}</PortalLayout>;
