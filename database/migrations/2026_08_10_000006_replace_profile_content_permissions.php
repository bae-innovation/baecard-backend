<?php

use App\Enums\UserRole;
use App\Models\Role;
use App\Support\PermissionCatalog;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

return new class extends Migration
{
    /** @var list<string> */
    private const REMOVED_PERMISSIONS = [
        'profile.social.manage',
        'profile.service.manage',
    ];

    public function up(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $guard = PermissionCatalog::GUARD;

        $ensureNames = array_values(array_unique(array_merge(
            ['profile.content.manage'],
            PermissionCatalog::customerRolePermissions(),
        )));

        foreach (PermissionCatalog::definitions() as $definition) {
            if (! in_array($definition['name'], $ensureNames, true)) {
                continue;
            }

            Permission::query()->updateOrCreate(
                [
                    'name' => $definition['name'],
                    'guard_name' => $guard,
                ],
                [
                    'group' => $definition['group'],
                    'label' => $definition['label'],
                    'is_wildcard' => $definition['is_wildcard'],
                ],
            );
        }

        $contentPermission = Permission::query()
            ->where('name', 'profile.content.manage')
            ->where('guard_name', $guard)
            ->first();

        if (! $contentPermission) {
            return;
        }

        $legacyPermissionIds = Permission::query()
            ->where('guard_name', $guard)
            ->whereIn('name', self::REMOVED_PERMISSIONS)
            ->pluck('id');

        $roleIds = DB::table('role_has_permissions')
            ->whereIn('permission_id', $legacyPermissionIds)
            ->pluck('role_id')
            ->unique();

        foreach ($roleIds as $roleId) {
            DB::table('role_has_permissions')->updateOrInsert([
                'permission_id' => $contentPermission->id,
                'role_id' => $roleId,
            ]);
        }

        foreach ($legacyPermissionIds as $permissionId) {
            DB::table('role_has_permissions')->where('permission_id', $permissionId)->delete();
            DB::table('model_has_permissions')->where('permission_id', $permissionId)->delete();
        }

        Permission::query()
            ->where('guard_name', $guard)
            ->whereIn('name', self::REMOVED_PERMISSIONS)
            ->delete();

        $userRole = Role::query()
            ->where('name', UserRole::User->value)
            ->where('guard_name', $guard)
            ->first();

        if ($userRole) {
            $userRole->syncPermissions(PermissionCatalog::customerRolePermissions());
        }
    }

    public function down(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $guard = PermissionCatalog::GUARD;

        foreach (['profile.social.manage', 'profile.service.manage'] as $name) {
            Permission::query()->updateOrCreate(
                ['name' => $name, 'guard_name' => $guard],
                [
                    'group' => 'profile',
                    'label' => $name === 'profile.social.manage' ? 'Manage Social Links' : 'Manage Services',
                    'is_wildcard' => false,
                ],
            );
        }

        Permission::query()
            ->where('guard_name', $guard)
            ->where('name', 'profile.content.manage')
            ->each(function (Permission $permission): void {
                DB::table('role_has_permissions')->where('permission_id', $permission->id)->delete();
                DB::table('model_has_permissions')->where('permission_id', $permission->id)->delete();
                $permission->delete();
            });
    }
};
