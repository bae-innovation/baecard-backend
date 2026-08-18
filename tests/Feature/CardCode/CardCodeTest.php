<?php

use App\Models\CardCode;
use App\Models\Order;
use App\Models\User;
use Database\Seeders\RbacSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\URL;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RbacSeeder::class);

    $this->admin = User::factory()->create([
        'email_verified_at' => now(),
    ]);
    $this->admin->assignRole('SuperAdmin');
});

function createCardOrder(User $customer, array $overrides = []): Order
{
    return Order::query()->create(array_merge([
        'order_number' => 'ORD-'.uniqid(),
        'source' => 'custom',
        'customer_id' => $customer->id,
        'product_name' => 'NFC Card',
        'unit_price' => 500,
        'quantity' => 1,
        'status' => 'pending',
        'payment_status' => 'pending',
        'subtotal' => 500,
        'total' => 500,
        'paid_amount' => 0,
        'due_amount' => 500,
    ], $overrides));
}

it('creates a card code from the admin panel', function () {
    $customer = User::factory()->create(['email_verified_at' => now()]);
    $customer->assignRole('User');
    $order = createCardOrder($customer);

    $response = $this->actingAs($this->admin)->post('/cards', [
        'code' => 'QDF2QL',
        'order_id' => $order->id,
    ]);

    $response->assertRedirect(route('cards.index'));
    $this->assertDatabaseHas('card_codes', [
        'code' => 'QDF2QL',
        'order_id' => $order->id,
        'user_id' => $customer->id,
        'status' => CardCode::STATUS_PENDING,
    ]);
    expect($order->fresh()->status)->toBe('processing');
});

it('moves a pending order to processing when a card is created', function () {
    $customer = User::factory()->create(['email_verified_at' => now()]);
    $customer->assignRole('User');
    $order = createCardOrder($customer, ['status' => 'pending']);

    $this->actingAs($this->admin)->post('/cards', [
        'code' => 'PROC01',
        'order_id' => $order->id,
    ])->assertRedirect(route('cards.index'));

    expect($order->fresh()->status)->toBe('processing');
});

it('does not change order status when it is no longer pending', function () {
    $customer = User::factory()->create(['email_verified_at' => now()]);
    $customer->assignRole('User');
    $order = createCardOrder($customer, ['status' => 'confirmed']);

    $this->actingAs($this->admin)->post('/cards', [
        'code' => 'CONF01',
        'order_id' => $order->id,
    ])->assertRedirect(route('cards.index'));

    expect($order->fresh()->status)->toBe('confirmed');
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

it('shows the assigned user email as read-only context on login for pre-linked cards', function () {
    $customer = User::factory()->create([
        'email' => 'cardowner@example.com',
        'email_verified_at' => now(),
    ]);
    $customer->assignRole('User');

    CardCode::create([
        'code' => 'LOGIN2',
        'name' => 'Linked Card',
        'status' => CardCode::STATUS_PENDING,
        'user_id' => $customer->id,
    ]);

    $response = $this->get(route('login', ['redirect' => '/LOGIN2']));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Auth/Login')
            ->where('cardCode.code', 'LOGIN2')
            ->where('cardCode.email', 'cardowner@example.com'));
});

it('rejects login with a different email for a pre-linked card', function () {
    $customer = User::factory()->create([
        'email' => 'cardowner@example.com',
        'email_verified_at' => now(),
    ]);
    $customer->assignRole('User');

    CardCode::create([
        'code' => 'LOGIN3',
        'name' => 'Linked Card',
        'status' => CardCode::STATUS_PENDING,
        'user_id' => $customer->id,
    ]);

    $response = $this->post('/login', [
        'email' => 'someoneelse@example.com',
        'password' => 'password',
        'redirect' => '/LOGIN3',
    ]);

    $response->assertSessionHasErrors('email');
});

it('activates a pre-linked pending card after login', function () {
    $customer = User::factory()->create(['email_verified_at' => now()]);
    $customer->assignRole('User');
    $order = createCardOrder($customer, ['status' => 'processing']);

    CardCode::create([
        'code' => 'ACTIV1',
        'name' => 'Activate Me',
        'status' => CardCode::STATUS_PENDING,
        'order_id' => $order->id,
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
    expect($order->fresh()->status)->toBe('confirmed');
});

it('moves a processing order to confirmed when the linked card is verified', function () {
    $customer = User::factory()->create(['email_verified_at' => now()]);
    $customer->assignRole('User');
    $order = createCardOrder($customer, ['status' => 'processing']);

    CardCode::create([
        'code' => 'VERIF1',
        'order_id' => $order->id,
        'user_id' => $customer->id,
        'status' => CardCode::STATUS_PENDING,
    ]);

    $this->actingAs($customer)->get('/VERIF1')->assertOk();

    expect($order->fresh()->status)->toBe('confirmed');
});

it('creates a card code linked to the order customer', function () {
    $customer = User::factory()->create(['email_verified_at' => now()]);
    $customer->assignRole('User');
    $order = createCardOrder($customer);

    $response = $this->actingAs($this->admin)->post('/cards', [
        'code' => 'WITHUSR',
        'order_id' => $order->id,
    ]);

    $response->assertRedirect(route('cards.index'));
    $this->assertDatabaseHas('card_codes', [
        'code' => 'WITHUSR',
        'order_id' => $order->id,
        'user_id' => $customer->id,
        'status' => CardCode::STATUS_PENDING,
    ]);
});

it('requires an order when creating a card', function () {
    $response = $this->actingAs($this->admin)->post('/cards', [
        'code' => 'NOORD1',
    ]);

    $response->assertSessionHasErrors('order_id');
});

it('rejects creating a second card for the same order', function () {
    $customer = User::factory()->create(['email_verified_at' => now()]);
    $customer->assignRole('User');
    $order = createCardOrder($customer);

    CardCode::create([
        'code' => 'FIRST1',
        'order_id' => $order->id,
        'user_id' => $customer->id,
        'status' => CardCode::STATUS_PENDING,
    ]);

    $response = $this->actingAs($this->admin)->from('/cards')->post('/cards', [
        'code' => 'SECOND',
        'order_id' => $order->id,
    ]);

    $response->assertRedirect('/cards');
});

it('allows the same customer to hold cards on different orders', function () {
    $customer = User::factory()->create(['email_verified_at' => now()]);
    $customer->assignRole('User');
    $firstOrder = createCardOrder($customer);
    $secondOrder = createCardOrder($customer, ['order_number' => 'ORD-SECOND']);

    $this->actingAs($this->admin)->post('/cards', [
        'code' => 'CARD01',
        'order_id' => $firstOrder->id,
    ])->assertRedirect(route('cards.index'));

    $this->actingAs($this->admin)->post('/cards', [
        'code' => 'CARD02',
        'order_id' => $secondOrder->id,
    ])->assertRedirect(route('cards.index'));

    expect(CardCode::query()->where('user_id', $customer->id)->count())->toBe(2);
});

it('lists available orders without cards for a customer', function () {
    $customer = User::factory()->create(['email_verified_at' => now()]);
    $customer->assignRole('User');
    $available = createCardOrder($customer);
    $taken = createCardOrder($customer, ['order_number' => 'ORD-TAKEN']);

    CardCode::create([
        'code' => 'TAKEN1',
        'order_id' => $taken->id,
        'user_id' => $customer->id,
        'status' => CardCode::STATUS_PENDING,
    ]);

    $response = $this->actingAs($this->admin)->getJson(
        '/cards/available-orders?customer_id='.$customer->id,
    );

    $response->assertOk()
        ->assertJsonPath('success', true)
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.id', $available->id);
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

it('rejects assigning a user to an order-linked card', function () {
    $customer = User::factory()->create(['email_verified_at' => now()]);
    $customer->assignRole('User');
    $order = createCardOrder($customer);

    $cardCode = CardCode::create([
        'code' => 'ORDLNK',
        'order_id' => $order->id,
        'user_id' => $customer->id,
        'status' => CardCode::STATUS_PENDING,
    ]);

    $other = User::factory()->create(['email_verified_at' => now()]);
    $other->assignRole('User');

    $response = $this->actingAs($this->admin)->from('/cards')->patch(
        '/cards/'.$cardCode->id.'/assign-user',
        ['user_id' => $other->id],
    );

    $response->assertRedirect('/cards');
    $this->assertDatabaseHas('card_codes', [
        'id' => $cardCode->id,
        'user_id' => $customer->id,
    ]);
});

it('assigns a customer to a legacy pending card without an order', function () {
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
