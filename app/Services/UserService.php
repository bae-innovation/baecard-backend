<?php

namespace App\Services;

use App\Enums\UserRole;
use App\Models\User;
use App\Services\ImageUploadService;
use App\Support\RoleAbility;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserService
{
    use ApiResponseTrait;

    public function __construct(
        protected ImageUploadService $imageUploadService,
    ) {}

    public function list(): JsonResponse
    {
        $users = User::query()
            ->with('roles')
            ->whereDoesntHave('roles', fn ($query) => $query->where('name', UserRole::User->value))
            ->paginate(10);

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

    public function createStaff(array $data): JsonResponse
    {
        return DB::transaction(function () use ($data) {
            $authUser = request()->user();
            $requestedRole = $data['role'];

            if (
                $requestedRole === UserRole::SuperAdmin->value
                && $authUser
                && $authUser->hasRole('Admin')
                && ! $authUser->hasRole('SuperAdmin')
            ) {
                return $this->errorResponse('You cannot assign the SuperAdmin role.', null, 403);
            }

            if ($requestedRole === UserRole::User->value) {
                return $this->errorResponse(
                    'Customer accounts must be created from the Customers page.',
                    null,
                    422,
                );
            }

            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => $data['password'],
                'phone' => $data['phone'] ?? null,
            ]);

            $user->assignRole($requestedRole);

            return $this->successResponse(
                $user->load('roles'),
                'User created successfully.',
                201
            );
        });
    }

    public function updateAccount(User $user, array $data): JsonResponse
    {
        return DB::transaction(function () use ($user, $data) {
            $fields = [
                'name' => $data['name'],
                'phone' => $data['phone'] ?? null,
            ];

            if (request()->hasFile('avatar')) {
                $fields['avatar'] = $this->imageUploadService->replace(
                    request()->file('avatar'),
                    $user->avatar,
                    'user',
                );
            } elseif (request()->boolean('remove_avatar')) {
                $this->imageUploadService->delete($user->avatar);
                $fields['avatar'] = null;
            }

            $user->update($fields);

            return $this->successResponse(
                $user->fresh()->load('roles'),
                'Account updated successfully.'
            );
        });
    }

    public function updateAccountPassword(User $user, array $data): JsonResponse
    {
        return DB::transaction(function () use ($user, $data) {
            $user->update([
                'password' => Hash::make($data['password']),
            ]);

            $user->tokens()->delete();

            return $this->successResponse(
                null,
                'Password updated successfully.'
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

            if ($user->hasRole(UserRole::User->value)) {
                return $this->errorResponse(
                    'Customers are managed from the Customers page.',
                    null,
                    422,
                );
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
            $actor = request()->user();

            if (! $actor || ! RoleAbility::allows($actor, 'users.assign_role')) {
                return $this->forbiddenResponse('You are not allowed to assign roles.');
            }

            if ($actor->hasRole('Admin') && ! $actor->hasRole('SuperAdmin') && $roleName === 'SuperAdmin') {
                return $this->errorResponse('You cannot assign the SuperAdmin role.', null, 403);
            }

            $user = User::find($id);

            if (! $user) {
                return $this->notFoundResponse('User not found.');
            }

            if ($user->hasRole(UserRole::User->value)) {
                return $this->errorResponse(
                    'Customers are managed from the Customers page.',
                    null,
                    422,
                );
            }

            if ($roleName === UserRole::User->value) {
                return $this->errorResponse(
                    'The User role is managed from the Customers page.',
                    null,
                    422,
                );
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

            if ($user->hasRole(UserRole::User->value)) {
                return $this->errorResponse(
                    'Customers are managed from the Customers page.',
                    null,
                    422,
                );
            }

            if (request()->user() && request()->user()->id === $user->id) {
                return $this->errorResponse('You cannot delete your own account.', null, 400);
            }

            $user->tokens()->delete();
            $user->delete();

            return $this->successResponse(null, 'User deleted successfully.');
        });
    }
}
