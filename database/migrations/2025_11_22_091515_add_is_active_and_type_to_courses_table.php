<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            // thêm is_active nếu chưa có
            if (! Schema::hasColumn('courses', 'is_active')) {
                $table->boolean('is_active')->default(true);
            }

            // thêm type nếu chưa có (required | elective) — dùng nullable để an toàn
            if (! Schema::hasColumn('courses', 'type')) {
                // nếu MySQL cũ không thích enum, có thể dùng string
                $table->string('type')->nullable()->comment('required|elective');
            }
        });
    }

    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            if (Schema::hasColumn('courses', 'is_active')) {
                $table->dropColumn('is_active');
            }
            if (Schema::hasColumn('courses', 'type')) {
                $table->dropColumn('type');
            }
        });
    }
};
