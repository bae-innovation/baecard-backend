import { Home, ShieldX } from 'lucide-react';

import { ErrorPageShell } from '@/components/shared/error-page-shell';
import { useAuth } from '@/hooks/useAuth';

type ForbiddenPageProps = {
  message?: string | null;
};

export function ForbiddenPage({ message }: ForbiddenPageProps) {
  const { homeHref, isAuthenticated } = useAuth();
  const isLoggedIn = isAuthenticated();

  return (
    <ErrorPageShell
      code="403"
      title="Access denied"
      description="You don't have permission to view this page. Contact an administrator if you believe this is a mistake."
      icon={ShieldX}
      tone="rose"
      message={message}
      primaryAction={
        isLoggedIn
          ? { label: 'Go to my home', href: homeHref }
          : { label: 'Sign in', href: '/login' }
      }
      secondaryAction={{ label: 'Visit website', href: '/' }}
    >
      <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Home className="size-4 shrink-0" aria-hidden />
        <span>
          {isLoggedIn
            ? 'Your role may not include the required permission for this section.'
            : 'You may need to sign in with a staff account to continue.'}
        </span>
      </div>
    </ErrorPageShell>
  );
}
