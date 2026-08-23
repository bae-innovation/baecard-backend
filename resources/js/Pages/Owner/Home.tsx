import type { ReactNode } from 'react';

import { OwnerHomePage, type OwnerHomePageProps } from '@/owner/pages/home-page';
import PortalLayout from '@/Layouts/PortalLayout';

export default function Home(props: OwnerHomePageProps) {
  return <OwnerHomePage {...props} />;
}

Home.layout = (page: ReactNode) => <PortalLayout>{page}</PortalLayout>;
