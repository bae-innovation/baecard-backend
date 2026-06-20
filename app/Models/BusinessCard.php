<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BusinessCard extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'uid',
    ];

    /**
     * @var list<string>
     */
    protected $appends = [
        'card_url',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getCardUrlAttribute(): string
    {
        return url('/api/card/'.$this->uid);
    }
}
