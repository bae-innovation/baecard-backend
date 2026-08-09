<?php

use App\Models\Contact;
use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Database\Seeders\RbacSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RbacSeeder::class);

    $this->admin = User::factory()->create([
        'email' => 'admin@example.com',
        'email_verified_at' => now(),
    ]);
    $this->admin->assignRole('Admin');

    $this->customer = User::factory()->create([
        'email' => 'customer@example.com',
        'email_verified_at' => now(),
    ]);
    $this->customer->assignRole('User');
});

it('allows admins to view the dashboard with analytics', function () {
    $product = Product::create([
        'name' => 'Test Card',
        'slug' => 'test-card',
        'price' => 100,
        'is_active' => true,
    ]);
    $customer = User::factory()->create();
    $customer->assignRole('User');

    Order::create([
        'order_number' => 'ORD-1001',
        'customer_id' => $customer->id,
        'product_id' => $product->id,
        'product_name' => $product->name,
        'unit_price' => 100,
        'quantity' => 2,
        'status' => 'pending',
        'payment_status' => 'partially_paid',
        'subtotal' => 200,
        'total' => 200,
        'paid_amount' => 50,
        'due_amount' => 150,
        'created_by' => $this->admin->id,
    ]);

    Review::create([
        'product_id' => $product->id,
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'rating' => 5,
        'title' => 'Great',
        'body' => 'Loved it',
        'is_visible' => false,
    ]);

    Contact::create([
        'name' => 'Visitor',
        'email' => 'visitor@example.com',
        'subject' => 'Hello',
        'message' => 'Need help',
        'is_read' => false,
    ]);

    $response = $this->actingAs($this->admin)->get('/dashboard');

    $response
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Dashboard/Index')
            ->has('stats.orders', fn ($orders) => $orders
                ->where('total', 1)
                ->where('pending', 1)
                ->where('revenue', 50)
                ->where('total_sales', 200)
                ->where('due', 150)
            )
            ->has('stats.reviews', fn ($reviews) => $reviews
                ->where('total', 1)
                ->where('average_rating', 5)
                ->where('pending_visibility', 1)
            )
            ->has('stats.contacts', fn ($contacts) => $contacts
                ->where('total', 1)
                ->where('unread', 1)
            )
            ->has('stats.recent_orders', 1)
        );
});

it('blocks customers from viewing the dashboard', function () {
    $this->actingAs($this->customer)
        ->get('/dashboard')
        ->assertForbidden();
});

it('allows dashboard access through the dashboard wildcard permission', function () {
    $role = \App\Models\Role::query()->create([
        'name' => 'DashboardOnly',
        'guard_name' => 'sanctum',
        'is_protected' => false,
    ]);
    $role->syncPermissions(['dashboard.*']);

    $user = User::factory()->create(['email_verified_at' => now()]);
    $user->assignRole($role);

    $this->actingAs($user)
        ->get('/dashboard')
        ->assertOk();
});

it('redirects customers to their profile template after login', function () {
    $this->customer->update(['active_template' => 2]);

    $this->post('/login', [
        'email' => $this->customer->email,
        'password' => 'password',
    ])->assertRedirect('/profile/templates/2');
});

it('redirects customers to their active template even when extra permissions exist', function () {
    $this->customer->update(['active_template' => 3]);
    $this->customer->givePermissionTo('dashboard.analytics.view');

    $this->post('/login', [
        'email' => $this->customer->email,
        'password' => 'password',
    ])->assertRedirect('/profile/templates/3');
});

it('redirects admins to the dashboard after login', function () {
    $this->post('/login', [
        'email' => $this->admin->email,
        'password' => 'password',
    ])->assertRedirect('/dashboard');
});
