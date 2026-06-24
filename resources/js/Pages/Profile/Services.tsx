import type { ReactNode } from 'react';

import { ServicesManagementPage } from '@/features/profile/components/services-management-page';
import type { ProfileService } from '@/features/profile/schemas/profile-service.schema';

import DashboardLayout from '@/Layouts/DashboardLayout';

type ServicesPageProps = {
  services: ProfileService[];
};

export default function Services({ services }: ServicesPageProps) {
  return <ServicesManagementPage services={services} />;
}

Services.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
