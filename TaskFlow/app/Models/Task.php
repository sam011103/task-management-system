<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Task extends Model
{
    use HasFactory;

    protected $casts = [
        'due_at' => 'datetime',
        'complete_at' => 'datetime',
    ];
    
    protected $fillable = [
        'title',
        'description',
        'time_estimate',
        'time_remaining',
        'importance_level',
        'due_at',
        'status',
        'progress',
        'complete_at',
        'user_id',
    ];

    protected $appends = [
        'status_formatted', 
        'importance_level_formatted', 
        'time_estimate_formatted', 
        'due_at_formatted', 
        'due_date', 
        'due_time', 
        'hour_estimate', 
        'minute_estimate',
        'time_remaining_formatted',
        'complete_at_formatted'
    ];

    public function getStatusFormattedAttribute()
    {
        $value = $this->attributes['status'] ?? null;
        return ucwords($value);
    }

    public function getImportanceLevelFormattedAttribute()
    {
        $value = $this->attributes['importance_level'] ?? null;
        return ucwords($value);
    }

    public function getTimeEstimateFormattedAttribute()
    {
        $value = $this->attributes['time_estimate'] ?? null;

        if($value === 0)
            return '0 min';

        $hours = floor($value / 60);
        $minutes = $value % 60;
        $result = '';

        if ($hours > 0) {
            $result .= $hours . ($hours > 1 ? ' hrs ' : ' hr ');
        }

        if ($minutes > 0) {
            $result .= $minutes . ($minutes > 1 ? ' mins' : ' min');
        }
        return $result;
    }

    public function getDueAtFormattedAttribute()
    {
        $value = $this->attributes['due_at'] ?? null;
        return $value ? date('d M Y, h:i a', strtotime($value)) : '-';
    }

    public function getCompleteAtFormattedAttribute()
    {
        $value = $this->attributes['complete_at'] ?? null;
        return $value ? date('d M Y, h:i a', strtotime($value)): '-';
    }

    public function getDueDateAttribute()
    {
        $value = $this->attributes['due_at'] ?? null;
        return $value ? \Carbon\Carbon::parse($value)->format('Y-m-d') : null;
    }

    public function getDueTimeAttribute()
    {
        $value = $this->attributes['due_at'] ?? null;
        return $value ? \Carbon\Carbon::parse($value)->format('H:i') : null;
    }

    public function getHourEstimateAttribute()
    {
        $value = $this->attributes['time_estimate'] ?? null;
        $hours = floor($value / 60);
        return $hours;
    }

    public function getMinuteEstimateAttribute()
    {
        $value = $this->attributes['time_estimate'] ?? null;
        $minute = $value % 60;
        return $minute;
    }

    public function getTimeRemainingFormattedAttribute()
    {
        $value = $this->attributes['time_remaining'] ?? null;

        if($value === 0)
            return '0 min';

        $hours = floor($value / 60);
        $minutes = $value % 60;
        $result = '';

        if ($hours > 0) {
            $result .= $hours . ($hours > 1 ? ' hrs ' : ' hr ');
        }

        if ($minutes > 0) {
            $result .= $minutes . ($minutes > 1 ? ' mins' : ' min');
        }
        return $result;
    }
    // public function getTimeRemaining

    // public function getDueTimeFormattedAttribute()
    // {
    //     $value = $this->attributes['due_at'];
    //     return $value ? date('h:i A', strtotime($value)) : '-';
    // }

}
