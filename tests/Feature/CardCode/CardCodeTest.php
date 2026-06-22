<?php

use App\Models\CardCode;
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

it('creates a card code from the admin panel', function () {
    $response = $this->actingAs($this->admin)->post('/cards/codes', [
        'code' => 'QDF2QL',
        'name' => 'Rakib101095',
        'phone' => '+8801712345678',
    ]);

    $response->assertRedirect(route('cards.codes.index'));
    $this->assertDatabaseHas('card_codes', [
        'code' => 'QDF2QL',
        'name' => 'Rakib101095',
        'status' => CardCode::STATUS_PENDING,
    ]);
});

it('generates a unique card code', function () {
    $response = $this->actingAs($this->admin)->getJson('/cards/codes/generate');

    $response->assertOk()
        ->assertJsonStructure(['success', 'data' => ['code']]);

    expect($response->json('data.code'))->toHaveLength(6);
});

it('claims a pending card after login and redirects to profile', function () {
    $cardCode = CardCode::create([
        'code' => 'R1PAMS',
        'name' => 'Sheikh Abu Backkar Siddiq',
        'phone' => '+8801712345678',
        'status' => CardCode::STATUS_PENDING,
    ]);

    $user = User::factory()->create([
        'name' => 'Sheikh Abu Backkar Siddiq',
        'email_verified_at' => now(),
    ]);
    $user->assignRole('User');

    $response = $this->actingAs($user)->get('/scan/'.$cardCode->code);

    $response->assertRedirect(route('profile.show', [
        'slug' => 'sheikh-abu-backkar-siddiq',
        'code' => 'R1PAMS',
    ]));

    $this->assertDatabaseHas('card_codes', [
        'id' => $cardCode->id,
        'user_id' => $user->id,
        'status' => CardCode::STATUS_PUBLISHED,
    ]);
});

it('redirects guests scanning a pending card to login', function () {
    $cardCode = CardCode::create([
        'code' => 'ABC123',
        'name' => 'Guest Card',
        'status' => CardCode::STATUS_PENDING,
    ]);

    $response = $this->get('/scan/'.$cardCode->code);

    $response->assertRedirect(route('login', [
        'redirect' => '/scan/'.$cardCode->code,
    ]));
});
