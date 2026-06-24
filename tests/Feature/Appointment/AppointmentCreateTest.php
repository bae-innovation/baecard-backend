<?php

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RoleSeeder::class);

    $this->customer = User::factory()->create([
        'email_verified_at' => now(),
    ]);
    $this->customer->assignRole('User');
});

it('creates an appointment when customer_id is submitted as an empty string', function () {
    $response = $this->actingAs($this->customer)->post('/appointments', [
        'customer_id' => '',
        'title' => 'Customer booking',
        'description' => '',
        'appointment_date' => now()->addDay()->format('Y-m-d\TH:i'),
        'duration_minutes' => 60,
        'status' => 'pending',
        'location' => '',
        'notes' => '',
    ]);

    $response->assertRedirect(route('appointments.index'));

    $this->assertDatabaseHas('appointments', [
        'customer_id' => $this->customer->id,
        'title' => 'Customer booking',
    ]);
});

it('creates an appointment via inertia request as customer', function () {
    $response = $this->actingAs($this->customer)
        ->withHeaders([
            'X-Inertia' => 'true',
            'X-Inertia-Version' => '1',
            'X-Requested-With' => 'XMLHttpRequest',
            'Accept' => 'text/html, application/xhtml+xml',
        ])
        ->post('/appointments', [
            'customer_id' => '',
            'title' => 'Customer booking',
            'description' => '',
            'appointment_date' => now()->addDay()->format('Y-m-d\TH:i'),
            'duration_minutes' => '60',
            'status' => 'pending',
            'location' => '',
            'notes' => '',
        ]);

    $response->assertRedirect(route('appointments.index'));

    $this->assertDatabaseHas('appointments', [
        'customer_id' => $this->customer->id,
        'title' => 'Customer booking',
    ]);
});

it('creates an appointment when customer_id is submitted as zero', function () {
    $response = $this->actingAs($this->customer)
        ->withHeaders([
            'X-Inertia' => 'true',
            'X-Requested-With' => 'XMLHttpRequest',
        ])
        ->post('/appointments', [
            'customer_id' => 0,
            'title' => 'Customer booking',
            'description' => '',
            'appointment_date' => now()->addDay()->format('Y-m-d\TH:i'),
            'duration_minutes' => 60,
            'status' => 'pending',
            'location' => '',
            'notes' => '',
        ]);

    $response->assertRedirect(route('appointments.index'));

    $this->assertDatabaseHas('appointments', [
        'customer_id' => $this->customer->id,
        'title' => 'Customer booking',
    ]);
});
