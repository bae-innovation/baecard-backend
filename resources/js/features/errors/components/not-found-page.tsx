import { Compass, Home, LogIn } from 'lucide-react';

import { ErrorPageShell } from '@/components/shared/error-page-shell';
import { useAuth } from '@/hooks/useAuth';

type NotFoundPageProps = {
  message?: string | null;
};

export function NotFoundPage({ message }: NotFoundPageProps) {
  const { isAuthenticated, homeHref } = useAuth();
  const isLoggedIn = isAuthenticated();

  return (
    <ErrorPageShell
      code="404"
      title="Page not found"
      description="The page you are looking for doesn't exist, was moved, or the URL may be incorrect."
      icon={Compass}
      tone="violet"
      message={message}
      primaryAction={
        isLoggedIn
          ? { label: 'Go to my home', href: homeHref }
          : { label: 'Back to website', href: '/' }
      }
      secondaryAction={
        isLoggedIn
          ? { label: 'Visit website', href: '/' }
          : { label: 'Sign in', href: '/login' }
      }
    >
      <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
        {isLoggedIn ? (
          <Home className="size-4 shrink-0" aria-hidden />
        ) : (
          <LogIn className="size-4 shrink-0" aria-hidden />
        )}
        <span>
          {isLoggedIn
            ? 'Use the sidebar or your home link to continue working.'
            : 'Sign in if you were trying to reach the admin dashboard.'}
        </span>
      </div>
    </ErrorPageShell>
  );
}
