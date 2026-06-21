import { router, useForm } from '@inertiajs/react';
import { Calendar } from 'lucide-react';
import * as React from 'react';

import { FormPageShell } from '@/components/shared/form-page-shell';
import { AppointmentForm } from '@/features/appointments/components/appointment-form';
import type { Appointment } from '@/features/appointments/schemas/appointment.schema';
import type { AppointmentFormValues } from '@/features/appointments/schemas/appointment.schema';
import { useAuth } from '@/hooks/useAuth';
import { showMutationError, showMutationSuccess } from '@/lib/mutation-toast';

type AppointmentEditPageProps = {
  appointment: Appointment;
};

export function AppointmentEditPage({ appointment }: AppointmentEditPageProps) {
  const { hasAbility, user } = useAuth();
  const canManage = hasAbility('appointments.manage');
  const [processing, setProcessing] = React.useState(false);
  useForm({});

  const canEdit = canManage || appointment.customer_id === user?.id;

  React.useEffect(() => {
    if (!canEdit) {
      router.visit('/appointments');
    }
  }, [canEdit]);

  if (!canEdit) return null;

  return (
    <FormPageShell
      backTo="/appointments"
      backLabel="Back to Appointments"
      title="Edit Appointment"
      description={appointment.title}
      icon={Calendar}
    >
      <AppointmentForm
        key={appointment.id}
        mode="edit"
        variant="page"
        appointment={appointment}
        showAdminFields={canManage}
        isSubmitting={processing}
        onCancel={() => router.visit('/appointments')}
        onSubmit={async (values: AppointmentFormValues) => {
          setProcessing(true);
          router.put(`/appointments/${appointment.id}`, values, {
            onSuccess: () => showMutationSuccess('Appointment updated'),
            onError: () => showMutationError(null, 'Failed to update appointment'),
            onFinish: () => setProcessing(false),
          });
        }}
      />
    </FormPageShell>
  );
}
