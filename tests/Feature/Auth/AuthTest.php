<?php

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RoleSeeder::class);
});

describe('Auth - Register', function () {
    it('can register a new user', function () {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'phone' => '1234567890',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'user' => [
                        'id', 'name', 'email', 'phone', 'roles',
                    ],
                    'token',
                ],
            ])
            ->assertJson([
                'success' => true,
                'message' => 'Registration successful. Please verify your email.',
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
        ]);
    });

    it('fails to register with invalid data', function () {
        $response = $this->postJson('/api/auth/register', [
            'name' => '',
            'email' => 'invalid-email',
            'password' => 'short',
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
            ]);
    });

    it('fails to register with duplicate email', function () {
        User::factory()->create(['email' => 'test@example.com']);

        $response = $this->postJson('/api/auth/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
            ]);
    });
});

describe('Auth - Login', function () {
    it('can login with valid credentials', function () {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
        ]);
        $user->assignRole('User');

        $response = $this->postJson('/api/auth/login', [
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'user',
                    'token',
                ],
            ])
            ->assertJson([
                'success' => true,
                'message' => 'Login successful.',
            ]);
    });

    it('can login when json body is sent without content type header', function () {
        $user = User::factory()->create([
            'email' => 'rawjson@example.com',
            'password' => bcrypt('password123'),
        ]);
        $user->assignRole('User');

        $response = $this->call(
            'POST',
            '/api/auth/login',
            [],
            [],
            [],
            ['CONTENT_TYPE' => 'text/plain'],
            json_encode([
                'email' => 'rawjson@example.com',
                'password' => 'password123',
            ])
        );

        expect($response->getStatusCode())->toBe(200);
    });

    it('fails to login with invalid credentials', function () {
        $response = $this->postJson('/api/auth/login', [
            'email' => 'test@example.com',
            'password' => 'wrong-password',
        ]);

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
                'message' => 'Invalid email or password.',
            ]);
    });

    it('fails to login with invalid email format', function () {
        $response = $this->postJson('/api/auth/login', [
            'email' => 'not-an-email',
            'password' => 'password123',
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
            ]);
    });
});

describe('Auth - Authenticated Routes', function () {
    it('can logout', function () {
        $user = User::factory()->create();
        $user->assignRole('User');
        $token = $user->createToken('auth-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/auth/logout');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Logged out successfully.',
            ]);
    });

    it('can get authenticated user profile', function () {
        $user = User::factory()->create();
        $user->assignRole('User');
        $token = $user->createToken('auth-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/auth/me');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'id',
                    'name',
                    'email',
                    'roles',
                ],
            ])
            ->assertJson([
                'success' => true,
                'message' => 'User retrieved successfully.',
            ]);
    });

    it('fails to access authenticated routes without token', function () {
        $response = $this->postJson('/api/auth/logout');

        $response->assertStatus(401);
    });
});