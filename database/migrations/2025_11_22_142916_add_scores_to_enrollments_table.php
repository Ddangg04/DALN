<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('enrollments', function (Blueprint $table) {
            if (!Schema::hasColumn('enrollments', 'midterm_score')) {
                $table->integer('midterm_score')->nullable()->after('status');
            }
            if (!Schema::hasColumn('enrollments', 'final_score')) {
                $table->integer('final_score')->nullable()->after('midterm_score');
            }
        });
    }

    public function down()
    {
        Schema::table('enrollments', function (Blueprint $table) {
            if (Schema::hasColumn('enrollments', 'midterm_score')) {
                $table->dropColumn('midterm_score');
            }
            if (Schema::hasColumn('enrollments', 'final_score')) {
                $table->dropColumn('final_score');
            }
        });
    }
};
