<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Services\CardService;

class DashboardController extends Controller
{
    public function __construct(
        protected CardService $cardService
    ) {}

    public function index()
    {
        return $this->cardService->list();
    }

    public function show(int $id)
    {
        return $this->cardService->find($id);
    }

    public function generate(int $id)
    {
        return $this->cardService->assignToUser($id);
    }

    public function regenerate(int $id)
    {
        return $this->cardService->regenerateForUser($id);
    }
}
