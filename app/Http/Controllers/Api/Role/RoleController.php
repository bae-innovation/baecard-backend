<?php

namespace App\Http\Controllers\Api\Role;

use App\Http\Controllers\Controller;
use App\Http\Requests\Role\StoreRoleRequest;
use App\Http\Requests\Role\UpdateRoleRequest;
use App\Services\RoleService;

class RoleController extends Controller
{
    protected RoleService $roleService;

    public function __construct(RoleService $roleService)
    {
        $this->roleService = $roleService;
    }

    /**
     * Display a listing of roles.
     */
    public function index()
    {
        return $this->roleService->list();
    }

    /**
     * Display the specified role.
     */
    public function show(int $id)
    {
        return $this->roleService->find($id);
    }

    /**
     * Store a newly created role.
     */
    public function store(StoreRoleRequest $request)
    {
        return $this->roleService->create($request->validated());
    }

    /**
     * Update the specified role.
     */
    public function update(int $id, UpdateRoleRequest $request)
    {
        return $this->roleService->update($id, $request->validated());
    }

    /**
     * Remove the specified role.
     */
    public function destroy(int $id)
    {
        return $this->roleService->delete($id);
    }
}