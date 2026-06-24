const SUPER_ADMIN_ROLE = 'SuperAdmin';
const ADMIN_ROLE = 'Admin';
const CUSTOMER_ROLE = 'User';

export function canAssignRoles(actorRoles: readonly string[]): boolean {
  return (
    actorRoles.includes(SUPER_ADMIN_ROLE) || actorRoles.includes(ADMIN_ROLE)
  );
}

/** Roles the signed-in user is allowed to assign. */
export function getAssignableRoleNames(
  actorRoles: readonly string[],
  allRoleNames: readonly string[],
): string[] {
  const staffRoles = allRoleNames.filter((role) => role !== CUSTOMER_ROLE);

  if (actorRoles.includes(SUPER_ADMIN_ROLE)) {
    return [...staffRoles];
  }

  if (actorRoles.includes(ADMIN_ROLE)) {
    return staffRoles.filter((role) => role !== SUPER_ADMIN_ROLE);
  }

  return [];
}

export function canAssignRoleName(
  actorRoles: readonly string[],
  roleName: string,
): boolean {
  return getAssignableRoleNames(actorRoles, [roleName]).includes(roleName);
}
