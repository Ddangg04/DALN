<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('grades', function (Blueprint $table) {

            if (!Schema::hasColumn('grades', 'class_session_id')) {
                $table->unsignedBigInteger('class_session_id')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('grades', function (Blueprint $table) {
            if (Schema::hasColumn('grades', 'class_session_id')) {
                $table->dropColumn('class_session_id');
            }
        });
    }
};
