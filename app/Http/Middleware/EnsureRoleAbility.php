<?php

namespace App\Http\Middleware;

use App\Support\RoleAbility;
use Closure;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRoleAbility
{
    /**
     * Check if the authenticated user's role is allowed for this ability.
     */
    public function handle(Request $request, Closure $next, string ...$abilities): Response
    {
        $user = $request->user();

        if (! $user) {
            throw new AuthorizationException('Forbidden');
        }

        foreach ($abilities as $ability) {
            if (RoleAbility::allows($user, $ability)) {
                return $next($request);
            }
        }

        throw new AuthorizationException('Forbidden');
    }
}
