<?php

namespace Tests\Feature\Rbac;

use App\Enums\UserRole;
use App\Models\User;
use App\Support\PermissionCatalog;
use App\Support\PermissionResolver;
use Database\Seeders\RbacSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RbacSeeder::class);
});

it('seeds permissions with wildcards and metadata', function () {
    $this->assertDatabaseHas('permissions', [
        'name' => '*',
        'is_wildcard' => true,
    ]);

    $this->assertDatabaseHas('permissions', [
        'name' => 'dashboard.*',
        'group' => 'dashboard',
        'is_wildcard' => true,
    ]);

    $this->assertDatabaseHas('permissions', [
        'name' => 'rbac.permission.view',
        'group' => 'rbac',
        'is_wildcard' => false,
    ]);
});

it('grants super admin access through the global wildcard', function () {
    $superAdmin = User::factory()->create(['email_verified_at' => now()]);
    $superAdmin->assignRole(UserRole::SuperAdmin->value);

    expect(PermissionResolver::allows($superAdmin, 'dashboard.analytics.view'))->toBeTrue();
    expect(PermissionResolver::allows($superAdmin, 'rbac.permission.view'))->toBeTrue();
});

it('allows admins to view permissions and create roles', function () {
    $admin = User::factory()->create(['email_verified_at' => now()]);
    $admin->assignRole(UserRole::Admin->value);

    $this->actingAs($admin)->get('/access-control/permissions')->assertOk();
    $this->actingAs($admin)->get('/access-control/roles/create')->assertOk();
});

it('blocks customers from rbac pages', function () {
    $customer = User::factory()->create(['email_verified_at' => now()]);
    $customer->assignRole(UserRole::User->value);

    $this->actingAs($customer)->get('/access-control/permissions')->assertForbidden();
    $this->actingAs($customer)->get('/access-control/roles')->assertForbidden();
});

it('creates a custom role with selected permissions', function () {
    $admin = User::factory()->create(['email_verified_at' => now()]);
    $admin->assignRole(UserRole::Admin->value);

    $response = $this->actingAs($admin)->post('/access-control/roles', [
        'name' => 'Sales Manager',
        'permissions' => ['order.website_order.view', 'product.product.view'],
    ]);

    $response->assertRedirect(route('access-control.roles.index'));

    $this->assertDatabaseHas('roles', ['name' => 'Sales Manager']);
});

it('rejects assigning the global wildcard through the role form', function () {
    $admin = User::factory()->create(['email_verified_at' => now()]);
    $admin->assignRole(UserRole::Admin->value);

    $this->actingAs($admin)
        ->from('/access-control/roles/create')
        ->post('/access-control/roles', [
            'name' => 'Invalid Role',
            'permissions' => [PermissionCatalog::GLOBAL_WILDCARD],
        ])
        ->assertSessionHasErrors('permissions');
});

it('prevents editing protected system roles', function () {
    $admin = User::factory()->create(['email_verified_at' => now()]);
    $admin->assignRole(UserRole::Admin->value);

    $roleId = \App\Models\Role::query()->where('name', 'SuperAdmin')->value('id');

    $this->actingAs($admin)
        ->get("/access-control/roles/{$roleId}/edit")
        ->assertForbidden();
});

it('allows editing the User role', function () {
    $admin = User::factory()->create(['email_verified_at' => now()]);
    $admin->assignRole(UserRole::Admin->value);

    $roleId = \App\Models\Role::query()->where('name', UserRole::User->value)->value('id');

    $this->actingAs($admin)
        ->get("/access-control/roles/{$roleId}/edit")
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('AccessControl/RoleForm')
            ->where('mode', 'edit'));
});
