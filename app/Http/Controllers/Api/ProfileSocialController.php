<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Concerns\RespondsWithInertia;
use App\Http\Controllers\Controller;
use App\Http\Requests\Profile\StoreProfileSocialRequest;
use App\Http\Requests\Profile\UpdateProfileSocialRequest;
use App\Services\ProfileSocialService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfileSocialController extends Controller
{
    use RespondsWithInertia;

    public function __construct(
        protected ProfileSocialService $profileSocialService,
    ) {}

    public function indexPage(Request $request)
    {
        $user = $request->user();

        return Inertia::render('Profile/Social', [
            'social_links' => $this->profileSocialService->listForUser($user->id),
        ]);
    }

    public function store(StoreProfileSocialRequest $request)
    {
        return $this->webOrBack(
            $request,
            $this->profileSocialService->createForUser(
                $request->user()->id,
                $request->validated(),
            ),
            'Social link added.',
        );
    }

    public function update(UpdateProfileSocialRequest $request, int $id)
    {
        return $this->webOrBack(
            $request,
            $this->profileSocialService->updateForUser(
                $request->user()->id,
                $id,
                $request->validated(),
            ),
            'Social link updated.',
        );
    }

    public function destroy(Request $request, int $id)
    {
        return $this->webOrBack(
            $request,
            $this->profileSocialService->deleteForUser($request->user()->id, $id),
            'Social link removed.',
        );
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'integer'],
            'items.*.sort_order' => ['required', 'integer', 'min:0'],
        ]);

        $response = $this->profileSocialService->reorderForUser(
            $request->user()->id,
            $request->input('items'),
        );

        if ($response->getStatusCode() >= 400) {
            return back()->withErrors(['form' => 'Failed to reorder social links.']);
        }

        return back()->with('success', 'Social links reordered.');
    }
}
