<?php

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RoleSeeder::class);

    $this->admin = User::factory()->create([
        'email_verified_at' => now(),
    ]);
    $this->admin->assignRole('SuperAdmin');
});

it('creates a product with image via inertia', function () {
    $file = UploadedFile::fake()->image('product.png', 800, 800)->size(500);

    $response = $this->actingAs($this->admin)
        ->withHeaders([
            'X-Inertia' => 'true',
            'X-Requested-With' => 'XMLHttpRequest',
        ])
        ->post('/admin/products', [
            'name' => 'Metal Card',
            'price' => '500',
            'is_active' => '1',
            'is_featured' => '0',
            'image' => $file,
        ]);

    $response->assertRedirect(route('products.index'));
    $this->assertDatabaseHas('products', ['name' => 'Metal Card']);
});

it('rejects unsupported image types', function () {
    $file = UploadedFile::fake()->create('document.pdf', 100, 'application/pdf');

    $response = $this->actingAs($this->admin)
        ->from('/admin/products/create')
        ->post('/admin/products', [
            'name' => 'Metal Card',
            'price' => '500',
            'is_active' => '1',
            'image' => $file,
        ]);

    $response->assertRedirect('/admin/products/create');
    $response->assertSessionHasErrors('image');
});

it('creates product with multipart form data fields', function () {
    $response = $this->actingAs($this->admin)
        ->withHeaders([
            'X-Inertia' => 'true',
            'X-Requested-With' => 'XMLHttpRequest',
        ])
        ->post('/admin/products', [
            'name' => 'Basic Card',
            'price' => '250',
            'is_active' => '1',
            'is_featured' => '0',
        ]);

    $response->assertRedirect(route('products.index'));
});
