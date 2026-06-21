import type { ReactNode } from 'react';

import { AppointmentCreatePage } from '@/features/appointments/components/appointment-create-page';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function Create() {
  return <AppointmentCreatePage />;
}

Create.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
