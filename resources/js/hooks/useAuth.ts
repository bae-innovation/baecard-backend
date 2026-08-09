import { usePage } from '@inertiajs/react';

import type { SharedPageProps } from '@/types/inertia';
import {
  hasAnyPermissionForUser,
  hasPermissionForUser,
  matchesPermission,
} from '@/lib/permissions';

export function useAuth() {
  const { auth } = usePage<{ auth: SharedPageProps['auth'] }>().props;
  const permissionNames = auth.permissions.map((permission) => permission.name);

  return {
    user: auth.user,
    permissions: auth.permissions,
    isAuthenticated: () => auth.user !== null,
    hasPermission: (permission: string) =>
      hasPermissionForUser(auth.permissions, permission),
    hasAnyPermission: (permissions: readonly string[]) =>
      hasAnyPermissionForUser(auth.permissions, permissions),
    hasAbility: (permission: string) =>
      hasPermissionForUser(auth.permissions, permission),
    hasAnyAbility: (permissions: readonly string[]) =>
      hasAnyPermissionForUser(auth.permissions, permissions),
    homeHref: resolveHomeHref(permissionNames, auth.user?.active_template),
  };
}

function resolveHomeHref(
  permissions: readonly string[],
  activeTemplate: number | null | undefined,
): string {
  if (matchesPermission(permissions, 'dashboard.analytics.view')) {
    return '/dashboard';
  }

  if (matchesPermission(permissions, 'order.order.view')) {
    return '/orders';
  }

  if (matchesPermission(permissions, 'profile.template.manage')) {
    return `/profile/templates/${activeTemplate ?? 1}`;
  }

  return '/user/account';
}
