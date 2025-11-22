<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('courses', function (Blueprint $table) {

            if (!Schema::hasColumn('courses', 'description')) {
                $table->text('description')->nullable();
            }

            if (!Schema::hasColumn('courses', 'type')) {
                $table->string('type')->nullable()->comment('required|elective');
            }

            if (!Schema::hasColumn('courses', 'is_active')) {
                $table->boolean('is_active')->default(true);
            }

            if (!Schema::hasColumn('courses', 'max_students')) {
                $table->integer('max_students')->nullable();
            }

            if (!Schema::hasColumn('courses', 'semester')) {
                $table->string('semester')->nullable(); // ví dụ: Spring, Fall
            }

            if (!Schema::hasColumn('courses', 'year')) {
                $table->integer('year')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            if (Schema::hasColumn('courses', 'description')) $table->dropColumn('description');
            if (Schema::hasColumn('courses', 'type')) $table->dropColumn('type');
            if (Schema::hasColumn('courses', 'is_active')) $table->dropColumn('is_active');
            if (Schema::hasColumn('courses', 'max_students')) $table->dropColumn('max_students');
            if (Schema::hasColumn('courses', 'semester')) $table->dropColumn('semester');
            if (Schema::hasColumn('courses', 'year')) $table->dropColumn('year');
        });
    }
};
