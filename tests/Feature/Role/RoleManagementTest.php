<?php

use App\Models\Role;
use App\Models\User;
use Database\Seeders\RbacSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RbacSeeder::class);

    $this->superAdmin = User::factory()->create([
        'email' => 'superadmin@test.com',
        'email_verified_at' => now(),
    ]);
    $this->superAdmin->assignRole('SuperAdmin');
});

describe('Role Management - As SuperAdmin', function () {
    it('can list roles', function () {
        $this->actingAs($this->superAdmin)
            ->get('/access-control/roles')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('AccessControl/Roles'));
    });

    it('can open the create role page', function () {
        $this->actingAs($this->superAdmin)
            ->get('/access-control/roles/create')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('AccessControl/RoleForm')
                ->where('mode', 'create'));
    });

    it('can create a role with permissions', function () {
        $this->actingAs($this->superAdmin)
            ->post('/access-control/roles', [
                'name' => 'Editor',
                'permissions' => ['order.order.view', 'product.product.view'],
            ])
            ->assertRedirect(route('access-control.roles.index'));

        $this->assertDatabaseHas('roles', ['name' => 'Editor', 'guard_name' => 'sanctum']);
    });

    it('can update a role', function () {
        $role = Role::query()->create([
            'name' => 'Editor',
            'guard_name' => 'sanctum',
            'is_protected' => false,
        ]);
        $role->syncPermissions(['order.order.view']);

        $this->actingAs($this->superAdmin)
            ->put("/access-control/roles/{$role->id}", [
                'name' => 'Senior Editor',
                'permissions' => ['order.order.view', 'product.product.view'],
            ])
            ->assertRedirect(route('access-control.roles.index'));

        $this->assertDatabaseHas('roles', ['id' => $role->id, 'name' => 'Senior Editor']);
    });

    it('can delete a role', function () {
        $role = Role::query()->create([
            'name' => 'Editor',
            'guard_name' => 'sanctum',
            'is_protected' => false,
        ]);

        $this->actingAs($this->superAdmin)
            ->delete("/access-control/roles/{$role->id}")
            ->assertRedirect(route('access-control.roles.index'));

        $this->assertDatabaseMissing('roles', ['id' => $role->id]);
    });

    it('cannot delete SuperAdmin role', function () {
        $role = Role::query()->where('name', 'SuperAdmin')->firstOrFail();

        $this->actingAs($this->superAdmin)
            ->delete("/access-control/roles/{$role->id}")
            ->assertSessionHasErrors();
    });
});

describe('Role Management - Unauthorized', function () {
    it('fails to access role management without staff permissions', function () {
        $user = User::factory()->create(['email_verified_at' => now()]);
        $user->assignRole('User');

        $this->actingAs($user)
            ->get('/access-control/roles')
            ->assertForbidden();
    });
});
