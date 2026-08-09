<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Support\PermissionCatalog;
use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        foreach (UserRole::values() as $roleName) {
            Role::query()->updateOrCreate(
                [
                    'name' => $roleName,
                    'guard_name' => UserRole::GUARD,
                ],
                [
                    'is_protected' => in_array($roleName, PermissionCatalog::PROTECTED_ROLES, true),
                ],
            );
        }

        $this->command?->info('Roles seeded successfully.');
    }
}
