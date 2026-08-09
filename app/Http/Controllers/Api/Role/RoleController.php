<?php

namespace App\Http\Controllers\Api\Role;

use App\Http\Controllers\Concerns\RespondsWithInertia;
use App\Http\Controllers\Controller;
use App\Http\Requests\Role\StoreRoleRequest;
use App\Http\Requests\Role\UpdateRoleRequest;
use App\Models\Role;
use App\Services\PermissionService;
use App\Services\RoleService;
use App\Support\InertiaData;
use App\Support\PermissionCatalog;
use App\Support\PermissionResolver;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends Controller
{
    use RespondsWithInertia;

    public function __construct(
        protected RoleService $roleService,
        protected PermissionService $permissionService,
    ) {}

    public function indexPage(Request $request)
    {
        if (! PermissionResolver::allowsAny($request->user(), PermissionCatalog::roleViewPermissions())) {
            throw new AuthorizationException('Forbidden');
        }

        return Inertia::render('AccessControl/Roles', [
            'roles' => InertiaData::paginate(
                Role::query()
                    ->where('guard_name', PermissionCatalog::GUARD)
                    ->with('permissions:id,name')
                    ->withCount('permissions')
                    ->latest()
                    ->paginate($request->integer('per_page', 10)),
            ),
        ]);
    }

    public function createPage(Request $request)
    {
        if (! PermissionResolver::allows($request->user(), 'rbac.role.create')
            && ! PermissionResolver::allows($request->user(), 'rbac.*')) {
            throw new AuthorizationException('Forbidden');
        }

        return Inertia::render('AccessControl/RoleForm', [
            'mode' => 'create',
            'role' => null,
            'permissionGroups' => $this->permissionService->groupedForRoleForm(),
            'selectedPermissions' => [],
        ]);
    }

    public function editPage(Request $request, Role $role)
    {
        if (! PermissionResolver::allows($request->user(), 'rbac.role.update')
            && ! PermissionResolver::allows($request->user(), 'rbac.*')) {
            throw new AuthorizationException('Forbidden');
        }

        if ($role->isProtected()) {
            abort(403, 'This system role cannot be modified.');
        }

        $role->load('permissions:id,name');

        return Inertia::render('AccessControl/RoleForm', [
            'mode' => 'edit',
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
                'is_protected' => $role->isProtected(),
            ],
            'permissionGroups' => $this->permissionService->groupedForRoleForm(),
            'selectedPermissions' => $role->permissions->pluck('name')->values()->all(),
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
