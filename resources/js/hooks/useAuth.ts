import { usePage } from '@inertiajs/react';

import type { SharedPageProps } from '@/types/inertia';
import {
  canCreateRoles,
  canCreateCustomers,
  canCreateProducts,
  canDeleteRoles,
  canDeleteCustomers,
  canDeleteProducts,
  canUpdateRoles,
  canUpdateCustomers,
  canUpdateProducts,
  canViewRoles,
  canViewCustomers,
  canViewProducts,
  canViewVendors,
  canCreateVendors,
  canUpdateVendors,
  canDeleteVendors,
  canViewWebsiteOrders,
  canUpdateWebsiteOrders,
  canViewCustomOrders,
  canCreateCustomOrders,
  canUpdateCustomOrders,
  canDeleteCustomOrders,
  DASHBOARD_ACCESS_PERMISSIONS,
  hasAnyPermissionForUser,
  hasPermissionForUser,
  isCustomerRole,
  resolveHomeHref,
} from '@/lib/permissions';

export function useAuth() {
  const { auth } = usePage<{ auth: SharedPageProps['auth'] }>().props;
  const roleNames = auth.user?.roles?.map((role) => role.name);

  return {
    user: auth.user,
    permissions: auth.permissions,
    isAuthenticated: () => auth.user !== null,
    isCustomer: () => isCustomerRole(roleNames),
    hasPermission: (permission: string) =>
      hasPermissionForUser(auth.permissions, permission),
    hasAnyPermission: (permissions: readonly string[]) =>
      hasAnyPermissionForUser(auth.permissions, permissions),
    hasAbility: (permission: string) =>
      hasPermissionForUser(auth.permissions, permission),
    hasAnyAbility: (permissions: readonly string[]) =>
      hasAnyPermissionForUser(auth.permissions, permissions),
    canViewDashboard: () =>
      !isCustomerRole(roleNames) &&
      hasAnyPermissionForUser(auth.permissions, DASHBOARD_ACCESS_PERMISSIONS),
    canViewRoles: () => canViewRoles(auth.permissions),
    canCreateRoles: () => canCreateRoles(auth.permissions),
    canUpdateRoles: () => canUpdateRoles(auth.permissions),
    canDeleteRoles: () => canDeleteRoles(auth.permissions),
    canViewCustomers: () => canViewCustomers(auth.permissions),
    canCreateCustomers: () => canCreateCustomers(auth.permissions),
    canUpdateCustomers: () => canUpdateCustomers(auth.permissions),
    canDeleteCustomers: () => canDeleteCustomers(auth.permissions),
    canViewProducts: () => canViewProducts(auth.permissions),
    canCreateProducts: () => canCreateProducts(auth.permissions),
    canUpdateProducts: () => canUpdateProducts(auth.permissions),
    canDeleteProducts: () => canDeleteProducts(auth.permissions),
    canViewVendors: () => canViewVendors(auth.permissions),
    canCreateVendors: () => canCreateVendors(auth.permissions),
    canUpdateVendors: () => canUpdateVendors(auth.permissions),
    canDeleteVendors: () => canDeleteVendors(auth.permissions),
    canViewWebsiteOrders: () => canViewWebsiteOrders(auth.permissions),
    canUpdateWebsiteOrders: () => canUpdateWebsiteOrders(auth.permissions),
    canViewCustomOrders: () => canViewCustomOrders(auth.permissions),
    canCreateCustomOrders: () => canCreateCustomOrders(auth.permissions),
    canUpdateCustomOrders: () => canUpdateCustomOrders(auth.permissions),
    canDeleteCustomOrders: () => canDeleteCustomOrders(auth.permissions),
    homeHref: resolveHomeHref(
      auth.permissions.map((permission) => permission.name),
      auth.user?.active_template,
      roleNames,
    ),
  };
}
