<?php

namespace App\Services;

use App\Models\SiteSocialLink;
use App\Support\SiteSocialUrl;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class SiteSocialService
{
    use ApiResponseTrait;

    public const CACHE_KEY = 'site_social.public';

    /**
     * @return list<array<string, mixed>>
     */
    public function getPublicLinks(): array
    {
        return Cache::remember(self::CACHE_KEY, 300, function () {
            return SiteSocialLink::query()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->orderBy('id')
                ->get()
                ->map(fn (SiteSocialLink $link) => SiteSocialUrl::toPublicShape($link))
                ->values()
                ->all();
        });
    }

    /**
     * @return list<array<string, mixed>>
     */
    public function getFloatingLinks(): array
    {
        return array_values(array_filter(
            $this->getPublicLinks(),
            fn (array $link) => ($link['show_in_floating'] ?? false) === true,
        ));
    }

    public function create(array $data): JsonResponse
    {
        $link = SiteSocialLink::create($this->normalizePayload($data));
        $this->bustCache();

        return $this->successResponse($link, 'Social link created successfully.', 201);
    }

    public function update(int $id, array $data): JsonResponse
    {
        $link = SiteSocialLink::find($id);

        if (! $link) {
            return $this->notFoundResponse('Social link not found.');
        }

        $link->update($this->normalizePayload($data));
        $this->bustCache();

        return $this->successResponse($link->fresh(), 'Social link updated successfully.');
    }

    public function toggleActive(int $id): JsonResponse
    {
        $link = SiteSocialLink::find($id);

        if (! $link) {
            return $this->notFoundResponse('Social link not found.');
        }

        $link->update(['is_active' => ! $link->is_active]);
        $this->bustCache();

        return $this->successResponse($link->fresh(), 'Social link status updated.');
    }

    public function toggleFloating(int $id): JsonResponse
    {
        $link = SiteSocialLink::find($id);

        if (! $link) {
            return $this->notFoundResponse('Social link not found.');
        }

        $link->update(['show_in_floating' => ! $link->show_in_floating]);
        $this->bustCache();

        return $this->successResponse($link->fresh(), 'Floating visibility updated.');
    }

    public function delete(int $id): JsonResponse
    {
        $link = SiteSocialLink::find($id);

        if (! $link) {
            return $this->notFoundResponse('Social link not found.');
        }

        $link->delete();
        $this->bustCache();

        return $this->successResponse(null, 'Social link deleted successfully.');
    }

    public function bustCache(): void
    {
        Cache::forget(self::CACHE_KEY);
        Cache::forget(CmsService::CACHE_KEY);
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function normalizePayload(array $data): array
    {
        return [
            'platform' => $data['platform'],
            'platform_value' => trim((string) $data['platform_value']),
            'url' => filled($data['url'] ?? null) ? trim((string) $data['url']) : null,
            'label' => filled($data['label'] ?? null) ? trim((string) $data['label']) : null,
            'is_active' => (bool) ($data['is_active'] ?? true),
            'show_in_floating' => (bool) ($data['show_in_floating'] ?? false),
            'sort_order' => (int) ($data['sort_order'] ?? 0),
        ];
    }
}
