<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Concerns\RespondsWithInertia;
use App\Http\Controllers\Controller;
use App\Http\Requests\SiteSocial\StoreSiteSocialRequest;
use App\Http\Requests\SiteSocial\UpdateSiteSocialRequest;
use App\Models\SiteSocialLink;
use App\Services\SiteSocialService;
use App\Support\InertiaData;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SiteSocialController extends Controller
{
    use RespondsWithInertia;

    public function __construct(
        protected SiteSocialService $siteSocialService,
    ) {}

    public function indexPage(Request $request)
    {
        return Inertia::render('SiteSocial/Index', [
            'siteSocialLinks' => InertiaData::paginate(
                SiteSocialLink::query()
                    ->orderBy('sort_order')
                    ->orderByDesc('id')
                    ->paginate($request->integer('per_page', 10))
            ),
            'platforms' => SiteSocialLink::allowedPlatforms(),
        ]);
    }

    public function createPage()
    {
        return Inertia::render('SiteSocial/Create', [
            'platforms' => SiteSocialLink::allowedPlatforms(),
        ]);
    }

    public function editPage(SiteSocialLink $siteSocialLink)
    {
        return Inertia::render('SiteSocial/Edit', [
            'siteSocialLink' => $siteSocialLink,
            'platforms' => SiteSocialLink::allowedPlatforms(),
        ]);
    }

    public function store(StoreSiteSocialRequest $request)
    {
        return $this->webOrJson(
            $request,
            $this->siteSocialService->create($request->validated()),
            'site-social.index',
            'Social link created.',
        );
    }

    public function update(UpdateSiteSocialRequest $request, SiteSocialLink $siteSocialLink)
    {
        return $this->webOrJson(
            $request,
            $this->siteSocialService->update($siteSocialLink->id, $request->validated()),
            'site-social.index',
            'Social link updated.',
        );
    }

    public function toggleActive(Request $request, SiteSocialLink $siteSocialLink)
    {
        return $this->webOrJson(
            $request,
            $this->siteSocialService->toggleActive($siteSocialLink->id),
            'site-social.index',
            'Social link status updated.',
        );
    }

    public function toggleFloating(Request $request, SiteSocialLink $siteSocialLink)
    {
        return $this->webOrJson(
            $request,
            $this->siteSocialService->toggleFloating($siteSocialLink->id),
            'site-social.index',
            'Floating visibility updated.',
        );
    }

    public function destroy(Request $request, SiteSocialLink $siteSocialLink)
    {
        return $this->webOrJson(
            $request,
            $this->siteSocialService->delete($siteSocialLink->id),
            'site-social.index',
            'Social link deleted.',
        );
    }
}
