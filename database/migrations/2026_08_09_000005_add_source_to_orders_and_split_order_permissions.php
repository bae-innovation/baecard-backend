<?php

use App\Support\PermissionCatalog;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->enum('source', ['website', 'custom'])->default('website')->after('order_number');
        });

        DB::table('orders')
            ->whereNotNull('created_by')
            ->update(['source' => 'custom']);

        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $guard = PermissionCatalog::GUARD;

        foreach (PermissionCatalog::definitions() as $definition) {
            if (! str_starts_with($definition['name'], 'order.')) {
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

        $legacyMap = [
            'order.order.view' => ['order.website_order.view', 'order.custom_order.view'],
            'order.order.create' => ['order.custom_order.create'],
            'order.order.update' => ['order.website_order.update', 'order.custom_order.update'],
            'order.order.delete' => ['order.custom_order.delete'],
            'order.order.manage' => [
                'order.website_order.view',
                'order.website_order.update',
                'order.custom_order.view',
                'order.custom_order.create',
                'order.custom_order.update',
                'order.custom_order.delete',
            ],
        ];

        foreach ($legacyMap as $legacyName => $replacementNames) {
            $legacy = Permission::query()
                ->where('name', $legacyName)
                ->where('guard_name', $guard)
                ->first();

            if (! $legacy) {
                continue;
            }

            $replacementIds = Permission::query()
                ->where('guard_name', $guard)
                ->whereIn('name', $replacementNames)
                ->pluck('id');

            $roleIds = DB::table('role_has_permissions')
                ->where('permission_id', $legacy->id)
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
                ->where('permission_id', $legacy->id)
                ->delete();

            DB::table('model_has_permissions')
                ->where('permission_id', $legacy->id)
                ->delete();

            $legacy->delete();
        }
    }

    public function down(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $guard = PermissionCatalog::GUARD;
        $legacyNames = [
            'order.order.view',
            'order.order.create',
            'order.order.update',
            'order.order.delete',
        ];

        foreach ($legacyNames as $legacyName) {
            Permission::query()->updateOrCreate(
                ['name' => $legacyName, 'guard_name' => $guard],
                ['group' => 'order', 'label' => $legacyName, 'is_wildcard' => false],
            );
        }

        Permission::query()
            ->where('guard_name', $guard)
            ->whereIn('name', [
                'order.website_order.view',
                'order.website_order.update',
                'order.custom_order.view',
                'order.custom_order.create',
                'order.custom_order.update',
                'order.custom_order.delete',
            ])
            ->each(function (Permission $permission): void {
                DB::table('role_has_permissions')->where('permission_id', $permission->id)->delete();
                DB::table('model_has_permissions')->where('permission_id', $permission->id)->delete();
                $permission->delete();
            });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('source');
        });
    }
};
