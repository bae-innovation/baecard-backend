<?php

namespace Database\Factories;

use App\Models\CustomerProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CustomerProfile>
 */
class CustomerProfileFactory extends Factory
{
    protected $model = CustomerProfile::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'personal_email' => fake()->safeEmail(),
            'personal_phone_code' => '+880',
            'personal_phone' => fake()->numerify('17########'),
            'bio' => fake()->optional()->sentence(),
            'company' => fake()->optional()->company(),
            'designation' => fake()->optional()->jobTitle(),
            'social_links' => [],
            'active_template' => 1,
        ];
    }
}
