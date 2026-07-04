<?php

namespace App\Services;

use App\Models\CmsEntry;
use App\Models\OfferTicker;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class OfferTickerService
{
    use ApiResponseTrait;

    /**
     * @return list<array<string, mixed>>
     */
    public function getPublicTickers(): array
    {
        return OfferTicker::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get()
            ->map(fn (OfferTicker $ticker) => $this->toPublicShape($ticker))
            ->values()
            ->all();
    }

    public function create(array $data): JsonResponse
    {
        $ticker = OfferTicker::create($this->normalizePayload($data));
        $this->bustCache();

        return $this->successResponse($ticker, 'Offer ticker created successfully.', 201);
    }

    public function update(int $id, array $data): JsonResponse
    {
        $ticker = OfferTicker::find($id);

        if (! $ticker) {
            return $this->notFoundResponse('Offer ticker not found.');
        }

        $ticker->update($this->normalizePayload($data));
        $this->bustCache();

        return $this->successResponse($ticker->fresh(), 'Offer ticker updated successfully.');
    }

    public function toggleActive(int $id): JsonResponse
    {
        $ticker = OfferTicker::find($id);

        if (! $ticker) {
            return $this->notFoundResponse('Offer ticker not found.');
        }

        $ticker->update(['is_active' => ! $ticker->is_active]);
        $this->bustCache();

        return $this->successResponse($ticker->fresh(), 'Offer ticker status updated.');
    }

    public function delete(int $id): JsonResponse
    {
        $ticker = OfferTicker::find($id);

        if (! $ticker) {
            return $this->notFoundResponse('Offer ticker not found.');
        }

        $ticker->delete();
        $this->bustCache();

        return $this->successResponse(null, 'Offer ticker deleted successfully.');
    }

    /**
     * Migrate legacy CMS section.offers items into offer_tickers rows.
     */
    public function migrateFromCmsEntry(): int
    {
        $entry = CmsEntry::query()->where('key', 'section.offers')->first();

        if (! $entry) {
            return 0;
        }

        $items = $entry->content['items'] ?? $entry->content ?? [];
        $themes = OfferTicker::THEMES;
        $created = 0;

        foreach ($items as $index => $item) {
            if (! is_array($item) || empty($item['message'])) {
                continue;
            }

            OfferTicker::create([
                'message' => $item['message'],
                'badge' => $item['badge'] ?? null,
                'href' => $item['href'] ?? null,
                'theme' => $themes[$index % count($themes)],
                'is_active' => ($item['enabled'] ?? true) !== false,
                'sort_order' => $index * 10,
            ]);
            $created++;
        }

        if ($created > 0) {
            $this->bustCache();
        }

        return $created;
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function normalizePayload(array $data): array
    {
        return [
            'message' => [
                'en' => $data['message']['en'] ?? $data['message_en'] ?? '',
                'bn' => $data['message']['bn'] ?? $data['message_bn'] ?? '',
            ],
            'badge' => $this->normalizeBadge($data),
            'href' => $data['href'] ?? null,
            'theme' => in_array($data['theme'] ?? 'coral', OfferTicker::THEMES, true)
                ? ($data['theme'] ?? 'coral')
                : 'coral',
            'is_active' => (bool) ($data['is_active'] ?? true),
            'sort_order' => (int) ($data['sort_order'] ?? 0),
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, string>|null
     */
    private function normalizeBadge(array $data): ?array
    {
        $badgeEn = $data['badge']['en'] ?? $data['badge_en'] ?? null;
        $badgeBn = $data['badge']['bn'] ?? $data['badge_bn'] ?? null;

        if (! $badgeEn && ! $badgeBn) {
            return null;
        }

        return [
            'en' => (string) ($badgeEn ?? ''),
            'bn' => (string) ($badgeBn ?? ''),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function toPublicShape(OfferTicker $ticker): array
    {
        return [
            'id' => (string) $ticker->id,
            'message' => $ticker->message,
            'badge' => $ticker->badge,
            'href' => $ticker->href,
            'enabled' => $ticker->is_active,
            'theme' => $ticker->theme,
        ];
    }

    private function bustCache(): void
    {
        Cache::forget(CmsService::CACHE_KEY);
    }
}
