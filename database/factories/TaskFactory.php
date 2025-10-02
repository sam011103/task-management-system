<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

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
        $time = $this->faker->numberBetween(30, 300);
        $progress = $this->faker->numberBetween(0, 100);
        $timeRemaining = $time - $progress/100 * $time;
        $timeRemaining = round($timeRemaining);

        $dueAt = $this->faker->optional()->dateTimeBetween('-1 month', '+1 month');
        if ($dueAt) {
            $dueAt = Carbon::instance($dueAt); // convert only if not null
        }

        $complete_at = null;
        if($progress === 100) 
        {
            $complete_at = now();
            if($dueAt)
            {
                $complete_at->greaterThan($dueAt) ? $status = 'late' : $status = 'in time';
            }
            else
            {
                $status = 'in time';
            }
           
        }
        elseif($dueAt && now()->greaterThan($dueAt))
        {
            $status = 'overdue';
        } 
        elseif($dueAt && now()->greaterThan($dueAt->copy()->subMinutes($timeRemaining + 60)))
        {
            $status = 'urgent';
        }
        elseif ($progress > 0) 
        {
            $status = 'in progress';
        } 
        else 
        {
            $status = 'not started';
        }

        return [
            'title' => ucfirst($this->faker->bs),
            'description' => $this->faker->optional()->paragraph,
            'time_estimate' => $time,
            'time_remaining' => $timeRemaining,
            'importance_level' => $this->faker->randomElement(['very low', 'low', 'medium', 'high', 'very high']),
            'due_at' => $dueAt,
            'status' => $status,
            'progress' => $progress,
            'user_id' => 1, // assuming you have a User factory
        ];
    }
}
