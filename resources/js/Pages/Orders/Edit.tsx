import type { ReactNode } from 'react';

import { OrderEditPage } from '@/features/orders/components/order-edit-page';
import type { Order } from '@/features/orders/schemas/order.schema';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function Edit({ order }: { order: Order }) {
  return <OrderEditPage order={order} />;
}

Edit.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
