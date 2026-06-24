import type { Permissions } from '@/schemas/auth.schema';

/** Mirrors baecard-backend/config/role_abilities.php */
const ROLE_ABILITIES: Record<string, readonly string[]> = {
  'users.view': ['SuperAdmin', 'Admin', 'Marketing'],
  'users.create': ['SuperAdmin', 'Admin'],
  'users.update': ['SuperAdmin', 'Admin'],
  'users.delete': ['SuperAdmin', 'Admin'],
  'users.assign_role': ['SuperAdmin', 'Admin'],
  'roles.manage': ['SuperAdmin', 'Admin'],
  'dashboard.card.view': ['SuperAdmin', 'Admin', 'Marketing'],
  'dashboard.card.manage': ['SuperAdmin', 'Admin'],
  'dashboard.card.generate': ['SuperAdmin', 'Admin'],
  'dashboard.card.regenerate': ['SuperAdmin'],
  'contacts.view': ['SuperAdmin', 'Admin'],
  'contacts.view_own': ['User'],
  'contacts.create': ['User'],
  'contacts.delete': ['SuperAdmin', 'Admin'],
  'products.view': ['SuperAdmin', 'Admin', 'Marketing', 'User'],
  'products.manage': ['SuperAdmin', 'Admin', 'Marketing'],
  'reviews.view': ['SuperAdmin', 'Admin'],
  'reviews.view_own': ['User'],
  'reviews.create': ['User'],
  'reviews.manage': ['SuperAdmin', 'Admin'],
  'vendors.view': ['SuperAdmin', 'Admin', 'Marketing'],
  'vendors.manage': ['SuperAdmin', 'Admin', 'Marketing'],
  'orders.view': ['SuperAdmin', 'Admin', 'Marketing'],
  'orders.manage': ['SuperAdmin', 'Admin'],
  'appointments.view': ['SuperAdmin', 'Admin', 'Marketing'],
  'appointments.manage': ['SuperAdmin', 'Admin', 'Marketing'],
  'appointments.view_own': ['User'],
  'profile.manage': ['User'],
  'settings.manage': ['SuperAdmin', 'Admin'],
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
  const derived = derivePermissionsFromRoles(roleNames ?? []);

  if (permissions.length === 0) {
    return derived;
  }

  if ((roleNames?.length ?? 0) === 0) {
    return permissions as Permissions;
  }

  const abilityNames = new Set<string>([
    ...permissions.map((permission) => permission.name),
    ...derived.map((permission) => permission.name),
  ]);

  return [...abilityNames].map((name, index) => ({ id: index + 1, name }));
}

export function hasAbilityForUser(
  permissions: readonly { name: string }[],
  roleNames: readonly string[] | undefined,
  ability: string,
): boolean {
  return hasAbility(resolvePermissions(permissions, roleNames), ability);
}

export function hasAnyAbilityForUser(
  permissions: readonly { name: string }[],
  roleNames: readonly string[] | undefined,
  abilities: readonly string[],
): boolean {
  return abilities.some((ability) =>
    hasAbilityForUser(permissions, roleNames, ability),
  );
}
