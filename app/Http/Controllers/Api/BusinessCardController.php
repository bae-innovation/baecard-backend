<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CardService;

class BusinessCardController extends Controller
{
    public function __construct(
        protected CardService $cardService
    ) {}

    public function show(string $uid)
    {
        return $this->cardService->getCardByUid($uid);
    }
}
