<?php

use App\Support\PermissionCatalog;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

return new class extends Migration
{
    public function up(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $guard = PermissionCatalog::GUARD;
        $replacementPermissions = [
            'review.review.update',
            'review.review.delete',
        ];

        foreach (PermissionCatalog::definitions() as $definition) {
            if (! str_starts_with($definition['name'], 'review.review.')) {
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

        $legacyManage = Permission::query()
            ->where('name', 'review.review.manage')
            ->where('guard_name', $guard)
            ->first();

        if (! $legacyManage) {
            return;
        }

        $replacementIds = Permission::query()
            ->where('guard_name', $guard)
            ->whereIn('name', array_merge($replacementPermissions, ['review.review.create']))
            ->pluck('id');

        $roleIds = DB::table('role_has_permissions')
            ->where('permission_id', $legacyManage->id)
            ->pluck('role_id')
            ->unique();

        foreach ($roleIds as $roleId) {
            foreach ($replacementIds as $permissionId) {
                DB::table('role_has_permissions')->updateOrInsert([
                    'permission_id' => $permissionId,
                    'role_id' => $roleId,
                ]);
            }
        }

        DB::table('role_has_permissions')
            ->where('permission_id', $legacyManage->id)
            ->delete();

        DB::table('model_has_permissions')
            ->where('permission_id', $legacyManage->id)
            ->delete();

        $legacyManage->delete();
    }

    public function down(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $guard = PermissionCatalog::GUARD;

        Permission::query()->updateOrCreate(
            ['name' => 'review.review.manage', 'guard_name' => $guard],
            ['group' => 'review', 'label' => 'Manage Reviews', 'is_wildcard' => false],
        );

        $legacyManage = Permission::query()
            ->where('name', 'review.review.manage')
            ->where('guard_name', $guard)
            ->first();

        $replacementIds = Permission::query()
            ->where('guard_name', $guard)
            ->whereIn('name', ['review.review.update', 'review.review.delete'])
            ->pluck('id');

        $roleIds = DB::table('role_has_permissions')
            ->whereIn('permission_id', $replacementIds)
            ->pluck('role_id')
            ->unique();

        foreach ($roleIds as $roleId) {
            DB::table('role_has_permissions')->updateOrInsert([
                'permission_id' => $legacyManage->id,
                'role_id' => $roleId,
            ]);
        }

        Permission::query()
            ->where('guard_name', $guard)
            ->whereIn('name', ['review.review.update', 'review.review.delete'])
            ->each(function (Permission $permission): void {
                DB::table('role_has_permissions')->where('permission_id', $permission->id)->delete();
                DB::table('model_has_permissions')->where('permission_id', $permission->id)->delete();
                $permission->delete();
            });
    }
};
