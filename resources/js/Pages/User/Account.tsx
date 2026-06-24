import type { ReactNode } from 'react';

import { AccountPage } from '@/features/account/components/account-page';
import type { AccountUser } from '@/features/account/schemas/account.schema';

import DashboardLayout from '@/Layouts/DashboardLayout';

type AccountProps = {
  user: AccountUser;
};

export default function Account({ user }: AccountProps) {
  return <AccountPage user={user} />;
}

Account.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
