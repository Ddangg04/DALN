<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('course_id')->nullable();
            $table->string('day_of_week', 20)->nullable(); // e.g. Monday, Saturday
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->string('room')->nullable();
            $table->string('building')->nullable();
            $table->timestamps();

            // nếu bạn có bảng courses, uncomment FK sau:
            // $table->foreign('course_id')->references('id')->on('courses')->cascadeOnDelete();
        });
    }

    public function down()
    {
        Schema::dropIfExists('schedules');
    }
};
