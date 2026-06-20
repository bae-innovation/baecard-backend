<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\AssignUserRoleRequest;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Services\UserService;

class UserController extends Controller
{
    protected UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * Display a listing of users.
     */
    public function index()
    {
        return $this->userService->list();
    }

    /**
     * Display the specified user.
     */
    public function show(int $id)
    {
        return $this->userService->find($id);
    }

    /**
     * Store a newly created user.
     */
    public function store(StoreUserRequest $request)
    {
        return $this->userService->create($request->validated());
    }

    /**
     * Update the specified user.
     */
    public function update(int $id, UpdateUserRequest $request)
    {
        return $this->userService->update($id, $request->validated());
    }

    /**
     * Assign a role to a user (SuperAdmin only — any role from DB).
     */
    public function assignRole(int $id, AssignUserRoleRequest $request)
    {
        return $this->userService->assignRole($id, $request->validated('role'));
    }

    /**
     * Remove the specified user.
     */
    public function destroy(int $id)
    {
        return $this->userService->delete($id);
    }
}