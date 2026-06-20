<?php

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

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

function createVerifiedUserWithRole(string $role): array
{
    $user = User::factory()->create(['email_verified_at' => now()]);
    $user->assignRole($role);
    $token = $user->createToken('auth-token')->plainTextToken;

    return [$user, $token];
}

describe('User Management - As SuperAdmin', function () {
    it('can list users', function () {
        User::factory()->count(3)->create()->each(fn ($user) => $user->assignRole('User'));

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->superAdminToken,
        ])->getJson('/api/user/list');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data',
            ])
            ->assertJson([
                'success' => true,
                'message' => 'Users retrieved successfully.',
            ]);
    });

    it('can show a specific user', function () {
        $user = User::factory()->create();
        $user->assignRole('User');

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->superAdminToken,
        ])->getJson('/api/user/show/' . $user->id);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'User retrieved successfully.',
            ]);
    });

    it('can create a user', function () {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->superAdminToken,
        ])->postJson('/api/user/create', [
            'name' => 'New User',
            'email' => 'newuser@example.com',
            'password' => 'password123',
            'phone' => '1234567890',
            'role' => 'User',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'User created successfully.',
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'newuser@example.com',
        ]);
    });

    it('can update a user', function () {
        $user = User::factory()->create();
        $user->assignRole('User');

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->superAdminToken,
        ])->putJson('/api/user/update/' . $user->id, [
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
            'phone' => '0987654321',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'User updated successfully.',
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
        ]);
    });

    it('can partially update a user with name only', function () {
        $user = User::factory()->create([
            'name' => 'Original Name',
            'email' => 'original@example.com',
        ]);
        $user->assignRole('User');

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->superAdminToken,
        ])->putJson('/api/user/update/' . $user->id, [
            'name' => 'Test Hasan',
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Test Hasan',
            'email' => 'original@example.com',
        ]);
    });

    it('can delete a user', function () {
        $user = User::factory()->create();
        $user->assignRole('User');

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->superAdminToken,
        ])->deleteJson('/api/user/delete/' . $user->id);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'User deleted successfully.',
            ]);

        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    });

    it('returns 404 for non-existent user', function () {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->superAdminToken,
        ])->getJson('/api/user/show/99999');

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'User not found.',
            ]);
    });

    it('can assign any database role to a user', function () {
        $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->superAdminToken,
        ])->postJson('/api/role/create', ['name' => 'Support'])->assertStatus(201);

        $user = User::factory()->create();
        $user->assignRole('User');

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->superAdminToken,
        ])->patchJson('/api/user/assign-role/' . $user->id, [
            'role' => 'Support',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'User role assigned successfully.',
            ]);

        expect($user->fresh()->hasRole('Support'))->toBeTrue();
    });
});

describe('User Management - Role-based access', function () {
    it('denies plain User role from listing users', function () {
        [, $token] = createVerifiedUserWithRole('User');

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/user/list');

        $response->assertStatus(403);
    });

    it('allows Marketing role to list users but not create', function () {
        [, $token] = createVerifiedUserWithRole('Marketing');

        $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/user/list')->assertStatus(200);

        $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/user/create', [
            'name' => 'Blocked User',
            'email' => 'blocked@example.com',
            'password' => 'password123',
            'role' => 'User',
        ])->assertStatus(403);
    });

    it('allows Admin role to create users but not delete', function () {
        [, $token] = createVerifiedUserWithRole('Admin');
        $target = User::factory()->create();
        $target->assignRole('User');

        $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/user/create', [
            'name' => 'Admin Created',
            'email' => 'admincreated@example.com',
            'password' => 'password123',
            'role' => 'User',
        ])->assertStatus(201);

        $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->deleteJson('/api/user/delete/' . $target->id)->assertStatus(403);
    });

    it('denies Admin from assigning roles', function () {
        [, $token] = createVerifiedUserWithRole('Admin');
        $target = User::factory()->create();
        $target->assignRole('User');

        $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->patchJson('/api/user/assign-role/' . $target->id, [
            'role' => 'Admin',
        ])->assertStatus(403);
    });
});

describe('User Management - Unauthorized', function () {
    it('fails to access user management without token', function () {
        $response = $this->getJson('/api/user/list');

        $response->assertStatus(401);
    });

    it('fails to access user management without verified email', function () {
        $user = User::factory()->create(['email_verified_at' => null]);
        $user->assignRole('SuperAdmin');
        $token = $user->createToken('auth-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/user/list');

        $response->assertStatus(403);
    });
});
