<?php

namespace App\Models;

use App\Support\PermissionCatalog;
use Spatie\Permission\Models\Role as SpatieRole;

class Role extends SpatieRole
{
    protected $fillable = [
        'name',
        'guard_name',
        'is_protected',
    ];

    protected function casts(): array
    {
        return [
            'is_protected' => 'boolean',
        ];
    }

    public function isProtected(): bool
    {
        return $this->is_protected || in_array($this->name, PermissionCatalog::PROTECTED_ROLES, true);
    }
}
