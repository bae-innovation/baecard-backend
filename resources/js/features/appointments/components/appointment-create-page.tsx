import { router, useForm, usePage } from '@inertiajs/react';
import { Calendar } from 'lucide-react';
import * as React from 'react';

import { FormPageShell } from '@/components/shared/form-page-shell';
import { AppointmentForm } from '@/features/appointments/components/appointment-form';
import type {
  AppointmentCustomerOption,
  AppointmentFormValues,
} from '@/features/appointments/schemas/appointment.schema';
import { useAuth } from '@/hooks/useAuth';
import { showMutationError, showMutationSuccess } from '@/lib/mutation-toast';

type CreatePageProps = {
  customers: AppointmentCustomerOption[];
};

export function AppointmentCreatePage() {
  const { customers } = usePage<CreatePageProps>().props;
  const { canCreateAppointments } = useAuth();
  const canAssignCustomer = canCreateAppointments();
  const [processing, setProcessing] = React.useState(false);
  useForm({});

  return (
    <FormPageShell
      backTo="/appointments"
      backLabel="Back to Appointments"
      title="Create Appointment"
      description="Schedule a new appointment"
      icon={Calendar}
    >
      <AppointmentForm
        mode="create"
        variant="page"
        customers={customers}
        showAdminFields={canAssignCustomer}
        isSubmitting={processing}
        onCancel={() => router.visit('/appointments')}
        onSubmit={async (values: AppointmentFormValues) => {
          setProcessing(true);
          const payload = { ...values };

          if (!canAssignCustomer) {
            delete payload.customer_id;
          }

          router.post('/appointments', payload, {
            onSuccess: () => showMutationSuccess('Appointment created'),
            onError: () => showMutationError(null, 'Failed to create appointment'),
            onFinish: () => setProcessing(false),
          });
        }}
      />
    </FormPageShell>
  );
}
