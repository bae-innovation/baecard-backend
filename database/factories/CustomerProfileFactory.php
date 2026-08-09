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
            'bio' => fake()->optional()->paragraph(),
            'job_title' => fake()->optional()->jobTitle(),
            'company' => fake()->optional()->company(),
            'active_template' => 1,
            'profile_visibility' => null,
            'template_settings' => null,
        ];
    }
}
