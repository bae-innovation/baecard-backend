import type { ReactNode } from 'react';

import { AppointmentCreatePage } from '@/features/appointments/components/appointment-create-page';
import PortalLayout from '@/Layouts/PortalLayout';

export default function Create() {
  return <AppointmentCreatePage />;
}

Create.layout = (page: ReactNode) => <PortalLayout>{page}</PortalLayout>;
