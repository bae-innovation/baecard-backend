import type { ReactNode } from 'react';

import { OrdersPage } from '@/features/orders/components/orders-page';
import type { Order } from '@/features/orders/schemas/order.schema';
import DashboardLayout from '@/Layouts/DashboardLayout';
import type { LaravelPaginator } from '@/types/inertia';

export default function Index({ orders }: { orders: LaravelPaginator<Order> }) {
  return <OrdersPage orders={orders} />;
}

Index.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
