<?php

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RoleSeeder::class);

    $this->admin = User::factory()->create([
        'email_verified_at' => now(),
    ]);
    $this->admin->assignRole('SuperAdmin');
});

it('stores a review from the admin panel', function () {
    $response = $this->actingAs($this->admin)->post('/reviews', [
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'rating' => 5,
        'title' => 'Great',
        'body' => 'Loved it',
    ]);

    $response->assertRedirect(route('reviews.index'));
    $this->assertDatabaseHas('reviews', [
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'rating' => 5,
    ]);
});

it('stores a review via inertia request', function () {
    $response = $this->actingAs($this->admin)
        ->withHeaders([
            'X-Inertia' => 'true',
            'X-Requested-With' => 'XMLHttpRequest',
        ])
        ->post('/reviews', [
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'rating' => '5',
            'title' => '',
            'body' => 'Loved it',
        ]);

    $response->assertRedirect(route('reviews.index'));
});

it('stores a review with an optional reviewer image', function () {
    $file = \Illuminate\Http\UploadedFile::fake()->image('reviewer.jpg', 200, 200);

    $response = $this->actingAs($this->admin)->post('/reviews', [
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'rating' => 5,
        'body' => 'Loved it',
        'image' => $file,
    ]);

    $response->assertRedirect(route('reviews.index'));

    $review = \App\Models\Review::query()->where('email', 'jane@example.com')->first();
    expect($review)->not->toBeNull();
    expect($review->image)->not->toBeNull();
    expect($review->image_url)->not->toBeNull();
});

it('uses the logged-in customer name when a user submits a review', function () {
    $customer = User::factory()->create([
        'name' => 'Real Customer',
        'email' => 'real@example.com',
        'email_verified_at' => now(),
    ]);
    $customer->assignRole('User');

    $response = $this->actingAs($customer)->post('/reviews', [
        'name' => 'Fake Name',
        'email' => 'fake@example.com',
        'rating' => 5,
        'body' => 'Great service',
    ]);

    $response->assertRedirect(route('reviews.index'));

    $this->assertDatabaseHas('reviews', [
        'user_id' => $customer->id,
        'name' => 'Real Customer',
        'email' => 'real@example.com',
        'body' => 'Great service',
    ]);
});
