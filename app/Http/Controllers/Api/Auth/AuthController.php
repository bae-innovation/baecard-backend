<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Services\AuthService;
use App\Services\CardCodeService;
use App\Support\CardCodePath;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function __construct(
        protected AuthService $authService,
        protected CardCodeService $cardCodeService,
    ) {}

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
        $redirect = $request->query('redirect');

        return Inertia::render('Auth/Register', [
            'redirect' => $redirect,
            'cardCode' => $this->cardContextFromRedirect($redirect),
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

        $redirect = $this->authService->resolveCardRedirect(
            $request->input('redirect') ?: $request->query('redirect'),
        );

        if ($redirect) {
            $this->cardCodeService->linkUserToPendingCard(
                CardCodePath::codeFromPath($redirect),
                $user,
            );
            $request->session()->put(
                'pending_card_code',
                CardCodePath::codeFromPath($redirect),
            );
        }

        if (! $user->hasVerifiedEmail()) {
            return redirect()->route('verification.notice', [
                'redirect' => $redirect,
            ]);
        }

        if ($redirect) {
            $this->cardCodeService->activatePendingCode(
                CardCodePath::codeFromPath($redirect),
                $user,
            );

            return redirect($redirect)->with(
                'success',
                'Account created. Your card is now active.',
            );
        }

        return redirect()->route('dashboard')->with(
            'success',
            'Account created successfully.',
        );
    }

    /**
     * Show login page (Inertia).
     */
    public function loginPage(Request $request)
    {
        $redirect = $request->query('redirect');

        return Inertia::render('Auth/Login', [
            'redirect' => $redirect,
            'cardCode' => $this->cardContextFromRedirect($redirect),
        ]);
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

        $redirect = $this->authService->resolveCardRedirect(
            $request->input('redirect') ?: $request->query('redirect'),
        );

        if ($redirect) {
            return redirect($redirect);
        }

        return redirect()->route('dashboard');
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

    /**
     * @return array{code: string, name: string}|null
     */
    protected function cardContextFromRedirect(?string $redirect): ?array
    {
        if (! CardCodePath::isCardCodePath($redirect)) {
            return null;
        }

        $cardCode = $this->cardCodeService->findByCode(
            CardCodePath::codeFromPath($redirect),
        );

        if (! $cardCode) {
            return null;
        }

        return [
            'code' => $cardCode->code,
            'name' => $cardCode->name,
        ];
    }
}
