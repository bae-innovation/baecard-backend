<?php

namespace App\Services;

use App\Models\Setting;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingService
{
    use ApiResponseTrait;

    public const PAGE_GROUPS = [
        'general',
        'appearance',
    ];

    public const DATA_GROUPS = [
        'general',
        'branding',
        'business',
        'social',
        'email',
    ];

    public const UPDATABLE_GROUPS = self::DATA_GROUPS;

    public function __construct(
        protected BrandingLogoService $brandingLogoService,
    ) {}

    public static function isValidGroup(string $group): bool
    {
        return in_array($group, self::DATA_GROUPS, true);
    }

    public static function isPageGroup(string $group): bool
    {
        return in_array($group, self::PAGE_GROUPS, true);
    }

    public static function isUpdatableGroup(string $group): bool
    {
        return in_array($group, self::UPDATABLE_GROUPS, true);
    }

    public function getGeneralPageData(): array
    {
        return [
            'general' => Setting::get('general', self::defaults('general')),
            'branding' => $this->formatBranding(Setting::get('branding', self::defaults('branding'))),
            'business' => Setting::get('business', self::defaults('business')),
            'social' => Setting::get('social', self::defaults('social')),
            'email' => Setting::get('email', self::defaults('email')),
        ];
    }

    public function getGroup(string $group): array
    {
        if ($group === 'general') {
            return $this->getGeneralPageData();
        }

        $data = Setting::get($group, self::defaults($group));

        if ($group === 'branding') {
            return $this->formatBranding($data);
        }

        return $data;
    }

    public function findGroup(string $group): JsonResponse
    {
        if (! self::isValidGroup($group)) {
            return $this->notFoundResponse('Settings group not found.');
        }

        return $this->successResponse(
            $this->getGroup($group),
            'Settings retrieved successfully.',
        );
    }

    public function getAppSettings(): array
    {
        $general = Setting::get('general', self::defaults('general'));
        $branding = $this->formatBranding(Setting::get('branding', self::defaults('branding')));
        $business = Setting::get('business', self::defaults('business'));
        $social = Setting::get('social', self::defaults('social'));
        $email = Setting::get('email', self::defaults('email'));

        return [
            'name' => $general['site_name'] ?? config('app.name', 'BAE Card'),
            'tagline' => $general['tagline'] ?? null,
            'site_url' => $general['site_url'] ?? config('app.url'),
            'contact_email' => $general['contact_email'] ?? null,
            'support_phone' => $general['support_phone'] ?? '+8801897543515',
            'copyright' => $general['copyright_text'] ?? null,
            'logo_white_url' => $branding['logo_white_url'] ?? null,
            'logo_black_url' => $branding['logo_black_url'] ?? null,
            'admin_logo_url' => $branding['admin_logo_url'] ?? null,
            'primary_color' => $branding['primary_color'] ?? '#2563eb',
            'currency' => $business['currency'] ?? 'BDT',
            'currency_symbol' => $business['currency_symbol'] ?? '৳',
            'email_from_name' => $email['from_name'] ?? config('app.name', 'BAE Card'),
            'email_from_email' => $email['from_email'] ?? null,
            'email_support' => $email['support_email'] ?? null,
            'whatsapp' => $social['whatsapp'] ?? '+8801897543515',
            'facebook' => $social['facebook'] ?? 'https://www.facebook.com/baecard.info/',
            'instagram' => $social['instagram'] ?? 'https://www.instagram.com/bae_card/',
            'linkedin' => $social['linkedin'] ?? 'https://www.linkedin.com/company/bae-card/',
        ];
    }

    public function updateGroup(string $group, array $data, Request $request): JsonResponse
    {
        $existing = Setting::get($group, self::defaults($group));

        if ($group === 'branding') {
            foreach (BrandingLogoService::FIELD_BASENAMES as $field => $basename) {
                if ($request->hasFile($field)) {
                    try {
                        $data[$field] = $this->brandingLogoService->replace(
                            $request->file($field),
                            $existing[$field] ?? null,
                            $field,
                        );
                    } catch (\Throwable $exception) {
                        return $this->errorResponse(
                            $exception->getMessage() ?: 'Unable to upload branding image.',
                            null,
                            422,
                        );
                    }
                }
            }
        }

        $merged = array_merge($existing, $data);

        if ($group === 'branding') {
            $merged = $this->migrateLegacyBranding($merged);
        }

        Setting::set($group, $merged);

        $responseData = $group === 'branding'
            ? $this->formatBranding($merged)
            : $merged;

        return $this->successResponse($responseData, 'Settings updated successfully.');
    }

    public static function redirectGroup(string $group): string
    {
        return in_array($group, ['branding', 'business', 'social', 'email'], true)
            ? 'general'
            : $group;
    }

    public static function tabForGroup(string $group): ?string
    {
        return match ($group) {
            'branding', 'business', 'social', 'email' => $group,
            default => null,
        };
    }

    public static function defaults(string $group): array
    {
        return match ($group) {
            'general' => [
                'site_name' => config('app.name', 'BAE Card'),
                'tagline' => null,
                'site_url' => config('app.url'),
                'contact_email' => null,
                'support_phone' => null,
                'street' => null,
                'city' => null,
                'state' => null,
                'country' => null,
                'postal_code' => null,
                'privacy_policy_url' => null,
                'terms_url' => null,
                'copyright_text' => null,
            ],
            'branding' => [
                'logo_white' => null,
                'logo_black' => null,
                'admin_logo' => null,
                'primary_color' => '#2563eb',
            ],
            'business' => [
                'currency' => 'BDT',
                'currency_symbol' => '৳',
                'tax_rate' => 0,
                'order_prefix' => 'BAE-',
            ],
            'social' => [
                'whatsapp' => null,
                'facebook' => null,
                'instagram' => null,
                'twitter' => null,
                'linkedin' => null,
                'youtube' => null,
                'tiktok' => null,
            ],
            'email' => [
                'from_name' => config('app.name', 'BAE Card'),
                'from_email' => null,
                'support_email' => null,
            ],
            default => [],
        };
    }

    protected function formatBranding(array $branding): array
    {
        $branding = $this->migrateLegacyBranding($branding);

        return [
            ...$branding,
            'logo_white_url' => $this->assetUrl($branding['logo_white'] ?? null),
            'logo_black_url' => $this->assetUrl($branding['logo_black'] ?? null),
            'admin_logo_url' => $this->assetUrl($branding['admin_logo'] ?? null),
        ];
    }

    protected function migrateLegacyBranding(array $branding): array
    {
        if (! empty($branding['logo']) && empty($branding['admin_logo'])) {
            $branding['admin_logo'] = $branding['logo'];
        }

        unset($branding['logo'], $branding['logo_url']);

        return $branding;
    }

    protected function assetUrl(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        return '/'.ltrim($path, '/');
    }
}
