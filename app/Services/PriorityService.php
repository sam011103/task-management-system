<?php

namespace App\Services;

use App\Models\Task;

class PriorityService
{
    /**
     * Calculate priority score for an item.
     */
    public function calculate(Task $task)
    {
        $score = 0;

        // Example logic
        $weights = [
            'very high' => 70,
            'high'      => 50,
            'medium'    => 30,
            'low'       => 10,
            'very low'  => 0,
        ];

        $score += $weights[$task->importance_level] ?? 0;

        $score += $task->progress * 0.2;

        if ($task->due_date && $task->time_estimate) {
            $timeRemaining = $task->time_remaining;
            $timeLeft = now()->diffInMinutes($task->due_at, false); 
            
            if ($timeLeft < 0) {
                // overdue
                $score += 40;
            } elseif ($timeLeft < $timeRemaining) {
                // Not enough time left compared to what’s needed
                dd("Hi");
                $score += 25;
            }
        }

        return $score;
    }
}