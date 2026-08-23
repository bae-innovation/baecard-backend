import { useAuth } from '@/hooks/useAuth';
import { useIsStandalonePwa } from '@/pwa/use-is-standalone-pwa';

/** True when the customer is using the installed PWA owner shell. */
export function useOwnerAppShell(): boolean {
  const { isCustomer } = useAuth();
  const isStandalonePwa = useIsStandalonePwa();

  return isCustomer() && isStandalonePwa;
}
