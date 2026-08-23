import { useAuth } from '@/hooks/useAuth';
import DashboardLayout from '@/Layouts/DashboardLayout';
import OwnerLayout from '@/owner/layouts/OwnerLayout';
import { useIsStandalonePwa } from '@/pwa/use-is-standalone-pwa';

/**
 * Picks the portal chrome for the current session.
 * Customers only get the app-like owner shell when the PWA is installed (standalone).
 * In a normal browser tab they keep the standard dashboard sidebar layout.
 */
export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const { isCustomer } = useAuth();
  const isStandalonePwa = useIsStandalonePwa();
  const useOwnerAppShell = isCustomer() && isStandalonePwa;

  if (useOwnerAppShell) {
    return <OwnerLayout>{children}</OwnerLayout>;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
