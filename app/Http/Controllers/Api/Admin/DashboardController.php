<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Services\DashboardService;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        protected DashboardService $dashboardService,
    ) {}

    public function indexPage(): Response
    {
        return Inertia::render('Dashboard/Index', [
            'stats' => $this->dashboardService->stats(),
        ]);
    }
}
