import type { Permissions } from '@/schemas/auth.schema';

export const RBAC_ROLE_VIEW_PERMISSIONS = ['rbac.role.view', 'rbac.*'] as const;

export function canViewRoles(
  permissions: readonly { name: string }[],
): boolean {
  return hasAnyPermission(permissions, RBAC_ROLE_VIEW_PERMISSIONS);
}

export function canCreateRoles(
  permissions: readonly { name: string }[],
): boolean {
  return hasPermission(permissions, 'rbac.role.create');
}

export function canUpdateRoles(
  permissions: readonly { name: string }[],
): boolean {
  return hasPermission(permissions, 'rbac.role.update');
}

export function canDeleteRoles(
  permissions: readonly { name: string }[],
): boolean {
  return hasPermission(permissions, 'rbac.role.delete');
}

export const CUSTOMER_VIEW_PERMISSIONS = [
  'customer.customer.view',
  'customer.*',
] as const;

export function canViewCustomers(
  permissions: readonly { name: string }[],
): boolean {
  return hasAnyPermission(permissions, CUSTOMER_VIEW_PERMISSIONS);
}

export function canCreateCustomers(
  permissions: readonly { name: string }[],
): boolean {
  return hasPermission(permissions, 'customer.customer.create');
}

export function canUpdateCustomers(
  permissions: readonly { name: string }[],
): boolean {
  return hasPermission(permissions, 'customer.customer.update');
}

export function canDeleteCustomers(
  permissions: readonly { name: string }[],
): boolean {
  return hasPermission(permissions, 'customer.customer.delete');
}

export const PRODUCT_VIEW_PERMISSIONS = [
  'product.product.view',
  'product.*',
] as const;

export function canViewProducts(
  permissions: readonly { name: string }[],
): boolean {
  return hasAnyPermission(permissions, PRODUCT_VIEW_PERMISSIONS);
}

export function canCreateProducts(
  permissions: readonly { name: string }[],
): boolean {
  return hasPermission(permissions, 'product.product.create');
}

export function canUpdateProducts(
  permissions: readonly { name: string }[],
): boolean {
  return hasPermission(permissions, 'product.product.update');
}

export function canDeleteProducts(
  permissions: readonly { name: string }[],
): boolean {
  return hasPermission(permissions, 'product.product.delete');
}

export const VENDOR_VIEW_PERMISSIONS = [
  'vendor.vendor.view',
  'vendor.*',
] as const;

export function canViewVendors(
  permissions: readonly { name: string }[],
): boolean {
  return hasAnyPermission(permissions, VENDOR_VIEW_PERMISSIONS);
}

export function canCreateVendors(
  permissions: readonly { name: string }[],
): boolean {
  return hasPermission(permissions, 'vendor.vendor.create');
}

export function canUpdateVendors(
  permissions: readonly { name: string }[],
): boolean {
  return hasPermission(permissions, 'vendor.vendor.update');
}

export function canDeleteVendors(
  permissions: readonly { name: string }[],
): boolean {
  return hasPermission(permissions, 'vendor.vendor.delete');
}

export const WEBSITE_ORDER_VIEW_PERMISSIONS = [
  'order.website_order.view',
  'order.*',
] as const;

export function canViewWebsiteOrders(
  permissions: readonly { name: string }[],
): boolean {
  return hasAnyPermission(permissions, WEBSITE_ORDER_VIEW_PERMISSIONS);
}

export function canUpdateWebsiteOrders(
  permissions: readonly { name: string }[],
): boolean {
  return hasPermission(permissions, 'order.website_order.update');
}

export const CUSTOM_ORDER_VIEW_PERMISSIONS = [
  'order.custom_order.view',
  'order.*',
] as const;

export function canViewCustomOrders(
  permissions: readonly { name: string }[],
): boolean {
  return hasAnyPermission(permissions, CUSTOM_ORDER_VIEW_PERMISSIONS);
}

export function canCreateCustomOrders(
  permissions: readonly { name: string }[],
): boolean {
  return hasPermission(permissions, 'order.custom_order.create');
}

export function canUpdateCustomOrders(
  permissions: readonly { name: string }[],
): boolean {
  return hasPermission(permissions, 'order.custom_order.update');
}

export function canDeleteCustomOrders(
  permissions: readonly { name: string }[],
): boolean {
  return hasPermission(permissions, 'order.custom_order.delete');
}

export const DASHBOARD_ACCESS_PERMISSIONS = [
  'dashboard.analytics.view',
  'dashboard.*',
] as const;

export const CUSTOMER_ROLE_NAME = 'User';

export function isCustomerRole(roleNames: readonly string[] | undefined): boolean {
  return roleNames?.includes(CUSTOMER_ROLE_NAME) ?? false;
}

export function resolveCustomerHomeHref(activeTemplate?: number | null): string {
  const template = Math.min(4, Math.max(1, activeTemplate ?? 1));

  return `/profile/templates/${template}`;
}

export function resolveHomeHref(
  permissions: readonly string[],
  activeTemplate: number | null | undefined,
  roleNames: readonly string[] | undefined,
): string {
  if (isCustomerRole(roleNames)) {
    return resolveCustomerHomeHref(activeTemplate);
  }

  if (
    DASHBOARD_ACCESS_PERMISSIONS.some((permission) =>
      matchesPermission(permissions, permission),
    )
  ) {
    return '/dashboard';
  }

  if (matchesPermission(permissions, 'order.website_order.view')) {
    return '/orders';
  }

  if (matchesPermission(permissions, 'order.custom_order.view')) {
    return '/custom-orders';
  }

  if (matchesPermission(permissions, 'profile.template.manage')) {
    return resolveCustomerHomeHref(activeTemplate);
  }

  return '/user/account';
}

export function canViewDashboard(
  permissions: readonly { name: string }[],
): boolean {
  return hasAnyPermission(permissions, DASHBOARD_ACCESS_PERMISSIONS);
}

export function hasPermission(
  permissions: readonly { name: string }[],
  permission: string,
): boolean {
  const names = permissions.map((item) => item.name);

  return matchesPermission(names, permission);
}

export function hasAnyPermission(
  permissions: readonly { name: string }[],
  required: readonly string[],
): boolean {
  return required.some((permission) => hasPermission(permissions, permission));
}

export function matchesPermission(
  userPermissions: readonly string[],
  required: string,
): boolean {
  if (userPermissions.includes(required)) {
    return true;
  }

  if (userPermissions.includes('*')) {
    return true;
  }

  const parts = required.split('.');

  for (let index = parts.length - 1; index > 0; index -= 1) {
    const wildcard = `${parts.slice(0, index).join('.')}.*`;

    if (userPermissions.includes(wildcard)) {
      return true;
    }
  }

  return false;
}

export function hasPermissionForUser(
  permissions: readonly { name: string }[],
  permission: string,
): boolean {
  return hasPermission(permissions, permission);
}

export function hasAnyPermissionForUser(
  permissions: readonly { name: string }[],
  required: readonly string[],
): boolean {
  return hasAnyPermission(permissions, required);
}

/** @deprecated Use hasPermission */
export function hasAbility(
  permissions: readonly { name: string }[],
  ability: string,
): boolean {
  return hasPermission(permissions, ability);
}

/** @deprecated Use hasAnyPermission */
export function hasAnyAbility(
  permissions: readonly { name: string }[],
  abilities: readonly string[],
): boolean {
  return hasAnyPermission(permissions, abilities);
}

/** @deprecated Use hasPermissionForUser */
export function hasAbilityForUser(
  permissions: readonly { name: string }[],
  _roleNames: readonly string[] | undefined,
  ability: string,
): boolean {
  return hasPermission(permissions, ability);
}

/** @deprecated Use hasAnyPermissionForUser */
export function hasAnyAbilityForUser(
  permissions: readonly { name: string }[],
  _roleNames: readonly string[] | undefined,
  abilities: readonly string[],
): boolean {
  return hasAnyPermission(permissions, abilities);
}

/** @deprecated Permissions now come from the database only. */
export function derivePermissionsFromRoles(
  _roleNames: readonly string[],
): Permissions {
  return [];
}

/** @deprecated Permissions now come from the database only. */
export function resolvePermissions(
  permissions: readonly { name: string }[],
  _roleNames: readonly string[] | undefined,
): Permissions {
  return permissions as Permissions;
}
