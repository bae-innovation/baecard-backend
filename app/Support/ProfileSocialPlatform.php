<?php

namespace App\Support;

class ProfileSocialPlatform
{
    /**
     * @return list<string>
     */
    public static function all(): array
    {
        return [
            'behance',
            'bigo_live',
            'discord',
            'facebook',
            'messenger',
            'github',
            'instagram',
            'linkedin',
            'pinterest',
            'skype',
            'snapchat',
            'spotify',
            'stackoverflow',
            'teams',
            'telegram',
            'tiktok',
            'twitter',
            'viber',
            'vimeo',
            'wechat',
            'website',
            'whatsapp',
            'youtube',
            'phone',
            'email',
            'other',
        ];
    }

    /**
     * @return array<string, bool>
     */
    public static function defaultVisibility(): array
    {
        return [
            'bio' => true,
            'phones' => true,
            'emails' => true,
            'social' => true,
            'services' => true,
            'cover' => true,
            'qr' => true,
        ];
    }
}
