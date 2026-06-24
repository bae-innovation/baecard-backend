<?php

namespace App\Http\Controllers\Api\User;

use App\Enums\UserRole;
use App\Http\Controllers\Concerns\RespondsWithInertia;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\AssignUserRoleRequest;
use App\Http\Requests\User\StoreStaffUserRequest;
use App\Http\Requests\User\UpdateAccountPasswordRequest;
use App\Http\Requests\User\UpdateAccountRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Models\User;
use App\Services\UserService;
use App\Support\InertiaData;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    use RespondsWithInertia;

    protected UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function accessControlIndexPage(Request $request)
    {
        return Inertia::render('AccessControl/Users', [
            'users' => InertiaData::paginate(
                User::query()
                    ->with('roles')
                    ->whereDoesntHave('roles', fn ($query) => $query->where('name', UserRole::User->value))
                    ->latest()
                    ->paginate($request->integer('per_page', 10))
            ),
            'roles' => Role::query()
                ->where('guard_name', UserRole::GUARD)
                ->where('name', '!=', UserRole::User->value)
                ->orderBy('name')
                ->get(['id', 'name']),
        ]);
    }

    public function accountPage(Request $request)
    {
        return Inertia::render('User/Account', [
            'user' => $request->user()->load([
                'roles:id,name',
                'cardCode' => fn ($query) => $query->select([
                    'id',
                    'code',
                    'name',
                    'phone',
                    'status',
                    'user_id',
                    'created_at',
                    'updated_at',
                ]),
            ]),
        ]);
    }

    public function updateAccount(UpdateAccountRequest $request)
    {
        return $this->webOrBack(
            $request,
            $this->userService->updateAccount($request->user(), $request->validated()),
            'Account updated.',
        );
    }

    public function updateAccountPassword(UpdateAccountPasswordRequest $request)
    {
        return $this->webOrBack(
            $request,
            $this->userService->updateAccountPassword($request->user(), $request->validated()),
            'Password updated.',
        );
    }

    public function index()
    {
        return $this->userService->list();
    }

    public function show(int $id)
    {
        return $this->userService->find($id);
    }

    public function store(StoreStaffUserRequest $request)
    {
        return $this->webOrJson(
            $request,
            $this->userService->createStaff($request->validated()),
            'access-control.users.index',
            'User created.',
        );
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        $this->ensureStaffUser($user);

        return $this->webOrJson(
            $request,
            $this->userService->update($user->id, $request->validated()),
            'access-control.users.index',
            'User updated.',
        );
    }

    public function assignRole(AssignUserRoleRequest $request, User $user)
    {
        $this->ensureStaffUser($user);

        return $this->webOrJson(
            $request,
            $this->userService->assignRole($user->id, $request->validated('role')),
            'access-control.users.index',
            'User role assigned.',
        );
    }

    public function destroy(Request $request, User $user)
    {
        $this->ensureStaffUser($user);

        return $this->webOrJson(
            $request,
            $this->userService->delete($user->id),
            'access-control.users.index',
            'User deleted.',
        );
    }

    private function ensureStaffUser(User $user): void
    {
        if ($user->hasRole(UserRole::User->value)) {
            abort(404);
        }
    }
}
