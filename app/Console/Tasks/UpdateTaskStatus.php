<?php

namespace App\Console\Tasks;
use App\Models\Task;
use App\Notifications\TaskStatusUpdated;
use App\Events\TaskEvent;

class UpdateTaskStatus
{
    public function __invoke()
    {
        $overdueTasks = Task::where("status", "urgent")
                            ->whereNotNull("due_at")
                            ->where("due_at", "<=", now())
                            ->get();    

        $urgentTasks = Task::whereIn("status", ["not started", "in progress"])
                            ->whereNotNull("due_at")
                            ->whereRaw("due_at <= DATE_ADD(NOW(), INTERVAL (time_remaining + 60) MINUTE)")
                            ->get();

        //merge tasks
        $tasks = $overdueTasks->merge($urgentTasks);
        if($tasks->isEmpty())
        {
            return;
        }

        //update tasks
        foreach ($tasks as $task) 
        {
            if($task->status === "urgent")
            {
                $task->status = "overdue";
                $task->save();
            }
            else
            {
                $task->status = "urgent";
                $task->save();
            }
                
            //send notification to user
            $user = $task->user;
            $user->notify(new TaskStatusUpdated($task));
            event(new TaskEvent($task));
        }
    }
}