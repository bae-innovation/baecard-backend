<?php

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RoleSeeder::class);
});

it('creates a public order from checkout api', function () {
    $product = Product::query()->create([
        'name' => 'NFC Card',
        'slug' => 'nfc-card',
        'price' => 500,
        'is_active' => true,
        'is_featured' => false,
    ]);

    $response = $this->postJson('/api/order/create', [
        'name' => 'Rahim Uddin',
        'phone' => '01712345678',
        'product_id' => $product->id,
        'quantity' => 2,
        'notes' => 'Need delivery in Dhaka',
    ]);

    $response->assertCreated()
        ->assertJsonPath('success', true)
        ->assertJsonStructure([
            'data' => ['id', 'order_number', 'product_name', 'quantity', 'total'],
        ]);

    $this->assertDatabaseHas('orders', [
        'product_id' => $product->id,
        'product_name' => 'NFC Card',
        'quantity' => 2,
        'status' => 'pending',
        'payment_status' => 'pending',
    ]);

    $customer = User::query()->where('phone', '01712345678')->first();
    expect($customer)->not->toBeNull();
    expect($customer->hasRole('User'))->toBeTrue();

    $order = Order::query()->first();
    expect($order->customer_id)->toBe($customer->id);
    expect((float) $order->total)->toBe(1000.0);
});

it('validates public order phone number', function () {
    $product = Product::query()->create([
        'name' => 'NFC Card',
        'slug' => 'nfc-card',
        'price' => 500,
        'is_active' => true,
        'is_featured' => false,
    ]);

    $response = $this->postJson('/api/order/create', [
        'name' => 'Rahim Uddin',
        'phone' => '123',
        'product_id' => $product->id,
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['phone']);
});

it('renders checkout and thank you pages', function () {
    $product = Product::query()->create([
        'name' => 'NFC Card',
        'slug' => 'nfc-card',
        'price' => 500,
        'is_active' => true,
        'is_featured' => false,
    ]);

    $this->get('/products/nfc-card/order')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Frontend/Checkout', false)
            ->where('product.id', $product->id)
        );

    $customer = User::factory()->create([
        'email_verified_at' => now(),
    ]);
    $customer->assignRole('User');

    $order = Order::query()->create([
        'order_number' => 'ORD-20260704-ABC123',
        'customer_id' => $customer->id,
        'product_id' => $product->id,
        'product_name' => $product->name,
        'unit_price' => 500,
        'quantity' => 1,
        'status' => 'pending',
        'payment_status' => 'pending',
        'subtotal' => 500,
        'total' => 500,
        'paid_amount' => 0,
        'due_amount' => 500,
    ]);

    $this->get('/order/thank-you/'.$order->order_number)
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Frontend/OrderThankYou', false)
            ->where('order.order_number', $order->order_number)
        );
});
