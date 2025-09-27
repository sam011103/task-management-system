<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\PriorityListController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [TaskController::class, 'dashboard'] )->name('dashboard');

    Route::get('/tasks', [TaskController::class, 'index'])->name('tasksIndex');
    Route::get('/tasks/create', [TaskController::class, 'create'])->name('tasksCreate');
    Route::post('/tasks', [TaskController::class, 'store'])->name('tasksStore');
    Route::get('/tasks/{task}/edit', [TaskController::class, 'edit'])->name('tasksEdit');
    Route::put('/tasks/{task}', [TaskController::class, 'update'])->name('tasksUpdate');
    Route::delete('/tasks/{task}', [TaskController::class, 'destroy'])->name('tasksDestroy');

    Route::get('/priorityList', [PriorityListController::class, 'index'])->name('priorityListIndex');
    // Route::get('/priorityLists/{priorityList}', [PriorityListController::class, 'show'])->name('priorityListsShow');
    Route::post('/priorityList', [PriorityListController::class, 'store'])->name('priorityListCreate');

    Route::delete('/priorityList/item/{item}', [PriorityListController::class, 'destroyItem'])->name('PriorityItemDestroy');
   
    Route::get('/performance', function () {
        return Inertia::render('performance');
    })->name('performance');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
