<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CardCodeService;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ProfileController extends Controller
{
    public function __construct(
        protected CardCodeService $cardCodeService
    ) {}

    public function show(string $slug, string $code)
    {
        $cardCode = $this->cardCodeService->findPublishedByCode($code);

        if (! $cardCode || ! $cardCode->user) {
            throw new NotFoundHttpException('Profile not found.');
        }

        if (Str::slug($cardCode->user->name) !== $slug) {
            return redirect()->route('profile.show', [
                'slug' => Str::slug($cardCode->user->name),
                'code' => $cardCode->code,
            ]);
        }

        $user = $cardCode->user;

        return Inertia::render('Profile/Show', [
            'card' => [
                'code' => $cardCode->code,
                'name' => $cardCode->name,
                'phone' => $cardCode->phone,
                'scan_url' => $cardCode->scan_url,
                'profile_url' => $cardCode->profile_url,
                'status' => $cardCode->status,
            ],
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
            ],
        ]);
    }
}
