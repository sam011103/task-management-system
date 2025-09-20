<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TaskController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/tasks', [TaskController::class, 'index'])->name('tasksIndex');
    Route::get('/tasks/create', [TaskController::class, 'create'])->name('tasksCreate');
    Route::post('/tasks', [TaskController::class, 'store'])->name('tasksStore');
    Route::get('/tasks/{task}/edit', [TaskController::class, 'edit'])->name('tasksEdit');
    Route::put('/tasks/{task}', [TaskController::class, 'update'])->name('tasksUpdate');

    Route::get('/performance', function () {
        return Inertia::render('performance');
    })->name('performance');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
