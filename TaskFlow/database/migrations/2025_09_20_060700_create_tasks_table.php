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
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->integer('time_estimate'); // in minutes
            $table->integer('time_remaining');
            $table->enum('importance_level', ['very low', 'low', 'medium', 'high', 'very high']);
            $table->timestamp('due_at')->nullable();
            $table->enum('status', ['not started', 'in progress', 'urgent', 'in time', 'overdue', 'late'])->default('not started');
            $table->boolean('is_urgent')->default(false);
            $table->boolean('is_overdue')->default(false);
            $table->timestamp('complete_at')->nullable();
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
