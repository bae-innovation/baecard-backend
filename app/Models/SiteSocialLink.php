<?php

namespace App\Models;

use App\Support\ProfileSocialPlatform;
use Illuminate\Database\Eloquent\Model;

class SiteSocialLink extends Model
{
    protected $fillable = [
        'platform',
        'platform_value',
        'url',
        'label',
        'is_active',
        'show_in_floating',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'show_in_floating' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    /**
     * @return list<string>
     */
    public static function allowedPlatforms(): array
    {
        return ProfileSocialPlatform::all();
    }
}
