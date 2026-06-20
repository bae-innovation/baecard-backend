<?php

namespace App\Services;

use App\Enums\UserRole;
use App\Models\User;
use App\Support\RoleAbility;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class UserService
{
    use ApiResponseTrait;

    public function list(): JsonResponse
    {
        $users = User::with('roles')->paginate(10);

        return $this->successResponse($users, 'Users retrieved successfully.');
    }

    public function find(int $id): JsonResponse
    {
        $user = User::with('roles')->find($id);

        if (! $user) {
            return $this->notFoundResponse('User not found.');
        }

        return $this->successResponse($user, 'User retrieved successfully.');
    }

    public function create(array $data): JsonResponse
    {
        return DB::transaction(function () use ($data) {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => $data['password'] ?? 'password',
                'phone' => $data['phone'] ?? null,
            ]);

            $roleName = $this->resolveRoleForCreate($data['role'] ?? null);
            $user->assignRole($roleName);

            return $this->successResponse(
                $user->load('roles'),
                'User created successfully.',
                201
            );
        });
    }

    public function update(int $id, array $data): JsonResponse
    {
        return DB::transaction(function () use ($id, $data) {
            $user = User::find($id);

            if (! $user) {
                return $this->notFoundResponse('User not found.');
            }

            $fields = [];

            if (array_key_exists('name', $data)) {
                $fields['name'] = $data['name'];
            }

            if (array_key_exists('email', $data)) {
                $fields['email'] = $data['email'];
            }

            if (array_key_exists('phone', $data)) {
                $fields['phone'] = $data['phone'];
            }

            if ($fields !== []) {
                $user->update($fields);
            }

            return $this->successResponse(
                $user->fresh()->load('roles'),
                'User updated successfully.'
            );
        });
    }

    public function assignRole(int $id, string $roleName): JsonResponse
    {
        return DB::transaction(function () use ($id, $roleName) {
            $user = User::find($id);

            if (! $user) {
                return $this->notFoundResponse('User not found.');
            }

            $user->syncRoles([$roleName]);

            return $this->successResponse(
                $user->fresh()->load('roles'),
                'User role assigned successfully.'
            );
        });
    }

    public function delete(int $id): JsonResponse
    {
        return DB::transaction(function () use ($id) {
            $user = User::find($id);

            if (! $user) {
                return $this->notFoundResponse('User not found.');
            }

            if (request()->user() && request()->user()->id === $user->id) {
                return $this->errorResponse('You cannot delete your own account.', null, 400);
            }

            $user->tokens()->delete();
            $user->delete();

            return $this->successResponse(null, 'User deleted successfully.');
        });
    }

    private function resolveRoleForCreate(?string $requestedRole): string
    {
        $authUser = request()->user();

        if ($authUser && RoleAbility::allows($authUser, 'users.assign_role') && $requestedRole) {
            return $requestedRole;
        }

        return UserRole::User->value;
    }
}
