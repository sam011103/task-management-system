<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\PriorityList;
use App\Models\PriorityItem;
use App\Services\PriorityService;

class PriorityListController extends Controller
{
    public function index()
    {
        $list = PriorityList::where('user_id', auth()->id())->first();

        if($list)
        {
            $list->load('items.task');
        }
        
        return Inertia::render('priority-list/index', [
            'list' => $list
        ]);
    }

    // public function show(PriorityList $priorityList)
    // {
    //     return Inertia::render('priority-lists/show', [
    //         'list' => $priorityList->load('items.task')
    //     ]);
    // }

    public function store(Request $request, PriorityService $priorityService)
    {
        $user_id = auth()->id();
        $list = PriorityList::where('user_id', $user_id)->first();

        if($list && $list->status == 0) //check whether user already create a list and the list is not completed yet
        {
            if(!$request->confirm)
            {
                 return redirect()
                    ->back()
                    ->with('showDialog', true);
            }
            $list->delete();
        }
            
        //create list and items
        $list = new PriorityList;
        $list->user_id = auth()->id();
        $list->save();

        $listId = $list->id;
        
        $ids = $request->ids;
        foreach($ids as $key => $id)
        {
            $item = new PriorityItem;
            // $item->priority_score = rand(0,100); //calculate priority score
            $item->priority_list_id = $listId;
            $item->task_id = $id;
            $item->save();
            $priorityService->calculate($item);
        }

        $items = PriorityItem::where('priority_list_id', $listId)->orderBy('priority_score', "desc")->get();

        foreach($items as $key => $item)
        {
            $item->order = $key + 1;
            $item->save();
        }

        return redirect()->route('priorityListIndex');
    }

    public function destroyItem(PriorityItem $item)
    {
        $itemDeletedOrder = $item->order;
        $list = $item->list;
        $item->delete();

        //reorder list item
        $items = $list->items;
        foreach($items as $item)
        {
            if($item->order > $itemDeletedOrder)//order larger than the delete item will reduce by 1
            {
                $item->order --;
                $item->save();
            }
        }

        return redirect()
            ->back()
            ->with('success', 'Task removed successfully.');
    }
}
