<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('enrollments', function (Blueprint $table) {
            if (!Schema::hasColumn('enrollments', 'total_score')) {
                $table->integer('total_score')->nullable()->after('final_score');
            }

            if (!Schema::hasColumn('enrollments', 'grade')) {
                $table->string('grade', 5)->nullable()->after('total_score');
            }
        });
    }

    public function down()
    {
        Schema::table('enrollments', function (Blueprint $table) {
            if (Schema::hasColumn('enrollments', 'total_score')) {
                $table->dropColumn('total_score');
            }
            if (Schema::hasColumn('enrollments', 'grade')) {
                $table->dropColumn('grade');
            }
        });
    }
};
