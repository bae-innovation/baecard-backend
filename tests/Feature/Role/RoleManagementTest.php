<?php

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RoleSeeder::class);

    $this->superAdmin = User::factory()->create([
        'email' => 'superadmin@test.com',
        'password' => bcrypt('password123'),
        'email_verified_at' => now(),
    ]);
    $this->superAdmin->assignRole('SuperAdmin');
    $this->superAdminToken = $this->superAdmin->createToken('auth-token')->plainTextToken;
});

describe('Role Management - As SuperAdmin', function () {
    it('can list roles', function () {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->superAdminToken,
        ])->getJson('/api/role/list');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data',
            ])
            ->assertJson([
                'success' => true,
                'message' => 'Roles retrieved successfully.',
            ]);
    });

    it('can show a specific role', function () {
        $role = Role::where('guard_name', 'sanctum')->first();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->superAdminToken,
        ])->getJson('/api/role/show/' . $role->id);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Role retrieved successfully.',
            ]);
    });

    it('can create a role', function () {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->superAdminToken,
        ])->postJson('/api/role/create', [
            'name' => 'Editor',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Role created successfully.',
            ]);

        $this->assertDatabaseHas('roles', ['name' => 'Editor', 'guard_name' => 'sanctum']);
    });

    it('can update a role', function () {
        $role = Role::create(['name' => 'Editor', 'guard_name' => 'sanctum']);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->superAdminToken,
        ])->putJson('/api/role/update/' . $role->id, [
            'name' => 'Senior Editor',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Role updated successfully.',
            ]);

        $this->assertDatabaseHas('roles', ['id' => $role->id, 'name' => 'Senior Editor']);
    });

    it('can delete a role', function () {
        $role = Role::create(['name' => 'Editor', 'guard_name' => 'sanctum']);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->superAdminToken,
        ])->deleteJson('/api/role/delete/' . $role->id);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Role deleted successfully.',
            ]);

        $this->assertDatabaseMissing('roles', ['id' => $role->id]);
    });

    it('cannot delete SuperAdmin role', function () {
        $role = Role::where('name', 'SuperAdmin')->where('guard_name', 'sanctum')->first();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->superAdminToken,
        ])->deleteJson('/api/role/delete/' . $role->id);

        $response->assertStatus(400)
            ->assertJson([
                'success' => false,
                'message' => 'The SuperAdmin role cannot be deleted.',
            ]);
    });
});

describe('Role Management - Unauthorized', function () {
    it('fails to access role management without SuperAdmin role', function () {
        $user = User::factory()->create(['email_verified_at' => now()]);
        $user->assignRole('User');
        $token = $user->createToken('auth-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/role/list');

        $response->assertStatus(403);
    });
});
