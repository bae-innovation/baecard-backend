<?php

use App\Models\CardCode;
use App\Models\User;
use Database\Seeders\RbacSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RbacSeeder::class);

    $this->customer = User::factory()->withCustomerProfile([
        'first_name' => 'Jane',
        'last_name' => 'Doe',
        'personal_email' => 'jane@example.com',
        'bio' => 'Creative designer.',
        'company' => 'Bae Studio',
        'designation' => 'Designer',
        'social_links' => [
            ['platform' => 'instagram', 'url' => 'https://instagram.com/janedoe'],
        ],
    ])->create([
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
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

it('redirects legacy profile content urls', function () {
    $this->actingAs($this->customer)
        ->get('/profile/social')
        ->assertRedirect('/profile/content');

    $this->actingAs($this->customer)
        ->get('/profile/services')
        ->assertRedirect('/profile/content');

    $this->actingAs($this->customer)
        ->get('/profile/bio')
        ->assertRedirect('/profile/content');
});

it('allows customers to view and update unified profile content', function () {
    $this->actingAs($this->customer)
        ->get('/profile/content')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Profile/Content')
            ->has('profile')
            ->where('profile.first_name', 'Jane')
            ->where('profile.last_name', 'Doe'));

    $this->actingAs($this->customer)
        ->put('/profile/content', [
            'first_name' => 'Updated',
            'last_name' => 'Name',
            'personal_email' => 'updated@example.com',
            'personal_phone_code' => '+880',
            'personal_phone' => '1712345678',
            'personal_address' => 'Dhaka, Bangladesh',
            'bio' => 'Updated bio text.',
            'company' => 'New Company',
            'designation' => 'Lead Designer',
            'work_email' => 'work@example.com',
            'work_phone_code' => '+880',
            'work_phone' => '1812345678',
            'work_address' => 'Gulshan, Dhaka',
            'social_links' => json_encode([
                ['platform' => 'facebook', 'url' => 'https://facebook.com/updated'],
            ]),
        ])
        ->assertRedirect();

    $this->customer->refresh();

    expect($this->customer->name)->toBe('Updated Name')
        ->and($this->customer->profile?->first_name)->toBe('Updated')
        ->and($this->customer->profile?->last_name)->toBe('Name')
        ->and($this->customer->profile?->bio)->toBe('Updated bio text.')
        ->and($this->customer->profile?->designation)->toBe('Lead Designer')
        ->and($this->customer->profile?->social_links)->toBe([
            ['platform' => 'facebook', 'url' => 'https://facebook.com/updated'],
        ]);
});

it('allows customers to upload profile and cover images', function () {
    $profileImage = \Illuminate\Http\UploadedFile::fake()->image('avatar.jpg', 400, 400);
    $coverImage = \Illuminate\Http\UploadedFile::fake()->image('cover.jpg', 1200, 400);

    $this->actingAs($this->customer)
        ->post('/profile/content', [
            '_method' => 'put',
            'first_name' => 'Jane',
            'last_name' => 'Doe',
            'profile_image' => $profileImage,
            'cover_image' => $coverImage,
            'social_links' => json_encode([]),
        ])
        ->assertRedirect();

    $profile = $this->customer->fresh()->profile;

    expect($profile?->profile_image)->not->toBeNull()
        ->and($profile?->cover_image)->not->toBeNull()
        ->and(file_exists(public_path($profile->profile_image)))->toBeTrue()
        ->and(file_exists(public_path($profile->cover_image)))->toBeTrue();
});

it('allows customers to browse and activate templates', function () {
    $this->customer->profile?->update([
        'company' => 'Bae Studio',
        'designation' => 'Lead Designer',
        'work_email' => 'work@example.com',
        'work_phone_code' => '+880',
        'work_phone' => '1812345678',
        'work_address' => 'Gulshan, Dhaka',
    ]);

    $this->actingAs($this->customer)
        ->get('/profile/templates')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Profile/Template')
            ->where('active_template', 1)
            ->where('user.company', 'Bae Studio')
            ->where('user.designation', 'Lead Designer')
            ->where('user.work_email', 'work@example.com')
            ->where('user.work_phone', '+880 1812345678')
            ->where('user.work_address', 'Gulshan, Dhaka')
            ->has('social_links')
            ->missing('services'));

    $this->actingAs($this->customer)
        ->post('/profile/templates/2/activate')
        ->assertRedirect();

    expect($this->customer->fresh()->profile?->active_template)->toBe(2);
});

it('blocks staff from profile management routes', function () {
    $admin = User::factory()->create(['email_verified_at' => now()]);
    $admin->assignRole('Admin');

    $this->actingAs($admin)->get('/profile')->assertForbidden();
    $this->actingAs($admin)->get('/profile/content')->assertForbidden();
    $this->actingAs($admin)->get('/profile/templates')->assertForbidden();
});

it('allows customers to view their profile home', function () {
    $this->actingAs($this->customer)
        ->get('/profile')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Owner/Home')
            ->has('card')
            ->has('user')
            ->has('social_links'));
});

it('renders public profile preview without services', function () {
    $response = $this->get('/ABC123');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Profile/Show')
        ->has('social_links')
        ->missing('services')
        ->where('user.designation', 'Designer'));
});
