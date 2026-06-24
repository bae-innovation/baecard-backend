<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Enums\UserRole;
use App\Models\CardCode;
use App\Services\CardCodeService;
use App\Support\CardCodePath;
use App\Support\ProfilePreviewData;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class ScanController extends Controller
{
    public function __construct(
        protected CardCodeService $cardCodeService
    ) {}

    public function show(Request $request, string $code)
    {
        $cardCode = $this->cardCodeService->findByCode($code);

        if (! $cardCode) {
            abort(404, 'Code does not exist.');
        }

        if ($cardCode->isPublished() && $cardCode->user) {
            return $this->renderProfile($cardCode);
        }

        $user = Auth::user();

        if ($cardCode->user_id === null) {
            if (! $user) {
                return redirect()->route('register', [
                    'redirect' => CardCodePath::pathForCode($cardCode->code),
                ]);
            }

            if (! $user->hasRole(UserRole::User->value)) {
                return redirect()
                    ->route('login', [
                        'redirect' => CardCodePath::pathForCode($cardCode->code),
                    ])
                    ->withErrors([
                        'email' => 'You are signed in with a staff account. Sign out, then register or sign in with a customer account to activate this card.',
                    ]);
            }

            if (! $user->hasVerifiedEmail()) {
                $request->session()->put('pending_card_code', $cardCode->code);

                return redirect()->route('verification.notice', [
                    'redirect' => CardCodePath::pathForCode($cardCode->code),
                ]);
            }

            $activated = $this->cardCodeService->activatePendingCode(
                $cardCode->code,
                $user,
            );

            return $this->renderProfile($activated);
        }

        if (! $user) {
            return redirect()->route('login', [
                'redirect' => CardCodePath::pathForCode($cardCode->code),
            ]);
        }

        if ((int) $cardCode->user_id !== (int) $user->id) {
            throw new AccessDeniedHttpException(
                'This card is linked to another account. Sign in with the assigned account.',
            );
        }

        if (! $user->hasRole(UserRole::User->value)) {
            return redirect()
                ->route('login', [
                    'redirect' => CardCodePath::pathForCode($cardCode->code),
                ])
                ->withErrors([
                    'email' => 'You are signed in with a staff account. Sign in with the customer account assigned to this card.',
                ]);
        }

        if (! $user->hasVerifiedEmail()) {
            $request->session()->put('pending_card_code', $cardCode->code);

            return redirect()->route('verification.notice', [
                'redirect' => CardCodePath::pathForCode($cardCode->code),
            ]);
        }

        $activated = $this->cardCodeService->activatePendingCode(
            $cardCode->code,
            $user,
        );

        return $this->renderProfile($activated);
    }

    protected function renderProfile(CardCode $cardCode)
    {
        $cardCode->loadMissing('user');
        $user = $cardCode->user;

        if (! $user) {
            abort(404, 'Profile not found.');
        }

        return Inertia::render('Profile/Show', ProfilePreviewData::forUser($user));
    }
}
