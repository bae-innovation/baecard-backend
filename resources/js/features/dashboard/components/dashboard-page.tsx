import { Link } from '@inertiajs/react';
import {
  BarChart3,
  DollarSign,
  MessageSquare,
  Package,
  ShoppingCart,
  Star,
  Users,
} from 'lucide-react';

import { PageTitle } from '@/components/shared/page-title';
import { StatCard } from '@/components/shared/stat-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { DashboardStats } from '@/features/dashboard/schemas/dashboard.schema';
import { formatOrderMoney, formatOrderStatus } from '@/features/orders/utils/order-display.utils';
import { formatPrice } from '@/utils/number-formatter';

type DashboardPageProps = {
  stats: DashboardStats;
};

function formatPaymentStatus(status: string) {
  return status.replace(/_/g, ' ');
}

function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className="capitalize">
      {formatOrderStatus(status)}
    </Badge>
  );
}

export function DashboardPage({ stats }: DashboardPageProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 py-4">
      <PageTitle
        title="Analytics"
        icon={BarChart3}
        color="indigo"
        description="Overview of sales, revenue, reviews, and recent activity."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Revenue"
          value={formatOrderMoney(stats.orders.revenue)}
          icon={DollarSign}
          highlight
          description="Collected payments"
        />
        <StatCard
          label="Total Sales"
          value={formatOrderMoney(stats.orders.total_sales)}
          icon={ShoppingCart}
          description={`${stats.orders.total} orders`}
        />
        <StatCard
          label="Pending Orders"
          value={stats.orders.pending}
          icon={ShoppingCart}
          description={
            stats.orders.due > 0
              ? `${formatOrderMoney(stats.orders.due)} outstanding`
              : 'No outstanding balance'
          }
        />
        <StatCard
          label="Total Reviews"
          value={stats.reviews.total}
          icon={Star}
          description={
            stats.reviews.total > 0
              ? `${stats.reviews.average_rating} avg rating`
              : 'No reviews yet'
          }
        />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Customers"
          value={stats.customers.total}
          icon={Users}
          description="Registered customer accounts"
        />
        <StatCard
          label="Active Products"
          value={stats.products.active}
          icon={Package}
          description={`${stats.products.total} total products`}
        />
        <StatCard
          label="Contact Messages"
          value={stats.contacts.total}
          icon={MessageSquare}
          description={
            stats.contacts.unread > 0
              ? `${stats.contacts.unread} unread`
              : 'All messages read'
          }
          destructive={stats.contacts.unread > 0}
        />
      </section>

      <section className="rounded-lg border bg-card">
        <div className="flex flex-col gap-3 border-b px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Recent Orders</h2>
            <p className="text-sm text-muted-foreground">
              Latest orders across your store.
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/orders">View all orders</Link>
          </Button>
        </div>

        {stats.recent_orders.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-muted-foreground">
            No orders yet. New orders will appear here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40 text-left text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Order</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Payment</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_orders.map((order) => (
                  <tr key={order.id} className="border-b last:border-b-0">
                    <td className="px-4 py-3 font-medium">{order.order_number}</td>
                    <td className="px-4 py-3">{order.customer_name}</td>
                    <td className="px-4 py-3 tabular-nums">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3 capitalize text-muted-foreground">
                      {formatPaymentStatus(order.payment_status)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {order.created_at
                        ? new Date(order.created_at).toLocaleDateString()
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {stats.reviews.pending_visibility > 0 ? (
        <section className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200">
          <span className="font-medium">{stats.reviews.pending_visibility}</span>{' '}
          review{stats.reviews.pending_visibility === 1 ? '' : 's'} waiting for
          approval.{' '}
          <Link href="/reviews" className="font-medium underline underline-offset-2">
            Review now
          </Link>
        </section>
      ) : null}
    </div>
  );
}
