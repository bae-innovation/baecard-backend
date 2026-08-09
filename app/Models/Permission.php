<?php

namespace App\Models;

use Spatie\Permission\Models\Permission as SpatiePermission;

class Permission extends SpatiePermission
{
    protected $fillable = [
        'name',
        'guard_name',
        'group',
        'label',
        'is_wildcard',
    ];

    protected function casts(): array
    {
        return [
            'is_wildcard' => 'boolean',
        ];
    }
}
