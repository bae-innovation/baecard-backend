<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Services\AuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuthController extends Controller
{
    protected AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Register a new user (JSON API).
     */
    public function register(RegisterRequest $request)
    {
        return $this->authService->register($request->validated());
    }

    /**
     * Show registration page (Inertia).
     */
    public function registerPage(Request $request)
    {
        return Inertia::render('Auth/Register', [
            'redirect' => $request->query('redirect'),
        ]);
    }

    /**
     * Register via web session (Inertia).
     */
    public function registerWeb(RegisterRequest $request)
    {
        $user = $this->authService->registerWeb($request->validated());

        Auth::login($user);
        $request->session()->regenerate();

        $redirect = $this->authService->resolveWebRedirect(
            $request->input('redirect') ?: $request->query('redirect')
        );

        return redirect($redirect);
    }

    /**
     * Login via web session (Inertia).
     */
    public function login(LoginRequest $request)
    {
        $this->authService->loginWeb(
            $request->only('email', 'password'),
            $request->boolean('remember'),
        );

        $request->session()->regenerate();

        $redirect = $this->authService->resolveWebRedirect(
            $request->input('redirect') ?: $request->query('redirect')
        );

        return redirect($redirect);
    }

    /**
     * Login via Sanctum token (JSON API).
     */
    public function apiLogin(LoginRequest $request)
    {
        return $this->authService->login($request->validated());
    }

    /**
     * Logout the authenticated user (web session).
     */
    public function logout(Request $request)
    {
        $this->authService->logoutWeb();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }

    /**
     * Logout via Sanctum token (JSON API).
     */
    public function apiLogout()
    {
        return $this->authService->logout(request()->user());
    }

    /**
     * Get the authenticated user (JSON API).
     */
    public function me()
    {
        return $this->authService->me(request()->user());
    }
}
