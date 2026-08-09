<?php

namespace App\Support;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class InertiaErrorResponder
{
    public static function forbidden(Request $request, ?string $message = null): Response
    {
        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json([
                'success' => false,
                'message' => 'Forbidden',
            ], 403);
        }

        return Inertia::render('Errors/Forbidden', [
            'message' => self::normalizeMessage($message),
        ])->toResponse($request)->setStatusCode(403);
    }

    public static function notFound(Request $request, ?string $message = null): Response
    {
        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json([
                'success' => false,
                'message' => 'Not found',
            ], 404);
        }

        return Inertia::render('Errors/NotFound', [
            'message' => self::normalizeMessage($message),
        ])->toResponse($request)->setStatusCode(404);
    }

    private static function normalizeMessage(?string $message): ?string
    {
        if ($message === null || $message === '') {
            return null;
        }

        $generic = [
            'This action is unauthorized.',
            'Forbidden',
            'Not found',
            'Route not found',
            'Resource not found',
        ];

        return in_array($message, $generic, true) ? null : $message;
    }
}
