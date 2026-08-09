<?php

namespace App\Services;

use App\Models\Permission;
use App\Support\PermissionCatalog;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;

class PermissionService
{
    use ApiResponseTrait;

    public function grouped(): JsonResponse
    {
        $permissions = Permission::query()
            ->where('guard_name', PermissionCatalog::GUARD)
            ->where('name', '!=', PermissionCatalog::GLOBAL_WILDCARD)
            ->orderBy('group')
            ->orderBy('name')
            ->get(['id', 'name', 'group', 'label', 'is_wildcard']);

        $grouped = $permissions
            ->groupBy('group')
            ->map(fn ($items, $group) => [
                'group' => $group,
                'permissions' => $items->values(),
            ])
            ->values();

        return $this->successResponse($grouped, 'Permissions retrieved successfully.');
    }

    /**
     * @return array<string, list<array{id: int, name: string, label: string, is_wildcard: bool}>>
     */
    public function groupedForInertia(): array
    {
        return Permission::query()
            ->where('guard_name', PermissionCatalog::GUARD)
            ->where('name', '!=', PermissionCatalog::GLOBAL_WILDCARD)
            ->orderBy('group')
            ->orderBy('name')
            ->get(['id', 'name', 'group', 'label', 'is_wildcard'])
            ->groupBy('group')
            ->map(fn ($items) => $items->map(fn (Permission $permission) => [
                'id' => $permission->id,
                'name' => $permission->name,
                'label' => $permission->label ?? $permission->name,
                'is_wildcard' => $permission->is_wildcard,
            ])->values()->all())
            ->all();
    }

    /**
     * @return array<string, list<array{id: int, name: string, label: string, is_wildcard: bool}>>
     */
    public function groupedForRoleForm(): array
    {
        return $this->groupedForInertia();
    }
}
