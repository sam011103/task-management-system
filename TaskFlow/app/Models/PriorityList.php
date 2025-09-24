<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\PriorityItem;

class PriorityList extends Model
{
    /** @use HasFactory<\Database\Factories\PriorityListFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'task_id'
    ];

    public function items()
    {
        return $this->hasMany(PriorityItem::class)->orderBy('order');
    }
}
