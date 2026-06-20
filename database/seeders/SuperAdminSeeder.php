<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $superAdmin = User::firstOrCreate(
            ['email' => 'superadmin@example.com'],
            [
                'name' => 'Super Admin',
                'email' => 'superadmin@example.com',
                'password' => Hash::make('12345678'),
                'phone' => '1234567890',
                'email_verified_at' => now(),
            ]
        );

        $superAdmin->assignRole('SuperAdmin');

        $this->command->info('Super Admin user seeded successfully.');
    }
}
