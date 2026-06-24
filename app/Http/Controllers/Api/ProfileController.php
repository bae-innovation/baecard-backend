<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CardCodeService;
use App\Support\CardCodePath;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ProfileController extends Controller
{
    public function __construct(
        protected CardCodeService $cardCodeService
    ) {}

    public function show(string $slug, string $code)
    {
        $cardCode = $this->cardCodeService->findPublishedByCode($code);

        if (! $cardCode || ! $cardCode->user) {
            throw new NotFoundHttpException('Profile not found.');
        }

        return redirect(CardCodePath::pathForCode($cardCode->code));
    }
}
