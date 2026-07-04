<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cms\UpdateCmsEntryRequest;
use App\Services\CmsService;
use App\Support\MarketingDefaults;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CmsController extends Controller
{
    public function __construct(
        protected CmsService $cmsService,
    ) {}

    public function indexPage(): Response
    {
        return Inertia::render('Cms/Index', [
            'entries' => $this->cmsService->getAdminIndex(),
        ]);
    }

    public function editPage(string $key): Response
    {
        $entry = $this->cmsService->getByKey($key);

        return Inertia::render('Cms/Edit', [
            'entry' => $entry ? [
                'key' => $entry->key,
                'label' => $entry->label,
                'content' => $entry->content,
                'is_published' => $entry->is_published,
            ] : null,
            'key' => $key,
            'schema' => $this->schemaForKey($key),
            'defaults' => MarketingDefaults::contentForKey($key),
        ]);
    }

    public function update(UpdateCmsEntryRequest $request, string $key): JsonResponse|\Illuminate\Http\RedirectResponse
    {
        $validated = $request->validated();

        $entry = $this->cmsService->upsert(
            $key,
            $validated['label'],
            $validated['content'],
            $request->user()?->id,
        );

        if (array_key_exists('is_published', $validated)) {
            $this->cmsService->publish($key, (bool) $validated['is_published']);
        }

        if ($request->header('X-Inertia')) {
            return redirect()->route('admin.cms.edit', ['key' => $key])
                ->with('success', 'CMS entry saved.');
        }

        return response()->json(['data' => $entry]);
    }

    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'image', 'max:5120'],
        ]);

        $url = $this->cmsService->uploadMedia($request->file('file'));

        return response()->json(['url' => $url]);
    }

    /**
     * @return array<string, mixed>
     */
    private function schemaForKey(string $key): array
    {
        return match ($key) {
            'section.hero' => ['type' => 'hero'],
            'section.faq', 'section.order_steps' => [
                'type' => 'repeater',
                'variant' => str_replace('section.', '', $key),
            ],
            'section.how_it_works' => ['type' => 'repeater', 'variant' => 'how_it_works'],
            'section.features', 'section.security' => [
                'type' => 'repeater',
                'variant' => str_replace('section.', '', $key),
            ],
            'section.navigation' => ['type' => 'repeater', 'variant' => 'navigation'],
            'section.section_headings' => ['type' => 'section_headings'],
            'section.contact' => ['type' => 'contact'],
            'section.corporate' => ['type' => 'corporate'],
            'seo.all' => ['type' => 'seo'],
            default => str_starts_with($key, 'page.')
                ? ['type' => 'page']
                : ['type' => 'json'],
        };
    }
}
