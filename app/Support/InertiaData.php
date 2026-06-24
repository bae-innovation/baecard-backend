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
        if ($request->header('X-Inertia')) {
            return false;
        }

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

            return back()->withErrors([
                'form' => $data['message'] ?? 'An error occurred.',
            ]);
        }

        return redirect()
            ->route($successRoute, $routeParameters)
            ->with('success', $successMessage);
    }

    public static function webOrBack(
        Request $request,
        JsonResponse $response,
        string $successMessage,
    ): JsonResponse|RedirectResponse {
        if (self::prefersJson($request)) {
            return $response;
        }

        if ($response->getStatusCode() >= 400) {
            $data = json_decode($response->getContent(), true);

            return back()->withErrors([
                'form' => $data['message'] ?? 'An error occurred.',
            ]);
        }

        return back()->with('success', $successMessage);
    }
}
