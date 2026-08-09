<?php

use App\Models\Appointment;
use App\Models\Contact;
use App\Models\Review;
use App\Models\User;
use App\Support\PermissionResolver;
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

    $this->admin = User::factory()->create([
        'email' => 'admin@example.com',
        'email_verified_at' => now(),
    ]);
    $this->admin->assignRole('Admin');
});

it('derives customer portal abilities for the User role', function () {
    $permissions = PermissionResolver::permissionsForUser($this->customer);
    $names = collect($permissions)->pluck('name')->all();

    expect($names)
        ->toContain('product.product.view')
        ->toContain('appointment.appointment.view_own')
        ->toContain('appointment.appointment.create_own')
        ->toContain('appointment.appointment.update_own')
        ->toContain('appointment.appointment.delete_own')
        ->toContain('contact.contact.view_own')
        ->toContain('contact.contact.create_own')
        ->toContain('review.review.view_own')
        ->toContain('review.review.create_own')
        ->toContain('profile.template.manage')
        ->not->toContain('contact.contact.create')
        ->not->toContain('review.review.create')
        ->not->toContain('appointment.appointment.view')
        ->not->toContain('rbac.user.view')
        ->not->toContain('order.website_order.view')
        ->not->toContain('dashboard.analytics.view')
        ->not->toContain('card.card.view')
        ->not->toContain('settings.general.manage');
});

it('allows customers to view admin products but not manage them', function () {
    $this->actingAs($this->customer)
        ->get('/admin/products')
        ->assertOk();

    $this->actingAs($this->customer)
        ->post('/admin/products', [
            'name' => 'Blocked Product',
            'price' => 10,
        ])
        ->assertForbidden();
});

it('serves the public product catalog without authentication', function () {
    $this->get('/products')
        ->assertOk();
});

it('blocks customers from staff-only modules', function () {
    $this->actingAs($this->customer)->get('/dashboard')->assertForbidden();
    $this->actingAs($this->customer)->get('/access-control/users')->assertForbidden();
    $this->actingAs($this->customer)->get('/customers')->assertForbidden();
    $this->actingAs($this->customer)->get('/vendors')->assertForbidden();
    $this->actingAs($this->customer)->get('/orders')->assertForbidden();
    $this->actingAs($this->customer)->get('/cards')->assertForbidden();
    $this->actingAs($this->customer)->get('/settings/general')->assertForbidden();
});

it('scopes appointments to the logged-in customer and allows own edits', function () {
    Appointment::create([
        'customer_id' => $this->customer->id,
        'created_by' => $this->customer->id,
        'title' => 'Mine',
        'appointment_date' => now()->addDay(),
        'duration_minutes' => 30,
        'status' => 'pending',
    ]);

    Appointment::create([
        'customer_id' => $this->customer->id,
        'created_by' => $this->admin->id,
        'title' => 'Assigned by admin',
        'appointment_date' => now()->addDays(2),
        'duration_minutes' => 30,
        'status' => 'pending',
    ]);

    $other = User::factory()->create(['email_verified_at' => now()]);
    $other->assignRole('User');

    Appointment::create([
        'customer_id' => $other->id,
        'created_by' => $other->id,
        'title' => 'Theirs',
        'appointment_date' => now()->addDays(2),
        'duration_minutes' => 30,
        'status' => 'pending',
    ]);

    $this->actingAs($this->customer)
        ->get('/appointments')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Appointments/Index')
            ->has('appointments.data', 1)
            ->where('appointments.data.0.title', 'Mine'));

    $appointment = Appointment::where('created_by', $this->customer->id)->first();

    $this->actingAs($this->customer)
        ->post('/appointments', [
            'title' => 'New booking',
            'appointment_date' => now()->addDays(3)->toDateTimeString(),
            'duration_minutes' => 45,
            'status' => 'pending',
        ])
        ->assertRedirect(route('appointments.index'));

    $this->actingAs($this->customer)
        ->put("/appointments/{$appointment->id}", [
            'title' => 'Updated',
        ])
        ->assertRedirect(route('appointments.index'));

    $otherAppointment = Appointment::where('created_by', $other->id)->first();

    $this->actingAs($this->customer)
        ->put("/appointments/{$otherAppointment->id}", [
            'title' => 'Hacked',
        ])
        ->assertRedirect(route('appointments.index'));

    expect($otherAppointment->fresh()->title)->toBe('Theirs');
});

it('scopes contacts to the logged-in customer and allows create only', function () {
    Contact::create([
        'user_id' => $this->customer->id,
        'created_by' => $this->customer->id,
        'name' => $this->customer->name,
        'email' => $this->customer->email,
        'message' => 'My message',
    ]);

    Contact::create([
        'user_id' => $this->customer->id,
        'created_by' => $this->admin->id,
        'name' => $this->customer->name,
        'email' => $this->customer->email,
        'message' => 'Assigned by admin',
    ]);

    Contact::create([
        'user_id' => $this->admin->id,
        'created_by' => $this->admin->id,
        'name' => 'Admin',
        'email' => $this->admin->email,
        'message' => 'Admin message',
    ]);

    $this->actingAs($this->customer)
        ->get('/contacts')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Contacts/Index')
            ->has('contacts.data', 1)
            ->where('contacts.data.0.message', 'My message'));

    $this->actingAs($this->customer)
        ->post('/contacts', [
            'name' => $this->customer->name,
            'phone' => '01700000001',
            'email' => $this->customer->email,
            'message' => 'Another message',
        ])
        ->assertRedirect(route('contacts.index'));

    expect(Contact::where('created_by', $this->customer->id)->count())->toBe(2);
});

it('scopes reviews to the logged-in customer and blocks updates', function () {
    Review::create([
        'user_id' => $this->customer->id,
        'created_by' => $this->customer->id,
        'name' => $this->customer->name,
        'email' => $this->customer->email,
        'rating' => 5,
        'body' => 'Great',
        'is_visible' => true,
    ]);

    Review::create([
        'user_id' => $this->customer->id,
        'created_by' => $this->admin->id,
        'name' => $this->customer->name,
        'email' => $this->customer->email,
        'rating' => 5,
        'body' => 'Assigned by admin',
        'is_visible' => true,
    ]);

    Review::create([
        'user_id' => $this->admin->id,
        'created_by' => $this->admin->id,
        'name' => 'Admin',
        'email' => $this->admin->email,
        'rating' => 4,
        'body' => 'Staff review',
        'is_visible' => true,
    ]);

    $this->actingAs($this->customer)
        ->get('/reviews')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Reviews/Index')
            ->has('reviews.data', 1)
            ->where('reviews.data.0.body', 'Great'));

    $this->actingAs($this->customer)
        ->post('/reviews', [
            'name' => $this->customer->name,
            'email' => $this->customer->email,
            'rating' => 4,
            'body' => 'Another review',
        ])
        ->assertRedirect(route('reviews.index'));

    $review = Review::where('created_by', $this->customer->id)->first();

    $this->actingAs($this->customer)
        ->patch("/reviews/{$review->id}", [
            'body' => 'Changed',
        ])
        ->assertForbidden();
});

it('allows customers to update their own account', function () {
    $this->actingAs($this->customer)
        ->get('/user/account')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('User/Account'));

    $this->actingAs($this->customer)
        ->put('/user/account', [
            'name' => 'Updated Customer',
            'phone' => '01700000000',
        ])
        ->assertRedirect();

    expect($this->customer->fresh()->name)->toBe('Updated Customer');
});

it('blocks customers from admin settings', function () {
    $this->actingAs($this->customer)
        ->get('/settings/general')
        ->assertForbidden();
});

it('allows customers to customize appearance settings', function () {
    $this->actingAs($this->customer)
        ->get('/settings/appearance')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Settings/Index')
            ->where('group', 'appearance'));
});

it('allows unverified customers to access my account without email verification', function () {
    $unverified = User::factory()->create([
        'email' => 'unverified@example.com',
        'email_verified_at' => null,
    ]);
    $unverified->assignRole('User');

    $this->actingAs($unverified)
        ->get('/user/account')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('User/Account'));
});
