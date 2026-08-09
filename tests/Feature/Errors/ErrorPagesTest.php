<?php

use App\Models\User;
use Database\Seeders\RbacSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RbacSeeder::class);

    $this->customer = User::factory()->create([
        'email' => 'customer@example.com',
        'email_verified_at' => now(),
    ]);
    $this->customer->assignRole('User');
});

it('renders the modern not found page for unknown routes', function () {
    $this->actingAs($this->customer)
        ->get('/this-route-does-not-exist')
        ->assertNotFound()
        ->assertInertia(fn ($page) => $page->component('Errors/NotFound'));
});

it('renders the modern forbidden page when access is denied', function () {
    $this->actingAs($this->customer)
        ->get('/dashboard')
        ->assertForbidden()
        ->assertInertia(fn ($page) => $page->component('Errors/Forbidden'));
});

it('renders the forbidden page for protected staff routes', function () {
    $this->actingAs($this->customer)
        ->get('/access-control/users')
        ->assertForbidden()
        ->assertInertia(fn ($page) => $page->component('Errors/Forbidden'));
});

it('returns json for api forbidden responses', function () {
    $this->actingAs($this->customer)
        ->getJson('/dashboard')
        ->assertForbidden()
        ->assertJson([
            'success' => false,
            'message' => 'Forbidden',
        ]);
});

it('returns json for api not found responses', function () {
    $this->getJson('/api/this-route-does-not-exist')
        ->assertNotFound()
        ->assertJson([
            'success' => false,
            'message' => 'Not found',
        ]);
});
