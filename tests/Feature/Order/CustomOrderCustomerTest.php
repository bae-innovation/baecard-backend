<?php

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Database\Seeders\RbacSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RbacSeeder::class);

    $this->admin = User::factory()->create([
        'email_verified_at' => now(),
    ]);
    $this->admin->assignRole('SuperAdmin');
});

function createCustomOrderFixture(User $customer, array $overrides = []): Order
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

it('creates a custom order for an existing customer', function () {
    $customer = User::factory()->create(['email_verified_at' => now()]);
    $customer->assignRole('User');

    $response = $this->actingAs($this->admin)->post('/custom-orders', [
        'customer_id' => $customer->id,
        'product_name' => 'Custom Package',
        'unit_price' => 750,
        'quantity' => 2,
    ]);

    $response->assertRedirect(route('custom-orders.index'));

    $this->assertDatabaseHas('orders', [
        'customer_id' => $customer->id,
        'product_name' => 'Custom Package',
        'quantity' => 2,
        'source' => 'custom',
    ]);
});

it('creates a custom order with an inline new customer', function () {
    $response = $this->actingAs($this->admin)->post('/custom-orders', [
        'new_customer' => [
            'name' => 'Inline Customer',
            'email' => 'inline@example.com',
            'phone' => '01799887766',
        ],
        'product_name' => 'Starter Card',
        'unit_price' => 400,
    ]);

    $response->assertRedirect(route('custom-orders.index'));

    $customer = User::query()->where('email', 'inline@example.com')->first();
    expect($customer)->not->toBeNull();
    expect($customer->hasRole('User'))->toBeTrue();

    $this->assertDatabaseHas('orders', [
        'customer_id' => $customer->id,
        'product_name' => 'Starter Card',
        'source' => 'custom',
    ]);
});

it('rejects custom orders without a customer selection', function () {
    $response = $this->actingAs($this->admin)->post('/custom-orders', [
        'product_name' => 'Orphan Order',
        'unit_price' => 100,
    ]);

    $response->assertSessionHasErrors(['customer_id', 'new_customer']);
});

it('quick creates a customer for inline admin forms', function () {
    $response = $this->actingAs($this->admin)->postJson('/customers/quick-create', [
        'name' => 'Quick Customer',
        'email' => 'quick@example.com',
        'phone' => '01711223344',
    ]);

    $response->assertCreated()
        ->assertJsonPath('data.email', 'quick@example.com');

    $customer = User::query()->where('email', 'quick@example.com')->first();
    expect($customer)->not->toBeNull();
    expect($customer->hasRole('User'))->toBeTrue();
});
