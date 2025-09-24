<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Task;
use App\Models\PriorityList;

class PriorityItem extends Model
{
    public function task()
    {
        return $this->belongsTo(Task::class);
    }

    public function list()
    {
        return $this->belongsTo(PriorityList::class, 'priority_list_id');
    }
}
