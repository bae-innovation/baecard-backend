<?php

namespace App\Support;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class InertiaData
{
    public static function paginate(
        LengthAwarePaginator $paginator,
    ): LengthAwarePaginator {
        return $paginator->withQueryString();
    }

    public static function prefersJson(Request $request): bool
    {
        return $request->expectsJson() || $request->is('api/*');
    }

    public static function webOrJson(
        Request $request,
        JsonResponse $response,
        string $successRoute,
        string $successMessage,
        array $routeParameters = [],
    ): JsonResponse|RedirectResponse {
        if (self::prefersJson($request)) {
            return $response;
        }

        if ($response->getStatusCode() >= 400) {
            $data = json_decode($response->getContent(), true);

            return back()->with('error', $data['message'] ?? 'An error occurred.');
        }

        return redirect()
            ->route($successRoute, $routeParameters)
            ->with('success', $successMessage);
    }
}
