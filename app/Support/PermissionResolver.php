<?php

namespace App\Support;

use App\Models\User;

class PermissionResolver
{
    public static function allows(User $user, string $permission): bool
    {
        return $user->can($permission);
    }

    /**
     * @param  list<string>  $permissions
     */
    public static function allowsAny(User $user, array $permissions): bool
    {
        foreach ($permissions as $permission) {
            if ($user->can($permission)) {
                return true;
            }
        }

        return false;
    }

    public static function canViewDashboard(User $user): bool
    {
        return self::allowsAny($user, PermissionCatalog::dashboardAccessPermissions());
    }

    /**
     * @return list<array{id: int, name: string}>
     */
    public static function permissionsForUser(User $user): array
    {
        $user->loadMissing('roles.permissions', 'permissions');

        return $user->getAllPermissions()
            ->pluck('name')
            ->unique()
            ->values()
            ->map(fn (string $name, int $index) => [
                'id' => $index + 1,
                'name' => $name,
            ])
            ->all();
    }
}
