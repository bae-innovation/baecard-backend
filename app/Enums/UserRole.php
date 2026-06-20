<?php

namespace App\Enums;

use Spatie\Permission\Models\Role;

enum UserRole: string
{
    case SuperAdmin = 'SuperAdmin';
    case Admin = 'Admin';
    case Marketing = 'Marketing';
    case User = 'User';

    public const GUARD = 'sanctum';

    /**
     * @return list<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public static function ensureExists(self $role): void
    {
        Role::firstOrCreate([
            'name' => $role->value,
            'guard_name' => self::GUARD,
        ]);
    }

    public static function ensureAllExist(): void
    {
        foreach (self::cases() as $role) {
            self::ensureExists($role);
        }
    }
}
