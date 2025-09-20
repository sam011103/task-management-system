<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Task;

class TaskController extends Controller
{
    public function index()
    {
        $tasks = Task::all();
        return Inertia::render('tasks/index',[
            'tasks' => $tasks
        ]);
    }

    public function create()
    {
        return Inertia::render('tasks/create');
    }

    public function store(Request $request)
    {
        // dd($request->all());
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'time_estimate' => 'required|numeric|min:0',
            'priority' => 'required|in:very low,low,medium,high,very high',
            'due_date' => 'nullable|date',
            'due_time' => 'nullable|date_format:H:i'
        ]);

        Task::create($request->all());

        return redirect()->route('tasksIndex')->with('success', 'Task created successfully.');
    }

    public function edit(Task $task)
    {
        return Inertia::render('tasks/edit', [
            'task' => $task
        ]);
    }

    public function update(Task $task)
    {
        // dd(request()->all());
        request()->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'time_estimate' => 'required|numeric|min:0',
            'priority' => 'required|in:very low,low,medium,high,very high',
            'due_date' => 'nullable|date',
            'due_time' => 'nullable|date_format:H:i',
            'progress' => 'required|integer|min:0|max:100'
        ]);

        $task->update(request()->all());
        
        if($task->progress == 100) {
            $task->status = 'completed';
            $task->save();
        } elseif ($task->progress > 0) {
            $task->status = 'in progress';
            $task->save();
        } else {
            $task->status = 'not started';
            $task->save();
        }

        return redirect()->route('tasksIndex')->with('success', 'Task updated successfully.');
    }
}
