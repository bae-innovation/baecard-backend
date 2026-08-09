<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Concerns\RespondsWithInertia;
use App\Http\Controllers\Controller;
use App\Http\Requests\Profile\UpdateProfileContentRequest;
use App\Services\ProfileContentService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfileContentController extends Controller
{
    use ApiResponseTrait;
    use RespondsWithInertia;

    public function __construct(
        protected ProfileContentService $profileContentService,
    ) {}

    public function index(Request $request)
    {
        $profile = $this->profileContentService->forUser($request->user());

        return Inertia::render('Profile/Content', [
            'profile' => $profile,
        ]);
    }

    public function update(UpdateProfileContentRequest $request)
    {
        $this->profileContentService->updateForUser(
            $request->user(),
            $request->validated(),
            $request,
        );

        return $this->webOrBack(
            $request,
            $this->successResponse(
                $this->profileContentService->forUser($request->user()->fresh()),
                'Profile saved.',
            ),
            'Profile saved.',
        );
    }
}
