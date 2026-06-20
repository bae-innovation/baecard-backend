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
}
