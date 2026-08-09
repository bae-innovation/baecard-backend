<?php

namespace App\Http\Controllers\Api\Role;

use App\Http\Controllers\Controller;
use App\Services\PermissionService;
use Inertia\Inertia;
use Inertia\Response;

class PermissionController extends Controller
{
    public function __construct(
        protected PermissionService $permissionService,
    ) {}

    public function indexPage(): Response
    {
        return Inertia::render('AccessControl/Permissions', [
            'permissionGroups' => $this->permissionService->groupedForInertia(),
        ]);
    }

    public function index()
    {
        return $this->permissionService->grouped();
    }
}
