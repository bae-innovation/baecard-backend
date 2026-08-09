<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Services\DashboardService;
use App\Support\PermissionResolver;
use Illuminate\Auth\Access\AuthorizationException;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        protected DashboardService $dashboardService,
    ) {}

    public function indexPage(): Response
    {
        $user = request()->user();

        if (! $user || ! PermissionResolver::canViewDashboard($user)) {
            throw new AuthorizationException('Forbidden');
        }

        return Inertia::render('Dashboard/Index', [
            'stats' => $this->dashboardService->stats(),
        ]);
    }
}
