<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class CardCode extends Model
{
    public const STATUS_PENDING = 'pending';

    public const STATUS_PUBLISHED = 'published';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'code',
        'name',
        'phone',
        'status',
        'user_id',
    ];

    /**
     * @var list<string>
     */
    protected $appends = [
        'scan_url',
        'profile_url',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getScanUrlAttribute(): string
    {
        return rtrim(config('baecard.public_url'), '/').'/scan/'.$this->code;
    }

    public function getProfileUrlAttribute(): ?string
    {
        if ($this->status !== self::STATUS_PUBLISHED || ! $this->user) {
            return null;
        }

        return rtrim(config('baecard.public_url'), '/').'/profile/'
            .Str::slug($this->user->name).'/'.$this->code;
    }

    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    public function isPublished(): bool
    {
        return $this->status === self::STATUS_PUBLISHED;
    }
}
