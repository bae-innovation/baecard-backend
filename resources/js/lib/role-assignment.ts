const SUPER_ADMIN_ROLE = 'SuperAdmin';
const ADMIN_ROLE = 'Admin';

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
  if (actorRoles.includes(SUPER_ADMIN_ROLE)) {
    return [...allRoleNames];
  }

  if (actorRoles.includes(ADMIN_ROLE)) {
    return allRoleNames.filter((role) => role !== SUPER_ADMIN_ROLE);
  }

  return [];
}

export function canAssignRoleName(
  actorRoles: readonly string[],
  roleName: string,
): boolean {
  return getAssignableRoleNames(actorRoles, [roleName]).includes(roleName);
}
