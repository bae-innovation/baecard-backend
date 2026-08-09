<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Role;
use App\Support\PermissionCatalog;
use Illuminate\Database\Seeder;
use Spatie\Permission\PermissionRegistrar;

class RoleHasPermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $this->syncRole(UserRole::SuperAdmin->value, [PermissionCatalog::GLOBAL_WILDCARD]);
        $this->syncRole(UserRole::Admin->value, PermissionCatalog::adminPermissions());
        $this->syncRole(UserRole::Marketing->value, PermissionCatalog::marketingPermissions());
        $this->syncRole(UserRole::User->value, PermissionCatalog::customerRolePermissions());

        $this->command?->info('Role permissions seeded successfully.');
    }

    /**
     * @param  list<string>  $permissionNames
     */
    private function syncRole(string $roleName, array $permissionNames): void
    {
        $role = Role::query()
            ->where('name', $roleName)
            ->where('guard_name', PermissionCatalog::GUARD)
            ->first();

        if (! $role) {
            return;
        }

        $role->syncPermissions($permissionNames);
    }
}
