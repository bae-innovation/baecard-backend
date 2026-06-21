<?php

namespace App\Http\Controllers\Concerns;

use App\Support\InertiaData;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

trait RespondsWithInertia
{
    protected function webOrJson(
        Request $request,
        JsonResponse $response,
        string $successRoute,
        string $successMessage,
        array $routeParameters = [],
    ): JsonResponse|RedirectResponse {
        return InertiaData::webOrJson(
            $request,
            $response,
            $successRoute,
            $successMessage,
            $routeParameters,
        );
    }
}
