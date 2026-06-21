<?php

namespace App\Http\Controllers\Api\Role;

use App\Http\Controllers\Concerns\RespondsWithInertia;
use App\Http\Controllers\Controller;
use App\Http\Requests\Role\StoreRoleRequest;
use App\Http\Requests\Role\UpdateRoleRequest;
use App\Services\RoleService;
use App\Support\InertiaData;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    use RespondsWithInertia;

    protected RoleService $roleService;

    public function __construct(RoleService $roleService)
    {
        $this->roleService = $roleService;
    }

    public function indexPage(Request $request)
    {
        return Inertia::render('AccessControl/Roles', [
            'roles' => InertiaData::paginate(
                Role::where('guard_name', 'sanctum')
                    ->latest()
                    ->paginate($request->integer('per_page', 10))
            ),
        ]);
    }

    public function index()
    {
        return $this->roleService->list();
    }

    public function show(int $id)
    {
        return $this->roleService->find($id);
    }

    public function store(StoreRoleRequest $request)
    {
        return $this->webOrJson(
            $request,
            $this->roleService->create($request->validated()),
            'access-control.roles.index',
            'Role created.',
        );
    }

    public function update(UpdateRoleRequest $request, Role $role)
    {
        return $this->webOrJson(
            $request,
            $this->roleService->update($role->id, $request->validated()),
            'access-control.roles.index',
            'Role updated.',
        );
    }

    public function destroy(Request $request, Role $role)
    {
        return $this->webOrJson(
            $request,
            $this->roleService->delete($role->id),
            'access-control.roles.index',
            'Role deleted.',
        );
    }
}
