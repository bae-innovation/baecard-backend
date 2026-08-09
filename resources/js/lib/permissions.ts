import type { Permissions } from '@/schemas/auth.schema';

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
