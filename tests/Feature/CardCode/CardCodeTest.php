<?php

use App\Models\CardCode;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\URL;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RoleSeeder::class);

    $this->admin = User::factory()->create([
        'email_verified_at' => now(),
    ]);
    $this->admin->assignRole('SuperAdmin');
});

it('creates a card code from the admin panel', function () {
    $response = $this->actingAs($this->admin)->post('/cards', [
        'code' => 'QDF2QL',
        'name' => 'Rakib101095',
        'phone' => '+8801712345678',
    ]);

    $response->assertRedirect(route('cards.index'));
    $this->assertDatabaseHas('card_codes', [
        'code' => 'QDF2QL',
        'name' => 'Rakib101095',
        'status' => CardCode::STATUS_PENDING,
    ]);
});

it('generates a unique card code', function () {
    $response = $this->actingAs($this->admin)->getJson('/cards/generate');

    $response->assertOk()
        ->assertJsonStructure(['success', 'data' => ['code']]);

    expect($response->json('data.code'))->toHaveLength(6);
});

it('shows a verified card profile at the root code url', function () {
    $user = User::factory()->create([
        'name' => 'Sheikh Abu Backkar Siddiq',
        'email_verified_at' => now(),
    ]);
    $user->assignRole('User');

    CardCode::create([
        'code' => 'R1PAMS',
        'name' => 'Sheikh Abu Backkar Siddiq',
        'phone' => '+8801712345678',
        'status' => CardCode::STATUS_PUBLISHED,
        'user_id' => $user->id,
    ]);

    $response = $this->get('/R1PAMS');

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Profile/Show')
            ->where('card.code', 'R1PAMS')
            ->where('user.email', $user->email));
});

it('redirects guests with unlinked cards to register', function () {
    CardCode::create([
        'code' => 'NEW001',
        'name' => 'Guest Card',
        'status' => CardCode::STATUS_PENDING,
    ]);

    $response = $this->get('/NEW001');

    $response->assertRedirect(route('register', [
        'redirect' => '/NEW001',
    ]));
});

it('redirects guests with pre-linked pending cards to login', function () {
    $customer = User::factory()->create(['email_verified_at' => now()]);
    $customer->assignRole('User');

    CardCode::create([
        'code' => 'LOGIN1',
        'name' => 'Linked Card',
        'status' => CardCode::STATUS_PENDING,
        'user_id' => $customer->id,
    ]);

    $response = $this->get('/LOGIN1');

    $response->assertRedirect(route('login', [
        'redirect' => '/LOGIN1',
    ]));
});

it('activates a pre-linked pending card after login', function () {
    $customer = User::factory()->create(['email_verified_at' => now()]);
    $customer->assignRole('User');

    CardCode::create([
        'code' => 'ACTIV1',
        'name' => 'Activate Me',
        'status' => CardCode::STATUS_PENDING,
        'user_id' => $customer->id,
    ]);

    $response = $this->actingAs($customer)->get('/ACTIV1');

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('Profile/Show'));

    $this->assertDatabaseHas('card_codes', [
        'code' => 'ACTIV1',
        'user_id' => $customer->id,
        'status' => CardCode::STATUS_PUBLISHED,
    ]);
});

it('creates a card code with an optional assigned customer as pending', function () {
    $customer = User::factory()->create(['email_verified_at' => now()]);
    $customer->assignRole('User');

    $response = $this->actingAs($this->admin)->post('/cards', [
        'code' => 'WITHUSR',
        'name' => 'Pre-assigned Card',
        'phone' => '+8801712345678',
        'user_id' => $customer->id,
    ]);

    $response->assertRedirect(route('cards.index'));
    $this->assertDatabaseHas('card_codes', [
        'code' => 'WITHUSR',
        'name' => 'Pre-assigned Card',
        'user_id' => $customer->id,
        'status' => CardCode::STATUS_PENDING,
    ]);
});

it('exposes a public card code lookup api', function () {
    CardCode::create([
        'code' => 'API001',
        'name' => 'API Card',
        'status' => CardCode::STATUS_PENDING,
    ]);

    $response = $this->getJson('/api/card-code/API001');

    $response->assertOk()
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.code', 'API001')
        ->assertJsonPath('data.scan_url', url('/API001'));
});

it('returns not found for unknown public card codes', function () {
    $response = $this->getJson('/api/card-code/MISSING');

    $response->assertNotFound()
        ->assertJsonPath('success', false)
        ->assertJsonPath('message', 'Code does not exist.');
});

it('builds card urls at the root code path', function () {
    config([
        'baecard.public_url' => 'https://baecard.info',
    ]);

    $cardCode = CardCode::create([
        'code' => 'HN8OCO',
        'name' => 'Test Card',
        'status' => CardCode::STATUS_PENDING,
    ]);

    expect($cardCode->scan_url)->toBe('https://baecard.info/HN8OCO');
});

it('searches customers by email for card assignment', function () {
    $customer = User::factory()->create([
        'email' => 'cardcustomer@example.com',
        'phone' => '+8801711111111',
        'email_verified_at' => now(),
    ]);
    $customer->assignRole('User');

    $response = $this->actingAs($this->admin)->getJson(
        '/cards/search-users?email=cardcustomer@example.com',
    );

    $response->assertOk()
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.0.email', 'cardcustomer@example.com');
});

it('searches customers by phone with normalized formats', function () {
    $customer = User::factory()->create([
        'email' => 'phonecustomer@example.com',
        'phone' => '+8801712345678',
        'email_verified_at' => now(),
    ]);
    $customer->assignRole('User');

    $response = $this->actingAs($this->admin)->getJson(
        '/cards/search-users?phone=01712345678',
    );

    $response->assertOk()
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.0.email', 'phonecustomer@example.com');
});

it('returns multiple customers when they share the same phone number', function () {
    $first = User::factory()->create([
        'email' => 'customer-one@example.com',
        'phone' => '01712345678',
        'email_verified_at' => now(),
    ]);
    $first->assignRole('User');

    $second = User::factory()->create([
        'email' => 'customer-two@example.com',
        'phone' => '01712345678',
        'email_verified_at' => now(),
    ]);
    $second->assignRole('User');

    $response = $this->actingAs($this->admin)->getJson(
        '/cards/search-users?phone=01712345678',
    );

    $response->assertOk()
        ->assertJsonPath('success', true)
        ->assertJsonCount(2, 'data');
});

it('rejects assigning a staff account to a card code', function () {
    $cardCode = CardCode::create([
        'code' => 'STAFF1',
        'name' => 'Staff Card',
        'status' => CardCode::STATUS_PENDING,
    ]);

    $staff = User::factory()->create(['email_verified_at' => now()]);
    $staff->assignRole('Admin');

    $response = $this->actingAs($this->admin)->patch(
        '/cards/'.$cardCode->id.'/assign-user',
        ['user_id' => $staff->id],
    );

    $response->assertSessionHasErrors('user_id');
    $this->assertDatabaseHas('card_codes', [
        'id' => $cardCode->id,
        'user_id' => null,
    ]);
});

it('assigns a customer to a pending card code without verifying it', function () {
    $cardCode = CardCode::create([
        'code' => 'ASSIGN1',
        'name' => 'Assign Me',
        'status' => CardCode::STATUS_PENDING,
    ]);

    $customer = User::factory()->create(['email_verified_at' => now()]);
    $customer->assignRole('User');

    $response = $this->actingAs($this->admin)->patch(
        '/cards/'.$cardCode->id.'/assign-user',
        ['user_id' => $customer->id],
    );

    $response->assertRedirect(route('cards.index'));
    $this->assertDatabaseHas('card_codes', [
        'id' => $cardCode->id,
        'user_id' => $customer->id,
        'status' => CardCode::STATUS_PENDING,
    ]);
});

it('links a card to a newly registered user and activates it after email verification', function () {
    CardCode::create([
        'code' => 'REG001',
        'name' => 'Register Card',
        'status' => CardCode::STATUS_PENDING,
    ]);

    $response = $this->post('/register', [
        'email' => 'newcard@example.com',
        'phone' => '+8801712345678',
        'password' => 'password123',
        'redirect' => '/REG001',
    ]);

    $response->assertRedirect(route('verification.notice', [
        'redirect' => '/REG001',
    ]));

    $user = User::where('email', 'newcard@example.com')->first();

    expect($user)->not->toBeNull()
        ->and($user->name)->toBe('Newcard');

    $this->assertDatabaseHas('card_codes', [
        'code' => 'REG001',
        'user_id' => $user->id,
        'status' => CardCode::STATUS_PENDING,
    ]);

    $verificationUrl = URL::temporarySignedRoute(
        'verification.verify.web',
        now()->addHour(),
        [
            'id' => $user->id,
            'hash' => sha1($user->email),
        ],
    );

    $verifyResponse = $this->actingAs($user)->get($verificationUrl);

    $verifyResponse->assertRedirect('/REG001');

    $this->assertDatabaseHas('card_codes', [
        'code' => 'REG001',
        'user_id' => $user->id,
        'status' => CardCode::STATUS_PUBLISHED,
    ]);
});

it('redirects legacy cards codes url to cards index', function () {
    $response = $this->actingAs($this->admin)->get('/cards/codes');

    $response->assertRedirect('/cards');
});

it('renders the consolidated cards admin page', function () {
    $response = $this->actingAs($this->admin)->get('/cards');

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('Cards/Index'));
});
