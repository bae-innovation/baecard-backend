import type { ReactNode } from 'react';

import { OrderCreatePage } from '@/features/orders/components/order-create-page';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function Create() {
  return <OrderCreatePage />;
}

Create.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
