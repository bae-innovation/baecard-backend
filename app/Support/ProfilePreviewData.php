<?php

namespace App\Support;

use App\Models\CardCode;
use App\Models\User;

class ProfilePreviewData
{
    /**
     * @return array<string, mixed>
     */
    public static function forUser(User $user, ?int $templateOverride = null): array
    {
        $user->loadMissing(['cardCode', 'profile']);

        $profile = $user->profile;
        $cardCode = $user->cardCode;
        $activeTemplate = $templateOverride ?? ($profile?->active_template ?? 1);
        $displayName = $profile?->displayName() ?: $user->name;

        return [
            'card' => $cardCode ? [
                'code' => $cardCode->code,
                'name' => $cardCode->name,
                'phone' => $cardCode->phone,
                'scan_url' => $cardCode->scan_url,
                'profile_url' => $cardCode->profile_url,
                'status' => $cardCode->status,
            ] : [
                'code' => 'PREVIEW',
                'name' => $displayName,
                'phone' => $profile?->personal_phone,
                'scan_url' => url('/PREVIEW'),
                'profile_url' => null,
                'status' => CardCode::STATUS_PUBLISHED,
            ],
            'user' => [
                'name' => $displayName,
                'first_name' => $profile?->first_name,
                'last_name' => $profile?->last_name,
                'email' => $profile?->personal_email ?: $user->email,
                'personal_email' => $profile?->personal_email,
                'personal_phone' => self::formatPhone($profile?->personal_phone_code, $profile?->personal_phone),
                'personal_address' => $profile?->personal_address,
                'work_email' => $profile?->work_email,
                'work_phone' => self::formatPhone($profile?->work_phone_code, $profile?->work_phone),
                'work_address' => $profile?->work_address,
                'bio' => $profile?->bio,
                'company' => $profile?->company,
                'designation' => $profile?->designation,
                'avatar_url' => $profile?->profile_image_url,
                'cover_image_url' => $profile?->cover_image_url,
                'active_template' => $activeTemplate,
            ],
            'social_links' => $profile?->social_links ?? [],
        ];
    }

    private static function formatPhone(?string $code, ?string $number): ?string
    {
        $number = trim((string) $number);

        if ($number === '') {
            return null;
        }

        $code = trim((string) $code);

        if ($code === '') {
            return $number;
        }

        return rtrim($code, ' ').' '.$number;
    }
}
