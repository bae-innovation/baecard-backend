<?php

namespace App\Models;

use Database\Factories\CustomerProfileFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CustomerProfile extends Model
{
    /** @use HasFactory<CustomerProfileFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'profile_image',
        'cover_image',
        'first_name',
        'last_name',
        'personal_email',
        'personal_phone_code',
        'personal_phone',
        'personal_address',
        'bio',
        'company',
        'designation',
        'work_email',
        'work_phone_code',
        'work_phone',
        'work_address',
        'social_links',
        'active_template',
    ];

    /**
     * @var list<string>
     */
    protected $appends = [
        'profile_image_url',
        'cover_image_url',
    ];

    protected function casts(): array
    {
        return [
            'active_template' => 'integer',
            'social_links' => 'array',
        ];
    }

    protected function profileImageUrl(): Attribute
    {
        return Attribute::get(fn (): ?string => $this->profile_image ? asset($this->profile_image) : null);
    }

    protected function coverImageUrl(): Attribute
    {
        return Attribute::get(fn (): ?string => $this->cover_image ? asset($this->cover_image) : null);
    }

    public function displayName(): string
    {
        $name = trim(implode(' ', array_filter([$this->first_name, $this->last_name])));

        return $name !== '' ? $name : ($this->user?->name ?? '');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
