<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OfferTicker extends Model
{
    public const THEMES = ['coral', 'emerald', 'violet', 'amber', 'sky'];

    protected $fillable = [
        'message',
        'badge',
        'href',
        'theme',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'message' => 'array',
            'badge' => 'array',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }
}
