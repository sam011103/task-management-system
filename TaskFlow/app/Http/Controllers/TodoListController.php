<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\TodoList;
use App\Models\Task;
use App\Services\PriorityService;

class TodoListController extends Controller
{
    public function index()
    {
        $list = TodoList::with(['tasks' => function ($query) {
            $query->orderBy('list_task.order');
        }])->where('user_id', auth()->id())
            ->where('date', today())
            ->first();

        // dd($list);
        return Inertia::render('todo-list/index', [
            'list' => $list
        ]);
    }

    // public function show(TodoList $priorityTodoList)
    // {
    //     return Inertia::render('priority-lists/show', [
    //         'list' => $priorityTodoList->load('items.task')
    //     ]);
    // }

    public function store(Request $request, PriorityService $priorityService)
    {
        // dd($request->all());
        $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'exists:tasks,id',
        ]);

        $user_id = auth()->id();

        $list = TodoList::with('tasks')->firstOrCreate(
            [
                'user_id' => auth()->id(),
                'date'    => today(),
            ]
        );
        // if($list && $list->task_count > 0) //check whether today list already has any tasks
        // {
        //     if(!$request->confirm)
        //     {
        //          return redirect()
        //             ->back()
        //             ->with('showDialog', true);
        //     }
        //     $list->delete();
        //     $list = new TodoList;
        //     $list->user_id = auth()->id();
        //     $list->date = now()->toDateString();
        //     $list->save();
        // }
        // elseif(!$list)
        // {
        //     $list = new TodoList;
        //     $list->user_id = auth()->id();
        //     $list->date = now()->toDateString();
        //     $list->save();
        // }

        $listId = $list->id;
        
        $ids = $request->ids;
        foreach($ids as $id)
        {
            $list->tasks()->attach($id);
        }

        $tasks = $list->tasks()->orderBy('created_at')->get();
        if($request->prioritize)
        {
            foreach($tasks as $task)
            {
                $score = $priorityService->calculate($task);
                $list->tasks()->updateExistingPivot($task->id, ['priority_score' => $score]);
            }
            $tasks = $list->tasks()->orderByDesc('priority_score')->get();
        }
        // else
        // {
        //     foreach($unorderedTasks as $t)
        //     {
        //         $list->tasks()->attach($id);
        //     }
        //     $tasks = $list->tasks()->orderBy('created_at')->get();
        // }

        foreach($tasks as $key => $task)
        {
            $list->tasks()->updateExistingPivot($task->id, ['order' => $key + 1]);
        }

        $list->task_count = $list->tasks()->count();
        $list->status = 1; //tasks added to list
        $list->save();

        return redirect()->route('todoListIndex');
    }

    public function removeTask(Task $task)
    {
        $list = TodoList::where('user_id', auth()->id())
            ->where('date', now()->toDateString())
            ->with('tasks') // eager load tasks + pivot
            ->first();
    
        if (!$list) {
            return redirect()
                ->back()
                ->with('error', 'List not found.');
        }
    
        // get the pivoted task from the list (so pivot is available)
        $pivotedTask = $list->tasks->firstWhere('id', $task->id);
    
        if (!$pivotedTask) {
            return redirect()
                ->back()
                ->with('error', 'Task not found in the list.');
        }
    
        $deletedTaskOrder = $pivotedTask->pivot->order;
    
        // detach the task
        $list->tasks()->detach($task->id);
    
        // shift orders down
        $tasks = $list->tasks()
            ->wherePivot('order', '>', $deletedTaskOrder)
            ->get();
    
        foreach ($tasks as $t) {
            $t->pivot->order = $t->pivot->order - 1;
            $t->pivot->save();
        }

        $list->task_count = $list->tasks()->count();

        if($list->task_count === 0)
        {
            $list->status = 0; //empty
        }
        elseif($list->completed_count === $list->task_count)
        {
            $list->status = 2; //completed
        }

        $list->save();
    
        return redirect()
            ->back()
            ->with('success', 'Task removed successfully.');
    }
}    
