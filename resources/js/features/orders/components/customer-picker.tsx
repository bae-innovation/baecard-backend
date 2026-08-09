import { Loader2, UserPlus, Users } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export type CustomerOption = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
};

export type NewCustomerValues = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

type CustomerPickerProps = {
  customers: CustomerOption[];
  mode: 'existing' | 'new';
  onModeChange: (mode: 'existing' | 'new') => void;
  selectedCustomerId: number | null;
  onSelectCustomer: (customerId: number | null) => void;
  newCustomer: NewCustomerValues;
  onNewCustomerChange: (values: NewCustomerValues) => void;
  disabled?: boolean;
  onCustomerCreated?: (customer: CustomerOption) => void;
};

export function CustomerPicker({
  customers,
  mode,
  onModeChange,
  selectedCustomerId,
  onSelectCustomer,
  newCustomer,
  onNewCustomerChange,
  disabled = false,
  onCustomerCreated,
}: CustomerPickerProps) {
  const [isCreating, setIsCreating] = React.useState(false);

  const handleQuickCreate = async () => {
    if (!newCustomer.name.trim() || !newCustomer.email.trim()) {
      toast.error('Name and email are required for a new customer.');
      return;
    }

    setIsCreating(true);

    try {
      const response = await fetch('/customers/quick-create', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-XSRF-TOKEN':
            document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1]
              ? decodeURIComponent(
                  document.cookie.match(/XSRF-TOKEN=([^;]+)/)![1],
                )
              : '',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          name: newCustomer.name.trim(),
          email: newCustomer.email.trim(),
          phone: newCustomer.phone.trim() || null,
          password: newCustomer.password.trim() || undefined,
        }),
      });

      const body = await response.json();

      if (!response.ok) {
        const message =
          body?.message ??
          (body?.errors
            ? Object.values(body.errors as Record<string, string[]>).flat().join(' ')
            : 'Failed to create customer');
        throw new Error(message);
      }

      const created = body.data as CustomerOption;
      onCustomerCreated?.(created);
      onModeChange('existing');
      onSelectCustomer(created.id);
      toast.success('Customer created');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create customer');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Tabs
      value={mode}
      onValueChange={(value) => onModeChange(value as 'existing' | 'new')}
      className="space-y-3"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="existing" className="gap-2" disabled={disabled}>
          <Users className="size-4" />
          Existing
        </TabsTrigger>
        <TabsTrigger value="new" className="gap-2" disabled={disabled}>
          <UserPlus className="size-4" />
          New customer
        </TabsTrigger>
      </TabsList>

      <TabsContent value="existing" className="space-y-2">
        <Label>Customer</Label>
        <Select
          value={selectedCustomerId ? String(selectedCustomerId) : undefined}
          onValueChange={(value) => onSelectCustomer(Number(value))}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a customer" />
          </SelectTrigger>
          <SelectContent>
            {customers.map((customer) => (
              <SelectItem key={customer.id} value={String(customer.id)}>
                <span className="flex flex-col items-start">
                  <span>{customer.name}</span>
                  <span className="text-xs text-muted-foreground">{customer.email}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TabsContent>

      <TabsContent value="new" className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="new-customer-name">Name</Label>
          <Input
            id="new-customer-name"
            value={newCustomer.name}
            onChange={(event) =>
              onNewCustomerChange({ ...newCustomer, name: event.target.value })
            }
            disabled={disabled || isCreating}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="new-customer-email">Email</Label>
          <Input
            id="new-customer-email"
            type="email"
            value={newCustomer.email}
            onChange={(event) =>
              onNewCustomerChange({ ...newCustomer, email: event.target.value })
            }
            disabled={disabled || isCreating}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="new-customer-phone">Phone</Label>
          <Input
            id="new-customer-phone"
            value={newCustomer.phone}
            onChange={(event) =>
              onNewCustomerChange({ ...newCustomer, phone: event.target.value })
            }
            disabled={disabled || isCreating}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="new-customer-password">Password (optional)</Label>
          <Input
            id="new-customer-password"
            type="password"
            value={newCustomer.password}
            onChange={(event) =>
              onNewCustomerChange({ ...newCustomer, password: event.target.value })
            }
            disabled={disabled || isCreating}
          />
        </div>
        <Button
          type="button"
          variant="secondary"
          className={cn('w-full')}
          disabled={disabled || isCreating}
          onClick={() => void handleQuickCreate()}
        >
          {isCreating ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
          Save customer &amp; continue
        </Button>
        <p className="text-xs text-muted-foreground">
          Or submit the order form directly — a customer account will be created with the order.
        </p>
      </TabsContent>
    </Tabs>
  );
}
