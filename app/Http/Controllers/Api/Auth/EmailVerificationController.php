<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\CardCode;
use App\Models\User;
use App\Services\CardCodeService;
use App\Support\CardCodePath;
use App\Traits\ApiResponseTrait;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class EmailVerificationController extends Controller
{
    use ApiResponseTrait;

    public function __construct(
        protected CardCodeService $cardCodeService
    ) {}

    /**
     * Send email verification notification.
     */
    public function sendVerification(Request $request): JsonResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return $this->successResponse(null, 'Email already verified.');
        }

        $request->user()->sendEmailVerificationNotification();

        return $this->successResponse(null, 'Verification link sent to your email.');
    }

    /**
     * Show the email verification notice page.
     */
    public function notice(Request $request): Response
    {
        $redirect = $request->query('redirect');
        $cardCode = null;

        if (CardCodePath::isCardCodePath($redirect)) {
            $cardCode = $this->cardCodeService->findByCode(
                CardCodePath::codeFromPath($redirect),
            );
        }

        return Inertia::render('Auth/VerifyEmail', [
            'redirect' => $redirect,
            'cardCode' => $cardCode ? [
                'code' => $cardCode->code,
                'name' => $cardCode->name,
            ] : null,
        ]);
    }

    /**
     * Resend verification email from the web UI.
     */
    public function resend(Request $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return back()->with('success', 'Email already verified.');
        }

        $request->user()->sendEmailVerificationNotification();

        return back()->with('success', 'Verification link sent to your email.');
    }

    /**
     * Verify email address via JSON API.
     */
    public function verify(Request $request, $id, $hash): JsonResponse
    {
        $user = User::findOrFail($id);

        if (! hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            return $this->errorResponse('Invalid verification link.', null, 400);
        }

        if ($user->hasVerifiedEmail()) {
            return $this->successResponse(null, 'Email already verified.');
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        return $this->successResponse(null, 'Email has been verified successfully.');
    }

    /**
     * Verify email address from the web UI and activate pending card codes.
     */
    public function verifyWeb(Request $request, $id, $hash): RedirectResponse
    {
        $user = User::findOrFail($id);

        if (! hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            abort(403, 'Invalid verification link.');
        }

        if (! $user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
            event(new Verified($user));
        }

        if (! Auth::check() || Auth::id() !== $user->id) {
            Auth::login($user);
            $request->session()->regenerate();
        }

        $redirect = $this->resolvePostVerificationRedirect($request);

        if (CardCodePath::isCardCodePath($redirect)) {
            $this->cardCodeService->activatePendingCode(
                CardCodePath::codeFromPath($redirect),
                $user,
            );
        } else {
            $pendingCard = CardCode::query()
                ->where('user_id', $user->id)
                ->where('status', CardCode::STATUS_PENDING)
                ->first();

            if ($pendingCard) {
                $this->cardCodeService->activatePendingCode($pendingCard->code, $user);
                $redirect = CardCodePath::pathForCode($pendingCard->code);
            }
        }

        $request->session()->forget('pending_card_code');

        return redirect($redirect)->with(
            'success',
            'Email verified. Your card is now active.',
        );
    }

    protected function resolvePostVerificationRedirect(Request $request): string
    {
        $redirect = $request->query('redirect');

        if (CardCodePath::isCardCodePath($redirect)) {
            return $redirect;
        }

        $pendingCode = $request->session()->get('pending_card_code');

        if (is_string($pendingCode) && $pendingCode !== '') {
            return CardCodePath::pathForCode($pendingCode);
        }

        return route('dashboard');
    }
}
