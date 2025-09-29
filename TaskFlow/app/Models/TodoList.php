<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Task;

class TodoList extends Model
{
    /** @use HasFactory<\Database\Factories\TodoListFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'task_id',
        'date'
    ];

    public function tasks()
    {
        return $this->belongsToMany(Task::class, 'list_task', 'list_id', 'task_id')
            ->withPivot('order', 'priority_score')
            ->withTimestamps();
            // ->orderBy('pivot_order');
    }
}
