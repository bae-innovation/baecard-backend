<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CustomerSocial extends Model
{
    protected $fillable = [
        'customer_id',
        'platform',
        'platform_value',
        'url',
        'label',
        'fn',
        'is_primary',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_primary' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }
}
