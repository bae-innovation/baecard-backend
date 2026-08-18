<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Exceptions\MailDeliveryException;
use App\Services\AuthService;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class ForgotPasswordController extends Controller
{
    protected AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Send a password reset link (web / Inertia).
     */
    public function store(ForgotPasswordRequest $request)
    {
        try {
            $response = $this->authService->forgotPassword($request->validated());
        } catch (MailDeliveryException $exception) {
            throw ValidationException::withMessages([
                'email' => $exception->getMessage(),
            ]);
        }

        $payload = json_decode($response->getContent(), true);
        $redirect = back()->with('success', __(Password::RESET_LINK_SENT));

        if (! empty($payload['data']['devResetUrl'])) {
            $redirect->with('devResetUrl', $payload['data']['devResetUrl']);
        }

        return $redirect;
    }

    /**
     * Reset the user's password (web / Inertia).
     */
    public function reset(ResetPasswordRequest $request)
    {
        $response = $this->authService->resetPassword($request->validated());

        if ($response->getStatusCode() >= 400) {
            $data = json_decode($response->getContent(), true);

            return back()->with('error', $data['message'] ?? 'Unable to reset password.');
        }

        return redirect()
            ->route('login')
            ->with('success', 'Password reset successfully. You can sign in now.');
    }

    /**
     * Send a password reset link (JSON API).
     */
    public function forgotPassword(ForgotPasswordRequest $request)
    {
        return $this->authService->forgotPassword($request->validated());
    }

    /**
     * Reset the user's password (JSON API).
     */
    public function resetPassword(ResetPasswordRequest $request)
    {
        return $this->authService->resetPassword($request->validated());
    }
}
