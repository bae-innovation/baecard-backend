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
      'vendor.vendor.create',
      'vendor.vendor.update',
      'vendor.vendor.delete',
    ];

    foreach (PermissionCatalog::definitions() as $definition) {
      if (! str_starts_with($definition['name'], 'vendor.vendor.')) {
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
      ->where('name', 'vendor.vendor.manage')
      ->where('guard_name', $guard)
      ->first();

    if (! $legacyManage) {
      return;
    }

    $replacementIds = Permission::query()
      ->where('guard_name', $guard)
      ->whereIn('name', $replacementPermissions)
      ->pluck('id', 'name');

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

    $legacyManage = Permission::query()->updateOrCreate(
      [
        'name' => 'vendor.vendor.manage',
        'guard_name' => $guard,
      ],
      [
        'group' => 'vendor',
        'label' => 'Manage Vendors',
        'is_wildcard' => false,
      ],
    );

    $replacementIds = Permission::query()
      ->where('guard_name', $guard)
      ->whereIn('name', [
        'vendor.vendor.create',
        'vendor.vendor.update',
        'vendor.vendor.delete',
      ])
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
      ->whereIn('name', [
        'vendor.vendor.create',
        'vendor.vendor.update',
        'vendor.vendor.delete',
      ])
      ->each(function (Permission $permission): void {
        DB::table('role_has_permissions')
          ->where('permission_id', $permission->id)
          ->delete();

        DB::table('model_has_permissions')
          ->where('permission_id', $permission->id)
          ->delete();

        $permission->delete();
      });
  }
};
