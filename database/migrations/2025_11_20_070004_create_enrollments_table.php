<?php
// ============================================
// 1. MIGRATION - Enrollments (Đăng ký học phần)
// ============================================
// php artisan make:migration create_enrollments_table

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->enum('status', ['pending', 'approved', 'rejected', 'dropped'])->default('pending');
            $table->decimal('midterm_score', 4, 2)->nullable();
            $table->decimal('final_score', 4, 2)->nullable();
            $table->decimal('total_score', 4, 2)->nullable();
            $table->string('grade', 2)->nullable(); // A+, A, B+, B, C+, C, D+, D, F
            $table->timestamps();
            $table->softDeletes();
            
            // Unique: student không thể đăng ký 1 course 2 lần
            $table->unique(['student_id', 'course_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('enrollments');
    }
};