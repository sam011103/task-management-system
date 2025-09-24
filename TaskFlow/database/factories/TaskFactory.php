<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence,
            'description' => $this->faker->optional()->paragraph,
            'time_estimate' => 150,
            'time_remaining' => 150,
            'importance_level' => $this->faker->randomElement(['very low', 'low', 'medium', 'high', 'very high']),
            'due_at' => $this->faker->optional()->dateTimeBetween('now', '+1 month'),
            'status' => 'not started',
            'progress' => 0,
            'user_id' => \App\Models\User::factory(), // assuming you have a User factory
        ];
    }
}
