<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Concerns\RespondsWithInertia;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\AssignUserRoleRequest;
use App\Http\Requests\User\StoreUserRequest;
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

    public function indexPage(Request $request)
    {
        return Inertia::render('Users/Index', [
            'users' => InertiaData::paginate(
                User::query()
                    ->with('roles')
                    ->whereDoesntHave('roles', fn ($query) => $query->where('name', 'User'))
                    ->latest()
                    ->paginate($request->integer('per_page', 10))
            ),
        ]);
    }

    public function customersIndexPage(Request $request)
    {
        return Inertia::render('Customers/Index', [
            'customers' => InertiaData::paginate(
                User::role('User')
                    ->with('roles')
                    ->latest()
                    ->paginate($request->integer('per_page', 10))
            ),
        ]);
    }

    public function settingsPage()
    {
        return Inertia::render('Settings/Index');
    }

    public function accessControlIndexPage(Request $request)
    {
        return Inertia::render('AccessControl/Users', [
            'users' => InertiaData::paginate(
                User::with('roles')->latest()->paginate($request->integer('per_page', 10))
            ),
            'roles' => Role::where('guard_name', 'sanctum')->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function accountPage(Request $request)
    {
        return Inertia::render('User/Account', [
            'user' => $request->user()->load('roles:id,name'),
        ]);
    }

    public function index()
    {
        return $this->userService->list();
    }

    public function show(int $id)
    {
        return $this->userService->find($id);
    }

    public function store(StoreUserRequest $request)
    {
        return $this->webOrJson(
            $request,
            $this->userService->create($request->validated()),
            'users.index',
            'User created.',
        );
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        return $this->webOrJson(
            $request,
            $this->userService->update($user->id, $request->validated()),
            'users.index',
            'User updated.',
        );
    }

    public function assignRole(AssignUserRoleRequest $request, User $user)
    {
        return $this->webOrJson(
            $request,
            $this->userService->assignRole($user->id, $request->validated('role')),
            'access-control.users.index',
            'User role assigned.',
        );
    }

    public function destroy(Request $request, User $user)
    {
        return $this->webOrJson(
            $request,
            $this->userService->delete($user->id),
            'users.index',
            'User deleted.',
        );
    }
}
