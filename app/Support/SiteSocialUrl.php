<?php

namespace App\Support;

use App\Models\SiteSocialLink;

class SiteSocialUrl
{
    /**
     * @var array<string, string>
     */
    private const PATTERNS = [
        'instagram' => 'https://instagram.com/{v}',
        'twitter' => 'https://twitter.com/{v}',
        'facebook' => 'https://facebook.com/{v}',
        'linkedin' => 'https://linkedin.com/in/{v}',
        'tiktok' => 'https://tiktok.com/@{v}',
        'github' => 'https://github.com/{v}',
        'whatsapp' => 'https://wa.me/{v}',
        'telegram' => 'https://t.me/{v}',
        'youtube' => 'https://youtube.com/@{v}',
        'snapchat' => 'https://snapchat.com/add/{v}',
        'behance' => 'https://behance.net/{v}',
        'pinterest' => 'https://pinterest.com/{v}',
        'spotify' => 'https://open.spotify.com/user/{v}',
        'vimeo' => 'https://vimeo.com/{v}',
        'discord' => 'https://discord.com/users/{v}',
        'messenger' => 'https://m.me/{v}',
        'website' => '{v}',
        'phone' => 'tel:{v}',
        'email' => 'mailto:{v}',
    ];

    public static function build(string $platform, string $platformValue, ?string $customUrl = null): string
    {
        $trimmedCustom = trim((string) $customUrl);
        if ($trimmedCustom !== '') {
            return $trimmedCustom;
        }

        $value = trim($platformValue);

        if ($platform === 'whatsapp') {
            return 'https://wa.me/'.preg_replace('/\D+/', '', $value);
        }

        if ($platform === 'phone') {
            return 'tel:'.preg_replace('/\s+/', '', $value);
        }

        if (str_starts_with($value, 'http://') || str_starts_with($value, 'https://')) {
            return $value;
        }

        $pattern = self::PATTERNS[$platform] ?? null;
        if (! $pattern) {
            return $value;
        }

        return str_replace('{v}', rawurlencode($value), $pattern);
    }

    /**
     * @return array<string, mixed>
     */
    public static function toPublicShape(SiteSocialLink $link): array
    {
        return [
            'id' => (string) $link->id,
            'platform' => $link->platform,
            'platform_value' => $link->platform_value,
            'url' => $link->url,
            'label' => $link->label,
            'href' => self::build($link->platform, $link->platform_value, $link->url),
            'show_in_floating' => $link->show_in_floating,
        ];
    }
}
