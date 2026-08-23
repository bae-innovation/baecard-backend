import type { ReactNode } from 'react';

import { AppointmentEditPage } from '@/features/appointments/components/appointment-edit-page';
import type { Appointment } from '@/features/appointments/schemas/appointment.schema';
import PortalLayout from '@/Layouts/PortalLayout';

export default function Edit({ appointment }: { appointment: Appointment }) {
  return <AppointmentEditPage appointment={appointment} />;
}

Edit.layout = (page: ReactNode) => <PortalLayout>{page}</PortalLayout>;
