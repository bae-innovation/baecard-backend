<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ParseJsonBody
{
    /**
     * Merge JSON request body when clients omit Content-Type: application/json.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->isMethod('GET') || $request->isMethod('HEAD')) {
            return $next($request);
        }

        $content = trim($request->getContent());

        if ($content === '' || ! str_starts_with($content, '{')) {
            return $next($request);
        }

        if ($request->hasAny(['email', 'name', 'password', 'token'])) {
            return $next($request);
        }

        $payload = json_decode($content, true);

        if (json_last_error() === JSON_ERROR_NONE && is_array($payload)) {
            $request->merge($payload);
        }

        return $next($request);
    }
}
