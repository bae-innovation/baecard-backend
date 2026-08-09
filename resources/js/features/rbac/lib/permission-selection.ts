import type { PermissionGroup, PermissionItem } from '@/features/rbac/schemas/rbac.schema';

const MUTATING_ACTIONS = new Set(['create', 'update', 'delete', 'manage', 'assign_role']);
const OWN_MUTATING_ACTIONS = new Set(['create_own', 'update_own', 'delete_own']);

export function flattenPermissionNames(permissionGroups: PermissionGroup): string[] {
  return Object.values(permissionGroups)
    .flat()
    .map((permission) => permission.name);
}

export function viewDependencyFor(permissionName: string): string | null {
  if (permissionName.endsWith('.view') || permissionName.endsWith('.view_own')) {
    return null;
  }

  const parts = permissionName.split('.');

  if (parts.length < 2) {
    return null;
  }

  const action = parts[parts.length - 1];

  if (OWN_MUTATING_ACTIONS.has(action)) {
    return `${parts.slice(0, -1).join('.')}.view_own`;
  }

  if (!MUTATING_ACTIONS.has(action)) {
    return null;
  }

  return `${parts.slice(0, -1).join('.')}.view`;
}

export function mutatingDependenciesForView(
  viewPermission: string,
  availableNames: readonly string[],
): string[] {
  if (!viewPermission.endsWith('.view') && !viewPermission.endsWith('.view_own')) {
    return [];
  }

  return availableNames.filter(
    (name) => viewDependencyFor(name) === viewPermission,
  );
}

export function expandViewDependencies(
  selected: readonly string[],
  availableNames: readonly string[],
): string[] {
  const available = new Set(availableNames);
  const expanded = new Set(selected);

  for (const name of selected) {
    const viewPermission = viewDependencyFor(name);

    if (viewPermission && available.has(viewPermission)) {
      expanded.add(viewPermission);
    }
  }

  return [...expanded];
}

export function groupWildcardNames(groupPermissions: readonly PermissionItem[]): string[] {
  return groupPermissions.filter((permission) => permission.is_wildcard).map((permission) => permission.name);
}

export function isPermissionSelected(
  permissionName: string,
  selected: readonly string[],
  groupPermissions: readonly PermissionItem[],
): boolean {
  if (selected.includes(permissionName)) {
    return true;
  }

  return groupWildcardNames(groupPermissions).some((wildcard) => selected.includes(wildcard));
}

export function applyPermissionToggle(
  selected: readonly string[],
  permission: PermissionItem,
  groupPermissions: readonly PermissionItem[],
  checked: boolean,
  availableNames: readonly string[],
): string[] {
  const groupNames = groupPermissions.map((item) => item.name);
  const wildcards = groupWildcardNames(groupPermissions);
  const outsideGroup = selected.filter((name) => !groupNames.includes(name));

  if (permission.is_wildcard) {
    if (checked) {
      return expandViewDependencies(
        [...new Set([...selected, ...groupNames])],
        availableNames,
      );
    }

    return outsideGroup;
  }

  if (!checked && (permission.name.endsWith('.view') || permission.name.endsWith('.view_own'))) {
    const dependents = mutatingDependenciesForView(permission.name, availableNames);

    return selected.filter(
      (name) => name !== permission.name && !dependents.includes(name),
    );
  }

  if (checked) {
    const next = [...new Set([...selected, permission.name])];
    const nonWildcards = groupPermissions.filter((item) => !item.is_wildcard);
    const allActionsSelected = nonWildcards.every((item) => next.includes(item.name));

    const withWildcards = allActionsSelected
      ? [...new Set([...next, ...wildcards])]
      : next;

    return expandViewDependencies(withWildcards, availableNames);
  }

  const hasCoveringWildcard = wildcards.some((wildcard) => selected.includes(wildcard));

  if (hasCoveringWildcard) {
    const remaining = groupPermissions
      .filter((item) => !item.is_wildcard && item.name !== permission.name)
      .map((item) => item.name);

    return expandViewDependencies(
      [...new Set([...outsideGroup, ...remaining])],
      availableNames,
    );
  }

  return expandViewDependencies(
    selected.filter((name) => name !== permission.name),
    availableNames,
  );
}

export function applyGroupToggle(
  selected: readonly string[],
  groupPermissions: readonly PermissionItem[],
  checked: boolean,
  availableNames: readonly string[],
): string[] {
  const groupNames = groupPermissions.map((item) => item.name);
  const outsideGroup = selected.filter((name) => !groupNames.includes(name));

  if (checked) {
    return expandViewDependencies(
      [...new Set([...selected, ...groupNames])],
      availableNames,
    );
  }

  return outsideGroup;
}
