<?php

namespace App\Services;

use App\Models\CmsEntry;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class CmsService
{
    public const CACHE_KEY = 'cms.marketing.public';

    /**
     * Partial overrides merged on the frontend with static defaults.
     *
     * @return array<string, mixed>
     */
    public function getPublicPayload(): array
    {
        return Cache::remember(self::CACHE_KEY, 300, function () {
            $overrides = [];

            CmsEntry::query()
                ->where('is_published', true)
                ->orderBy('sort_order')
                ->each(function (CmsEntry $entry) use (&$overrides) {
                    $this->applyEntry($overrides, $entry->key, $entry->content ?? []);
                });

            return $overrides;
        });
    }

    public function bustCache(): void
    {
        Cache::forget(self::CACHE_KEY);
    }

    /**
     * @return list<array<string, mixed>>
     */
    public function getAdminIndex(): array
    {
        return CmsEntry::query()
            ->orderBy('sort_order')
            ->orderBy('label')
            ->get(['id', 'key', 'group', 'label', 'is_published', 'updated_at'])
            ->map(fn (CmsEntry $entry) => [
                'id' => $entry->id,
                'key' => $entry->key,
                'group' => $entry->group,
                'label' => $entry->label,
                'is_published' => $entry->is_published,
                'updated_at' => $entry->updated_at?->toIso8601String(),
            ])
            ->values()
            ->all();
    }

    public function getByKey(string $key): ?CmsEntry
    {
        return CmsEntry::query()->where('key', $key)->first();
    }

    /**
     * @param  array<string, mixed>  $content
     */
    public function upsert(string $key, string $label, array $content, ?int $userId = null, ?int $sortOrder = null): CmsEntry
    {
        $entry = CmsEntry::query()->firstOrNew(['key' => $key]);
        $entry->fill([
            'label' => $label,
            'group' => $this->groupForKey($key),
            'content' => $content,
            'updated_by' => $userId,
            'is_published' => $entry->exists ? $entry->is_published : true,
            'sort_order' => $sortOrder ?? $entry->sort_order ?? 0,
        ]);
        $entry->save();
        $this->bustCache();

        return $entry;
    }

    public function publish(string $key, bool $published = true): ?CmsEntry
    {
        $entry = $this->getByKey($key);
        if (! $entry) {
            return null;
        }

        $entry->update(['is_published' => $published]);
        $this->bustCache();

        return $entry;
    }

    public function uploadMedia(UploadedFile $file): string
    {
        $path = $file->store('cms', 'public');

        return Storage::disk('public')->url($path);
    }

    /**
     * @param  array<string, mixed>  $base
     * @param  array<string, mixed>  $content
     */
    private function applyEntry(array &$base, string $key, array $content): void
    {
        match ($key) {
            'section.hero' => $base['hero'] = array_merge($base['hero'] ?? [], $content),
            'section.order_steps' => $base['orderSteps'] = $content['items'] ?? $content,
            'section.how_it_works' => $base['howItWorksSteps'] = $content['items'] ?? $content,
            'section.features' => $base['features'] = $content['items'] ?? $content,
            'section.security' => $base['security'] = $content['items'] ?? $content,
            'section.faq' => $base['faq'] = $content['items'] ?? $content,
            'section.offers' => $base['offers'] = $content['items'] ?? $content,
            'section.navigation' => $base['navigation'] = $content['items'] ?? $content,
            'section.section_headings' => $base['sectionHeadings'] = array_replace_recursive($base['sectionHeadings'] ?? [], $content),
            'section.contact' => $base['contact'] = array_merge($base['contact'] ?? [], $content),
            'section.corporate' => $base['corporate'] = array_merge($base['corporate'] ?? [], $content),
            'seo.all' => $base['seo'] = array_merge($base['seo'] ?? [], $content),
            default => $this->applyPageEntry($base, $key, $content),
        };
    }

    /**
     * @param  array<string, mixed>  $base
     * @param  array<string, mixed>  $content
     */
    private function applyPageEntry(array &$base, string $key, array $content): void
    {
        if (str_starts_with($key, 'page.')) {
            $slug = substr($key, 5);
            $base['pages'][$slug] = array_merge($base['pages'][$slug] ?? [], $content);
        }
    }

    private function groupForKey(string $key): string
    {
        if (str_starts_with($key, 'page.')) {
            return 'pages';
        }

        if (in_array($key, ['section.navigation', 'section.contact', 'section.corporate', 'seo.all'], true)) {
            return 'site';
        }

        return 'homepage';
    }
}
