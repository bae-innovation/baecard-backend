import type { Permissions } from '@/schemas/auth.schema';

/** Mirrors baecard-backend/config/role_abilities.php */
const ROLE_ABILITIES: Record<string, readonly string[]> = {
  'users.view': ['SuperAdmin', 'Admin', 'Marketing'],
  'users.create': ['SuperAdmin', 'Admin'],
  'users.update': ['SuperAdmin', 'Admin'],
  'users.delete': ['SuperAdmin'],
  'users.assign_role': ['SuperAdmin', 'Admin'],
  'roles.manage': ['SuperAdmin'],
  'dashboard.card.view': ['SuperAdmin', 'Admin', 'Marketing'],
  'dashboard.card.generate': ['SuperAdmin', 'Admin'],
  'dashboard.card.regenerate': ['SuperAdmin'],
  'contacts.view': ['SuperAdmin', 'Admin'],
  'contacts.delete': ['SuperAdmin', 'Admin'],
  'products.view': ['SuperAdmin', 'Admin', 'Marketing'],
  'products.manage': ['SuperAdmin', 'Admin', 'Marketing'],
  'reviews.view': ['SuperAdmin', 'Admin'],
  'reviews.manage': ['SuperAdmin', 'Admin'],
  'vendors.view': ['SuperAdmin', 'Admin', 'Marketing'],
  'vendors.manage': ['SuperAdmin', 'Admin', 'Marketing'],
  'orders.view': ['SuperAdmin', 'Admin', 'Marketing'],
  'orders.manage': ['SuperAdmin', 'Admin'],
  'appointments.view': ['SuperAdmin', 'Admin', 'Marketing'],
  'appointments.manage': ['SuperAdmin', 'Admin', 'Marketing'],
  'appointments.view_own': ['User'],
};

export function derivePermissionsFromRoles(
  roleNames: readonly string[],
): Permissions {
  const roleSet = new Set(roleNames);
  const permissions: Permissions = [];
  let id = 1;

  for (const [ability, allowedRoles] of Object.entries(ROLE_ABILITIES)) {
    if (allowedRoles.some((role) => roleSet.has(role))) {
      permissions.push({ id: id++, name: ability });
    }
  }

  return permissions;
}

export function hasAbility(
  permissions: readonly { name: string }[],
  ability: string,
): boolean {
  return permissions.some((permission) => permission.name === ability);
}

/** Use stored permissions, or derive from roles when the persisted session is stale. */
export function resolvePermissions(
  permissions: readonly { name: string }[],
  roleNames: readonly string[] | undefined,
): Permissions {
  if (permissions.length > 0) {
    return permissions as Permissions;
  }
  return derivePermissionsFromRoles(roleNames ?? []);
}

export function hasAbilityForUser(
  permissions: readonly { name: string }[],
  roleNames: readonly string[] | undefined,
  ability: string,
): boolean {
  return hasAbility(resolvePermissions(permissions, roleNames), ability);
}
