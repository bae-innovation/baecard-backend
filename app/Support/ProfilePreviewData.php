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
        $user->loadMissing(['cardCode', 'customerSocials', 'userServices']);

        $cardCode = $user->cardCode;
        $activeTemplate = $templateOverride ?? ($user->active_template ?? 1);
        $templateSettings = $user->template_settings ?? [];
        $coverImage = $templateSettings[(string) $activeTemplate]['cover_image']
            ?? $templateSettings[$activeTemplate]['cover_image']
            ?? null;

        $visibility = array_merge(
            ProfileSocialPlatform::defaultVisibility(),
            $user->profile_visibility ?? [],
        );

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
                'name' => $user->name,
                'phone' => $user->phone,
                'scan_url' => url('/PREVIEW'),
                'profile_url' => null,
                'status' => CardCode::STATUS_PUBLISHED,
            ],
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'bio' => $user->bio,
                'job_title' => $user->job_title,
                'company' => $user->company,
                'avatar_url' => $user->avatar_url,
                'active_template' => $activeTemplate,
                'profile_visibility' => $visibility,
                'cover_image_url' => $coverImage ? asset($coverImage) : null,
            ],
            'social_links' => $user->customerSocials()
                ->orderBy('sort_order')
                ->get()
                ->values()
                ->all(),
            'services' => $user->userServices()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->get()
                ->values()
                ->all(),
        ];
    }
}
