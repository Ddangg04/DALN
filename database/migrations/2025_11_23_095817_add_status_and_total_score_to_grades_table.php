<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('grades', function (Blueprint $table) {

            // thêm status nếu chưa có
            if (!Schema::hasColumn('grades', 'status')) {
                $table->string('status', 50)->nullable();
            }

            // thêm total_score nếu chưa có
            if (!Schema::hasColumn('grades', 'total_score')) {
                $table->decimal('total_score', 8, 2)->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('grades', function (Blueprint $table) {
            if (Schema::hasColumn('grades', 'total_score')) {
                $table->dropColumn('total_score');
            }
            if (Schema::hasColumn('grades', 'status')) {
                $table->dropColumn('status');
            }
        });
    }
};
