<?php

namespace App\Services;

use App\Models\PriorityItem;

class PriorityService
{
    /**
     * Calculate priority score for an item.
     */
    public function calculate(PriorityItem $item)
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

        $score += $weights[$item->task->importance_level] ?? 0;

        $score += $item->task->progress * 0.2;

        if ($item->task->due_date && $item->task->time_estimate) {
            $timeRemaining = $item->task->time_remaining;
            $timeLeft = now()->diffInMinutes($item->task->due_at, false); 
            
            if ($timeLeft < 0) {
                // overdue
                $score += 40;
            } elseif ($timeLeft < $timeRemaining) {
                // Not enough time left compared to what’s needed
                dd("Hi");
                $score += 25;
            }
        }

        $item->priority_score = $score;
        $item->save();
        return;
    }
}