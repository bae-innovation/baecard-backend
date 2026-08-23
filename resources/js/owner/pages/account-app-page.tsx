import { AccountPageContent } from '@/features/account/components/account-page';
import type { AccountUser } from '@/features/account/schemas/account.schema';

type AccountAppPageProps = {
  user: AccountUser;
};

export function AccountAppPage({ user }: AccountAppPageProps) {
  return <AccountPageContent user={user} variant="owner-app" />;
}
