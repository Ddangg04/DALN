<?php
// ============================================
// 1. MIGRATION - Thêm đầy đủ columns cho bảng courses
// ============================================
// database/migrations/xxxx_add_full_columns_to_courses_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('courses', function (Blueprint $table) {
            // Kiểm tra và thêm các cột nếu chưa có
            if (!Schema::hasColumn('courses', 'semester')) {
                $table->string('semester', 20)->nullable()->after('max_students');
            }
            if (!Schema::hasColumn('courses', 'year')) {
                $table->integer('year')->nullable()->after('semester');
            }
            if (!Schema::hasColumn('courses', 'tuition')) {
                $table->decimal('tuition', 12, 2)->nullable()->after('year');
            }
            if (!Schema::hasColumn('courses', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('tuition');
            }
        });
    }

    public function down()
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->dropColumn(['semester', 'year', 'tuition', 'is_active']);
        });
    }
};