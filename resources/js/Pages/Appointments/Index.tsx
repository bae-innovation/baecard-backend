import type { ReactNode } from 'react';

import { AppointmentsPage } from '@/features/appointments/components/appointments-page';
import type { Appointment } from '@/features/appointments/schemas/appointment.schema';
import DashboardLayout from '@/Layouts/DashboardLayout';
import type { LaravelPaginator } from '@/types/inertia';

export default function Index({
  appointments,
}: {
  appointments: LaravelPaginator<Appointment>;
}) {
  return <AppointmentsPage appointments={appointments} />;
}

Index.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
