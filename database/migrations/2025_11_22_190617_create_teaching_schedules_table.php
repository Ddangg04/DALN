<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('teaching_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->foreignId('class_session_id')->nullable()->constrained('class_sessions')->onDelete('set null');
            $table->string('day_of_week');
            $table->time('start_time');
            $table->time('end_time');
            $table->string('room');
            $table->string('building')->nullable();
            $table->string('semester');
            $table->year('year');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('teaching_schedules');
    }
};
