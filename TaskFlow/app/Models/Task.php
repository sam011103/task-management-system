<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = [
        'title',
        'description',
        'time_estimate',
        'priority',
        'due_date',
        'due_time',
        'status',
        'progress'
    ];

    protected $appends = ['status_formatted', 'priority_formatted', 'time_estimate_formatted', 'due_date_formatted', 'due_time_formatted'];

    public function getStatusFormattedAttribute()
    {
        $value = $this->attributes['status'];
        return ucwords($value);
    }

    public function getPriorityFormattedAttribute()
    {
        $value = $this->attributes['priority'];
        return ucwords($value);
    }

    public function getTimeEstimateFormattedAttribute()
    {
        $value = $this->attributes['time_estimate'];

        return number_format($value, 1) . ($value > 1 ? ' hrs' : ' hr');
    }

    public function getDueDateFormattedAttribute()
    {
        $value = $this->attributes['due_date'];
        return $value ? date('d M Y', strtotime($value)) : '-';
    }

    public function getDueTimeAttribute($value)
    {
        return $value ? \Carbon\Carbon::parse($value)->format('H:i') : null;
    }

    public function getDueTimeFormattedAttribute()
    {
        $value = $this->attributes['due_time'];
        return $value ? date('h:i A', strtotime($value)) : '-';
    }

}
