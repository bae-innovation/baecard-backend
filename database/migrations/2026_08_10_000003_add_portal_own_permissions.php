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
    /** @var array<string, list<string>> */
    private const BACKFILL_MAP = [
        'appointment.appointment.view_own' => [
            'appointment.appointment.create_own',
            'appointment.appointment.update_own',
            'appointment.appointment.delete_own',
        ],
        'contact.contact.view_own' => [
            'contact.contact.create_own',
        ],
        'review.review.view_own' => [
            'review.review.create_own',
        ],
    ];

    /** @var list<string> */
    private const STAFF_REPLACEMENTS = [
        'contact.contact.create' => 'contact.contact.create_own',
        'review.review.create' => 'review.review.create_own',
    ];

    public function up(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $guard = PermissionCatalog::GUARD;
        $newPermissionNames = [
            'appointment.appointment.create_own',
            'appointment.appointment.update_own',
            'appointment.appointment.delete_own',
            'contact.contact.create_own',
            'contact.contact.delete_own',
            'review.review.create_own',
            'review.review.update_own',
            'review.review.delete_own',
        ];

        foreach (PermissionCatalog::definitions() as $definition) {
            if (! in_array($definition['name'], $newPermissionNames, true)) {
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

        $userRole = Role::query()
            ->where('name', UserRole::User->value)
            ->where('guard_name', $guard)
            ->first();

        foreach (self::BACKFILL_MAP as $viewOwn => $ownPermissions) {
            $viewOwnPermission = Permission::query()
                ->where('name', $viewOwn)
                ->where('guard_name', $guard)
                ->first();

            if (! $viewOwnPermission) {
                continue;
            }

            $roleIds = DB::table('role_has_permissions')
                ->where('permission_id', $viewOwnPermission->id)
                ->pluck('role_id')
                ->unique();

            $permissionIds = Permission::query()
                ->where('guard_name', $guard)
                ->whereIn('name', $ownPermissions)
                ->pluck('id');

            foreach ($roleIds as $roleId) {
                foreach ($permissionIds as $permissionId) {
                    DB::table('role_has_permissions')->updateOrInsert([
                        'permission_id' => $permissionId,
                        'role_id' => $roleId,
                    ]);
                }
            }
        }

        if ($userRole) {
            foreach (self::STAFF_REPLACEMENTS as $staffPermission => $ownPermission) {
                $staff = Permission::query()
                    ->where('name', $staffPermission)
                    ->where('guard_name', $guard)
                    ->first();

                $own = Permission::query()
                    ->where('name', $ownPermission)
                    ->where('guard_name', $guard)
                    ->first();

                if ($staff && $own) {
                    DB::table('role_has_permissions')
                        ->where('role_id', $userRole->id)
                        ->where('permission_id', $staff->id)
                        ->delete();

                    DB::table('role_has_permissions')->updateOrInsert([
                        'permission_id' => $own->id,
                        'role_id' => $userRole->id,
                    ]);
                }
            }

            $userRole->syncPermissions(PermissionCatalog::customerRolePermissions());
        }
    }

    public function down(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $guard = PermissionCatalog::GUARD;

        Permission::query()
            ->where('guard_name', $guard)
            ->whereIn('name', [
                'appointment.appointment.create_own',
                'appointment.appointment.update_own',
                'appointment.appointment.delete_own',
                'contact.contact.create_own',
                'contact.contact.delete_own',
                'review.review.create_own',
                'review.review.update_own',
                'review.review.delete_own',
            ])
            ->each(function (Permission $permission): void {
                DB::table('role_has_permissions')->where('permission_id', $permission->id)->delete();
                DB::table('model_has_permissions')->where('permission_id', $permission->id)->delete();
                $permission->delete();
            });
    }
};
