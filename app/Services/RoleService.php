<?php

namespace App\Services;

use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;

class RoleService
{
    use ApiResponseTrait;

    private const GUARD = 'sanctum';

    /**
     * List all roles with pagination.
     */
    public function list(): JsonResponse
    {
        $roles = Role::where('guard_name', self::GUARD)->paginate(10);

        return $this->successResponse($roles, 'Roles retrieved successfully.');
    }

    /**
     * Find a role by ID.
     */
    public function find(int $id): JsonResponse
    {
        $role = Role::where('guard_name', self::GUARD)->find($id);

        if (!$role) {
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
            $role = Role::create([
                'name' => $data['name'],
                'guard_name' => self::GUARD,
            ]);

            return $this->successResponse($role, 'Role created successfully.', 201);
        });
    }

    /**
     * Update a role.
     */
    public function update(int $id, array $data): JsonResponse
    {
        return DB::transaction(function () use ($id, $data) {
            $role = Role::where('guard_name', self::GUARD)->find($id);

            if (!$role) {
                return $this->notFoundResponse('Role not found.');
            }

            $role->update(['name' => $data['name']]);

            return $this->successResponse($role->fresh(), 'Role updated successfully.');
        });
    }

    /**
     * Delete a role.
     */
    public function delete(int $id): JsonResponse
    {
        return DB::transaction(function () use ($id) {
            $role = Role::where('guard_name', self::GUARD)->find($id);

            if (!$role) {
                return $this->notFoundResponse('Role not found.');
            }

            if ($role->name === 'SuperAdmin') {
                return $this->errorResponse('The SuperAdmin role cannot be deleted.', null, 400);
            }

            $role->delete();

            return $this->successResponse(null, 'Role deleted successfully.');
        });
    }
}
