<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Contact extends Model
{
    protected $fillable = [
        'name',
        'email',
        'message',
        'is_read',
        'ip_address',
    ];

    protected function casts(): array
    {
        return [
            'is_read' => 'boolean',
        ];
    }
}
