<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Concerns\RespondsWithInertia;
use App\Http\Controllers\Controller;
use App\Http\Requests\Profile\StoreProfileServiceRequest;
use App\Http\Requests\Profile\UpdateProfileServiceRequest;
use App\Services\ProfileUserServiceService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfileServiceController extends Controller
{
    use RespondsWithInertia;

    public function __construct(
        protected ProfileUserServiceService $profileUserServiceService,
    ) {}

    public function indexPage(Request $request)
    {
        $user = $request->user();

        return Inertia::render('Profile/Services', [
            'services' => $this->profileUserServiceService->listForUser($user->id),
        ]);
    }

    public function store(StoreProfileServiceRequest $request)
    {
        return $this->webOrBack(
            $request,
            $this->profileUserServiceService->createForUser(
                $request->user()->id,
                $request->validated(),
                $request,
            ),
            'Service added.',
        );
    }

    public function update(UpdateProfileServiceRequest $request, int $id)
    {
        return $this->webOrBack(
            $request,
            $this->profileUserServiceService->updateForUser(
                $request->user()->id,
                $id,
                $request->validated(),
                $request,
            ),
            'Service updated.',
        );
    }

    public function destroy(Request $request, int $id)
    {
        return $this->webOrBack(
            $request,
            $this->profileUserServiceService->deleteForUser($request->user()->id, $id),
            'Service removed.',
        );
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'integer'],
            'items.*.sort_order' => ['required', 'integer', 'min:0'],
        ]);

        $response = $this->profileUserServiceService->reorderForUser(
            $request->user()->id,
            $request->input('items'),
        );

        if ($response->getStatusCode() >= 400) {
            return back()->withErrors(['form' => 'Failed to reorder services.']);
        }

        return back()->with('success', 'Services reordered.');
    }
}
