<?php

namespace App\Http\Middleware;

use App\Support\PermissionResolver;
use Closure;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsurePermission
{
    /**
     * Check if the authenticated user has any of the given permissions.
     */
    public function handle(Request $request, Closure $next, string ...$permissions): Response
    {
        $user = $request->user();

        if (! $user) {
            throw new AuthorizationException('Forbidden');
        }

        if (PermissionResolver::allowsAny($user, $permissions)) {
            return $next($request);
        }

        throw new AuthorizationException('Forbidden');
    }
}
