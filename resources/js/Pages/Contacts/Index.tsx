import type { ReactNode } from 'react';

import { ContactsPage } from '@/features/contacts/components/contacts-page';
import type { Contact } from '@/features/contacts/schemas/contact.schema';
import DashboardLayout from '@/Layouts/DashboardLayout';
import type { LaravelPaginator } from '@/types/inertia';

export default function Index({ contacts }: { contacts: LaravelPaginator<Contact> }) {
  return <ContactsPage contacts={contacts} />;
}

Index.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
