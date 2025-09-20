<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->double('time_estimate'); // in hours
            $table->enum('priority', ['very low', 'low', 'medium', 'high', 'very high']);
            $table->date('due_date')->nullable();
            $table->time('due_time')->nullable();
            $table->enum('status', ['not started', 'in progress', 'completed'])->default('not started');
            $table->integer('progress')->default(0); // progress percentage
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
