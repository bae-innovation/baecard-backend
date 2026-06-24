<?php

namespace App\Support;

use App\Models\User;

class RoleAbility
{
    public static function allows(User $user, string $ability): bool
    {
        $allowedRoles = config('role_abilities')[$ability] ?? [];

        if ($allowedRoles === []) {
            return false;
        }

        return $user->hasAnyRole($allowedRoles);
    }

    /**
     * @return list<string>
     */
    public static function allowedRoles(string $ability): array
    {
        return config('role_abilities')[$ability] ?? [];
    }

    /**
     * @return list<array{id: int, name: string}>
     */
    public static function permissionsForUser(User $user): array
    {
        $user->loadMissing('roles');

        $roleNames = $user->roles->pluck('name')->all();
        $permissions = [];
        $id = 1;

        foreach (config('role_abilities') as $ability => $allowedRoles) {
            if ($user->hasAnyRole($allowedRoles)) {
                $permissions[] = ['id' => $id++, 'name' => $ability];
            }
        }

        return $permissions;
    }
}
