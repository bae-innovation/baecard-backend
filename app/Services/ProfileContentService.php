<?php

namespace App\Services;

use App\Models\User;
use App\Support\ProfileSocialPlatform;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProfileContentService
{
    public function __construct(
        protected ImageUploadService $imageUploadService,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function forUser(User $user): array
    {
        $profile = $user->ensureProfile();

        return [
            'first_name' => $profile->first_name,
            'last_name' => $profile->last_name,
            'login_email' => $user->email,
            'personal_email' => $profile->personal_email,
            'personal_phone_code' => $profile->personal_phone_code ?? '+880',
            'personal_phone' => $profile->personal_phone,
            'personal_address' => $profile->personal_address,
            'bio' => $profile->bio,
            'company' => $profile->company,
            'designation' => $profile->designation,
            'work_email' => $profile->work_email,
            'work_phone_code' => $profile->work_phone_code ?? '+880',
            'work_phone' => $profile->work_phone,
            'work_address' => $profile->work_address,
            'social_links' => $this->normalizeSocialLinks($profile->social_links ?? []),
            'profile_image_url' => $profile->profile_image_url,
            'cover_image_url' => $profile->cover_image_url,
            'active_template' => $profile->active_template ?? 1,
        ];
    }

    public function updateForUser(User $user, array $data, Request $request): void
    {
        DB::transaction(function () use ($user, $data, $request): void {
            $profile = $user->ensureProfile();

            $profileFields = [
                'first_name' => $data['first_name'] ?? null,
                'last_name' => $data['last_name'] ?? null,
                'personal_email' => $data['personal_email'] ?? null,
                'personal_phone_code' => $data['personal_phone_code'] ?? null,
                'personal_phone' => $data['personal_phone'] ?? null,
                'personal_address' => $data['personal_address'] ?? null,
                'bio' => $data['bio'] ?? null,
                'company' => $data['company'] ?? null,
                'designation' => $data['designation'] ?? null,
                'work_email' => $data['work_email'] ?? null,
                'work_phone_code' => $data['work_phone_code'] ?? null,
                'work_phone' => $data['work_phone'] ?? null,
                'work_address' => $data['work_address'] ?? null,
                'social_links' => $this->normalizeSocialLinks($data['social_links'] ?? []),
            ];

            if ($request->hasFile('profile_image')) {
                $profileFields['profile_image'] = $this->imageUploadService->replace(
                    $request->file('profile_image'),
                    $profile->profile_image,
                    'profile/avatars',
                );
            } elseif ($request->boolean('remove_profile_image')) {
                $this->imageUploadService->delete($profile->profile_image);
                $profileFields['profile_image'] = null;
            }

            if ($request->hasFile('cover_image')) {
                $profileFields['cover_image'] = $this->imageUploadService->replace(
                    $request->file('cover_image'),
                    $profile->cover_image,
                    'profile/covers',
                );
            } elseif ($request->boolean('remove_cover_image')) {
                $this->imageUploadService->delete($profile->cover_image);
                $profileFields['cover_image'] = null;
            }

            $profile->update($profileFields);

            $displayName = trim(implode(' ', array_filter([
                $profileFields['first_name'],
                $profileFields['last_name'],
            ])));

            if ($displayName !== '') {
                $user->update(['name' => $displayName]);
            }
        });
    }

    /**
     * @param  array<int, array<string, mixed>>|null  $links
     * @return list<array{platform: string, url: string}>
     */
    public function normalizeSocialLinks(?array $links): array
    {
        if (! is_array($links)) {
            return [];
        }

        $normalized = [];

        foreach ($links as $link) {
            if (! is_array($link)) {
                continue;
            }

            $platform = trim((string) ($link['platform'] ?? ''));
            $url = trim((string) ($link['url'] ?? ''));

            if ($platform === '' || $url === '') {
                continue;
            }

            if (! in_array($platform, ProfileSocialPlatform::all(), true)) {
                continue;
            }

            $normalized[] = [
                'platform' => $platform,
                'url' => $url,
            ];
        }

        return $normalized;
    }
}
