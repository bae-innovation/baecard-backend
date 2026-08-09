<?php

namespace App\Services;

use App\Models\Role;
use App\Support\PermissionCatalog;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class RoleService
{
    use ApiResponseTrait;

    /**
     * List all roles with pagination.
     */
    public function list(): JsonResponse
    {
        $roles = Role::query()
            ->where('guard_name', PermissionCatalog::GUARD)
            ->withCount('permissions')
            ->paginate(10);

        return $this->successResponse($roles, 'Roles retrieved successfully.');
    }

    /**
     * Find a role by ID.
     */
    public function find(int $id): JsonResponse
    {
        $role = Role::query()
            ->where('guard_name', PermissionCatalog::GUARD)
            ->with('permissions:id,name')
            ->find($id);

        if (! $role) {
            return $this->notFoundResponse('Role not found.');
        }

        return $this->successResponse($role, 'Role retrieved successfully.');
    }

    /**
     * Create a new role.
     */
    public function create(array $data): JsonResponse
    {
        return DB::transaction(function () use ($data) {
            $this->assertAssignablePermissions($data['permissions'] ?? []);

            $role = Role::query()->create([
                'name' => $data['name'],
                'guard_name' => PermissionCatalog::GUARD,
                'is_protected' => false,
            ]);

            $role->syncPermissions($data['permissions'] ?? []);

            return $this->successResponse(
                $role->load('permissions:id,name'),
                'Role created successfully.',
                201,
            );
        });
    }

    /**
     * Update a role.
     */
    public function update(int $id, array $data): JsonResponse
    {
        return DB::transaction(function () use ($id, $data) {
            $role = Role::query()
                ->where('guard_name', PermissionCatalog::GUARD)
                ->find($id);

            if (! $role) {
                return $this->notFoundResponse('Role not found.');
            }

            if ($role->isProtected()) {
                return $this->errorResponse('This system role cannot be modified.', null, 400);
            }

            $this->assertAssignablePermissions($data['permissions'] ?? []);

            $role->update(['name' => $data['name']]);
            $role->syncPermissions($data['permissions'] ?? []);

            return $this->successResponse(
                $role->fresh()->load('permissions:id,name'),
                'Role updated successfully.',
            );
        });
    }

    /**
     * Delete a role.
     */
    public function delete(int $id): JsonResponse
    {
        return DB::transaction(function () use ($id) {
            $role = Role::query()
                ->where('guard_name', PermissionCatalog::GUARD)
                ->find($id);

            if (! $role) {
                return $this->notFoundResponse('Role not found.');
            }

            if ($role->isProtected()) {
                return $this->errorResponse('This system role cannot be deleted.', null, 400);
            }

            $role->delete();

            return $this->successResponse(null, 'Role deleted successfully.');
        });
    }

    /**
     * @param  list<string>  $permissions
     */
    public function assertAssignablePermissions(array $permissions): void
    {
        if (in_array(PermissionCatalog::GLOBAL_WILDCARD, $permissions, true)) {
            throw ValidationException::withMessages([
                'permissions' => 'The global wildcard permission cannot be assigned through the UI.',
            ]);
        }

        $allowed = PermissionCatalog::assignableNames();
        $invalid = array_values(array_diff($permissions, $allowed));

        if ($invalid !== []) {
            throw ValidationException::withMessages([
                'permissions' => 'One or more selected permissions are invalid.',
            ]);
        }
    }
}
