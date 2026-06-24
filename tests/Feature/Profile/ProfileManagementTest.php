<?php

use App\Models\CardCode;
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

    CardCode::create([
        'code' => 'ABC123',
        'name' => $this->customer->name,
        'phone' => $this->customer->phone,
        'status' => CardCode::STATUS_PUBLISHED,
        'user_id' => $this->customer->id,
    ]);
});

it('allows customers to manage profile social links', function () {
    $this->actingAs($this->customer)
        ->get('/profile/social')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('Profile/Social'));

    $this->actingAs($this->customer)
        ->post('/profile/social', [
            'platform' => 'instagram',
            'platform_value' => 'mybrand',
            'url' => '',
            'label' => 'Instagram',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('customer_socials', [
        'customer_id' => $this->customer->id,
        'platform' => 'instagram',
        'platform_value' => 'mybrand',
    ]);
});

it('allows customers to manage profile services and templates', function () {
    $this->actingAs($this->customer)
        ->get('/profile/services')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('Profile/Services'));

    $this->actingAs($this->customer)
        ->post('/profile/services', [
            'name' => 'Web Development',
            'description' => 'Laravel apps',
            'price' => 5000,
            'is_active' => true,
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('user_services', [
        'user_id' => $this->customer->id,
        'name' => 'Web Development',
    ]);

    $this->actingAs($this->customer)
        ->get('/profile/templates/1')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Profile/Template')
            ->where('template_id', 1));

    $this->actingAs($this->customer)
        ->post('/profile/templates/2/activate')
        ->assertRedirect();

    expect($this->customer->fresh()->active_template)->toBe(2);
});

it('blocks staff from profile management routes', function () {
    $admin = User::factory()->create(['email_verified_at' => now()]);
    $admin->assignRole('Admin');

    $this->actingAs($admin)->get('/profile/social')->assertForbidden();
    $this->actingAs($admin)->get('/profile/services')->assertForbidden();
    $this->actingAs($admin)->get('/profile/templates/1')->assertForbidden();
});
