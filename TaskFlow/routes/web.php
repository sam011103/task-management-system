<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TodoListController;
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

    Route::get('/todo-list', [TodoListController::class, 'index'])->name('todoListIndex');
    // Route::get('/priorityLists/{priorityList}', [ListController::class, 'show'])->name('priorityListsShow');
    Route::post('/todo-list', [TodoListController::class, 'store'])->name('todoListCreate');

    Route::delete('/todo-list/{task}', [TodoListController::class, 'removeTask'])->name('taskRemoveFromList');
   
    Route::get('/performance', function () {
        return Inertia::render('performance');
    })->name('performance');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
