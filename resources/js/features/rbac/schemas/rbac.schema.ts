export type PermissionItem = {
  id: number;
  name: string;
  label: string;
  is_wildcard: boolean;
};

export type PermissionGroup = Record<string, PermissionItem[]>;

export type RoleFormMode = 'create' | 'edit';
