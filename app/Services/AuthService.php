<?php

namespace App\Services;

use App\Enums\UserRole;
use App\Mail\ResetPasswordMail;
use App\Models\User;
use App\Traits\ApiResponseTrait;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

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
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => $data['password'],
                'phone' => $data['phone'] ?? null,
            ]);

            UserRole::ensureExists(UserRole::User);
            $user->assignRole(UserRole::User->value);

            // Trigger email verification
            event(new Registered($user));

            // Create Sanctum token
            $token = $user->createToken('auth-token')->plainTextToken;

            return $this->successResponse([
                'user' => $user->load('roles'),
                'token' => $token,
            ], 'Registration successful. Please verify your email.', 201);
        });
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
     * Send password reset link immediately via SMTP (no queue).
     */
    public function forgotPassword(array $data): JsonResponse
    {
        $user = User::where('email', $data['email'])->first();

        if ($user) {
            $token = Password::broker()->createToken($user);
            Mail::to($user->email)->send(new ResetPasswordMail($token, $user->email, $user->name));
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