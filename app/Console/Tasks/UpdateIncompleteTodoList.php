<?php

namespace App\Console\Tasks;
use App\Models\TodoList;
use App\Notifications\IncompleteTodoList;

class UpdateIncompleteTodoList
{
    public function __invoke()
    {
        $incompleteLists = TodoList::whereNot("status", 2) //incomplete
                                    ->whereDate('date', '<', today()) //past date
                                    ->get();

        if($incompleteLists->isEmpty())
        {
            return;
        }

        foreach ($incompleteLists as $list)
        {
            $user = $list->user;
            $list->status = -1; //incomplete and past date
            $list->save();
            $user->notify(new IncompleteTodoList($list));
        }                    
    }
}
