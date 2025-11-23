<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClassSectionsTable extends Migration
{
    public function up()
    {
        Schema::create('class_sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained()->onDelete('cascade');
            $table->foreignId('teacher_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('name')->nullable(); // ví dụ: A, B, S1
            $table->integer('max_students')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('class_sections');
    }
}
