<?php

namespace App\Services;

use App\Enums\UserRole;
use App\Exceptions\MailDeliveryException;
use App\Mail\CardAccountInviteMail;
use App\Mail\ResetPasswordMail;
use App\Models\CardCode;
use App\Models\User;
use App\Support\CardCodePath;
use App\Support\EmailVerification;
use App\Support\MailConfig;
use App\Support\PermissionResolver;
use App\Traits\ApiResponseTrait;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;

class AuthService
{
    use ApiResponseTrait;

    /**
     * Register a new user.
     */
    public function register(array $data): JsonResponse
    {
        return DB::transaction(function () use ($data) {
            $user = User::create([
                'name' => $this->resolveRegistrationName($data),
                'email' => $data['email'],
                'password' => $data['password'],
                'phone' => $data['phone'] ?? null,
            ]);

            UserRole::ensureExists(UserRole::User);
            $user->assignRole(UserRole::User->value);
            $user->ensureProfile();

            $user->sendVerificationEmail(raiseOnFailure: false);

            // Create Sanctum token
            $token = $user->createToken('auth-token')->plainTextToken;

            return $this->successResponse([
                'user' => $user->load('roles'),
                'token' => $token,
            ], 'Registration successful. Please verify your email.', 201);
        });
    }

    /**
     * Register a new user for the web session (Inertia).
     */
    public function registerWeb(array $data): User
    {
        return DB::transaction(function () use ($data) {
            $user = User::create([
                'name' => $this->resolveRegistrationName($data),
                'email' => $data['email'],
                'password' => $data['password'],
                'phone' => $data['phone'] ?? null,
            ]);

            UserRole::ensureExists(UserRole::User);
            $user->assignRole(UserRole::User->value);
            $user->ensureProfile();

            $user->sendVerificationEmail(raiseOnFailure: false);

            return $user;
        });
    }

    /**
     * @param  array{name?: string|null, email: string}  $data
     */
    private function resolveRegistrationName(array $data): string
    {
        $name = trim((string) ($data['name'] ?? ''));

        if ($name !== '') {
            return $name;
        }

        $localPart = Str::before($data['email'], '@');

        return Str::title(str_replace(['.', '_', '-'], ' ', $localPart));
    }

    /**
     * Resolve a card-code redirect path when present.
     */
    public function resolveCardRedirect(?string $redirect): ?string
    {
        if (CardCodePath::isCardCodePath($redirect)) {
            return $redirect;
        }

        return null;
    }

    /**
     * Resolve post-auth redirect for card scan claim flow.
     */
    public function resolveWebRedirect(?string $redirect, ?User $user = null): string
    {
        if ($redirect && CardCodePath::isCardCodePath($redirect)) {
            return $redirect;
        }

        $user ??= Auth::user();

        if ($user instanceof User) {
            return $this->homeRouteFor($user);
        }

        return route('home');
    }

    /**
     * Default authenticated home route based on role abilities.
     */
    public function homeRouteFor(User $user): string
    {
        if ($user->hasRole(UserRole::User->value)) {
            return $this->customerHomeRouteFor($user);
        }

        if (PermissionResolver::canViewDashboard($user)) {
            return route('dashboard');
        }

        if (PermissionResolver::allows($user, 'order.website_order.view')) {
            return route('orders.index');
        }

        if (PermissionResolver::allows($user, 'order.custom_order.view')) {
            return route('custom-orders.index');
        }

        if (PermissionResolver::allows($user, 'profile.template.manage')) {
            return $this->customerHomeRouteFor($user);
        }

        return route('user.account');
    }

    public function customerHomeRouteFor(User $user): string
    {
        $profile = $user->relationLoaded('profile')
            ? $user->profile
            : $user->profile()->first();

        $template = max(1, min(4, (int) ($profile?->active_template ?? 1)));

        return route('profile.home');
    }

    /**
     * Authenticate a user via the web session guard.
     *
     * @throws ValidationException
     */
    public function loginWeb(array $credentials, bool $remember = false): void
    {
        if (! Auth::attempt($credentials, $remember)) {
            throw ValidationException::withMessages([
                'email' => 'Invalid email or password.',
            ]);
        }
    }

    /**
     * Log out the current web session.
     */
    public function logoutWeb(): void
    {
        Auth::logout();
    }

    /**
     * Login a user via Sanctum token (JSON API).
     */
    public function login(array $data): JsonResponse
    {
        $user = User::where('email', $data['email'])->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            return $this->unauthorizedResponse('Invalid email or password.');
        }

        // Revoke old tokens
        $user->tokens()->delete();

        // Create new token
        $token = $user->createToken('auth-token')->plainTextToken;

        return $this->successResponse([
            'user' => $user->load('roles'),
            'token' => $token,
        ], 'Login successful.');
    }

    /**
     * Logout a user.
     */
    public function logout(User $user): JsonResponse
    {
        $user->currentAccessToken()->delete();

        return $this->successResponse(null, 'Logged out successfully.');
    }

    /**
     * Get the authenticated user.
     */
    public function me(User $user): JsonResponse
    {
        return $this->successResponse(
            $user->load('roles'),
            'User retrieved successfully.'
        );
    }

    /**
     * Send card account invite email for admin-provisioned, unverified customers.
     */
    public function sendCardAccountInvite(
        User $user,
        CardCode $cardCode,
        bool $raiseOnFailure = false,
    ): bool {
        if ($user->hasVerifiedEmail()) {
            return false;
        }

        $token = Password::broker()->createToken($user);
        $verifyUrl = EmailVerification::signedUrl(
            $user,
            CardCodePath::pathForCode($cardCode->code),
        );
        $resetPasswordUrl = MailConfig::resetPasswordUrl($token, $user->email);

        try {
            Mail::to($user->email)->send(new CardAccountInviteMail(
                name: $user->name ?? 'there',
                cardCode: $cardCode->code,
                cardName: $cardCode->display_name ?: ($user->name ?? 'Your card'),
                verifyUrl: $verifyUrl,
                resetPasswordUrl: $resetPasswordUrl,
            ));
        } catch (TransportExceptionInterface $exception) {
            report($exception);

            if ($raiseOnFailure) {
                throw new MailDeliveryException(
                    EmailVerification::deliveryFailureMessage($exception),
                    previous: $exception,
                );
            }

            return false;
        }

        return true;
    }

    /**
     * Send password reset link immediately via SMTP (no queue).
     */
    public function forgotPassword(array $data): JsonResponse
    {
        $user = User::where('email', $data['email'])->first();

        if ($user) {
            $token = Password::broker()->createToken($user);
            $resetUrl = MailConfig::resetPasswordUrl($token, $user->email);

            try {
                Mail::to($user->email)->send(new ResetPasswordMail(
                    $token,
                    $user->email,
                    $user->name ?? 'there',
                ));
            } catch (TransportExceptionInterface $exception) {
                report($exception);

                throw new MailDeliveryException(
                    EmailVerification::deliveryFailureMessage($exception),
                    previous: $exception,
                );
            }

            if (MailConfig::shouldExposeDevLinks()) {
                return $this->successResponse(
                    ['devResetUrl' => $resetUrl],
                    __(Password::RESET_LINK_SENT),
                );
            }
        }

        return $this->successResponse(null, __(Password::RESET_LINK_SENT));
    }

    /**
     * Reset the user's password.
     */
    public function resetPassword(array $data): JsonResponse
    {
        $status = Password::reset(
            $data,
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => $password,
                ])->setRememberToken(Str::random(60));

                $user->save();

                event(new PasswordReset($user));
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return $this->successResponse(null, __($status));
        }

        return $this->errorResponse(__($status), null, 400);
    }
}