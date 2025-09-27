<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Task;

class TaskController extends Controller
{
    public function index()
    {
        $userId = auth()->id();
        $tasks = Task::latest()->where('user_id', $userId)->get();
        return Inertia::render('tasks/index',[
            'tasks' => $tasks
        ]);
    }

    public function dashboard()
    {
        $userId = auth()->id();
        $stats['completed'] = Task::where('user_id', $userId)->whereIn('status', ['in time', 'late'])->count();
        $stats['incomplete'] = Task::where('user_id', $userId)->whereNotIn('status', ['in time', 'late'])->count();
        $stats['urgent'] = Task::where('user_id', $userId)->where('status', 'urgent')->count();
        $stats['overdue'] = Task::where('user_id', $userId)->where('status', 'overdue')->count();

        //chart stats
        $taskStats = Task::where('user_id', $userId)
            ->selectRaw('status, COUNT(*) as tasks')
            ->groupBy('status')
            ->pluck('tasks', 'status');

        $chartData = [];

        //chart colors
        $statuses = [
            'not started' => '#9CA3AF', // gray → neutral
            'in progress' => '#3B82F6', // blue → active
            'urgent'      => '#F59E0B', // amber → warning
            'overdue'     => '#EF4444', // red → danger
            'in time'     => '#10B981', // green → success
            'late'        => '#7C3AED', // purple → delayed but still tracked
        ];

        $chartData = collect($statuses)->map(function ($color, $status) use ($taskStats) {
            return [
                'status' => $status,
                'tasks'  => $taskStats[$status] ?? 0,   // use count or 0
                'fill'   => $color,
            ];
        })->values();

        //upcoming deadlines
        $deadlines = Task::where('user_id', $userId)
            ->whereNotIn('status', ['in time', 'late'])
            ->whereNotNull('due_at')
            ->where('due_at', '>=', now())
            ->orderBy('due_at', 'asc')
            ->take(5)
            ->get(['title', 'due_at']);

        return Inertia::render('dashboard/index',[
            'stats' => $stats,
            'chartData' => $chartData,
            'deadlines' => $deadlines
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
            'hour_estimate' => 'required|numeric|min:0',
            'minute_estimate' => 'required|numeric|min:0',
            'importance_level' => 'required|in:very low,low,medium,high,very high',
            'due_date' => 'nullable|date',
            'due_time' => 'nullable|date_format:H:i'
        ]);

        //convert into minutes
        $time_estimate = $request->hour_estimate * 60 + $request->minute_estimate;
        $request->merge(['time_estimate' => $time_estimate]);

        //initialize time remaining same as time estimate
        $request->merge(['time_remaining' => $time_estimate]);

        //combine due_date and due_time into due_at
        if($request->due_date) {
            $due_at = $request->due_date;
            if($request->due_time) {
                $due_at .= ' ' . $request->due_time;
            } else {
                $due_at .= ' 23:59:59';
            }
            $request->merge(['due_at' => $due_at]);
        } else {
            $request->merge(['due_at' => null]);
        }
        //add user_id to the request
        $request->merge(['user_id' => auth()->id()]);

        $task = Task::create($request->all());

        if($task->progress === 100) 
        {
            $task->complete_at = now();
            if ($task->due_at) 
            { // check if due_at exists
                $task->status = $task->complete_at->greaterThan($task->due_at) ? 'late' : 'in time';
            } 
            else 
            {
                $task->status = 'in time'; // or whatever default
            }
        }
        elseif($task->due_at && now()->greaterThan($task->due_at))
        {
            $task->status = 'overdue';
        } 
        elseif($task->due_at && now()->greaterThan($task->due_at->copy()->subMinutes($task->time_remaining + 60)))
        {
            $task->status = 'urgent';
        }
        elseif ($task->progress > 0) 
        {
            $task->status = 'in progress';
        } 
        else 
        {
            $task->status = 'not started';
        }

        $task->save();

        return redirect()->route('tasksIndex')->with('success', 'Task created successfully.');
    }

    public function edit(Task $task)
    {
        return Inertia::render('tasks/edit', [
            'task' => $task
        ]);
    }

    public function update(Task $task, Request $request)
    {
        request()->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'hour_estimate' => 'required|numeric|min:0',
            'minute_estimate' => 'required|numeric|min:0',
            'importance_level' => 'required|in:very low,low,medium,high,very high',
            'due_date' => 'nullable|date',
            'due_time' => 'nullable|date_format:H:i',
            'progress' => 'required|integer|min:0|max:100'
        ]);

        //convert into minutes
        $time_estimate = $request->hour_estimate * 60 + $request->minute_estimate;
        $request->merge(['time_estimate' => $time_estimate]);

        //calculate time remaining
        $time_remaining = $task->time_remaining;
        $percentage = $request->progress / 100;
        $time_remaining = $time_estimate - $percentage * $time_estimate;
        $time_remaining = round($time_remaining);
        $request->merge(['time_remaining' => $time_remaining]);

        //combine due_date and due_time into due_at
        if($request->due_date) {
            $due_at = $request->due_date;
            if($request->due_time) {
                $due_at .= ' ' . $request->due_time;
            } else {
                $due_at .= ' 23:59:59';
            }
            $request->merge(['due_at' => $due_at]);
        } else {
            $request->merge(['due_at' => null]);
        }

        $task->update(request()->all());

        if($task->progress === 100) 
        {
            $task->complete_at = now();
            if ($task->due_at) 
            { // check if due_at exists
                $task->status = $task->complete_at->greaterThan($task->due_at) ? 'late' : 'in time';
            } 
            else 
            {
                $task->status = 'in time'; // or whatever default
            }
        }
        elseif($task->due_at && now()->greaterThan($task->due_at))
        {
            $task->status = 'overdue';
        } 
        elseif($task->due_at && now()->greaterThan($task->due_at->copy()->subMinutes($task->time_remaining + 60)))
        {
            $task->status = 'urgent';
        }
        elseif ($task->progress > 0) 
        {
            $task->status = 'in progress';
        } 
        else 
        {
            $task->status = 'not started';
        }

        $task->save();
        return redirect()->route('tasksIndex')->with('success', 'Task updated successfully.');
    }

    public function destroy(Task $task)
    {
        $task->delete();
        return redirect()->route('tasksIndex')->with('success', 'Task deleted successfully.');
    }
}
