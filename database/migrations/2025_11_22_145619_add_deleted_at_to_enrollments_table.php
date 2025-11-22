<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('enrollments', function (Blueprint $table) {
            if (!Schema::hasColumn('enrollments', 'deleted_at')) {
                $table->softDeletes(); // tạo cột deleted_at nullable
            }
        });
    }

    public function down()
    {
        Schema::table('enrollments', function (Blueprint $table) {
            if (Schema::hasColumn('enrollments', 'deleted_at')) {
                $table->dropColumn('deleted_at');
            }
        });
    }
};
