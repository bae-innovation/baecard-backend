import type { ComponentType, ReactNode } from 'react';
import { router } from '@inertiajs/react';
import {
  Calendar,
  CreditCard,
  Hash,
  Pencil,
  ShoppingCart,
  Trash2,
} from 'lucide-react';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PaymentFormDialog } from '@/features/orders/components/payment-form-dialog';
import type { Order } from '@/features/orders/schemas/order.schema';
import type { PaymentFormValues } from '@/features/orders/schemas/order.schema';
import {
  formatOrderDate,
  formatOrderMoney,
  formatOrderStatus,
} from '@/features/orders/utils/order-display.utils';
import { showMutationError, showMutationSuccess } from '@/lib/mutation-toast';
import { cn } from '@/lib/utils';

const ORDER_STATUSES = [
  'pending',
  'processing',
  'confirmed',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
] as const;

type OrderDetailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  canManage?: boolean;
  onDelete?: (order: Order) => void;
  onRefresh?: () => void;
};

function DetailField({
  label,
  value,
  mono,
  className,
}: {
  label: string;
  value: ReactNode;
  mono?: boolean;
  className?: string;
}) {
  const empty = value == null || value === '' || value === '—';

  return (
    <div className={cn('space-y-1', className)}>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd
        className={cn(
          'text-sm leading-relaxed',
          mono && 'font-mono text-[13px]',
          empty && 'text-muted-foreground',
        )}
      >
        {empty ? '—' : value}
      </dd>
    </div>
  );
}

function DetailSection({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn('rounded-lg border bg-card p-4', className)}>
      <h3 className="mb-3 text-sm font-semibold tracking-tight">{title}</h3>
      <dl className="grid gap-4 sm:grid-cols-2">{children}</dl>
    </section>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  highlight,
  destructive,
}: {
  label: string;
  value: ReactNode;
  icon: ComponentType<{ className?: string }>;
  highlight?: boolean;
  destructive?: boolean;
}) {
  return (
    <div className="rounded-lg border bg-background p-3">
      <div className="mb-2 flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4 shrink-0" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p
        className={cn(
          'text-lg font-semibold tabular-nums tracking-tight',
          highlight && 'text-emerald-600 dark:text-emerald-400',
          destructive && 'text-destructive',
        )}
      >
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return <Badge variant="outline">{formatOrderStatus(status)}</Badge>;
}

export function OrderDetailDialog({
  open,
  onOpenChange,
  order,
  canManage = false,
  onDelete,
  onRefresh,
}: OrderDetailDialogProps) {
  const [paymentOpen, setPaymentOpen] = React.useState(false);
  const [isAddingPayment, setIsAddingPayment] = React.useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = React.useState(false);

  if (!order) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl" />
      </Dialog>
    );
  }

  const dueAmount = Number(order.due_amount ?? 0);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex max-h-[90vh] max-w-4xl flex-col gap-0 overflow-hidden p-0 sm:max-w-4xl">
          <div className="shrink-0 border-b bg-muted/20 px-6 pb-5 pt-6">
            <DialogHeader className="space-y-4 text-left">
              <div className="space-y-3">
                <div>
                  <DialogTitle className="font-mono text-xl leading-tight sm:text-2xl">
                    {order.order_number}
                  </DialogTitle>
                  <DialogDescription className="mt-1.5">
                    {order.product_name} · Qty {order.quantity}
                  </DialogDescription>
                </div>

                <div className="flex flex-wrap gap-2">
                  <StatusBadge status={order.status} />
                  <StatusBadge status={order.payment_status} />
                </div>
              </div>
            </DialogHeader>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard label="Total" value={formatOrderMoney(order.total)} icon={ShoppingCart} />
              <StatCard
                label="Paid"
                value={formatOrderMoney(order.paid_amount)}
                icon={CreditCard}
                highlight
              />
              <StatCard
                label="Due"
                value={formatOrderMoney(order.due_amount)}
                icon={CreditCard}
                destructive={dueAmount > 0}
              />
              <StatCard label="Unit Price" value={formatOrderMoney(order.unit_price)} icon={ShoppingCart} />
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <div className="space-y-4 p-6">
              <DetailSection title="Customer">
                <DetailField
                  label="Customer"
                  value={order.customer?.name ?? `#${order.customer_id}`}
                />
                <DetailField label="Customer ID" value={`#${order.customer_id}`} mono />
                <DetailField label="Email" value={order.customer?.email} />
                <DetailField label="Phone" value={order.customer?.phone} />
              </DetailSection>

              <DetailSection title="Line Item">
                <DetailField label="Order ID" value={`#${order.id}`} mono />
                <DetailField label="Product ID" value={order.product_id ? `#${order.product_id}` : '—'} mono />
                <DetailField label="Product Name" value={order.product_name} />
                <DetailField label="Linked Product" value={order.product?.name} />
                <DetailField label="Unit Price" value={formatOrderMoney(order.unit_price)} />
                <DetailField label="Quantity" value={order.quantity} />
              </DetailSection>

              <DetailSection title="Pricing">
                <DetailField label="Subtotal" value={formatOrderMoney(order.subtotal)} />
                <DetailField label="Discount Type" value={order.discount_type} />
                <DetailField label="Discount Code" value={order.discount_code} mono />
                <DetailField label="Tax" value={formatOrderMoney(order.tax)} />
                <DetailField label="Shipping" value={formatOrderMoney(order.shipping_cost)} />
                <DetailField label="Total" value={formatOrderMoney(order.total)} />
                <DetailField label="Paid Amount" value={formatOrderMoney(order.paid_amount)} />
                <DetailField label="Due Amount" value={formatOrderMoney(order.due_amount)} />
              </DetailSection>

              <DetailSection title="Status">
                <DetailField
                  label="Order Status"
                  value={
                    canManage ? (
                      <Select
                        value={order.status}
                        onValueChange={(value) => {
                          setIsUpdatingStatus(true);
                          router.put(
                            `/orders/${order.id}`,
                            { status: value },
                            {
                              preserveScroll: true,
                              onSuccess: () => {
                                showMutationSuccess('Order status updated');
                                onRefresh?.();
                              },
                              onError: () =>
                                showMutationError(null, 'Failed to update order status'),
                              onFinish: () => setIsUpdatingStatus(false),
                            },
                          );
                        }}
                        disabled={isUpdatingStatus}
                      >
                        <SelectTrigger className="h-9 w-full max-w-[220px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ORDER_STATUSES.map((status) => (
                            <SelectItem key={status} value={status}>
                              {formatOrderStatus(status)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <StatusBadge status={order.status} />
                    )
                  }
                  className="sm:col-span-2"
                />
                <DetailField
                  label="Payment Status"
                  value={<StatusBadge status={order.payment_status} />}
                />
              </DetailSection>

              {order.notes ? (
                <DetailSection title="Notes">
                  <DetailField
                    label="Notes"
                    value={
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{order.notes}</p>
                    }
                    className="sm:col-span-2"
                  />
                </DetailSection>
              ) : null}

              <section className="rounded-lg border bg-card p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="flex items-center gap-2 text-sm font-semibold tracking-tight">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    Payments
                  </h3>
                  {canManage && dueAmount > 0 ? (
                    <Button type="button" size="sm" onClick={() => setPaymentOpen(true)}>
                      Add Payment
                    </Button>
                  ) : null}
                </div>
                {order.payments && order.payments.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>{formatOrderDate(payment.paid_at)}</TableCell>
                          <TableCell>{formatOrderStatus(payment.payment_method)}</TableCell>
                          <TableCell className="font-mono text-xs">
                            {payment.reference_number ?? '—'}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {formatOrderMoney(payment.amount)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-sm text-muted-foreground">No payments recorded yet.</p>
                )}
              </section>

              <section className="rounded-lg border bg-card p-4">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold tracking-tight">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Record
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <DetailField label="Created" value={formatOrderDate(order.created_at)} />
                  <DetailField label="Last Updated" value={formatOrderDate(order.updated_at)} />
                </div>
                <Separator className="my-4" />
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Hash className="h-3.5 w-3.5" />
                  Internal reference: order #{order.id}
                </div>
              </section>
            </div>
          </div>

          <DialogFooter className="shrink-0 border-t bg-muted/10 px-6 py-4 sm:justify-between">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            {canManage ? (
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    onOpenChange(false);
                    router.visit(`/orders/${order.id}/edit`);
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Order
                </Button>
                {onDelete ? (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      onOpenChange(false);
                      onDelete(order);
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                ) : null}
              </div>
            ) : null}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {canManage ? (
        <PaymentFormDialog
          open={paymentOpen}
          onOpenChange={setPaymentOpen}
          dueAmount={dueAmount}
          isSubmitting={isAddingPayment}
          onSubmit={async (values: PaymentFormValues) => {
            setIsAddingPayment(true);
            router.post(`/orders/${order.id}/payments`, values, {
              preserveScroll: true,
              onSuccess: () => {
                showMutationSuccess('Payment added');
                setPaymentOpen(false);
                onRefresh?.();
              },
              onError: () => showMutationError(null, 'Failed to add payment'),
              onFinish: () => setIsAddingPayment(false),
            });
          }}
        />
      ) : null}
    </>
  );
}
