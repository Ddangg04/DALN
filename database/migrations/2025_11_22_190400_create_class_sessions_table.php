<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('class_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->foreignId('teacher_id')->constrained('users')->onDelete('cascade');
            $table->string('class_code')->unique(); // Mã lớp: CS101-01
            $table->string('semester'); // Fall, Spring, Summer
            $table->year('year');
            $table->integer('max_students')->default(50);
            $table->integer('enrolled_count')->default(0);
            $table->enum('status', ['open', 'closed', 'in_progress', 'completed'])->default('open');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('class_sessions');
    }
};
