import { router } from '@inertiajs/react';
import { Reorder } from 'framer-motion';
import { Briefcase, GripVertical, Pencil, Plus, Trash2 } from 'lucide-react';
import * as React from 'react';

import { PageTitle } from '@/components/shared/page-title';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  buildServiceFormData,
  ServiceFormDialog,
} from '@/features/profile/components/service-form-dialog';
import { formatPrice } from '@/features/profile/templates/profile-template-types';
import type {
  ProfileService,
  ProfileServiceFormValues,
} from '@/features/profile/schemas/profile-service.schema';
import { showMutationError, showMutationSuccess } from '@/lib/mutation-toast';

type ServicesManagementPageProps = {
  services: ProfileService[];
};

export function ServicesManagementPage({ services }: ServicesManagementPageProps) {
  const [items, setItems] = React.useState(services);
  const [formOpen, setFormOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState<'create' | 'edit'>('create');
  const [selected, setSelected] = React.useState<ProfileService | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    setItems(services);
  }, [services]);

  const openCreate = () => {
    setFormMode('create');
    setSelected(null);
    setFormOpen(true);
  };

  const openEdit = (service: ProfileService) => {
    setFormMode('edit');
    setSelected(service);
    setFormOpen(true);
  };

  const handleReorder = (nextItems: ProfileService[]) => {
    setItems(nextItems);
    router.post(
      '/profile/services/reorder',
      {
        items: nextItems.map((item, index) => ({
          id: item.id,
          sort_order: index,
        })),
      },
      {
        preserveScroll: true,
        only: ['services'],
        onError: () => showMutationError(null, 'Failed to reorder services'),
      },
    );
  };

  return (
    <div className="space-y-6 py-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageTitle
          title="My Services"
          description="Manage the services and products shown on your public business card."
          icon={Briefcase}
          color="emerald"
        />
        <Button onClick={openCreate}>
          <Plus className="mr-2 size-4" />
          Add service
        </Button>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No services yet. Add your first offering to display it on your public card.
          </CardContent>
        </Card>
      ) : (
        <Reorder.Group axis="y" values={items} onReorder={handleReorder} className="space-y-3">
          {items.map((service) => (
            <Reorder.Item
              key={service.id}
              value={service}
              className="flex items-center gap-3 rounded-xl border bg-card p-4 shadow-sm"
            >
              <GripVertical className="size-4 shrink-0 cursor-grab text-muted-foreground" />
              {service.image_url ? (
                <img
                  src={service.image_url}
                  alt={service.name}
                  className="size-16 rounded-lg object-cover"
                />
              ) : (
                <div className="flex size-16 items-center justify-center rounded-lg bg-muted text-xs text-muted-foreground">
                  No image
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{service.name}</p>
                  {!service.is_active ? <Badge variant="secondary">Hidden</Badge> : null}
                </div>
                {service.description ? (
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {service.description}
                  </p>
                ) : null}
                {service.price != null ? (
                  <p className="mt-1 text-sm font-semibold">{formatPrice(service.price)}</p>
                ) : null}
              </div>
              <div className="flex shrink-0 gap-2">
                <Button type="button" variant="outline" size="icon" onClick={() => openEdit(service)}>
                  <Pencil className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    router.delete(`/profile/services/${service.id}`, {
                      preserveScroll: true,
                      only: ['services'],
                      onSuccess: () => showMutationSuccess('Service removed'),
                      onError: () => showMutationError(null, 'Failed to delete service'),
                    });
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}

      <ServiceFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        service={selected}
        isSubmitting={isSubmitting}
        onSubmit={async (values: ProfileServiceFormValues, imageFile?: File | null) => {
          setIsSubmitting(true);
          const formData = buildServiceFormData(values, imageFile);

          if (formMode === 'create') {
            router.post('/profile/services', formData, {
              forceFormData: true,
              preserveScroll: true,
              only: ['services'],
              onSuccess: () => {
                showMutationSuccess('Service added');
                setFormOpen(false);
              },
              onError: () => showMutationError(null, 'Failed to add service'),
              onFinish: () => setIsSubmitting(false),
            });
            return;
          }

          if (!selected) {
            setIsSubmitting(false);
            return;
          }

          router.put(`/profile/services/${selected.id}`, formData, {
            forceFormData: true,
            preserveScroll: true,
            only: ['services'],
            onSuccess: () => {
              showMutationSuccess('Service updated');
              setFormOpen(false);
              setSelected(null);
            },
            onError: () => showMutationError(null, 'Failed to update service'),
            onFinish: () => setIsSubmitting(false),
          });
        }}
      />
    </div>
  );
}
